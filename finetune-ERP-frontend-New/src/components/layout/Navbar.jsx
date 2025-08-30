import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
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
import { useAppSelector, useAppDispatch } from '../../redux/hook';
import { logout } from '../../redux/slice/authSlice';

const promoMessages = [
  '🔥 Free Shipping',
  '100% Secure Payments',
  'Special Offers',
];

export default function Navbar() {
  const [promoIndex, setPromoIndex] = useState(0);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  // Rotate promo messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setPromoIndex((prev) => (prev + 1) % promoMessages.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Close overlays on route change
  useEffect(() => {
    setProfileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const navLinkClasses =
    'relative px-3 py-2 text-sm text-primary after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-secondary after:w-0 after:transition-all after:duration-200 after:ease-out hover:after:w-full';

  const iconClasses =
    'w-5 h-5 transition transform hover:opacity-80 hover:scale-110';

  const bottomTabs = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/repair', label: 'Repair', icon: Wrench },
    { to: '/shop', label: 'Shop', icon: ShoppingBag },
    { to: '/cart', label: 'Cart', icon: ShoppingCart },
    { to: '/account', label: 'Account', icon: User },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
    setSearchOpen(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    setProfileOpen(false);
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
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
              type="button"
              onClick={() => setProfileOpen(true)}
              className="flex"
              aria-label="Account"
            >
              <User className={iconClasses} />
            </button>
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
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
            type="button"
            onClick={() => setSearchOpen(true)}
            className="flex"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full border-t border-gray-200 bg-white flex justify-around py-1 pb-[env(safe-area-inset-bottom)] z-50">
        {/* eslint-disable-next-line no-unused-vars */}
        {bottomTabs.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
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

      {/* Search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md mt-20 p-4 rounded relative">
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute top-3 right-3 text-gray-500"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button>
            <form onSubmit={handleSearch}>
              <input
                ref={searchRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full border-b border-gray-300 focus:border-secondary focus:outline-none p-2"
              />
            </form>
          </div>
        </div>
      )}

      {/* Profile modal */}
      {profileOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50">
          <div className="bg-white w-64 mt-16 mr-4 rounded shadow-lg p-4 relative">
            <button
              type="button"
              onClick={() => setProfileOpen(false)}
              className="absolute top-2 right-2 text-gray-500"
              aria-label="Close profile"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="mb-4 text-sm font-semibold">
              Hi, {user?.username || 'Guest'}
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <NavLink to="/account" onClick={() => setProfileOpen(false)}>
                  Profile
                </NavLink>
              </li>
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
                  type="button"
                  onClick={handleLogout}
                  className="text-left w-full"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
