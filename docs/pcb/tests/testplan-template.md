# Rack Monitor — PCB Bring-Up Test Plan

**Board:** rack-monitor Rev 1.3 (EasyEDA, 2026-08-22)
**Pre-mounted SMD:** resistors, 100nF und 1uF caps, BSS138, S8050, 2A fuse, D1 LED
**Plan version:** 1.0

---

## Board allocation

| Board | Role | Notes |
|---|---|---|
| #1 | **Primary build** | Follows phases 1–6 in order |
| #2 | Spare / second unit | Build only after #1 passes Gate 6 |
| #3, #4 | Reserve | Untouched |
| #5 | **Sacrificial** | Phase X destructive tests + rework practice |

---

## Safety rules (apply throughout)

- [ ] Bench supply current limit is set **before** the output is enabled, never after
- [ ] Safety glasses on for every test involving reverse polarity or a deliberate short — a reversed 1000 µF electrolytic can vent
- [ ] **12 V or USB — never both.** DevKit-C VIN and USB 5 V share the LDO input; many boards have no reverse-current diode
- [ ] Soldering iron unplugged from the board before applying power
- [ ] Anti-static precautions when handling the DevKit and the DS18B20s
- [ ] Destructive tests (Phase X) happen on board #5 only, in a box or behind a shield, never on the bench next to the good boards

---

## Equipment

- [ ] Multimeter (Ω, continuity, diode test, DC V, DC A)
- [ ] Current-limited bench supply, 12 V — *or* 12 V PSU + multimeter in series as ammeter
- [ ] Oscilloscope *(optional; alternatives noted where it matters)*
- [ ] Soldering iron, flux, desoldering braid
- [ ] Magnification (loupe or phone macro)
- [ ] Dummy load: ~10 Ω / 5 W and ~24 Ω / 5 W
- [ ] Known-value resistor for pull-up measurement: 47 kΩ
- [ ] One Arctic 4-pin fan (for pinout comparison, not yet connected)

---

## Solder order (through-hole)

Do **not** solder ahead of the plan. Each phase names what to add.

1. DC barrel jack
2. C4, C5 (1000 µF)
3. U4 — MP1584 module *(pre-trimmed, see 3.1)*
4. ESP32 socket strips
5. T1–T3 sensor headers
6. M1, M2 fan headers
7. D2 LED-stripe header
8. UART header

---

# Phase 1 — Visual inspection

*No power. Nothing soldered yet.*

- [ ] **1.1** Solder bridges between adjacent pads — check Q2/Q3 (SOT-23, three tight pins) under magnification
- [ ] **1.2** Solder bridges along the ESP socket pad rows
- [ ] **1.3** No tombstoned or skewed 0603/0805 parts
- [ ] **1.4** No cold joints (dull, balled solder instead of a concave fillet)
- [ ] **1.5** Resistor values match their positions:
  - [ ] R1 = 4.7k
  - [ ] R3 = 2.2k
  - [ ] R7 = 1k
  - [ ] R2, R4, R5, R6, R8, R9, R10, R11 = 10k
- [ ] **1.6** Polarity markings present and readable: C4, C5, U4, Q1, D1
- [ ] **1.7** Barrel jack footprint — identify which pad is the centre pin
- [ ] **1.8** Photograph both sides at high resolution (reference for later fault-finding)

> **Gate 1** — No visible defects. All resistor values in their intended positions.
> `Passed: ☐    Date: __________`

---

# Phase 2 — Multimeter

*Still no power. Nothing soldered yet.*

## 2.1 Short check

Expect open circuit or > 1 MΩ.

- [ ] 12V ↔ GND — measured: __________
- [ ] 5V ↔ GND — measured: __________
- [ ] 3V3 ↔ GND — measured: __________
- [ ] 3V3 ↔ 5V — measured: __________

## 2.2 Resistors in-circuit

In-circuit values may read **lower** than nominal (parallel paths), never higher.

| Ref | Nominal | Function | Measured | OK |
|---|---|---|---|---|
| R2 | 10k | EN pull-up | __________ | ☐ |
| R4 | 10k | GPIO0 pull-up | __________ | ☐ |
| R5 | 10k | M1 tach pull-up | __________ | ☐ |
| R6 | 10k | M2 tach pull-up | __________ | ☐ |
| R8 | 10k | Q2 drain pull-up (5V) | __________ | ☐ |
| R9 | 10k | Q2 source pull-up (3V3) | __________ | ☐ |
| R10 | 10k | Q3 source pull-up (3V3) | __________ | ☐ |
| R11 | 10k | Q3 drain pull-up (5V) | __________ | ☐ |
| R3 | 2.2k | D1 series | __________ | ☐ |
| R7 | 1k | Q1 base | __________ | ☐ |
| R1 | 4.7k | 1-Wire series | __________ | ☐ |

## 2.3 Fuse

- [ ] F1 continuity ≈ 0 Ω — measured: __________

## 2.4 Level shifter orientation

Diode test mode. A reversed BSS138 leaves the shifter stuck high.

- [ ] Q2: Source → Drain ≈ 0.6 V forward — measured: __________
- [ ] Q2: Drain → Source blocks
- [ ] Q3: Source → Drain ≈ 0.6 V forward — measured: __________
- [ ] Q3: Drain → Source blocks
- [ ] Q2 gate connects to 3V3
- [ ] Q3 gate connects to 3V3

## 2.5 Header pinout verification

**The most important step in this phase.** Ring out every header pin against its net, then compare against the physical connector that will plug in.

**M1 / M2 fan headers.** The schematic draws PWM / Tach / 12V / GND, which is the reverse of the Intel 4-wire standard (pin 1 GND, 2 +12V, 3 Sense, 4 PWM). Whether this matters depends entirely on where the keying notch sits on the footprint. A mismatch puts 12 V directly onto GPIO33.

Arctic cable colours: **black = GND, yellow = +12V, green = Tach, blue = PWM**.

- [ ] confirm arcitc pwm-fan pinout
- [ ] M2 matches M1
- [ ] **Keying notch orientation confirmed — fan plugs in the correct way round**

**T1–T3 sensor headers** (DATA / GND / 3V3):

- [ ] T1 mapping confirmed against sensor cable
- [ ] T2 mapping confirmed
- [ ] T3 mapping confirmed

**Other:**

- [ ] UART header: tx / rx / gnd correct
- [ ] DC jack: centre pin reaches F1, barrel reaches GND

> **Gate 2** — No shorts. All values plausible. FET orientation correct. **Fan header pinout confirmed against the actual cable.**
> `Passed: ☐    Date: __________`

---

# Phase 3 — Power path only

*ESP socket stays empty for this entire phase.*

## 3.1 Pre-trim the MP1584 — off the board

These modules ship at varying output settings. Discovering that with the ESP32 installed costs the ESP32.

- [ ] Connect U4 standalone to bench supply at 12 V
- [ ] Attach dummy load ~100 mA
- [ ] Trim to **5.00 V** — measured: __________
- [ ] Re-check after 2 minutes (thermal drift) — measured: __________

## 3.2 Solder

- [ ] DC barrel jack
- [ ] C4, C5 (1000 µF) — **check polarity twice**
- [ ] U4 (pre-trimmed)

## 3.3 First power-on

- [ ] Bench supply set to 12 V, current limit **150 mA**, output still off
- [ ] *(No lab supply: 12 V PSU with multimeter in series as ammeter)*
- [ ] Verify PSU polarity at the plug before connecting
- [ ] Power on — supply does **not** go into current limit

Measure:

- [ ] 12 V downstream of F1 — measured: __________
- [ ] 5 V at ESP socket pin 19 (ESP-Right) — measured: __________
- [ ] 3V3 rail = **0 V** (correct — it comes from the DevKit LDO, not installed) — measured: __________
- [ ] Quiescent current, few mA — measured: __________

## 3.4 Load test

- [ ] Raise current limit to 800 mA
- [ ] Apply ~10 Ω / 5 W across 5V (≈ 500 mA)
- [ ] 5 V under load, droop < 100 mV — measured: __________
- [ ] Input current at 12 V — measured: __________
- [ ] Efficiency sanity check: `(5V × I_out) / (12V × I_in)` should land around 80–90 % — calculated: __________
- [ ] After 5 min: U4 hand-warm, not hot — temperature: __________
- [ ] Remove load

## 3.5 Ripple *(scope)*

- [ ] 5 V ripple < 50 mV pp — measured: __________
- [ ] No overshoot spike at switch-on
- [ ] *(No scope: skip, but keep the 5.00 V reading under load as the acceptance criterion)*

> **Gate 3** — 5.00 V ± 50 mV under load. No switch-on overshoot. Thermally unremarkable.
> `Passed: ☐    Date: __________`

---

# Phase 4 — ESP32

## 4.1 Socket

- [ ] Solder **socket strips**, not the DevKit itself — it is the most expensive and most swappable part
- [ ] Check socket rows for bridges before inserting anything
- [ ] Insert DevKit, confirm it seats fully and the orientation matches the silkscreen

## 4.2 Powered checks (12 V, USB disconnected)

- [ ] Current limit back to 300 mA
- [ ] 3V3 at U2 pin 1 — measured: __________
- [ ] EN ≈ 3.3 V — measured: __________
- [ ] GPIO0 ≈ 3.3 V — measured: __________
- [ ] GPIO12 ≈ 0 V — measured: __________ *(strapping pin; low is the correct boot state)*
- [ ] Idle current draw — measured: __________

## 4.3 Minimal firmware

- [ ] **Disconnect 12 V**
- [ ] Flash over USB: WiFi + API + logger only, **no peripherals configured**
- [ ] Boots cleanly, no boot loop
- [ ] WiFi connects, RSSI logged: __________
- [ ] Disconnect USB, reconnect 12 V — boots identically on board power
- [ ] 30 min idle: no reboots, no WiFi dropouts

> **Gate 4** — Clean boot, no boot loop, stable WiFi for 30 minutes on board power.
> `Passed: ☐    Date: __________`

---

# Phase 5 — Peripherals, one subsystem at a time

Use a **test firmware with manual per-GPIO controls**, not the full application. Fault isolation matters more than convenience here.

## 5.1 Temperature sensors

- [ ] Solder T1, T2, T3
- [ ] Connect **one** DS18B20 → address found, reading plausible — address: __________
- [ ] Add second sensor, rescan → both found
- [ ] Add third sensor, rescan → all three found
- [ ] Final cable lengths in place (not bench jumpers)
- [ ] 15 min log: no `NAN`, no CRC errors

> A sensor that works alone but disappears in company points at bus timing, not a solder fault. See the separate 1-Wire pull-up ticket.

> **Gate 5.1** — Three addresses stable for 15 min at final cable length, zero CRC errors.
> `Passed: ☐    Date: __________`

## 5.2 PWM output — no fan connected

- [ ] Solder M1, M2 headers
- [ ] Drive 25 kHz at each duty, measure at the header PWM pin in **DC mode**:

| Duty | Expected DC | Measured |
|---|---|---|
| 0 % | ~0 V | __________ |
| 25 % | ~1.25 V | __________ |
| 50 % | ~2.5 V | __________ |
| 100 % | ~5 V | __________ |

- [ ] *(Scope)* Frequency = 25 kHz
- [ ] *(Scope)* Amplitude = 5 V
- [ ] *(Scope)* Rising edge not visibly rounded

> The BSS138 shifter is open-drain and pulls high only through R8/R10 (10 kΩ). Rounded edges → parallel 2.2–4.7 kΩ onto R8/R10.

> **Gate 5.2** — DC averages track the setpoint linearly; 5 V reached at 100 %.
> `Passed: ☐    Date: __________`

## 5.3 Fan M1

- [ ] Connect M1 **only** — double-check plug orientation against 2.5
- [ ] Ramp 0 → 100 %, fan responds across the range
- [ ] Tach idle level = 3.3 V — measured: __________
- [ ] RPM at 100 % vs. datasheet — measured: __________
- [ ] RPM at 50 % — measured: __________
- [ ] RPM at 25 % — measured: __________
- [ ] Hold 50 % for 10 min — **no ghost readings in the hundred-thousands**

> Ghost RPM reappearing here is coupling, not a solder fault. Fix: 1 kΩ series + 10 nF to GND added at the header.

## 5.4 Fan M2

- [ ] Same procedure as 5.3 for M2 alone
- [ ] Both fans together, full ramp
- [ ] Total system current at 100 % both fans — measured: __________

> **Gate 5.3/5.4** — Full-range control on both channels, stable RPM, no ghost values over 10 min.
> `Passed: ☐    Date: __________`

## 5.5 LED outputs

- [ ] **Measure LED stripe current standalone first** — measured: __________
- [ ] Confirm the stripe has its own series resistor (the board has none)
- [ ] **Decision:** current > 100 mA → move stripe to 5V, do not run it off 3V3

> 3V3 is the DevKit's onboard LDO, already carrying the ESP32's 500 mA peaks. There is no headroom there.

- [ ] Solder Q1 (S8050) and D2 header
- [ ] GPIO16 toggles the stripe on/off
- [ ] 3V3 with stripe on, stays above 3.2 V — measured: __________
- [ ] DevKit LDO hand-warm after 10 min
- [ ] Solder D1, toggle GPIO12 — status LED works
- [ ] Reboot with LED driven — ESP32 still boots normally (GPIO12 strapping check)

> **Gate 5.5** — 3V3 stays above 3.2 V with LEDs on, LDO hand-warm, boot unaffected.
> `Passed: ☐    Date: __________`

## 5.6 UART header

- [ ] Solder last
- [ ] Verify tx/rx against an external adapter with **USB disconnected** — TX0/RX0 are shared with the onboard bridge

---

# Phase 6 — Burn-in

- [ ] Full production firmware flashed
- [ ] Installed in rack, final cable lengths, final mounting
- [ ] Both fans active, automatic control enabled
- [ ] 24 h continuous run

Acceptance:

- [ ] Zero reboots
- [ ] Zero WiFi dropouts
- [ ] U4 below 60 °C — max observed: __________
- [ ] No RPM anomalies
- [ ] No sensor gaps or `NAN`
- [ ] Max temperature reading plausible vs. actual rack conditions

> **Gate 6** — 24 h clean. Board #1 accepted for production use.
> `Passed: ☐    Date: __________`

---

# Phase X — Destructive tests (board #5 only)

Run these **in parallel with phases 1–3**, so the findings are available before board #1 is finished. Each test is listed with what it buys you, so you can skip the ones you don't need.

**Before starting:** safety glasses, board in a box or behind a shield, well away from the good boards.

## X.1 Rework practice — highest value, zero risk

Do this first. It de-risks every later repair, including the pending 1-Wire fix.

- [ ] Piggyback a resistor onto R1 without disturbing the original
- [ ] Solder a 4.7 kΩ between DATA and 3V3 at T1 (the fix from the open ticket)
- [ ] Remove both again cleanly with braid
- [ ] Desolder and re-solder a BSS138
- [ ] Desolder a 1000 µF electrolytic and a header

> **Outcome:** you know the fix is physically doable before you need it under pressure.

## X.2 Fan header keying — settle 2.5 definitively

- [ ] Plug the real Arctic connector into M1 on board #5
- [ ] With the plug seated, ring out each fan wire to its board net
- [ ] Record the actual mapping: __________________________

> **Outcome:** the keying question is answered with the real connector, with nothing at risk.

## X.3 Reverse polarity — quantify the missing protection

The board has no reverse-polarity FET. This tells you what a wrong plug actually costs.

- [ ] Build board #5 to Phase 3 state (jack, C4, C5, U4), **ESP socket empty**
- [ ] Safety glasses on, board in a box
- [ ] Bench supply **reversed**, 12 V, current limit **100 mA**
- [ ] Apply briefly (< 2 s), watch the current
- [ ] Current went to: __________
- [ ] Power off, inspect: C4/C5 bulging or vented? __________
- [ ] F1 still intact? __________
- [ ] U4 damaged? Test forward operation afterwards: __________

> **Outcome:** decide whether to add an inline Schottky or a P-FET to boards #1/#2. If the electrolytics vent at 100 mA, the answer is yes.

**Do not exceed 100 mA limit and do not extend the duration.** The point is to observe the failure mode, not to maximise it.

## X.4 Fuse characterisation

F1 is rated 2 A, while the board draws well under 1 A in normal operation. Worth knowing what it actually protects against.

- [ ] Board #5, 12 V in, no supply current limit *(or limit set to 5 A)*
- [ ] Apply a resistive load directly across the 12 V rail, stepping down: 12 Ω (1 A), 8 Ω (1.5 A), 6 Ω (2 A), 4 Ω (3 A)
- [ ] Current at which F1 opens — measured: __________
- [ ] Time to open at that current — measured: __________
- [ ] Any PCB trace discolouration before the fuse opened? __________

> **Outcome:** if traces heat before the fuse opens, F1 is protecting the PSU, not the board. Relevant for whether a lower-rated fuse makes sense.

## X.5 5 V rail short — MP1584 behaviour

- [ ] New fuse or bypass F1 on board #5
- [ ] Short 5V to GND briefly, 12 V applied
- [ ] U4 hiccups and recovers, or fails permanently? __________
- [ ] Does F1 open before U4 dies? __________

> **Outcome:** tells you whether a downstream short kills the buck module. Informs whether phases 4–5 need a series resistor on the 5 V rail as a safety net.

## X.6 USB + 12 V simultaneously — quantify the backfeed

The one test that answers a rule you'd otherwise just have to obey blindly.

- [ ] Board #5 with a **sacrificial DevKit** (an old or cheap one)
- [ ] 12 V on, 5 V rail confirmed at 5.00 V
- [ ] USB cable via a **USB power meter** or a multimeter in the 5 V line
- [ ] Connect USB with 12 V still applied
- [ ] Current flowing into the USB port — measured: __________
- [ ] Direction of flow: __________
- [ ] Anything heating: __________

> **Outcome:** if backfeed is under ~50 mA the rule stays a precaution; if it's hundreds of mA, add an SS34 Schottky in the 5 V line to pin 19 on boards #1/#2.

## X.7 Thermal headroom

- [ ] Board #5 at Phase 3 state
- [ ] Load 5 V rail to 800 mA continuously for 30 min
- [ ] U4 temperature — measured: __________
- [ ] Input current, efficiency at that point — measured: __________
- [ ] Any thermal shutdown or output droop? __________

> **Outcome:** establishes the real ceiling, which matters if the LED stripe ends up on the 5 V rail (see 5.5).

## X.8 Trace resistance sanity check

- [ ] 4-wire or low-Ω measurement from jack centre pin to U4 IN+ — measured: __________
- [ ] From U4 OUT+ to ESP socket pin 19 — measured: __________

> **Outcome:** values in the tens of mΩ are fine. Hundreds of mΩ suggests thin copper on the power path, which shows up as droop under fan load.

---

# Findings log

| Date | Phase | Observation | Action taken |
|---|---|---|---|
| | | | |
| | | | |
| | | | |
| | | | |

---

# Open items carried forward

- **1-Wire pull-up** — R1 in series, no pull-up to 3V3, bus runs on the ESP32's internal ~45 kΩ. Deferred; see separate ticket. Watch for CRC errors in 5.1 and Phase 6.
- **Tach RC filters** — not present on Rev 1.3. Fix ready if 5.3 reproduces the ghost readings.
- **Reverse polarity protection** — absent. Decision pending on X.3.
- **USB/12 V backfeed** — rule in force; quantification pending on X.6.
