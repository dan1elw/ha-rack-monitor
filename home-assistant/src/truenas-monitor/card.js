import { LitElement, html, css, nothing } from "lit";
import { sharedStyles } from "../shared/styles.js";
import { isAvailable, fireMoreInfo, toBytes, formatBytes } from "../shared/helpers.js";

const STATE_KEYS = [
  "pool_usage_entity",
  "pool_used_entity",
  "pool_free_entity",
  "pool_status_entity",
  "alerts_entity",
  "scrub_entity",
];

/* ZFS capacity guidance: keep pools below ~80 %; overridable via config */
const DEFAULTS = {
  capacity_warn: 80,
  capacity_crit: 90,
};

/* Pool/system status → severity mapping */
const STATUS_MAP = {
  online: "ok",
  healthy: "ok",
  on: "ok",
  degraded: "warn",
  offline: "crit",
  faulted: "crit",
  error: "crit",
  unavail: "crit",
  off: "crit",
};

export class TruenasMonitorCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    if (!config.pool_usage_entity && !(config.pool_used_entity && config.pool_free_entity)) {
      throw new Error(
        "truenas-monitor-card: configure pool_usage_entity or pool_used_entity + pool_free_entity"
      );
    }
    this._config = { ...DEFAULTS, ...config };
  }

  static getConfigElement() {
    return document.createElement("truenas-monitor-card-editor");
  }

  static getStubConfig(hass) {
    const ids = hass ? Object.keys(hass.states) : [];
    const find = (regex) => ids.find((id) => regex.test(id)) || "";
    return {
      title: "TrueNAS",
      pool_name: "Tank",
      pool_used_entity: find(/^sensor\..*tank(_used)?$/),
      pool_free_entity: find(/^sensor\..*tank_free/),
      pool_usage_entity: find(/^sensor\..*tank.*(usage|percent)/),
      pool_status_entity: find(/^(sensor|binary_sensor)\..*(pool|tank).*(status|health)/),
      alerts_entity: find(/^sensor\..*alert/),
      scrub_entity: find(/^sensor\..*scrub/),
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

  _locale() {
    return this.hass?.locale?.language ?? "en";
  }

  /* Usage %, used/free/total bytes — from a % sensor and/or used+free sensors */
  _pool() {
    const usedBytes = toBytes(this._stateObj("pool_used_entity"));
    const freeBytes = toBytes(this._stateObj("pool_free_entity"));
    let pct = parseFloat(this._stateObj("pool_usage_entity")?.state);
    if (!Number.isFinite(pct) && Number.isFinite(usedBytes) && Number.isFinite(freeBytes)) {
      pct = (usedBytes / (usedBytes + freeBytes)) * 100;
    }
    return { pct, usedBytes, freeBytes };
  }

  _capacitySeverity(pct) {
    if (!Number.isFinite(pct)) return "ok";
    if (pct >= this._config.capacity_crit) return "crit";
    if (pct >= this._config.capacity_warn) return "warn";
    return "ok";
  }

  _statusSeverity(stateObj) {
    if (!isAvailable(stateObj)) return "crit";
    return STATUS_MAP[stateObj.state.toLowerCase()] ?? "warn";
  }

  _statusText(stateObj) {
    if (!isAvailable(stateObj)) return "Offline";
    const s = stateObj.state;
    if (s === "on") return "Online";
    if (s === "off") return "Offline";
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
  }

  /* Scrub age: numeric (days) or timestamp sensor */
  _scrub(stateObj) {
    if (!isAvailable(stateObj)) return "–";
    if (/^\d+(\.\d+)?$/.test(stateObj.state)) {
      return `vor ${Math.round(parseFloat(stateObj.state))} d`;
    }
    const d = new Date(stateObj.state);
    if (isNaN(d)) return stateObj.state;
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days > 0) return `vor ${days} d`;
    const hours = Math.floor((Date.now() - d.getTime()) / 3600000);
    return hours > 0 ? `vor ${hours} h` : "heute";
  }

  _online() {
    const statusObj = this._stateObj("status_entity");
    if (statusObj) return statusObj.state === "on";
    return STATE_KEYS.some((k) => this._config[k]) &&
      STATE_KEYS.filter((k) => this._config[k]).every((k) => isAvailable(this._stateObj(k)));
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

  /* ---------- render ---------- */

  render() {
    if (!this.hass || !this._config) return nothing;

    const online = this._online();
    const lastUpdated = this._lastUpdated();
    const { pct, usedBytes, freeBytes } = this._pool();
    const severity = this._capacitySeverity(pct);
    const poolTarget =
      this._config.pool_usage_entity || this._config.pool_used_entity;
    const hasSecondary =
      this._config.pool_status_entity ||
      this._config.alerts_entity ||
      this._config.scrub_entity;

    return html`
      <ha-card>
        <div class="header">
          <span class="title">${this._config.title ?? "TrueNAS"}</span>
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

        <div
          class="pool clickable"
          role="button"
          tabindex="0"
          @click=${() => fireMoreInfo(this, poolTarget)}
          @keydown=${(e) => e.key === "Enter" && fireMoreInfo(this, poolTarget)}
        >
          <span class="label">Pool · ${this._config.pool_name ?? "Tank"}</span>
          <div class="pool-line">
            <span class="value">
              ${Number.isFinite(pct) ? Math.round(pct) : "–"}<span class="unit">%</span>
            </span>
            <span class="pool-detail">
              ${Number.isFinite(usedBytes) && Number.isFinite(freeBytes)
                ? `${formatBytes(usedBytes, this._locale())} belegt · ${formatBytes(freeBytes, this._locale())} frei`
                : nothing}
            </span>
          </div>
          <div class="bar wide">
            <div
              class="bar-fill ${severity}"
              style="width: ${Number.isFinite(pct) ? Math.max(0, Math.min(100, pct)) : 0}%"
            ></div>
          </div>
        </div>

        ${hasSecondary ? html`<div class="divider"></div>` : nothing}
        ${hasSecondary
          ? html`<div class="grid-3">
              ${this._renderStatusTile()} ${this._renderAlertsTile()}
              ${this._renderScrubTile()}
            </div>`
          : nothing}
      </ha-card>
    `;
  }

  _tile(key, label, valueHtml) {
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
      </div>
    `;
  }

  _renderStatusTile() {
    if (!this._config.pool_status_entity) return nothing;
    const obj = this._stateObj("pool_status_entity");
    return this._tile(
      "pool_status_entity",
      this._config.pool_status_name ?? "Status",
      html`<span class="value small state-${this._statusSeverity(obj)}"
        >${this._statusText(obj)}</span
      >`
    );
  }

  _renderAlertsTile() {
    if (!this._config.alerts_entity) return nothing;
    const obj = this._stateObj("alerts_entity");
    const count = parseFloat(obj?.state);
    return this._tile(
      "alerts_entity",
      this._config.alerts_name ?? "Alerts",
      html`<span class="value small ${count > 0 ? "state-crit" : ""}"
        >${Number.isFinite(count) ? count : "–"}</span
      >`
    );
  }

  _renderScrubTile() {
    if (!this._config.scrub_entity) return nothing;
    const obj = this._stateObj("scrub_entity");
    return this._tile(
      "scrub_entity",
      this._config.scrub_name ?? "Scrub",
      html`<span class="value small">${this._scrub(obj)}</span>`
    );
  }

  static styles = [
    sharedStyles,
    css`
      .pool {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .pool-line {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .pool-detail {
        font-size: 13px;
        color: var(--secondary-text-color);
      }
      .bar.wide {
        height: 6px;
        border-radius: 3px;
        margin-top: 6px;
      }
      .bar.wide .bar-fill {
        border-radius: 3px;
      }
      .state-ok {
        color: var(--success-color, #43a047);
      }
      .state-warn {
        color: var(--warning-color, #e5a33b);
      }
      .state-crit {
        color: var(--error-color, #db4437);
      }
    `,
  ];
}

customElements.define("truenas-monitor-card", TruenasMonitorCard);
