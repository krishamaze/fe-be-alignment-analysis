# Security Headers

The backend now sends several HTTP headers to harden the application.

## Enabled Headers
- `X-Frame-Options: DENY` – prevents clickjacking.
- `X-Content-Type-Options: nosniff` – stops MIME sniffing.
- `X-XSS-Protection: 1; mode=block` – legacy XSS filter for older browsers.
- `Referrer-Policy: same-origin` – limits referrer information.
- `Cross-Origin-Opener-Policy: same-origin` – isolates browsing contexts.
- `Content-Security-Policy` – restricts external resources without
  `unsafe-inline` and blocks untrusted embeddings. Violations can report via
  `CSP_REPORT_URI`.

### CSP Directives
```
default-src 'self';
style-src 'self';
script-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
img-src 'self' data: https:;
font-src 'self' data:;
connect-src 'self';
```

## Validation Commands
Run the server and inspect headers:

```bash
python manage.py runserver &
curl -I http://localhost:8000/api/spares \
  | grep -E 'Content-Security-Policy|X-Frame-Options|X-Content-Type-Options|X-XSS-Protection|Referrer-Policy|Cross-Origin-Opener-Policy'
```
