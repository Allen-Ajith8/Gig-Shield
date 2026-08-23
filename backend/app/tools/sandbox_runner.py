"""
Sandbox execution runner.

In "mock" mode it simulates running a remediation command in an
ephemeral container and returns deterministic output.

In "docker" mode it uses the Docker Python SDK to spin up a real
ephemeral container, execute the command, and capture output.
"""

from __future__ import annotations

import asyncio
import logging
from typing import Any, Dict

from app.config import settings

logger = logging.getLogger(__name__)


# ── Mock execution results ──────────────────────────────────

_MOCK_RESULTS: Dict[str, Dict[str, Any]] = {
    "KILL_PID": {
        "status": "SUCCESS",
        "output": (
            "Connected to postgres@payment-db:5432\n"
            "Executing: SELECT pg_terminate_backend(4821);\n"
            " pg_terminate_backend \n"
            "───────────────────────\n"
            " t\n"
            "(1 row)\n\n"
            "PID 4821 terminated successfully.\n"
            "Deadlock cycle broken – lock waiters released.\n"
            "Validation: active locks = 0, connection pool utilisation = 42/100."
        ),
    },
    "RESTART_POD": {
        "status": "SUCCESS",
        "output": (
            "$ kubectl rollout restart deployment/user-service -n production\n"
            "deployment.apps/user-service restarted\n\n"
            "$ kubectl rollout status deployment/user-service -n production --timeout=120s\n"
            "Waiting for deployment \"user-service\" rollout to finish: 1 of 3 updated replicas are available...\n"
            "Waiting for deployment \"user-service\" rollout to finish: 2 of 3 updated replicas are available...\n"
            "deployment \"user-service\" successfully rolled out\n\n"
            "Validation: all 3/3 pods Running, memory usage 340Mi / 2000Mi."
        ),
    },
    "APPLY_PATCH": {
        "status": "SUCCESS",
        "output": (
            "Applying config patch to config/gateway.yaml …\n"
            "--- a/config/gateway.yaml\n"
            "+++ b/config/gateway.yaml\n"
            "-  request_timeout_ms: 5000\n"
            "+  request_timeout_ms: 10000\n"
            "-  failure_threshold: 45\n"
            "+  failure_threshold: 60\n\n"
            "$ kubectl apply -f config/gateway.yaml\n"
            "configmap/api-gateway-config configured\n\n"
            "$ kubectl rollout restart deployment/api-gateway -n production\n"
            "deployment.apps/api-gateway restarted\n\n"
            "Validation: p99 latency dropped to 320ms, thread pool 45/200 active."
        ),
    },
}


async def run_in_sandbox(
    action_type: str,
    command: str,
    timeout_seconds: int = 30,
) -> Dict[str, Any]:
    """
    Execute a remediation command inside an isolated sandbox.

    Parameters
    ----------
    action_type : str
        One of KILL_PID, RESTART_POD, APPLY_PATCH.
    command : str
        The shell command / script to execute.
    timeout_seconds : int
        Maximum wall-clock seconds for execution.

    Returns
    -------
    dict with keys ``status`` ("SUCCESS" | "FAILED") and ``output`` (str).
    """
    if settings.sandbox_mode == "mock":
        return await _mock_execute(action_type, command)
    else:
        return await _docker_execute(command, timeout_seconds)


# ── Mock implementation ─────────────────────────────────────


async def _mock_execute(action_type: str, command: str) -> Dict[str, Any]:
    """Simulate sandbox execution with a small delay."""
    logger.info("Mock sandbox executing: %s -> %s", action_type, command)
    # Simulate execution time
    await asyncio.sleep(1.5)
    result = _MOCK_RESULTS.get(action_type)
    if result:
        return result
    return {
        "status": "SUCCESS",
        "output": f"(mock) Executed: {command}\nExit code 0.",
    }


# ── Docker implementation (opt-in) ──────────────────────────


async def _docker_execute(command: str, timeout_seconds: int) -> Dict[str, Any]:
    """Run the command in an ephemeral Docker container."""
    try:
        import docker as docker_sdk  # type: ignore

        client = docker_sdk.from_env()
        container = client.containers.run(
            image="alpine:3.19",
            command=["sh", "-c", command],
            detach=True,
            mem_limit="256m",
            network_mode="none",  # no network access for safety
            remove=False,
        )
        # Wait with timeout
        result = await asyncio.to_thread(container.wait, timeout=timeout_seconds)
        logs = await asyncio.to_thread(container.logs, stdout=True, stderr=True)
        await asyncio.to_thread(container.remove, force=True)

        exit_code = result.get("StatusCode", -1)
        output = logs.decode("utf-8", errors="replace")
        return {
            "status": "SUCCESS" if exit_code == 0 else "FAILED",
            "output": output,
        }
    except Exception as exc:
        logger.exception("Docker sandbox execution failed")
        return {
            "status": "FAILED",
            "output": f"Docker execution error: {exc}",
        }
