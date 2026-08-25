"""
Mock APM / telemetry tools.

Provides simulated Datadog-style metrics, CloudWatch-style logs, and APM traces
so the agents can diagnose incidents without real monitoring infrastructure.
"""

from __future__ import annotations

import random
from datetime import datetime, timedelta
from typing import Any, Dict, List


# ── Scenario Data ───────────────────────────────────────────

_DB_DEADLOCK_METRICS: Dict[str, Any] = {
    "service": "payment-service",
    "error_rate_percent": 47.3,
    "p99_latency_ms": 12_400,
    "active_db_connections": 120,
    "db_connection_pool_max": 100,
    "cpu_percent": 38.2,
    "memory_percent": 61.0,
    "alerts": [
        {"type": "DB_LOCK_WAIT_TIMEOUT", "count": 342, "window": "5m"},
        {"type": "SLOW_QUERY", "count": 89, "window": "5m"},
    ],
}

_POD_CRASH_METRICS: Dict[str, Any] = {
    "service": "user-service",
    "error_rate_percent": 100.0,
    "p99_latency_ms": 0,
    "pod_restarts_last_hour": 14,
    "last_oom_killed": "2026-08-23T17:44:12Z",
    "cpu_percent": 95.7,
    "memory_percent": 99.8,
    "alerts": [
        {"type": "OOM_KILLED", "count": 14, "window": "1h"},
        {"type": "CONTAINER_CRASH_LOOP", "count": 14, "window": "1h"},
    ],
}

_HIGH_LATENCY_METRICS: Dict[str, Any] = {
    "service": "api-gateway",
    "error_rate_percent": 5.1,
    "p99_latency_ms": 8_750,
    "worker_threads_active": 200,
    "worker_threads_max": 200,
    "request_queue_depth": 3_421,
    "cpu_percent": 72.5,
    "memory_percent": 55.3,
    "alerts": [
        {"type": "HIGH_LATENCY", "count": 1_204, "window": "10m"},
        {"type": "THREAD_POOL_SATURATED", "count": 1, "window": "10m"},
    ],
}

_SCENARIO_METRICS = {
    "db_deadlock": _DB_DEADLOCK_METRICS,
    "pod_crash": _POD_CRASH_METRICS,
    "high_latency": _HIGH_LATENCY_METRICS,
}

# ── Mock Log Lines ──────────────────────────────────────────

_DB_DEADLOCK_LOGS = [
    "2026-08-23T17:45:01Z ERROR payment-service  Lock wait timeout exceeded; PID 4821 waiting for table `orders`",
    "2026-08-23T17:45:02Z ERROR payment-service  Lock wait timeout exceeded; PID 4822 waiting for table `orders`",
    "2026-08-23T17:45:03Z WARN  payment-service  Connection pool exhausted – 120/100 active connections",
    "2026-08-23T17:45:05Z ERROR payment-service  Deadlock detected between PID 4821 and PID 4819 on table `orders`",
    "2026-08-23T17:45:06Z ERROR payment-service  Transaction rolled back for PID 4822 after 30s timeout",
]

_POD_CRASH_LOGS = [
    "2026-08-23T17:44:10Z INFO  user-service  Starting request handler pool...",
    "2026-08-23T17:44:11Z WARN  user-service  Memory usage at 97% (1945Mi / 2000Mi)",
    "2026-08-23T17:44:12Z FATAL user-service  OOMKilled – container exceeded memory limit",
    "2026-08-23T17:44:13Z INFO  kubelet       Pod user-service-7b4f9c restarting (restart count: 14)",
    "2026-08-23T17:44:14Z ERROR user-service  CrashLoopBackOff – back-off 5m0s restarting failed container",
]

_HIGH_LATENCY_LOGS = [
    "2026-08-23T18:00:01Z WARN  api-gateway  Worker thread pool saturated: 200/200 active threads",
    "2026-08-23T18:00:02Z WARN  api-gateway  Request queue depth: 3421 (threshold: 500)",
    "2026-08-23T18:00:03Z ERROR api-gateway  Upstream timeout: payment-service did not respond within 5000ms",
    "2026-08-23T18:00:04Z WARN  api-gateway  Rate limiter engaged – dropping 12% of incoming requests",
    "2026-08-23T18:00:05Z ERROR api-gateway  Circuit breaker OPEN for payment-service (failure rate 45%)",
]

_SCENARIO_LOGS = {
    "db_deadlock": _DB_DEADLOCK_LOGS,
    "pod_crash": _POD_CRASH_LOGS,
    "high_latency": _HIGH_LATENCY_LOGS,
}


# ── Public Tool Functions ───────────────────────────────────


async def fetch_metrics(service: str, scenario: str | None = None) -> Dict[str, Any]:
    """Return mock APM metrics for the given service / scenario."""
    if scenario and scenario in _SCENARIO_METRICS:
        return _SCENARIO_METRICS[scenario]
    # Fallback: generate generic noisy data
    return {
        "service": service,
        "error_rate_percent": round(random.uniform(0.5, 50.0), 1),
        "p99_latency_ms": random.randint(200, 10_000),
        "cpu_percent": round(random.uniform(10, 95), 1),
        "memory_percent": round(random.uniform(20, 90), 1),
        "alerts": [],
    }


async def fetch_logs(service: str, scenario: str | None = None) -> List[str]:
    """Return mock application log lines for the given service / scenario."""
    if scenario and scenario in _SCENARIO_LOGS:
        return _SCENARIO_LOGS[scenario]
    now = datetime.utcnow()
    return [
        f"{(now - timedelta(seconds=i)).isoformat()}Z INFO  {service}  Healthy heartbeat"
        for i in range(5, 0, -1)
    ]


async def fetch_apm_traces(service: str, scenario: str | None = None) -> List[Dict[str, Any]]:
    """Return simplified APM trace spans for the scenario."""
    if scenario == "high_latency":
        return [
            {
                "trace_id": "abc-001",
                "span": "POST /api/checkout",
                "duration_ms": 8_750,
                "status": "TIMEOUT",
                "downstream": [
                    {"service": "payment-service", "duration_ms": 5_200, "status": "ERROR"},
                    {"service": "inventory-service", "duration_ms": 120, "status": "OK"},
                ],
            }
        ]
    if scenario == "db_deadlock":
        return [
            {
                "trace_id": "abc-002",
                "span": "POST /api/payment",
                "duration_ms": 30_000,
                "status": "LOCK_TIMEOUT",
                "downstream": [
                    {"service": "postgres", "duration_ms": 30_000, "status": "DEADLOCK"},
                ],
            }
        ]
    return []
