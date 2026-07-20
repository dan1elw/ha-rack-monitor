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
