# Current State Report (Phase 1 · Task 1.1)

## Backend Runtime & Services

### File name : finetune-ERP-backend-New/config/settings.py
Status: ACCURATE

Key Info:
- Loads environment via `dotenv` and expects `SECRET_KEY`, `DEBUG`, `DATABASE_URL`, and booking notification variables.【F:finetune-ERP-backend-New/config/settings.py†L1-L107】
- Configures DRF authentication, throttles, and pagination along with JWT lifetimes.【F:finetune-ERP-backend-New/config/settings.py†L74-L123】
- Includes security hardening: CORS allow-list, CSP directives, secure cookies, and HSTS toggled by `DEBUG`.【F:finetune-ERP-backend-New/config/settings.py†L24-L73】

Conflicts With: `env.example` which exposes `DJANGO_SECRET_KEY` instead of `SECRET_KEY`.

Missing Critical Info: HARDENED pipeline toggles (feature flags) and Mem0 v2 configuration variables.

Recommendation: KEEP – ensure documentation highlights the expected environment variable names.

### File name : finetune-ERP-backend-New/config/urls.py
Status: ACCURATE

Key Info:
- Registers Django admin and JWT refresh/verify endpoints.【F:finetune-ERP-backend-New/config/urls.py†L28-L39】
- Composes REST API routes from modular apps (accounts, store, spares, catalog, bookings, invoicing, marketing, attendance, activity, inventory).【F:finetune-ERP-backend-New/config/urls.py†L31-L38】
- Uses DRF routers within each app rather than a monolithic router file.

Conflicts With: Legacy FastAPI router documentation (now replaced by Django URL references).

Missing Critical Info: Attendance sub-routes under `/api/attendance/` are not captured in central API docs.

Recommendation: KEEP – supplement API documentation with attendance and marketing hook coverage.

### File name : finetune-ERP-backend-New/pre_deploy.py
Status: ACCURATE

Key Info:
- Runs `makemigrations`, `migrate`, `collectstatic`, and seeds a Django superuser from `DJANGO_SUPERUSER_*` variables.【F:finetune-ERP-backend-New/pre_deploy.py†L1-L25】
- Designed for Railway/CI bootstrapping before application start.
- Assumes Django settings module `config.settings` is available.

Conflicts With: None.

Missing Critical Info: Steps for caching migrations or hooking into HARDENED pipeline release gates.

Recommendation: KEEP – document invocation in deployment guide.

### File name : env.example
Status: CONFLICTING

Key Info:
- Declares `DJANGO_SECRET_KEY` whereas Django settings expect `SECRET_KEY`.【F:env.example†L1-L17】【F:finetune-ERP-backend-New/config/settings.py†L17-L22】
- Provides `APP_ENV`, `AGENT_MODEL`, and `AGENT_API_KEY` variables unused anywhere in the codebase.【F:env.example†L1-L17】
- Omits required settings like `DEBUG`, `SECRET_KEY`, `ALLOWED_HOSTS`, and booking notification channels.

Conflicts With: Backend configuration requirements in `config/settings.py` and booking notifications in `bookings/notifications.py`.

Missing Critical Info: HARDENED pipeline toggles, Redis/queue connection strings, Mem0 v2 credentials.

Recommendation: MAJOR UPDATE – align variables with actual settings.py and add missing secrets.

### File name : .github/workflows/test.yml
Status: CONFLICTING

Key Info:
- Installs frontend dependencies with `npm ci` even though the repository ships a `pnpm-lock.yaml` and AGENTS.md mandates `pnpm` usage.【F:.github/workflows/test.yml†L1-L24】
- Attempts to install backend dependencies from `requirements-dev.txt`, which is absent; backend uses Poetry-style extras via `pyproject.toml`.【F:.github/workflows/test.yml†L20-L24】【F:pyproject.toml†L1-L35】
- Runs `pytest` from the backend package root without specifying Django settings; relies on `pytest.ini` defaults.

Conflicts With: `AGENTS.md` setup guidance and actual dependency manifests.

Missing Critical Info: Steps for running hardened pipeline security scans or Mem0 regression suites.

Recommendation: MAJOR UPDATE – switch to `pnpm` + `pip install -e .[backend,dev,test]` or add the missing requirements file.

## API & Documentation

### File name : docs/API_GUIDE.md
Status: ACCURATE

Key Info:
- Enumerates CRUD endpoints for brands, stores, spares, units, qualities, taxonomy, products, variants, bookings, issues, responses, and logs.【F:docs/API_GUIDE.md†L1-L83】
- Describes booking payload structure and status transition rules matching serializer validation.【F:docs/API_GUIDE.md†L52-L74】【F:finetune-ERP-backend-New/bookings/serializers.py†L135-L146】
- Notes system-admin restrictions that align with DRF permission classes (e.g., `IsSystemAdminOrReadOnly`).【F:docs/API_GUIDE.md†L5-L49】【F:finetune-ERP-backend-New/catalog/views.py†L10-L76】

Conflicts With: Missing coverage for attendance endpoints `/api/attendance/...` present in code.

Missing Critical Info: Coordinator hooks (`/agents/<name>/hooks`), Hardened enhancement flows, Mem0 v2 endpoints, attendance/admin payroll APIs.

Recommendation: MAJOR UPDATE – append attendance, marketing contact, and agent hook sections plus pipeline details.

### File name : docs/BACKEND.md
Status: ACCURATE

Key Info:
- Documents invoice, line item, and payment models consistent with Django models (GST breakdown, sequence numbering).【F:docs/BACKEND.md†L1-L32】【F:finetune-ERP-backend-New/invoicing/models.py†L1-L69】
- Notes invoice numbering `FT-INV-0001` and disabled PDF generation, matching implementation and TODO comments.【F:docs/BACKEND.md†L12-L20】【F:finetune-ERP-backend-New/invoicing/models.py†L24-L45】【F:finetune-ERP-backend-New/invoicing/urls.py†L1-L10】
- Covers inventory APIs: stock ledgers, entries, serials, price logs, and configuration routes present in code.【F:docs/BACKEND.md†L22-L44】【F:finetune-ERP-backend-New/inventory/urls.py†L1-L17】

Conflicts With: Environment section referencing Railway but lacking hardened pipeline context.

Missing Critical Info: Attendance payroll models, activity log exports, Mem0 service integration points.

Recommendation: KEEP – expand with new modules when pipeline is updated.

### File name : docs/FRONTEND_GUIDE.md
Status: OUTDATED

Key Info:
- Focuses on shop filters and hero section but omits dashboard-heavy UI present in `App.jsx` routes.【F:docs/FRONTEND_GUIDE.md†L1-L13】【F:finetune-ERP-frontend-New/src/App.jsx†L1-L130】
- Links to frontend security notes but does not describe RTK Query usage or role-gated dashboards.
- Does not mention ecommerce partners, cart, or legal pages implemented in code.【F:finetune-ERP-frontend-New/src/App.jsx†L47-L108】

Conflicts With: Frontend architecture doc claiming no RTK Query cache.

Missing Critical Info: Dashboard route guards, attendance tooling UI, hardened pipeline UX for Mem0 v2 data reviews.

Recommendation: MAJOR UPDATE – rewrite to mirror current routing/state architecture.

### File name : docs/file-structure.md
Status: CONFLICTING

Key Info:
- Provides comprehensive table of backend and frontend files but flags several components as missing even though they exist (e.g., attendance dashboards).【F:docs/file-structure.md†L1-L181】【F:finetune-ERP-frontend-New/src/components/dashboard/layout/DashboardLayout.jsx†L1-L120】
- Claims frontend lacks inventory modules despite `src/components/inventory/` being populated.【F:docs/file-structure.md†L120-L174】【F:finetune-ERP-frontend-New/src/components/inventory/StockTable.jsx†L1-L160】
- Suggests absence of backend Dockerfile/requirements while pipeline relies on `pyproject.toml` extras and no Docker assets are tracked.【F:docs/file-structure.md†L146-L174】【F:pyproject.toml†L1-L35】

Conflicts With: Actual component tree and backend dependency strategy.

Missing Critical Info: Hardened enhancement pipeline stages, Mem0 integration points, attendance endpoints.

Recommendation: MAJOR UPDATE – refresh tables to match current tree and remove stale checklist assumptions.

### File name : docs/how-to/ADMIN_DASHBOARD.md
Status: ACCURATE

Key Info:
- Maps dashboard routes (`/dashboard/*`) to CRUD capabilities consistent with `App.jsx` routing and RTK Query endpoints.【F:docs/how-to/ADMIN_DASHBOARD.md†L1-L47】【F:finetune-ERP-frontend-New/src/App.jsx†L85-L117】
- Notes cancellation reason prompts aligning with booking serializer validations requiring `reason` on rejection/cancel flows.【F:docs/how-to/ADMIN_DASHBOARD.md†L24-L34】【F:finetune-ERP-backend-New/bookings/serializers.py†L135-L146】
- Highlights audit log exports that exist in `activity` viewsets.【F:docs/how-to/ADMIN_DASHBOARD.md†L35-L39】【F:finetune-ERP-backend-New/activity/views.py†L1-L80】

Conflicts With: None identified.

Missing Critical Info: Attendance admin screens, hardened pipeline QA checkpoints, Mem0 data review screens.

Recommendation: KEEP – add sections for new dashboards when available.

### File name : docs/TEST_GUIDE.md
Status: CONFLICTING

Key Info:
- Recommends `npm ci` and `npm test` for frontend, conflicting with PNPM workflow and lockfile in repo.【F:docs/TEST_GUIDE.md†L21-L39】【F:finetune-ERP-frontend-New/pnpm-lock.yaml†L1-L10】
- Backend instructions rely on `pip install -e .[backend,dev,test]` aligning with `pyproject.toml` extras.【F:docs/TEST_GUIDE.md†L5-L19】【F:pyproject.toml†L1-L35】
- References migrations for catalog/marketing; accurate but misses apps like attendance and inventory.

Conflicts With: `.github/workflows/test.yml`, `README.md` quick start (PNPM), and AGENTS.md.

Missing Critical Info: Hardened pipeline regression suite, Mem0 validation tests, attendance/inventory migrations.

Recommendation: MAJOR UPDATE – switch to PNPM instructions and cover all apps.

### File name : docs/project/CI_GUIDE.md
Status: CONFLICTING

Key Info:
- Documents ESLint/Prettier via `npm run` commands instead of PNPM equivalents.【F:docs/project/CI_GUIDE.md†L6-L18】
- States backend formatting uses `black .` but CI pipeline does not run Black yet; no workflow step present.【F:docs/project/CI_GUIDE.md†L6-L18】【F:.github/workflows/test.yml†L1-L24】
- Mentions Lighthouse autorun job, but `lighthouse.yml` should be verified for parity.

Conflicts With: Current GitHub Actions configuration (missing Black step, PNPM vs npm).

Missing Critical Info: Hardened pipeline security scans, Mem0 quality gates.

Recommendation: MAJOR UPDATE – align with actual CI workflows and add hardened checks.

### File name : README.md (root)
Status: PARTIALLY ACCURATE

Key Info:
- Quick start instructs `pip install -e .[backend,dev,test]` and `pnpm install --prefix finetune-ERP-frontend-New`, matching dependency layout.【F:README.md†L7-L24】
- Describes architecture at a high level, pointing to docs for deeper guidance.【F:README.md†L26-L32】
- Directs readers to `docs/project/WORKFLOW_GUIDE.md` for deployment runbooks instead of a missing script.【F:README.md†L34-L45】

Conflicts With: No mention of hardened pipeline or Mem0 v2 rollout.

Missing Critical Info: Actual agent deployment procedure, queue configuration, hardened enhancement release steps.

Recommendation: MAJOR UPDATE – expand deployment section with hardened pipeline overview.

### File name : CONTEXT.md
Status: OUTDATED

Key Info:
- Outlines agile/TDD workflow and stack choices (Django, React, Redis) consistent with architecture.【F:CONTEXT.md†L1-L24】
- References docs/how-to for patterns but lacks mention of new HARDENED enhancement pipeline or Mem0 integration.【F:CONTEXT.md†L26-L40】
- Mentions Redis queue monitoring though no Redis config is documented elsewhere.

Conflicts With: Current absence of Redis settings in env.example and settings.py.

Missing Critical Info: Hardened pipeline stages, Mem0 v2 roadmap, and any planned backend migration timeline.

Recommendation: MAJOR UPDATE – incorporate new operational model and dependencies.

### File name : docs/ARCHITECTURE.md
Status: OUTDATED

Key Info:
- Presents simplified mermaid diagram (Frontend ↔ Django API ↔ Redis ↔ Agents).【F:docs/ARCHITECTURE.md†L1-L13】
- Does not describe actual app modules, attendance subsystem, or Mem0 pipeline.
- Lacks mention of hardened enhancement stages or AsyncMemoryService.

Conflicts With: Expectations around future backend rewrites and Mem0 described externally.

Missing Critical Info: Current Django app breakdown, coordinator endpoints, Mem0 data flow.

Recommendation: MAJOR UPDATE – redraw architecture for HARDENED + Mem0 v2.

### File name : docs/known-issues/KNOWN_ISSUES.md
Status: OUTDATED

Key Info:
- States "Currently no known issues" despite CI misconfiguration and stale docs identified above.【F:docs/known-issues/KNOWN_ISSUES.md†L1-L6】
- Provides link back to Test Guide only.

Conflicts With: Actual issues (env mismatch, missing requirements file, outdated docs).

Missing Critical Info: Tracking of PNPM vs npm mismatch, missing Mem0 docs, hardened pipeline TODOs.

Recommendation: MAJOR UPDATE – log discovered documentation and pipeline gaps.

## Frontend Architecture References

### File name : finetune-ERP-frontend-New/docs/ARCHITECTURE.md
Status: CONFLICTING

Key Info:
- Claims state management uses Redux slices and async thunks without RTK Query cache.【F:finetune-ERP-frontend-New/docs/ARCHITECTURE.md†L1-L24】
- Actual code relies heavily on `createApi` RTK Query hooks (`useGetProductsQuery`, etc.).【F:finetune-ERP-frontend-New/src/api/erpApi.js†L1-L120】【F:finetune-ERP-frontend-New/src/pages/ecommerce/Shop.jsx†L1-L75】
- Documents route `/terms-and-conditions/` which is not present; legal content lives at `/legal`.【F:finetune-ERP-frontend-New/docs/ARCHITECTURE.md†L8-L15】【F:finetune-ERP-frontend-New/src/App.jsx†L59-L105】

Conflicts With: Actual router and API integration strategy.

Missing Critical Info: Dashboard route guards, ecommerce cart flows, hardened Mem0 review UI.

Recommendation: MAJOR UPDATE – rewrite to reflect RTK Query + updated routing.
