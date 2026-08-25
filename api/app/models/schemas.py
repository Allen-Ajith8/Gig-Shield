"""
Pydantic models for REST request / response bodies.
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field


# ── Enums ────────────────────────────────────────────────────


class Severity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"


class IncidentStatus(str, Enum):
    INVESTIGATING = "INVESTIGATING"
    REMEDIATING = "REMEDIATING"
    WAITING_APPROVAL = "WAITING_APPROVAL"
    RESOLVED = "RESOLVED"
    FAILED = "FAILED"


class ActionType(str, Enum):
    KILL_PID = "KILL_PID"
    RESTART_POD = "RESTART_POD"
    APPLY_PATCH = "APPLY_PATCH"


# ── Request Models ──────────────────────────────────────────


class AlertPayload(BaseModel):
    """Payload sent by a monitoring webhook (Datadog / CloudWatch / custom)."""

    service: str = Field(..., examples=["payment-service"])
    severity: Severity = Field(..., examples=["CRITICAL"])
    description: str = Field(..., examples=["High error rate detected"])
    raw_log: str = Field(default="", examples=["ERROR 2026-08-23 ..."])
    metrics: Dict[str, Any] = Field(
        default_factory=dict,
        examples=[{"error_rate": 42.5, "p99_latency_ms": 3200}],
    )
    source: str = Field(default="manual", examples=["datadog"])
    scenario: Optional[str] = Field(
        default=None,
        description="Optional mock scenario key: db_deadlock | pod_crash | high_latency",
        examples=["db_deadlock"],
    )


class ApprovalDecision(BaseModel):
    """Human decision for a pending approval checkpoint."""

    approved: bool
    reviewer: str = Field(default="operator", examples=["alice@company.com"])
    comment: str = Field(default="")


# ── Response Models ─────────────────────────────────────────


class ProposedAction(BaseModel):
    action_type: ActionType
    command: str
    justification: str


class SandboxResult(BaseModel):
    status: Literal["SUCCESS", "FAILED"]
    output: str


class IncidentResponse(BaseModel):
    """Full snapshot of an incident's current state."""

    incident_id: str
    alert: Dict[str, Any]
    status: IncidentStatus
    triage_summary: Optional[str] = None
    root_cause: Optional[str] = None
    proposed_action: Optional[ProposedAction] = None
    sandbox_test_result: Optional[SandboxResult] = None
    requires_approval: bool = False
    is_approved: bool = False
    logs: List[str] = Field(default_factory=list)
    postmortem: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)


class IncidentTriggerResponse(BaseModel):
    """Acknowledgement returned immediately after incident ingestion."""

    incident_id: str
    message: str = "Incident received – agent workflow started."


class WebSocketEvent(BaseModel):
    """Structured event pushed over the WebSocket connection."""

    incident_id: str
    event_type: Literal[
        "AGENT_STEP",
        "LOG",
        "STATUS_CHANGE",
        "APPROVAL_REQUEST",
        "RESOLVED",
        "TOOL_CALL",
        "ERROR",
    ]
    agent_name: Optional[str] = None
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    data: Dict[str, Any] = Field(default_factory=dict)
