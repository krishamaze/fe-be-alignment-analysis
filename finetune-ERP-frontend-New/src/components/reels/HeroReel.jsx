import { Link } from 'react-router-dom';
import MultiSlideReel from '@/components/layout/MultiSlideReel';
import useDevice from '@/hooks/useDevice';
import phoneIllustration from '@/assets/phone-illustration.png';

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

function DesktopLayout() {
  return (
    <div className="grid h-full grid-cols-12 items-center gap-8">
      <div className="col-span-7 flex h-full flex-col justify-center gap-8 text-surface">
        <div className="space-y-4">
          <p className="text-body-md font-medium text-surface/70">
            Serving Coimbatore & Palakkad • 10+ Years Trusted
          </p>
          <h1 className="text-6xl font-bold leading-tight">
            Expert Mobile & Laptop Repairs
          </h1>
          <p className="max-w-xl text-xl text-surface/80">
            Same-day repairs • Free pickup & delivery • 90-day warranty
          </p>
        </div>

        <div className="flex flex-wrap gap-4">
          <Link
            to="/repair"
            className="rounded-lg bg-primary px-8 py-4 text-lg font-semibold text-surface transition-colors hover:bg-secondary hover:text-primary"
          >
            Get Instant Quote
          </Link>
          <Link
            to="/shop"
            className="rounded-lg border border-surface/30 px-8 py-4 text-lg text-surface transition-colors hover:bg-surface/10"
          >
            Shop Accessories
          </Link>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-6 text-body-sm text-surface/80">
          {stats.map((item) => (
            <div key={item.id}>{item.content}</div>
          ))}
        </div>
      </div>

      <div className="col-span-5 h-full">
        <div className="relative flex h-full items-center justify-center">
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
        <p className="text-body-sm font-medium text-surface/70">
          Serving Coimbatore & Palakkad • 10+ Years Trusted
        </p>
        <h1 className="text-4xl font-bold leading-tight">
          Expert Mobile & Laptop Repairs
        </h1>
        <p className="text-lg text-surface/80">
          Same-day repairs • Free pickup & delivery • 90-day warranty
        </p>

        <div className="flex w-full flex-col items-center gap-4">
          <Link
            to="/repair"
            className="w-full rounded-lg bg-primary px-6 py-3 text-base font-semibold text-surface transition-colors hover:bg-secondary hover:text-primary sm:w-auto"
          >
            Get Instant Quote
          </Link>
          <Link
            to="/shop"
            className="w-full rounded-lg border border-surface/30 px-6 py-3 text-base text-surface transition-colors hover:bg-surface/10 sm:w-auto"
          >
            Shop Accessories
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4 px-6 text-center text-body-sm text-surface/80">
        {stats.map((item) => (
          <div key={item.id}>{item.content}</div>
        ))}
      </div>
    </div>
  );
}

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
      <MultiSlideReel mode="horizontal" reelId="hero" showHint={false}>
        {slides}
      </MultiSlideReel>
    </section>
  );
}
