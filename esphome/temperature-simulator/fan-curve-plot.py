#!/usr/bin/env python3
"""
fan_curve_plot.py
-----------------
Simuliert die Luefterkurve aus rack-monitor.yaml, indem der ORIGINAL-Lambda-
Code-Block zur Laufzeit als C++-Shared-Library kompiliert und ueber ctypes
aufgerufen wird. Keine Python-Reimplementation der Regel-Logik.

Workflow:
  1. YAML laden, lambda-String aus 'interval' extrahieren
  2. In ein C++-Shim einbetten, das die ESPHome-API mockt
  3. Mit g++ zu .so kompilieren
  4. ctypes laedt die Lib, sweep ueber Temperaturen, Plot

Abhaengigkeiten: PyYAML, numpy, matplotlib, ein C++17-Compiler (g++ oder clang++).
"""

from __future__ import annotations

import argparse
import ctypes
import shutil
import subprocess
import sys
import tempfile
import textwrap
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import yaml


# ============================================================================
# C++-Shim: mockt die ESPHome-API genau soweit wie das Lambda sie verwendet.
# Erweitern, sobald das Lambda neue ESPHome-Aufrufe nutzt.
# ============================================================================
SHIM_TEMPLATE = r"""
// Auto-generiert von fan_curve_plot.py - nicht von Hand editieren.
#include <math.h>   // isnan() als Makro im globalen Namespace
#include <cstddef>

extern "C" {

// ---- ESPHome-Mock-Typen ----------------------------------------------------
struct Sensor { float state; };
struct Switch { bool  state; };
struct Number { float state; };

struct Fan;
struct FanCall {
    Fan* target;
    int  op;          // 0 = turn_on, 1 = turn_off
    int  speed_pct;   // -1 = nicht gesetzt
    FanCall& set_speed(int s)   { speed_pct = s; return *this; }
    FanCall& set_speed(float f) { speed_pct = (int)(f * 100.0f); return *this; }
    void perform();
};

struct Fan {
    bool state;
    int  speed_pct;
    FanCall turn_on()  { return FanCall{this, 0, -1}; }
    FanCall turn_off() { return FanCall{this, 1,  0}; }
};

void FanCall::perform() {
    if (op == 0) {
        target->state = true;
        if (speed_pct >= 0) target->speed_pct = speed_pct;
    } else {
        target->state = false;
        target->speed_pct = 0;
    }
}

// ---- IDs aus der YAML ------------------------------------------------------
static Switch auto_mode;
static Sensor temp_zone1;
static Sensor temp_zone2;
static Number target_temp;
static Fan    fan1;
static Fan    fan2;

// id(x) in der YAML wird zu einem Referenz-Verweis auf die Mock-Instanz
#define id(x) (x)

// ---- Simulations-API (von Python aus aufgerufen) ---------------------------
void sim_set_inputs(int auto_on, float t1, float t2, float t_target,
                    int fan1_running, int fan1_pct,
                    int fan2_running, int fan2_pct) {
    auto_mode.state   = (auto_on != 0);
    temp_zone1.state  = t1;
    temp_zone2.state  = t2;
    target_temp.state = t_target;
    fan1.state        = (fan1_running != 0);
    fan1.speed_pct    = fan1_pct;
    fan2.state        = (fan2_running != 0);
    fan2.speed_pct    = fan2_pct;
}

int sim_get_fan1_state() { return fan1.state ? 1 : 0; }
int sim_get_fan1_pct()   { return fan1.speed_pct; }
int sim_get_fan2_state() { return fan2.state ? 1 : 0; }
int sim_get_fan2_pct()   { return fan2.speed_pct; }

// ---- Hier wird das ORIGINAL-Lambda eingebettet -----------------------------
void sim_run() {
    // ====== BEGIN ORIGINAL LAMBDA (aus YAML) ======
__LAMBDA_BODY__
    // ====== END ORIGINAL LAMBDA ==================
}

}  // extern "C"
"""


# ============================================================================
# YAML einlesen und Lambda-Block extrahieren
# ============================================================================
def extract_lambda(yaml_path: Path) -> str:
    """Findet den ersten 'lambda'-Eintrag innerhalb von 'interval'."""
    with yaml_path.open(encoding="utf-8") as f:
        data = yaml.safe_load(f)

    if not isinstance(data, dict) or "interval" not in data:
        raise SystemExit(f"Keine 'interval'-Sektion in {yaml_path} gefunden.")

    for entry in data["interval"]:
        for action in entry.get("then", []) or []:
            if isinstance(action, dict) and "lambda" in action:
                return action["lambda"]

    raise SystemExit(f"Keine 'lambda'-Action in 'interval' in {yaml_path} gefunden.")


# ============================================================================
# C++ generieren und kompilieren
# ============================================================================
def compile_lambda(lambda_body: str, build_dir: Path, verbose: bool = False) -> Path:
    indented = textwrap.indent(lambda_body.rstrip(), "    ")
    src_code = SHIM_TEMPLATE.replace("__LAMBDA_BODY__", indented)

    src = build_dir / "fan_curve_shim.cpp"
    so  = build_dir / "fan_curve_shim.so"
    src.write_text(src_code, encoding="utf-8")

    cxx = shutil.which("g++") or shutil.which("clang++")
    if cxx is None:
        raise SystemExit("Kein C++-Compiler gefunden. Bitte g++ oder clang++ installieren.")

    cmd = [cxx, "-O2", "-std=c++17", "-Wall", "-fPIC", "-shared",
           str(src), "-o", str(so)]
    proc = subprocess.run(cmd, capture_output=True, text=True)

    if proc.returncode != 0:
        print("Kompilierfehler:", file=sys.stderr)
        print(proc.stderr, file=sys.stderr)
        print(f"\nGenerierter Quelltext liegt in {src}", file=sys.stderr)
        raise SystemExit(1)

    if verbose and proc.stderr:
        print(proc.stderr, file=sys.stderr)

    return so


# ============================================================================
# Ctypes-Wrapper um die kompilierte Lib
# ============================================================================
class LambdaSim:
    def __init__(self, so_path: Path) -> None:
        self.lib = ctypes.CDLL(str(so_path))
        self.lib.sim_set_inputs.argtypes = [
            ctypes.c_int, ctypes.c_float, ctypes.c_float, ctypes.c_float,
            ctypes.c_int, ctypes.c_int, ctypes.c_int, ctypes.c_int,
        ]
        self.lib.sim_set_inputs.restype = None
        self.lib.sim_run.argtypes = []
        self.lib.sim_run.restype = None
        for name in ("sim_get_fan1_state", "sim_get_fan1_pct",
                     "sim_get_fan2_state", "sim_get_fan2_pct"):
            getattr(self.lib, name).restype = ctypes.c_int

    def step(self, t1: float, t2: float, t_target: float,
             fan_running: bool, fan_pct: int = 50,
             auto_on: bool = True) -> tuple:
        self.lib.sim_set_inputs(
            1 if auto_on else 0,
            ctypes.c_float(t1), ctypes.c_float(t2), ctypes.c_float(t_target),
            1 if fan_running else 0, fan_pct,
            1 if fan_running else 0, fan_pct,
        )
        self.lib.sim_run()
        return bool(self.lib.sim_get_fan1_state()), int(self.lib.sim_get_fan1_pct())


# ============================================================================
# Plot
# ============================================================================
def plot(temps: np.ndarray, warming_pct: np.ndarray, cooling_pct: np.ndarray,
         t_target: float, outfile: Path, yaml_path: Path) -> None:
    fig, ax = plt.subplots(figsize=(10.5, 5.8))

    aus_mask  = (warming_pct == 0) & (cooling_pct == 0)
    hyst_mask = (warming_pct == 0) & (cooling_pct > 0)
    full_mask = (warming_pct >= 100) & (cooling_pct >= 100)

    def shade(mask: np.ndarray, color: str, alpha: float, label) -> None:
        if not mask.any():
            return
        idx = np.where(mask)[0]
        start = idx[0]
        prev = idx[0]
        for i in idx[1:]:
            if i != prev + 1:
                ax.axvspan(temps[start], temps[prev], alpha=alpha, color=color,
                           label=label)
                label = None
                start = i
            prev = i
        ax.axvspan(temps[start], temps[prev], alpha=alpha, color=color, label=label)

    shade(aus_mask,  "tab:blue",   0.08, "Off ")
    shade(hyst_mask, "tab:orange", 0.18, "Hysterese")
    shade(full_mask, "tab:red",    0.12, "Max")

    ax.plot(temps, warming_pct, color="#1f77b4", lw=2.4,
            label="Warming")
    ax.plot(temps, cooling_pct, color="#d62728", lw=2.4, ls="--",
            label="Cooling")

    ax.set_xlabel("Temperature, max(DS18B20)  [°C]")
    ax.set_ylabel("PWM-Steps [%]")
    ax.set_title(
        f"fan-curve from {yaml_path.name}  (target_temp = {t_target:.0f} °C)\n"
    )
    ax.set_xlim(temps[0], temps[-1])
    ax.set_ylim(-5, 110)
    ax.set_yticks(range(0, 101, 20))
    ax.grid(True, alpha=0.3)
    ax.legend(loc="lower right", framealpha=0.95)

    fig.tight_layout()
    fig.savefig(outfile, dpi=150, bbox_inches="tight")
    print(f"Plot gespeichert: {outfile}")


# ============================================================================
# Main
# ============================================================================
def main() -> None:
    parser = argparse.ArgumentParser(
        description="Simuliert die Luefterkurve aus der ESPHome-YAML, "
                    "indem das Original-Lambda als C++ kompiliert und gegen "
                    "einen Temperatur-Sweep ausgefuehrt wird."
    )
    parser.add_argument("--yaml", type=Path, default=Path("esphome/temperature-simulator/fan-curve.yaml"),
                        help="Pfad zur YAML (auch rack-monitor.yaml moeglich). "
                             "Default: fan_curve.yaml")
    parser.add_argument("--target-temp", type=float, default=28.0,
                        help="HA-Slider target_temp in °C (25..45). Default: 28")
    parser.add_argument("--t-min", type=float, default=None,
                        help="Untere Temperatur des Sweeps. Default: target_temp - 5")
    parser.add_argument("--t-max", type=float, default=None,
                        help="Obere Temperatur des Sweeps. Default: target_temp + 14")
    parser.add_argument("--steps", type=int, default=1000,
                        help="Anzahl Sweep-Punkte. Default: 1801 (~0.01 °C)")
    parser.add_argument("-o", "--output", type=Path, default=Path("esphome/temperature-simulator/fan_curve.png"))
    parser.add_argument("--show", action="store_true")
    parser.add_argument("--keep-build", action="store_true",
                        help="Build-Artefakte behalten (zur Inspektion)")
    parser.add_argument("-v", "--verbose", action="store_true")
    args = parser.parse_args()

    if not args.yaml.exists():
        raise SystemExit(f"YAML-Datei nicht gefunden: {args.yaml}")
    if not 25.0 <= args.target_temp <= 45.0:
        parser.error("--target-temp ausserhalb 25..45 °C (HA-Number-Range)")

    t_min = args.t_min if args.t_min is not None else args.target_temp - 5.0
    t_max = args.t_max if args.t_max is not None else args.target_temp + 14.0

    lambda_body = extract_lambda(args.yaml)
    n_lines = lambda_body.count("\n") + 1
    print(f"Lambda extrahiert aus {args.yaml}: {n_lines} Zeilen")

    if args.keep_build:
        build_dir = Path(tempfile.mkdtemp(prefix="fan_curve_build_"))
        print(f"Build-Verzeichnis: {build_dir}")
        so = compile_lambda(lambda_body, build_dir, verbose=args.verbose)
        _do_sweep_and_plot(LambdaSim(so), args, t_min, t_max)
    else:
        with tempfile.TemporaryDirectory(prefix="fan_curve_build_") as tmp:
            so = compile_lambda(lambda_body, Path(tmp), verbose=args.verbose)
            _do_sweep_and_plot(LambdaSim(so), args, t_min, t_max)


def _do_sweep_and_plot(sim: LambdaSim, args: argparse.Namespace,
                       t_min: float, t_max: float) -> None:
    temps = np.linspace(t_min, t_max, args.steps)
    warming = np.empty(args.steps, dtype=int)
    cooling = np.empty(args.steps, dtype=int)

    for i, t in enumerate(temps):
        _, warming[i] = sim.step(float(t), float(t), args.target_temp,
                                 fan_running=False)
        _, cooling[i] = sim.step(float(t), float(t), args.target_temp,
                                 fan_running=True, fan_pct=20)

    plot(temps, warming, cooling, args.target_temp, args.output, args.yaml)
    if args.show:
        plt.show()


if __name__ == "__main__":
    main()