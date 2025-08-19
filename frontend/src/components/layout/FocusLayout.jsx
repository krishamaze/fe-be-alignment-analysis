import { Outlet, useNavigate } from 'react-router-dom';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import DashboardNavbar from '../dashboard/layout/DashboardNavbar';

function FocusLayout({ title = '' }) {
  const navigate = useNavigate();

  return (
    <div className="bg-surface min-h-screen">
      <DashboardNavbar />
      <div className="mt-16">
        <header className="flex items-center gap-2 p-4 border-b border-keyline bg-white">
          <button
            onClick={() => (window.history.length > 1 ? navigate(-1) : navigate('/dashboard'))}
            className="p-1"
          >
            <HiOutlineArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
        </header>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default FocusLayout;
