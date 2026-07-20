import "./rack-monitor/card.js";
import "./rack-monitor/editor.js";
import "./host-monitor/card.js";
import "./host-monitor/editor.js";
import "./truenas-monitor/card.js";
import "./truenas-monitor/editor.js";
import { CARD_VERSION } from "./const.js";

/* Register all cards with the Lovelace card picker */
window.customCards = window.customCards || [];
window.customCards.push(
  {
    type: "rack-monitor-card",
    name: "Rack Monitor Card",
    description: "Minimalist rack temperature and fan monitoring with mode control",
    preview: true,
    documentationURL: "https://github.com/dan1elw/ha-rack-monitor",
  },
  {
    type: "host-monitor-card",
    name: "Host Monitor Card",
    description: "Minimalist host monitoring: CPU, RAM, temperature, uptime and disk",
    preview: true,
    documentationURL: "https://github.com/dan1elw/ha-rack-monitor",
  },
  {
    type: "truenas-monitor-card",
    name: "TrueNAS Monitor Card",
    description: "Minimalist NAS monitoring: pool capacity, status, alerts and scrub",
    preview: true,
    documentationURL: "https://github.com/dan1elw/ha-rack-monitor",
  }
);

console.info(
  `%c Rack Monitor Cards %c v${CARD_VERSION} `,
  "background: #1e2226; color: #e8eaed; font-weight: 600; border-radius: 4px 0 0 4px; padding: 2px 6px;",
  "background: #5b8fc7; color: #ffffff; border-radius: 0 4px 4px 0; padding: 2px 6px;"
);
