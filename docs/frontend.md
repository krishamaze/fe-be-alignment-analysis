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
- Bookings page requires login, enforces issue selection, shows inline success messaging, and maintains captcha + throttling for spam protection.
- Index page fetches brand data from `/api/marketing/brands/` with loading, error, and empty states.
- Stores list and details consume `/api/stores` with read-only UI and consistent loading/error/empty states.

## SEO & Performance Notes

- SEO tags verified via page source inspection.
- SEO tests cover About, Brands, Stores, Store details, Spares, and Bookings pages.
- TODO: run Lighthouse to confirm performance within ±10% of legacy baseline.

## Dependencies & Blockers

- Requires `VITE_RECAPTCHA_SITE_KEY` and backend `RECAPTCHA_SECRET_KEY` for captcha.
- Backend exposes `/api/marketing/contact/`, `/api/marketing/schedule-call/`, and `/api/bookings` endpoints with throttling.
 
### Bookings & Invoices

![Invoice and payment workflow](assets/invoice-payment.png)

TODO: capture real screenshot of invoice/payment UI from the dashboards.

## Invoicing & Payments

- Added `InvoicesDashboard.jsx` and `PaymentsDashboard.jsx` for system admins.
- `BookingsDashboard.jsx` now links to invoice creation and displays related invoices and payments.
- New components: `InvoiceForm`, `ReceiptForm`, `InvoiceTable`, `PaymentsTable`.
- API layer exposes `/api/invoices`, `/api/payments`, and `/api/invoices/:id/pdf`.
- PDF export renders a branded, GST-compliant invoice template.

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

> TODO: Replace screenshots after capturing from the deployed UI.
