# File Map

- `src/components/layout/MultiSlideReel.jsx` – horizontally scrollable reel component with custom easing and swipe hints.
- `src/pages/Index.jsx` – home page with fullpage scroll and section navigation.
- `src/components/reels/HeroReel.jsx` – hero section wrapped with MultiSlideReel.
- `src/components/reels/QuickActionsReel.jsx` – quick repair actions wrapped with MultiSlideReel.
- `src/components/reels/TestimonialsReel.jsx` – testimonials reel using MultiSlideReel.
- `src/utils/devLog.js` – development-only logger used for debugging.
- `src/components/layout/ScrollModeContext.jsx` – context for scroll mode, scroll container registration, and bottom nav visibility.
- `src/components/layout/PublicLayout.jsx` – global layout that fixes navigation, measures nav heights, and toggles the top bar on scroll.
- `src/components/layout/PageWrapper.jsx` – registers the scroll container and applies navigation offsets; reel mode enables full-page snap scrolling.
- `src/components/layout/TopBar.jsx` – promotional header bar at the top of the page.
- `src/components/layout/MainNav.jsx` – primary navigation bar; height measured by `PublicLayout`.
- `src/index.css` – global styles for fixed navigation and fullpage scrolling.
