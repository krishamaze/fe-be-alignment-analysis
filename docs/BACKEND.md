# Backend Invoicing & Payments

## Models
- **Invoice** – tracks billing for a booking with GST breakdown and status.
- **InvoiceLineItem** – description, HSN code, qty and pricing per invoice.
- **PaymentRecord** – records payments against an invoice (cash/card/upi/emi).

## API Endpoints
- `POST /api/invoices/` create invoice with nested `line_items`.
- `GET /api/invoices/` list invoices.
- `POST /api/payments/` record a payment for an invoice.

Invoice numbers use a global sequence `FT-INV-0001` stored in the database and only reset if the `InvoiceSequence` record is cleared.

Invoice PDF generation is currently disabled pending system libraries on Railway.

## Inventory

Models:
- **InventoryConfig** – per-category flags for serial tracking, price logging and stock-in approvals.
- **StockLedger** – quantity of each variant per store.
- **StockEntry** – records stock movements like purchase or sale.
- **SerialNumber** – optional IMEI/serial tracking for variants.
- **PriceLog** – history of variant price changes.
  Serial numbers are enforced on purchase and sale entries when the
  related category's `InventoryConfig.track_serials` flag is enabled.
  Sale entries must also reference a `booking`.

API:
- `GET /api/stock-ledgers/` list store-level quantities.
- `GET /api/stock-ledgers/rollup/` aggregate quantities across stores.
- `POST /api/stock-entries/` create a stock movement.
  Sale entries require a booking ID and, when serial tracking is on,
  a `serial_numbers` list matching the quantity.
- `GET /api/serials/` list tracked serial numbers.
- `GET /api/price-logs/` view price change history.
- `GET /api/inventory-config/` configure tracking flags.

## Deployment

Backend runs on Railway at `https://api.finetune.store`.

## Roadmap

Planned for v1.1:

- Invoice PDF generation
- Lighthouse performance checks
- Updated UI screenshots
- Expanded deployment matrix

## Related Guides
- [Backend Architecture](../finetune-ERP-backend-New/docs/ARCHITECTURE.md)
- [Integration Contract](contracts/INTEGRATION_CONTRACT.md)
