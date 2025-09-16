# fe-be-alignment-analysis - File Structure

## 📋 Config
| File | Description | Link |
|------|-------------|------|
| `env.example` | Sample environment variables referenced by backend and frontend services. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/env.example) |
| `pyproject.toml` | Python workspace configuration with backend dependencies and tooling extras. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/pyproject.toml) |
| `pytest.ini` | Pytest defaults enabling Django settings discovery and test markers. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/pytest.ini) |
| `finetune-ERP-backend-New/config/settings.py` | Primary Django settings module configuring REST, auth, and integrations. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/config/settings.py) |
| `finetune-ERP-frontend-New/package.json` | Frontend package manifest with scripts and npm dependency graph. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/package.json) |
| `finetune-ERP-frontend-New/vite.config.js` | Vite build pipeline and alias configuration for the React client. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/vite.config.js) |
| `finetune-ERP-frontend-New/tailwind.config.js` | Tailwind theme presets and content scanning rules for styling. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/tailwind.config.js) |
| `finetune-ERP-frontend-New/postcss.config.js` | PostCSS plugin stack for processing Tailwind and autoprefixing. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/postcss.config.js) |
| `finetune-ERP-frontend-New/eslint.config.js` | Shared linting rules aligning with the Vite React project structure. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/eslint.config.js) |
| `finetune-ERP-frontend-New/prettier.config.js` | Prettier formatting conventions for JSX, JS, and CSS assets. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/prettier.config.js) |
| `finetune-ERP-frontend-New/setupTests.js` | Vitest test environment bootstrap configuring jsdom and globals. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/setupTests.js) |

## Backend Source
| File | Description | Link |
|------|-------------|------|
| `finetune-ERP-backend-New/manage.py` | Django management entry point for running servers and commands. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/manage.py) |
| `finetune-ERP-backend-New/accounts/models.py` | Custom user model tying roles and store assignments to auth. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/accounts/models.py) |
| `finetune-ERP-backend-New/accounts/serializers.py` | DRF serializers exposing account and permission data to the API. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/accounts/serializers.py) |
| `finetune-ERP-backend-New/activity/views.py` | Read-only REST viewset streaming audit log exports and filters. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/activity/views.py) |
| `finetune-ERP-backend-New/attendance/views.py` | Attendance REST handlers covering check-ins, shifts, and approvals. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/attendance/views.py) |
| `finetune-ERP-backend-New/bookings/views.py` | Booking workflow APIs including throttled public submissions. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/bookings/views.py) |
| `finetune-ERP-backend-New/catalog/views.py` | Catalog endpoints managing product taxonomy and relations. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/catalog/views.py) |
| `finetune-ERP-backend-New/inventory/views.py` | Inventory CRUD viewsets for stock ledgers and serial tracking. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/inventory/views.py) |
| `finetune-ERP-backend-New/invoicing/views.py` | Invoice generation and payment reconciliation REST endpoints. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/invoicing/views.py) |
| `finetune-ERP-backend-New/marketing/views.py` | Marketing lead capture APIs integrating throttles and validation. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/marketing/views.py) |
| `finetune-ERP-backend-New/spares/views.py` | Spare parts API exposing brand, model, and availability data. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/spares/views.py) |
| `finetune-ERP-backend-New/store/models.py` | Core store models including branch metadata and permissions. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/store/models.py) |
| `finetune-ERP-backend-New/utils/notification_service.py` | Shared email/SMS notification helpers invoked by bookings and invoices. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/utils/notification_service.py) |

## Frontend Source
| File | Description | Link |
|------|-------------|------|
| `finetune-ERP-frontend-New/src/main.jsx` | React entry mounting providers, layout context, and router shell. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/main.jsx) |
| `finetune-ERP-frontend-New/src/App.jsx` | Route definitions, lazy loading, and auth-gated dashboard flows. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/App.jsx) |
| `finetune-ERP-frontend-New/src/index.css` | Global Tailwind imports plus overrides for typography and layout. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/index.css) |
| `finetune-ERP-frontend-New/src/api/erpApi.js` | Redux Toolkit Query service wrapping ERP endpoints with tags. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/api/erpApi.js) |
| `finetune-ERP-frontend-New/src/api/store.js` | Async thunks for store CRUD operations using authenticated base query. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/api/store.js) |
| `finetune-ERP-frontend-New/src/components/dashboard/layout/DashboardLayout.jsx` | Role-aware dashboard shell rendering admin, branch, or advisor views. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/components/dashboard/layout/DashboardLayout.jsx) |
| `finetune-ERP-frontend-New/src/components/ResponsivePaginationHandler.jsx` | Responsive pagination controller shared across tables. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/components/ResponsivePaginationHandler.jsx) |
| `finetune-ERP-frontend-New/src/pages/internal/BookingsDashboard.jsx` | Internal dashboard page summarizing repair bookings metrics. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/pages/internal/BookingsDashboard.jsx) |
| `finetune-ERP-frontend-New/src/pages/public/Contact.jsx` | Public marketing page for contact capture integrated with booking CTA. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/pages/public/Contact.jsx) |
| `finetune-ERP-frontend-New/src/redux/store.js` | Redux store assembly injecting slices and RTK Query middleware. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/redux/store.js) |
| `finetune-ERP-frontend-New/src/utils/Endpoints.js` | Centralized API endpoint constants with base URL fallbacks. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/utils/Endpoints.js) |
| `finetune-ERP-frontend-New/src/hooks/useDevice.js` | Hook exposing responsive breakpoint logic consumed by UI components. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/hooks/useDevice.js) |

## 🧪 Tests
| File | Description | Link |
|------|-------------|------|
| `finetune-ERP-backend-New/tests/test_auth.py` | Validates authentication token issuance and refresh logic. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/tests/test_auth.py) |
| `finetune-ERP-backend-New/tests/test_bookings_api.py` | Covers booking CRUD flows and notification triggers. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/tests/test_bookings_api.py) |
| `finetune-ERP-backend-New/tests/test_inventory_api.py` | Regression tests for inventory stock and serial endpoints. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/tests/test_inventory_api.py) |
| `finetune-ERP-backend-New/tests/test_security_headers.py` | Ensures security headers and HTTPS hardening remain enforced. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/tests/test_security_headers.py) |
| `finetune-ERP-backend-New/attendance/tests.py` | Attendance-specific test suite for shifts, leaves, and approvals. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/attendance/tests.py) |
| `finetune-ERP-backend-New/attendance/tests_admin_api.py` | Admin-only attendance API regression tests and permission checks. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/attendance/tests_admin_api.py) |
| `finetune-ERP-frontend-New/__tests__/repairs/bookingForm.test.jsx` | Vitest coverage for repair booking form validation and submission. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/__tests__/repairs/bookingForm.test.jsx) |
| `finetune-ERP-frontend-New/src/components/__tests__/invoiceForm.test.jsx` | Component-level tests ensuring invoice form flows render correctly. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/components/__tests__/invoiceForm.test.jsx) |
| `finetune-ERP-frontend-New/src/pages/__tests__/productsDashboard.test.jsx` | Page tests asserting dashboard metrics and filters behave as expected. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/pages/__tests__/productsDashboard.test.jsx) |
| `finetune-ERP-frontend-New/src/redux/__tests__/notificationsSlice.test.js` | Redux slice tests verifying notification reducers and actions. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/redux/__tests__/notificationsSlice.test.js) |
| `finetune-ERP-frontend-New/src/api/__tests__/baseQuery.test.js` | Integration tests for authenticated API base query error handling. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/api/__tests__/baseQuery.test.js) |

## 📚 Docs
| File | Description | Link |
|------|-------------|------|
| `README.md` | Top-level overview with setup, architecture, and contribution workflow. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/README.md) |
| `CONTEXT.md` | Background on methodology, agent orchestration, and design principles. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/CONTEXT.md) |
| `FILEMAP.md` | Quick index mapping major directories to their responsibilities. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/FILEMAP.md) |
| `SECURITY_FIXES_2025-09-11.md` | Security remediation log detailing patched vulnerabilities. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/SECURITY_FIXES_2025-09-11.md) |
| `docs/ARCHITECTURE.md` | High-level system diagram describing coordinator, agents, and flows. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/docs/ARCHITECTURE.md) |
| `docs/API_GUIDE.md` | Endpoint catalog summarizing REST resources and payloads. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/docs/API_GUIDE.md) |
| `docs/BACKEND.md` | Backend developer handbook with local setup and troubleshooting. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/docs/BACKEND.md) |
| `docs/FRONTEND_GUIDE.md` | Frontend onboarding covering project structure and UI conventions. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/docs/FRONTEND_GUIDE.md) |
| `docs/how-to/ADMIN_DASHBOARD.md` | Task-focused guide for operating the admin dashboard tooling. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/docs/how-to/ADMIN_DASHBOARD.md) |
| `docs/project/WORKFLOW_GUIDE.md` | Cross-team workflow description spanning planning to release. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/docs/project/WORKFLOW_GUIDE.md) |
| `docs/contracts/INTEGRATION_CONTRACT.md` | Integration contract outlining agent hook expectations and schema. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/docs/contracts/INTEGRATION_CONTRACT.md) |
| `finetune-ERP-backend-New/agent.md` | Backend agent responsibilities and deployment checklist. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/agent.md) |
| `finetune-ERP-backend-New/docs/SECURITY.md` | Backend security posture with recommended controls and policies. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/docs/SECURITY.md) |
| `finetune-ERP-frontend-New/agent.md` | Frontend agent description and integration hooks for UI widgets. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/agent.md) |
| `finetune-ERP-frontend-New/docs/FRONTEND.md` | Extended frontend documentation covering layout system and tooling. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/docs/FRONTEND.md) |
| `docs/known-issues/KNOWN_ISSUES.md` | Catalog of outstanding issues with mitigation notes and status. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/docs/known-issues/KNOWN_ISSUES.md) |

## 🚀 Deploy
| File | Description | Link |
|------|-------------|------|
| `finetune-ERP-backend-New/pre_deploy.py` | Backend deployment helper orchestrating migrations and health checks. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/pre_deploy.py) |
| `finetune-ERP-backend-New/docs/DEPLOYMENT.md` | Deployment handbook covering Railway configuration and secrets. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/docs/DEPLOYMENT.md) |
| `finetune-ERP-frontend-New/vercel.json` | Vercel deployment settings defining routes, rewrites, and headers. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/vercel.json) |
| `finetune-ERP-frontend-New/docs/DEPLOYMENT.md` | Frontend deployment guide covering Vercel flow and environment keys. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/docs/DEPLOYMENT.md) |

## 🔍 Audit Status & Follow-up

### Backend Checklist (Day 1 Review)
| File | Status | Notes | Link |
|------|--------|-------|------|
| `finetune-ERP-backend-New/config/urls.py` | ✅ Exists | Main router wires every app URL module including accounts, attendance, bookings, and more. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/config/urls.py) |
| `finetune-ERP-backend-New/config/settings.py` | ✅ Exists | Settings reference installed apps above and load REST framework/auth integrations. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/config/settings.py) |
| `finetune-ERP-backend-New/accounts/urls.py` | ⚠️ Modular | No single `urls.py`; routes live in `accounts/urls/auth_urls.py` and `accounts/urls/user_urls.py` which are included in config. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/accounts/urls/auth_urls.py) |
| `finetune-ERP-backend-New/accounts/views.py` | ⚠️ Modular | Views are split into `accounts/views/auth.py` and `accounts/views/admin_users.py`; confirm team alignment before adding wrapper file. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/accounts/views/auth.py) |
| `finetune-ERP-backend-New/attendance/urls.py` | ✅ Exists | Provides REST routes for attendance approvals and shift workflows. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/attendance/urls.py) |
| `finetune-ERP-backend-New/attendance/models.py` | ✅ Exists | Defines attendance, shift, and leave tracking models consumed by serializers/views. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/attendance/models.py) |
| `finetune-ERP-backend-New/bookings/urls.py` | ✅ Exists | Exposes booking creation and management endpoints, imported by `config/urls.py`. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/bookings/urls.py) |
| `finetune-ERP-backend-New/bookings/models.py` | ✅ Exists | Contains booking, schedule, and workflow models with notification hooks. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/bookings/models.py) |
| `finetune-ERP-backend-New/catalog/urls.py` | ✅ Exists | Registers catalog taxonomy routes and nested viewsets. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/catalog/urls.py) |
| `finetune-ERP-backend-New/catalog/models.py` | ✅ Exists | Models store categories, variants, and attribute definitions. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/catalog/models.py) |
| `finetune-ERP-backend-New/inventory/urls.py` | ✅ Exists | Routing for stock ledger APIs, serials, and configuration endpoints. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/inventory/urls.py) |
| `finetune-ERP-backend-New/inventory/models.py` | ✅ Exists | Tracks stock entries, serial numbers, and price logs referenced on dashboards. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/inventory/models.py) |
| `finetune-ERP-backend-New/invoicing/urls.py` | ✅ Exists | Invoice REST routes are defined and imported by the project router. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/invoicing/urls.py) |
| `finetune-ERP-backend-New/invoicing/models.py` | ✅ Exists | Holds invoice, payment, and adjustment models tied to finance workflows. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/invoicing/models.py) |
| `finetune-ERP-backend-New/marketing/urls.py` | ✅ Exists | Provides marketing lead endpoints plus brand-specific routes. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/marketing/urls.py) |
| `finetune-ERP-backend-New/marketing/models.py` | ✅ Exists | Defines campaign, lead, and brand models that power marketing flows. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/marketing/models.py) |
| `finetune-ERP-backend-New/spares/urls.py` | ✅ Exists | REST routes supporting spare parts CRUD and filtering. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/spares/urls.py) |
| `finetune-ERP-backend-New/spares/models.py` | ✅ Exists | Stores spare product metadata surfaced in frontend management pages. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/spares/models.py) |
| `finetune-ERP-backend-New/store/urls.py` | ✅ Exists | Branch/store routing is defined and included in the project URL map. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/store/urls.py) |
| `finetune-ERP-backend-New/store/views.py` | ✅ Exists | Contains store CRUD viewsets consumed by dashboards and API clients. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-backend-New/store/views.py) |

### Frontend Checklist (Day 1 Review)
| File or Directory | Status | Notes | Link |
|-------------------|--------|-------|------|
| `finetune-ERP-frontend-New/src/components/attendance/` | ❌ Missing | No attendance-specific component directory; create based on attendance APIs. | — |
| `finetune-ERP-frontend-New/src/components/inventory/` | ✅ Exists | Inventory widgets (tables, forms, serial manager) already implemented. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/components/inventory/StockTable.jsx) |
| `finetune-ERP-frontend-New/src/components/catalog/` | ❌ Missing | Catalog UI components absent; align with backend catalog endpoints before implementation. | — |
| `finetune-ERP-frontend-New/src/components/invoicing/` | ❌ Missing | Dedicated invoicing components not present; invoices currently handled in shared components. | — |
| `finetune-ERP-frontend-New/src/components/spares/` | ❌ Missing | Spares management uses page-level logic only; extract shared components for reuse. | — |
| `finetune-ERP-frontend-New/src/pages/internal/AttendanceDashboard.jsx` | ❌ Missing | Dashboard not created; attendance flow relies solely on backend endpoints. | — |
| `finetune-ERP-frontend-New/src/pages/internal/InventoryDashboard.jsx` | ✅ Exists | Inventory dashboard pulls ledger data via RTK Query and renders inventory components. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/pages/internal/InventoryDashboard.jsx) |
| `finetune-ERP-frontend-New/src/pages/internal/CatalogDashboard.jsx` | ❌ Missing | No catalog dashboard; consider whether `ProductsDashboard.jsx` should cover catalog responsibilities. | — |
| `finetune-ERP-frontend-New/src/pages/internal/InvoicingDashboard.jsx` | ⚠️ Renamed | Functionality exists as `InvoicesDashboard.jsx`; ensure routing and documentation reflect naming. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/pages/internal/InvoicesDashboard.jsx) |
| `finetune-ERP-frontend-New/src/pages/internal/SparesDashboard.jsx` | ⚠️ Replaced | Spares workflows live in `Spares.jsx`; evaluate need for dashboard wrapper component. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/src/pages/internal/Spares.jsx) |
| `finetune-ERP-frontend-New/src/redux/slices/attendanceSlice.js` | ❌ Missing | Redux slices directory uses singular `slice/`; no attendance slice exists yet. | — |
| `finetune-ERP-frontend-New/src/redux/slices/inventorySlice.js` | ❌ Missing | Inventory logic handled via RTK Query and components; create slice if stateful caching required. | — |
| `finetune-ERP-frontend-New/src/redux/slices/catalogSlice.js` | ❌ Missing | Catalog state not centralized; confirm requirement before building slice. | — |
| `finetune-ERP-frontend-New/src/redux/slices/bookingsSlice.js` | ❌ Missing | Bookings rely on RTK Query; slice absent under current structure. | — |
| `finetune-ERP-frontend-New/src/redux/slices/invoicingSlice.js` | ❌ Missing | Finance state derived from API hooks; implement slice only if memoized UI state needed. | — |
| `finetune-ERP-frontend-New/src/api/modules/` | ❌ Missing | API layer has root `api` folder only; module-specific API helpers not scaffolded. | — |

### DevOps & QA Checklist (Day 1 Review)
| File | Status | Notes | Link |
|------|--------|-------|------|
| `env.example` | ✅ Exists | Provides shared environment variables for backend/frontend but lacks module-specific secrets. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/env.example) |
| `finetune-ERP-backend-New/requirements.txt` | ❌ Missing | Backend relies on `pyproject.toml`; add compatibility requirements file if deployment expects it. | — |
| `finetune-ERP-backend-New/Dockerfile` | ❌ Missing | No backend container spec located; required for containerized deployments. | — |
| `finetune-ERP-backend-New/docker-compose.yml` | ❌ Missing | Compose stack absent; confirm orchestration approach for local + staging environments. | — |
| `finetune-ERP-frontend-New/.env.example` | ✅ Exists | Frontend exposes API base URL variables for Vite builds. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/finetune-ERP-frontend-New/.env.example) |
| `finetune-ERP-frontend-New/Dockerfile` | ❌ Missing | Need Dockerfile if frontend will be deployed via containers instead of Vercel. | — |
| `tests/` (root) | ❌ Missing | Tests exist inside backend/frontend packages; root-level harness absent. | — |
| `scripts/` (deployment) | ❌ Missing | No shared automation scripts tracked; evaluate requirement per release plan. | — |
| `.github/workflows/` | ✅ Exists | CI pipelines for linting, Lighthouse, syncing, and tests already configured. | [View](https://raw.githubusercontent.com/krishamaze/fe-be-alignment-analysis/main/.github/workflows/test.yml) |

### 📊 Tracking Sheet Template
| Team Member | Section | Files Checked | Missing Found | Issues Found | ETA Complete |
|-------------|---------|---------------|---------------|--------------|--------------|
| _(assign)_ | Backend-Auth | 0/5 | 0 | 0 | Day 1 |
| _(assign)_ | Frontend-Components | 0/10 | 0 | 0 | Day 1 |
| _(assign)_ | DevOps-Config | 0/6 | 0 | 0 | Day 1 |

### ⚡ Immediate Actions
- Team lead to set up shared tracking sheet, assign owners, and arrange an end-of-day sync.
- Developers should pull the latest codebase, audit according to the checklist above, and log findings plus remediation ETAs.
- Flag red-alert items (missing URLs, absent models, undefined API integrations, undocumented env vars, or broken tests) to the lead immediately.
