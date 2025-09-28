# Frontend Guide

This guide complements the [`Frontend Route Reference`](reference/FRONTEND_ROUTES.md)
with additional context on layouts, state management, and guard patterns.

## Routing Overview

- **Public marketing shell** – rendered through `PublicLayout` and covers
  marketing, ecommerce, and support flows (`/`, `/shop`, `/legal`, `/contact`,
  `/schedule-call`, etc.).
- **Customer auth** – `/login`, `/signup`, `/account`, and `/orders` use the same
  JWT tokens issued by the backend. Protected pages redirect to `/login` when the
  token selector is empty.
- **Focused workflows** – `/workledger/*` and `/giveaway-redemption` run inside
  `FocusLayout` to present distraction-free tools for advisors and managers.
- **Admin dashboard** – `/dashboard` hydrates `DashboardLayout` and exposes
  nested routes for brands, stores, catalog, bookings, repairs, settings, and
  logs. All nested routes require the `system_admin` role.

## RTK Query Data Layer

All CRUD flows integrate with the central API slice defined in
`src/api/erpApi.js`. The slice wraps a re-authenticating `baseQueryWithReauth`
and exposes generated hooks such as:

- `useGetBrandsQuery` / `useCreateBrandMutation`
- `useGetBookingsQuery` / `useUpdateBookingMutation`
- `useGetStockLedgersQuery`

Shop filters, dashboards, and modals subscribe to the same cache so invalidation
is handled automatically. When adding a new endpoint, extend the existing
`erpApi` slice instead of creating bespoke fetch logic to avoid duplicated cache
state.

## Forms & External Services

- Contact and schedule call forms mutate
  `/api/marketing/contact/` and `/api/marketing/schedule-call/` respectively.
- reCAPTCHA interactions use `VITE_RECAPTCHA_SITE_KEY` via the
  `ReCaptchaWrapper` component; missing keys intentionally short-circuit the
  widget and log a console error to protect builds.

## Layout & Styling

- Layout components (`PublicLayout`, `FocusLayout`, `DashboardLayout`) own the
  grid and spacing primitives. Feature components should rely on these shells to
  avoid competing layout authorities.
- Tailwind utility classes back most styling. Shared variables live in
  `src/index.css` under the `:root` theme tokens.

## Related References

- [`Frontend Route Reference`](reference/FRONTEND_ROUTES.md)
- [`Backend API Routes Reference`](reference/BACKEND_API_ROUTES.md)
- [`Environment Key Reference`](reference/ENVIRONMENT_KEYS.md)
