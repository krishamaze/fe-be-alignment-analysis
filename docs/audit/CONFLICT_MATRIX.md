# Documentation Conflict Matrix (Phase 1 · Task 1.2)

## Conflicting Sources

| Topic | Source A | Source B | Conflict Description | Impact | Suggested Fix |
|-------|----------|----------|----------------------|--------|---------------|
| Environment variables | `env.example` now exposes `SECRET_KEY`, `DEBUG`, and `ALLOWED_HOSTS` to mirror runtime expectations.【F:env.example†L1-L17】 | Django settings consume the same keys with safe defaults when unset.【F:finetune-ERP-backend-New/config/settings.py†L17-L64】 | ✅ Resolved – sample env and settings agree on required configuration. | None | Keep reference docs synced via `docs/reference/ENVIRONMENT_KEYS.md`. |
| JS package manager | README and Test Guide direct contributors to pnpm commands for install/test flows.【F:README.md†L9-L24】【F:docs/TEST_GUIDE.md†L21-L43】 | GitHub workflows and CI guide run the same pnpm scripts with frozen lockfile installs.【F:docs/project/CI_GUIDE.md†L6-L18】【F:.github/workflows/test.yml†L1-L28】【F:.github/workflows/lint.yml†L1-L52】【F:.github/workflows/lighthouse.yml†L1-L25】 | ✅ Resolved – docs and CI consistently use pnpm. | None | Continue enforcing lockfile integrity with `--frozen-lockfile` in CI. |
| Backend dependency install | Test workflow installs extras via `pip install -e .[backend,dev,test]`.【F:.github/workflows/test.yml†L23-L27】 | Pyproject defines the extras used across docs and guides.【F:pyproject.toml†L1-L35】【F:docs/TEST_GUIDE.md†L5-L19】 | ✅ Resolved – CI matches project packaging metadata. | None | Monitor extras definitions when adding dependencies. |
| Frontend architecture | Frontend architecture doc states no RTK Query cache and lists `/terms-and-conditions/` route.【F:finetune-ERP-frontend-New/docs/ARCHITECTURE.md†L1-L24】 | Actual code uses RTK Query hooks and exposes `/legal` instead.【F:finetune-ERP-frontend-New/src/api/erpApi.js†L1-L120】【F:finetune-ERP-frontend-New/src/App.jsx†L47-L108】 | Architecture doc misrepresents data layer and routing. | Medium – onboarding devs misread state patterns; QA hits wrong URLs. | Update doc to describe RTK Query usage and correct route map. |
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
