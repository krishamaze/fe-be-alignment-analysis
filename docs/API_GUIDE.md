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

## Products
- `GET /api/products` – public list (filter by `brand`, `availability`)
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
- `PATCH /api/bookings/{id}/` – system_admin only status update
