import { useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { User, Search, ShoppingCart } from 'lucide-react';

export default function MainNav() {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      document.documentElement.style.setProperty(
        '--mainnav-h',
        `${ref.current.offsetHeight}px`
      );
    }
  }, []);

  const navLinkClasses =
    'relative px-3 py-2 text-sm text-primary after:absolute after:left-0 after:-bottom-0.5 after:h-0.5 after:bg-secondary after:w-0 after:transition-all hover:after:w-full';

  const iconClasses =
    'w-5 h-5 transition transform hover:opacity-80 hover:scale-110';

  return (
    <nav
      id="mainnav"
      ref={ref}
      className="flex-shrink-0 bg-white shadow-sm flex items-center justify-between px-4 md:px-8 z-50 h-14"
    >
      {/* Left: Logo */}
      <Logo />

      {/* Center: Nav links (desktop only) */}
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

      {/* Right: Icons + CTA */}
      <div className="flex items-center gap-4">
        {/* Mobile: only Search */}
        <NavLink to="/search" className="flex md:hidden" aria-label="Search">
          <Search className="w-5 h-5" />
        </NavLink>

        {/* Desktop: full icon set + CTA */}
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
    </nav>
  );
}
