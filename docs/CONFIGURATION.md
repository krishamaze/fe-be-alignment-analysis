# Configuration

Settings live in `config/settings.py` and pull from environment variables.

| Env var | Purpose | Default |
|---|---|---|
| `SECRET_KEY` | Django secret | `fallback-in-dev` |
| `DEBUG` | Enable debug mode | `False` |
| `DATABASE_URL` | Database DSN | SQLite file |
| `ALLOWED_HOSTS` | Comma list of hosts | `api.finetune.store,localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Allowed cross‑origin domains | see settings |

## Static & media
- Static files served via WhiteNoise from `staticfiles/` after running `collectstatic`.
- No media storage helper is configured; file fields store to local filesystem.

## CORS & CSRF
- `CORS_ALLOW_ALL_ORIGINS` enabled but explicit `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` are set.
- Cookies are sent with `SameSite=None` and `Secure` for cross‑origin access.
- Vercel deployments (`https://fe-be-alignment-analysis.vercel.app` and `https://*.vercel.app` for previews) are trusted CSRF origins.

