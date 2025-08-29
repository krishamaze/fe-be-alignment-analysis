import Navbar from './components/common/Navbar';
import EcommerceNavbar from './components/ecommerce/Navbar';
import Footer from './components/common/Footer';
import Hero from '../src/pages/Hero';
import TeamLogin from './pages/internal/TeamLogin';
import Signup from './pages/customers/Signup';
import Login from './pages/customers/Login';
import Account from './pages/customers/Account';
import Orders from './pages/customers/Orders';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard/layout/DashboardLayout';
import { useAppSelector } from './redux/hook';
import { selectAuthToken, selectAuthRole } from './redux/slice/authSlice';
import { useLocation } from 'react-router-dom';
// import AddStore from './pages/AddStore';
// import AddUser from './pages/AddUser';
import User from './pages/internal/User';
import GiveawayRedemption from './pages/internal/GiveawayRedemption';
import { Toaster } from 'react-hot-toast';
import Store from './pages/internal/Store';
import BrandDashboard from './pages/internal/BrandDashboard';
import BookingsDashboard from './pages/internal/BookingsDashboard';
import Settings from './pages/internal/Settings';
import ProductsDashboard from './pages/internal/ProductsDashboard';
import VariantsDashboard from './pages/internal/VariantsDashboard';
import TaxonomyDashboard from './pages/internal/TaxonomyDashboard';
import UnitsDashboard from './pages/internal/UnitsDashboard';
import QualitiesDashboard from './pages/internal/QualitiesDashboard';
import LogsDashboard from './pages/internal/LogsDashboard';
import FocusLayout from './components/layout/FocusLayout';
import Workledger from './pages/internal/Workledger';
import WorkledgerDetails from './pages/internal/WorkledgerDetails';
import IndexPage from './pages/Index';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import Locate from './pages/public/Locate';
import Legal from './pages/public/Legal';
import Careers from './pages/public/Careers';
import Offers from './pages/public/Offers';
import ScheduleCall from './pages/internal/ScheduleCall';
import Stores from './pages/internal/Stores';
import StoreDetails from './pages/internal/StoreDetails';
import Spares from './pages/internal/Spares';
import Bookings from './pages/internal/Bookings';
import IssuesDashboard from './pages/internal/IssuesDashboard';
import OtherIssuesDashboard from './pages/internal/OtherIssuesDashboard';
import QuestionsDashboard from './pages/internal/QuestionsDashboard';

// E-commerce pages
import Shop from './pages/ecommerce/Shop';
import DepartmentsPage from './pages/ecommerce/DepartmentsPage';
import DepartmentCategoriesPage from './pages/ecommerce/DepartmentCategoriesPage';
import CategoryPage from './pages/ecommerce/CategoryPage';
import ProductDetail from './pages/ecommerce/ProductDetail';
import CartPage from './pages/ecommerce/CartPage';
import Partners from './pages/ecommerce/Partners';
import HelpCentre from './pages/ecommerce/HelpCentre';

function AppContent() {
  const token = useAppSelector(selectAuthToken);
  const role = useAppSelector(selectAuthRole);
  const location = useLocation();

  // Check if current route is e-commerce related
  const isEcommerceRoute =
    location.pathname === '/' ||
    location.pathname.startsWith('/shop') ||
    location.pathname.startsWith('/departments') ||
    location.pathname.startsWith('/cart') ||
    location.pathname.startsWith('/partners') ||
    location.pathname.startsWith('/help') ||
    location.pathname.startsWith('/legal') ||
    location.pathname.startsWith('/about') ||
    location.pathname.startsWith('/contact') ||
    location.pathname.startsWith('/locate') ||
    location.pathname.startsWith('/offers') ||
    location.pathname.startsWith('/careers') ||
    location.pathname.startsWith('/signup') ||
    location.pathname.startsWith('/login') ||
    location.pathname.startsWith('/account') ||
    location.pathname.startsWith('/orders') ||
    location.pathname.startsWith('/teamlogin');

  return (
    <>
      {!location.pathname.startsWith('/dashboard') &&
        (isEcommerceRoute ? <EcommerceNavbar /> : <Navbar />)}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route
          path="/teamlogin"
          element={token ? <Navigate to="/dashboard" /> : <TeamLogin />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/account"
          element={token ? <Account /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/orders"
          element={token ? <Orders /> : <Navigate to="/login" replace />}
        />

        {/* E-commerce routes */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:slug" element={<ProductDetail />} />
        <Route path="/departments" element={<DepartmentsPage />} />
        <Route
          path="/departments/:deptSlug/categories"
          element={<DepartmentCategoriesPage />}
        />
        <Route
          path="/departments/:deptSlug/:catSlug/:subcatSlug/products"
          element={<CategoryPage />}
        />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/help" element={<HelpCentre />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/marketing" element={<IndexPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/locate" element={<Locate />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/stores/:id" element={<StoreDetails />} />
        <Route path="/spares" element={<Spares />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route
          path="/terms-and-conditions"
          element={<Navigate to="/legal" replace />}
        />
        <Route path="/schedule-call" element={<ScheduleCall />} />

        <Route
          path="/workledger/*"
          element={
            token &&
            ['system_admin', 'branch_head', 'advisor'].includes(role) ? (
              <FocusLayout title="Workledger" />
            ) : (
              <Navigate to="/teamlogin" />
            )
          }
        >
          <Route index element={<Workledger />} />
          <Route path="details/:id" element={<WorkledgerDetails />} />
        </Route>

        <Route
          path="/giveaway-redemption"
          element={
            token &&
            ['system_admin', 'branch_head', 'advisor'].includes(role) ? (
              <FocusLayout title="Giveaway Redemption" />
            ) : (
              <Navigate to="/teamlogin" />
            )
          }
        >
          <Route index element={<GiveawayRedemption />} />
        </Route>

        <Route
          path="/dashboard"
          element={token ? <Dashboard /> : <Navigate to="/teamlogin" />}
        >
          {['system_admin'].includes(role) && (
            <>
              {/* <Route path="stores/add" element={<AddStore />} /> */}
              <Route path="users" element={<User />} />
              {/* <Route path="users/add" element={<AddUser />} /> */}
              <Route path="stores" element={<Store />} />
              <Route path="brands" element={<BrandDashboard />} />
              <Route path="products" element={<ProductsDashboard />} />
              <Route path="variants" element={<VariantsDashboard />} />
              <Route path="taxonomy" element={<TaxonomyDashboard />} />
              <Route path="units" element={<UnitsDashboard />} />
              <Route path="qualities" element={<QualitiesDashboard />} />
              <Route path="bookings" element={<BookingsDashboard />} />
              <Route path="repairs">
                <Route path="issues" element={<IssuesDashboard />} />
                <Route path="other-issues" element={<OtherIssuesDashboard />} />
                <Route path="questions" element={<QuestionsDashboard />} />
              </Route>
              <Route path="settings" element={<Settings />} />
              <Route path="logs" element={<LogsDashboard />} />
            </>
          )}
        </Route>
        {/* <Route path="*" element={<Navigate to="/" />} /> */}
      </Routes>
      {!location.pathname.startsWith('/dashboard') && <Footer />}
    </>
  );
}
export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        toastOptions={{
          className:
            'bg-surface dark:bg-primary text-primary dark:text-surface',
        }}
      />
      <AppContent />
    </BrowserRouter>
  );
}
