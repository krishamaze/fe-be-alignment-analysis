# finetune.os

finetune.os is an experimental AI operating system that orchestrates modular agents to automate full-stack workflows. This repository includes all code and configuration required to run and extend the platform.

## Quick Start

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd finetune.os
   pip install -e .[backend,dev,test]
   pnpm install --prefix finetune-ERP-frontend-New
   ```
2. **Environment**
   ```bash
   cp env.example .env
   # edit variables for your setup
   ```
3. **Run Services**
   ```bash
   python finetune-ERP-backend-New/manage.py runserver
   pnpm --prefix finetune-ERP-frontend-New dev
   ```

## Architecture

High-level component interactions are documented in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). For a hands-on walkthrough use [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) and keep the [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) open for daily workflows. Generated references in `docs/reference/` stay in sync with the codebase via `scripts/generate_references.py`.

## Agent Deployment

Agents are defined in `AGENTS.md`. Use the coordinator utilities and deployment notes in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md#agent-ecosystem) when rolling out new workers.

## Contributing

1. Fork the repository and create a local branch.
2. Run `pytest finetune-ERP-backend-New/tests -q` and `pnpm --dir finetune-ERP-frontend-New test` before submitting.
3. Open a pull request following the template in `AGENTS.md` and include regenerated references when routes or settings change.

Start with `CONTEXT.md` for architecture guidance and `FILEMAP.md` to navigate the codebase.

