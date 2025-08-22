# Integration Contract

## API

- **Base URL**: `https://finetunetechcrafterp-dev.up.railway.app`
- **Headers**: `Authorization: Bearer <access_token>`, `Content-Type: application/json`
- **Error format**: `{ "message": string }` or `{ "detail": string }`

## Feature mapping

| Feature | Frontend call | Backend path |
|---------|---------------|--------------|
| User listing | `getUsers` | `GET /api/users` |
| User create/update/delete | `createUser` / `updateUser` / `softDeleteUser` | `POST/PUT/DELETE /api/users` |
| Assign store to user | `assignStoreToUser` | `PATCH /api/users/:id` |
| Store listing | `getStores` | `GET /api/stores` |
| Store create/update/delete | `createStore` / `updateStore` / `softDeleteStore` | `POST/PUT/DELETE /api/stores` |
| Branch head assignment | `assignBranchHeadToStore` / `unassignBranchHeadFromStore` | `POST /api/stores/:id/assign-branch-head` |
| Auth login | `loginUser` (auth slice) | `POST /api/auth/login` (returns tokens and user info) |
| Token refresh | auto refresh | `POST /api/token/refresh` |
| Contact form | axios post | `POST /api/marketing/contact/` |
| Schedule call form | axios post | `POST /api/marketing/schedule-call/` |

## Deprecation policy

_TODO: document how deprecated endpoints will be communicated and sunset._
