import { LitElement, html, css, nothing } from "lit";
import { sharedStyles } from "../shared/styles.js";
import { isAvailable, fireMoreInfo } from "../shared/helpers.js";

const STATE_KEYS = [
  "cpu_entity",
  "ram_entity",
  "temp_entity",
  "disk_entity",
  "uptime_entity",
];

/* Threshold defaults; all overridable via config */
const DEFAULTS = {
  warn_threshold: 75,
  crit_threshold: 90,
  temp_min: 30,
  temp_max: 90,
  temp_warn: 70,
  temp_crit: 80,
};

export class HostMonitorCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    if (!config.cpu_entity || !config.ram_entity) {
      throw new Error("host-monitor-card: cpu_entity and ram_entity are required");
    }
    this._config = { ...DEFAULTS, ...config };
  }

  static getConfigElement() {
    return document.createElement("host-monitor-card-editor");
  }

  static getStubConfig(hass) {
    const ids = hass ? Object.keys(hass.states) : [];
    const find = (regex) => ids.find((id) => regex.test(id)) || "";
    return {
      title: "Host Monitor",
      cpu_entity: find(/^sensor\..*cpu.*(used|usage|load|percent)/),
      ram_entity: find(/^sensor\..*(memory|ram).*(used|usage|percent)/),
      temp_entity: find(/^sensor\..*(cpu|package|core|host).*temp/),
      disk_entity: find(/^sensor\..*disk.*(used|usage|percent)/),
      uptime_entity: find(/^sensor\..*uptime/),
      status_entity: find(/^binary_sensor\..*(node|host).*status/),
    };
  }

  getCardSize() {
    return 3;
  }

  /* ---------- state helpers ---------- */

  _stateObj(key) {
    const id = this._config?.[key];
    return id ? this.hass?.states[id] : undefined;
  }

  _num(stateObj, digits = 0) {
    const v = parseFloat(stateObj?.state);
    return Number.isFinite(v) ? v.toFixed(digits) : "–";
  }

  _online() {
    const statusObj = this._stateObj("status_entity");
    if (statusObj) return statusObj.state === "on";
    return ["cpu_entity", "ram_entity"].every((k) => isAvailable(this._stateObj(k)));
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

  /* Severity for percentage metrics (CPU, RAM, Disk) */
  _pctSeverity(value) {
    if (!Number.isFinite(value)) return "ok";
    if (value >= this._config.crit_threshold) return "crit";
    if (value >= this._config.warn_threshold) return "warn";
    return "ok";
  }

  /* Severity for the temperature metric */
  _tempSeverity(value) {
    if (!Number.isFinite(value)) return "ok";
    if (value >= this._config.temp_crit) return "crit";
    if (value >= this._config.temp_warn) return "warn";
    return "ok";
  }

  /* Uptime: supports timestamp sensors (boot time) and numeric seconds */
  _uptime(stateObj) {
    if (!isAvailable(stateObj)) return "–";
    let seconds;
    if (/^\d+(\.\d+)?$/.test(stateObj.state)) {
      seconds = parseFloat(stateObj.state);
    } else {
      const d = new Date(stateObj.state);
      if (isNaN(d)) return stateObj.state;
      seconds = (Date.now() - d.getTime()) / 1000;
    }
    if (!Number.isFinite(seconds) || seconds < 0) return "–";
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (days > 0) return `${days} d ${hours} h`;
    if (hours > 0) return `${hours} h ${mins} min`;
    return `${mins} min`;
  }

  /* ---------- render ---------- */

  render() {
    if (!this.hass || !this._config) return nothing;

    const online = this._online();
    const lastUpdated = this._lastUpdated();
    const hasSecondary = this._config.uptime_entity || this._config.disk_entity;

    return html`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title ?? "Host Monitor"}</span>
          <span
            class="status ${this._config.status_entity ? "clickable" : ""}"
            @click=${() => fireMoreInfo(this, this._config.status_entity)}
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

        <div class="grid-3">
          ${this._renderPct("cpu_entity", "CPU")}
          ${this._renderPct("ram_entity", "RAM")}
          ${this._renderTemp()}
        </div>

        ${hasSecondary ? html`<div class="divider"></div>` : nothing}
        ${hasSecondary
          ? html`<div class="grid-2">
              ${this._renderUptime()} ${this._renderDisk()}
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  _tile({ key, label, valueHtml, bar }) {
    const obj = this._stateObj(key);
    return html`
      <div
        class="tile clickable ${isAvailable(obj) ? "" : "unavailable"}"
        role="button"
        tabindex="0"
        @click=${() => fireMoreInfo(this, this._config[key])}
        @keydown=${(e) => e.key === "Enter" && fireMoreInfo(this, this._config[key])}
      >
        <span class="label">${label}</span>
        ${valueHtml}
        ${bar
          ? html`<div class="bar">
              <div
                class="bar-fill ${bar.severity}"
                style="width: ${Math.max(0, Math.min(100, bar.fraction * 100))}%"
              ></div>
            </div>`
          : nothing}
      </div>
    `;
  }

  _renderPct(key, fallbackLabel, small = false) {
    const obj = this._stateObj(key);
    const value = parseFloat(obj?.state);
    return this._tile({
      key,
      label: this._config[`${key.replace("_entity", "")}_name`] ?? fallbackLabel,
      valueHtml: html`<span class="value ${small ? "small" : ""}">
        ${this._num(obj)}<span class="unit">%</span>
      </span>`,
      bar: {
        fraction: Number.isFinite(value) ? value / 100 : 0,
        severity: this._pctSeverity(value),
      },
    });
  }

  _renderTemp() {
    if (!this._config.temp_entity) return nothing;
    const obj = this._stateObj("temp_entity");
    const value = parseFloat(obj?.state);
    const { temp_min, temp_max } = this._config;
    return this._tile({
      key: "temp_entity",
      label: this._config.temp_name ?? "Temp",
      valueHtml: html`<span class="value">
        ${this._num(obj, 1)}<span class="unit"
          >${obj?.attributes?.unit_of_measurement ?? "°C"}</span
        >
      </span>`,
      bar: {
        fraction: Number.isFinite(value)
          ? (value - temp_min) / (temp_max - temp_min)
          : 0,
        severity: this._tempSeverity(value),
      },
    });
  }

  _renderUptime() {
    if (!this._config.uptime_entity) return nothing;
    const obj = this._stateObj("uptime_entity");
    return this._tile({
      key: "uptime_entity",
      label: this._config.uptime_name ?? "Uptime",
      valueHtml: html`<span class="value small">${this._uptime(obj)}</span>`,
    });
  }

  _renderDisk() {
    if (!this._config.disk_entity) return nothing;
    const obj = this._stateObj("disk_entity");
    const value = parseFloat(obj?.state);
    return this._tile({
      key: "disk_entity",
      label: this._config.disk_name ?? "Disk",
      valueHtml: html`<span class="value small">
        ${this._num(obj)}<span class="unit">%</span>
      </span>`,
      bar: {
        fraction: Number.isFinite(value) ? value / 100 : 0,
        severity: this._pctSeverity(value),
      },
    });
  }

  static styles = [sharedStyles];
}

customElements.define("host-monitor-card", HostMonitorCard);
