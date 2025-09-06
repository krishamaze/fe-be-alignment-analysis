# Performance

## Bundling

All routes are currently loaded eagerly. Consider using `React.lazy` and `Suspense` for large pages (e.g. dashboard vs e‑commerce) to create separate chunks. Heavy libraries like Swiper should be lazy-loaded (e.g., `ReelLayout`) to keep the initial bundle small.

## Budgets

- Keep initial bundle under **200 kB** gzipped.
- Avoid shipping unused icon libraries or polyfills.

## Assets

- Prefer SVG or modern formats (WebP/AVIF) for images.
- Host fonts locally and preload critical ones.

## Dev tips

- Run `vite build --analyze` to inspect bundle size.
- Enable the browser's performance panel to profile slow components.
