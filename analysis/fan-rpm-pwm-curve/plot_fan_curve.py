"""Plot RPM over fan speed (%) from one or more sweep CSV files.

Usage:
    python3 plot_fan_curve.py fan1_curve.csv fan2_curve.csv --output fan_curves.png

Each CSV must contain at least: percent, rpm_mean (fan_sweep.py output).
If rpm_min/rpm_max are present, they are shown as an error band.
Unstable points (stable=False) are marked with an open symbol.
"""

from __future__ import annotations

import argparse
import csv
import sys
from pathlib import Path

import matplotlib.pyplot as plt

SHOW_UNSTABLE = False  # mark unstable points with open symbol

def load_csv(path: str) -> dict:
    pct, rpm, lo, hi, unstable_pts = [], [], [], [], []
    with open(path, newline="") as f:
        for row in csv.DictReader(f):
            if not row.get("rpm_mean"):
                continue
            p = float(row["percent"])
            r = float(row["rpm_mean"])
            pct.append(p)
            rpm.append(r)
            lo.append(float(row["rpm_min"]) if row.get("rpm_min") else r)
            hi.append(float(row["rpm_max"]) if row.get("rpm_max") else r)
            if str(row.get("stable", "True")).lower() == "false":
                unstable_pts.append((p, r))
    return dict(percent=pct, rpm=rpm, lo=lo, hi=hi, unstable=unstable_pts)


def main() -> int:
    p = argparse.ArgumentParser(description="Plot fan RPM vs. percent")
    p.add_argument("csv_files", nargs="+", help="one or more sweep CSV files")
    p.add_argument("--output", default="fan_curves.png", help="output image (default fan_curves.png)")
    p.add_argument("--title", default="Fan RPM vs. Speed Setting", help="plot title")
    p.add_argument("--show", action="store_true", help="open interactive window instead of only saving")
    p.add_argument("--colors", nargs="+", default=["#FF00AA", "#14EF10"],
                   help="custom colors, one per CSV in order, e.g. --colors '#1f77b4' crimson "
                        "(named colors or hex codes)")
    args = p.parse_args()

    fig, ax = plt.subplots(figsize=(9, 6))

    for idx, path in enumerate(args.csv_files):
        data = load_csv(path)
        if not data["percent"]:
            print(f"WARNING: no data in {path}", file=sys.stderr)
            continue
        label = Path(path).stem
        color = args.colors[idx] if args.colors and idx < len(args.colors) else None
        line, = ax.plot(data["percent"], data["rpm"], marker="o", markersize=4,
                        label=label, color=color)
        ax.fill_between(data["percent"], data["lo"], data["hi"],
                        alpha=0.15, color=line.get_color())
        if data["unstable"] and SHOW_UNSTABLE:
            xs, ys = zip(*data["unstable"])
            ax.scatter(xs, ys, facecolors="none", edgecolors="red", s=80,
                       zorder=5, label=f"{label} (unstable)")

    ax.set_xlabel("Fan speed setting [%]")
    ax.set_ylabel("RPM")
    ax.set_title(args.title)
    ax.grid(True, alpha=0.3)
    ax.legend()
    ax.set_xlim(left=0)
    ax.set_ylim(bottom=0)
    fig.tight_layout()

    fig.savefig(args.output, dpi=150)
    print(f"Plot saved: {args.output}")
    if args.show:
        plt.show()
    return 0


if __name__ == "__main__":
    sys.exit(main())