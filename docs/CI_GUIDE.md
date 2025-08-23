# Continuous Integration Guide

This project uses GitHub Actions to enforce quality gates on every pull request.

## Linting & Formatting

- **ESLint** checks the frontend source via `npm run lint`.
- **Prettier** ensures consistent formatting. Run `prettier . --write` to fix issues and `npm run format:check` to verify.
- **Black** formats Python code in the backend. Run `black .` to auto-fix and `black . --check` in CI.
- If formatting fails locally, rerun the appropriate formatter and commit the changes.

## Testing

- Frontend unit tests run with `npm test` (Vitest).
- Backend tests run with `pytest`.
- SEO tests rely on `<Helmet>` tags for titles and descriptions. Updating page metadata often requires regenerating snapshots via `npm test -u`.

## Lighthouse

- A smoke audit runs `lhci autorun` against `/`, `/about/`, and `/dashboard` for every PR.
- The audit step is marked `continue-on-error` so warnings do not block merges.
- Full Lighthouse audits can be scheduled separately if needed.

## Merge Expectations

Pull requests are expected to pass linting and testing jobs. Lighthouse results are advisory and do not block merges.

## Known Issues

- React 19 with `react-helmet-async` emits a peer dependency warning. The warning is safe to ignore until upstream fixes land.
