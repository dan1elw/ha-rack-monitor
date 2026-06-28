#!/usr/bin/env python3
"""
fan_curve_plot.py
-----------------
Visualisiert die Luefterkurve aus rack-monitor.yaml (interval/lambda).
Reproduziert die ESPHome-C++-Logik 1:1 in Python und plottet
PWM-Tastverhaeltnis (%) gegen die maximale DS18B20-Temperatur.

Besonderheit: Die 1-K-Hysterese unterhalb t_low ist zustandsabhaengig.
Es werden daher zwei Kurven gezeichnet:
  - Aufwaerts:  aus dem Aus-Zustand kommend
  - Abkuehlend: aus dem laufenden Zustand kommend

Quelle der Regel-Logik: fan_curve.yaml (Block 'interval').
"""

from __future__ import annotations

import argparse

import matplotlib.pyplot as plt
import numpy as np


# ---- Feste Parameter der YAML (nicht ueber HA aenderbar) --------------------
DELTA_T = 10.0      # Spannweite linearer Bereich (t_high = t_low + DELTA_T)
HYSTERESIS = 1.0    # K Hysterese unterhalb t_low
MIN_SPEED = 0.20    # 20 % Mindestanlauf
MAX_SPEED = 1.00    # 100 % Volllast


def fan_speed(t: float, t_low: float, running: bool) -> float:
    """1:1-Pendant zum ESPHome-Lambda. Rueckgabe: PWM-Anteil [0.0 .. 1.0]."""
    t_high = t_low + DELTA_T

    if t < t_low - HYSTERESIS:
        return 0.0
    if t < t_low:
        # Hysterese-Zone: laeuft weiter, wenn schon an; bleibt aus, wenn aus
        return MIN_SPEED if running else 0.0
    if t >= t_high:
        return MAX_SPEED
    return MIN_SPEED + (t - t_low) / DELTA_T * (MAX_SPEED - MIN_SPEED)


def plot_curve(t_low: float, outfile: str) -> None:
    t_high = t_low + DELTA_T
    temps = np.linspace(t_low - 5.0, t_high + 4.0, 1801)

    pwm_warming = np.array([fan_speed(t, t_low, running=False) for t in temps]) * 100
    pwm_cooling = np.array([fan_speed(t, t_low, running=True) for t in temps]) * 100

    fig, ax = plt.subplots(figsize=(10, 5.5))

    # Hintergrund-Zonen
    ax.axvspan(temps[0], t_low - HYSTERESIS, alpha=0.08, color="tab:blue",
               label="Aus-Zone (sicher)")
    ax.axvspan(t_low - HYSTERESIS, t_low, alpha=0.18, color="tab:orange",
               label=f"Hysterese ({HYSTERESIS:.0f} K)")
    ax.axvspan(t_low, t_high, alpha=0.08, color="tab:green",
               label="Linearer Anstieg")
    ax.axvspan(t_high, temps[-1], alpha=0.12, color="tab:red",
               label="Volllast")

    # Kurven
    ax.plot(temps, pwm_warming, color="#1f77b4", lw=2.4,
            label="Aufwaerts (aus -> an)")
    ax.plot(temps, pwm_cooling, color="#d62728", lw=2.4, ls="--",
            label="Abkuehlend (an -> aus)")

    # Schwellenmarken
    for tx, label in ((t_low - HYSTERESIS, f"{t_low - HYSTERESIS:.0f} °C"),
                      (t_low, f"t_low = {t_low:.0f} °C"),
                      (t_high, f"t_high = {t_high:.0f} °C")):
        ax.axvline(tx, color="gray", lw=0.8, ls=":")
        ax.text(tx, 105, label, rotation=90, va="top", ha="right",
                fontsize=8, color="gray")

    ax.set_xlabel("Geraete-Temperatur, max(DS18B20)  [°C]")
    ax.set_ylabel("PWM-Tastverhaeltnis  [%]")
    ax.set_title(
        f"Luefterkurve rack-monitor   "
        f"(target_temp = {t_low:.0f} °C, +{DELTA_T:.0f} K -> 100 %, "
        f"{HYSTERESIS:.0f} K Hysterese)"
    )
    ax.set_xlim(temps[0], temps[-1])
    ax.set_ylim(-5, 110)
    ax.set_yticks(range(0, 101, 20))
    ax.grid(True, alpha=0.3)
    ax.legend(loc="center left", bbox_to_anchor=(1.01, 0.5), fontsize=9,
              framealpha=0.95)

    fig.tight_layout()
    fig.savefig(outfile, dpi=150, bbox_inches="tight")
    print(f"Plot gespeichert: {outfile}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Plot der Luefterkurve aus rack-monitor.yaml")
    parser.add_argument("--target-temp", type=float, default=28.0,
                        help="Einschaltschwelle t_low in °C (HA-Slider, 25..45). Default: 28")
    parser.add_argument("-o", "--output", default="esphome/temperature-simulator/fan_curve.png",
                        help="Output-Dateiname (PNG). Default: fan_curve.png")
    parser.add_argument("--show", action="store_true",
                        help="Plot interaktiv anzeigen")
    args = parser.parse_args()

    if not 25.0 <= args.target_temp <= 45.0:
        parser.error("target-temp muss im Bereich der HA-Number-Entitaet liegen (25..45 °C)")

    plot_curve(args.target_temp, args.output)
    if args.show:
        plt.show()


if __name__ == "__main__":
    main()