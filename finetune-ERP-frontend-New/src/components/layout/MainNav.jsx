import { useRef, useLayoutEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { User, Search, ShoppingCart } from 'lucide-react';

export default function MainNav() {
  const navRef = useRef(null);

  // Dynamically update --mainnav-h
  useLayoutEffect(() => {
    const updateHeight = () => {
      if (navRef.current) {
        document.documentElement.style.setProperty(
          '--mainnav-h',
          `${navRef.current.offsetHeight}px`
        );
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const navLinkClasses =
    'relative px-3 py-2 text-sm text-primary after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-secondary after:w-0 after:transition-all hover:after:w-full';

  const iconClasses =
    'w-5 h-5 transition transform hover:opacity-80 hover:scale-110';

  return (
    <nav
      ref={navRef}
      className="bg-white shadow-sm min-h-[70px] flex items-center justify-between px-4 md:px-8"
    >
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
  );
}
