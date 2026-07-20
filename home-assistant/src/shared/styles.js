import { css } from "lit";

/* Design system shared by all cards: 16px rhythm, tile grids, header badge */
export const sharedStyles = css`
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

  /* tile grids */
  .grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
  }
  .grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
  }
  .tile {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .tile.unavailable .value {
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
  .value.small {
    font-size: 15px;
    line-height: 1.2;
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

  /* slim load/threshold bars */
  .bar {
    margin-top: 4px;
    height: 3px;
    border-radius: 1.5px;
    background: var(--secondary-background-color);
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 1.5px;
    transition: width 300ms ease, background 300ms ease;
  }
  .bar-fill.ok {
    background: var(--primary-color);
  }
  .bar-fill.warn {
    background: var(--warning-color, #e5a33b);
  }
  .bar-fill.crit {
    background: var(--error-color, #db4437);
  }
`;
