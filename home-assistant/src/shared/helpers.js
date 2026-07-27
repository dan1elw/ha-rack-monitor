/* Shared helpers for all cards */

export const isAvailable = (stateObj) =>
  stateObj && stateObj.state !== "unavailable" && stateObj.state !== "unknown";

export function fireMoreInfo(element, entityId) {
  if (!entityId) return;
  element.dispatchEvent(
    new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true,
    })
  );
}

export function fireConfigChanged(element, config) {
  element.dispatchEvent(
    new CustomEvent("config-changed", {
      detail: { config },
      bubbles: true,
      composed: true,
    })
  );
}

/* Drop empty keys to keep the stored YAML clean */
export function pruneConfig(config) {
  const clean = { ...config };
  for (const key of Object.keys(clean)) {
    if (clean[key] === "" || clean[key] === undefined) delete clean[key];
  }
  return clean;
}

/* ---- data size handling (pool capacity etc.) ---- */

const UNIT_FACTORS = {
  b: 1,
  kb: 1e3, mb: 1e6, gb: 1e9, tb: 1e12, pb: 1e15,
  kib: 1024, mib: 1024 ** 2, gib: 1024 ** 3, tib: 1024 ** 4, pib: 1024 ** 5,
};

/* Convert a sensor state + unit_of_measurement to bytes; NaN if not parseable */
export function toBytes(stateObj) {
  const v = parseFloat(stateObj?.state);
  if (!Number.isFinite(v)) return NaN;
  const unit = (stateObj.attributes?.unit_of_measurement ?? "b").trim().toLowerCase();
  const factor = UNIT_FACTORS[unit];
  return factor ? v * factor : NaN;
}

/* Format bytes as a compact human-readable string, locale-aware */
export function formatBytes(bytes, locale = "en") {
  if (!Number.isFinite(bytes)) return "–";
  const steps = [
    [1e15, "PB"], [1e12, "TB"], [1e9, "GB"], [1e6, "MB"], [1e3, "kB"],
  ];
  for (const [factor, unit] of steps) {
    if (bytes >= factor) {
      const n = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(bytes / factor);
      return `${n} ${unit}`;
    }
  }
  return `${Math.round(bytes)} B`;
}

