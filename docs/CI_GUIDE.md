# Continuous Integration Guide

This project uses GitHub Actions to enforce quality gates on every pull request.

## Linting & Formatting

- **ESLint** checks the frontend source via `npm run lint`.
- **Prettier** ensures consistent formatting. An auto-fix job runs `npm run format` and commits any changes. The lint job verifies with `npm run format:check`.
- **Black** formats Python code in the backend. The auto-fix job runs `black .` and commits fixes, while the lint job runs `black . --check`.

## Testing

- Frontend unit tests run with `npm test` (Vitest).
- Backend tests run with `pytest`.

## Lighthouse

- A smoke audit runs `lhci autorun` against `/`, `/about/`, and `/dashboard` for every PR.
- The audit step is marked `continue-on-error` so warnings do not block merges.
- Full Lighthouse audits can be scheduled separately if needed.

## Merge Expectations

Pull requests are expected to pass linting and testing jobs. Lighthouse results are advisory and do not block merges.
