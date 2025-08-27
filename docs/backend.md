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
