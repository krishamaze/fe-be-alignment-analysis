# Deployment Guide

This guide covers deployment procedures for both the Django backend and React frontend of the Finetune ERP platform.

## Backend Deployment

### Procfile & Pre-deployment

The project ships with a `Procfile` for platforms like Railway/Heroku:
```
web: python pre_deploy.py && gunicorn config.wsgi
```

`pre_deploy.py` runs migrations, collectstatic and ensures a superuser exists.

### Deployment Checklist

1. Set environment variables (`SECRET_KEY`, `DATABASE_URL`, `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`).
2. Run migrations: `python manage.py migrate`.
3. Collect static files: `python manage.py collectstatic`.
4. Start Gunicorn: `gunicorn config.wsgi`.

### Migration Rollback

To roll back a migration:
```bash
python manage.py migrate <app_name> <previous_migration>
```

### Backend Environments

| Env | URL |
|---|---|
| Production | https://api.finetune.store |
| Dev | https://finetunetechcrafterp-dev.up.railway.app |

## Frontend Deployment

### Build Process

```bash
npm run build
```

Generates a `dist/` directory containing static assets ready for deployment.

### Hosting Configuration

Optimised for static hosts such as [Vercel](https://vercel.com); see `vercel.json` for SPA rewrites.

### Environment Matrix

| Environment | App URL                | API URL                   |
| ----------- | ---------------------- | ------------------------- |
| Local dev   | http://localhost:5173  | https://api.finetune.store |
| Production  | https://finetune.store | https://api.finetune.store |

### Environment Variables

| Variable                  | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA site key for public forms |

See [Environment Keys Reference](reference/ENVIRONMENT_KEYS.md) for complete variable documentation.

### Caching Strategy

Serve `dist` assets with long-term cache headers. HTML should be cached for a short time and serve `index.html` on unknown routes.

### Deployment Workflow

1. Push to a preview branch to trigger Vercel preview.
2. Merge to `main` for production deployment.

### Roadmap

Planned for v1.1:

- Invoice PDF generation
- Lighthouse performance checks
- Updated UI screenshots
- Expanded deployment matrix

## Related Documentation

- [Environment Keys Reference](reference/ENVIRONMENT_KEYS.md) – Configuration variables
- [Architecture Guide](ARCHITECTURE.md) – System architecture overview
- [Developer Guide](DEVELOPER_GUIDE.md) – Development workflows

