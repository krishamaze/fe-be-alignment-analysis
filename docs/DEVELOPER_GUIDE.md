# Developer Guide

This how-to guide collects the day-to-day workflows for working inside the Finetune ERP monorepo. Use it alongside the generated references under `docs/reference/`.

## Monorepo layout

| Area | Path | Responsibilities |
| :--- | :--- | :-------------- |
| Django API | `finetune-ERP-backend-New/` | Coordinator REST API, agent hooks, invoicing, inventory, and attendance flows. |
| React frontend | `finetune-ERP-frontend-New/` | Public marketing site, ecommerce flows, and internal dashboards powered by React Router 7. |
| Shared docs | `docs/` | Diátaxis documents plus generated references for routes and environment variables. |

> [!NOTE]
> The backend exposes agent orchestration primitives described in [ARCHITECTURE.md](ARCHITECTURE.md). Do not duplicate scheduling or queue logic in feature code—extend the existing utilities in `finetune-ERP-backend-New/utils/` instead.

## Backend workflow

1. **Install & sync** – Use the editable install and run migrations whenever models change.
   ```bash
   pip install -e .[backend,dev,test]
   python manage.py makemigrations
   python manage.py migrate
   ```
2. **Authentication** – JWT endpoints live under `/api/auth/*`. Token refresh and verification routes are listed in [API_ROUTES.md](reference/API_ROUTES.md).
3. **Viewsets first** – New CRUD surfaces should extend existing DRF `ViewSet` patterns so routers keep routes discoverable. Register the viewset and rerun `python scripts/generate_references.py` to refresh documentation.
4. **Background coordination** – Use the `AgentProtocol` helpers for long-running work instead of ad-hoc threads or Celery substitutes.
5. **Testing** – Targeted modules live under `finetune-ERP-backend-New/tests/`. Pytest is configured via `pytest.ini`.
   ```bash
   pytest finetune-ERP-backend-New/tests -q
   ```

## Frontend workflow

1. **Dependencies & dev server** – Install with pnpm and launch Vite.
   ```bash
   pnpm install --dir finetune-ERP-frontend-New
   pnpm --dir finetune-ERP-frontend-New dev -- --host
   ```
2. **Routing** – Routes are centrally defined in `src/App.jsx`. Public marketing pages render through `PublicLayout`, dashboard pages through `DashboardLayout`, and focus tools through `FocusLayout`. Use [FRONTEND_ROUTES.md](reference/FRONTEND_ROUTES.md) to confirm guard behaviour before editing.
3. **State management** – Extend the RTK Query slice in `src/api/erpApi.js` for all network interactions. The slice already provides re-authenticating hooks such as `useGetBrandsQuery` and `useCreateBookingMutation`.
4. **Styling** – Respect layout ownership (`PublicLayout`, `FocusLayout`, `DashboardLayout`) and reuse the theme tokens declared in `src/index.css`. Avoid creating new CSS variables unless they chain off an existing `--color-*` token with fallbacks.
5. **Forms & integrations** – Marketing forms post to the `/api/marketing/*` routes; reCAPTCHA keys surface via `VITE_RECAPTCHA_SITE_KEY`. Keep environment keys in sync with [ENVIRONMENT_KEYS.md](reference/ENVIRONMENT_KEYS.md).
6. **Testing & linting** –
   ```bash
   pnpm --dir finetune-ERP-frontend-New lint
   pnpm --dir finetune-ERP-frontend-New test
   ```

## Quality gates & CI

GitHub Actions enforces linting, tests, Lighthouse smoke checks, and documentation drift.

- Backend: `pytest finetune-ERP-backend-New/tests -q`
- Frontend: `pnpm --dir finetune-ERP-frontend-New lint` and `pnpm --dir finetune-ERP-frontend-New test`
- Docs: `python scripts/generate_references.py` must produce no diff in CI. The workflow will fail if generated references diverge from committed output.
- Links & Markdown: The docs workflow runs a link checker plus Markdown lint using GitHub Actions.

> [!NOTE]
> Whenever you touch routes, settings, or React navigation, rerun `python scripts/generate_references.py` and commit the updated reference files so CI stays green.

## Operational checklist

- [ ] Update generated references after URL or environment key changes.
- [ ] Keep `.env` aligned with the environment keys table.
- [ ] Prefer feature toggles or existing config models over hard-coded fallbacks.
- [ ] Document behavioural changes in commit messages and, when relevant, in `ARCHITECTURE.md`.
