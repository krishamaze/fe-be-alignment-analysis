# Public API Integration Contract

## Endpoints

### List Brands
- **URL:** `/api/brands/`
- **Method:** `GET`
- **Auth:** None
- **Response:**
  ```json
  {
    "content": [ { "id": 1, "name": "Finetune" } ]
  }
  ```

### Create Brand
- **URL:** `/api/brands/`
- **Method:** `POST`
- **Auth:** `system_admin`
- **Body:** `name`, `logo`
- **Response:** `201 Created` with brand object

### List Stores
- **URL:** `/api/stores?store_type=BRANCH|HQ`
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
        "phone": "+1-234",
        "store_type": "BRANCH"
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
    "phone": "+1-234",
    "store_type": "HQ",
    "authority_name": "Jane Doe",
    "authority_email": "jane@example.com"
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
      {
        "id": 1,
        "name": "Wheel",
        "sku": "WH1",
        "quality_slug": "premium",
        "quality_name": "Premium",
        "is_active": true
      }
    ]
  }
  ```

### Create Spare
- **URL:** `/api/spares`
- **Method:** `POST`
- **Auth:** `system_admin` only
- **Body:** `{ "name": string, "sku": string, "price": number, "quality": number | null }`
- **Response:** `201 Created` with `{ "id": number, "name": string, "sku": string, "price": string, "quality": number | null, "quality_slug": string | null, "quality_name": string | null, "is_active": boolean }`
- **Errors:** `401` if unauthenticated, `403` if unauthorized

### List Units
- **URL:** `/api/units`
- **Method:** `GET`
- **Auth:** None
- **Response:** `{"content": [ { "id": 1, "name": "Piece", "slug": "piece" } ]}`

### Create Unit
- **URL:** `/api/units`
- **Method:** `POST`
- **Auth:** `system_admin`
- **Body:** `{ "name": string }`
- **Response:** `201 Created` with `{ "id": number, "name": string, "slug": string }`

### Update Unit
- **URL:** `/api/units/{slug}`
- **Method:** `PUT`
- **Auth:** `system_admin`
- **Body:** `{ "name": string }` (slug immutable)
- **Response:** `200 OK` with updated unit

### Delete Unit
- **URL:** `/api/units/{slug}`
- **Method:** `DELETE`
- **Auth:** `system_admin`
- **Response:** `204 No Content`

### List Qualities
- **URL:** `/api/qualities`
- **Method:** `GET`
- **Auth:** None
- **Response:** `{"content": [ { "id": 1, "name": "Premium", "slug": "premium" } ]}`

### Create Quality
- **URL:** `/api/qualities`
- **Method:** `POST`
- **Auth:** `system_admin`
- **Body:** `{ "name": string }`
- **Response:** `201 Created` with `{ "id": number, "name": string, "slug": string }`

### Update Quality
- **URL:** `/api/qualities/{slug}`
- **Method:** `PUT`
- **Auth:** `system_admin`
- **Body:** `{ "name": string }` (slug immutable)
- **Response:** `200 OK` with updated quality

### Delete Quality
- **URL:** `/api/qualities/{slug}`
- **Method:** `DELETE`
- **Auth:** `system_admin`
- **Response:** `204 No Content`

### List Departments
- **URL:** `/api/departments`
- **Method:** `GET`
- **Auth:** None
- **Response:** `{"content": [ { "id": 1, "name": "Electronics", "slug": "electronics" } ]}`

### Create Department
- **URL:** `/api/departments`
- **Method:** `POST`
- **Auth:** `system_admin`
- **Body:** `{ "name": string }`
- **Response:** `201 Created` with `{ "id": number, "name": string, "slug": string }`

### Update Department
- **URL:** `/api/departments/{slug}`
- **Method:** `PUT`
- **Auth:** `system_admin`
- **Body:** `{ "name": string }` (slug immutable)
- **Response:** `200 OK` with updated department

### Delete Department
- **URL:** `/api/departments/{slug}`
- **Method:** `DELETE`
- **Auth:** `system_admin`
- **Response:** `204 No Content`

### List Categories
- **URL:** `/api/categories`
- **Method:** `GET`
- **Auth:** None
- **Query Params:** `department` (department slug)
- **Response:** `{"content": [ { "id": 1, "name": "Phones", "slug": "phones" } ]}`

### Create Category
- **URL:** `/api/categories`
- **Method:** `POST`
- **Auth:** `system_admin`
- **Body:** `{ "name": string, "department": number }`
- **Response:** `201 Created` with `{ "id": number, "name": string, "slug": string, "department": number }`

### Update Category
- **URL:** `/api/categories/{slug}`
- **Method:** `PUT`
- **Auth:** `system_admin`
- **Body:** `{ "name": string, "department": number }` (slug immutable)
- **Response:** `200 OK` with updated category

### Delete Category
- **URL:** `/api/categories/{slug}`
- **Method:** `DELETE`
- **Auth:** `system_admin`
- **Response:** `204 No Content`

### List SubCategories
- **URL:** `/api/subcategories`
- **Method:** `GET`
- **Auth:** None
- **Query Params:** `category` (category slug)
- **Response:** `{"content": [ { "id": 1, "name": "Smartphones", "slug": "smartphones" } ]}`

### Create SubCategory
- **URL:** `/api/subcategories`
- **Method:** `POST`
- **Auth:** `system_admin`
- **Body:** `{ "name": string, "category": number }`
- **Response:** `201 Created` with `{ "id": number, "name": string, "slug": string, "category": number }`

### Update SubCategory
- **URL:** `/api/subcategories/{slug}`
- **Method:** `PUT`
- **Auth:** `system_admin`
- **Body:** `{ "name": string, "category": number }` (slug immutable)
- **Response:** `200 OK` with updated subcategory

### Delete SubCategory
- **URL:** `/api/subcategories/{slug}`
- **Method:** `DELETE`
- **Auth:** `system_admin`
- **Response:** `204 No Content`

### List Products
- **URL:** `/api/products`
- **Method:** `GET`
- **Auth:** None
- **Query Params:** `brand` (brand id), `availability` (true/false), `department`, `category`, `subcategory` (slugs)
- **Response:**
  ```json
  {
    "content": [
      {
        "id": 1,
        "name": "Phone",
        "brand": "Finetune",
        "slug": "phone",
        "price": "10.00",
        "unit_slug": "piece",
        "unit_name": "Piece",
        "availability": true,
        "subcategory_slug": "smartphones"
      }
    ]
  }
  ```

### Create Product
- **URL:** `/api/products`
- **Method:** `POST`
- **Auth:** `system_admin` only
- **Body:** `{ "name": string, "brand": number, "subcategory": number, "price": number, "stock": number, "availability": boolean, "unit": number | null }`
- **Response:** `201 Created` with `{ "id": number, "slug": string, ... }`
- **Errors:** `400` for validation (negative price, availability mismatch)

### Update Product
- **URL:** `/api/products/{slug}`
- **Method:** `PUT`
- **Auth:** `system_admin` only
- **Body:** same as create (slug immutable)
- **Response:** `200 OK`

### Delete Product
- **URL:** `/api/products/{slug}`
- **Method:** `DELETE`
- **Auth:** `system_admin` only
- **Response:** `204 No Content`

### Retrieve Product
- **URL:** `/api/products/{slug}`
- **Method:** `GET`
- **Auth:** None
- **Response:**
  ```json
  { "id": 1, "name": "Phone", "brand": "Finetune", "slug": "phone", "price": "10.00", "availability": true, "category": "Phones" }
  ```

### Create Variant
- **URL:** `/api/variants`
- **Method:** `POST`
- **Auth:** `system_admin` only
- **Body:** `{ "product": string(slug), "variant_name": string, "price": number, "stock": number, "availability": boolean }`
- **Response:** `201 Created` with `{ "id": number, "slug": string, ... }`

### Update Variant
- **URL:** `/api/variants/{slug}`
- **Method:** `PUT`
- **Auth:** `system_admin` only
- **Body:** same as create (slug immutable)
- **Response:** `200 OK`

### Delete Variant
- **URL:** `/api/variants/{slug}`
- **Method:** `DELETE`
- **Auth:** `system_admin` only
- **Response:** `204 No Content`

### List Variants
- **URL:** `/api/variants`
- **Method:** `GET`
- **Auth:** None
- **Query Params:** `product` (product slug)
- **Response:**
  ```json
  {
    "content": [
      { "id": 1, "product": "phone", "variant_name": "64GB", "slug": "phone-64gb", "price": "5.00", "availability": true }
    ]
  }
  ```

### Retrieve Variant
- **URL:** `/api/variants/{slug}`
- **Method:** `GET`
- **Auth:** None
- **Response:**
  ```json
  { "id": 1, "product": "phone", "variant_name": "64GB", "slug": "phone-64gb", "price": "5.00", "availability": true }
  ```


### List Bookings
- **URL:** `/api/bookings`
- **Method:** `GET`
- **Auth:** `system_admin` only
- **Response:**
  ```json
  {
    "content": [
      { "id": 1, "name": "John", "email": "j@example.com", "issue": "screen", "date": "2024-01-01", "time": "10:00", "message": "hi", "status": "pending" }
    ]
  }
  ```

### Retrieve Booking
- **URL:** `/api/bookings/{id}`
- **Method:** `GET`
- **Auth:** `system_admin` only
- **Response:**
  ```json
  { "id": 1, "name": "John", "email": "j@example.com", "issue": "screen", "date": "2024-01-01", "time": "10:00", "message": "hi", "status": "pending" }
  ```

### Create Booking
- **URL:** `/api/bookings`
- **Method:** `POST`
- **Auth:** None
- **Body:** `{ "name": string, "email": string?, "issue": string, "date": YYYY-MM-DD, "time": HH:MM, "message": string?, "address": string?, "remarks": string?, "captcha_token": string }`
- **Response:** `201 Created` with `{ "id": number, "name": string, "email": string, "issue": string, "date": string, "time": string, "message": string, "status": string }`
- **Errors:** `400` for invalid captcha, `429` if rate limited`
#### Booking lifecycle
```
pending → approved → in_progress → completed
    ↘       ↘             ↘
  rejected  cancelled     cancelled
  cancelled
```
Status advances automatically when the booking time passes; admins may override any state. Cancelling or rejecting a booking requires providing a `reason` field.

### Update Booking Status
- **URL:** `/api/bookings/{id}`
- **Method:** `PATCH`
- **Body:** `{ "status": string, "reason": string? }`
- **Notes:** `reason` is mandatory when `status` is `cancelled` or `rejected`.
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
- Pagination query parameters will be documented once the backend stabilizes.
- Contact, schedule-call, and booking forms require a valid reCAPTCHA token. Bookings are throttled at 5 submissions/hour per user; advisors, branch heads, and system admins are exempt.

### Event Logs
- **URL:** `/api/logs/`
- **Method:** `GET`
- **Auth:** `system_admin`
- **Query:** `entity_type`, `actor`, `start`, `end`
- **Response:**
  ```json
  [
    {
      "id": 1,
      "actor": "admin",
      "entity_type": "booking",
      "entity_id": "1",
      "action": "created",
      "reason": null,
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ]
  ```

### Notification Payload
```json
{
  "id": 1,
  "type": "booking",
  "message": "Booking #1 created",
  "read": false,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## Related Guides
- [Backend API](../../finetune-ERP-backend-New/docs/API.md)
- [Frontend Architecture](../../finetune-ERP-frontend-New/docs/ARCHITECTURE.md)
