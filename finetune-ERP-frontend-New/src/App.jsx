import Navbar from './components/common/Navbar';
import EcommerceNavbar from './components/ecommerce/Navbar';
import Footer from './components/common/Footer';
import Hero from '../src/pages/Hero';
import TeamLogin from './components/auth/TeamLogin';
import Signup from './components/ecommerce/Signup';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/dashboard/layout/DashboardLayout';
import { useAppSelector } from './redux/hook';
import { selectAuthToken, selectAuthRole } from './redux/slice/authSlice';
import { useLocation } from 'react-router-dom';
// import AddStore from './pages/AddStore';
// import AddUser from './pages/AddUser';
import User from './pages/User';
import GiveawayRedemption from './pages/GiveawayRedemption';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Store from './pages/Store';
import Settings from './pages/Settings';
import FocusLayout from './components/layout/FocusLayout';
import Workledger from './pages/Workledger';
import WorkledgerDetails from './pages/WorkledgerDetails';
import IndexPage from './pages/Index';
import About from './pages/About';
import Contact from './pages/Contact';
import Locate from './pages/Locate';
import Terms from './pages/Terms';
import ScheduleCall from './pages/ScheduleCall';
import Stores from './pages/Stores';
import StoreDetails from './pages/StoreDetails';
import Spares from './pages/Spares';

// E-commerce pages
import Shop from './pages/ecommerce/Shop';
import CategoryPage from './pages/ecommerce/CategoryPage';
import ProductDetail from './pages/ecommerce/ProductDetail';
import CartPage from './pages/ecommerce/CartPage';
import Partners from './pages/ecommerce/Partners';
import HelpCentre from './pages/ecommerce/HelpCentre';
import Legal from './pages/ecommerce/Legal';


function AppContent() {
  const token = useAppSelector(selectAuthToken);
  const role = useAppSelector(selectAuthRole);
  const location = useLocation();

  // Check if current route is e-commerce related
  const isEcommerceRoute = location.pathname === "/" ||
                          location.pathname.startsWith('/shop') ||
                          location.pathname.startsWith('/categories') ||
                          location.pathname.startsWith('/partners') ||
                          location.pathname.startsWith('/help') ||
                          location.pathname.startsWith('/legal') ||
                          location.pathname.startsWith('/signup') ||
                          location.pathname.startsWith('/teamlogin') ||
                          location.pathname.startsWith('/login');

  return (
    <>
      {!location.pathname.startsWith('/dashboard') && (
        isEcommerceRoute ? <EcommerceNavbar /> : <Navbar />
      )}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/teamlogin" element={token ? <Navigate to="/dashboard" /> : <TeamLogin />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* E-commerce routes */}
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:productId" element={<ProductDetail />} />
        <Route path="/categories/:categoryId" element={<CategoryPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/partners" element={<Partners />} />
        <Route path="/help" element={<HelpCentre />} />
        <Route path="/legal" element={<Legal />} />
        <Route path="/marketing" element={<IndexPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/locate" element={<Locate />} />
        <Route path="/stores" element={<Stores />} />
        <Route path="/stores/:id" element={<StoreDetails />} />
        <Route path="/spares" element={<Spares />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/schedule-call" element={<ScheduleCall />} />

        <Route
          path="/workledger/*"
          element={
            token && ['system_admin', 'branch_head', 'advisor'].includes(role)
              ? <FocusLayout title="Workledger" />
              : <Navigate to="/teamlogin" />
          }
        >
          <Route index element={<Workledger />} />
          <Route path="details/:id" element={<WorkledgerDetails />} />
        </Route>

        <Route
          path="/giveaway-redemption"
          element={
            token && ['system_admin', 'branch_head', 'advisor'].includes(role)
              ? <FocusLayout title="Giveaway Redemption" />
              : <Navigate to="/teamlogin" />
          }
        >
          <Route index element={<GiveawayRedemption />} />
        </Route>

        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/teamlogin" />}> 
        
          {['system_admin'].includes(role) && (
            <>
              {/* <Route path="stores/add" element={<AddStore />} /> */}
              <Route path="users" element={<User />} /> 
              {/* <Route path="users/add" element={<AddUser />} /> */}
              <Route path="stores" element={<Store />} />
              <Route path="settings" element={<Settings />} />
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
    <ToastContainer />
      <AppContent />
    </BrowserRouter>
  );
}
