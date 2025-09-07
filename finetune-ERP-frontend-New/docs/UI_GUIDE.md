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
- Custom hooks live in `src/hooks` (e.g., `useDevice` for screen width and touch detection).

## Reusable components

| Component                                       | Location                          | Notes                                                                                                                                                                                                                                                                                    |
| ----------------------------------------------- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PublicLayout`                                  | `src/components/layout`           | wraps navigation, measures `TopBar` and `MainNav` heights as CSS variables, hides the `TopBar` on downward scroll in `scroll` mode, and renders `BottomNav` with an optional `Footer` |
| `TopBar` / `MainNav` / `BottomNav`              | `src/components/layout`           | modular public navigation pieces; `BottomNav` uses `fixed` positioning with context-driven visibility and publishes its height via `--bottomnav-h` (synced by a `ResizeObserver`)                                                   |
| `Footer`                                        | `src/components/layout`           | slim desktop footer that slides up near page end |
| `DashboardNavbar` / `DashboardBottomNav`        | `src/components/dashboard/layout` | responsive dashboard navigation with fixed bottom grid                                                                                                                                                                                                                                   |
| `Pagination` / `ResponsivePaginationHandler`    | `src/components`                  | reusable pagination controls                                                                                                                                                                                                                                                             |
| `ToggleStatusModal` & `DeleteConfirmationModal` | `src/components`                  | confirmation dialogs                                                                                                                                                                                                                                                                     |
| `StoreAssignModal` & `BranchHeadModal`          | `src/components/Store`            | assign stores or branch heads                                                                                                                                                                                                                                                            |
| `Loader`                                        | `src/components/common`           | full-screen loading spinner                                                                                                                                                                                                                                                              |
| `PageSection`                                   | `src/components/common`           | semantic wrapper that uses `h-full` in reel mode and `min-h-screen` otherwise; adds mobile bottom padding in reel mode                                                                                                                                                                   |
|                                                 |
| `PageWrapper`                                   | `src/components/layout`           | sets scroll mode and registers the scroll container; reel mode enables snap scrolling with navigation offsets |
| `MultiSlideReel`                                | `src/components/layout`           | horizontally scrollable reel with custom easing, session-aware swipe hints, ScrollModeContext integration, and RTL support |
|                                                                                                                 |
Follow these patterns when adding new components to keep styling and accessibility consistent.

The mobile dashboard uses a fixed bottom navigation bar that displays navigation tiles in a three-column grid (six columns on wider breakpoints) and can be shown or hidden via the floating toggle button.

## Layout

Navigation spacing uses Tailwind utilities and container-based sizing; `BottomNav` height is exposed via `--bottomnav-h` and kept in sync with a `ResizeObserver`.

Public routes use `PublicLayout` inside a `ScrollModeProvider`. The layout fixes `TopBar` and `MainNav`, measures their heights as `--topbar-h` and `--mainnav-h`, and listens to the registered scroll container to hide the `TopBar` on downward scroll in `scroll` mode. Individual pages wrap content in `PageWrapper`, which registers its scroll element and applies padding for the nav offsets. In `reel` mode, `PageWrapper` enables full-page snap sections sized at `calc(100dvh - var(--topbar-h,0px) - var(--mainnav-h,0px))`. `BottomNav` exposes its size via `--bottomnav-h` for padding adjustments.
On desktop, a `Footer` stays hidden until about 85% scroll, then slides into view.

### Viewport units

The app relies on modern viewport units (`100dvh`) so navigation positions remain stable without JavaScript handlers.

## Dashboard tiles

Dashboard pages group features into **Live** and **Upcoming** sections. Section headers show counts in 14px medium text. Upcoming tiles render at ~70% opacity and trigger a "Coming soon" toast when activated. Tiles can optionally supply a `to` route to enable navigation.

Giveaway Redemption and Workledger tiles navigate to `/giveaway-redemption` and `/workledger`, rendering inside `FocusLayout`.

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

- Public pages should define metadata in a dedicated `*Meta.js` module imported by the component to avoid Fast Refresh warnings. Use React 19's metadata support to apply titles, descriptions, and Open Graph tags.
