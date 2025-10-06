# Finetune ERP Backend – Operations Guide

## Project Overview
Finetune ERP Backend is a Django and Django REST Framework service for managing users, stores, attendance, inventory, and invoicing workflows for repair shops.

## Architecture Summary
- **accounts** – custom user model, authentication, role-based permissions.
- **store** – stores information about branches, geofences, and branch heads (links to `accounts.User`).
- **attendance** – tracks check-ins/outs, shifts, and payroll info. It relies on `store` for geofence validation and the user roles defined in `accounts`.

## Database Operations
1. Ensure `DATABASE_URL` points to PostgreSQL (e.g., `postgres://user:pass@host/db`).
2. Verify connectivity:
   ```bash
   psql "$DATABASE_URL"    # or: python manage.py dbshell
   ```
3. Run management commands:
   ```bash
   python manage.py showmigrations
   python manage.py migrate
   ```

## Common Tasks
- **Migrations**
  ```bash
  python manage.py makemigrations
  python manage.py migrate
  ```
- **Testing**
  To run the backend tests, execute the following command from the monorepo root:
  ```bash
  python -m pytest finetune-ERP-backend-New/tests -q
  ```
  The test suite is configured using `pytest.ini` at the monorepo root, which sets the `DJANGO_SETTINGS_MODULE`.

  **Important Test Configuration:**
  The test environment automatically disables `SECURE_SSL_REDIRECT` via a fixture in `finetune-ERP-backend-New/tests/conftest.py`. This is to prevent `301` redirect errors during testing. If you encounter unexpected redirects in tests, this fixture is the first place to check.

- **Data Sanitization**
  ```bash
  python manage.py sanitize_branch_heads --dry-run  # use --apply to commit
  ```

## Troubleshooting
| Issue | Solution |
|------|----------|
| Cannot connect to DB | Confirm PostgreSQL is running and `DATABASE_URL` is correct. |
| Missing migrations | Run `python manage.py makemigrations && python manage.py migrate`. |
| CORS/CSRF blocked | Add the client origin to `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`. |
| Login fails | Ensure `SECRET_KEY` matches and refresh tokens at `/api/token/refresh`. |
| Tests failing with 301 redirects | Check the `_set_timezone` fixture in `tests/conftest.py` to ensure `SECURE_SSL_REDIRECT` is set to `False`. |