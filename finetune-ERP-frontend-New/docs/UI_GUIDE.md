# UI Guide

## Tailwind primitives

The project uses [Tailwind CSS](https://tailwindcss.com) with a custom theme token system.

- **Spacing**: `px-4`, `py-3`, `mb-4`
- **Typography**: `text-heading-xl`, `text-body-md`, `text-caption`
- **Colors**: `bg-surface`, `text-primary`, `text-secondary`, `focus:ring-keyline`
- **Effects**: `rounded`, `shadow`, `hover:scale-105`

### Color tokens

All colors are sourced from Tailwind theme tokens:

- `primary` `#000000`
- `secondary` `#E2C33D`
- `surface` `#F5F7FA`
- `keyline` `#E2C33D`
- `success` `#16A34A`
- `error` `#DC2626`

### Typography scale

Use the shared font-size tokens instead of ad-hoc classes:

- Display: `text-display-xl`, `text-display-lg`, `text-display-md`
- Headings: `text-heading-xl`, `text-heading-lg`, `text-heading-md`
- Body: `text-body-lg`, `text-body-md`, `text-body-sm`
- Caption: `text-caption`

### Dark mode

Dark mode is enabled via `class` strategy. Toggle a `dark` class on the root element and use `dark:` variants (e.g., `bg-surface dark:bg-primary`, `text-primary dark:text-surface`).

## Component conventions

- Functional React components in `src/components` and `src/pages`.
- Props use `camelCase` and optional defaults.
- Accessibility: label form fields, use semantic HTML, and ensure interactive elements are keyboard focusable.

## Reusable components

| Component                                       | Location                          | Notes                                                        |
| ----------------------------------------------- | --------------------------------- | ------------------------------------------------------------ |
| `Navbar`                                        | `src/components/common`           | top navigation bar (ecommerce variant pending consolidation) |
| `DashboardNavbar` / `DashboardBottomNav`        | `src/components/dashboard/layout` | responsive dashboard navigation with fixed bottom grid       |
| `Navbar`                                        | `src/components/common`           | top navigation bar (ecommerce variant pending consolidation) |
| `Pagination` / `ResponsivePaginationHandler`    | `src/components`                  | reusable pagination controls                                 |
| `ToggleStatusModal` & `DeleteConfirmationModal` | `src/components`                  | confirmation dialogs                                         |
| `StoreAssignModal` & `BranchHeadModal`          | `src/components/Store`            | assign stores or branch heads                                |
| `Loader`                                        | `src/components/common`           | full-screen loading spinner                                  |

Follow these patterns when adding new components to keep styling and accessibility consistent.

The mobile dashboard uses a fixed bottom navigation bar that displays navigation tiles in a three-column grid (six columns on wider breakpoints) and can be shown or hidden via the floating toggle button.

## Dashboard tiles

Dashboard pages group features into **Live** and **Upcoming** sections. Section headers show counts in 14px medium text. Upcoming tiles render at ~70% opacity and trigger a "Coming soon" toast when activated. Tiles can optionally supply a `to` route to enable navigation (TODO: clarify deep linking patterns).

Giveaway Redemption and Workledger tiles navigate to `/giveaway-redemption` and `/workledger`, rendering inside `FocusLayout` (TODO: confirm additional FocusLayout flows).

## Brand keyline system

- **Brand color:** `secondary` / `keyline` (`#E2C33D`) used only for strokes, borders, and outlines.
- **Surfaces:** keep backgrounds neutral (`surface` `#F5F7FA` on light mode).
- **Do use keylines for:** button outlines, input borders on hover/focus, card borders, badge outlines, active tab indicators, focus rings, dividers, progress indicators, and icon strokes.
- **Don't use brand color for:** large fills, panel backgrounds, text backgrounds, disabled states, or body text.
- **Interactive states:**
  - _Hover:_ add a 3–6% tint of the brand color to the neutral background.
  - _Active:_ increase keyline width by 0.5–1px or add a subtle inset shadow.
  - _Focus:_ show a brand-colored ring offset 2–3px from the element.
- **Primary CTA:** solid black button with white text; all other elements rely on brand keylines.

## Public form pattern

- Apply the `.input` utility on all fields for consistent styling.
- Display `Loader` during async submission and surface errors with `react-hot-toast`.
- Include Google reCAPTCHA using `VITE_RECAPTCHA_SITE_KEY` and throttle repeat submissions for 30 seconds.

## Toast system

- Use `react-hot-toast` for all notifications.
- Mount a single `<Toaster />` in `App.jsx` with theme-aware classes.
- Avoid other toast libraries.

## Icon usage

- Import icons from `lucide-react`.
- Do not mix multiple icon sets.

## SEO metadata

- Public pages should declare `<title>`, `<meta>`, and `<link>` tags directly in the component using React 19's built-in metadata support to set the page title, description, and Open Graph meta tags.
