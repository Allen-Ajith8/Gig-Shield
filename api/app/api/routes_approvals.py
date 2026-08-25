"""
Human-in-the-loop approval endpoints.

- POST /api/v1/incidents/{id}/approve  → submit approval decision & resume workflow
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict

from fastapi import APIRouter, HTTPException

from app.agents.graph import compiled_graph
from app.api.routes_incidents import get_incidents_store
from app.api.websocket import manager
from app.models.schemas import ApprovalDecision, IncidentResponse

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/v1/incidents", tags=["approvals"])


@router.post("/{incident_id}/approve", response_model=IncidentResponse)
async def approve_incident(incident_id: str, decision: ApprovalDecision):
    """
    Submit a human approval (or rejection) for a paused incident.

    If approved, the LangGraph workflow is resumed from the approval
    gate and will proceed to execution + post-mortem. If rejected, the
    incident is marked FAILED.
    """
    store = get_incidents_store()
    state = store.get(incident_id)

    if not state:
        raise HTTPException(status_code=404, detail=f"Incident {incident_id} not found.")

    if state.get("status") != "WAITING_APPROVAL":
        raise HTTPException(
            status_code=409,
            detail=f"Incident {incident_id} is not awaiting approval (status: {state.get('status')}).",
        )

    if decision.approved:
        # ── Approve & resume ────────────────────────────────
        state["is_approved"] = True
        state["status"] = "REMEDIATING"
        state["logs"].append(
            f"[ApprovalGate] Approved by {decision.reviewer}"
            + (f" – {decision.comment}" if decision.comment else "")
        )

        await manager.broadcast(
            incident_id, "STATUS_CHANGE",
            f"Approved by {decision.reviewer} – resuming workflow.",
            "ApprovalGate",
            {"reviewer": decision.reviewer, "comment": decision.comment},
        )

        # Resume the graph from the approval_gate node onward
        asyncio.create_task(_resume_workflow(incident_id, state))

    else:
        # ── Reject ──────────────────────────────────────────
        state["is_approved"] = False
        state["status"] = "FAILED"
        state["logs"].append(
            f"[ApprovalGate] REJECTED by {decision.reviewer}"
            + (f" – {decision.comment}" if decision.comment else "")
        )

        await manager.broadcast(
            incident_id, "STATUS_CHANGE",
            f"Rejected by {decision.reviewer}.",
            "ApprovalGate",
            {"reviewer": decision.reviewer, "comment": decision.comment},
        )

    return IncidentResponse(
        incident_id=state["incident_id"],
        alert=state.get("alert", {}),
        status=state.get("status", "FAILED"),
        triage_summary=state.get("triage_summary"),
        root_cause=state.get("root_cause"),
        proposed_action=state.get("proposed_action"),
        sandbox_test_result=state.get("sandbox_test_result"),
        requires_approval=state.get("requires_approval", False),
        is_approved=state.get("is_approved", False),
        logs=state.get("logs", []),
        postmortem=state.get("postmortem"),
    )


async def _resume_workflow(incident_id: str, state: Dict[str, Any]) -> None:
    """
    Resume the incident workflow after human approval.

    We re-invoke the compiled graph with the updated state; since
    ``is_approved`` is now True, the approval_gate node will route
    to execution_postmortem instead of pausing again.
    """
    try:
        logger.info("Resuming workflow for %s after approval", incident_id)

        # Build a state snapshot that starts from the approval gate
        resume_state = dict(state)
        resume_state["status"] = "REMEDIATING"
        resume_state["is_approved"] = True

        # Re-run the graph; nodes before approval_gate will see no
        # state changes and effectively become pass-throughs, while
        # approval_gate will now route to execution_postmortem.
        final_state = await compiled_graph.ainvoke(resume_state)

        store = get_incidents_store()
        store[incident_id].update(final_state)

        logger.info("Resumed workflow completed for %s – status: %s",
                     incident_id, final_state.get("status"))
    except Exception as exc:
        logger.exception("Resumed workflow failed for %s", incident_id)
        store = get_incidents_store()
        store[incident_id]["status"] = "FAILED"
        store[incident_id].setdefault("logs", []).append(
            f"[System] Resume error: {exc}"
        )
        await manager.broadcast(incident_id, "ERROR", f"Resume error: {exc}")
