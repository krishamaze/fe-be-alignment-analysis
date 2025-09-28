# How-to: Sync Reference Pages

Follow this runbook whenever backend routes, frontend navigation, or environment
variables change. Keeping the reference pages current prevents drift between
code and documentation.

## 1. Backend API Routes

1. Update Django URL confs (`config/urls.py` and each app's `urls.py`).
2. Run `python finetune-ERP-backend-New/manage.py show_urls` (if available) or
   review router registrations manually.
3. Edit `docs/reference/BACKEND_API_ROUTES.md` to reflect any new paths,
   methods, or permission changes.
4. Mention notable workflow updates (e.g., new booking status) in
   `docs/API_GUIDE.md`.

## 2. Frontend Route Tree

1. Adjust routes in `src/App.jsx` or related layout components.
2. Update `docs/reference/FRONTEND_ROUTES.md` with the new paths and guards.
3. If layouts or guard patterns shift, note the change in `docs/FRONTEND_GUIDE.md`.

## 3. Environment Keys

1. When adding/removing `os.environ` lookups or Vite `import.meta.env` usage,
   update `env.example`.
2. Mirror the change in `docs/reference/ENVIRONMENT_KEYS.md`, calling out
   defaults and deployment requirements.
3. If deploy-time automation requires new secrets (e.g., `pre_deploy.py`), note
   them in this reference and in CI/CD documentation.

## 4. Verification Checklist

- ✅ Tests or manual smoke checks cover the new route or feature.
- ✅ Reference docs mention the change.
- ✅ Related how-to guides include any new operational steps.
