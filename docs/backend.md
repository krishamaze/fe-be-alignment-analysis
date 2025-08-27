# Backend Invoicing & Payments

## Models
- **Invoice** – tracks billing for a booking with GST breakdown and status.
- **InvoiceLineItem** – description, HSN code, qty and pricing per invoice.
- **PaymentRecord** – records payments against an invoice (cash/card/upi/emi).

## API Endpoints
- `POST /api/invoices/` create invoice with nested `line_items`.
- `GET /api/invoices/` list invoices.
- `GET /api/invoices/:id/pdf/` render invoice PDF.
- `POST /api/payments/` record a payment for an invoice.

Invoice numbers use a global sequence `FT-INV-0001` stored in the database and only reset if the `InvoiceSequence` record is cleared.

## Inventory

Models:
- **InventoryConfig** – per-category flags for serial tracking, price logging and stock-in approvals.
- **StockLedger** – quantity of each variant per store.
- **StockEntry** – records stock movements like purchase or sale.
- **SerialNumber** – optional IMEI/serial tracking for variants.
- **PriceLog** – history of variant price changes.

API:
- `GET /api/stock-ledgers/` list store-level quantities.
- `GET /api/stock-ledgers/rollup/` aggregate quantities across stores.
- `POST /api/stock-entries/` create a stock movement.
- `GET /api/serials/` list tracked serial numbers.
- `GET /api/price-logs/` view price change history.
- `GET /api/inventory-config/` configure tracking flags.
