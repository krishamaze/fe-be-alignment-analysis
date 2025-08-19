# Integration Contract

## Base URL & versioning
- Production: `https://api.finetune.store/api/`
- No explicit versioning; breaking changes bump major app version.

## Auth
- `Authorization: Bearer <access-token>` header using JWT.
- `refresh` tokens rotated via `POST /api/token/refresh`.

## Pagination
Lists use Spring-style objects:
```json
{
  "content": [],
  "pageable": {"pageNumber": 0, "pageSize": 10},
  "totalElements": 0,
  "totalPages": 0,
  "last": true,
  "first": true,
  "numberOfElements": 0,
  "empty": true
}
```
`page` query param is 0‑based; `size` controls page size.

## Date & time
All dates/times are ISO‑8601 strings in `Asia/Kolkata` timezone.

## Idempotency
Set `Idempotency-Key` header on write requests under `attendance/admin/*` to safely retry.

## Error format
```json
{"detail": "message"}
```
Validation errors return field keyed details.

## RTK Query mapping
| Feature | Endpoint |
|---|---|
| System admin list users | `GET /api/users` |
| Assign branch head | `POST /api/stores/{id}/assign-branch-head` |
| Advisor check-in | `POST /api/attendance/check-in` |
| Advisor daily status | `GET /api/attendance/me/today` |
| Workledger bootstrap | `GET /api/auth/me` |
