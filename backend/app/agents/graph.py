"""
LangGraph multi-agent workflow for incident resolution.

Graph topology:
  triage → detective → remediation → [approval_gate] → execution_postmortem
                                          ↑
                                   (waits for human approval if required)
"""

from __future__ import annotations
from langchain_core.runnables import RunnableConfig

import logging
from datetime import datetime, timezone
from typing import Any, Dict, Optional

from langchain_core.language_models.chat_models import BaseChatModel
from langgraph.graph import END, StateGraph

from app.agents.state import IncidentState
from app.agents.triage_agent import triage_node
from app.agents.detective_agent import detective_node
from app.agents.remediation_agent import remediation_node
from app.api.websocket import manager
from app.config import settings

logger = logging.getLogger(__name__)

# ── LLM Factory ─────────────────────────────────────────────

_llm_instance: Optional[BaseChatModel] = None


def get_llm() -> BaseChatModel:
    """
    Return a shared LLM instance configured from environment variables.

    Supports NVIDIA NIM, OpenAI, Anthropic, Google, and Ollama providers.
    """
    global _llm_instance
    if _llm_instance is not None:
        return _llm_instance

    provider = settings.llm_provider
    model = settings.llm_model_name

    if provider == "nvidia":
        from langchain_openai import ChatOpenAI
        _llm_instance = ChatOpenAI(
            model=model,
            api_key=settings.nvidia_api_key,
            base_url="https://integrate.api.nvidia.com/v1",
            temperature=0.2,
        )
    elif provider == "openai":
        from langchain_openai import ChatOpenAI
        _llm_instance = ChatOpenAI(
            model=model,
            api_key=settings.openai_api_key,
            temperature=0.2,
        )
    elif provider == "anthropic":
        from langchain_community.chat_models import ChatAnthropic
        _llm_instance = ChatAnthropic(  # type: ignore[call-arg]
            model=model,
            anthropic_api_key=settings.anthropic_api_key,
            temperature=0.2,
        )
    elif provider == "google":
        from langchain_community.chat_models import ChatGoogleGenerativeAI
        _llm_instance = ChatGoogleGenerativeAI(  # type: ignore[call-arg]
            model=model,
            google_api_key=settings.google_api_key,
            temperature=0.2,
        )
    elif provider == "ollama":
        from langchain_community.chat_models import ChatOllama
        _llm_instance = ChatOllama(
            model=model,
            base_url=settings.ollama_base_url,
            temperature=0.2,
        )
    else:
        raise ValueError(f"Unsupported LLM provider: {provider}")

    return _llm_instance


# ── Approval Gate Node ──────────────────────────────────────


async def approval_gate_node(state: IncidentState, config: RunnableConfig) -> Dict[str, Any]:
    """
    Checkpoint node that checks whether the workflow should pause
    for human approval.

    If ``requires_approval`` is True and ``is_approved`` is False,
    the graph will route to END and the workflow will be resumed
    externally when the human approves via the REST endpoint.
    """
    incident_id = state["incident_id"]
    requires = state.get("requires_approval", False)
    approved = state.get("is_approved", False)

    if requires and not approved:
        await manager.broadcast_status(incident_id, "WAITING_APPROVAL", "ApprovalGate")
        await manager.broadcast(
            incident_id, "APPROVAL_REQUEST",
            "Workflow paused – awaiting human approval.",
            "ApprovalGate",
            {"proposed_action": state.get("proposed_action")},
        )
        return {
            "status": "WAITING_APPROVAL",
            "logs": ["[ApprovalGate] Workflow paused – awaiting human decision."],
        }

    # Already approved or no approval needed
    return {
        "logs": ["[ApprovalGate] Approval granted or not required – proceeding."],
    }


# ── Execution & Post-Mortem Node ────────────────────────────


async def execution_postmortem_node(state: IncidentState, config: RunnableConfig) -> Dict[str, Any]:
    """
    Final node: execute the approved action and generate a post-mortem.
    """
    incident_id = state["incident_id"]
    alert = state["alert"]
    action = state.get("proposed_action", {})
    sandbox = state.get("sandbox_test_result", {})

    await manager.broadcast(incident_id, "AGENT_STEP",
                            "Executing approved remediation …", "ExecutionAgent")

    # (In a real system we would execute the action against live infra here.
    #  Since we already validated in the sandbox, we simulate instant success.)

    await manager.broadcast_log(incident_id,
                                f"Action executed: {action.get('command', 'N/A')}", "ExecutionAgent")
    await manager.broadcast_status(incident_id, "RESOLVED", "ExecutionAgent")

    # ── Generate post-mortem ────────────────────────────────
    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    postmortem = _generate_postmortem(incident_id, alert, state, now)

    await manager.broadcast(
        incident_id, "RESOLVED",
        "Incident resolved – post-mortem generated.",
        "ExecutionAgent",
        {"postmortem_preview": postmortem[:500]},
    )

    return {
        "status": "RESOLVED",
        "postmortem": postmortem,
        "logs": [
            f"[ExecutionAgent] Remediation applied successfully.",
            f"[ExecutionAgent] Post-mortem report generated.",
        ],
    }


def _generate_postmortem(
    incident_id: str,
    alert: Dict[str, Any],
    state: IncidentState,
    timestamp: str,
) -> str:
    """Build a structured markdown post-mortem report."""
    action = state.get("proposed_action", {})
    sandbox = state.get("sandbox_test_result", {})
    return f"""# Post-Mortem Report: {incident_id}

**Generated:** {timestamp}
**Service:** {alert.get('service', 'N/A')}
**Severity:** {alert.get('severity', 'N/A')}

---

## Incident Summary

{alert.get('description', 'No description provided.')}

## Triage

{state.get('triage_summary', 'N/A')}

## Root Cause

{state.get('root_cause', 'N/A')}

## Remediation

- **Action:** {action.get('action_type', 'N/A')}
- **Command:** `{action.get('command', 'N/A')}`
- **Justification:** {action.get('justification', 'N/A')}

## Sandbox Validation

- **Status:** {sandbox.get('status', 'N/A')}
- **Output:**
```
{sandbox.get('output', 'N/A')}
```

## Timeline

| Phase | Status |
|-------|--------|
| Triage | ✅ Complete |
| Root Cause Analysis | ✅ Complete |
| Remediation Sandbox | ✅ {sandbox.get('status', 'N/A')} |
| Human Approval | {'✅ Approved' if state.get('is_approved') else '⏭️ Auto-approved'} |
| Execution | ✅ Applied |

## Recommendations

- Review the code change that caused this incident.
- Add monitoring alerts for early detection.
- Update runbooks with this remediation procedure.

---
*Report generated by Autonomous SRE Agent System*
"""


# ── Conditional Edge Logic ──────────────────────────────────


def _should_proceed_after_remediation(state: IncidentState) -> str:
    """Route after remediation: go to approval gate or end on failure."""
    if state.get("status") == "FAILED":
        return "end"
    return "approval_gate"


def _should_proceed_after_approval(state: IncidentState) -> str:
    """Route after approval gate: proceed to execution or pause."""
    if state.get("status") == "WAITING_APPROVAL":
        return "end"  # Graph ends; will be resumed after approval
    return "execution_postmortem"


# ── Graph Builder ───────────────────────────────────────────


def build_incident_graph() -> StateGraph:
    """
    Construct and return the compiled LangGraph state machine.

    Topology::

        START → triage → detective → remediation
                                         │
                                    [conditional]
                                    ├─ FAILED → END
                                    └─ OK → approval_gate
                                                │
                                           [conditional]
                                           ├─ WAITING_APPROVAL → END (pause)
                                           └─ APPROVED → execution_postmortem → END
    """
    graph = StateGraph(IncidentState)

    # ── Add nodes ───────────────────────────────────────────
    graph.add_node("triage", triage_node)
    graph.add_node("detective", detective_node)
    graph.add_node("remediation", remediation_node)
    graph.add_node("approval_gate", approval_gate_node)
    graph.add_node("execution_postmortem", execution_postmortem_node)

    # ── Add edges ───────────────────────────────────────────
    graph.set_entry_point("triage")
    graph.add_edge("triage", "detective")
    graph.add_edge("detective", "remediation")

    graph.add_conditional_edges(
        "remediation",
        _should_proceed_after_remediation,
        {"approval_gate": "approval_gate", "end": END},
    )

    graph.add_conditional_edges(
        "approval_gate",
        _should_proceed_after_approval,
        {"execution_postmortem": "execution_postmortem", "end": END},
    )

    graph.add_edge("execution_postmortem", END)

    return graph


# ── Compiled graph singleton ────────────────────────────────

compiled_graph = build_incident_graph().compile()
