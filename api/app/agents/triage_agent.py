"""
Triage Agent – Node 1 of the incident resolution graph.

Responsibilities:
  1. Parse the incoming alert payload.
  2. Query mock telemetry (metrics + logs) for the affected service.
  3. Filter noise and produce a concise triage summary.
  4. Set the initial incident status to INVESTIGATING.
"""

from __future__ import annotations
from langchain_core.runnables import RunnableConfig

import json
import logging
from typing import Any, Dict

from langchain_core.messages import SystemMessage, HumanMessage

from app.agents.state import IncidentState
from app.api.websocket import manager
from app.tools import telemetry_tools

logger = logging.getLogger(__name__)

TRIAGE_SYSTEM_PROMPT = """\
You are the **Triage Agent** in an autonomous SRE system.

Given an alert payload along with recent application metrics and log lines,
you must produce a concise triage summary that includes:
- Which service/pod is affected.
- The severity and urgency classification.
- Key symptoms observed (error spikes, resource exhaustion, etc.).
- Whether this looks like a genuine incident or a false alarm / noise.

Respond with ONLY the triage summary text (2-4 short paragraphs). Do NOT
include any JSON or markdown formatting.
"""


async def triage_node(state: IncidentState, config: RunnableConfig) -> Dict[str, Any]:
    """Execute the triage step and return state updates."""
    incident_id: str = state["incident_id"]
    alert: Dict[str, Any] = state["alert"]
    scenario = alert.get("scenario")
    service = alert.get("service", "unknown-service")

    await manager.broadcast(incident_id, "AGENT_STEP", "Triage Agent starting analysis …", "TriageAgent")
    await manager.broadcast_status(incident_id, "INVESTIGATING", "TriageAgent")

    # ── Gather telemetry ────────────────────────────────────
    await manager.broadcast_log(incident_id, f"Fetching metrics for {service} …", "TriageAgent")
    metrics = await telemetry_tools.fetch_metrics(service, scenario)

    await manager.broadcast_log(incident_id, f"Fetching recent logs for {service} …", "TriageAgent")
    logs = await telemetry_tools.fetch_logs(service, scenario)

    await manager.broadcast(
        incident_id, "TOOL_CALL", "Telemetry data collected",
        "TriageAgent", {"metrics": metrics, "log_lines": len(logs)},
    )

    # ── Build LLM prompt ────────────────────────────────────
    user_content = (
        f"## Alert Payload\n```json\n{json.dumps(alert, indent=2)}\n```\n\n"
        f"## Live Metrics\n```json\n{json.dumps(metrics, indent=2)}\n```\n\n"
        f"## Recent Logs\n```\n" + "\n".join(logs) + "\n```"
    )

    # ── Call LLM ────────────────────────────────────────────
    try:
        from app.agents.graph import get_llm  # deferred to avoid circular import
        llm = get_llm()
        response = await llm.ainvoke([
            SystemMessage(content=TRIAGE_SYSTEM_PROMPT),
            HumanMessage(content=user_content),
        ])
        triage_summary = response.content.strip()
    except Exception as exc:
        logger.warning("LLM call failed in triage – using fallback. Error: %s", exc)
        triage_summary = _fallback_triage(alert, metrics, logs)

    await manager.broadcast(incident_id, "AGENT_STEP", triage_summary, "TriageAgent")
    await manager.broadcast_log(incident_id, "Triage analysis complete.", "TriageAgent")

    return {
        "triage_summary": triage_summary,
        "status": "INVESTIGATING",
        "logs": [
            f"[TriageAgent] Fetched metrics: error_rate={metrics.get('error_rate_percent')}%",
            f"[TriageAgent] Analysed {len(logs)} log lines",
            f"[TriageAgent] Triage summary produced",
        ],
    }


def _fallback_triage(alert: Dict, metrics: Dict, logs: list) -> str:
    """Deterministic fallback when the LLM is unavailable."""
    service = alert.get("service", "unknown")
    severity = alert.get("severity", "UNKNOWN")
    error_rate = metrics.get("error_rate_percent", "N/A")
    alerts = metrics.get("alerts", [])
    alert_types = ", ".join(a.get("type", "") for a in alerts) if alerts else "none"
    return (
        f"**Triage Summary for {service}**\n\n"
        f"Severity: {severity} | Error rate: {error_rate}%\n"
        f"Active alerts: {alert_types}\n"
        f"Log lines analysed: {len(logs)}. "
        f"This appears to be a genuine incident requiring further root-cause analysis."
    )
