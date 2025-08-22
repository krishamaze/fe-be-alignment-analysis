# Stores API Integration Contract

## Endpoints

### List Stores
- **URL:** `/api/stores`
- **Method:** `GET`
- **Auth:** Required; non-`system_admin` users have read-only access.
- **Response:**
  ```json
  {
    "content": [
      {
        "id": 1,
        "store_name": "Sample Store",
        "code": "ST001",
        "address": "123 Main St",
        "branch_head_name": "Jane Doe",
        "branch_head_email": "jane@example.com"
      }
    ]
  }
  ```

### Retrieve Store
- **URL:** `/api/stores/{id}`
- **Method:** `GET`
- **Auth:** Required; non-`system_admin` users have read-only access.
- **Response:**
  ```json
  {
    "id": 1,
    "store_name": "Sample Store",
    "code": "ST001",
    "address": "123 Main St",
    "branch_head_name": "Jane Doe",
    "branch_head_email": "jane@example.com"
  }
  ```

## Notes
- Write operations (`POST`, `PUT`, `PATCH`, `DELETE`) are restricted to users with the `system_admin` role per `IsSystemAdminOrReadOnly`.
- TODO: document pagination query parameters when backend stabilizes.
