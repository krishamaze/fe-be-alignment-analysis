# SEO Guide

## Slug Strategy
- Products and variants include unique `slug` fields generated from their names.
- Detail pages are accessed via slugs: `/api/products/{slug}` and `/api/variants/{slug}`.

## Metadata Injection
- Frontend uses `react-helmet` to set `<title>` and `<meta name="description">` on product detail pages using the product name and brand.
