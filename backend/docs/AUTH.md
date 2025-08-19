# Authentication & Authorization

The API uses JSON Web Tokens via `rest_framework_simplejwt`.

## JWT flow
1. **Login** – `POST /api/auth/login` with `username` and `password` returns `access` (60 min) and `refresh` (7 days) tokens.
2. **Refresh** – `POST /api/token/refresh` with a refresh token rotates it and issues a new pair.
3. **Verify** – `POST /api/token/verify` checks if a token is valid.
4. **Logout** – `POST /api/auth/logout` blacklists a refresh token.

Tokens are sent in the `Authorization: Bearer <access>` header.

## Roles
`CustomUser.role` defines project roles:
- **system_admin** – full control.
- **branch_head** – manage advisors within their store.
- **advisor** – self-service attendance.

## Examples
```bash
# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","password":"pw"}'

# Refresh
curl -X POST http://localhost:8000/api/token/refresh \
  -H 'Content-Type: application/json' \
  -d '{"refresh":"<refresh>"}'

# Authenticated request
curl http://localhost:8000/api/attendance/me/today \
  -H 'Authorization: Bearer <access>'

# Current user profile
curl http://localhost:8000/api/auth/me \
  -H 'Authorization: Bearer <access>'
```
