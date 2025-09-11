# CONTEXT.md — Finetune ERP Monorepo (Slim Edition)

## 1) Overview

* **Monorepo:** Django REST API (`/finetune-ERP-backend-New`) + React 19 / Vite (`/finetune-ERP-frontend-New`)
* **Deploy:** Railway (API) • Vercel (Web)
* **Auth:** JWT (djangorestframework-simplejwt)
* **CORS:** Enabled for FE↔BE communication

## 2) Runtime & Data

* **Python:** 3.12.x • **Django:** 5.2.x
* **Node:** 20.x (npm 11.x)
* **DB:** Dev → SQLite • Prod → PostgreSQL (psycopg2-binary)

## 3) Required Environment (runtime only)

> Keep secrets out of repo; set in Railway/Vercel dashboards.

* **Backend**

  * `DJANGO_SETTINGS_MODULE=config.settings`
  * `SECRET_KEY` **(secret)**
  * `DEBUG` (= False in prod)
  * `DATABASE_URL` (postgres in prod; sqlite in dev)
  * `RECAPTCHA_SECRET_KEY` **(secret, optional if used)**
  * `BOOKING_NOTIFICATION_CHANNELS` (e.g., `email,sms`)
  * `SMS_GATEWAY_URL` (if SMS enabled)
  * `SMS_GATEWAY_TOKEN` **(secret, if SMS enabled)**
  * `DEFAULT_FROM_EMAIL`
* **Frontend**

  * `VITE_RECAPTCHA_SITE_KEY` **(if used)**

*(Removed setup-only vars like superuser creation and CI tokens from here—keep those in a separate “Provisioning.md”.)*

## 4) Key Dependencies

* **Backend:** Django, DRF, SimpleJWT, CORS Headers, WeasyPrint, Gunicorn, Whitenoise, (optional) Twilio
* **Frontend:** React 19 + Vite (managed via `package-lock.json`)

## 5) External Integrations

* **reCAPTCHA** (FE widget → BE verify)
* **Email** (Django email backends)
* **SMS** (Twilio-compatible if enabled)
* **PDF** (WeasyPrint)
* **Static** (Whitenoise)

## 6) Current Status & Risks

**Critical**

* **Frontend security audit:** 11 npm vulns (incl. critical) → fix/replace; remove deprecated packages (`rimraf@3`, `inflight@1.0.6`, `glob@7`).
* **Backend build config:** root `pyproject.toml` invalid (missing `[build-system]`, `name`) → fix to unblock tooling.

**Config Cleanup**

* Vite/npm warning: unknown env key `http-proxy` → remove/rename if unused.
* Running pip as root in container is expected; no action.

**Working**

* Django API installs & runs
* FE deps install; build path OK
* Postgres ready; JWT & CORS configured

**Detective Mode Protocol Status:**
- ✅ Evidence Collection: Setup logs analyzed
- ✅ Context Documentation: This file created  
- 🔄 Security Remediation: npm audit + pyproject.toml fixes in progress
- 📋 Validation Automation: Pending CI integration
- 📋 Research Pipeline: Pending documentation integration

## 7) Validation Commands (copy/paste)

**Backend**

```bash
cd finetune-ERP-backend-New
python manage.py check --deploy
python manage.py migrate --plan
pytest -q
```

**Frontend**

```bash
cd finetune-ERP-frontend-New
npm audit --audit-level=high
npm run build
npm run test:unit
npm run lint
```

**Security**

```bash
# FE
npm audit fix --force   # only if safe; review PR
# BE
pip install pip-audit && pip-audit
```

## 8) Cross-Stack Contracts

* **Auth:** FE login → JWT → attach `Authorization: Bearer <token>` to API calls.
* **Forms:** FE reCAPTCHA token → BE verification endpoint.
* **Files:** API generates PDFs → FE provides download links.
* **Notifications:** API triggers Email/SMS per configured channels.

## 9) Dev Workflow

* Independent FE/BE builds with shared CI
* Env-based config: SQLite(dev) / Postgres(prod)
* Tests: **pytest** (BE) • **Vitest** (FE) • optional Lighthouse

## 10) Next Priorities (do in order)

1. **Fix npm vulns** (pin/upgrade; remove deprecated transitive deps; consider `npm dedupe`).
2. **Repair `pyproject.toml`** (add `[build-system]`, minimal metadata).
3. **Prune env noise** (delete unknown `http-proxy` var; move setup-only vars to Provisioning.md).
4. **Lock DEBUG off in prod** (assert in settings).
5. **Add minimal “Platform Health” CI** (audit + tests on PRs).

**Research Resources (for AI context):**
- Django 5.2 docs: https://docs.djangoproject.com/en/5.2/
- React 19 docs: https://react.dev/
- Vite docs: https://vite.dev/
- npm audit docs: https://docs.npmjs.com/cli/v10/commands/npm-audit

## 11) Pattern Recognition & Learnings
**Recently Solved Issues:**
*[Auto-updated after each task completion]*

**Common Error Patterns:**
- npm security vulnerabilities → `npm audit fix` workflow
- Django migration issues → `migrate --plan` first
- CORS errors → check ALLOWED_HOSTS + CORS_ALLOWED_ORIGINS

**Performance Patterns:**
*[Will be populated as patterns emerge]*

## 12) Change History
**Last Updated:** 2025-09-11 10:07 AM IST
**Updated By:** Detective Mode Protocol - Security audit task
**Key Changes:** Initial creation, identified critical npm vulnerabilities
**Next Update Trigger:** After security fix completion
