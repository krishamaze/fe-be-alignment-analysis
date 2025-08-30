import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import {
  Home,
  Wrench,
  ShoppingBag,
  ShoppingCart,
  User,
  Search,
  X,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '@/redux/slice/authSlice';

const promoMessages = [
  '🔥 Free Shipping',
  '100% Secure Payments',
  'Special Offers',
];

export default function Navbar() {
  const [promoIndex, setPromoIndex] = useState(0);
  const [accountOpen, setAccountOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
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
    <header className="sticky top-0 left-0 w-full z-50 pt-[env(safe-area-inset-top)]">
      {/* Promo Bar */}
      <div className="h-7 bg-secondary text-white flex items-center justify-between px-4 text-xs md:text-sm">
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
            <button
              onClick={() => setProfileOpen(true)}
              className="flex"
              aria-label="Profile"
            >
              <User className={iconClasses} />
            </button>
            <button
              onClick={() => {
                setSearchOpen(true);
                setTimeout(() => inputRef.current?.focus(), 0);
              }}
              className="flex"
              aria-label="Search"
            >
              <Search className={iconClasses} />
            </button>
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
          <button
            onClick={() => {
              setSearchOpen(true);
              setTimeout(() => inputRef.current?.focus(), 0);
            }}
            className="flex"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white flex justify-around pt-1 pb-[env(safe-area-inset-bottom)] z-50">
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
      {/* Search Overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-4 right-4 hidden md:block text-white"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
          <button
            onClick={() => setSearchOpen(false)}
            className="absolute top-4 right-4 md:hidden text-white text-sm"
          >
            Cancel
          </button>
          <div className="w-full max-w-md px-4">
            <input
              ref={inputRef}
              type="search"
              placeholder="Search..."
              className="w-full p-2 rounded border border-gray-300 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {profileOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 hidden md:flex items-center justify-center">
          <div className="bg-white rounded-md p-6 w-80 relative">
            <button
              onClick={() => setProfileOpen(false)}
              className="absolute top-2 right-2"
              aria-label="Close profile"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4">
              {user && (
                <>
                  <p className="font-medium">{user.username}</p>
                  {user.email && (
                    <p className="text-sm text-gray-600">{user.email}</p>
                  )}
                </>
              )}
            </div>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/orders" onClick={() => setProfileOpen(false)}>
                  Orders
                </NavLink>
              </li>
              <li>
                <NavLink to="/wishlist" onClick={() => setProfileOpen(false)}>
                  Wishlist
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    dispatch(logoutUser());
                    setProfileOpen(false);
                  }}
                >
                  Logout
                </button>
              </li>
            </ul>
            <div className="mt-4 border-t pt-4 text-xs space-y-1">
              <NavLink to="/partners" onClick={() => setProfileOpen(false)}>
                Partners
              </NavLink>
              <NavLink to="/careers" onClick={() => setProfileOpen(false)}>
                Careers
              </NavLink>
              <NavLink to="/policies" onClick={() => setProfileOpen(false)}>
                Policies
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
