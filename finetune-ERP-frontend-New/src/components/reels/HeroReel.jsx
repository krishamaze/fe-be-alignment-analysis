import { Link } from 'react-router-dom';
import MultiSlideReel from '@/components/layout/MultiSlideReel';
import phoneIllustration from '@/assets/phone-illustration.png';

export default function HeroReel() {
  const slides = [
    <div key="hero" className="relative flex items-center h-full">
      <div className="absolute inset-0 bg-primary/60" />
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto px-4">
        {/* Left: Text and CTAs */}
        <div className="text-center lg:text-left">
          <p className="text-surface/70 text-body-sm sm:text-body-md pb-3 font-medium">
            Serving Coimbatore & Palakkad • 10+ Years Trusted
          </p>
          <h1 className="text-surface text-display-lg font-bold leading-tight pb-4">
            Expert Mobile & Laptop Repairs
          </h1>
          <p className="text-surface/80 text-body-lg pb-6 max-w-lg mx-auto lg:mx-0">
            Same-day repairs • Free pickup & delivery • 90-day warranty
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pb-6">
            <Link
              to="/repair"
              className="bg-primary text-surface px-8 py-4 rounded-lg font-semibold hover:bg-secondary hover:text-primary transition-colors"
            >
              Get Instant Quote
            </Link>
            <Link
              to="/shop"
              className="border border-surface/30 text-surface px-8 py-4 rounded-lg hover:bg-surface/10 transition-colors"
            >
              Shop Accessories
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center gap-4 text-surface/80 text-body-sm justify-center lg:justify-start">
            <div className="flex items-center gap-1">
              <span className="text-secondary">★</span>
              <span>4.6/5 rating</span>
            </div>
            <div>10,000+ devices repaired</div>
            <div>4 locations</div>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="flex justify-center lg:justify-end">
          <img
            src={phoneIllustration}
            alt="Illustration of a smartphone undergoing repair"
            className="w-64 sm:w-80 lg:w-96 h-auto opacity-90"
            loading="lazy"
          />
        </div>
      </div>
    </div>,
  ];

  return (
    <section className="snap-start fullpage-section overflow-hidden bg-gradient-to-b from-primary via-secondary/30 to-secondary/40">
      <MultiSlideReel reelId="hero" showHint={false} mode="vertical">
        {slides}
      </MultiSlideReel>
    </section>
  );
}
