#!/usr/bin/env python3
#!/usr/bin/env python3
"""
fan_curve_plot.py - Simulator fuer die Rack-Monitor-Lueftersteuerung
====================================================================
Prinzip "Single Source of Truth":
Die Regelungslogik wird NICHT in Python nachgebaut. Stattdessen wird
die C++-Lambda direkt aus rack-monitor.yaml extrahiert, in einen
Test-Harness eingebettet, mit g++ kompiliert und via ctypes aufgerufen.
Aendert sich das YAML, aendert sich der Plot automatisch mit.

Simulierte Logik (Variante C - Hybrid):
  Primaer:   Delta-T-Regelung (Ein >= 4 K, Aus < 3 K, 20-100 % @ 4-12 K)
  Fallback:  Absolutkurve bei totem Zuluftsensor (28-38 C)
  Override:  >= 38 C absolut -> 100 %

Nutzung:  python3 fan_curve_plot.py [pfad/zu/rack-monitor.yaml]
Ausgabe:  fan_curve.png
Benoetigt: g++, PyYAML, matplotlib, numpy
"""

import ctypes
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

import numpy as np
import yaml
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

YAML_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("esphome/rack-monitor.yaml")
PNG_PATH = Path("analysis/temperature-control-algo/fan_curve.png")

# ----------------------------------------------------------------------
# 1. Lambda aus dem YAML extrahieren
# ----------------------------------------------------------------------

class EsphomeLoader(yaml.SafeLoader):
    """SafeLoader, der ESPHome-Tags (!secret, !include, ...) toleriert."""

EsphomeLoader.add_multi_constructor("!", lambda loader, suffix, node: None)


def extract_control_lambda(yaml_path: Path) -> str:
    """Findet die Regelungs-Lambda im interval-Block (Kennung: make_call)."""
    config = yaml.load(yaml_path.read_text(encoding="utf-8"), Loader=EsphomeLoader)
    for entry in config.get("interval", []):
        for action in entry.get("then", []):
            code = action.get("lambda") if isinstance(action, dict) else None
            if code and "make_call" in code:
                return code
    raise RuntimeError("Regelungs-Lambda (make_call) nicht im interval-Block gefunden")


# ----------------------------------------------------------------------
# 2. C++-Harness: stellt die ESPHome-Umgebung der Lambda nach
# ----------------------------------------------------------------------

HARNESS = r"""
#include <cmath>
#include <initializer_list>
using std::isnan;

template <typename T>
static T clamp(T v, T lo, T hi) { return v < lo ? lo : (v > hi ? hi : v); }

struct Sensor { float state; };
struct Switch { bool  state; };

struct Fan;
struct FanCall {
    Fan *fan;
    bool has_state = false, state = false;
    bool has_speed = false;  int  speed = 0;
    FanCall &set_state(bool s) { has_state = true; state = s; return *this; }
    FanCall &set_speed(int  s) { has_speed = true; speed = s; return *this; }
    void perform();
};
struct Fan {
    bool state = false;
    int  speed = 0;
    FanCall make_call() { FanCall c; c.fan = this; return c; }
};
void FanCall::perform() {
    if (has_state) fan->state = state;
    if (has_speed) fan->speed = speed;
}

// Nachbildung der im YAML referenzierten IDs
static Sensor rack_temp_1, rack_temp_2, intake_temp;
static Switch auto_mode;
static bool   auto_writing = false;
static Fan    fan1_obj, fan2_obj;
static Fan   *fan1 = &fan1_obj, *fan2 = &fan2_obj;

#define id(x) (x)

// --- Original-Lambda aus rack-monitor.yaml (unveraendert eingefuegt) ---
static void run_control() {
{LAMBDA_BODY}
}
// -----------------------------------------------------------------------

extern "C" void simulate(float t1, float t2, float tin, int auto_on,
                         float *pwm_out, int *on_out) {
    rack_temp_1.state = t1;
    rack_temp_2.state = t2;
    intake_temp.state = tin;
    auto_mode.state   = auto_on != 0;
    run_control();
    *on_out  = fan1_obj.state ? 1 : 0;
    *pwm_out = fan1_obj.state ? fan1_obj.speed / 100.0f : 0.0f;
}
"""


def compile_lambda(lambda_code: str, build_dir: Path) -> Path:
    body = "\n".join("    " + line for line in lambda_code.splitlines())
    src = build_dir / "harness.cpp"
    src.write_text(HARNESS.replace("{LAMBDA_BODY}", body), encoding="utf-8")
    lib = build_dir / "control.so"
    subprocess.run(
        ["g++", "-shared", "-fPIC", "-O2", "-o", str(lib), str(src)],
        check=True,
    )
    return lib


class Controller:
    """Eine isolierte Instanz der Regelung (eigener Hysterese-Zustand).

    Der Hysterese-Zustand lebt als static-Variable in der Lambda. Fuer
    unabhaengige Szenarien wird die .so daher jeweils als eigene Kopie
    geladen (frischer Zustand pro Instanz).
    """

    _counter = 0

    def __init__(self, lib_path: Path):
        Controller._counter += 1
        copy = lib_path.with_name(f"control_{Controller._counter}.so")
        shutil.copy(lib_path, copy)
        self._lib = ctypes.CDLL(str(copy))
        self._lib.simulate.argtypes = [
            ctypes.c_float, ctypes.c_float, ctypes.c_float, ctypes.c_int,
            ctypes.POINTER(ctypes.c_float), ctypes.POINTER(ctypes.c_int),
        ]

    def step(self, t1, t2, tin, auto_on=True):
        pwm = ctypes.c_float()
        on = ctypes.c_int()
        self._lib.simulate(t1, t2, tin, int(auto_on),
                           ctypes.byref(pwm), ctypes.byref(on))
        return pwm.value, bool(on.value)


# ----------------------------------------------------------------------
# 3. Szenarien und Plot
# ----------------------------------------------------------------------

def sweep(ctrl, rack_values, tin):
    """Fuehrt die Regelung sequenziell aus (Hysterese-Zustand bleibt erhalten)."""
    return np.array([ctrl.step(r, r - 0.5, tin)[0] * 100 for r in rack_values])


def main():
    lambda_code = extract_control_lambda(YAML_PATH)
    build_dir = Path(tempfile.mkdtemp(prefix="fan_sim_"))
    lib = compile_lambda(lambda_code, build_dir)
    print(f"Lambda extrahiert ({len(lambda_code.splitlines())} Zeilen), kompiliert: {lib}")

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
    nan = float("nan")

    # --- Szenario A: Delta-T-Regelung (Zuluft 22 C), Hysterese sichtbar ---
    tin = 22.0
    dt_up = np.arange(0.0, 14.01, 0.01)
    dt_dn = dt_up[::-1]
    c = Controller(lib)  # eine Instanz: erst hoch, dann runter (Hysterese)
    up = sweep(c, tin + dt_up, tin)
    dn = sweep(c, tin + dt_dn, tin)
    ax1.plot(dt_up, up, label="steigend (Ein ≥ 4 K)", color="tab:red")
    ax1.plot(dt_dn, dn, "--", label="fallend (Aus < 3 K)", color="tab:blue")

    # Override-Demo: warme Zuluft (34 C) -> 38-C-Grenze greift schon bei ΔT = 4 K
    c2 = Controller(lib)
    ov = sweep(c2, 34.0 + dt_up, 34.0)
    ax1.plot(dt_up, ov, ":", label="Zuluft 34 °C (Override ab 38 °C abs.)",
             color="tab:orange")

    ax1.set_title("Primär: ΔT-Regelung")
    ax1.set_xlabel("ΔT = max(Rack) − Zuluft [K]")

    # --- Szenario B: Fallback-Absolutkurve (Zuluftsensor = NaN) ---
    t_up = np.arange(24.0, 42.01, 0.01)
    t_dn = t_up[::-1]
    cf = Controller(lib)
    f_up = sweep(cf, t_up, nan)
    f_dn = sweep(cf, t_dn, nan)
    ax2.plot(t_up, f_up, label="steigend (Ein ≥ 28 °C)", color="tab:red")
    ax2.plot(t_dn, f_dn, "--", label="fallend (Aus < 27 °C)", color="tab:blue")
    ax2.axvline(38, color="gray", lw=0.8, ls=":")
    ax2.text(38.2, 50, "Override 100 %", rotation=90, va="center", fontsize=8)

    ax2.set_title("Fallback: Absolutkurve (Zuluftsensor NaN)")
    ax2.set_xlabel("max(Rack Temp) [°C]")

    for ax in (ax1, ax2):
        ax.set_ylabel("PWM [%]")
        ax.set_ylim(-5, 105)
        ax.grid(True, alpha=0.3)
        ax.legend(fontsize=8)

    fig.suptitle("Rack-Monitor Lüfterkurve – simuliert aus der Original-YAML-Lambda")
    fig.tight_layout()
    fig.savefig(PNG_PATH, dpi=150)
    print(f"Plot gespeichert: {PNG_PATH.resolve()}")


if __name__ == "__main__":
    main()