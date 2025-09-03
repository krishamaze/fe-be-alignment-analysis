import { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Wrench, ShoppingBag, ShoppingCart, User } from 'lucide-react';

const rootPaths = ['/', '/shop', '/repair', '/cart', '/account'];

export default function BottomNav() {
  const location = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);
  const navRef = useRef(null);

  // close account dropdown on route change
  useEffect(() => {
    setAccountOpen(false);
  }, [location.pathname]);

  // Measure nav height once and set CSS var
  useEffect(() => {
    if (navRef.current) {
      const h = navRef.current.offsetHeight;
      document.documentElement.style.setProperty('--bottombar-h', `${h}px`);
    }
  }, []);

  // Only show nav on allowed root paths
  if (!rootPaths.some((path) => location.pathname.startsWith(path))) {
    return null;
  }

  const bottomTabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/repair', label: 'Repair', icon: Wrench },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/cart', label: 'Cart', icon: ShoppingCart },
    {
      to: '/account',
      label: 'Account',
      icon: User,
      custom: true, // toggle dropdown
    },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className="
          bottom-nav
          md:hidden fixed bottom-0 inset-x-0 z-50
          flex justify-around items-center
          border-t border-outline bg-surface
          transition-transform duration-300
          py-1
        "
        style={{
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {bottomTabs.map(({ to, label, icon, custom }) => {
          const Icon = icon;

          if (custom) {
            return (
              <button
                key={label}
                type="button"
                onClick={() => setAccountOpen((o) => !o)}
                className="flex flex-col items-center gap-0.5 text-xs pt-1 pb-0.5 text-onSurface"
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </button>
            );
          }

          return (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 text-xs pt-1 pb-0.5 ${
                  isActive ? 'text-secondary' : 'text-onSurface'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </nav>

      {accountOpen && (
        <div
          className="
            md:hidden fixed left-0 right-0 mx-4
            bg-surface border border-outline rounded-lg shadow-lg
            z-40
          "
          style={{
            bottom:
              'calc(var(--bottombar-h) + env(safe-area-inset-bottom) + 0.5rem)',
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
