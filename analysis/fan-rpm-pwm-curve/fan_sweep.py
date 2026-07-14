"""Fan RPM sweep: ramp a HA fan entity in percent steps, wait for stable RPM,
export (percent, rpm) pairs as CSV.

Usage example:
    python3 analysis/fan-rpm-pwm-curve/fan_sweep.py \
        --fan fan.rack_monitor_luefter_1 \
        --rpm-sensor sensor.rack_monitor_luefter_1_drehzahl \
        --start 0 --stop 100 --step 5 \
        --output analysis/fan-rpm-pwm-curve/fan1_curve.csv \
        --url http://<HA-IP>:8123 \
        --token <token>

Stability criterion: the last WINDOW distinct sensor updates span at most
TOLERANCE rpm. Only *new* sensor updates count (last_updated must change),
so the poll interval does not need to match the ESPHome update_interval.
"""

from __future__ import annotations

import argparse
import csv
import os
import statistics
import sys
import time
from collections import deque
from datetime import datetime, timezone

import requests

from ha_client import HAClient

UNAVAILABLE_STATES = ("unavailable", "unknown")


class DeviceUnavailableError(RuntimeError):
    """Raised when the rack-monitor (ESPHome node) is offline."""


def _dotenv() -> dict:
    """Minimal .env parser: KEY=VALUE lines, searched next to this script
    and in the current working directory. No external dependency."""
    result: dict[str, str] = {}
    here = os.path.dirname(os.path.abspath(__file__))
    for candidate in (os.path.join(here, ".env"), os.path.join(os.getcwd(), ".env")):
        if os.path.isfile(candidate):
            with open(candidate) as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, _, value = line.partition("=")
                        result.setdefault(key.strip(), value.strip().strip('"').strip("'"))
    return result


def wait_for_stable_rpm(
    client: HAClient,
    sensor: str,
    window: int,
    tolerance: float,
    poll: float,
    timeout: float,
    unavailable_after: float = 20.0,
    stale_after: float = 20.0,
) -> dict:
    """Poll the RPM sensor until `window` consecutive fresh samples lie within
    `tolerance` rpm of each other, or until timeout. Prints a live status line.

    Raises DeviceUnavailableError if the sensor reports 'unavailable'/'unknown'
    continuously for `unavailable_after` seconds (rack-monitor offline).
    Warns once if no fresh sensor update arrives within `stale_after` seconds."""
    samples: deque[float] = deque(maxlen=window)
    all_samples: list[float] = []
    last_ts = None
    t0 = time.monotonic()
    last_fresh = t0
    unavailable_since: float | None = None
    stale_warned = False

    def status(msg: str) -> None:
        # \r keeps a single updating line; padded to clear leftovers
        print(f"\r    {msg:<70}", end="", flush=True)

    while time.monotonic() - t0 < timeout:
        state = client.get_state(sensor)
        raw, ts = state["state"], state["last_updated"]
        elapsed = time.monotonic() - t0

        if raw in UNAVAILABLE_STATES:
            unavailable_since = unavailable_since or time.monotonic()
            status(f"{elapsed:5.1f}s | sensor '{raw}' - waiting for device...")
            if time.monotonic() - unavailable_since >= unavailable_after:
                print()
                raise DeviceUnavailableError(
                    f"{sensor} has been '{raw}' for {unavailable_after:.0f} s "
                    f"- rack-monitor appears to be offline."
                )
        else:
            unavailable_since = None
            if ts != last_ts:
                try:
                    value = float(raw)
                except (ValueError, TypeError):
                    value = None
                if value is not None:
                    last_ts = ts
                    last_fresh = time.monotonic()
                    samples.append(value)
                    all_samples.append(value)
                    spread = max(samples) - min(samples) if len(samples) > 1 else 0.0
                    status(f"{elapsed:5.1f}s | sample {len(all_samples)}: {value:.0f} rpm "
                           f"| window {len(samples)}/{window} | spread {spread:.0f}"
                           f"/{tolerance:.0f} rpm")
                    if len(samples) == window and spread <= tolerance:
                        print()
                        return _stats(list(samples), stable=True, duration=elapsed)
            else:
                since_fresh = time.monotonic() - last_fresh
                status(f"{elapsed:5.1f}s | waiting for sensor update "
                       f"({since_fresh:.0f}s since last, state={raw})")
                if since_fresh >= stale_after and not stale_warned:
                    stale_warned = True
                    print(f"\n    WARNING: no fresh update for {stale_after:.0f}s - "
                          f"check the tach sensor's ESPHome update_interval; "
                          f"it must be well below --timeout/--window.")
        time.sleep(poll)
    print()

    # Timeout: report what we have, flagged as unstable
    data = list(samples) if samples else all_samples
    return _stats(data, stable=False, duration=time.monotonic() - t0)


def _stats(samples: list[float], stable: bool, duration: float) -> dict:
    if not samples:
        return dict(rpm_mean=None, rpm_min=None, rpm_max=None, rpm_std=None,
                    n_samples=0, stable=False, settle_s=round(duration, 1))
    return dict(
        rpm_mean=round(statistics.fmean(samples), 1),
        rpm_min=min(samples),
        rpm_max=max(samples),
        rpm_std=round(statistics.stdev(samples), 1) if len(samples) > 1 else 0.0,
        n_samples=len(samples),
        stable=stable,
        settle_s=round(duration, 1),
    )


def main() -> int:
    p = argparse.ArgumentParser(description="Fan percent -> RPM sweep via Home Assistant")
    p.add_argument("--fan", required=True, help="fan entity, e.g. fan.rack_fan_1")
    p.add_argument("--rpm-sensor", required=True, help="RPM sensor entity, e.g. sensor.rack_fan_1_rpm")
    p.add_argument("--start", type=int, default=0, help="start percent (default 0)")
    p.add_argument("--stop", type=int, default=100, help="stop percent, inclusive (default 100)")
    p.add_argument("--step", type=int, default=5, help="step size in percent (default 5)")
    p.add_argument("--window", type=int, default=4, help="consecutive samples required for stability (default 4)")
    p.add_argument("--tolerance", type=float, default=50.0, help="max RPM spread within window (default 50)")
    p.add_argument("--poll", type=float, default=1.0, help="sensor poll interval in s (default 1.0)")
    p.add_argument("--timeout", type=float, default=90.0, help="max settle time per step in s (default 90)")
    p.add_argument("--output", default=None, help="CSV output path (default: auto-named)")
    p.add_argument("--no-restore", action="store_true", help="do not restore initial fan state at the end")
    p.add_argument("--url", default=None, help="HA base URL (overrides HA_URL env var / .env)")
    p.add_argument("--token", default=None, help="HA long-lived token (overrides HA_TOKEN env var / .env)")
    args = p.parse_args()

    url = args.url or os.environ.get("HA_URL") or _dotenv().get("HA_URL")
    token = args.token or os.environ.get("HA_TOKEN") or _dotenv().get("HA_TOKEN")
    if not url or not token:
        print(
            "ERROR: HA_URL / HA_TOKEN not found.\n"
            "Provide them one of three ways:\n"
            "  1. CLI:  --url http://<HA-IP>:8123 --token <token>\n"
            "  2. Env:  export HA_URL=... HA_TOKEN=...  (same terminal, no sudo)\n"
            "  3. File: .env next to this script with HA_URL=... and HA_TOKEN=... lines",
            file=sys.stderr,
        )
        return 1

    client = HAClient(url, token)
    if not client.check_connection():
        print("ERROR: cannot reach Home Assistant API.", file=sys.stderr)
        return 1

    # Pre-flight: abort if the rack-monitor entities are missing or unavailable
    for entity in (args.fan, args.rpm_sensor):
        try:
            state = client.get_state(entity)
        except requests.HTTPError as e:
            print(f"ERROR: entity '{entity}' not found in Home Assistant ({e}). "
                  f"Check the entity ID in Developer Tools -> States.", file=sys.stderr)
            return 1
        if state["state"] in UNAVAILABLE_STATES:
            print(f"ERROR: entity '{entity}' is '{state['state']}' "
                  f"- rack-monitor not available. Aborting.", file=sys.stderr)
            return 1

    out_path = os.path.abspath(args.output or (
        f"{args.fan.split('.')[-1]}_sweep_{datetime.now():%Y%m%d_%H%M%S}.csv"
    ))
    percents = list(range(args.start, args.stop + 1, args.step))
    fieldnames = ["timestamp", "percent", "rpm_mean", "rpm_min", "rpm_max",
                  "rpm_std", "n_samples", "stable", "settle_s"]

    # Save initial state for restore
    was_on, initial_pct = client.fan_get_status(args.fan)
    print(f"Initial state: on={was_on}, percentage={initial_pct}")
    print(f"Sweep: {percents[0]}..{percents[-1]} % in {args.step} % steps "
          f"({len(percents)} steps, max {args.timeout:.0f} s each)")
    print(f"CSV (written incrementally): {out_path}\n")

    n_rows = 0
    csv_file = open(out_path, "w", newline="")
    writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
    writer.writeheader()
    csv_file.flush()

    try:
        client.fan_turn_on(args.fan)
        time.sleep(2)

        for i, pct in enumerate(percents, 1):
            note = "  (0 % = fan off in HA)" if pct == 0 else ""
            print(f"[{i}/{len(percents)}] Setting {pct} %{note}")
            client.fan_set_percentage(args.fan, pct)
            result = wait_for_stable_rpm(
                client, args.rpm_sensor,
                window=args.window, tolerance=args.tolerance,
                poll=args.poll, timeout=args.timeout,
            )
            row = {
                "timestamp": datetime.now(timezone.utc).isoformat(timespec="seconds"),
                "percent": pct,
                **result,
            }
            writer.writerow(row)
            csv_file.flush()
            os.fsync(csv_file.fileno())
            n_rows += 1
            flag = "stable" if result["stable"] else "TIMEOUT - not stable"
            print(f"    -> {pct:3d} %: {result['rpm_mean']} rpm "
                  f"(±{result['rpm_std']}, n={result['n_samples']}, "
                  f"{result['settle_s']} s) [{flag}]\n")
    except KeyboardInterrupt:
        print("\nAborted by user.")
    except DeviceUnavailableError as e:
        print(f"\nABORT: {e}", file=sys.stderr)
    finally:
        csv_file.close()
        print(f"CSV: {out_path} ({n_rows} data rows)")

        # Restore initial fan state (best effort - device may be offline)
        if not args.no_restore:
            try:
                if was_on and initial_pct is not None:
                    client.fan_set_percentage(args.fan, initial_pct)
                elif not was_on:
                    client.fan_turn_off(args.fan)
                print("Initial fan state restored.")
            except requests.RequestException as e:
                print(f"WARNING: could not restore fan state ({e}). "
                      f"Check manually once the device is back online.", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())