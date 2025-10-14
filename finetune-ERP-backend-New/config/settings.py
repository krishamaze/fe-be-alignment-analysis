from pathlib import Path
import os
from datetime import timedelta
import dj_database_url

# Load environment variables from .env file if available
BASE_DIR = Path(__file__).resolve().parent.parent
try:
    from dotenv import load_dotenv

    load_dotenv(BASE_DIR / ".env")
except ImportError:
    # python-dotenv not available, skip loading .env file
    pass


# ✅ Environment Settings
SECRET_KEY = os.environ.get("SECRET_KEY", "fallback-in-dev")  # Safe default in local
DEBUG = os.environ.get("DEBUG", "False") == "True"  # Controlled via env
RECAPTCHA_SECRET_KEY = os.environ.get("RECAPTCHA_SECRET_KEY", "")
BOOKING_NOTIFICATION_CHANNELS = os.environ.get(
    "BOOKING_NOTIFICATION_CHANNELS", "email,sms"
).split(",")
SMS_GATEWAY_URL = os.environ.get("SMS_GATEWAY_URL", "")
SMS_GATEWAY_TOKEN = os.environ.get("SMS_GATEWAY_TOKEN", "")
DEFAULT_FROM_EMAIL = os.environ.get("DEFAULT_FROM_EMAIL", "noreply@example.com")
_DEFAULT_ALLOWED_HOSTS = [
    "api.finetune.store",
    "localhost",
    "127.0.0.1",
    "finetunetechcrafterp-dev.up.railway.app",
]

_allowed_hosts_env = os.environ.get("ALLOWED_HOSTS")
if _allowed_hosts_env:
    ALLOWED_HOSTS = [host.strip() for host in _allowed_hosts_env.split(",") if host.strip()]
else:
    ALLOWED_HOSTS = _DEFAULT_ALLOWED_HOSTS

# Add Replit domain to ALLOWED_HOSTS
_replit_domains_hosts = os.environ.get("REPLIT_DOMAINS", "")
if _replit_domains_hosts:
    for domain in _replit_domains_hosts.split(","):
        domain = domain.strip()
        if domain and domain not in ALLOWED_HOSTS:
            ALLOWED_HOSTS.append(domain)

# ✅ CORS
CORS_ALLOW_ALL_ORIGINS = False  # Change from True
CORS_ALLOWED_ORIGINS = [
    "https://finetune.store",
    "https://www.finetune.store",
    "https://api.finetune.store",
    "https://fe-be-alignment-analysis.vercel.app",
    "https://finetunetechcraft-erp-git-axios-f-efe947-finetunetechs-projects.vercel.app",
    "https://finetunetechcraft-erp-git-feature-ca76ad-finetunetechs-projects.vercel.app",
    "https://finetunetechcrafterp-dev.up.railway.app",
]

# Allow Replit dev domains dynamically (both HTTP and HTTPS)
CORS_ALLOWED_ORIGIN_REGEXES = [
    r"^https://.*\.replit\.dev$",
    r"^http://.*\.replit\.dev$",
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    "https://finetune.store",
    "https://www.finetune.store",
    "https://api.finetune.store",
    "https://finetunetechcraft-erp-git-axios-f-efe947-finetunetechs-projects.vercel.app",
    "https://finetunetechcraft-erp-git-feature-ca76ad-finetunetechs-projects.vercel.app",
    "https://finetunetechcrafterp-dev.up.railway.app",
    "https://fe-be-alignment-analysis.vercel.app",
    "https://*.vercel.app",
]

# Add Replit dev domains via env or regex pattern  
_replit_domains = os.environ.get("REPLIT_DOMAINS", "")
if _replit_domains:
    for domain in _replit_domains.split(","):
        domain = domain.strip()
        if domain:
            # Add both HTTP and HTTPS variants
            if f"https://{domain}" not in CSRF_TRUSTED_ORIGINS:
                CSRF_TRUSTED_ORIGINS.append(f"https://{domain}")
            if f"http://{domain}" not in CSRF_TRUSTED_ORIGINS:
                CSRF_TRUSTED_ORIGINS.append(f"http://{domain}")

SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SESSION_COOKIE_HTTPONLY = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = (
    "None" if not DEBUG else "Lax"  # Required for cross-origin cookie access (vercel → railway)
)
SESSION_COOKIE_SAMESITE = "None" if not DEBUG else "Lax"
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
USE_X_FORWARDED_HOST = True
USE_X_FORWARDED_PORT = True
APPEND_SLASH = False

# HTTPS Security Headers
SECURE_SSL_REDIRECT = not DEBUG
SECURE_HSTS_SECONDS = 31536000 if not DEBUG else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Additional security headers
X_FRAME_OPTIONS = "DENY"
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = "same-origin"
SECURE_CROSS_ORIGIN_OPENER_POLICY = "same-origin"
X_XSS_PROTECTION = "1; mode=block"

# Content Security Policy
CSP_DIRECTIVES = {
    "default-src": ("'self'",),
    "style-src": ("'self'",),
    "script-src": ("'self'",),
    "object-src": ("'none'",),
    "base-uri": ("'self'",),
    "form-action": ("'self'",),
    "frame-ancestors": ("'none'",),
    "img-src": ("'self'", "data:", "https:"),
    "font-src": ("'self'", "data:"),
    "connect-src": ("'self'",),
}
CONTENT_SECURITY_POLICY = {"DIRECTIVES": CSP_DIRECTIVES}
csp_report = os.environ.get("CSP_REPORT_URI")
if csp_report:
    CONTENT_SECURITY_POLICY["REPORT_URI"] = csp_report


# ✅ Custom User
AUTH_USER_MODEL = "accounts.CustomUser"

# ✅ Django REST + JWT
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PAGINATION_CLASS": "utils.pagination.SpringStylePagination",
    "PAGE_SIZE": 10,
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.ScopedRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "contact": "5/hour",
        "schedule_call": "5/hour",
        "booking": "5/hour",
        "login": "5/min",
    },
    "URL_FORMAT_OVERRIDE": "alt",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=60),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "AUTH_HEADER_TYPES": ("Bearer",),
    "AUTH_TOKEN_CLASSES": ("rest_framework_simplejwt.tokens.AccessToken",),
}

# ✅ Installed Apps
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "csp",
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt.token_blacklist",
    "accounts",
    "store",
    "attendance",
    "marketing",
    "spares",
    "bookings",
    "catalog",
    "invoicing",
    "activity",
    "inventory",
    ##'django_extensions',
]

# ✅ Middleware
MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "csp.middleware.CSPMiddleware",
    "utils.middleware.SecurityHeadersMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
]

# ✅ URLs and Templates
ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ✅ Database Configuration Fix
DEFAULT_SQLITE_URL = f"sqlite:///{BASE_DIR / 'db.sqlite3'}"
DATABASE_URL = os.environ.get("DATABASE_URL", DEFAULT_SQLITE_URL)
try:
    DATABASES = {"default": dj_database_url.parse(DATABASE_URL)}
except Exception:
    DATABASE_URL = DEFAULT_SQLITE_URL
    DATABASES = {"default": dj_database_url.parse(DATABASE_URL)}

# ✅ Password Validators
AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ✅ Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# ✅ Static files for production
STATIC_URL = "/static/"
STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")  # collectstatic will use this
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# ✅ Default auto field
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
