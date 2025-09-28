# Context

Finetune ERP follows an iterative, test-driven workflow where features begin as design docs and move through prototype branches before merging to `main` after review.

## Development Methodology

- **Agile sprints** with weekly demos
- **TDD** across Django services and React components
- **Code review** for every merge

## Tech Stack Decisions

- **Backend**: Django REST Framework
- **Frontend**: React + Vite
- **Background services**: Django management commands and scheduled jobs that deliver notifications and attendance rollups

## Iteration Workflow

1. Open an issue describing the change.
2. Draft a design in `/docs/how-to`.
3. Implement with tests in a feature branch.
4. Submit a PR referencing the issue.

## Architectural Principles

- Single-responsibility components
- Shared utilities in `/docs/how-to` and `/finetune-ERP-backend-New/utils`
- Reuse existing CSS variables and helpers before adding new ones

## Troubleshooting

- **Migrations**: run `python manage.py migrate` after pulling.
- **Vite**: clear cache with `pnpm clean` if dev server fails.
- **Notifications**: review management command logs when emails or SMS notifications fail to send.

Common patterns live in `docs/known-issues`.

