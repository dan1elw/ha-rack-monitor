import { LitElement, html, css, nothing } from "lit";
import { CARD_TYPE } from "./const.js";

/* Entity config keys that carry state relevant for the online/last-update logic */
const STATE_KEYS = [
  "zone1_entity",
  "zone2_entity",
  "intake_entity",
  "fan1_entity",
  "fan1_rpm_entity",
  "fan2_entity",
  "fan2_rpm_entity",
  "mode_entity",
];

export class RackMonitorCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    if (!config.zone1_entity || !config.zone2_entity || !config.intake_entity) {
      throw new Error("rack-monitor-card: zone1_entity, zone2_entity and intake_entity are required");
    }
    this._config = config;
  }

  static getConfigElement() {
    return document.createElement("rack-monitor-card-editor");
  }

  /* Pre-fill the editor by guessing entities from a typical rack-monitor naming scheme */
  static getStubConfig(hass) {
    const ids = hass ? Object.keys(hass.states) : [];
    const find = (regex) => ids.find((id) => regex.test(id)) || "";
    return {
      title: "Rack Monitor",
      zone1_entity: find(/^sensor\..*zone_?1.*temp|^sensor\..*temp.*zone_?1/),
      zone2_entity: find(/^sensor\..*zone_?2.*temp|^sensor\..*temp.*zone_?2/),
      intake_entity: find(/^sensor\..*intake/),
      fan1_entity: find(/^fan\..*fan_?1/),
      fan1_rpm_entity: find(/^sensor\..*fan_?1.*rpm/),
      fan2_entity: find(/^fan\..*fan_?2/),
      fan2_rpm_entity: find(/^sensor\..*fan_?2.*rpm/),
      mode_entity: find(/^select\..*(mode|modus)/),
    };
  }

  getCardSize() {
    return 4;
  }

  /* ---------- state helpers ---------- */

  _stateObj(key) {
    const id = this._config?.[key];
    return id ? this.hass?.states[id] : undefined;
  }

  _available(stateObj) {
    return stateObj && stateObj.state !== "unavailable" && stateObj.state !== "unknown";
  }

  _temp(stateObj) {
    const v = parseFloat(stateObj?.state);
    return Number.isFinite(v) ? v.toFixed(1) : "–";
  }

  _unit(stateObj) {
    return stateObj?.attributes?.unit_of_measurement ?? "°C";
  }

  _rpm(stateObj) {
    const v = parseFloat(stateObj?.state);
    return Number.isFinite(v) ? Math.round(v).toString() : "–";
  }

  _pwm(fanObj) {
    if (!this._available(fanObj)) return "–";
    if (fanObj.state === "off") return "0";
    const p = fanObj.attributes?.percentage;
    return Number.isFinite(p) ? Math.round(p).toString() : "–";
  }

  _online() {
    const statusObj = this._stateObj("status_entity");
    if (statusObj) return statusObj.state === "on";
    /* Fallback: device counts as online if all required sensors are available */
    return ["zone1_entity", "zone2_entity", "intake_entity"].every((k) =>
      this._available(this._stateObj(k))
    );
  }

  _lastUpdated() {
    let newest;
    for (const key of STATE_KEYS) {
      const obj = this._stateObj(key);
      if (obj?.last_updated) {
        const d = new Date(obj.last_updated);
        if (!newest || d > newest) newest = d;
      }
    }
    return newest;
  }

  _setMode(option) {
    const modeObj = this._stateObj("mode_entity");
    if (!modeObj || modeObj.state === option) return;
    this.hass.callService("select", "select_option", {
      entity_id: this._config.mode_entity,
      option,
    });
  }

  /* Open the standard HA more-info dialog (state, history, attributes) */
  _moreInfo(entityId) {
    if (!entityId) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId },
        bubbles: true,
        composed: true,
      })
    );
  }

  _label(key, fallback) {
    const custom = this._config?.[`${key.replace("_entity", "")}_name`];
    if (custom) return custom;
    return fallback;
  }

  /* ---------- render ---------- */

  render() {
    if (!this.hass || !this._config) return nothing;

    const online = this._online();
    const lastUpdated = this._lastUpdated();
    const modeObj = this._stateObj("mode_entity");

    return html`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title ?? "Rack Monitor"}</span>
          <span
            class="status ${this._config.status_entity ? "clickable" : ""}"
            @click=${() => this._moreInfo(this._config.status_entity)}
          >
            <span class="dot ${online ? "online" : "offline"}"></span>
            ${!online && lastUpdated
              ? html`<ha-relative-time
                  .hass=${this.hass}
                  .datetime=${lastUpdated}
                ></ha-relative-time>`
              : nothing}
          </span>
        </div>

        <div class="temps">
          ${this._renderTemp("zone1_entity", "Zone 1")}
          ${this._renderTemp("zone2_entity", "Zone 2")}
          ${this._renderTemp("intake_entity", "Intake")}
        </div>

        ${this._hasFans() ? html`<div class="divider"></div>` : nothing}
        ${this._hasFans()
          ? html`<div class="fans">
              ${this._renderFan("fan1_entity", "fan1_rpm_entity", "Fan 1")}
              ${this._renderFan("fan2_entity", "fan2_rpm_entity", "Fan 2")}
            </div>`
          : nothing}

        ${modeObj ? this._renderModes(modeObj, online) : nothing}
      </ha-card>
    `;
  }

  _hasFans() {
    return this._config.fan1_entity || this._config.fan2_entity;
  }

  _renderTemp(key, fallbackLabel) {
    const obj = this._stateObj(key);
    return html`
      <div
        class="temp clickable ${this._available(obj) ? "" : "unavailable"}"
        role="button"
        tabindex="0"
        @click=${() => this._moreInfo(this._config[key])}
        @keydown=${(e) => e.key === "Enter" && this._moreInfo(this._config[key])}
      >
        <span class="label">${this._label(key, fallbackLabel)}</span>
        <span class="value">
          ${this._temp(obj)}<span class="unit">${this._unit(obj)}</span>
        </span>
      </div>
    `;
  }

  _renderFan(fanKey, rpmKey, fallbackLabel) {
    if (!this._config[fanKey] && !this._config[rpmKey]) return nothing;
    const fanObj = this._stateObj(fanKey);
    const rpmObj = this._stateObj(rpmKey);
    /* Tile click targets the RPM sensor (history focus), falls back to the fan entity */
    const target = this._config[rpmKey] || this._config[fanKey];
    return html`
      <div
        class="fan clickable"
        role="button"
        tabindex="0"
        @click=${() => this._moreInfo(target)}
        @keydown=${(e) => e.key === "Enter" && this._moreInfo(target)}
      >
        <span class="label">${this._label(fanKey, fallbackLabel)}</span>
        <span class="fan-value">
          ${this._rpm(rpmObj)} RPM
          ${fanObj
            ? html`<span
                class="fan-pwm"
                @click=${(e) => {
                  e.stopPropagation();
                  this._moreInfo(this._config[fanKey]);
                }}
                >· ${this._pwm(fanObj)} %</span
              >`
            : nothing}
        </span>
      </div>
    `;
  }

  _renderModes(modeObj, online) {
    const options = modeObj.attributes?.options ?? [];
    if (!options.length) return nothing;
    return html`
      <div class="modes ${online ? "" : "disabled"}">
        ${options.map(
          (option) => html`
            <button
              class="mode ${modeObj.state === option ? "active" : ""}"
              .disabled=${!online}
              @click=${() => this._setMode(option)}
            >
              ${option}
            </button>
          `
        )}
      </div>
    `;
  }

  static styles = css`
    ha-card {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 16px;
      box-sizing: border-box;
    }

    /* header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .title {
      font-size: 16px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .status {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: var(--secondary-text-color);
    }
    .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .dot.online {
      background: var(--success-color, #43a047);
    }
    .dot.offline {
      background: var(--error-color, #db4437);
    }

    /* temperatures */
    .temps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    .temp {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .temp.unavailable .value {
      color: var(--secondary-text-color);
    }
    .label {
      font-size: 11px;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      color: var(--secondary-text-color);
    }
    .value {
      font-size: 26px;
      font-weight: 500;
      line-height: 1.1;
      color: var(--primary-text-color);
    }
    .unit {
      font-size: 14px;
      font-weight: 400;
      color: var(--secondary-text-color);
      margin-left: 2px;
    }

    .divider {
      border-top: 1px solid var(--divider-color);
    }

    /* clickable areas: hover feedback without shifting the layout */
    .clickable {
      cursor: pointer;
      border-radius: 8px;
      margin: -6px;
      padding: 6px;
      transition: background 120ms ease;
    }
    .clickable:hover,
    .clickable:focus-visible {
      background: var(--secondary-background-color);
      outline: none;
    }
    .fan-pwm:hover {
      color: var(--primary-text-color);
    }

    /* fans: two tiles side by side, mirroring the temperature grid */
    .fans {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .fan {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .fan-value {
      font-size: 15px;
      font-weight: 500;
      line-height: 1.2;
      color: var(--primary-text-color);
    }
    .fan-pwm {
      font-size: 12px;
      font-weight: 400;
      color: var(--secondary-text-color);
    }

    /* mode segmented control */
    .modes {
      display: flex;
      flex-wrap: wrap;
      gap: 2px;
      padding: 3px;
      border-radius: 18px;
      background: var(--secondary-background-color);
    }
    .modes.disabled {
      opacity: 0.5;
    }
    .mode {
      flex: 1 1 0;
      min-width: 56px;
      padding: 6px 0;
      border: none;
      border-radius: 14px;
      background: transparent;
      font-family: inherit;
      font-size: 12px;
      color: var(--secondary-text-color);
      cursor: pointer;
      transition: background 120ms ease, color 120ms ease;
    }
    .mode:hover:not(.active):not(:disabled) {
      color: var(--primary-text-color);
    }
    .mode.active {
      background: var(--card-background-color);
      color: var(--primary-text-color);
      font-weight: 600;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }
    .mode:disabled {
      cursor: default;
    }
  `;
}

customElements.define(CARD_TYPE, RackMonitorCard);
