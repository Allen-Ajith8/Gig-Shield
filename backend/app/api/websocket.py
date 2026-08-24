"""
WebSocket connection manager for real-time incident streaming.

Manages per-incident WebSocket connections and provides broadcast
helpers that agents use to push structured events to the frontend.
"""

from __future__ import annotations

import asyncio
import json
import logging
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from fastapi import WebSocket

logger = logging.getLogger(__name__)


class ConnectionManager:
    """
    Manages active WebSocket connections grouped by ``incident_id``.

    Usage from anywhere in the backend::

        from app.api.websocket import manager
        await manager.broadcast(incident_id, event_type, message, ...)
    """

    def __init__(self) -> None:
        # incident_id -> list of active WebSocket connections
        self._connections: Dict[str, List[WebSocket]] = {}
        self._lock = asyncio.Lock()

    # ── Connection lifecycle ────────────────────────────────

    async def connect(self, websocket: WebSocket, incident_id: str) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections.setdefault(incident_id, []).append(websocket)
        logger.info("WS connected for incident %s (total: %d)",
                     incident_id, len(self._connections[incident_id]))

    async def disconnect(self, websocket: WebSocket, incident_id: str) -> None:
        async with self._lock:
            conns = self._connections.get(incident_id, [])
            if websocket in conns:
                conns.remove(websocket)
            if not conns:
                self._connections.pop(incident_id, None)
        logger.info("WS disconnected for incident %s", incident_id)

    # ── Broadcasting ────────────────────────────────────────

    async def broadcast(
        self,
        incident_id: str,
        event_type: str,
        message: str,
        agent_name: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
    ) -> None:
        """Send a structured event to every client watching ``incident_id``."""
        payload = {
            "incident_id": incident_id,
            "event_type": event_type,
            "agent_name": agent_name,
            "message": message,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "data": data or {},
        }
        raw = json.dumps(payload, default=str)
        async with self._lock:
            conns = list(self._connections.get(incident_id, []))

        dead: List[WebSocket] = []
        for ws in conns:
            try:
                await ws.send_text(raw)
            except Exception:
                dead.append(ws)

        # Clean up stale connections
        if dead:
            async with self._lock:
                for ws in dead:
                    conns_list = self._connections.get(incident_id, [])
                    if ws in conns_list:
                        conns_list.remove(ws)

    async def broadcast_log(
        self, incident_id: str, message: str, agent_name: Optional[str] = None
    ) -> None:
        """Convenience: broadcast a LOG event."""
        await self.broadcast(incident_id, "LOG", message, agent_name)

    async def broadcast_status(
        self, incident_id: str, status: str, agent_name: Optional[str] = None
    ) -> None:
        """Convenience: broadcast a STATUS_CHANGE event."""
        await self.broadcast(
            incident_id, "STATUS_CHANGE", f"Status → {status}", agent_name, {"status": status}
        )


# ── Module-level singleton ──────────────────────────────────
manager = ConnectionManager()
