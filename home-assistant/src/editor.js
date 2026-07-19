import { LitElement, html, css, nothing } from "lit";

/*
 * Guided setup: ha-form renders native entity pickers, filtered by
 * domain / device_class, so every field only offers matching entities.
 */
const SCHEMA = [
  { name: "title", selector: { text: {} } },
  {
    name: "temperatures",
    type: "expandable",
    flatten: true,
    expanded: true,
    schema: [
      {
        name: "zone1_entity",
        required: true,
        selector: { entity: { domain: "sensor", device_class: "temperature" } },
      },
      {
        name: "zone2_entity",
        required: true,
        selector: { entity: { domain: "sensor", device_class: "temperature" } },
      },
      {
        name: "intake_entity",
        required: true,
        selector: { entity: { domain: "sensor", device_class: "temperature" } },
      },
    ],
  },
  {
    name: "fans",
    type: "expandable",
    flatten: true,
    expanded: true,
    schema: [
      {
        name: "",
        type: "grid",
        schema: [
          { name: "fan1_entity", selector: { entity: { domain: "fan" } } },
          { name: "fan1_rpm_entity", selector: { entity: { domain: "sensor" } } },
          { name: "fan2_entity", selector: { entity: { domain: "fan" } } },
          { name: "fan2_rpm_entity", selector: { entity: { domain: "sensor" } } },
        ],
      },
    ],
  },
  {
    name: "control",
    type: "expandable",
    flatten: true,
    schema: [
      { name: "mode_entity", selector: { entity: { domain: "select" } } },
      {
        name: "status_entity",
        selector: { entity: { domain: "binary_sensor", device_class: "connectivity" } },
      },
    ],
  },
];

const LABELS = {
  title: "Title",
  temperatures: "Temperatures",
  fans: "Fans",
  control: "Control & status",
  zone1_entity: "Zone 1 temperature",
  zone2_entity: "Zone 2 temperature",
  intake_entity: "Intake temperature",
  fan1_entity: "Fan 1",
  fan1_rpm_entity: "Fan 1 RPM sensor",
  fan2_entity: "Fan 2",
  fan2_rpm_entity: "Fan 2 RPM sensor",
  mode_entity: "Mode select",
  status_entity: "Status (connectivity)",
};

const HELPERS = {
  fan1_entity: "Fan entity, used for the PWM duty (%)",
  fan2_entity: "Fan entity, used for the PWM duty (%)",
  mode_entity: "Optional. Shows the mode bar (Off / On / Auto / …)",
  status_entity: "Optional. Falls back to sensor availability if empty",
};

export class RackMonitorCardEditor extends LitElement {
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
    const config = { ...ev.detail.value };
    /* Drop empty keys to keep the YAML clean */
    for (const key of Object.keys(config)) {
      if (config[key] === "" || config[key] === undefined) delete config[key];
    }
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      })
    );
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

customElements.define("rack-monitor-card-editor", RackMonitorCardEditor);
