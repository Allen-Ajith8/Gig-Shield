# Autonomous SRE Backend

AI-native multi-agent incident resolution platform powered by **FastAPI**, **LangGraph**, and **LangChain**.

## Architecture

```
Alert Webhook ──► POST /api/v1/incidents/trigger
                        │
                  ┌─────▼─────┐
                  │  Triage    │  Analyses metrics & logs
                  │  Agent     │
                  └─────┬─────┘
                        │
                  ┌─────▼─────┐
                  │  Detective │  Git diffs, DB locks, APM traces
                  │  Agent     │
                  └─────┬─────┘
                        │
                  ┌─────▼─────┐
                  │ Remediation│  Formulates fix & sandbox test
                  │  Agent     │
                  └─────┬─────┘
                        │
                  ┌─────▼─────┐
                  │  Approval  │  Pauses for human review
                  │  Gate      │  (if required)
                  └─────┬─────┘
                        │
                  ┌─────▼─────┐
                  │ Execution  │  Applies fix & generates
                  │ Post-Mortem│  incident report
                  └───────────┘
```

Every step streams events over **WebSocket** → `ws://localhost:8000/ws/incidents/{incident_id}`

## Quick Start

### 1. Install dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env with your LLM API key
```

### 3. Run the server

```bash
uvicorn app.main:app --reload --port 8000
```

### 4. Trigger a mock incident

```bash
# Database Deadlock scenario
curl -X POST http://localhost:8000/api/v1/incidents/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "service": "payment-service",
    "severity": "CRITICAL",
    "description": "High error rate detected on payment-service",
    "scenario": "db_deadlock"
  }'

# Pod Crash / OOM scenario
curl -X POST http://localhost:8000/api/v1/incidents/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "service": "user-service",
    "severity": "CRITICAL",
    "description": "user-service pods crash-looping",
    "scenario": "pod_crash"
  }'

# High Latency scenario
curl -X POST http://localhost:8000/api/v1/incidents/trigger \
  -H "Content-Type: application/json" \
  -d '{
    "service": "api-gateway",
    "severity": "HIGH",
    "description": "p99 latency exceeding SLO",
    "scenario": "high_latency"
  }'
```

### 5. Check incident status

```bash
curl http://localhost:8000/api/v1/incidents/{incident_id}
```

### 6. Approve a pending incident

```bash
curl -X POST http://localhost:8000/api/v1/incidents/{incident_id}/approve \
  -H "Content-Type: application/json" \
  -d '{"approved": true, "reviewer": "alice@company.com", "comment": "Looks good"}'
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/incidents/trigger` | Ingest alert & start agent workflow |
| `GET` | `/api/v1/incidents` | List all incidents |
| `GET` | `/api/v1/incidents/{id}` | Get full incident state |
| `POST` | `/api/v1/incidents/{id}/approve` | Submit approval decision |
| `WS` | `/ws/incidents/{id}` | Real-time event stream |
| `GET` | `/health` | Health check |

## WebSocket Events

Connect to `ws://localhost:8000/ws/incidents/{incident_id}` to receive:

```json
{
  "incident_id": "INC-A1B2C3D4",
  "event_type": "AGENT_STEP",
  "agent_name": "TriageAgent",
  "message": "Fetching metrics for payment-service …",
  "timestamp": "2026-08-23T18:00:00Z",
  "data": {}
}
```

Event types: `AGENT_STEP`, `LOG`, `STATUS_CHANGE`, `APPROVAL_REQUEST`, `RESOLVED`, `TOOL_CALL`, `ERROR`

## Mock Scenarios

The backend ships with three built-in scenarios that work without any external dependencies:

| Scenario | Key | Root Cause |
|----------|-----|------------|
| Database Deadlock | `db_deadlock` | Reverse lock ordering in batch processor |
| Pod Crash / OOM | `pod_crash` | Unbounded in-memory session cache |
| High Latency | `high_latency` | Unrevetted load-test config change |

## Tech Stack

- **FastAPI** + **Uvicorn** – async REST & WebSockets
- **LangGraph** – multi-agent state machine
- **LangChain** – LLM integration (OpenAI / Anthropic / Google)
- **Pydantic v2** – request/response validation
- **Docker SDK** – optional real sandbox execution
