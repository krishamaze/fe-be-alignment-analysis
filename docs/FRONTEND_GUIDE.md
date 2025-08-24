# Frontend Guide

## Shop Filters & Sorting
- `Shop.jsx` provides faceted browsing with brand checkboxes, taxonomy dropdowns, availability toggle, and price range sliders.
- Sorting dropdown supports newest, price low→high, and price high→low; selections map to API `ordering` params.
- Changing any filter or sorting option updates the RTK Query call and refreshes the product grid automatically.
