# Rack Monitor — First Commissioning & Home Assistant Integration

Initial bring-up of the ESP32 (`rack-monitor`) with ESPHome and integration into Home Assistant.

> **Device name `rack-monitor` is fixed.** HA integration, OTA, and mDNS are configured against it — do not rename.

---

## Prerequisites

| Item | Requirement |
|------|-------------|
| Hardware | ESP32-WROOM-32 DevKitC (CP2102, USB-C) |
| Firmware config | `rack-monitor.yaml` (validated), `secrets.yaml` |
| Dev machine | Ubuntu, user in `dialout` group |
| Tooling | ESPHome 2026.5.x |
| Network | router static DHCP lease prepared for the device |

```bash
# One-time: grant serial access (restart required)
sudo usermod -aG dialout $USER
```

---

## Step 1 — Power & Connect (Initial Flash Only)

The first flash **requires a physical USB connection**.

> ⚠️ **Do not power VIN and USB at the same time.** Parallel 12 V (buck) + USB power overloads the USB supply and breaks the serial connection. For flashing, use USB only — leave the 12 V rail disconnected.

1. Disconnect the 12 V input / MP1584 output from the ESP32.
2. Connect the ESP32 to the Ubuntu machine via USB-C.
3. Confirm the port is present:

```bash
ls /dev/ttyUSB*
```

---

## Step 2 — Flash the Firmware

Initial flash over USB (subsequent updates go via OTA):

```bash
esphome run rack-monitor.yaml
```

Select the USB serial port when prompted. After the build completes, the device flashes, reboots, and begins streaming boot logs.

---

## Step 3 — Capture DS18B20 ROM Addresses

The two DS18B20 sensors report their ROM addresses in the boot log on first run. These must be entered into the YAML manually so each sensor maps to a fixed entity.

1. In the boot log, locate the 1-Wire scan (GPIO4) listing both ROM addresses.
2. Copy each address into the corresponding sensor block in `rack-monitor.yaml`.
3. Re-flash to apply:

```bash
esphome run rack-monitor.yaml
```

> Without fixed ROM addresses, sensor-to-entity assignment can swap between boots — critical, since the DS18B20 readings drive the fan curve.

---

## Step 4 — Switch to Final Power

Once flashing is complete and verified:

1. Disconnect USB.
2. Connect the 12 V supply (MP1584 → 5 V rail).
3. The device boots, joins WiFi, and is reachable via:
   - Web server on port **80** (`http://rack-monitor.local` or its static IP)
   - mDNS hostname `rack-monitor.local`

Confirm the router has assigned the reserved static lease.

---

## Step 5 — Integrate into Home Assistant

1. In HA: **Settings → Apps** install ESPHome Device Builder.
1. In HA: **Settings → Devices & Services** open ESPHome.
1. ESPHome auto-discovers `rack-monitor` via mDNS — confirm the prompt. (If not discovered, add manually via **+ Add Integration → ESPHome** using the static IP.)
1. When prompted, supply the **API encryption key** from `rack-monitor.yaml` (inline, Variante A).

### Exposed entities

| Entity | Type | Notes |
|--------|------|-------|
| `auto_mode` | Switch | Enables automatic fan curve |
| `target_temp` | Number | 25–45 °C, default 28 °C |
| DS18B20 ×2 | Sensor | Fan-control temperatures |
| BMP280 | Sensor | Display only (temp/pressure) |
| Fan PWM ×2 | Output | GPIO25 / GPIO26 |
| Tachometer ×2 | Sensor | RPM, GPIO32 / GPIO33 |
| Diagnostics | Sensors | Uptime, WiFi signal, ESP32 internal temp, IP, status |
| Restart | Button | Remote reboot |

---

## Step 6 — Verify

- [ ] Device online in HA, status sensor reports connected
- [ ] Both DS18B20 readings plausible and distinct
- [ ] BMP280 reporting
- [ ] `auto_mode` and `target_temp` controllable from HA
- [ ] Web UI reachable on port 80
- [ ] Static IP held after reboot

---

## Subsequent Updates (OTA)

After the initial USB flash, all further updates run wirelessly — no physical connection needed:

```bash
esphome run rack-monitor.yaml   # select the OTA/network target
```

OTA password is stored in `secrets.yaml`.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| No `/dev/ttyUSB*` | Missing `dialout` membership | `usermod -aG dialout`, re-login |
| Serial drops during flash | VIN + USB powered together | Use USB only for flashing |
| Sensors swap between boots | ROM addresses not fixed | Enter ROM addresses from boot log |
| Not discovered in HA | mDNS not resolving | Add manually via static IP |
| IP changes after reboot | DHCP lease not reserved | Set static lease in router settings |