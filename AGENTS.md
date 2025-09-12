# AGENTS

## Active Code Areas
- `finetune-ERP-backend-New` – Django REST backend
- `finetune-ERP-frontend-New` – React Vite frontend

## Read-only Areas
- `legacy_django` – historical reference only; do not modify

## Environment Setup
### Backend
```bash
pip install -r requirements-dev.txt
pip install -r finetune-ERP-backend-New/requirements-test.txt
```
Use SQLite for tests and avoid external services.

### Frontend
```bash
pnpm install
```
Run inside `finetune-ERP-frontend-New`.

## Testing
### Backend
```bash
pytest finetune-ERP-backend-New/tests -q
```

### Frontend
```bash
pnpm --prefix finetune-ERP-frontend-New test
```
Vitest configured via `vitest.config.js` and global setup in `setupTests.js`.

## Lint & Format
- Backend: none enforced (Ruff/Mypy optional in the future)
- Frontend: ESLint (`eslint.config.js`) and Prettier (`prettier.config.js`)

## Pull Requests
**Title**: `[scope] short summary`

**Body**:
1. **Problem**
2. **Approach**
3. **Tests**
4. **Risks**
5. **Rollback**

---

## Agent Overview
finetune.os orchestrates specialized agents that communicate over Redis and HTTP. Each agent owns a discrete capability such as scheduling, data ingestion, or report generation.

## Core Components
- **Coordinator** – dispatches tasks to agents and aggregates results.
- **Registry** – YAML catalogue mapping agent names to Docker images.
- **Queue** – Redis instance used for task routing.

## Integration Points
- Agents expose REST hooks under `/agents/<name>/hooks`.
- Frontend widgets interact with agents through the coordinator API.
- Custom agents implement the `AgentProtocol` class in `finetune-ERP-backend-New/utils/agents.py`.

## Workflow Examples
1. User submits a job via UI.
2. Coordinator enqueues task to Redis.
3. Agent consumes the job, performs work, and posts results to the callback URL.
4. Frontend polls coordinator for completion and renders output.

