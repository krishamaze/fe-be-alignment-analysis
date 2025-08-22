# Finetune ERP Backend – Agent Guide

## Project Overview
Finetune ERP Backend is a Django and Django REST Framework service for managing users, stores, and attendance.

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
  ```bash
  pytest            # or: python manage.py test
  ```
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
