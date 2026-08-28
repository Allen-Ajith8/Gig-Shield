"""
WebSocket connection manager for real-time incident and dataset streaming.
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
    def __init__(self) -> None:
        self._connections: Dict[str, List[WebSocket]] = {}
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, entity_id: str) -> None:
        await websocket.accept()
        async with self._lock:
            self._connections.setdefault(entity_id, []).append(websocket)
        logger.info("WS connected for %s (total: %d)", entity_id, len(self._connections[entity_id]))

    async def disconnect(self, websocket: WebSocket, entity_id: str) -> None:
        async with self._lock:
            conns = self._connections.get(entity_id, [])
            if websocket in conns:
                conns.remove(websocket)
            if not conns:
                self._connections.pop(entity_id, None)
        logger.info("WS disconnected for %s", entity_id)

    async def broadcast(
        self,
        entity_id: str,
        event_type: str,
        message: str,
        agent_name: Optional[str] = None,
        data: Optional[Dict[str, Any]] = None,
    ) -> None:
        payload = {
            "entity_id": entity_id,
            "event_type": event_type,
            "agent_name": agent_name,
            "message": message,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "data": data or {},
        }
        raw = json.dumps(payload, default=str)
        async with self._lock:
            conns = list(self._connections.get(entity_id, []))

        dead: List[WebSocket] = []
        for ws in conns:
            try:
                await ws.send_text(raw)
            except Exception:
                dead.append(ws)

        if dead:
            async with self._lock:
                for ws in dead:
                    conns_list = self._connections.get(entity_id, [])
                    if ws in conns_list:
                        conns_list.remove(ws)

    async def broadcast_log(
        self, entity_id: str, message: str, agent_name: Optional[str] = None
    ) -> None:
        await self.broadcast(entity_id, "LOG", message, agent_name)

    async def broadcast_status(
        self, entity_id: str, status: str, agent_name: Optional[str] = None
    ) -> None:
        await self.broadcast(
            entity_id, "STATUS_CHANGE", f"Status → {status}", agent_name, {"status": status}
        )


class GlobalConnectionManager:
    def __init__(self) -> None:
        self.active_connections: List[WebSocket] = []
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket) -> None:
        await websocket.accept()
        async with self._lock:
            self.active_connections.append(websocket)

    async def disconnect(self, websocket: WebSocket) -> None:
        async with self._lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)

    async def broadcast(self, message: str) -> None:
        async with self._lock:
            conns = list(self.active_connections)
        dead: List[WebSocket] = []
        for ws in conns:
            try:
                await ws.send_text(message)
            except Exception:
                dead.append(ws)
        if dead:
            async with self._lock:
                for ws in dead:
                    if ws in self.active_connections:
                        self.active_connections.remove(ws)


manager = ConnectionManager()
global_manager = GlobalConnectionManager()
