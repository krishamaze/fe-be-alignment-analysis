import SectionSlider from '@/components/navigation/SectionSlider';
import useDevice from '@/hooks/useDevice';
import phoneIllustration from '@/assets/phone-illustration.png';
import Button from '@/components/common/Button';

/**
 * Statistics displayed in the hero section
 */
const stats = [
  {
    id: 'rating',
    content: (
      <span className="inline-flex items-center gap-1">
        <span aria-hidden className="text-secondary">
          ★
        </span>
        <span>4.6/5 rating</span>
      </span>
    ),
  },
  { id: 'repairs', content: '10,000+ devices repaired' },
  { id: 'locations', content: '4 locations' },
];

/**
 * Desktop layout for hero section
 * Uses 12-column grid: 7 cols content, 5 cols image
 */
function DesktopLayout() {
  return (
    <div className="grid h-full grid-cols-12 items-center gap-8">
      <div className="col-span-7 flex h-full flex-col justify-center gap-8 text-surface">
        <div className="space-y-4">
          <p className="text-body-md font-medium text-surface/90">
            Serving Coimbatore & Palakkad • 10+ Years Trusted
          </p>
          <h1 className="text-6xl font-bold leading-tight">
            Expert Mobile & Laptop Repairs
          </h1>
          <p className="max-w-xl text-xl text-surface">
            Same-day repairs • Free pickup & delivery • 90-day warranty
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Button to="/repair" variant="primary" size="lg">
            Get Instant Quote
          </Button>
          <Button to="/shop" variant="secondary" size="lg">
            Shop Accessories
          </Button>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-6 text-body-sm text-surface/90">
          {stats.map((item) => (
            <div key={item.id}>{item.content}</div>
          ))}
        </div>
      </div>

      <div className="col-span-5 h-full overflow-hidden">
        <div className="relative flex h-full w-full items-center justify-center">
          <div
            aria-hidden
            className="absolute -top-24 -right-20 h-64 w-64 rounded-full bg-secondary/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute bottom-0 left-8 h-48 w-48 rounded-full bg-secondary/10 blur-3xl"
          />
          <img
            src={phoneIllustration}
            alt="Smartphone undergoing repair"
            className="relative z-10 max-h-full w-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.45)]"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Mobile layout for hero section
 * Centered content with background image overlay
 */
function MobileLayout() {
  return (
    <div className="relative flex h-full flex-col justify-center">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          src={phoneIllustration}
          alt="Smartphone undergoing repair"
          className="h-3/4 w-auto opacity-40 blur-sm"
          loading="lazy"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 text-center text-surface">
        <p className="text-body-sm font-medium text-surface/90">
          Serving Coimbatore & Palakkad • 10+ Years Trusted
        </p>
        <h1 className="text-4xl font-bold leading-tight">
          Expert Mobile & Laptop Repairs
        </h1>
        <p className="text-lg text-surface">
          Same-day repairs • Free pickup & delivery • 90-day warranty
        </p>

        <div className="flex w-full flex-col items-center gap-4">
          <Button to="/repair" variant="primary" size="md" className="w-full sm:w-auto">
            Get Instant Quote
          </Button>
          <Button to="/shop" variant="secondary" size="md" className="w-full sm:w-auto">
            Shop Accessories
          </Button>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4 px-6 text-center text-body-sm text-surface/90">
        {stats.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
      </div>
    </div>
  );
}

/**
 * Hero Section Component
 * 
 * Main landing page hero with company value proposition, CTA buttons,
 * and key statistics. Renders different layouts for mobile vs desktop.
 * 
 * @component
 * @returns {React.Element} Hero section with responsive layout
 */
export default function HeroReel() {
  const { isMobile } = useDevice();

  const slides = [
    <div
      key="hero"
      className="relative min-h-[var(--fullpage-section-h)] overflow-hidden bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950"
    >
      <div className="relative z-10 mx-auto flex h-full w-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">

        {isMobile ? <MobileLayout /> : <DesktopLayout />}
      </div>
    </div>,
  ];

  return (
    <section className="snap-start fullpage-section overflow-hidden">
      <SectionSlider mode="horizontal" sectionId="hero" showHint={false}>
        {slides}
      </SectionSlider>
    </section>
  );
}
