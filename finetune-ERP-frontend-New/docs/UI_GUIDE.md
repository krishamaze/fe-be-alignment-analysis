# UI Guide

## Tailwind primitives

The project uses [Tailwind CSS](https://tailwindcss.com) with the default theme. Common classes include:

- **Spacing**: `px-4`, `py-3`, `mb-4`
- **Typography**: `text-sm`, `text-2xl`, `font-bold`
- **Colors**: `bg-gray-100`, `bg-black`, `text-white`, `text-gray-500`
- **Effects**: `rounded`, `shadow`, `hover:bg-gray-800`

## Component conventions

- Functional React components in `src/components` and `src/pages`.
- Props use `camelCase` and optional defaults.
- Accessibility: label form fields, use semantic HTML, and ensure interactive elements are keyboard focusable.

## Reusable components

| Component | Location | Notes |
|-----------|----------|-------|
| `Navbar` / `EcommerceNavbar` | `src/components/common` & `src/components/ecommerce` | top navigation bars |
| `DashboardNavbar` / `DashboardBottomNav` | `src/components/dashboard/layout` | responsive dashboard navigation with fixed bottom grid |
| `Pagination` / `ResponsivePaginationHandler` | `src/components` | reusable pagination controls |
| `ToggleStatusModal` & `DeleteConfirmationModal` | `src/components` | confirmation dialogs |
| `StoreAssignModal` & `BranchHeadModal` | `src/components/Store` | assign stores or branch heads |
| `AppLoader` | `src/components` | full‑screen loading spinner |

Follow these patterns when adding new components to keep styling and accessibility consistent.

The mobile dashboard uses a fixed bottom navigation bar that displays navigation tiles in a three-column grid (six columns on wider breakpoints) and can be shown or hidden via the floating toggle button.

## Dashboard tiles

Dashboard pages group features into **Live** and **Upcoming** sections. Section headers show counts in 14px medium text. Upcoming tiles render at ~70% opacity and trigger a "Coming soon" toast when activated. Tiles can optionally supply a `to` route to enable navigation (TODO: clarify deep linking patterns).

Giveaway Redemption and Workledger tiles navigate to `/giveaway-redemption` and `/workledger`, rendering inside `FocusLayout` (TODO: confirm additional FocusLayout flows).

## Brand keyline system

- **Brand color:** `#E2C33D` used only for strokes, borders, and outlines.
- **Surfaces:** keep backgrounds neutral (`#F5F7FA` on light mode).
- **Do use keylines for:** button outlines, input borders on hover/focus, card borders, badge outlines, active tab indicators, focus rings, dividers, progress indicators, and icon strokes.
- **Don't use brand color for:** large fills, panel backgrounds, text backgrounds, disabled states, or body text.
- **Interactive states:**
  - *Hover:* add a 3–6% tint of the brand color to the neutral background.
  - *Active:* increase keyline width by 0.5–1px or add a subtle inset shadow.
  - *Focus:* show a brand-colored ring offset 2–3px from the element.
- **Primary CTA:** solid black button with white text; all other elements rely on brand keylines.

## Public form pattern

- Apply the `.input` utility on all fields for consistent styling.
- Display `AppLoader` during async submission and surface errors with toasts.
- Include Google reCAPTCHA using `VITE_RECAPTCHA_SITE_KEY` and throttle repeat submissions for 30 seconds.
