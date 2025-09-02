import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const promoMessages = [
  '🔥 Free Shipping',
  '100% Secure Payments',
  'Special Offers',
];

export default function TopBar({ mode = 'offers' }) {
  const [promoIndex, setPromoIndex] = useState(0);
  const barRef = useRef(null);

  useEffect(() => {
    if (mode !== 'offers') return;
    const interval = setInterval(
      () => setPromoIndex((prev) => (prev + 1) % promoMessages.length),
      4000
    );
    return () => clearInterval(interval);
  }, [mode]);

  const baseClasses =
    'bg-secondary text-white flex items-center justify-center text-xs md:text-sm';

  if (mode === 'empty') {
    return (
      <div
        ref={barRef}
        className={baseClasses}
        style={{
          paddingTop: 'env(safe-area-inset-top,0)',
          minHeight: 'var(--topbar-h)',
        }}
      />
    );
  }

  if (mode === 'notifications') {
    return (
      <div
        ref={barRef}
        className={baseClasses}
        style={{
          paddingTop: 'env(safe-area-inset-top,0)',
          minHeight: 'var(--topbar-h)',
        }}
      >
        Notifications
      </div>
    );
  }

  // default offers
  return (
    <div
      ref={barRef}
      className={`px-4 relative ${baseClasses}`}
      style={{
        paddingTop: 'env(safe-area-inset-top,0)',
        minHeight: 'var(--topbar-h)',
      }}
    >
      <span className="transition-opacity duration-500" key={promoIndex}>
        {promoMessages[promoIndex]}
      </span>
      <Link
        to="/offers"
        className="absolute right-4 underline hover:opacity-80 transition-opacity"
      >
        Offers
      </Link>
    </div>
  );
}
