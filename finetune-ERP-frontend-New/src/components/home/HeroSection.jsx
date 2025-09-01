import { Link } from 'react-router-dom';
import phoneIllustration from '@/assets/phone-illustration.png';
import {
  HiOutlineWrenchScrewdriver,
  HiOutlineShoppingCart,
  HiOutlinePhone,
  HiOutlineChevronDown,
} from 'react-icons/hi2';

export default function HeroSection() {
  return (
    <section className="relative flex flex-col md:flex-row items-center justify-center min-h-[calc(var(--vh)-var(--topbar-h)-var(--mainnav-h)-var(--bottombar-h))] bg-gradient-to-r from-primary via-secondary to-surface text-surface px-6 py-12">
      {/* Left: Text and CTAs */}
      <div className="md:w-1/2 text-center md:text-left flex flex-col justify-center gap-6">
        <div>
          <h1 className="text-display-md md:text-display-lg font-extrabold">
            We finetune your device.
          </h1>
          <p className="mt-4 text-body-lg">
            Get service at your doorstep — Finetune.Store.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
          <button
            type="button"
            className="flex items-center justify-center gap-2 bg-primary text-surface px-6 py-3 rounded-lg transition hover:opacity-90 hover:scale-105 active:scale-95"
          >
            <HiOutlineWrenchScrewdriver className="text-xl" />
            <span>Book a Repair</span>
          </button>
          <Link
            to="/shop"
            className="flex items-center justify-center gap-2 border border-secondary text-secondary px-6 py-3 rounded-lg transition hover:bg-secondary/10 hover:scale-105 active:scale-95"
          >
            <HiOutlineShoppingCart className="text-xl" />
            <span>Shop Now</span>
          </Link>
          <Link
            to="/schedule-call"
            className="flex items-center justify-center gap-2 border border-secondary text-secondary px-6 py-3 rounded-lg transition hover:bg-secondary/10 hover:scale-105 active:scale-95"
          >
            <HiOutlinePhone className="text-xl" />
            <span>Schedule a Call</span>
          </Link>
        </div>
      </div>

      {/* Right: Illustration */}
      <div className="md:w-1/2 flex justify-center items-center mt-8 md:mt-0">
        <img
          src={phoneIllustration}
          alt="Phone illustration"
          className="w-56 sm:w-64 md:w-80 lg:w-96"
        />
      </div>

      {/* Scroll hint */}
      <HiOutlineChevronDown className="absolute bottom-4 left-1/2 -translate-x-1/2 text-surface animate-bounce" />
    </section>
  );
}
