"""
Incident REST endpoints.

- POST /api/v1/incidents/trigger    → ingest alert & start agent workflow
- GET  /api/v1/incidents/{id}       → return full current state
- GET  /api/v1/incidents            → list all incidents
"""

from __future__ import annotations

import asyncio
import logging
import uuid
from datetime import datetime, timezone
from typing import Any, Dict

from fastapi import APIRouter, BackgroundTasks, HTTPException

from app.agents.graph import compiled_graph
from app.agents.state import IncidentState
from app.api.websocket import manager
from app.models.schemas import (
    AlertPayload,
    IncidentResponse,
    IncidentStatus,
    IncidentTriggerResponse,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/incidents", tags=["incidents"])

# ── In-memory incident store ────────────────────────────────
# In production this would be a database. For this self-contained
# demo we use a simple dict.
_incidents: Dict[str, Dict[str, Any]] = {}


def get_incidents_store() -> Dict[str, Dict[str, Any]]:
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
        logger.info("Workflow completed for %s – status: %s",
                     incident_id, final_state.get("status"))
    except Exception as exc:
        logger.exception("Workflow failed for %s", incident_id)
        _incidents[incident_id]["status"] = "FAILED"
        _incidents[incident_id].setdefault("logs", []).append(
            f"[System] Workflow error: {exc}"
        )
        await manager.broadcast(incident_id, "ERROR", f"Workflow error: {exc}")


# ── Endpoints ───────────────────────────────────────────────


@router.post("/trigger", response_model=IncidentTriggerResponse, status_code=202)
async def trigger_incident(payload: AlertPayload, background_tasks: BackgroundTasks):
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

    background_tasks.add_task(_run_incident_workflow, incident_id, initial_state)

    return IncidentTriggerResponse(incident_id=incident_id)


@router.get("/{incident_id}", response_model=IncidentResponse)
async def get_incident(incident_id: str):
    """Return the full current state of an incident."""
    state = _incidents.get(incident_id)
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
    """Return a summary list of all incidents."""
    return [
        IncidentTriggerResponse(
            incident_id=iid,
            message=f"Status: {data.get('status', 'UNKNOWN')}",
        )
        for iid, data in _incidents.items()
    ]
