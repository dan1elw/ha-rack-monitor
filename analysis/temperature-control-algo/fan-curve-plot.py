#!/usr/bin/env python3
# =============================================================
# fan_curve_plot.py – Simulation der Lüfterkurve
# Prinzip: Die Regel-Lambda wird unverändert aus rack-monitor.yaml
# extrahiert, Substitutionen werden aufgelöst (wie beim ESPHome-
# Build), der Code via g++ kompiliert und über ctypes aufgerufen.
# Single Source of Truth bleibt die YAML.
#
# Abhängigkeiten: pyyaml, matplotlib, g++
# =============================================================
 
import ctypes
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
 
import matplotlib.pyplot as plt
import yaml

YAML_PATH = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("esphome/rack-monitor.yaml")
NAN = float("nan")

# C++-Shim: mockt die ESPHome-Umgebung der Lambda
SHIM = r'''
#include <math.h>
#include <algorithm>
using std::max;

template <typename T>
static T clamp(T v, T lo, T hi) { return v < lo ? lo : (v > hi ? hi : v); }

struct MockSensor { float state; };
struct MockSwitch { bool state; };
struct MockOutput { float level; void set_level(float v) { level = v; } };

// --- Fan-Entity-Mock (ESPHome Fan-API: make_call/set_*/perform) ---
struct MockFan;
struct MockFanCall {
    MockFan *f;
    bool has_state = false, st = false;
    bool has_speed = false; int sp = 0;
    MockFanCall &set_state(bool s) { has_state = true; st = s; return *this; }
    MockFanCall &set_speed(float s) { has_speed = true; sp = (int)lroundf(s); return *this; }
    void perform();
};
struct MockFan {
    bool state = false;
    int speed = 0;          // 0..100 (speed_count-Default)
    bool touched = false;   // wurde in diesem Zyklus geschrieben?
    MockFanCall make_call() { return MockFanCall{this}; }
    MockFanCall turn_on()  { auto c = make_call(); c.set_state(true);  return c; }
    MockFanCall turn_off() { auto c = make_call(); c.set_state(false); return c; }
};
void MockFanCall::perform() {
    if (has_state) f->state = st;
    if (has_speed) f->speed = sp;
    f->touched = true;
}

static MockSwitch auto_mode{true};
static bool auto_writing = false;          // Global aus der YAML
static MockSensor rack_temp_1, rack_temp_2, intake_temp;
static MockOutput pwm_fan1, pwm_fan2;      // ungenutzt, schadet nicht
static MockFan fan1_obj, fan2_obj;
static MockFan *fan1 = &fan1_obj, *fan2 = &fan2_obj;

#define id(x) (x)

static void control_step() {
__LAMBDA__
}

extern "C" float simulate(float t1, float t2, float tin) {
    rack_temp_1.state = t1;
    rack_temp_2.state = t2;
    intake_temp.state = tin;
    fan1_obj.touched = false;
    control_step();
    if (!fan1_obj.touched) return -1.0f;   // Sentinel: keine Änderung
    return fan1_obj.state ? fan1_obj.speed / 100.0f : 0.0f;
}
'''

def load_yaml(path: Path) -> dict:
    """YAML laden; ESPHome-Tags wie !secret werden ignoriert."""
    class Loader(yaml.SafeLoader):
        pass
    Loader.add_multi_constructor("!", lambda loader, suffix, node: None)
    return yaml.load(path.read_text(), Loader=Loader)
 
 
def resolve_substitutions(code: str, subs: dict) -> str:
    """${var}- und $var-Substitutionen wie ESPHome per Text ersetzen."""
    for key, val in (subs or {}).items():
        code = code.replace("${%s}" % key, str(val))
        code = re.sub(r"\$%s\b" % re.escape(key), str(val), code)
    return code
 
 
def extract_control_lambda(cfg: dict) -> str:
    """Die Regel-Lambda anhand des auto_mode-Zugriffs identifizieren."""
    for entry in cfg.get("interval", []):
        for action in entry.get("then", []):
            if isinstance(action, dict) and "auto_mode" in str(action.get("lambda", "")):
                return action["lambda"]
    sys.exit("Regel-Lambda (auto_mode) nicht in der YAML gefunden.")
 
 
def build_shared_lib(lambda_code: str) -> Path:
    workdir = Path(tempfile.mkdtemp(prefix="fan_sim_"))
    cpp = workdir / "shim.cpp"
    so = workdir / "shim.so"
    cpp.write_text(SHIM.replace("__LAMBDA__", lambda_code))
    subprocess.run(
        ["g++", "-shared", "-fPIC", "-O2", "-o", str(so), str(cpp)],
        check=True,
    )
    return so
 
 
def fresh_instance(so: Path):
    """Eigene Kopie der Lib pro Szenario, damit `static bool fans_on`
    definiert bei false startet (ctypes cacht identische Pfade)."""
    inst = Path(tempfile.mkdtemp(prefix="fan_sim_")) / "inst.so"
    shutil.copy(so, inst)
    lib = ctypes.CDLL(str(inst))
    lib.simulate.restype = ctypes.c_float
    lib.simulate.argtypes = [ctypes.c_float] * 3
    return lib
 
 
def sweep(lib, points):
    """points: Iterable aus (t1, t2, tin). Sentinel -1 -> None."""
    out = []
    for t1, t2, tin in points:
        v = lib.simulate(t1, t2, tin)
        out.append(None if v < 0 else v * 100.0)
    return out
 
 
def main():
    cfg = load_yaml(YAML_PATH)
    code = resolve_substitutions(extract_control_lambda(cfg),
                                 cfg.get("substitutions"))
    so = build_shared_lib(code)
 
    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 5))
    
    # --- Szenario 1: Delta-T-Kurve mit Hysterese (Intake fix 22 °C) ---
    tin = 20.0
    dts = [i / 100 for i in range(0, ((25-0)*100+1))]  # 0 .. 25 K
    lib = fresh_instance(so)  # eine Instanz: Hysterese soll wirken
    up = sweep(lib, ((tin + dt, tin + dt - 1.0, tin) for dt in dts))
    down = sweep(lib, ((tin + dt, tin + dt - 1.0, tin) for dt in reversed(dts)))
    ax1.plot(dts, up, label="ΔT aufsteigend", color="blue")
    ax1.plot(list(reversed(dts)), down, "--", label="ΔT absteigend (Hysterese)", color="red")
    ax1.set_title("Delta-T-Regelung (Intake 20 °C)")
    ax1.set_xlabel("ΔT Rack − Intake [°C]")
    ax1.set_ylabel("PWM [%]")
    ax1.set_ylim(-5, 105)
    ax1.set_xlim(5, 20)
    ax1.grid(True, alpha=0.3)
    ax1.legend(loc="upper left")
 
    # --- Szenario 2: Absolut-Override und Sensor-Fallback ---
    racks = [21 + i / 100 for i in range(0, ((50-20)*100+1))]  # 20 .. 50 °C
    for tin2, style, lbl, col in [
        (20.0, "-", "Intake 20 °C", "blue"),
        (30.0, "-", "Intake 30 °C", "red"),
        (NAN, ":", "Intake ausgefallen (Fallback)", "green"),
    ]:
        lib = fresh_instance(so)  # frische Instanz je Kurve
        vals = sweep(lib, ((r, r, tin2) for r in racks))
        ax2.plot(racks, vals, style, label=lbl, color=col)
    ax2.axvline(45.0, color="grey", lw=0.8)
    ax2.text(45.5, 5, "Override 45 °C", fontsize=8, color="grey", rotation=90)
    ax2.set_title("Absoluttemperatur: Override & Fallback")
    ax2.set_xlabel("Rack-Temperatur (max) [°C]")
    ax2.set_ylabel("PWM [%]")
    ax2.set_ylim(-5, 105)
    ax2.set_xlim(25, 50)
    ax2.grid(True, alpha=0.3)
    ax2.legend(loc="upper left")
 
    fig.tight_layout()
    fig.savefig("analysis/temperature-control-algo/fan_curve.svg", dpi=150)
    print("Plot gespeichert: fan_curve.svg")
    plt.show()
 
 
if __name__ == "__main__":
    main()
