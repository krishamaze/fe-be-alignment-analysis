# finetune ERP Frontend

React + Vite application providing ERP and e‑commerce interfaces for finetune.store.

![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=FFD62E)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-593D88?logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-38B2AC?logo=tailwind-css&logoColor=white)

## Quick start

1. **Prerequisites**: Node.js ≥ 18 and npm.
2. **Install**: `npm install`
3. **Develop**: `npm run dev` → http://localhost:5173
4. **Build**: `npm run build`
5. **Preview build**: `npm run preview`

### Marketing pages

| Route        | Component            |
| ------------ | -------------------- |
| `/`          | `Hero.jsx`           |
| `/marketing` | `Index.jsx`          |
| `/about`     | `public/About.jsx`   |
| `/contact`   | `public/Contact.jsx` |
| `/locate`    | `public/Locate.jsx`  |
| `/legal`     | `public/Legal.jsx`   |
| `/offers`    | `public/Offers.jsx`  |
| `/careers`   | `public/Careers.jsx` |

## Environment

| Variable                  | Description                                                                      | Example                                           |
| ------------------------- | -------------------------------------------------------------------------------- | ------------------------------------------------- |
| _none_                    | API base URL is hard coded in [`src/utils/Endpoints.js`](src/utils/Endpoints.js) | `https://finetunetechcrafterp-dev.up.railway.app` |
| `VITE_RECAPTCHA_SITE_KEY` | Google reCAPTCHA site key used by `ReCaptchaWrapper` in public forms             | `test-site-key`                                   |

Backend service lives in a separate repository (TODO: link) and expects requests against the base URL above.

## Scripts

| Script            | Purpose                 |
| ----------------- | ----------------------- |
| `npm run dev`     | start local dev server  |
| `npm run build`   | build production bundle |
| `npm run preview` | preview built assets    |
| `npm run lint`    | run ESLint              |
| `npm test`        | run Vitest suite        |

## Folder structure

```
├── public/               static assets
├── src/                  application source
│   ├── api/              async thunks for API calls
│   ├── components/       reusable UI components
│   ├── pages/            route pages
│   ├── redux/            slices and store
│   └── utils/            constants and helpers
└── docs/                 project documentation
```

### Import aliases

The `@` prefix resolves to the `src` directory. For example:

```js
import Loader from '@/components/common/Loader';
import END_POINTS from '@/utils/Endpoints';
```

## Troubleshooting

1. **Port 5173 already in use** → stop the conflicting process or change the `server.port` in `vite.config.js`.
2. **`npm install` fails** → ensure Node.js ≥ 18.
3. **API requests fail** → confirm the backend at `https://finetunetechcrafterp-dev.up.railway.app` is reachable.
4. **Immediate redirect to login** → clear invalid tokens from cookies.
5. **Missing styles** → ensure `src/index.css` imports Tailwind directives and that Vite restarted after editing config.
