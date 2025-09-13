# File Map

- `src/components/layout/MultiSlideReel.jsx` – horizontally scrollable reel component with swipe hints and CSS scroll snapping.
- `src/pages/Index.jsx` – home page with fullpage scroll, requestAnimationFrame-based section navigation, and cubic easing.
- `src/pages/IndexMeta.js` – SEO metadata for the home page using React 19's metadata API.
- `src/components/reels/HeroReel.jsx` – hero slide content provided to `MultiSlideReel`.
- `src/components/reels/QuickActionsReel.jsx` – quick repair actions as a slide for `MultiSlideReel`.
- `src/components/reels/TestimonialsReel.jsx` – customer testimonials rendered as multiple `MultiSlideReel` slides.
- `src/utils/devLog.js` – development-only logger used for debugging.
- `src/components/layout/PageWrapper.jsx` – wraps pages, sets scroll mode, and provides the scroll container in reel mode.
- `src/index.css` – global styles, including navigation offsets and fullpage scroll behavior.
- `public/favicon.svg` – site favicon.
- `src/components/common/PageSection.jsx` – semantic section wrapper that fills the viewport and applies mobile bottom padding in reel mode.
- `.env.example` – template environment variables for API configuration.
