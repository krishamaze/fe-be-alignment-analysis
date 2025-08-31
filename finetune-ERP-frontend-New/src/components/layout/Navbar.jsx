import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import TopBar from './TopBar';
import MainNav from './MainNav';
import BottomNav from './BottomNav';

export default function Navbar() {
  const [accountOpen, setAccountOpen] = useState(false);
  const location = useLocation();

  // Close account menu on route change
  useEffect(() => {
    setAccountOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      <TopBar mode="offers" />
      <MainNav />
      <BottomNav onAccountToggle={() => setAccountOpen((o) => !o)} />

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
