import { LitElement, html, css, nothing } from "lit";
import { fireConfigChanged, pruneConfig } from "../shared/helpers.js";

const SCHEMA = [
  { name: "title", selector: { text: {} } },
  {
    name: "metrics",
    type: "expandable",
    flatten: true,
    expanded: true,
    schema: [
      {
        name: "cpu_entity",
        required: true,
        selector: { entity: { domain: "sensor" } },
      },
      {
        name: "ram_entity",
        required: true,
        selector: { entity: { domain: "sensor" } },
      },
      {
        name: "temp_entity",
        selector: { entity: { domain: "sensor", device_class: "temperature" } },
      },
    ],
  },
  {
    name: "secondary",
    type: "expandable",
    flatten: true,
    schema: [
      { name: "uptime_entity", selector: { entity: { domain: "sensor" } } },
      { name: "disk_entity", selector: { entity: { domain: "sensor" } } },
      {
        name: "status_entity",
        selector: { entity: { domain: "binary_sensor" } },
      },
    ],
  },
  {
    name: "thresholds",
    type: "expandable",
    flatten: true,
    schema: [
      {
        name: "",
        type: "grid",
        schema: [
          { name: "warn_threshold", selector: { number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" } } },
          { name: "crit_threshold", selector: { number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" } } },
          { name: "temp_warn", selector: { number: { min: 0, max: 120, mode: "box", unit_of_measurement: "°C" } } },
          { name: "temp_crit", selector: { number: { min: 0, max: 120, mode: "box", unit_of_measurement: "°C" } } },
          { name: "temp_min", selector: { number: { min: 0, max: 120, mode: "box", unit_of_measurement: "°C" } } },
          { name: "temp_max", selector: { number: { min: 0, max: 120, mode: "box", unit_of_measurement: "°C" } } },
        ],
      },
    ],
  },
];

const LABELS = {
  title: "Title",
  metrics: "Metrics",
  secondary: "Uptime, disk & status",
  thresholds: "Thresholds",
  cpu_entity: "CPU usage",
  ram_entity: "RAM usage",
  temp_entity: "Host temperature",
  uptime_entity: "Uptime",
  disk_entity: "Disk usage",
  status_entity: "Status (connectivity)",
  warn_threshold: "Warn at (CPU/RAM/Disk)",
  crit_threshold: "Critical at (CPU/RAM/Disk)",
  temp_warn: "Temp warn",
  temp_crit: "Temp critical",
  temp_min: "Temp bar scale min",
  temp_max: "Temp bar scale max",
};

const HELPERS = {
  cpu_entity: "Percentage sensor, e.g. from the Proxmox integration",
  ram_entity: "Percentage sensor",
  temp_entity: "Optional, e.g. from Glances or lm-sensors",
  uptime_entity: "Optional. Timestamp or seconds sensor",
  status_entity: "Optional. Falls back to sensor availability if empty",
};

export class HostMonitorCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  setConfig(config) {
    this._config = config;
  }

  _computeLabel = (schema) => LABELS[schema.name] ?? schema.name;
  _computeHelper = (schema) => HELPERS[schema.name] ?? "";

  _valueChanged(ev) {
    ev.stopPropagation();
    fireConfigChanged(this, pruneConfig(ev.detail.value));
  }

  render() {
    if (!this.hass || !this._config) return nothing;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  static styles = css`
    ha-form {
      display: block;
    }
  `;
}

customElements.define("host-monitor-card-editor", HostMonitorCardEditor);
