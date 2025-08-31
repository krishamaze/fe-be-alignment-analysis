import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const promoMessages = [
  '🔥 Free Shipping',
  '100% Secure Payments',
  'Special Offers',
];

export default function TopBar({ mode = 'offers' }) {
  const [promoIndex, setPromoIndex] = useState(0);

  useEffect(() => {
    if (mode !== 'offers') return;
    const interval = setInterval(
      () => setPromoIndex((prev) => (prev + 1) % promoMessages.length),
      4000
    );
    return () => clearInterval(interval);
  }, [mode]);

  const baseClasses =
    'bg-secondary text-white flex items-center justify-center text-xs md:text-sm min-h-[env(safe-area-inset-top,0)]';

  if (mode === 'empty') {
    return (
      <div
        className={baseClasses}
        style={{ paddingTop: 'env(safe-area-inset-top,0)' }}
      />
    );
  }

  if (mode === 'notifications') {
    return (
      <div
        className={`${baseClasses} h-8`}
        style={{ paddingTop: 'env(safe-area-inset-top,0)' }}
      >
        Notifications
      </div>
    );
  }

  // default offers
  return (
    <div
      className={`h-8 px-4 relative ${baseClasses}`}
      style={{ paddingTop: 'env(safe-area-inset-top,0)' }}
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
