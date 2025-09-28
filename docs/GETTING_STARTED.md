# Getting Started Tutorial

This tutorial walks a new contributor from cloning the monorepo to running both the Django API and the React frontend locally.

## Prerequisites

| Tool | Recommended Version | Notes |
| :--- | :------------------ | :---- |
| Python | 3.11+ | Matches the `requires-python` constraint in `pyproject.toml`. |
| Node.js | 20 LTS | Provides the baseline for Vite 6 and pnpm. |
| pnpm | 9.x (`corepack enable pnpm`) | pnpm drives the frontend workspace. |

> [!NOTE]
> The backend ships with SQLite defaults so you can complete this tutorial without provisioning PostgreSQL.

## 1. Clone and bootstrap the workspace

- [ ] Clone the repository and switch into the project root.
- [ ] Copy `env.example` to `.env` and adjust secrets for your machine.
- [ ] Create a virtual environment and install the backend extras.

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e .[backend,dev,test]
cp env.example .env
```

## 2. Prepare the Django API

- [ ] Apply database migrations.
- [ ] Create a superuser for the admin dashboard.
- [ ] Launch the development server.

```bash
cd finetune-ERP-backend-New
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver 0.0.0.0:8000
```

> [!NOTE]
> The settings module reads `.env` automatically via `python-dotenv`. You can override environment keys listed in the [Environment Key Reference](reference/ENVIRONMENT_KEYS.md) as needed.

## 3. Install and run the React frontend

- [ ] Install dependencies with pnpm.
- [ ] Start the Vite dev server pointed at the local API.

```bash
pnpm install --dir finetune-ERP-frontend-New
pnpm --dir finetune-ERP-frontend-New dev -- --host
```

When prompted, open http://localhost:5173/ and sign in with the Django credentials you created earlier.

## 4. Smoke-test the integration

- [ ] Visit `/dashboard` to verify authenticated routing.
- [ ] Submit a booking from `/bookings` and confirm it appears in the admin table.
- [ ] Inspect the REST surface using [Backend API Routes Reference](reference/API_ROUTES.md) and confirm responses via `curl`.

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "<email>", "password": "<password>"}'
```

A successful onboarding should take less than 15 minutes end-to-end. Keep the [Developer Guide](DEVELOPER_GUIDE.md) handy for day-to-day workflows once your environment is running.
