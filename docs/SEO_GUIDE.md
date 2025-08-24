# SEO Guide

## Slug Strategy
- Products and variants include unique `slug` fields generated from their names.
- Detail pages are accessed via slugs: `/api/products/{slug}` and `/api/variants/{slug}`.
- Departments, categories, and subcategories also expose immutable `slug` fields for SEO-friendly taxonomy URLs.

## Metadata Injection
- Frontend uses `react-helmet` to set `<title>` and `<meta name="description">` on product detail and taxonomy pages using the relevant names.
