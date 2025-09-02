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
          visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{
          height: 'var(--bottombar-h)',
          transition: 'transform 0.2s ease, opacity 0.2s ease',
        }}
      >
        {bottomTabs.map(({ to, label, icon: Icon, onClick }) => (
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
        ))}
      </nav>

      {accountOpen && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 mx-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="p-4 text-sm space-y-2">
            <li>
              <NavLink to="/account" className="block" onClick={() => setAccountOpen(false)}>
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink to="/orders" className="block" onClick={() => setAccountOpen(false)}>
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink to="/wishlist" className="block" onClick={() => setAccountOpen(false)}>
                Wishlist
              </NavLink>
            </li>
            <li>
              <NavLink to="/partners" className="block" onClick={() => setAccountOpen(false)}>
                Partners
              </NavLink>
            </li>
            <li>
              <NavLink to="/careers" className="block" onClick={() => setAccountOpen(false)}>
                Careers
              </NavLink>
            </li>
            <li>
              <NavLink to="/privacy" className="block" onClick={() => setAccountOpen(false)}>
                Privacy
              </NavLink>
            </li>
            <li>
              <NavLink to="/terms" className="block" onClick={() => setAccountOpen(false)}>
                Terms
              </NavLink>
            </li>
            <li>
              <NavLink to="/legal" className="block" onClick={() => setAccountOpen(false)}>
                Legal
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </>
  );
}

