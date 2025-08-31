# SEO Guide

## Slug Strategy
- Products and variants include unique `slug` fields generated from their names and are immutable after the first save.
- `get_absolute_url()` exposes canonical paths like `/product/{slug}`.
- Departments, categories, and subcategories also expose immutable slugs for SEO-friendly taxonomy URLs.

## Metadata Injection
- Frontend uses React 19's metadata API to set `<title>`, `<meta name="description">`, Open Graph tags, and `<link rel="canonical">` on product detail and taxonomy pages.
- Product detail pages render JSON-LD `Product` schema including name, brand, price, and availability.
