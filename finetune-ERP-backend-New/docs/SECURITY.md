# Security

Report vulnerabilities by opening a private issue or emailing the maintainers.

## Policy
- Supported on latest main branch; security fixes are released as needed.
- Rotate JWT signing `SECRET_KEY` only during maintenance windows.

## Notes
- Login attempts are throttled at 5/min per IP.
- Refresh tokens rotate and are blacklisted after use.
- Audit logs can be exported by system admins at `/api/logs/export/`.
- CORS is wide (`CORS_ALLOW_ALL_ORIGINS=True`); tighten in sensitive deployments.
- Admin endpoints require `system_admin` role and should be protected behind HTTPS.

## Related Guides
- [Frontend Security](../../finetune-ERP-frontend-New/docs/SECURITY.md)
- [Integration Contract](../../docs/contracts/INTEGRATION_CONTRACT.md)
