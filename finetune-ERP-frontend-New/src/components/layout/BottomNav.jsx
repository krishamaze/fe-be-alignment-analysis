import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Wrench, ShoppingBag, ShoppingCart, User } from 'lucide-react';

const allowedPaths = ['/', '/shop', '/repair', '/cart', '/account'];

export default function BottomNav({ visible = true }) {
  const location = useLocation();
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    setAccountOpen(false);
  }, [location.pathname]);

  if (!allowedPaths.includes(location.pathname)) return null;

  const bottomTabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/repair', label: 'Repair', icon: Wrench },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/cart', label: 'Cart', icon: ShoppingCart },
    {
      to: '/account',
      label: 'Account',
      icon: User,
      onClick: (e) => {
        e.preventDefault();
        setAccountOpen((o) => !o);
      },
    },
  ];

  return (
    <>
      <nav
        className={`md:hidden fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white flex justify-around py-1 z-50 ${
          visible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{
          height: 'var(--bottombar-h)',
          transition: 'transform 0.2s ease, opacity 0.2s ease',
        }}
      >
        {bottomTabs.map(({ to, label, icon, onClick }) => {
          const Icon = icon;
          return (
            <NavLink
              key={label}
              to={to}
              onClick={onClick}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 text-xs pt-1 pb-0.5 ${
                  isActive ? 'text-secondary' : 'text-gray-600'
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
        <div className="md:hidden fixed bottom-16 left-0 right-0 mx-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
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
                  className="block"
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
