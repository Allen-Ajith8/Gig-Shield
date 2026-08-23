"""
Root-Cause Detective Agent – Node 2 of the incident resolution graph.

Responsibilities:
  1. Query git commit history for the affected service.
  2. Inspect database lock state / slow queries (if relevant).
  3. Correlate findings with the triage summary.
  4. Produce a root-cause explanation.
"""

from __future__ import annotations

import json
import logging
from typing import Any, Dict

from langchain_core.messages import SystemMessage, HumanMessage

from app.agents.state import IncidentState
from app.api.websocket import manager
from app.tools import git_tools, db_tools, telemetry_tools

logger = logging.getLogger(__name__)

DETECTIVE_SYSTEM_PROMPT = """\
You are the **Root-Cause Detective Agent** in an autonomous SRE system.

You are given:
- A triage summary describing the symptoms.
- Recent git commits and their diffs for the affected service.
- Database process/lock information (if applicable).
- APM trace data (if applicable).

Your job is to determine the **exact root cause** of the incident.
Be specific: name the commit SHA, the code change, the config mistake,
or the resource leak that triggered the failure.

Respond with ONLY the root-cause explanation (2-4 paragraphs). Do NOT
include any JSON or markdown formatting.
"""


async def detective_node(state: IncidentState, config: Dict[str, Any]) -> Dict[str, Any]:
    """Execute root-cause analysis and return state updates."""
    incident_id = state["incident_id"]
    alert = state["alert"]
    scenario = alert.get("scenario")
    service = alert.get("service", "unknown-service")
    triage_summary = state.get("triage_summary", "No triage summary available.")

    await manager.broadcast(incident_id, "AGENT_STEP",
                            "Root-Cause Detective starting investigation …", "RootCauseDetective")

    # ── Gather cross-system context ─────────────────────────
    await manager.broadcast_log(incident_id, "Querying recent git commits …", "RootCauseDetective")
    commits = await git_tools.get_recent_commits(service, scenario)

    diff_text = ""
    if commits:
        sha = commits[0]["sha"]
        await manager.broadcast_log(incident_id, f"Fetching diff for commit {sha} …", "RootCauseDetective")
        diff_text = await git_tools.get_commit_diff(sha, scenario)

    await manager.broadcast_log(incident_id, "Checking database state …", "RootCauseDetective")
    db_procs = await db_tools.get_active_processes(scenario)
    lock_info = await db_tools.get_lock_info(scenario)

    await manager.broadcast_log(incident_id, "Fetching APM traces …", "RootCauseDetective")
    traces = await telemetry_tools.fetch_apm_traces(service, scenario)

    await manager.broadcast(
        incident_id, "TOOL_CALL", "Cross-system data gathered",
        "RootCauseDetective",
        {"commits": len(commits), "deadlock": lock_info.get("deadlock_detected", False), "traces": len(traces)},
    )

    # ── Build LLM prompt ────────────────────────────────────
    context_parts = [
        f"## Triage Summary\n{triage_summary}",
        f"## Recent Commits\n```json\n{json.dumps(commits, indent=2)}\n```",
    ]
    if diff_text:
        context_parts.append(f"## Commit Diff\n```diff\n{diff_text}\n```")
    context_parts.append(f"## Database Processes\n```json\n{json.dumps(db_procs, indent=2)}\n```")
    context_parts.append(f"## Lock Info\n```json\n{json.dumps(lock_info, indent=2)}\n```")
    if traces:
        context_parts.append(f"## APM Traces\n```json\n{json.dumps(traces, indent=2)}\n```")

    user_content = "\n\n".join(context_parts)

    # ── Call LLM ────────────────────────────────────────────
    try:
        from app.agents.graph import get_llm
        llm = get_llm()
        response = await llm.ainvoke([
            SystemMessage(content=DETECTIVE_SYSTEM_PROMPT),
            HumanMessage(content=user_content),
        ])
        root_cause = response.content.strip()
    except Exception as exc:
        logger.warning("LLM call failed in detective – using fallback. Error: %s", exc)
        root_cause = _fallback_root_cause(scenario, commits, lock_info)

    await manager.broadcast(incident_id, "AGENT_STEP", root_cause, "RootCauseDetective")
    await manager.broadcast_log(incident_id, "Root-cause analysis complete.", "RootCauseDetective")

    return {
        "root_cause": root_cause,
        "logs": [
            f"[RootCauseDetective] Analysed {len(commits)} commits",
            f"[RootCauseDetective] Deadlock detected: {lock_info.get('deadlock_detected', False)}",
            f"[RootCauseDetective] Root cause identified",
        ],
    }


def _fallback_root_cause(scenario: str | None, commits: list, lock_info: dict) -> str:
    """Deterministic fallback when the LLM is unavailable."""
    if scenario == "db_deadlock":
        return (
            "Root cause: commit a1b2c3d by dev-bob introduced a batch order processor "
            "that acquires locks on `orders` then `inventory` in the reverse order of the "
            "single-order path, creating a classic deadlock cycle between PIDs 4819 and 4821."
        )
    if scenario == "pod_crash":
        return (
            "Root cause: commit x7y8z9a by dev-charlie added an in-memory session cache "
            "with no max-size or eviction policy. Under load, the cache grows unbounded "
            "until the container is OOM-killed (memory limit 2000Mi)."
        )
    if scenario == "high_latency":
        return (
            "Root cause: commit m1n2o3p by dev-diana reduced the gateway request timeout "
            "from 10 000ms to 5 000ms and the circuit-breaker failure threshold from 60% to "
            "45% for a load test, but forgot to revert. This causes cascading timeouts and "
            "circuit-breaker trips under normal traffic."
        )
    return "Unable to determine root cause automatically. Manual investigation required."
