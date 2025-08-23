import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import DashboardBottomNav from './DashboardBottomNav';
import AdminDashboard from '../../../pages/AdminDashboard';
import BranchHeadDashboard from '../../../pages/BranchHeadDashboard';
import AdvisorDashboard from '../../../pages/AdvisorDashboard';
import DashboardNavbar from './DashboardNavbar';
import { useAppSelector } from '../../../redux/hook';
import {
  selectAuthRole,
  selectAuthStatus,
} from '../../../redux/slice/authSlice';

function Dashboard() {
  const role = useAppSelector(selectAuthRole);
  const status = useAppSelector(selectAuthStatus);
  const location = useLocation();
  const isExactDashboard = location.pathname === '/dashboard';
  const [navOpen, setNavOpen] = useState(true);

  // Show spinner if token is not yet loaded from storage
  const isLoading = status === 'loading';

  const renderDashboard = () => {
    switch (role) {
      case 'system_admin':
        return <AdminDashboard />;
      case 'branch_head':
        return <BranchHeadDashboard />;
      case 'advisor':
        return <AdvisorDashboard />;
      default:
        return (
          <p className="text-center text-red-500">
            Invalid role: {role || 'none'}
          </p>
        );
    }
  };

  return (
    <>
      <DashboardNavbar />
      <main className="min-h-screen p-6 bg-gray-50 mt-16 pb-[92px]">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-gray-500"></div>
            <p className="ml-2">Loading...</p>
          </div>
        ) : (
          <>
            {isExactDashboard && renderDashboard()}
            <Outlet />
          </>
        )}
      </main>
      <DashboardBottomNav
        role={role || 'guest'}
        navOpen={navOpen}
        setNavOpen={setNavOpen}
      />
    </>
  );
}

export default Dashboard;
