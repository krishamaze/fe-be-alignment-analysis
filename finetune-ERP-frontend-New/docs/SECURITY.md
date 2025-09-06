# Security

Report vulnerabilities by opening a private issue or emailing the maintainers.

## Policy
- Supported on latest main branch; security fixes are released as needed.
- Always serve the frontend over HTTPS.

## Notes
- Tokens are stored in HTTP-only cookies; avoid localStorage for credentials.
- A Content Security Policy limits scripts to same-origin assets.
- Run `pnpm audit` routinely to check dependency health.
- Avoid inline scripts; use component props for dynamic content.

## Related Guides
- [Backend Security](../../finetune-ERP-backend-New/docs/SECURITY.md)
- [Integration Contract](../../docs/contracts/INTEGRATION_CONTRACT.md)
