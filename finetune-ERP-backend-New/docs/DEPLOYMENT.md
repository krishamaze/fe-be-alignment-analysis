# Deployment

The project ships with a `Procfile` for platforms like Railway/Heroku:
```
web: python pre_deploy.py && gunicorn config.wsgi
```

`pre_deploy.py` runs migrations, collectstatic and ensures a superuser exists.

## Checklist
1. Set environment variables (`SECRET_KEY`, `DATABASE_URL`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`).
2. Run migrations: `python manage.py migrate`.
3. Collect static files: `python manage.py collectstatic`.
4. Start Gunicorn: `gunicorn config.wsgi`.

To roll back a migration:
```bash
python manage.py migrate <app_name> <previous_migration>
```

## Environments
| Env | URL |
|---|---|
| Production | https://api.finetune.store |
| Dev | https://finetunetechcrafterp-dev.up.railway.app |
