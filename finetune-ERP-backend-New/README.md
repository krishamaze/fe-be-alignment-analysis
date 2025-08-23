# Finetune ERP Backend

Backend service for user, store and attendance management built with Django and Django REST Framework.

![Django](https://img.shields.io/badge/Django-5.2-green)
![DRF](https://img.shields.io/badge/DRF-3.16-red)
![JWT](https://img.shields.io/badge/JWT-simplejwt-blue)
![Postgres](https://img.shields.io/badge/PostgreSQL-16-blue)

## Quick start
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pip install -r requirements-test.txt  # optional for tests
python manage.py migrate
python manage.py createsuperuser  # set admin credentials
python manage.py runserver
```

### Common tasks
- `python manage.py test` or `pytest` – run tests
- `python manage.py attendance_autoclose` – finalize previous day
- `python manage.py sanitize_branch_heads [--dry-run|--apply]` – reconcile branch head assignments and clear extra branch heads

### Marketing API
| Method | Path | Description |
|-------|------|-------------|
| GET | `/api/marketing/brands/` | List brands |
| POST | `/api/marketing/contact/` | Create contact message |
| POST | `/api/marketing/schedule-call/` | Schedule a call |

Both endpoints require `RECAPTCHA_SECRET_KEY` and are throttled to 5 requests/hour per IP.

## Troubleshooting
| Issue | Fix |
|------|-----|
| Missing DB or migrations | Ensure `DATABASE_URL` is set or remove to use SQLite. Run `python manage.py makemigrations && python manage.py migrate` |
| CORS/CSRF blocked | Confirm origin is listed in `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` |
| Cannot login | `SECRET_KEY` mismatch or tokens expired; refresh via `/api/token/refresh` |

See [docs/](docs) for architecture, API and deployment notes.
