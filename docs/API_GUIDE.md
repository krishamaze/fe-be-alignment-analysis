# API Guide

This guide highlights cross-cutting workflows (auth, catalog, bookings,
attendance, marketing) and the expectations around payloads and permissions. For
an exhaustive endpoint inventory, consult the
[`Backend API Routes Reference`](reference/BACKEND_API_ROUTES.md).

## Authentication

- `POST /api/auth/login` – issue JWT access/refresh tokens; throttled under the
  `login` scope.
- `POST /api/auth/register` – create a customer account.
- `POST /api/auth/logout` – blacklist refresh token.
- `GET /api/auth/me` – inspect the current user's profile.
- `POST /api/token/refresh` / `POST /api/token/verify` – lifecycle management for
  JWTs.

All dashboard APIs require `Authorization: Bearer <token>` headers. Customer
pages (`/account`, `/orders`) reuse the same tokens and share logout behaviour.

## Catalog & Inventory

Departments, categories, subcategories, products, and variants follow DRF
`ModelViewSet` semantics exposed under `/api/*` prefixes. Filtering and ordering
match the query parameters surfaced by the frontend (e.g., `?brand=`,
`?department=`, `?min_price=`, `?ordering=-date_created`). Units and qualities
require authentication for reads and restrict mutations to the `system_admin`
role.

Inventory routes (`/api/stock-ledgers/`, `/api/stock-entries/`, `/api/serials/`,
`/api/price-logs/`, `/api/inventory-config/`) are all admin-only. Stock entries
support the standard `GET/POST/PUT/PATCH/DELETE` matrix; configuration accepts
`GET` + `PUT` to adjust global thresholds.

## Bookings & Customer Experience

Create and manage bookings through `/api/bookings`:

```json
{
  "name": "John",
  "email": "j@example.com",
  "date": "2024-01-01",
  "time": "10:00",
  "captcha_token": "...",
  "details": {"issues": [1,2], "brand": "Apple", "product": "iPhone"},
  "responses": [
    {"question_set_name": "A", "question": "Is it working?", "response": "Yes"}
  ]
}
```

- Public POSTs are throttled (`booking` scope) and send notifications when a
  status transitions.
- `system_admin` users can approve, reject, cancel, or complete bookings in line
  with the serializer's transition table.
- Supporting taxonomies (`/api/issues`, `/api/otherissues`, `/api/questions`)
  are available to authenticated dashboards for configuration.
- Customer feedback can be created via `POST /api/responses`; admins can list and
  read responses for audit trails.

## Attendance

The attendance module lives under `/api/attendance/` and uses selfie uploads to
validate advisor check-ins/outs.

- Advisors call `POST /api/attendance/check-in` and `POST /api/attendance/check-out`
  with multipart payloads that include latitude/longitude and images.
- Managers review pending records through `GET /api/attendance/approvals` and
  resolve them using `/approve` or `/reject` actions on individual IDs.
- Reports exist for advisors (`GET /api/attendance/me/today`,
  `GET /api/attendance/reports/me`) and store managers (`GET /api/attendance/reports/store/{store_id}`).
- System administrators can manage shifts, schedules, week offs, exceptions,
  geofences, and payroll profiles under `/api/attendance/admin/*` endpoints to
  keep rosters in sync.

## Marketing & Lead Capture

- `GET/POST /api/brands/` – brand catalogue backing marketing pages; non-admins
  are read-only.
- `POST /api/marketing/contact/` – contact-us form submissions with scoped rate
  limiting (`contact`).
- `POST /api/marketing/schedule-call/` – schedule a callback with throttling via
  the `schedule_call` scope.

Frontend forms (`/contact`, `/schedule-call`) are wired to these endpoints via
RTK Query mutations.

## Activity Logs

`GET /api/logs/` exposes an audit trail for privileged users with filters for
entity, actor, and date range. Export logs through
`GET /api/logs/export/?format=csv|json` to support compliance checks.

## Related Guides

- [`Backend API Routes Reference`](reference/BACKEND_API_ROUTES.md)
- [`Environment Key Reference`](reference/ENVIRONMENT_KEYS.md)
- [`Frontend Route Reference`](reference/FRONTEND_ROUTES.md)
