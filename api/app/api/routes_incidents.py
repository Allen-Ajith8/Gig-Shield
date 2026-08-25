"""
Incident REST endpoints.

- POST /api/v1/incidents/trigger    → ingest alert & start agent workflow
- GET  /api/v1/incidents/{id}       → return full current state
- GET  /api/v1/incidents            → list all incidents
"""

import asyncio
import json
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, BackgroundTasks, HTTPException, Request

from app.agents.graph import compiled_graph
from app.agents.state import IncidentState
from app.api.websocket import manager
from app.database import SessionLocal, DBIncident
from app.limiter import limiter
from app.models.schemas import (
    AlertPayload,
    IncidentResponse,
    IncidentStatus,
    IncidentTriggerResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/incidents", tags=["incidents"])


# ── DB helpers ──────────────────────────────────────────────

def _save_incident(incident_id: str, state: Dict[str, Any]):
    """Persist an incident state to SQLite."""
    db = SessionLocal()
    try:
        existing = db.query(DBIncident).filter(DBIncident.incident_id == incident_id).first()
        if existing:
            existing.status = state.get("status", "UNKNOWN")
            existing.state_json = json.dumps(state, default=str)
        else:
            row = DBIncident(
                incident_id=incident_id,
                status=state.get("status", "INVESTIGATING"),
                state_json=json.dumps(state, default=str),
            )
            db.add(row)
        db.commit()
    finally:
        db.close()


def _load_incident(incident_id: str) -> Dict[str, Any] | None:
    """Load an incident state from SQLite."""
    db = SessionLocal()
    try:
        row = db.query(DBIncident).filter(DBIncident.incident_id == incident_id).first()
        if row:
            return json.loads(row.state_json)
        return None
    finally:
        db.close()


def _load_all_incidents() -> list[Dict[str, Any]]:
    """Load all incidents from SQLite."""
    db = SessionLocal()
    try:
        rows = db.query(DBIncident).order_by(DBIncident.created_at).all()
        return [json.loads(r.state_json) for r in rows]
    finally:
        db.close()


from cachetools import LRUCache

# ── In-memory cache (for fast access during workflow runs) ──
# Using LRUCache to prevent infinite memory leak (OOM). 
_incidents = LRUCache(maxsize=100)

def _load_cache_from_db():
    """Hydrate in-memory cache from DB on startup (only the last 100)."""
    all_incidents = _load_all_incidents()
    # Only load the most recent 100 to respect cache size
    for state in all_incidents[-100:]:
        iid = state.get("incident_id")
        if iid:
            _incidents[iid] = state

# Hydrate cache immediately
_load_cache_from_db()

def get_incidents_store():
    """Expose the store so other modules (approvals) can access it."""
    return _incidents


# ── Background runner ───────────────────────────────────────


async def _run_incident_workflow(incident_id: str, initial_state: Dict[str, Any]) -> None:
    """Run the LangGraph workflow in the background and update the store."""
    try:
        logger.info("Starting workflow for %s", incident_id)
        # LangGraph's ainvoke returns the final state dict
        final_state = await compiled_graph.ainvoke(initial_state)
        _incidents[incident_id].update(final_state)
        _save_incident(incident_id, _incidents[incident_id])
        logger.info("Workflow completed for %s – status: %s",
                     incident_id, final_state.get("status"))
    except Exception as exc:
        logger.exception("Workflow failed for %s", incident_id)
        _incidents[incident_id]["status"] = "FAILED"
        _incidents[incident_id].setdefault("logs", []).append(
            f"[System] Workflow error: {exc}"
        )
        _save_incident(incident_id, _incidents[incident_id])
        await manager.broadcast(incident_id, "ERROR", f"Workflow error: {exc}")


# ── Endpoints ───────────────────────────────────────────────


@router.post("/trigger", response_model=IncidentTriggerResponse, status_code=202)
@limiter.limit("3/minute")
async def trigger_incident(request: Request, payload: AlertPayload, background_tasks: BackgroundTasks):
    """
    Ingest an alert and start the multi-agent resolution workflow
    as a background task.
    """
    incident_id = f"INC-{uuid.uuid4().hex[:8].upper()}"

    initial_state: Dict[str, Any] = {
        "incident_id": incident_id,
        "alert": payload.model_dump(),
        "triage_summary": None,
        "root_cause": None,
        "proposed_action": None,
        "sandbox_test_result": None,
        "requires_approval": False,
        "is_approved": False,
        "status": "INVESTIGATING",
        "logs": [f"[System] Incident {incident_id} created from {payload.source} alert."],
        "postmortem": None,
    }

    _incidents[incident_id] = {
        **initial_state,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }

    # Persist to DB immediately
    _save_incident(incident_id, _incidents[incident_id])

    background_tasks.add_task(_run_incident_workflow, incident_id, initial_state)

    return IncidentTriggerResponse(incident_id=incident_id)


@router.get("/{incident_id}", response_model=IncidentResponse)
async def get_incident(incident_id: str):
    """Return the full current state of an incident."""
    state = _incidents.get(incident_id)
    if not state:
        # Try loading from DB (in case cache was cleared)
        state = _load_incident(incident_id)
        if state:
            _incidents[incident_id] = state
    if not state:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found.")
    return IncidentResponse(
        incident_id=state["incident_id"],
        alert=state.get("alert", {}),
        status=state.get("status", "INVESTIGATING"),
        triage_summary=state.get("triage_summary"),
        root_cause=state.get("root_cause"),
        proposed_action=state.get("proposed_action"),
        sandbox_test_result=state.get("sandbox_test_result"),
        requires_approval=state.get("requires_approval", False),
        is_approved=state.get("is_approved", False),
        logs=state.get("logs", []),
        postmortem=state.get("postmortem"),
    )


@router.get("", response_model=list[IncidentTriggerResponse])
async def list_incidents():
    """Return a summary list of all incidents (from DB)."""
    return [
        IncidentTriggerResponse(
            incident_id=data["incident_id"],
            message=f"Status: {data.get('status', 'UNKNOWN')}",
        )
        for data in _load_all_incidents()
    ]
