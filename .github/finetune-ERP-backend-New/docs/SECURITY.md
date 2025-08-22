# Security

Report vulnerabilities by opening a private issue or emailing the maintainers.

## Policy
- Supported on latest main branch; security fixes are released as needed.
- Rotate JWT signing `SECRET_KEY` only during maintenance windows.

## Notes
- No request throttling is configured; consider enabling DRF throttling in production.
- CORS is wide (`CORS_ALLOW_ALL_ORIGINS=True`); tighten in sensitive deployments.
- Admin endpoints require `system_admin` role and should be protected behind HTTPS.
