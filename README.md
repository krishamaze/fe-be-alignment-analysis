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

High-level component interactions are documented in [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). The API surface is described in [docs/API_GUIDE.md](docs/API_GUIDE.md).

## Agent Deployment

Agents are defined in `AGENTS.md`. To deploy one:

```bash
python scripts/deploy_agent.py <agent_name>
```

The script builds the agent image, registers it with the coordinator, and performs health checks.

## Contributing

1. Fork the repository and create a local branch.
2. Run `pytest` and `pnpm test` before submitting.
3. Open a pull request following the template in `AGENTS.md`.

Start with `CONTEXT.md` for architecture guidance and `FILEMAP.md` to navigate the codebase.

