# Finetune ERP

Finetune ERP is a repair shop management system that combines a Django REST API with a React frontend. It powers core operations for service businesses, including online booking, employee attendance tracking, inventory control, and invoice generation.

## Quick Start

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd <repo-directory>
   pip install -e .[backend,dev,test]
   pnpm install --prefix apps/frontend
   ```
2. **Environment**
   ```bash
   cp env.example .env
   # edit variables for your setup
   ```
3. **Run Services**
   ```bash
   # Option 1: Run both services with one command
   pnpm dev

   # Option 2: Run services separately
   python apps/backend/manage.py runserver
   pnpm --prefix apps/frontend dev
   ```

## Architecture

High-level component interactions are documented in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). For a hands-on walkthrough use [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) and keep the [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) open for daily workflows. Generated references in `docs/reference/` stay in sync with the codebase via `scripts/generate_references.py`.

## Core Capabilities

- **Customer bookings** – Collect repair requests online and route them to the internal dashboards for follow-up.
- **Attendance management** – Track technician check-ins, shifts, and payroll events with location-aware rules.
- **Inventory & spares** – Manage stock levels for parts, accessories, and serialized devices.
- **Invoicing & payments** – Generate customer invoices and record payment events for completed repairs.

## Contributing

1. Fork the repository and create a local branch.
2. Run `pnpm test` or individual tests: `pytest apps/backend/tests -q` and `pnpm --dir apps/frontend test` before submitting.
3. Open a pull request following the guidance in [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) and include regenerated references when routes or settings change.

## Repository Structure

| Path | Description |
| --- | --- |
| `README.md` | Project overview and developer onboarding |
| `env.example` | Sample environment variables |
| `apps/backend/` | Django REST backend |
| `apps/frontend/` | React + Vite frontend |
| `docs/` | Architecture guides, developer workflows, and auto-generated references |
| `tools/` | Development tools and scripts |
| `temp/` | Temporary files and assets (gitignored) |

For detailed development workflows, see [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md). For architectural context, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md).

