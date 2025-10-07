# Security Guide

This guide outlines security practices, policies, and vulnerability reporting procedures for the Finetune ERP platform.

## Vulnerability Reporting

Report vulnerabilities by opening a private issue or emailing the maintainers.

## Security Policy

- Supported on latest main branch; security fixes are released as needed.
- Rotate JWT signing `SECRET_KEY` only during maintenance windows.
- Always serve the frontend over HTTPS in production environments.

## Backend Security

### Authentication & Authorization

- Login attempts are throttled at 5/min per IP to prevent brute force attacks.
- Refresh tokens rotate and are blacklisted after use to prevent token reuse.
- Admin endpoints require `system_admin` role and should be protected behind HTTPS.

### Audit Logs

- Audit logs can be exported by system admins at `/api/logs/export/`.
- All sensitive operations are logged through the `activity` app for compliance.

### CORS Configuration

- CORS is currently wide (`CORS_ALLOW_ALL_ORIGINS=True`); tighten in sensitive deployments.
- Production environments should use explicit `CORS_ALLOWED_ORIGINS` list.

## Frontend Security

### HTTPS Requirements

- Always serve the frontend over HTTPS in production.
- Ensure API endpoints use HTTPS to prevent man-in-the-middle attacks.

### Token Storage

- Tokens are stored in HTTP-only cookies; avoid localStorage for credentials.
- Cookie security flags (`secure`, `sameSite`) are enforced in production.

### Content Security Policy

- A Content Security Policy limits scripts to same-origin assets.
- Avoid inline scripts; use component props for dynamic content.

### Dependency Auditing

- Run `pnpm audit` routinely to check dependency health.
- Keep dependencies up-to-date with security patches.

## Related Documentation

- [Authentication Guide](AUTHENTICATION.md) – Authentication and authorization details
- [Environment Keys Reference](reference/ENVIRONMENT_KEYS.md) – Secure configuration management
- [Deployment Guide](DEPLOYMENT.md) – Secure deployment practices

