# Environment Key Reference

_Last synced: 2024-11-12_

Use this reference to configure `.env` files for local development, CI, and
Railway/Vercel deploys. Values come from `env.example`, `config/settings.py`, and
`pre_deploy.py`.

## Backend (`finetune-ERP-backend-New`)

| Variable | Required | Purpose | Defaults/Notes |
| --- | --- | --- | --- |
| `SECRET_KEY` | ✅ | Django cryptographic secret. | Falls back to `"fallback-in-dev"` if unset (local only). |
| `DEBUG` | ⚠️ | Enables debug mode when `True`. | Defaults to `False`. Keep `False` in production. |
| `ALLOWED_HOSTS` | ⚠️ | Comma-separated hostnames/domains served by Django. | Defaults to production hosts plus localhost when unset. |
| `DATABASE_URL` | ✅ | Database connection string parsed by `dj_database_url`. | Defaults to SQLite database at `db.sqlite3`. |
| `RECAPTCHA_SECRET_KEY` | ⚠️ | Server-side token verification for public booking forms. | Empty string disables verification. |
| `BOOKING_NOTIFICATION_CHANNELS` | ⚠️ | Comma-separated channels for booking notifications. | Defaults to `email,sms`. |
| `SMS_GATEWAY_URL` | ⚠️ | Endpoint for outbound SMS booking alerts. | Optional; leave blank to disable SMS. |
| `SMS_GATEWAY_TOKEN` | ⚠️ | Auth token for SMS gateway. | Optional; leave blank with SMS disabled. |
| `DEFAULT_FROM_EMAIL` | ⚠️ | Email sender for notifications. | Defaults to `noreply@example.com`. |
| `CSP_REPORT_URI` | ⚠️ | Optional CSP violation reporting endpoint. | Adds `report-uri` to CSP when set. |
| `DJANGO_SUPERUSER_USERNAME` | ✅ (deploy) | Username seeded by `pre_deploy.py`. | Required for first deploy to create admin. |
| `DJANGO_SUPERUSER_EMAIL` | ✅ (deploy) | Email for seeded superuser. | Only used when seeding. |
| `DJANGO_SUPERUSER_PASSWORD` | ✅ (deploy) | Password for seeded superuser. | Only used when seeding. |

## Frontend (`finetune-ERP-frontend-New`)

| Variable | Required | Purpose | Defaults/Notes |
| --- | --- | --- | --- |
| `VITE_API_BASE_URL` | ✅ | Base URL for RTK Query requests. | Defaults to Railway dev backend when unset. |
| `VITE_RECAPTCHA_SITE_KEY` | ⚠️ | Site key passed to Google reCAPTCHA widget. | Required to render `ReCaptchaWrapper`; component logs error when missing. |

Vite also exposes `import.meta.env.DEV` automatically; no manual configuration is
necessary.
