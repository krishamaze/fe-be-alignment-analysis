# API Guide

## Authentication Overview
- Public GET: `/api/brands/`, `/api/departments/`, `/api/categories/`, `/api/subcategories/`, `/api/products/`, `/api/variants/`
- Authenticated: cart, checkout, orders, account-related endpoints

## Brands
- `GET /api/brands/` – public list
- `POST /api/brands/` – system_admin only
- `GET /api/brands/{id}/` – public detail
- `PUT /api/brands/{id}/` – system_admin only
- `DELETE /api/brands/{id}/` – system_admin only

## Stores
- `GET /api/stores?store_type=BRANCH|HQ` – public list (authority details hidden; defaults to active branches)
- `POST /api/stores` – system_admin only
- `GET /api/stores/{id}` – public detail
- `PUT /api/stores/{id}` – system_admin only
- `DELETE /api/stores/{id}` – system_admin only

## Spares
- `GET /api/spares` – public list (price hidden for non-admin)
- `POST /api/spares` – system_admin only
- `GET /api/spares/{id}` – public detail
- `PUT /api/spares/{id}` – system_admin only
- `DELETE /api/spares/{id}` – system_admin only

## Units
- `GET /api/units` – auth required
- `GET /api/units/{slug}` – auth required
- `POST /api/units` – system_admin only
- `PUT /api/units/{slug}` – system_admin only (slug immutable)
- `DELETE /api/units/{slug}` – system_admin only

## Qualities
- `GET /api/qualities` – auth required
- `GET /api/qualities/{slug}` – auth required
- `POST /api/qualities` – system_admin only
- `PUT /api/qualities/{slug}` – system_admin only (slug immutable)
- `DELETE /api/qualities/{slug}` – system_admin only

## Taxonomy
- `GET /api/departments` – public list
- `POST /api/departments` – system_admin only
- `GET /api/departments/{slug}` – public detail
- `PUT /api/departments/{slug}` – system_admin only (slug immutable)
- `DELETE /api/departments/{slug}` – system_admin only
- `GET /api/categories?department=slug` – public list
- `POST /api/categories` – system_admin only
- `GET /api/categories/{slug}` – public detail
- `PUT /api/categories/{slug}` – system_admin only (slug immutable)
- `DELETE /api/categories/{slug}` – system_admin only
- `GET /api/subcategories?category=slug` – public list
- `POST /api/subcategories` – system_admin only
- `GET /api/subcategories/{slug}` – public detail
- `PUT /api/subcategories/{slug}` – system_admin only (slug immutable)
- `DELETE /api/subcategories/{slug}` – system_admin only

## Products
- `GET /api/products` – public list (filter by `brand`, `availability`, `department`, `category`, `subcategory`, `min_price`, `max_price`; order with `ordering=price| -price | -date_created`)
- `POST /api/products` – system_admin only
- `GET /api/products/{slug}` – public detail
- `PUT /api/products/{slug}` – system_admin only (slug immutable)
- `DELETE /api/products/{slug}` – system_admin only

## Variants
- `GET /api/variants` – public list (filter by `product` slug)
- `POST /api/variants` – system_admin only
- `GET /api/variants/{slug}` – public detail
- `PUT /api/variants/{slug}` – system_admin only (slug immutable)
- `DELETE /api/variants/{slug}` – system_admin only


## Bookings
- `POST /api/bookings/` – public create (captcha + throttling). Supports nested `details` and `responses`:
  ```json
  {
    "name": "John",
    "email": "j@example.com",
    "date": "2024-01-01",
    "time": "10:00",
    "captcha_token": "...",
    "details": {"issues": [1,2], "brand": "Apple", "product": "iPhone"},
    "responses": [{"question_set_name": "A", "question": "Is it working?", "response": "Yes"}]
  }
  ```
- `GET /api/bookings/` – system_admin only list
- `GET /api/bookings/{id}/` – system_admin only detail
- `PATCH /api/bookings/{id}/` – system_admin only status update (reason required for `cancelled`/`rejected`)
  - Transitions: pending→approved/rejected/cancelled, approved→in_progress/cancelled, in_progress→completed/cancelled

## Issues & Questions
- `GET /api/issues/`, `POST /api/issues/` – auth required; writes system_admin only
- `GET /api/otherissues/`, `POST /api/otherissues/` – same rules
- `GET /api/questions/`, `POST /api/questions/` – same rules

## Responses
- `POST /api/responses/` – public create for a booking
- `GET /api/responses/` – system_admin only list

## Event Logs
- `GET /api/logs/` – system_admin only list
  - Filters: `entity_type`, `actor`, `start`, `end`
- `GET /api/logs/export?format=csv|json` – system_admin only export (same filters)

## Related Guides
- [Integration Contract](contracts/INTEGRATION_CONTRACT.md)
- [Test Guide](TEST_GUIDE.md)
