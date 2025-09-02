import { Link } from 'react-router-dom';

const promoMessages = [
  '🔥 Free Shipping',
  '100% Secure Payments',
  'Special Offers',
];

export default function TopBar({ mode = 'offers' }) {
  const baseClasses =
    'bg-secondary text-white flex items-center justify-center text-xs md:text-sm';

  if (mode === 'empty') {
    return (
      <div
        className={baseClasses}
        style={{
          height: 'var(--topbar-h)', // 👈 dynamic spacer height
          paddingTop: 'env(safe-area-inset-top,0)',
        }}
      />
    );
  }

  if (mode === 'notifications') {
    return (
      <div
        className={baseClasses}
        style={{
          height: 'var(--topbar-h)',
          paddingTop: 'env(safe-area-inset-top,0)',
        }}
      >
        Notifications
      </div>
    );
  }

  // default offers
  return (
    <div
      className={`px-2 relative ${baseClasses}`}
      style={{
        height: 'var(--topbar-h)', // 👈 always controlled by hook
        paddingTop: 'env(safe-area-inset-top,0)',
      }}
    >
      <span>🔥 Free Shipping</span>
      <Link
        to="/offers"
        className="absolute right-4 underline hover:opacity-80 transition-opacity"
      >
        Offers
      </Link>
    </div>
  );
}
