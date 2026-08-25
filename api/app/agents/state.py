"""
LangGraph state definition for the incident resolution workflow.

Every node in the graph reads from and writes to this shared state dict.
"""

from __future__ import annotations

import operator
from typing import Annotated, Any, Dict, List, Literal, Optional, TypedDict


class ProposedActionDict(TypedDict, total=False):
    action_type: Literal["KILL_PID", "RESTART_POD", "APPLY_PATCH"]
    command: str
    justification: str


class SandboxResultDict(TypedDict, total=False):
    status: Literal["SUCCESS", "FAILED"]
    output: str


# ── Custom reducer for the `logs` channel ───────────────────


def _merge_logs(existing: List[str], new: List[str]) -> List[str]:
    """Append-only merge so every node can push new log lines."""
    if existing is None:
        existing = []
    if new is None:
        new = []
    return existing + new


# ── State Schema ────────────────────────────────────────────


class IncidentState(TypedDict, total=False):
    """Shared state flowing through the LangGraph incident workflow."""

    # ── Identity ────────────────────────────────────────────
    incident_id: str

    # ── Alert payload (set once at ingestion) ───────────────
    alert: Dict[str, Any]
    # alert keys: service, severity, description, raw_log, metrics, source, scenario

    # ── Agent outputs (populated progressively) ─────────────
    triage_summary: Optional[str]
    root_cause: Optional[str]
    proposed_action: Optional[ProposedActionDict]
    sandbox_test_result: Optional[SandboxResultDict]

    # ── Approval gate ───────────────────────────────────────
    requires_approval: bool
    is_approved: bool

    # ── Overall status ──────────────────────────────────────
    status: Literal[
        "INVESTIGATING",
        "REMEDIATING",
        "WAITING_APPROVAL",
        "RESOLVED",
        "FAILED",
    ]

    # ── Logs (append-only, streamed to the UI) ──────────────
    logs: Annotated[List[str], _merge_logs]

    # ── Post-mortem markdown (set at the end) ───────────────
    postmortem: Optional[str]
