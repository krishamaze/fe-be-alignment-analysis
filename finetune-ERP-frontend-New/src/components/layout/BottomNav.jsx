import { NavLink, useLocation } from 'react-router-dom';
import { Home, Wrench, ShoppingBag, ShoppingCart, User } from 'lucide-react';

const allowedPaths = ['/', '/shop', '/repair', '/cart', '/account'];

export default function BottomNav({
  onAccountToggle,
  visible = true,
  keyboardDocked = false,
}) {
  const location = useLocation();
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
        onAccountToggle?.();
      },
    },
  ];

  return (
    <nav
      className={`md:hidden fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white flex justify-around py-1 z-50 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      } ${keyboardDocked ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      style={{
        height: 'var(--bottombar-h)',
        transition: 'transform 0.2s ease, opacity 0.2s ease',
      }}
    >
      {/* eslint-disable-next-line no-unused-vars */}
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
  );
}
