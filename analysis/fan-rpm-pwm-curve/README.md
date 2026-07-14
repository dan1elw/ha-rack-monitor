# Fan RPM Sweep Tool

Measures the RPM-vs-percent curve of a Home Assistant fan entity and plots it.

## Files

- `ha_client.py` — reusable HA REST API client (token auth, state reads, service calls)
- `fan_sweep.py` — sweep test: ramps percentage, waits for stable RPM, writes CSV
- `plot_fan_curve.py` — plots one or more sweep CSVs (RPM vs. %)

## Setup

1. **Create a long-lived access token** in HA: Profile → Security → Long-lived access tokens → Create.
2. **Install dependencies** (only `requests` for the sweep, `matplotlib` for plotting):
   ```bash
   pip install requests matplotlib
   ```
3. **Export credentials:** (credentials can also be provided as arguents --url and --token)
   ```bash
   export HA_URL="http://<HA-IP>:8123"
   export HA_TOKEN="<token>"
   ```

## Run a sweep

```bash
python3 analysis/fan-rpm-pwm-curve/fan_sweep.py \
  --fan fan.rack_monitor_luefter_1 \
  --rpm-sensor sensor.rack_monitor_luefter_1_drehzahl \
  --start 0 --stop 100 --step 5 \
  --output analysis/fan-rpm-pwm-curve/fan1_curve.csv \
  --url http://<HA-IP>:8123 \
  --token <token>
```

Key parameters:

| Flag | Default | Meaning |
|---|---|---|
| `--window` | 4 | consecutive fresh sensor updates required for stability |
| `--tolerance` | 50 | max RPM spread within the window |
| `--poll` | 1.0 s | API poll interval (only *new* sensor updates count) |
| `--timeout` | 90 s | max settle time per step; result flagged `stable=False` |
| `--no-restore` | off | skip restoring the initial fan state at the end |

CSV columns: `timestamp, percent, rpm_mean, rpm_min, rpm_max, rpm_std, n_samples, stable, settle_s`.

Ctrl+C aborts cleanly: partial CSV is written and the fan state is restored.

## Plot

```bash
python3 analysis/fan-rpm-pwm-curve/plot_fan_curve.py \
    fan1_curve.csv \
    fan2_curve.csv \
    --output analysis/fan-rpm-pwm-curve/fan_curves.svg
```

Multiple CSVs overlay in one chart (e.g. Fan 1 vs. Fan 2, or before/after PCB Rev A). Min/max band shown as shaded area; unstable points circled in red.

## Notes for rack-monitor firmware

- Setting the percentage from HA triggers the **manual override** (`auto_writing` flag), so the temperature lambda will not fight the sweep. Verify the override does not auto-revert during a step (worst case ~90 s per step).
- Stability detection counts only *fresh* sensor updates (`last_updated` change), so it works regardless of the tach sensor's ESPHome `update_interval`. With a long `update_interval`, increase `--timeout` accordingly (timeout ≥ window × update_interval × 2 is a safe rule).
- After the run, re-enable automatic control per your firmware's override-exit mechanism if restore-to-previous-percentage is not sufficient.