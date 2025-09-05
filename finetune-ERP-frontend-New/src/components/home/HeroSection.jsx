import { Link } from 'react-router-dom';
import phoneIllustration from '@/assets/phone-illustration.png';
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineShoppingCart,
  HiOutlinePhone,
  HiOutlineChevronDown,
} from 'react-icons/hi2';
import PageSection from '@/components/common/PageSection';

export default function HeroSection() {
  return (
    <PageSection className="relative min-h-screen bg-gradient-to-r from-black via-amber-600/30 to-yellow-400/40 flex items-center">
      {/* Dark overlay for better text contrast */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Content */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left: Text and CTAs */}
        <div className="text-center lg:text-left">
          {/* Trust eyebrow */}
          <p className="text-gray-300 text-sm sm:text-base mb-3 font-medium">
            Serving Coimbatore & Palakkad • 10+ Years Trusted
          </p>

          {/* Main headline */}
          <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Expert Mobile & Laptop Repairs
          </h1>

          {/* Subheadline */}
          <p className="text-gray-200 text-lg sm:text-xl mb-8 max-w-lg mx-auto lg:mx-0">
            Same-day repairs • Free pickup & delivery • 90-day warranty
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
            <Link
              to="/repair"
              className="min-h-[44px] px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              <HiOutlineWrenchScrewdriver className="w-5 h-5" />
              Get Instant Quote
            </Link>

            <Link
              to="/shop"
              className="min-h-[44px] px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <HiOutlineShoppingCart className="w-5 h-5" />
              Shop Accessories
            </Link>

            <Link
              to="/contact"
              className="min-h-[44px] px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
            >
              <HiOutlinePhone className="w-5 h-5" />
              Schedule a Call
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start text-sm text-gray-200">
            <div className="flex items-center gap-1">
              <span className="text-yellow-400">★</span>
              <span>4.6/5 rating</span>
            </div>
            <div className="hidden sm:block w-px h-4 bg-gray-400" />
            <div>10,000+ devices repaired</div>
            <div className="hidden sm:block w-px h-4 bg-gray-400" />
            <div>4 locations</div>
          </div>
        </div>

        {/* Right: Illustration */}
        <div className="flex justify-center lg:justify-end">
          <div className="relative">
            <img
              src={phoneIllustration}
              alt="Mobile device repair illustration"
              className="w-64 sm:w-80 lg:w-96 h-auto opacity-90"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/80 animate-bounce">
        <HiOutlineChevronDown className="w-6 h-6" />
      </div>
    </PageSection>
  );
}
