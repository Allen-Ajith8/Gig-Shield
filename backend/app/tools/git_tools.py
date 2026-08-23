"""
Mock git history / commit diff tools.

Returns realistic commit logs and diffs that introduced the problems
for each mock scenario.
"""

from __future__ import annotations

from typing import Any, Dict, List, Optional


# ── Scenario Commit Data ────────────────────────────────────

_DB_DEADLOCK_COMMITS: List[Dict[str, Any]] = [
    {
        "sha": "a1b2c3d",
        "author": "dev-bob@company.com",
        "date": "2026-08-23T15:10:00Z",
        "message": "feat(payment): add bulk order insert for batch processing",
        "files_changed": ["src/payment/batch_processor.py", "src/payment/models.py"],
    },
    {
        "sha": "e4f5g6h",
        "author": "dev-alice@company.com",
        "date": "2026-08-23T14:30:00Z",
        "message": "fix(payment): increase timeout for order queries",
        "files_changed": ["src/payment/db_config.py"],
    },
]

_DB_DEADLOCK_DIFF = """
--- a/src/payment/batch_processor.py
+++ b/src/payment/batch_processor.py
@@ -42,8 +42,15 @@ class BatchProcessor:
     def process_batch(self, orders: List[Order]) -> None:
-        with self.db.transaction():
-            for order in orders:
-                self.db.insert(order)
+        # NOTE: This acquires row-level locks on `orders` table
+        # and then tries to update `inventory` – reverse lock order
+        # compared to the single-order path, causing deadlocks.
+        for order in orders:
+            with self.db.transaction():
+                self.db.execute("SELECT * FROM orders WHERE id = %s FOR UPDATE", order.id)
+                self.db.execute("UPDATE inventory SET qty = qty - %s WHERE sku = %s FOR UPDATE", order.qty, order.sku)
+                self.db.insert(order)
""".strip()

_POD_CRASH_COMMITS: List[Dict[str, Any]] = [
    {
        "sha": "x7y8z9a",
        "author": "dev-charlie@company.com",
        "date": "2026-08-23T16:00:00Z",
        "message": "feat(user): add in-memory user session cache",
        "files_changed": ["src/user/session_cache.py", "src/user/handlers.py"],
    },
]

_POD_CRASH_DIFF = """
--- a/src/user/session_cache.py
+++ b/src/user/session_cache.py
@@ -0,0 +1,25 @@
+class SessionCache:
+    \"\"\"In-memory LRU cache for user sessions.\"\"\"
+
+    def __init__(self):
+        self._store: dict = {}  # BUG: no max-size, no eviction policy
+
+    def get(self, session_id: str):
+        return self._store.get(session_id)
+
+    def put(self, session_id: str, data: dict):
+        # Stores full session payload (~2KB each) without bound
+        self._store[session_id] = data
+
+    # Missing: cleanup / TTL / max-size -> OOMKill under load
""".strip()

_HIGH_LATENCY_COMMITS: List[Dict[str, Any]] = [
    {
        "sha": "m1n2o3p",
        "author": "dev-diana@company.com",
        "date": "2026-08-23T17:20:00Z",
        "message": "chore(gateway): update thread pool config for load test",
        "files_changed": ["config/gateway.yaml"],
    },
]

_HIGH_LATENCY_DIFF = """
--- a/config/gateway.yaml
+++ b/config/gateway.yaml
@@ -8,7 +8,7 @@ server:
   worker_threads: 200
-  request_timeout_ms: 10000
+  request_timeout_ms: 5000   # reduced for load test – forgot to revert
   circuit_breaker:
-    failure_threshold: 60
+    failure_threshold: 45     # more aggressive – causes cascading opens
""".strip()

_COMMITS = {
    "db_deadlock": _DB_DEADLOCK_COMMITS,
    "pod_crash": _POD_CRASH_COMMITS,
    "high_latency": _HIGH_LATENCY_COMMITS,
}

_DIFFS = {
    "db_deadlock": _DB_DEADLOCK_DIFF,
    "pod_crash": _POD_CRASH_DIFF,
    "high_latency": _HIGH_LATENCY_DIFF,
}


# ── Public Tool Functions ───────────────────────────────────


async def get_recent_commits(
    service: str, scenario: Optional[str] = None, limit: int = 5
) -> List[Dict[str, Any]]:
    """Return the most recent commits for a service."""
    if scenario and scenario in _COMMITS:
        return _COMMITS[scenario][:limit]
    return [
        {
            "sha": "0000000",
            "author": "ci-bot@company.com",
            "date": "2026-08-23T12:00:00Z",
            "message": "chore: scheduled dependency update",
            "files_changed": ["requirements.txt"],
        }
    ]


async def get_commit_diff(
    sha: str, scenario: Optional[str] = None
) -> str:
    """Return the unified diff for a specific commit SHA."""
    if scenario and scenario in _DIFFS:
        return _DIFFS[scenario]
    return "(no diff available for this commit)"
