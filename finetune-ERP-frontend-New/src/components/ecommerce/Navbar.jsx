import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAppSelector } from '../../redux/hook';
import { selectAuthToken } from '../../redux/slice/authSlice';
import { toggleCart } from '../../redux/slice/cartSlice';
import Logo from '../common/Logo';
import {
  HiOutlineShoppingCart,
  HiOutlineUser,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineChevronDown,
} from 'react-icons/hi';
import Cart from './Cart';

function EcommerceNavbar() {
  const token = useAppSelector(selectAuthToken);
  const dispatch = useDispatch();
  const { itemCount } = useAppSelector((state) => state.cart);
  const [isOpen, setIsOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const categoriesRef = useRef(null);

  // Navigation links
  const navLinks = [
    { name: 'Shop Now', href: '/shop' },
    { name: 'All Categories', href: '/categories', hasDropdown: true },
    { name: 'Partners', href: '/partners' },
    { name: 'Help Centre', href: '/help' },
    { name: 'Legal', href: '/legal' },
  ];

  const categories = [
    {
      name: 'Mobiles',
      href: '/categories/mobiles',
      icon: '📱',
      image:
        'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=150&h=100&fit=crop',
    },
    {
      name: 'Laptops',
      href: '/categories/laptops',
      icon: '💻',
      image:
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=150&h=100&fit=crop',
    },
    {
      name: 'Accessories',
      href: '/categories/accessories',
      icon: '🔧',
      image:
        'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=150&h=100&fit=crop',
    },
    {
      name: 'Headphones',
      href: '/categories/headphones',
      icon: '🎧',
      image:
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=150&h=100&fit=crop',
    },
  ];

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target)
      ) {
        setIsCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
      if (isCategoriesOpen) setIsCategoriesOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen, isCategoriesOpen]);

  return (
    <header
      className="bg-white shadow-lg fixed top-0 left-0 w-screen z-50"
      style={{ height: 'var(--navbar-height)' }}
    >
      <nav className="max-w-[1400px] mx-auto flex items-center justify-between px-4 lg:px-6 h-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden lg:flex items-center gap-6 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <li key={link.name} className="relative group">
              {link.hasDropdown ? (
                <div className="relative">
                  <button
                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                    className="flex items-center gap-1 hover:text-keyline transition-colors"
                  >
                    {link.name}
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  {/* Categories Dropdown */}
                  {isCategoriesOpen && (
                    <div
                      ref={categoriesRef}
                      className="absolute top-full left-0 mt-2 w-80 bg-white shadow-xl rounded-lg border border-gray-100 py-3 z-50"
                    >
                      <div className="grid grid-cols-2 gap-2 p-3">
                        {categories.map((category) => (
                          <Link
                            key={category.name}
                            to={category.href}
                            className="flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            onClick={() => setIsCategoriesOpen(false)}
                          >
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">
                              {category.name}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to={link.href}
                  className="hover:text-keyline transition-colors"
                >
                  {link.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Right Side - Auth & Cart */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Cart Icon */}
          <div className="relative">
            <button
              onClick={() => dispatch(toggleCart())}
              className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <HiOutlineShoppingCart className="w-6 h-6 text-gray-700" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </button>
            <Link
              to="/cart"
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 hover:text-keyline whitespace-nowrap"
            >
              {/* View Cart */}
            </Link>
          </div>

          {/* Auth Buttons */}
          {token ? (
            <Link to="/dashboard">
              <button className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                <HiOutlineUser className="w-5 h-5" />
                Dashboard
              </button>
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login">
                <button className="text-gray-700 hover:text-keyline font-medium transition-colors">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-900 transition-colors">
                  Sign Up
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={() => dispatch(toggleCart())}
            className="relative p-2"
          >
            <HiOutlineShoppingCart className="w-6 h-6 text-gray-700" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          <button
            ref={buttonRef}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <HiOutlineX className="w-6 h-6 text-gray-700" />
            ) : (
              <HiOutlineMenu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="lg:hidden bg-white border-t border-gray-200 shadow-lg max-h-[80vh] overflow-y-auto"
        >
          <div className="px-4 py-6 space-y-6">
            {/* Categories Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-sm">
                  Categories
                </h3>
                <HiOutlineChevronDown className="w-4 h-4 text-gray-500" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    to={category.href}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-gray-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="w-10 h-8 rounded-md overflow-hidden bg-gray-200 flex-shrink-0">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="font-medium text-sm text-gray-700">
                      {category.name}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">
                Quick Actions
              </h3>
              {navLinks
                .filter((link) => !link.hasDropdown)
                .map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="flex items-center justify-between p-2.5 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="text-gray-700 font-medium text-sm">
                      {link.name}
                    </span>
                    <HiOutlineChevronDown className="w-3 h-3 text-gray-500 rotate-[-90deg]" />
                  </Link>
                ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900 text-sm">
                  Cart Items
                </span>
                <span className="bg-black text-white text-xs font-medium px-2 py-1 rounded-full">
                  {itemCount}
                </span>
              </div>
              <button
                onClick={() => {
                  dispatch(toggleCart());
                  setIsOpen(false);
                }}
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition-colors text-xs font-medium"
              >
                {/* View Cart */}
              </button>
            </div>

            {/* Auth Section */}
            <div className="pt-3 border-t border-gray-200">
              {token ? (
                <Link to="/dashboard">
                  <button className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-900 transition-colors font-medium text-sm">
                    Go to Dashboard
                  </button>
                </Link>
              ) : (
                <div className="space-y-2">
                  <Link to="/login">
                    <button className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-gray-900 transition-colors font-medium text-sm">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Component */}
      <Cart />
    </header>
  );
}

export default EcommerceNavbar;
