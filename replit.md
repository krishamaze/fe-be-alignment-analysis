# Finetune ERP - Replit Setup

## Overview
Full-stack ERP (Enterprise Resource Planning) application with Django REST backend and React frontend.

**Last Updated:** October 14, 2025

## Project Structure
```
.
├── finetune-ERP-backend-New/   # Django REST API backend
├── finetune-ERP-frontend-New/  # React + Vite frontend
├── docs/                        # Project documentation
└── pyproject.toml              # Python dependencies
```

## Technology Stack

### Backend
- **Framework:** Django 5.2.5
- **API:** Django REST Framework 3.16.1
- **Database:** PostgreSQL (Replit managed)
- **Authentication:** JWT (djangorestframework-simplejwt)
- **Language:** Python 3.11

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 6.3
- **State Management:** Redux Toolkit
- **UI Libraries:** Tailwind CSS, Headless UI
- **Language:** JavaScript (ES6+)

## Current Configuration

### Development Setup
- **Frontend:** Runs on port 5000 (Vite dev server)
- **Backend:** Runs on port 8000 (Django runserver)
- **Database:** PostgreSQL via DATABASE_URL environment variable

### Workflows
1. **Frontend:** `cd finetune-ERP-frontend-New && npm run dev`
   - Port: 5000 (webview output)
   - Vite configured for Replit proxy

2. **Backend:** `cd finetune-ERP-backend-New && python manage.py runserver 0.0.0.0:8000`
   - Port: 8000 (console output)
   - CORS configured for local frontend

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-configured)
- `SECRET_KEY` - Django secret key
- `DEBUG` - Debug mode (set to "True" for development)
- Frontend uses `VITE_API_BASE_URL=http://localhost:8000` for local dev

### CORS Configuration
The backend is configured to accept requests from:
- Replit development domain
- localhost:5000 (frontend dev server)
- Production domains (finetune.store, vercel deployments)

## Recent Changes (October 14, 2025)
- ✅ Installed Python 3.11 and Node.js 20
- ✅ Installed backend dependencies from pyproject.toml
- ✅ Installed frontend dependencies with --legacy-peer-deps flag
- ✅ Configured Vite for Replit (port 5000, WebSocket HMR)
- ✅ Created PostgreSQL database and ran migrations
- ✅ Updated CORS/CSRF settings for Replit domains (regex-based for dynamic domains)
- ✅ Created frontend and backend workflows
- ✅ Updated .gitignore for Python and Node.js artifacts
- ✅ Configured deployment for autoscale
- ✅ Fixed frontend-backend integration for Replit (HTTP backend URL, dynamic detection)
- ✅ Updated Django security settings for dev mode (non-secure cookies in DEBUG mode)
- ✅ **Mobile Performance & Desktop Layout Improvements:**
  - Updated TestimonialsReel to show 3 slides on desktop (was 1), 2 on tablet, 1 on mobile
  - Added GPU acceleration to all scroll containers for smoother performance
  - Optimized mobile scrolling with tap highlight removal and font smoothing
  - Added responsive gap spacing between horizontal slides (0.5rem mobile, 1rem desktop)
  - Improved snap scrolling behavior on mobile devices
  - Fixed horizontal swipe gestures to work properly on mobile sliders
- ✅ **Accessibility & UX Enhancements (Production-Ready):**
  - Created reusable Button component with consistent 44px minimum touch targets
  - Fixed mobile viewport height jumping issue with dynamic viewport height hook (dvh fallback)
  - Improved color contrast in HeroReel (90%/100% opacity vs 70%/80%) for WCAG AA compliance
  - Added focus indicators to all interactive cards (testimonials, repair services)
  - Implemented skip navigation link for keyboard users in PublicLayout
  - Changed scroll-snap from "mandatory" to "proximity" for smoother scrolling experience
  - Added mobile progress bar indicator at bottom for section navigation
  - Replaced all console.log statements with environment-aware devLog utility (production-ready)
  - Added comprehensive JSDoc documentation to all reel components and utility functions
  - Added PropTypes validation to TestimonialsReel component

## Development Commands

### Backend
```bash
cd finetune-ERP-backend-New
python manage.py migrate              # Run migrations
python manage.py createsuperuser      # Create admin user
python manage.py test                 # Run tests
python manage.py collectstatic        # Collect static files
```

### Frontend
```bash
cd finetune-ERP-frontend-New
npm run dev                           # Start dev server
npm run build                         # Build for production
npm run test                          # Run tests
npm run lint                          # Lint code
```

## Key Files Modified for Replit
1. `finetune-ERP-frontend-New/vite.config.js` - Port 5000, HMR config for WSS proxy
2. `finetune-ERP-backend-New/config/settings.py` - CORS/CSRF/ALLOWED_HOSTS for Replit
   - Uses CORS_ALLOWED_ORIGIN_REGEXES for dynamic Replit domains
   - Auto-configures ALLOWED_HOSTS from REPLIT_DOMAINS env
   - CSRF trusts both HTTP and HTTPS Replit domains
   - Proxy headers enabled (USE_X_FORWARDED_HOST, USE_X_FORWARDED_PORT)
3. `finetune-ERP-frontend-New/src/utils/Endpoints.js` - Dynamic API URL detection
4. `finetune-ERP-frontend-New/.env` - HTTPS backend URL via Replit proxy
5. `.gitignore` - Python and Node.js artifacts

## Deployment
The application is configured for autoscale deployment:
- **Build:** Installs dependencies, runs migrations, collects static files
- **Run:** Serves frontend build + backend API via Gunicorn on port 5000

## Notes
- Database uses PostgreSQL in both dev and production (via Replit managed database)
- Frontend makes API calls to backend on port 8000 via HTTPS proxy
- Both servers run simultaneously via workflows
- Replit automatically configures REPLIT_DOMAINS env variable for dynamic host management
- The backend includes multiple apps: accounts, attendance, bookings, catalog, inventory, invoicing, marketing, spares, store
- Mixed content issues avoided by using HTTPS for all API calls through Replit proxy

## Important: Replit Domain Changes
When Replit regenerates hostnames (on forks/restarts), update `VITE_API_BASE_URL` in `.env` to the new domain. The Endpoints.js file will auto-detect Replit domains, but the explicit env variable takes precedence.
