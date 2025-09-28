# Documentation Conflict Matrix (Phase 1 · Task 1.2)

## Conflicting Sources

| Topic | Source A | Source B | Conflict Description | Impact | Suggested Fix |
|-------|----------|----------|----------------------|--------|---------------|
| Environment variables | `env.example` sets `DJANGO_SECRET_KEY` and unused agent vars.【F:env.example†L1-L17】 | Django settings expect `SECRET_KEY`, `DEBUG`, booking notification settings, and do not reference agent vars.【F:finetune-ERP-backend-New/config/settings.py†L17-L84】 | Sample env misleads deployers, omitting required keys and advertising unused fields. | High – incorrect secrets prevent backend startup and hardened pipeline configuration. | Rewrite `env.example` to expose `SECRET_KEY`, `DEBUG`, notification channels, Redis/Mem0 settings; document deprecated keys. |
| JS package manager | Root README instructs `pnpm install --prefix …`.【F:README.md†L13-L24】 | Test Guide & CI Guide instruct `npm ci` / `npm run`, and workflow uses `npm`.【F:docs/TEST_GUIDE.md†L21-L39】【F:docs/project/CI_GUIDE.md†L6-L18】【F:.github/workflows/test.yml†L12-L18】 | Contributors receive mixed tooling guidance (PNPM vs npm). | High – inconsistent installs break lockfile integrity and CI reproducibility. | Standardize on PNPM across docs and CI; update workflows accordingly. |
| Backend dependency install | GitHub Action installs `requirements-dev.txt`.【F:.github/workflows/test.yml†L20-L24】 | Backend uses `pyproject.toml` extras with `pip install -e .[backend,dev,test]`.【F:pyproject.toml†L1-L35】【F:docs/TEST_GUIDE.md†L5-L19】 | Workflow references missing requirements file causing CI failures. | High – pipeline cannot install deps, blocking tests. | Replace with `pip install -e .[backend,dev,test]` or add generated requirements file. |
| Frontend architecture | Frontend architecture doc states no RTK Query cache and lists `/terms-and-conditions/` route.【F:finetune-ERP-frontend-New/docs/ARCHITECTURE.md†L1-L24】 | Actual code uses RTK Query hooks and exposes `/legal` instead.【F:finetune-ERP-frontend-New/src/api/erpApi.js†L1-L120】【F:finetune-ERP-frontend-New/src/App.jsx†L47-L108】 | Architecture doc misrepresents data layer and routing. | Medium – onboarding devs misread state patterns; QA hits wrong URLs. | Update doc to describe RTK Query usage and correct route map. |
| API router location | Multiple docs reference FastAPI-style `backend-v2/app/routers/` (implied by product brief).【F:docs/audit/CURRENT_STATE_REPORT.md†L5-L34】 | Actual routes defined in Django `config/urls.py` and app routers.【F:finetune-ERP-backend-New/config/urls.py†L28-L38】 | Contributors guided to nonexistent directory. | High – changes land in wrong tree, delaying fixes. | Replace references with Django router map; add migration plan if backend-v2 still planned. |
| Deployment scripts | README references `scripts/deploy_agent.py`.【F:README.md†L34-L43】 | Repository contains no `scripts/` directory or deploy script.【F:docs/audit/CURRENT_STATE_REPORT.md†L139-L150】 | Setup instructions point to missing automation. | Medium – deploy attempts fail; hardened pipeline lacks documented entry point. | Remove or recreate script and document hardened deployment flow. |
| Known issues | Known Issues doc claims none exist.【F:docs/known-issues/KNOWN_ISSUES.md†L1-L6】 | Audit reveals env mismatch, CI misconfig, stale docs.【F:docs/audit/CURRENT_STATE_REPORT.md†L97-L214】 | Issue tracker hides critical documentation and pipeline gaps. | Medium – teams unaware of blockers, delaying remediation. | Populate known issues with identified conflicts and hardened pipeline gaps. |

## API Endpoint Coverage Gaps

| Implemented Endpoint | Documentation Coverage | Notes |
|---------------------|------------------------|-------|
| `/api/attendance/*` – check-in/out, approvals, payroll admin endpoints.【F:finetune-ERP-backend-New/attendance/urls.py†L1-L78】 | Not mentioned in API Guide tables.【F:docs/API_GUIDE.md†L1-L83】 | Add attendance section detailing auth scopes and payroll workflows. |
| Marketing contact hooks `/api/marketing/*` and `/api/schedule-call`.【F:finetune-ERP-backend-New/marketing/urls.py†L1-L38】 | API Guide omits marketing endpoints.【F:docs/API_GUIDE.md†L1-L83】 | Document throttling scopes (`contact`, `schedule_call`) and payloads. |
| Agent callback hooks `/agents/<name>/hooks` noted in AGENTS overview.【F:AGENTS.md†L45-L64】 | No dedicated API or integration contract entry.【F:docs/API_GUIDE.md†L1-L83】 | Extend contract with hook authentication and payload schema. |

## Feature Documentation Gaps

| Feature in Code | Evidence | Missing Doc |
|-----------------|----------|-------------|
| Workledger focus layout (`/workledger/*`).【F:finetune-ERP-frontend-New/src/App.jsx†L66-L83】 | Not covered in Admin Dashboard or Frontend Guide.【F:docs/how-to/ADMIN_DASHBOARD.md†L1-L47】【F:docs/FRONTEND_GUIDE.md†L1-L13】 |
| Giveaway redemption workflow (`/giveaway-redemption`).【F:finetune-ERP-frontend-New/src/App.jsx†L84-L94】 | No how-to or customer guide entry.【F:docs/how-to/ADMIN_DASHBOARD.md†L1-L47】【F:docs/how-to/CUSTOMER_GUIDE.md†L1-L60】 |
| Attendance admin schedules/payroll endpoints.【F:finetune-ERP-backend-New/attendance/urls.py†L32-L78】 | Dashboard docs do not mention scheduling UI or payroll approvals.【F:docs/how-to/ADMIN_DASHBOARD.md†L1-L47】 |
| Hardened enhancement pipeline & Mem0 v2 | Not referenced in any doc, env, or settings.【F:docs/audit/CURRENT_STATE_REPORT.md†L5-L214】 | Entire pipeline undocumented; add architecture + runbook sections. |

## Summary of Conflicts

- Environment and tooling discrepancies are the highest-risk items because they block installs and CI runs.
- API and feature documentation lag behind implemented attendance, marketing, workledger, and giveaway flows.
- Hardened enhancement pipeline and Mem0 v2 are absent from code and docs, indicating a documentation and implementation gap that must be resolved before rollout.
