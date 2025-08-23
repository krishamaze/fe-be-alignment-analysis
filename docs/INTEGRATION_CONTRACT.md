# Public API Integration Contract

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

### List Spares
- **URL:** `/api/spares`
- **Method:** `GET`
- **Auth:** Required; non-`system_admin` users have read-only access.
- **Response:**
  ```json
  {
    "content": [
      { "id": 1, "name": "Wheel", "sku": "WH1", "price": "10.00", "is_active": true }
    ]
  }
  ```

### Create Spare
- **URL:** `/api/spares`
- **Method:** `POST`
- **Auth:** `system_admin` only
- **Body:** `{ "name": string, "sku": string, "price": number }`
- **Response:** `201 Created` with `{ "id": number, "name": string, "sku": string, "price": string, "is_active": boolean }`
- **Errors:** `401` if unauthenticated, `403` if unauthorized
### Submit Contact Request
- **URL:** `/api/marketing/contact/`
- **Method:** `POST`
- **Auth:** None
- **Body:** `{ "name": string, "mobile_no": string?, "message": string?, "captcha_token": string }`
- **Response:** `201 Created` with `{ "id": number, "name": string, "mobile_no": string, "message": string }`
- **Errors:** `400` for invalid captcha, `429` if rate limited

### Submit Schedule Call
- **URL:** `/api/marketing/schedule-call/`
- **Method:** `POST`
- **Auth:** None
- **Body:** `{ "name": string, "date": YYYY-MM-DD, "time": HH:MM, "message": string?, "captcha_token": string }`
- **Response:** `201 Created` with `{ "id": number, "name": string, "date": string, "time": string, "message": string }`
- **Errors:** `400` for invalid captcha, `429` if rate limited

## Notes
- Write operations (`POST`, `PUT`, `PATCH`, `DELETE`) are restricted to users with the `system_admin` role per `IsSystemAdminOrReadOnly`.
- TODO: document pagination query parameters when backend stabilizes.
- Contact and schedule-call forms require a valid reCAPTCHA token and are throttled at 5 requests/hour per IP.
