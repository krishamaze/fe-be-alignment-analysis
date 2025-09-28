# Backend API Routes Reference

_Last synced: 2024-11-12_

This reference is derived from `config/urls.py` and the URL configurations
exposed by each Django app. Update this page whenever a route is added or
removed by re-reading the source files and adjusting the tables below.

## Authentication & Session

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/auth/login` | POST | Obtain JWT access and refresh tokens. | Public (rate limited via `login` scope). |
| `/api/auth/register` | POST | Create a customer account. | Public. |
| `/api/auth/logout` | POST | Blacklist refresh token and end session. | Authenticated. |
| `/api/auth/me` | GET | Return the authenticated user's profile. | Authenticated. |
| `/api/token/refresh` | POST | Refresh access token. | Authenticated with refresh token. |
| `/api/token/verify` | POST | Verify access/refresh token signature. | Authenticated. |

## Accounts

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/users` | GET | List active users with search and filters. | `system_admin`. |
| `/api/users` | POST | Create a new staff user. | `system_admin`. |
| `/api/users/{id}` | GET | Retrieve a single user. | `system_admin`. |
| `/api/users/{id}` | PUT/PATCH | Update user profile or role assignments. | `system_admin`. |
| `/api/users/{id}` | DELETE | Soft-delete and deactivate a user. | `system_admin` (self-delete blocked). |

## Store

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/stores` | GET | List stores (filters for branch/HQ). | Public read. |
| `/api/stores` | POST | Create a store record. | `system_admin`. |
| `/api/stores/{id}` | GET | Retrieve store details. | Public read. |
| `/api/stores/{id}` | PUT/PATCH | Update store metadata. | `system_admin`. |
| `/api/stores/{id}` | DELETE | Soft-delete a store. | `system_admin`. |

## Spares

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/spares` | GET | List spare parts (price hidden for non-admin users). | Public read. |
| `/api/spares` | POST | Create a spare part. | `system_admin`. |
| `/api/spares/{id}` | GET | Retrieve spare part details. | Public read. |
| `/api/spares/{id}` | PUT/PATCH | Update spare part information. | `system_admin`. |
| `/api/spares/{id}` | DELETE | Remove a spare part. | `system_admin`. |

## Catalog & Taxonomy

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/departments` | GET | List departments. | Public read. |
| `/api/departments` | POST | Create a department. | `system_admin`. |
| `/api/departments/{slug}` | GET | Retrieve a department. | Public read. |
| `/api/departments/{slug}` | PUT/PATCH | Update a department (slug immutable). | `system_admin`. |
| `/api/departments/{slug}` | DELETE | Delete a department. | `system_admin`. |
| `/api/categories` | GET | List categories (filter by department). | Public read. |
| `/api/categories` | POST | Create a category. | `system_admin`. |
| `/api/categories/{slug}` | GET | Retrieve a category. | Public read. |
| `/api/categories/{slug}` | PUT/PATCH | Update a category (slug immutable). | `system_admin`. |
| `/api/categories/{slug}` | DELETE | Delete a category. | `system_admin`. |
| `/api/subcategories` | GET | List subcategories (filter by category). | Public read. |
| `/api/subcategories` | POST | Create a subcategory. | `system_admin`. |
| `/api/subcategories/{slug}` | GET | Retrieve a subcategory. | Public read. |
| `/api/subcategories/{slug}` | PUT/PATCH | Update a subcategory (slug immutable). | `system_admin`. |
| `/api/subcategories/{slug}` | DELETE | Delete a subcategory. | `system_admin`. |
| `/api/products` | GET | List products (brand, taxonomy, price filters). | Public read. |
| `/api/products` | POST | Create a product. | `system_admin`. |
| `/api/products/{slug}` | GET | Retrieve a product by slug. | Public read. |
| `/api/products/{slug}` | PUT/PATCH | Update a product (slug immutable). | `system_admin`. |
| `/api/products/{slug}` | DELETE | Delete a product. | `system_admin`. |
| `/api/variants` | GET | List variants (filter by product). | Public read. |
| `/api/variants` | POST | Create a variant. | `system_admin`. |
| `/api/variants/{slug}` | GET | Retrieve a variant. | Public read. |
| `/api/variants/{slug}` | PUT/PATCH | Update a variant (slug immutable). | `system_admin`. |
| `/api/variants/{slug}` | DELETE | Delete a variant. | `system_admin`. |
| `/api/units` | GET | List measurement units. | Authenticated read. |
| `/api/units` | POST | Create a unit. | `system_admin`. |
| `/api/units/{slug}` | GET | Retrieve a unit. | Authenticated read. |
| `/api/units/{slug}` | PUT/PATCH | Update a unit (slug immutable). | `system_admin`. |
| `/api/units/{slug}` | DELETE | Delete a unit. | `system_admin`. |
| `/api/qualities` | GET | List quality tags. | Authenticated read. |
| `/api/qualities` | POST | Create a quality tag. | `system_admin`. |
| `/api/qualities/{slug}` | GET | Retrieve a quality tag. | Authenticated read. |
| `/api/qualities/{slug}` | PUT/PATCH | Update a quality tag (slug immutable). | `system_admin`. |
| `/api/qualities/{slug}` | DELETE | Delete a quality tag. | `system_admin`. |

## Bookings & Customer Experience

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/bookings` | GET | List bookings with status filters. | `system_admin`. |
| `/api/bookings` | POST | Create a booking request (captcha + throttled). | Public create. |
| `/api/bookings/{id}` | GET | Retrieve a booking. | `system_admin`. |
| `/api/bookings/{id}` | PUT/PATCH | Update booking status and notes. | `system_admin` (status transitions enforced). |
| `/api/issues` | GET | List repair issue presets. | Authenticated read. |
| `/api/issues` | POST | Create a repair issue. | `system_admin`. |
| `/api/issues/{id}` | GET | Retrieve a repair issue. | Authenticated read. |
| `/api/issues/{id}` | PUT/PATCH | Update a repair issue. | `system_admin`. |
| `/api/issues/{id}` | DELETE | Remove a repair issue. | `system_admin`. |
| `/api/otherissues` | GET | List "other" issues. | Authenticated read. |
| `/api/otherissues` | POST | Create an "other" issue. | `system_admin`. |
| `/api/otherissues/{id}` | GET | Retrieve an "other" issue. | Authenticated read. |
| `/api/otherissues/{id}` | PUT/PATCH | Update an "other" issue. | `system_admin`. |
| `/api/otherissues/{id}` | DELETE | Remove an "other" issue. | `system_admin`. |
| `/api/questions` | GET | List booking questions. | Authenticated read. |
| `/api/questions` | POST | Create a booking question. | `system_admin`. |
| `/api/questions/{id}` | GET | Retrieve a booking question. | Authenticated read. |
| `/api/questions/{id}` | PUT/PATCH | Update a booking question. | `system_admin`. |
| `/api/questions/{id}` | DELETE | Remove a booking question. | `system_admin`. |
| `/api/responses` | GET | List booking responses. | `system_admin`. |
| `/api/responses` | POST | Submit a response for a booking. | Public create. |
| `/api/responses/{id}` | GET | Retrieve a response. | `system_admin`. |

## Marketing & Lead Capture

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/brands/` | GET | List brands for marketing pages. | Public read. |
| `/api/brands/` | POST | Create a brand record. | `system_admin`. |
| `/api/brands/{id}/` | GET | Retrieve a brand. | Public read. |
| `/api/brands/{id}/` | PUT/PATCH | Update a brand. | `system_admin`. |
| `/api/brands/{id}/` | DELETE | Delete a brand. | `system_admin`. |
| `/api/marketing/contact/` | POST | Submit a contact form lead. | Public (throttled under `contact`). |
| `/api/marketing/schedule-call/` | POST | Request a callback. | Public (throttled under `schedule_call`). |

## Attendance

Unless noted, these routes live under `/api/attendance/` and do not use trailing
slashes.

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/attendance/check-in` | POST | Advisor selfie check-in (geofence + late rules). | Authenticated advisor. |
| `/api/attendance/check-out` | POST | Advisor selfie check-out with OT request. | Authenticated advisor. |
| `/api/attendance/me/today` | GET | View today's attendance record. | Authenticated advisor/branch head/system admin. |
| `/api/attendance/approvals` | GET | List pending attendance approval requests. | Branch head or system admin. |
| `/api/attendance/approvals/{id}/approve` | POST | Approve a pending attendance exception. | Branch head or system admin. |
| `/api/attendance/approvals/{id}/reject` | POST | Reject a pending attendance exception. | Branch head or system admin. |
| `/api/attendance/reports/store/{store_id}` | GET | Monthly attendance report for a store. | Branch head (own store) or system admin. |
| `/api/attendance/reports/me` | GET | Monthly attendance report for current user. | Authenticated advisor. |
| `/api/attendance/admin/shifts` | GET/POST | List or create shifts. | `system_admin`. |
| `/api/attendance/admin/shifts/{id}` | GET/PUT/PATCH/DELETE | Retrieve or manage a shift. | `system_admin`. |
| `/api/attendance/admin/schedules` | GET/POST | List or create advisor schedules. | `system_admin`. |
| `/api/attendance/admin/schedules/{id}` | GET/PUT/PATCH/DELETE | Manage an advisor schedule. | `system_admin`. |
| `/api/attendance/admin/schedules/{id}/preview` | GET | Preview schedule assignments between dates. | `system_admin`. |
| `/api/attendance/admin/weekoffs` | GET/POST | Manage advisor weekly offs. | `system_admin`. |
| `/api/attendance/admin/weekoffs/{id}` | GET/PUT/PATCH/DELETE | Manage a weekly off record. | `system_admin`. |
| `/api/attendance/admin/exceptions` | GET/POST | Manage schedule exceptions. | `system_admin`. |
| `/api/attendance/admin/exceptions/{id}` | GET/PUT/PATCH/DELETE | Manage a schedule exception. | `system_admin`. |
| `/api/attendance/admin/geofences` | GET/POST | Manage store geofences. | `system_admin`. |
| `/api/attendance/admin/geofences/{id}` | GET/PUT/PATCH/DELETE | Manage a geofence. | `system_admin`. |
| `/api/attendance/admin/payroll` | GET | List advisor payroll profiles. | `system_admin`. |
| `/api/attendance/admin/payroll/{user_id}` | PUT/PATCH | Upsert a payroll profile for an advisor. | `system_admin`. |

## Inventory

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/stock-ledgers/` | GET | List stock ledger entries. | `system_admin`. |
| `/api/stock-ledgers/{id}/` | GET | Retrieve a stock ledger. | `system_admin`. |
| `/api/stock-entries/` | GET/POST | List or create stock entries. | `system_admin`. |
| `/api/stock-entries/{id}/` | GET/PUT/PATCH/DELETE | Manage a stock entry. | `system_admin`. |
| `/api/serials/` | GET/POST | List or register serial numbers. | `system_admin`. |
| `/api/serials/{id}/` | GET/PUT/PATCH/DELETE | Manage a serial number. | `system_admin`. |
| `/api/price-logs/` | GET | List price change logs. | `system_admin`. |
| `/api/price-logs/{id}/` | GET | Retrieve a price change log. | `system_admin`. |
| `/api/inventory-config/` | GET/PUT | View or update global inventory configuration. | `system_admin`. |

## Invoicing

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/invoices/` | GET/POST | List or create invoices. | `system_admin`. |
| `/api/invoices/{id}/` | GET/PUT/PATCH/DELETE | Manage an invoice. | `system_admin`. |
| `/api/payments/` | GET/POST | List or create payment records. | `system_admin`. |
| `/api/payments/{id}/` | GET/PUT/PATCH/DELETE | Manage a payment record. | `system_admin`. |

## Activity Logs

| Path | Methods | Description | Permissions |
| --- | --- | --- | --- |
| `/api/logs/` | GET | List system activity logs with filters. | `system_admin`. |
| `/api/logs/{id}/` | GET | Retrieve an individual log entry. | `system_admin`. |
| `/api/logs/export/` | GET | Export logs as CSV or JSON via `format` query. | `system_admin`. |

## Agent Hooks

Coordinator-managed agents expose callbacks under `/agents/<name>/hooks`. See
`AGENTS.md` for hook payload expectations.
