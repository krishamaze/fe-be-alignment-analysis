import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import {
  Home,
  Wrench,
  ShoppingBag,
  ShoppingCart,
  User,
  Search,
} from 'lucide-react';

const promoMessages = [
  '🔥 Free Shipping',
  '100% Secure Payments',
  'Special Offers',
];

export default function Navbar() {
  const [promoIndex, setPromoIndex] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);
  const location = useLocation();

  // Rotate promo messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close account menu on route change
  useEffect(() => {
    setAccountOpen(false);
  }, [location.pathname]);

  const navLinkClasses =
    'relative px-3 py-2 text-sm text-primary after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-secondary after:w-0 after:transition-all hover:after:w-full';

  const iconClasses =
    'w-5 h-5 transition transform hover:opacity-80 hover:scale-110';

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
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Promo Bar */}
      <div className="h-8 bg-secondary text-white flex items-center justify-between px-4 text-xs md:text-sm">
        <span className="transition-opacity duration-500" key={promoIndex}>
          {promoMessages[promoIndex]}
        </span>
        <Link
          to="/offers"
          className="underline hover:opacity-80 transition-opacity"
        >
          Offers
        </Link>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-sm h-[70px] flex items-center justify-between px-4 md:px-8">
        {/* Desktop: Logo + Links + Icons */}
        <div className="flex items-center gap-8 w-full">
          <Logo />
          <ul className="hidden md:flex gap-6 mx-auto">
            <li>
              <NavLink to="/shop" className={navLinkClasses}>
                Shop
              </NavLink>
            </li>
            <li>
              <NavLink to="/repair" className={navLinkClasses}>
                Repair
              </NavLink>
            </li>
            <li>
              <NavLink to="/support" className={navLinkClasses}>
                Support
              </NavLink>
            </li>
          </ul>
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/account" className="flex" aria-label="Account">
              <User className={iconClasses} />
            </NavLink>
            <NavLink to="/search" className="flex" aria-label="Search">
              <Search className={iconClasses} />
            </NavLink>
            <NavLink to="/cart" className="flex" aria-label="Cart">
              <ShoppingCart className={iconClasses} />
            </NavLink>
            <Link
              to="/repair"
              className="border border-secondary text-secondary px-4 py-1.5 rounded-full text-sm transition-colors hover:bg-secondary hover:text-white"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* Mobile: Logo + Search */}
        <div className="flex items-center justify-between w-full md:hidden">
          <Logo />
          <NavLink to="/search" className="flex" aria-label="Search">
            <Search className="w-5 h-5" />
          </NavLink>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white flex justify-around py-1 z-50">
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

      {/* Account submenu */}
      {accountOpen && (
        <div className="md:hidden fixed bottom-16 left-0 right-0 mx-4 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <ul className="p-4 text-sm space-y-2">
            <li>
              <NavLink
                to="/account"
                className="block"
                onClick={() => setAccountOpen(false)}
              >
                Profile
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                className="block"
                onClick={() => setAccountOpen(false)}
              >
                Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/wishlist"
                className="block"
                onClick={() => setAccountOpen(false)}
              >
                Wishlist
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/partners"
                className="block"
                onClick={() => setAccountOpen(false)}
              >
                Partners
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/careers"
                className="block"
                onClick={() => setAccountOpen(false)}
              >
                Careers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/privacy"
                className="block"
                onClick={() => setAccountOpen(false)}
              >
                Privacy
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/terms"
                className="block"
                onClick={() => setAccountOpen(false)}
              >
                Terms
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/legal"
                className="block"
                onClick={() => setAccountOpen(false)}
              >
                Legal
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
