# fe-be-alignment-analysis - File Structure

## 📋 Config
| File | Description | Link |
|------|-------------|------|
| `env.example` | Sample environment variables referenced by backend and frontend services. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/env.example) |
| `pyproject.toml` | Python workspace configuration with backend dependencies and tooling extras. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/pyproject.toml) |
| `pytest.ini` | Pytest defaults enabling Django settings discovery and test markers. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/pytest.ini) |
| `finetune-ERP-backend-New/config/settings.py` | Primary Django settings module configuring REST, auth, and integrations. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/config/settings.py) |
| `finetune-ERP-frontend-New/package.json` | Frontend package manifest with scripts and npm dependency graph. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/package.json) |
| `finetune-ERP-frontend-New/vite.config.js` | Vite build pipeline and alias configuration for the React client. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/vite.config.js) |
| `finetune-ERP-frontend-New/tailwind.config.js` | Tailwind theme presets and content scanning rules for styling. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/tailwind.config.js) |
| `finetune-ERP-frontend-New/postcss.config.js` | PostCSS plugin stack for processing Tailwind and autoprefixing. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/postcss.config.js) |
| `finetune-ERP-frontend-New/eslint.config.js` | Shared linting rules aligning with the Vite React project structure. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/eslint.config.js) |
| `finetune-ERP-frontend-New/prettier.config.js` | Prettier formatting conventions for JSX, JS, and CSS assets. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/prettier.config.js) |
| `finetune-ERP-frontend-New/setupTests.js` | Vitest test environment bootstrap configuring jsdom and globals. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/setupTests.js) |

## Backend Source
| File | Description | Link |
|------|-------------|------|
| `finetune-ERP-backend-New/manage.py` | Django management entry point for running servers and commands. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/manage.py) |
| `finetune-ERP-backend-New/accounts/models.py` | Custom user model tying roles and store assignments to auth. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/accounts/models.py) |
| `finetune-ERP-backend-New/accounts/serializers.py` | DRF serializers exposing account and permission data to the API. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/accounts/serializers.py) |
| `finetune-ERP-backend-New/activity/views.py` | Read-only REST viewset streaming audit log exports and filters. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/activity/views.py) |
| `finetune-ERP-backend-New/attendance/views.py` | Attendance REST handlers covering check-ins, shifts, and approvals. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/attendance/views.py) |
| `finetune-ERP-backend-New/bookings/views.py` | Booking workflow APIs including throttled public submissions. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/bookings/views.py) |
| `finetune-ERP-backend-New/catalog/views.py` | Catalog endpoints managing product taxonomy and relations. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/catalog/views.py) |
| `finetune-ERP-backend-New/inventory/views.py` | Inventory CRUD viewsets for stock ledgers and serial tracking. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/inventory/views.py) |
| `finetune-ERP-backend-New/invoicing/views.py` | Invoice generation and payment reconciliation REST endpoints. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/invoicing/views.py) |
| `finetune-ERP-backend-New/marketing/views.py` | Marketing lead capture APIs integrating throttles and validation. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/marketing/views.py) |
| `finetune-ERP-backend-New/spares/views.py` | Spare parts API exposing brand, model, and availability data. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/spares/views.py) |
| `finetune-ERP-backend-New/store/models.py` | Core store models including branch metadata and permissions. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/store/models.py) |
| `finetune-ERP-backend-New/utils/notification_service.py` | Shared email/SMS notification helpers invoked by bookings and invoices. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/utils/notification_service.py) |

## Frontend Source
| File | Description | Link |
|------|-------------|------|
| `finetune-ERP-frontend-New/src/main.jsx` | React entry mounting providers, layout context, and router shell. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/main.jsx) |
| `finetune-ERP-frontend-New/src/App.jsx` | Route definitions, lazy loading, and auth-gated dashboard flows. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/App.jsx) |
| `finetune-ERP-frontend-New/src/index.css` | Global Tailwind imports plus overrides for typography and layout. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/index.css) |
| `finetune-ERP-frontend-New/src/api/erpApi.js` | Redux Toolkit Query service wrapping ERP endpoints with tags. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/api/erpApi.js) |
| `finetune-ERP-frontend-New/src/api/store.js` | Async thunks for store CRUD operations using authenticated base query. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/api/store.js) |
| `finetune-ERP-frontend-New/src/components/dashboard/layout/DashboardLayout.jsx` | Role-aware dashboard shell rendering admin, branch, or advisor views. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/components/dashboard/layout/DashboardLayout.jsx) |
| `finetune-ERP-frontend-New/src/components/ResponsivePaginationHandler.jsx` | Responsive pagination controller shared across tables. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/components/ResponsivePaginationHandler.jsx) |
| `finetune-ERP-frontend-New/src/pages/internal/BookingsDashboard.jsx` | Internal dashboard page summarizing repair bookings metrics. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/pages/internal/BookingsDashboard.jsx) |
| `finetune-ERP-frontend-New/src/pages/public/Contact.jsx` | Public marketing page for contact capture integrated with booking CTA. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/pages/public/Contact.jsx) |
| `finetune-ERP-frontend-New/src/redux/store.js` | Redux store assembly injecting slices and RTK Query middleware. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/redux/store.js) |
| `finetune-ERP-frontend-New/src/utils/Endpoints.js` | Centralized API endpoint constants with base URL fallbacks. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/utils/Endpoints.js) |
| `finetune-ERP-frontend-New/src/hooks/useDevice.js` | Hook exposing responsive breakpoint logic consumed by UI components. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/hooks/useDevice.js) |

## 🧪 Tests
| File | Description | Link |
|------|-------------|------|
| `finetune-ERP-backend-New/tests/test_auth.py` | Validates authentication token issuance and refresh logic. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/tests/test_auth.py) |
| `finetune-ERP-backend-New/tests/test_bookings_api.py` | Covers booking CRUD flows and notification triggers. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/tests/test_bookings_api.py) |
| `finetune-ERP-backend-New/tests/test_inventory_api.py` | Regression tests for inventory stock and serial endpoints. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/tests/test_inventory_api.py) |
| `finetune-ERP-backend-New/tests/test_security_headers.py` | Ensures security headers and HTTPS hardening remain enforced. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/tests/test_security_headers.py) |
| `finetune-ERP-backend-New/attendance/tests.py` | Attendance-specific test suite for shifts, leaves, and approvals. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/attendance/tests.py) |
| `finetune-ERP-backend-New/attendance/tests_admin_api.py` | Admin-only attendance API regression tests and permission checks. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/attendance/tests_admin_api.py) |
| `finetune-ERP-frontend-New/__tests__/repairs/bookingForm.test.jsx` | Vitest coverage for repair booking form validation and submission. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/__tests__/repairs/bookingForm.test.jsx) |
| `finetune-ERP-frontend-New/src/components/__tests__/invoiceForm.test.jsx` | Component-level tests ensuring invoice form flows render correctly. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/components/__tests__/invoiceForm.test.jsx) |
| `finetune-ERP-frontend-New/src/pages/__tests__/productsDashboard.test.jsx` | Page tests asserting dashboard metrics and filters behave as expected. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/pages/__tests__/productsDashboard.test.jsx) |
| `finetune-ERP-frontend-New/src/redux/__tests__/notificationsSlice.test.js` | Redux slice tests verifying notification reducers and actions. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/redux/__tests__/notificationsSlice.test.js) |
| `finetune-ERP-frontend-New/src/api/__tests__/baseQuery.test.js` | Integration tests for authenticated API base query error handling. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/src/api/__tests__/baseQuery.test.js) |

## 📚 Docs
| File | Description | Link |
|------|-------------|------|
| `README.md` | Top-level overview with setup, architecture, and contribution workflow. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/README.md) |
| `CONTEXT.md` | Background on methodology, agent orchestration, and design principles. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/CONTEXT.md) |
| `FILEMAP.md` | Quick index mapping major directories to their responsibilities. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/FILEMAP.md) |
| `SECURITY_FIXES_2025-09-11.md` | Security remediation log detailing patched vulnerabilities. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/SECURITY_FIXES_2025-09-11.md) |
| `docs/ARCHITECTURE.md` | High-level system diagram describing coordinator, agents, and flows. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/docs/ARCHITECTURE.md) |
| `docs/API_GUIDE.md` | Endpoint catalog summarizing REST resources and payloads. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/docs/API_GUIDE.md) |
| `docs/BACKEND.md` | Backend developer handbook with local setup and troubleshooting. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/docs/BACKEND.md) |
| `docs/FRONTEND_GUIDE.md` | Frontend onboarding covering project structure and UI conventions. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/docs/FRONTEND_GUIDE.md) |
| `docs/how-to/ADMIN_DASHBOARD.md` | Task-focused guide for operating the admin dashboard tooling. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/docs/how-to/ADMIN_DASHBOARD.md) |
| `docs/project/WORKFLOW_GUIDE.md` | Cross-team workflow description spanning planning to release. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/docs/project/WORKFLOW_GUIDE.md) |
| `docs/contracts/INTEGRATION_CONTRACT.md` | Integration contract outlining agent hook expectations and schema. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/docs/contracts/INTEGRATION_CONTRACT.md) |
| `finetune-ERP-backend-New/agent.md` | Backend agent responsibilities and deployment checklist. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/agent.md) |
| `finetune-ERP-backend-New/docs/SECURITY.md` | Backend security posture with recommended controls and policies. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/docs/SECURITY.md) |
| `finetune-ERP-frontend-New/agent.md` | Frontend agent description and integration hooks for UI widgets. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/agent.md) |
| `finetune-ERP-frontend-New/docs/FRONTEND.md` | Extended frontend documentation covering layout system and tooling. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/docs/FRONTEND.md) |
| `docs/known-issues/KNOWN_ISSUES.md` | Catalog of outstanding issues with mitigation notes and status. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/docs/known-issues/KNOWN_ISSUES.md) |

## 🚀 Deploy
| File | Description | Link |
|------|-------------|------|
| `finetune-ERP-backend-New/pre_deploy.py` | Backend deployment helper orchestrating migrations and health checks. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/pre_deploy.py) |
| `finetune-ERP-backend-New/docs/DEPLOYMENT.md` | Deployment handbook covering Railway configuration and secrets. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-backend-New/docs/DEPLOYMENT.md) |
| `finetune-ERP-frontend-New/vercel.json` | Vercel deployment settings defining routes, rewrites, and headers. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/vercel.json) |
| `finetune-ERP-frontend-New/docs/DEPLOYMENT.md` | Frontend deployment guide covering Vercel flow and environment keys. | [View](https://raw.githubusercontent.com/krishamaze/mem0-chrome-extension-main/main/finetune-ERP-frontend-New/docs/DEPLOYMENT.md) |
