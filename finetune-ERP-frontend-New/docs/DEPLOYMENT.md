# Deployment

## Build

```
npm run build
```

Generates a `dist/` directory containing static assets ready for deployment.

## Hosting

Optimised for static hosts such as [Vercel](https://vercel.com); see `vercel.json` for SPA rewrites.

## Environment matrix

| Environment | App URL                | API URL                   |
| ----------- | ---------------------- | ------------------------- |
| Local dev   | http://localhost:5173  | https://api.finetune.store |
| Production  | https://finetune.store | https://api.finetune.store |

## Environment variables

| Variable                  | Purpose                                    |
| ------------------------- | ------------------------------------------ |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA site key for public forms |

## Caching

Serve `dist` assets with long‑term cache headers. HTML should be cached for a short time and serve `index.html` on unknown routes.

## Workflow

1. Push to a preview branch to trigger Vercel preview.
2. Merge to `main` for production deployment.

## Roadmap

Planned for v1.1:

- Invoice PDF generation
- Lighthouse performance checks
- Updated UI screenshots
- Expanded deployment matrix
