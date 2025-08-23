# Public Pages Migration Report

## Migrated Templates

| Legacy Template | React Page |
|-----------------|------------|
| `serviceapp/index.html` | `src/pages/Index.jsx` |
| `serviceapp/about.html` | `src/pages/About.jsx` |
| `serviceapp/contact.html` | `src/pages/Contact.jsx` |
| `serviceapp/terms.html` | `src/pages/Terms.jsx` |
| `serviceapp/locate.html` | `src/pages/Locate.jsx` |
| — (new) | `src/pages/ScheduleCall.jsx` |
| `serviceapp/auth/store.html` | `src/pages/Stores.jsx`, `src/pages/StoreDetails.jsx` |
| `serviceapp/auth/pricemaintanence.html` | `src/pages/Spares.jsx` |
| `serviceapp/auth/bookingsView.html` | `src/pages/Bookings.jsx` |


## Deviations & Improvements

- Shared `Navbar` and `Footer` wrap all public pages.
- Added SEO metadata (title, description, OG tags) for each page.
- Contact, schedule-call, and booking forms use reCAPTCHA with server-side verification and DRF throttling.
- Cleaned up leftover debug text in `ScheduleCall.jsx` metadata setup.
- Spares page manages pricing via `/api/spares` with form submission for admins.
- Bookings page allows public service bookings with success/error states and spam protection.
- Index page fetches brand data from `/api/marketing/brands/` with loading, error, and empty states.
- Stores list and details consume `/api/stores` with read-only UI and consistent loading/error/empty states.

## SEO & Performance Notes

- SEO tags verified via page source inspection.
- SEO tests cover About, Brands, Stores, Store details, Spares, and Bookings pages.
- TODO: run Lighthouse to confirm performance within ±10% of legacy baseline.

## Dependencies & Blockers

- Requires `VITE_RECAPTCHA_SITE_KEY` and backend `RECAPTCHA_SECRET_KEY` for captcha.
- Backend exposes `/api/marketing/contact/`, `/api/marketing/schedule-call/`, and `/api/bookings` endpoints with throttling.
