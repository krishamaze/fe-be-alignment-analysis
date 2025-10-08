# AI Agent Guide

## Project Overview

Finetune ERP Frontend is a React-based web application that provides administrative dashboards and e-commerce interfaces for the Finetune ERP system. It interacts with a backend REST service to manage users, stores and other business resources.

## Architecture Summary

- **React 19** for UI components
- **Vite 6** for development and build tooling
- **Redux Toolkit** for state management
- **Tailwind CSS** for utility-first styling
- **React Router** for client-side routing
- **Axios** and `fetchBaseQuery` for HTTP requests

## File Structure

```text
/
├─ docs/                # In-depth documentation
├─ public/              # Static assets served as-is
├─ src/                 # Application source
│  ├─ api/              # REST helpers and base query with reauth
│  ├─ assets/           # Images and other media
│  ├─ components/       # Reusable UI components
│  ├─ pages/            # Route-level components
│  ├─ redux/            # Redux slices and store setup
│  ├─ utils/            # Utility helpers and constants
│  └─ params/           # Route and query parameter helpers
├─ index.html           # Vite entry point
├─ tailwind.config.js   # Tailwind configuration
└─ vite.config.js       # Vite configuration
```

## Role-Based Access

- **system_admin** – full access to dashboard features including settings, stores, users and giveaway pages
- **admin** – same dashboard access as `system_admin`
- **branch_head** – dashboard access to settings and stores only
- **advisor** – limited dashboard with access to stores overview

See [docs/AUTH.md](docs/AUTH.md) for detailed route protection rules.

## Development Guidelines

- Use functional React components and hooks
- Style elements with Tailwind CSS utility classes
- Organize code using Redux Toolkit slices and thunks
- Follow camelCase for filenames and variables
- Keep components accessible (semantic HTML, labels, keyboard focus)
- Run lint and tests before committing

```bash
npm run lint
npm test
```

## API Integration

Frontend API calls use a `fetchBaseQuery` wrapper (`src/api/baseQuery.js`) that attaches JWT tokens from cookies and automatically refreshes them on 401 responses. Redux async thunks dispatch these calls and update slices.

```js
// Example store fetch
import { baseQueryWithReauth } from './api/baseQuery';

await baseQueryWithReauth({ url: '/stores' }, { dispatch, getState });
```

## Common Tasks

- **Start development server:** `npm run dev`
- **Build for production:** `npm run build`
- **Run tests:** `npm test`
- **Run linter:** `npm run lint`
- **Debug API calls:** check network tab, inspect Redux state, and verify cookie tokens
- **Add components:** follow patterns in `docs/UI_GUIDE.md`
