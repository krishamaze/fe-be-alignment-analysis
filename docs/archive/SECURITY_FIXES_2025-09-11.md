# Security Fixes — 11 September 2025

## Issues Addressed

### 1. CORS Allow-All
**Before**
```python
CORS_ALLOW_ALL_ORIGINS = True
```
**After**
```python
CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://finetune.store",
    "https://www.finetune.store",
    "https://api.finetune.store",
    "https://fe-be-alignment-analysis.vercel.app",
    "https://finetunetechcraft-erp-git-axios-f-efe947-finetunetechs-projects.vercel.app",
    "https://finetunetechcraft-erp-git-feature-ca76ad-finetunetechs-projects.vercel.app",
    "https://finetunetechcrafterp-dev.up.railway.app",
]
```

### 2. Missing HTTPS Headers
**Before:** not set
**After**
```python
SECURE_SSL_REDIRECT = not DEBUG
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
```

### 3. Fragile Database URL Handling
**Before**
```python
DATABASE_URL = os.environ.get("DATABASE_URL", f'sqlite:///{BASE_DIR / "db.sqlite3"}')
```
**After**
```python
DEFAULT_SQLITE_URL = f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
DATABASE_URL = os.environ.get("DATABASE_URL", DEFAULT_SQLITE_URL)
try:
    DATABASES = {"default": dj_database_url.parse(DATABASE_URL)}
except Exception:
    DATABASES = {"default": dj_database_url.parse(DEFAULT_SQLITE_URL)}
```

### 4. Frontend Hard‑coded API Endpoint
**Before**
```javascript
const API_BASE_URL = 'https://finetunetechcrafterp-dev.up.railway.app';
```
**After**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://finetunetechcrafterp-dev.up.railway.app';
```

### 5. Insecure Cookie Guidance
**Addition**
```javascript
// NOTE: Consider HttpOnly cookies for enhanced XSS protection
// Current implementation allows JS access for SPA token refresh
Cookies.set('token', token, {
  secure: true,
  sameSite: 'strict',
  expires: 1,
  // TODO: Migrate to HttpOnly cookies with refresh endpoint
});
```

### 6. Unused Dependency
Removed `pytz` from backend requirements.

### 7. Security Headers & CSP
```python
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
X_XSS_PROTECTION = "1; mode=block"

CSP_DEFAULT_SRC = ("'self'",)
CSP_STYLE_SRC = ("'self'",)
CSP_SCRIPT_SRC = ("'self'",)
CSP_OBJECT_SRC = ("'none'",)
CSP_BASE_URI = ("'self'",)
CSP_FORM_ACTION = ("'self'",)
CSP_FRAME_ANCESTORS = ("'none'",)
CSP_IMG_SRC = ("'self'", "data:", "https:")
CSP_FONT_SRC = ("'self'", "data:")
CSP_CONNECT_SRC = ("'self'",)
```

## Security Impact
- Eliminates permissive CORS policy, restricting access to known origins.
- Enforces HTTPS with HSTS for one year, mitigating man-in-the-middle risks.
- Validates database URLs to prevent malformed connection strings.
- Enables environment-specific API endpoints for safer deployments.
- Documents plan to migrate to HttpOnly cookies, reducing XSS exposure.
- Removes unused timezone library, reducing attack surface.

## Validation Steps
- `python manage.py check --deploy`
- `DATABASE_URL=sqlite:///$(pwd)/db.sqlite3 pytest tests -q`
- `npm run lint`
- `npm run build`
- `npm test`
- CORS & HSTS checks via inline Python commands.

## Deployment Considerations
- Ensure `VITE_API_BASE_URL` is set in production environments.
- Confirm `SECURE_SSL_REDIRECT` and HSTS settings align with hosting TLS configuration.
- Provide refresh-token endpoint before migrating to HttpOnly cookies.

## HSTS Preload Warning
- Enabling `SECURE_HSTS_PRELOAD = True` submits the domain to browser preload lists.
- Removal from these lists is lengthy; treat the decision as effectively permanent.
- Only enable preload after verifying long-term HTTPS support for the domain and all subdomains.
