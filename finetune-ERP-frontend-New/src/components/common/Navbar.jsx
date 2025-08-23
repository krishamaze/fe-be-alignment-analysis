import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useAppSelector } from '../../redux/hook';
import { selectAuthToken } from '../../redux/slice/authSlice';
import Logo from './Logo';

function Navbar() {
  const token = useAppSelector(selectAuthToken);
  const loginTarget = token ? '/dashboard' : '/teamlogin';
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const isLoginPage = location.pathname === '/teamlogin';
  // Navigation links
  const navLinks = [
    { name: 'About', href: '/about/' },
    { name: 'Locate', href: '/locate/' },
    { name: 'Contact', href: '/contact/' },
    ...(isLoginPage ? [] : [{ name: 'Login', href: loginTarget }]),
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen) setIsOpen(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpen]);

  return (
    <header
      className="bg-white shadow-md fixed top-0 left-0 w-screen z-10"
      style={{ height: 'var(--navbar-height)' }}
    >
      <nav className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-full">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Logo />
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8 text-gray-700 font-medium">
          {navLinks.map((link) => (
            <li className="hover:text-keyline" key={link.name}>
              {link.name === 'Login' ? (
                <Link to={loginTarget}>
                  <button className="bg-black text-white px-4 py-1 rounded hover:bg-gray-800">
                    {token ? 'Dashboard' : 'Login'}
                  </button>
                </Link>
              ) : (
                <Link to={link.href}>{link.name}</Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <div
            ref={buttonRef}
            className="text-3xl cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? '✖' : '☰'}
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="md:hidden bg-white px-6 py-4 space-y-3 shadow-md"
        >
          {navLinks.map((link) =>
            link.name === 'Login' ? (
              <Link key={link.name} to={loginTarget}>
                <button className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
                  {token ? 'Dashboard' : 'Login'}
                </button>
              </Link>
            ) : (
              <Link
                key={link.name}
                to={link.href}
                className="block text-gray-700 hover:text-keyline"
              >
                {link.name}
              </Link>
            )
          )}
        </div>
      )}
    </header>
  );
}
export default Navbar;
