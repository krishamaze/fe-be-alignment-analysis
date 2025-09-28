# Frontend Route Reference

_Last synced: 2024-11-12_

This reference mirrors the route tree defined in `src/App.jsx`. Use it to
verify navigation coverage when adding pages or adjusting guards.

## Public Shell (`<PublicLayout />`)

| Route | Component | Notes |
| --- | --- | --- |
| `/` | `pages/Index` | Marketing home. |
| `/shop` | `pages/ecommerce/Shop` | Uses filter state wired to RTK Query product hooks. |
| `/repair` | `pages/public/Repair` | Service workflow entry. |
| `/support` | `pages/public/Support` | FAQ + contact CTA. |
| `/search` | `pages/public/Search` | Search results screen. |
| `/product/:slug` | `pages/ecommerce/ProductDetail` | Product detail view. |
| `/departments` | `pages/ecommerce/DepartmentsPage` | Department directory. |
| `/departments/:deptSlug/categories` | `pages/ecommerce/DepartmentCategoriesPage` | Shows categories for a department. |
| `/departments/:deptSlug/:catSlug/:subcatSlug/products` | `pages/ecommerce/CategoryPage` | Subcategory product listing. |
| `/cart` | `pages/ecommerce/CartPage` | Cart summary. |
| `/partners` | `pages/ecommerce/Partners` | Partner brands showcase. |
| `/help` | `pages/ecommerce/HelpCentre` | Help centre content. |
| `/legal` | `pages/public/Legal` | Combined terms/privacy page. |
| `/about` | `pages/public/About` | Company story. |
| `/contact` | `pages/public/Contact` | Form posts to `/api/marketing/contact/`. |
| `/locate` | `pages/public/Locate` | Store locator. |
| `/offers` | `pages/public/Offers` | Promotions page. |
| `/careers` | `pages/public/Careers` | Career listings placeholder. |
| `/stores` | `pages/internal/Stores` | Public view of store list. |
| `/stores/:id` | `pages/internal/StoreDetails` | Store detail page (read-only). |
| `/spares` | `pages/internal/Spares` | Spare catalogue listing. |
| `/bookings` | `pages/internal/Bookings` | Booking dashboard view (read-only for public). |
| `/schedule-call` | `pages/internal/ScheduleCall` | Call scheduling form to `/api/marketing/schedule-call/`. |
| `/account` | `pages/customers/Account` | Requires customer JWT; redirects to `/login` if missing. |
| `/orders` | `pages/customers/Orders` | Requires customer JWT; redirects to `/login` if missing. |

## Standalone Auth

| Route | Component | Guard |
| --- | --- | --- |
| `/teamlogin` | `pages/internal/TeamLogin` | Redirects to `/dashboard` if already authenticated. |
| `/signup` | `pages/customers/Signup` | Customer signup form. |
| `/login` | `pages/customers/Login` | Customer login form. |

## Focused Workflows

| Route | Component | Guard |
| --- | --- | --- |
| `/workledger` | `components/layout/FocusLayout` → `pages/internal/Workledger` | Requires JWT role `system_admin`, `branch_head`, or `advisor`. Child route `details/:id`. |
| `/giveaway-redemption` | `components/layout/FocusLayout` → `pages/internal/GiveawayRedemption` | Same guard as workledger. |

## Dashboard (`/dashboard`)

`/dashboard` loads `components/dashboard/layout/DashboardLayout` when the user is
authenticated. Nested routes are role-gated to `system_admin` users.

| Nested Path | Component |
| --- | --- |
| `users` | `pages/internal/User` |
| `stores` | `pages/internal/Store` |
| `brands` | `pages/internal/BrandDashboard` |
| `products` | `pages/internal/ProductsDashboard` |
| `variants` | `pages/internal/VariantsDashboard` |
| `taxonomy` | `pages/internal/TaxonomyDashboard` |
| `units` | `pages/internal/UnitsDashboard` |
| `qualities` | `pages/internal/QualitiesDashboard` |
| `bookings` | `pages/internal/BookingsDashboard` |
| `repairs/issues` | `pages/internal/IssuesDashboard` |
| `repairs/other-issues` | `pages/internal/OtherIssuesDashboard` |
| `repairs/questions` | `pages/internal/QuestionsDashboard` |
| `settings` | `pages/internal/Settings` |
| `logs` | `pages/internal/LogsDashboard` |

## RTK Query Integration Points

The UI consumes RTK Query endpoints declared in `src/api/erpApi.js` for all
dashboard CRUD flows. Shop filters, spare lookup, and admin tables use the
generated hooks (e.g., `useGetBrandsQuery`, `useCreateBookingMutation`). When
adding a new route, prefer integrating with the existing API slice so caching
and invalidation stay centralized.
