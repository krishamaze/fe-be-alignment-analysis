# Public API Integration Contract

## Endpoints

### List Brands
- **URL:** `/api/brands/`
- **Method:** `GET`
- **Auth:** None
- **Response:**
  ```json
  [
    { "id": 1, "name": "Brand A", "logo": "https://example.com/a.png" }
  ]
  ```

### Retrieve Brand
- **URL:** `/api/brands/{id}/`
- **Method:** `GET`
- **Auth:** None
- **Response:**
  ```json
  { "id": 1, "name": "Brand A", "logo": "https://example.com/a.png" }
  ```

### List Stores
- **URL:** `/api/stores/`
- **Method:** `GET`
- **Auth:** None
- **Response:**
  ```json
  [
    { "id": 1, "store_name": "Sample Store", "store_address": "123 Main St", "lat": 12.34, "lon": 56.78 }
  ]
  ```

### Retrieve Store
- **URL:** `/api/stores/{id}/`
- **Method:** `GET`
- **Auth:** None
- **Response:**
  ```json
  { "id": 1, "store_name": "Sample Store", "store_address": "123 Main St", "lat": 12.34, "lon": 56.78 }
  ```

### List Spares
- **URL:** `/api/spares/`
- **Method:** `GET`
- **Auth:** None
- **Response:**
  ```json
  [
    { "id": 1, "name": "Wheel", "type": "bike", "is_available": true }
  ]
  ```

### Retrieve Spare
- **URL:** `/api/spares/{id}/`
- **Method:** `GET`
- **Auth:** None
- **Response:**
  ```json
  { "id": 1, "name": "Wheel", "type": "bike", "is_available": true }
  ```

## Legacy Mapping
- `/api/marketing/brands/` → `/api/brands/`
- `/api/marketing/stores/` → `/api/stores/`
- `/api/spares` (write endpoints) → `/api/spares/` (read-only)

## Notes
- All endpoints are currently read-only; write operations will be introduced in future phases.
