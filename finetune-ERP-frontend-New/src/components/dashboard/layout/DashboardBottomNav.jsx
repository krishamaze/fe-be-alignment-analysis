import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HiOutlineComputerDesktop,
  HiOutlineCog,
  HiOutlineBuildingStorefront,
  HiOutlineUsers,
  HiOutlineGift,
  HiOutlineTag,
  HiOutlineCube,
  HiOutlineSquares2X2,
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineXMark,
  HiOutlineEllipsisHorizontal,
} from 'react-icons/hi2';
import { useAppDispatch } from '../../../redux/hook';
import { logoutUser } from '../../../redux/slice/authSlice';

export default function DashboardBottomNav({ role, navOpen, setNavOpen }) {
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [moreOpen, setMoreOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser()).finally(() => {
      navigate('/teamlogin');
    });
  };

  const adminNavItems = [
    {
      to: '/dashboard',
      icon: <HiOutlineComputerDesktop size={18} />,
      label: 'Dashboard',
    },
    {
      to: '/dashboard/settings',
      icon: <HiOutlineCog size={18} />,
      label: 'Settings',
    },
    {
      to: '/dashboard/stores',
      icon: <HiOutlineBuildingStorefront size={18} />,
      label: 'Stores',
    },
    {
      to: '/dashboard/brands',
      icon: <HiOutlineTag size={18} />,
      label: 'Brands',
    },
    {
      to: '/dashboard/products',
      icon: <HiOutlineCube size={18} />,
      label: 'Products',
    },
    {
      to: '/dashboard/variants',
      icon: <HiOutlineSquares2X2 size={18} />,
      label: 'Variants',
    },
    {
      to: '/dashboard/users',
      icon: <HiOutlineUsers size={18} />,
      label: 'Users',
    },
    {
      to: '/giveaway-redemption',
      icon: <HiOutlineGift size={18} />,
      label: 'Giveaway',
    },
  ];

  const allNavItems = {
    system_admin: adminNavItems,
    branch_head: [
      {
        to: '/dashboard',
        icon: <HiOutlineComputerDesktop size={18} />,
        label: 'Dashboard',
      },
      {
        to: '/dashboard/settings',
        icon: <HiOutlineCog size={18} />,
        label: 'Settings',
      },
      {
        to: '/dashboard/stores',
        icon: <HiOutlineBuildingStorefront size={18} />,
        label: 'Stores',
      },
    ],
    advisor: [
      {
        to: '/dashboard',
        icon: <HiOutlineComputerDesktop size={18} />,
        label: 'Dashboard',
      },
      {
        to: '/dashboard/stores',
        icon: <HiOutlineBuildingStorefront size={18} />,
        label: 'Stores',
      },
    ],
  };

  const navItems = allNavItems[role] || [];
  const visibleItems = navItems.slice(0, 5);
  const extraItems = navItems.slice(5);

  return (
    <>
      <nav
        aria-label="Dashboard navigation"
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-keyline transition-transform duration-300 ${
          navOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 p-2">
          {visibleItems.map(({ to, icon, label }) => (
            <Link
              key={to}
              to={to}
              aria-label={label}
              className={`flex flex-col items-center justify-center h-16 rounded text-xs font-medium ${
                pathname === to ? 'text-keyline' : 'text-gray-700'
              } hover:text-keyline`}
              onClick={() => setMoreOpen(false)}
            >
              {icon}
              <span className="mt-1">{label}</span>
            </Link>
          ))}
          {extraItems.length > 0 && (
            <button
              type="button"
              aria-label="More"
              onClick={() => setMoreOpen(!moreOpen)}
              className="flex flex-col items-center justify-center h-16 rounded text-xs font-medium text-gray-700 hover:text-keyline"
            >
              <HiOutlineEllipsisHorizontal size={18} />
              <span className="mt-1">More</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Logout"
            className="flex flex-col items-center justify-center h-16 rounded text-xs font-medium text-gray-700 hover:text-keyline"
          >
            <HiOutlineArrowRightOnRectangle size={18} />
            <span className="mt-1">Logout</span>
          </button>
        </div>
        {moreOpen && (
          <div className="absolute bottom-20 left-0 right-0 mx-auto max-w-xs bg-white border border-keyline rounded shadow p-2">
            {extraItems.map(({ to, icon, label }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 p-2 rounded ${
                  pathname === to ? 'text-keyline' : 'text-gray-700'
                } hover:text-keyline`}
                onClick={() => setMoreOpen(false)}
              >
                {icon}
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </nav>

      <button
        type="button"
        onClick={() => setNavOpen(!navOpen)}
        aria-label="Toggle navigation"
        aria-expanded={navOpen}
        className="fixed bottom-4 right-4 z-50 p-3 bg-white border border-keyline rounded-full shadow focus:outline-none focus:ring-2 focus:ring-keyline"
      >
        {navOpen ? <HiOutlineXMark size={20} /> : <HiOutlineBars3 size={20} />}
      </button>
    </>
  );
}
