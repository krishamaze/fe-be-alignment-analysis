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

## Deviations & Improvements

- Shared `Navbar` and `Footer` wrap all public pages.
- Added SEO metadata (title, description, OG tags) for each page.
- Contact and schedule-call forms use reCAPTCHA with client-side throttling.
- Cleaned up leftover debug text in `ScheduleCall.jsx` metadata setup.
- Index page fetches brand data from `/api/marketing/brands/` with loading, error, and empty states.

## SEO & Performance Notes

- SEO tags verified via page source inspection.
- TODO: run Lighthouse to confirm performance within ±10% of legacy baseline.

## Dependencies & Blockers

- Requires `VITE_RECAPTCHA_SITE_KEY` environment variable for form captcha.
- Backend must expose `/api/marketing/contact/` and `/api/marketing/schedule-call/` endpoints.
- TODO: server-side throttling configuration for public forms.
