# Runbook

## Health checks
- `GET /api/token/verify` with a dummy token returns 200 when the stack is up.
- Django admin `/admin/` requires authentication.

## Logs & metrics
- Django logs to stdout; capture via platform logging.
- Database metrics available via Postgres (`pg_stat_activity`).

## Common incidents
| Symptom | Mitigation |
|---|---|
| **Database locked / migration mismatch** | Run `python manage.py migrate` or rollback to previous migration. |
| **Bad CORS/CSRF** | Ensure origin appears in `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`. |
| **502 on deploy** | Check environment vars and database connectivity; `pre_deploy.py` must run migrations. |

## Backup & restore
Use your Postgres provider's snapshot/backup tooling. To restore locally:
```bash
pg_dump $DATABASE_URL > backup.sql
psql $DATABASE_URL < backup.sql
```

