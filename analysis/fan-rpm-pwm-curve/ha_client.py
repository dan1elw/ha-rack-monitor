"""Minimal, reusable Home Assistant REST API client.

Authentication: long-lived access token (HA profile -> Security).
Base URL example: http://homeassistant.local:8123 or http://<HA-IP>:8123
"""

from __future__ import annotations

import requests

# --- Home Assistant REST API client --------------------------------------

# HAClient is a minimal, reusable Home Assistant REST API client.
class HAClient:
    def __init__(self, base_url: str, token: str, timeout: float = 10.0):
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self._headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }

    # --- Core API ---------------------------------------------------------

    # Get the full state object of an entity.
    def get_state(self, entity_id: str) -> dict:
        """Return the full state object of an entity."""
        r = requests.get(
            f"{self.base_url}/api/states/{entity_id}",
            headers=self._headers,
            timeout=self.timeout,
        )
        r.raise_for_status()
        return r.json()

    # Get the numeric state of an entity, along with its last_updated timestamp.
    def get_numeric_state(self, entity_id: str) -> tuple[float | None, str]:
        """Return (value, last_updated). value is None for 'unknown'/'unavailable'."""
        state = self.get_state(entity_id)
        try:
            return float(state["state"]), state["last_updated"]
        except (ValueError, TypeError):
            return None, state.get("last_updated", "")

    # Call a service in a domain with optional data. Returns the JSON response.
    def call_service(self, domain: str, service: str, data: dict | None = None) -> list:
        r = requests.post(
            f"{self.base_url}/api/services/{domain}/{service}",
            headers=self._headers,
            json=data or {},
            timeout=self.timeout,
        )
        r.raise_for_status()
        return r.json()

    # Check if the Home Assistant server is reachable and responding.
    def check_connection(self) -> bool:
        r = requests.get(
            f"{self.base_url}/api/", headers=self._headers, timeout=self.timeout
        )
        return r.status_code == 200

    # --- Fan helpers ------------------------------------------------------
    # Fan helpers for turning on/off, setting percentage, and getting status.
    
    def fan_turn_on(self, entity_id: str) -> None:
        self.call_service("fan", "turn_on", {"entity_id": entity_id})

    def fan_turn_off(self, entity_id: str) -> None:
        self.call_service("fan", "turn_off", {"entity_id": entity_id})

    def fan_set_percentage(self, entity_id: str, percentage: int) -> None:
        self.call_service(
            "fan", "set_percentage",
            {"entity_id": entity_id, "percentage": int(percentage)},
        )

    def fan_get_status(self, entity_id: str) -> tuple[bool, int | None]:
        """Return (is_on, percentage) for later restore."""
        s = self.get_state(entity_id)
        is_on = s["state"] == "on"
        pct = s.get("attributes", {}).get("percentage")
        return is_on, pct