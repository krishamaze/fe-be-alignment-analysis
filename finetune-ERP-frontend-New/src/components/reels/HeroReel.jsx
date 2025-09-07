import { Link } from 'react-router-dom';
import MultiSlideReel from '@/components/layout/MultiSlideReel';
import phoneIllustration from '@/assets/phone-illustration.png';

export default function HeroReel() {
  return (
    <section className="snap-start fullpage-section relative overflow-hidden bg-gradient-to-r from-black via-amber-600/30 to-yellow-400/40 flex items-center">
      <MultiSlideReel reelId="hero" showHint={false}>
        <>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto px-4">
            {/* Left: Text and CTAs */}
            <div className="text-center lg:text-left">
              <p className="text-gray-300 text-sm sm:text-base mb-3 font-medium">
                Serving Coimbatore & Palakkad • 10+ Years Trusted
              </p>
              <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
                Expert Mobile & Laptop Repairs
              </h1>
              <p className="text-gray-200 text-lg sm:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
                Same-day repairs • Free pickup & delivery • 90-day warranty
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Link
                  to="/repair"
                  className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 hover:text-gray-900 transition-colors"
                >
                  Get Instant Quote
                </Link>
                <Link
                  to="/shop"
                  className="border border-white/30 text-white px-8 py-4 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Shop Accessories
                </Link>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-6 text-gray-300 text-sm justify-center lg:justify-start">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400">★</span>
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
                alt="Mobile device repair illustration"
                className="w-64 sm:w-80 lg:w-96 h-auto opacity-90"
                loading="lazy"
              />
            </div>
          </div>
        </>
      </MultiSlideReel>
    </section>
  );
}
