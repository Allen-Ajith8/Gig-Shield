"""
FastAPI application entrypoint.

Boots the Autonomous SRE backend with:
  - CORS middleware
  - REST routers (incidents, approvals)
  - WebSocket endpoint for real-time streaming
"""

from __future__ import annotations

import logging

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_approvals import router as approvals_router
from app.api.routes_incidents import router as incidents_router
from app.api.websocket import manager
from app.config import settings

# ── Logging ─────────────────────────────────────────────────
logging.basicConfig(
    level=getattr(logging, settings.log_level.upper(), logging.INFO),
    format="%(asctime)s %(levelname)-8s %(name)s  %(message)s",
)
logger = logging.getLogger(__name__)

# ── App ─────────────────────────────────────────────────────
app = FastAPI(
    title="Autonomous SRE Platform",
    description="AI-native multi-agent incident resolution backend.",
    version="1.0.0",
)

# ── CORS ────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── REST Routers ────────────────────────────────────────────
app.include_router(incidents_router)
app.include_router(approvals_router)


# ── WebSocket ───────────────────────────────────────────────
@app.websocket("/ws/incidents/{incident_id}")
async def websocket_endpoint(websocket: WebSocket, incident_id: str):
    """
    Subscribe to real-time events for a specific incident.

    The frontend connects here immediately after triggering an incident
    and receives structured JSON events until the incident is resolved
    or the connection is closed.
    """
    await manager.connect(websocket, incident_id)
    try:
        while True:
            # Keep the connection alive; the client can also send messages
            # (e.g., pings) which we silently consume.
            data = await websocket.receive_text()
            logger.debug("WS received from client (%s): %s", incident_id, data)
    except WebSocketDisconnect:
        await manager.disconnect(websocket, incident_id)
    except Exception:
        await manager.disconnect(websocket, incident_id)


# ── Health check ────────────────────────────────────────────
@app.get("/health", tags=["system"])
async def health_check():
    return {"status": "ok", "service": "autonomous-sre-backend"}


# ── Startup banner ──────────────────────────────────────────
@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Autonomous SRE Backend started")
    logger.info("   LLM Provider : %s (%s)", settings.llm_provider, settings.llm_model_name)
    logger.info("   Sandbox Mode : %s", settings.sandbox_mode)
    logger.info("   Environment  : %s", settings.app_env)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
