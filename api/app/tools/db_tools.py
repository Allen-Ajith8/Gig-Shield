"""
Mock database inspection tools.

Simulates querying active processes, lock state, and slow query logs
from a PostgreSQL-style database.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional


# ── Scenario Data ───────────────────────────────────────────

_DB_DEADLOCK_PROCESSES: List[Dict[str, Any]] = [
    {
        "pid": 4819,
        "user": "payment_svc",
        "state": "active",
        "wait_event": "transactionid",
        "query": "UPDATE inventory SET qty = qty - 1 WHERE sku = 'SKU-1001' FOR UPDATE",
        "duration_s": 45.2,
        "blocked_by": 4821,
    },
    {
        "pid": 4821,
        "user": "payment_svc",
        "state": "active",
        "wait_event": "transactionid",
        "query": "SELECT * FROM orders WHERE id = 7742 FOR UPDATE",
        "duration_s": 44.8,
        "blocked_by": 4819,
    },
    {
        "pid": 4822,
        "user": "payment_svc",
        "state": "idle in transaction",
        "wait_event": "Lock",
        "query": "INSERT INTO orders (id, sku, qty) VALUES (7743, 'SKU-1002', 2)",
        "duration_s": 30.1,
        "blocked_by": 4821,
    },
]

_SLOW_QUERIES: List[Dict[str, Any]] = [
    {
        "query": "SELECT * FROM orders WHERE id = %s FOR UPDATE",
        "avg_duration_ms": 28_500,
        "calls_last_5m": 342,
        "rows_examined": 1,
    },
    {
        "query": "UPDATE inventory SET qty = qty - %s WHERE sku = %s FOR UPDATE",
        "avg_duration_ms": 25_200,
        "calls_last_5m": 310,
        "rows_examined": 1,
    },
]


# ── Public Tool Functions ───────────────────────────────────


async def get_active_processes(scenario: Optional[str] = None) -> List[Dict[str, Any]]:
    """Return mock pg_stat_activity rows showing active DB backends."""
    if scenario == "db_deadlock":
        return _DB_DEADLOCK_PROCESSES
    # Default: healthy
    return [
        {
            "pid": 1001,
            "user": "app_user",
            "state": "idle",
            "wait_event": None,
            "query": "",
            "duration_s": 0.0,
            "blocked_by": None,
        }
    ]


async def get_lock_info(scenario: Optional[str] = None) -> Dict[str, Any]:
    """Return deadlock / lock-chain information."""
    if scenario == "db_deadlock":
        return {
            "deadlock_detected": True,
            "lock_chain": [
                {"holder_pid": 4819, "waiter_pid": 4821, "table": "inventory", "lock_type": "RowExclusiveLock"},
                {"holder_pid": 4821, "waiter_pid": 4819, "table": "orders", "lock_type": "RowExclusiveLock"},
            ],
            "recommendation": "Kill PID 4821 to break the deadlock cycle.",
        }
    return {"deadlock_detected": False, "lock_chain": [], "recommendation": None}


async def get_slow_queries(scenario: Optional[str] = None) -> List[Dict[str, Any]]:
    """Return top slow queries from pg_stat_statements."""
    if scenario == "db_deadlock":
        return _SLOW_QUERIES
    return []
