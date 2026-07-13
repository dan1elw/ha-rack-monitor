# ha-rack-monitor

ESP32-based temperature monitoring and fan control for a homelab rack, fully integrated into Home Assistant via ESPHome.

The controller measures rack and intake air temperatures and drives two PWM fans along a delta-T fan curve — cooling scales with the actual heat load instead of a fixed schedule. All sensors and controls are exposed as native Home Assistant entities.

<div style="text-align: center;">
    <img src="./docs/control-logic/rack_esp32_schaltplan.drawio.svg" width="70%"/>
</div>

## Features

- Temperature monitoring of two rack zones plus intake air reference
- Automatic delta-T based fan control with hysteresis and a safety override
- Manual mode: any manual fan interaction pauses the automation
- Fan speed (RPM) monitoring per fan
- OTA updates, web interface for direct diagnostics, status LED

## Repository layout

| Path | Content |
| ---- | ------- |
| `esphome/` | ESPHome configuration (`rack-monitor.yaml`) |
| `analysis/` | Analysis and supporting tools. (e.g., Fan Curve Simulation, Temperature Cooling Efficiency) |
| `docs/` | Documentation (hardware, control logic, setup) |

## Documentation

- [Temperature control](docs/temperature-control.md) — control logic, fan curve, simulation
- [Rack build](docs/rack-build.md) — 10-inch server rack build with aluminium profiles
- [ESP Commissioning](docs/esp-commissioning.md) — initial bring-up of the ESP32

## License

MIT © dan1elw