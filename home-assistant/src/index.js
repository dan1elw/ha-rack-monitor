import "./rack-monitor-card.js";
import "./editor.js";
import { CARD_VERSION, CARD_TYPE, CARD_NAME } from "./const.js";

/* Register with the Lovelace card picker */
window.customCards = window.customCards || [];
window.customCards.push({
  type: CARD_TYPE,
  name: CARD_NAME,
  description: "Minimalist rack temperature and fan monitoring with mode control",
  preview: true,
  documentationURL: "https://github.com/dan1elw/ha-rack-monitor",
});

console.info(
  `%c ${CARD_NAME} %c v${CARD_VERSION} `,
  "background: #1e2226; color: #e8eaed; font-weight: 600; border-radius: 4px 0 0 4px; padding: 2px 6px;",
  "background: #5b8fc7; color: #ffffff; border-radius: 0 4px 4px 0; padding: 2px 6px;"
);
