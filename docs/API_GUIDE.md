# API Guide

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
- `GET /api/units` – public list
- `GET /api/units/{slug}` – public detail
- `POST /api/units` – system_admin only
- `PUT /api/units/{slug}` – system_admin only (slug immutable)
- `DELETE /api/units/{slug}` – system_admin only

## Qualities
- `GET /api/qualities` – public list
- `GET /api/qualities/{slug}` – public detail
- `POST /api/qualities` – system_admin only
- `PUT /api/qualities/{slug}` – system_admin only (slug immutable)
- `DELETE /api/qualities/{slug}` – system_admin only

## Taxonomy
- `GET /api/departments` – public list
- `POST /api/departments` – system_admin only
- `GET /api/departments/{slug}` – public detail
- `PUT /api/departments/{slug}` – system_admin only (slug immutable)
- `DELETE /api/departments/{slug}` – system_admin only
- `GET /api/categories?department=slug` – public list filtered by department
- `POST /api/categories` – system_admin only
- `GET /api/categories/{slug}` – public detail
- `PUT /api/categories/{slug}` – system_admin only (slug immutable)
- `DELETE /api/categories/{slug}` – system_admin only
- `GET /api/subcategories?category=slug` – public list filtered by category
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
- `POST /api/bookings/` – public create (captcha + throttling)
- `GET /api/bookings/` – system_admin only list
- `GET /api/bookings/{id}/` – system_admin only detail
- `PATCH /api/bookings/{id}/` – system_admin only status update (reason required for `cancelled`/`rejected`)
  - Transitions: pending→approved/rejected/cancelled, approved→in_progress/cancelled, in_progress→completed/cancelled

## Event Logs
- `GET /api/logs/` – system_admin only list
  - Filters: `entity_type`, `actor`, `start`, `end`
