import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HiOutlineUserCircle,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import { useAppDispatch, useAppSelector } from '../../../redux/hook';
import { selectAuthUser, selectAuthRole, logoutUser } from '../../../redux/slice/authSlice';
import Logo from '../../common/Logo';

function DashboardNavbar() {
  const user = useAppSelector(selectAuthUser);
  const role = useAppSelector(selectAuthRole);
  const first_name = user?.first_name;
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
      dispatch(logoutUser()).finally(() => {
        navigate('/teamlogin');
      });
  };

  return (
    <nav id="dashboard-navbar" className="bg-white shadow-md fixed top-0 w-full z-20">
      <div className="max-w-[1200px] mx-auto px-6 flex justify-between items-center h-16">
        {/* Left: Logo */}
        <div className="flex items-center gap-4">
          <Logo />
        </div>

        {/* Center: Welcome & Role */}
        <div className="hidden md:flex flex-col text-center">
          <span className="text-lg font-semibold text-gray-800">
            Welcome, {first_name || 'User'}
          </span>
          <span className="text-sm text-gray-600">
            Logged in as <strong>{role}</strong>
          </span>
        </div>

        {/* Right: Profile menu */}
        <div className="relative">
          <button
            type="button"
            aria-label="Profile menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center focus:outline-none"
          >
            <HiOutlineUserCircle className="text-2xl text-gray-600" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white border border-keyline rounded shadow-md">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <HiOutlineArrowRightOnRectangle className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default DashboardNavbar;
