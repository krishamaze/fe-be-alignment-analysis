import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useScrollMode } from '@/components/layout/ScrollModeContext';
import { Home, Wrench, ShoppingBag, ShoppingCart, User } from 'lucide-react';

const ROOT_PATHS = ['/', '/shop', '/repair', '/cart', '/account'];

export default function BottomNav() {
  const location = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);
  const { bottomNavVisible } = useScrollMode();
  const ref = useRef(null);
  // Close account dropdown on route change
  useEffect(() => {
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!ref.current) return;

    const updateHeight = () => {
      document.documentElement.style.setProperty(
        '--bottomnav-h',
        `${ref.current.offsetHeight}px`
      );
    };

    updateHeight();

    const observer = new ResizeObserver(updateHeight);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  // Only show nav on allowed root paths
  if (!ROOT_PATHS.some((p) => location.pathname.startsWith(p))) {
    return null;
  }

  const tabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/repair', label: 'Repair', icon: Wrench },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/cart', label: 'Cart', icon: ShoppingCart },
    { to: '/account', label: 'Account', icon: User, custom: true },
  ];

  return (
    <>
      <nav
        ref={ref}
        role="navigation"
        aria-label="Primary bottom navigation"
        className={`
          bottom-nav
          fixed bottom-0 inset-x-0 z-50
          md:hidden
          flex justify-around items-center
          border-t border-outline bg-surface
          h-14
          flex-shrink-0
          transition-transform duration-300
          ${bottomNavVisible ? '' : 'translate-y-full'}
        `}
        style={{
          paddingBottom: 'env(safe-area-inset-bottom, 0)',
        }}
      >
        {tabs.map(({ to, label, icon, custom }) => {
          const Icon = icon;
          return custom ? (
            <button
              key={label}
              type="button"
              aria-haspopup="menu"
              aria-expanded={accountOpen}
              onClick={() => setAccountOpen((o) => !o)}
              className="flex flex-col items-center gap-0.5 text-xs text-onSurface outline-none focus:opacity-90"
            >
              <Icon className="w-5 h-5" aria-hidden />
              <span>{label}</span>
            </button>
          ) : (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 text-xs outline-none focus:opacity-90 ${
                  isActive ? 'text-secondary' : 'text-onSurface'
                }`
              }
              aria-label={label}
            >
              <Icon className="w-5 h-5" aria-hidden />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {accountOpen && (
        <div
          className="
            md:hidden absolute left-0 right-0 mx-4
            bg-surface border border-outline rounded-lg shadow-lg
            z-[60]
          "
          // Position the menu just above the nav, respecting safe area.
          style={{
            bottom: 'calc(56px + env(safe-area-inset-bottom, 0) + 8px)',
          }}
        >
          <ul className="p-4 text-sm space-y-2">
            {[
              { to: '/account', label: 'Profile' },
              { to: '/orders', label: 'Orders' },
              { to: '/wishlist', label: 'Wishlist' },
              { to: '/partners', label: 'Partners' },
              { to: '/careers', label: 'Careers' },
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms', label: 'Terms' },
              { to: '/legal', label: 'Legal' },
            ].map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className="block hover:text-secondary"
                  onClick={() => setAccountOpen(false)}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
