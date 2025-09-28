# Continuous Integration Guide

This project uses GitHub Actions to enforce quality gates on every pull request.

## Linting & Formatting

- **ESLint** checks the frontend source via `pnpm --prefix finetune-ERP-frontend-New run lint`.
- **Prettier** ensures consistent formatting. Run `prettier . --write` to fix issues and `pnpm --prefix finetune-ERP-frontend-New run format:check` to verify.
- **Black** formats Python code in the backend. Run `black .` to auto-fix and `black . --check` in CI.
- If formatting fails locally, rerun the appropriate formatter and commit the changes.

## Testing

- Frontend unit tests run with `pnpm --prefix finetune-ERP-frontend-New test` (Vitest).
- Backend tests run with `pytest`.
- SEO tests rely on React 19 `<title>` and `<meta>` tags for titles and descriptions. Updating page metadata often requires regenerating snapshots via `pnpm --prefix finetune-ERP-frontend-New test -- --update`.

## Lighthouse

- A smoke audit runs `lhci autorun` against `/`, `/about/`, and `/dashboard` for every PR.
- The audit step is marked `continue-on-error` so warnings do not block merges.
- Full Lighthouse audits can be scheduled separately if needed.

## Merge Expectations

Pull requests are expected to pass linting and testing jobs. Lighthouse results are advisory and do not block merges.

## Known Issues

No outstanding CI issues.

## Related Guides
- [Test Guide](../TEST_GUIDE.md)
