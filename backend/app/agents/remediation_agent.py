"""
Remediation & Sandbox Agent – Node 3 of the incident resolution graph.

Responsibilities:
  1. Formulate a remediation action based on the root-cause.
  2. Execute the fix inside the sandbox runner.
  3. Run validation tests and record results.
  4. Decide whether human approval is required before live execution.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict

from langchain_core.messages import SystemMessage, HumanMessage

from app.agents.state import IncidentState
from app.api.websocket import manager
from app.tools.sandbox_runner import run_in_sandbox

logger = logging.getLogger(__name__)

REMEDIATION_SYSTEM_PROMPT = """\
You are the **Remediation Agent** in an autonomous SRE system.

Given the root-cause analysis, you must propose a concrete remediation action.
Respond with a JSON object (and nothing else) having these keys:
- "action_type": one of "KILL_PID", "RESTART_POD", or "APPLY_PATCH"
- "command": the exact shell command or SQL statement to execute
- "justification": 1-2 sentence explanation of why this fix is appropriate
- "requires_approval": boolean – true for APPLY_PATCH or anything touching
  production state, false for safe kill-queries or restarts

Example:
{
  "action_type": "KILL_PID",
  "command": "SELECT pg_terminate_backend(4821);",
  "justification": "Terminates the blocking PID to break the deadlock cycle.",
  "requires_approval": false
}
"""


async def remediation_node(state: IncidentState, config: Dict[str, Any]) -> Dict[str, Any]:
    """Formulate a fix, test it in sandbox, and decide on approval gate."""
    incident_id = state["incident_id"]
    alert = state["alert"]
    scenario = alert.get("scenario")
    root_cause = state.get("root_cause", "Unknown root cause.")

    await manager.broadcast(incident_id, "AGENT_STEP",
                            "Remediation Agent formulating fix …", "RemediationAgent")
    await manager.broadcast_status(incident_id, "REMEDIATING", "RemediationAgent")

    # ── Ask LLM for remediation plan ────────────────────────
    proposed = await _get_proposed_action(root_cause, scenario)

    action_type = proposed["action_type"]
    command = proposed["command"]
    justification = proposed["justification"]
    requires_approval = proposed.get("requires_approval", True)

    await manager.broadcast(
        incident_id, "AGENT_STEP",
        f"Proposed action: {action_type} – {justification}",
        "RemediationAgent",
        {"proposed_action": proposed},
    )

    # ── Execute in sandbox ──────────────────────────────────
    await manager.broadcast_log(incident_id,
                                f"Running sandbox test: {command}", "RemediationAgent")
    sandbox_result = await run_in_sandbox(action_type, command)

    await manager.broadcast(
        incident_id, "TOOL_CALL",
        f"Sandbox result: {sandbox_result['status']}",
        "RemediationAgent",
        {"sandbox_result": sandbox_result},
    )

    # If sandbox failed, mark the incident as FAILED
    if sandbox_result["status"] == "FAILED":
        await manager.broadcast(incident_id, "ERROR",
                                "Sandbox test FAILED – remediation aborted.", "RemediationAgent")
        return {
            "proposed_action": {
                "action_type": action_type,
                "command": command,
                "justification": justification,
            },
            "sandbox_test_result": sandbox_result,
            "requires_approval": False,
            "is_approved": False,
            "status": "FAILED",
            "logs": [
                f"[RemediationAgent] Proposed: {action_type}",
                f"[RemediationAgent] Sandbox FAILED: {sandbox_result['output'][:200]}",
            ],
        }

    # ── Decide approval gate ────────────────────────────────
    if requires_approval:
        await manager.broadcast(
            incident_id, "APPROVAL_REQUEST",
            f"Human approval required for: {action_type} – {command}",
            "RemediationAgent",
            {"proposed_action": proposed},
        )

    await manager.broadcast_log(incident_id, "Remediation plan ready.", "RemediationAgent")

    return {
        "proposed_action": {
            "action_type": action_type,
            "command": command,
            "justification": justification,
        },
        "sandbox_test_result": sandbox_result,
        "requires_approval": requires_approval,
        "is_approved": not requires_approval,  # auto-approve if no gate needed
        "status": "WAITING_APPROVAL" if requires_approval else "REMEDIATING",
        "logs": [
            f"[RemediationAgent] Proposed: {action_type}",
            f"[RemediationAgent] Sandbox: {sandbox_result['status']}",
            f"[RemediationAgent] Requires approval: {requires_approval}",
        ],
    }


async def _get_proposed_action(root_cause: str, scenario: str | None) -> Dict[str, Any]:
    """Ask the LLM for a remediation plan, with fallback."""
    try:
        from app.agents.graph import get_llm
        llm = get_llm()
        response = await llm.ainvoke([
            SystemMessage(content=REMEDIATION_SYSTEM_PROMPT),
            HumanMessage(content=f"Root-cause analysis:\n{root_cause}"),
        ])
        return json.loads(response.content.strip())
    except Exception as exc:
        logger.warning("LLM call failed in remediation – using fallback. Error: %s", exc)
        return _fallback_action(scenario)


def _fallback_action(scenario: str | None) -> Dict[str, Any]:
    """Deterministic remediation when the LLM is unavailable."""
    if scenario == "db_deadlock":
        return {
            "action_type": "KILL_PID",
            "command": "SELECT pg_terminate_backend(4821);",
            "justification": "Terminates the blocking PID 4821 to break the deadlock cycle between orders and inventory tables.",
            "requires_approval": False,
        }
    if scenario == "pod_crash":
        return {
            "action_type": "RESTART_POD",
            "command": "kubectl rollout restart deployment/user-service -n production",
            "justification": "Restarts the OOM-killed user-service pods with fresh memory. The unbounded session cache will be cleared on restart.",
            "requires_approval": True,
        }
    if scenario == "high_latency":
        return {
            "action_type": "APPLY_PATCH",
            "command": "kubectl apply -f config/gateway.yaml && kubectl rollout restart deployment/api-gateway -n production",
            "justification": "Reverts the gateway timeout and circuit-breaker config to pre-load-test values.",
            "requires_approval": True,
        }
    return {
        "action_type": "RESTART_POD",
        "command": "kubectl rollout restart deployment/unknown-service -n production",
        "justification": "Generic restart as a first remediation attempt.",
        "requires_approval": True,
    }
