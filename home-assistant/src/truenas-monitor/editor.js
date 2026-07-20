import { LitElement, html, css, nothing } from "lit";
import { fireConfigChanged, pruneConfig } from "../shared/helpers.js";

const SCHEMA = [
  { name: "title", selector: { text: {} } },
  {
    name: "pool",
    type: "expandable",
    flatten: true,
    expanded: true,
    schema: [
      { name: "pool_name", selector: { text: {} } },
      { name: "pool_used_entity", selector: { entity: { domain: "sensor" } } },
      { name: "pool_free_entity", selector: { entity: { domain: "sensor" } } },
      { name: "pool_usage_entity", selector: { entity: { domain: "sensor" } } },
    ],
  },
  {
    name: "info",
    type: "expandable",
    flatten: true,
    schema: [
      { name: "pool_status_entity", selector: { entity: {} } },
      { name: "alerts_entity", selector: { entity: { domain: "sensor" } } },
      { name: "scrub_entity", selector: { entity: { domain: "sensor" } } },
      { name: "status_entity", selector: { entity: { domain: "binary_sensor" } } },
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
          { name: "capacity_warn", selector: { number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" } } },
          { name: "capacity_crit", selector: { number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" } } },
        ],
      },
    ],
  },
];

const LABELS = {
  title: "Title",
  pool: "Pool",
  info: "Status & info",
  thresholds: "Thresholds",
  pool_name: "Pool name",
  pool_used_entity: "Pool used",
  pool_free_entity: "Pool free",
  pool_usage_entity: "Pool usage (%)",
  pool_status_entity: "Pool status",
  alerts_entity: "Alerts",
  scrub_entity: "Last scrub",
  status_entity: "Device status (connectivity)",
  capacity_warn: "Capacity warn",
  capacity_crit: "Capacity critical",
};

const HELPERS = {
  pool_used_entity: "Data size sensor, e.g. sensor.tank",
  pool_free_entity: "Data size sensor, e.g. sensor.tank_free",
  pool_usage_entity: "Optional. Direct % sensor; otherwise computed from used + free",
  pool_status_entity: "Optional. Text (ONLINE/DEGRADED/…) or binary sensor",
  scrub_entity: "Optional. Days-since or timestamp sensor",
  status_entity: "Optional. Falls back to sensor availability if empty",
};

export class TruenasMonitorCardEditor extends LitElement {
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

customElements.define("truenas-monitor-card-editor", TruenasMonitorCardEditor);
