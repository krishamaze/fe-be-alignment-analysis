# Public Pages Migration Report

## Migrated Templates

| Legacy Template                         | React Page                                           |
| --------------------------------------- | ---------------------------------------------------- |
| `serviceapp/index.html`                 | `src/pages/Index.jsx`                                |
| `serviceapp/about.html`                 | `src/pages/About.jsx`                                |
| `serviceapp/contact.html`               | `src/pages/Contact.jsx`                              |
| `serviceapp/terms.html`                 | `src/pages/Terms.jsx`                                |
| `serviceapp/locate.html`                | `src/pages/Locate.jsx`                               |
| — (new)                                 | `src/pages/ScheduleCall.jsx`                         |
| `serviceapp/auth/store.html`            | `src/pages/Stores.jsx`, `src/pages/StoreDetails.jsx` |
| `serviceapp/auth/pricemaintanence.html` | `src/pages/Spares.jsx`                               |
| `serviceapp/auth/bookingsView.html`     | `src/pages/Bookings.jsx`                             |

## Deviations & Improvements

- Shared `PublicLayout` wraps all public pages with header, footer, and mobile bottom navigation.
- Added SEO metadata (title, description, OG tags) for each page.
- Contact, schedule-call, and booking forms use reCAPTCHA with server-side verification and DRF throttling.
- Cleaned up leftover debug text in `ScheduleCall.jsx` metadata setup.
- Spares page manages pricing via `/api/spares` with form submission for admins.
- Bookings page requires login, enforces issue selection, shows inline success messaging, and maintains captcha + throttling for spam protection.
- Index page fetches brand data from `/api/marketing/brands/` with loading, error, and empty states.
- Index page features `CustomerTestimonials` showcasing recent reviews, mobile-friendly horizontal scrolling, hover animations, and a link to Google reviews.
- Stores list and details consume `/api/stores` with read-only UI and consistent loading/error/empty states.

## SEO & Performance Notes

- SEO tags verified via page source inspection.
- SEO tests cover About, Brands, Stores, Store details, Spares, and Bookings pages.
- Lighthouse audits planned post-launch.

## Dependencies & Blockers

- Requires `VITE_RECAPTCHA_SITE_KEY` and backend `RECAPTCHA_SECRET_KEY` for captcha.
- Backend exposes `/api/marketing/contact/`, `/api/marketing/schedule-call/`, and `/api/bookings` endpoints with throttling.

### Bookings & Invoices

![Invoice and payment workflow](assets/invoice-payment.png)

## Invoicing & Payments

- Added `InvoicesDashboard.jsx` and `PaymentsDashboard.jsx` for system admins.
- `BookingsDashboard.jsx` now links to invoice creation and displays related invoices and payments.
- New components: `InvoiceForm`, `ReceiptForm`, `InvoiceTable`, `PaymentsTable`.
- API layer exposes `/api/invoices` and `/api/payments`.
- PDF export is disabled until system libraries are installed on Railway.

## Inventory

- New `InventoryDashboard.jsx` displays store stock levels and serials.
- Components: `StockEntryForm`, `SaleEntryForm`, `SerialManager`, `SerialTable`, `StockTable`, `PriceLogView`, `ConfigDashboard`.
- RTK Query endpoints cover ledgers, stock entries, serials, price logs and config.

![Inventory dashboard screenshot](assets/inventory-dashboard.png)
![Serial manager screenshot](assets/serial-manager.png)
![Booking sale entry screenshot](assets/booking-sale-entry.png)

### Usage

- **Staff sale flow:** open a booking in BookingsDashboard and submit the embedded sale form; required serial numbers must be entered when the category enables tracking.
- **BranchHead purchase/return:** use InventoryDashboard to post stock-in or return entries for a store.
- **Global roll-up:** visit the ledger roll-up view to see total quantities across stores.

## Deployment

Frontend is deployed on Vercel and uses the backend API at `https://api.finetune.store` hosted on Railway.

## Roadmap

Planned for v1.1:

- Invoice PDF generation
- Lighthouse performance checks
- Updated UI screenshots
- Expanded deployment matrix
