import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { useAppSelector } from './redux/hook';
import { selectAuthToken, selectAuthRole } from './redux/slice/authSlice';
import { useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

const PublicLayout = lazy(() => import('./components/layout/PublicLayout'));
const TeamLogin = lazy(() => import('./pages/internal/TeamLogin'));
const Signup = lazy(() => import('./pages/customers/Signup'));
const Login = lazy(() => import('./pages/customers/Login'));
const Account = lazy(() => import('./pages/customers/Account'));
const Orders = lazy(() => import('./pages/customers/Orders'));
const Dashboard = lazy(
  () => import('./components/dashboard/layout/DashboardLayout')
);
const User = lazy(() => import('./pages/internal/User'));
const GiveawayRedemption = lazy(
  () => import('./pages/internal/GiveawayRedemption')
);
const Store = lazy(() => import('./pages/internal/Store'));
const BrandDashboard = lazy(() => import('./pages/internal/BrandDashboard'));
const BookingsDashboard = lazy(
  () => import('./pages/internal/BookingsDashboard')
);
const Settings = lazy(() => import('./pages/internal/Settings'));
const ProductsDashboard = lazy(
  () => import('./pages/internal/ProductsDashboard')
);
const VariantsDashboard = lazy(
  () => import('./pages/internal/VariantsDashboard')
);
const TaxonomyDashboard = lazy(
  () => import('./pages/internal/TaxonomyDashboard')
);
const UnitsDashboard = lazy(() => import('./pages/internal/UnitsDashboard'));
const QualitiesDashboard = lazy(
  () => import('./pages/internal/QualitiesDashboard')
);
const LogsDashboard = lazy(() => import('./pages/internal/LogsDashboard'));
const FocusLayout = lazy(() => import('./components/layout/FocusLayout'));
const Workledger = lazy(() => import('./pages/internal/Workledger'));
const WorkledgerDetails = lazy(
  () => import('./pages/internal/WorkledgerDetails')
);
const IndexPage = lazy(() => import('./pages/Index'));
const About = lazy(() => import('./pages/public/About'));
const Contact = lazy(() => import('./pages/public/Contact'));
const Locate = lazy(() => import('./pages/public/Locate'));
const Legal = lazy(() => import('./pages/public/Legal'));
const Careers = lazy(() => import('./pages/public/Careers'));
const Offers = lazy(() => import('./pages/public/Offers'));
const Repair = lazy(() => import('./pages/public/Repair'));
const Support = lazy(() => import('./pages/public/Support'));
const SearchPage = lazy(() => import('./pages/public/Search'));
const ScheduleCall = lazy(() => import('./pages/internal/ScheduleCall'));
const Stores = lazy(() => import('./pages/internal/Stores'));
const StoreDetails = lazy(() => import('./pages/internal/StoreDetails'));
const Spares = lazy(() => import('./pages/internal/Spares'));
const Bookings = lazy(() => import('./pages/internal/Bookings'));
const IssuesDashboard = lazy(() => import('./pages/internal/IssuesDashboard'));
const OtherIssuesDashboard = lazy(
  () => import('./pages/internal/OtherIssuesDashboard')
);
const QuestionsDashboard = lazy(
  () => import('./pages/internal/QuestionsDashboard')
);
const Shop = lazy(() => import('./pages/ecommerce/Shop'));
const DepartmentsPage = lazy(() => import('./pages/ecommerce/DepartmentsPage'));
const DepartmentCategoriesPage = lazy(
  () => import('./pages/ecommerce/DepartmentCategoriesPage')
);
const CategoryPage = lazy(() => import('./pages/ecommerce/CategoryPage'));
const ProductDetail = lazy(() => import('./pages/ecommerce/ProductDetail'));
const CartPage = lazy(() => import('./pages/ecommerce/CartPage'));
const Partners = lazy(() => import('./pages/ecommerce/Partners'));
import CreateSaleInvoice from './components/Sales/CreateSaleInvoice';
const HelpCentre = lazy(() => import('./pages/ecommerce/HelpCentre'));

function AppContent() {
  const token = useAppSelector(selectAuthToken);
  const role = useAppSelector(selectAuthRole);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  const routes = (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <Routes>
        {/* Public layout wrapper */}
        <Route element={<PublicLayout />}>
          <Route index element={<IndexPage />} />
          <Route path="shop" element={<Shop />} />
          <Route path="repair" element={<Repair />} />
          <Route path="support" element={<Support />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="product/:slug" element={<ProductDetail />} />
          <Route path="departments" element={<DepartmentsPage />} />
          <Route
            path="departments/:deptSlug/categories"
            element={<DepartmentCategoriesPage />}
          />
          <Route
            path="departments/:deptSlug/:catSlug/:subcatSlug/products"
            element={<CategoryPage />}
          />
          <Route path="cart" element={<CartPage />} />
          <Route path="partners" element={<Partners />} />
          <Route path="help" element={<HelpCentre />} />
          <Route path="legal" element={<Legal />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="locate" element={<Locate />} />
          <Route path="offers" element={<Offers />} />
          <Route path="careers" element={<Careers />} />
          <Route path="stores" element={<Stores />} />
          <Route path="stores/:id" element={<StoreDetails />} />
          <Route path="spares" element={<Spares />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="schedule-call" element={<ScheduleCall />} />
          <Route
            path="account"
            element={token ? <Account /> : <Navigate to="/login" replace />}
          />
          <Route
            path="orders"
            element={token ? <Orders /> : <Navigate to="/login" replace />}
          />
        </Route>

        {/* Auth routes (outside PublicLayout) */}
        <Route
          path="/teamlogin"
          element={token ? <Navigate to="/dashboard" /> : <TeamLogin />}
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard & internal routes */}
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
              <Route path="users" element={<User />} />
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
              <Route path="sales/create" element={<CreateSaleInvoice />} />
            </>
          )}
        </Route>
      </Routes>
    </Suspense>
  );

  return isDashboard ? routes : routes;
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
