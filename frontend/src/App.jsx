import { lazy, Suspense, useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import { checkAuth } from "./store/slices/authSlice";

// Client Layout — toujours chargé, jamais lazy
import CartSidebar from "./components/Layout/CartSidebar";
import Footer from "./components/Layout/Footer";
import LoginModal from "./components/Layout/LoginModal";
import Navbar from "./components/Layout/Navbar";
import ProfilePanel from "./components/Layout/ProfilePanel";
import SearchOverlay from "./components/Layout/SearchOverlay";
import Sidebar from "./components/Layout/Sidebar";

// Home — chargée immédiatement (1ère page vue)
import Index from "./pages/Home";
import ScrollToTop from "./utils/ScrollToTop";

// Pages client — lazy (chargées à la demande)
const About = lazy(() => import("./pages/About"));
const Cart = lazy(() => import("./pages/Cart"));
const Contact = lazy(() => import("./pages/Contact"));
const FAQ = lazy(() => import("./pages/FAQ"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Orders = lazy(() => import("./pages/Orders"));
const Payment = lazy(() => import("./pages/Payment"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Products = lazy(() => import("./pages/Products"));
const Profile = lazy(() => import("./pages/Profile"));

// Pages admin — lazy (jamais visitées par les clients normaux)
const AdminGuard = lazy(() => import("./admin/components/AdminGuard"));
const AdminBanners = lazy(() => import("./admin/pages/AdminBanner"));
const AdminCategories = lazy(() => import("./admin/pages/AdminCaterogies"));
const AdminDashboard = lazy(() => import("./admin/pages/AdminDashboard"));
const AdminLogin = lazy(() => import("./admin/pages/AdminLogin"));
const AdminOrders = lazy(() => import("./admin/pages/AdminOrders"));
const AdminProducts = lazy(() => import("./admin/pages/AdminProducts"));
const AdminUsers = lazy(() => import("./admin/pages/AdminUsers"));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
  </div>
);

const ClientLayout = ({ children }) => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <Sidebar />
    <SearchOverlay />
    <CartSidebar />
    <ProfilePanel />
    <LoginModal />
    {children}
    <Footer />
  </div>
);

const AppContent = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminDashboard />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminGuard>
                <AdminProducts />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminGuard>
                <AdminCategories />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/banners"
            element={
              <AdminGuard>
                <AdminBanners />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminGuard>
                <AdminOrders />
              </AdminGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminGuard>
                <AdminUsers />
              </AdminGuard>
            }
          />

          {/* Client  */}
          <Route
            path="/"
            element={
              <ClientLayout>
                <Index />
              </ClientLayout>
            }
          />
          <Route
            path="/products"
            element={
              <ClientLayout>
                <Products />
              </ClientLayout>
            }
          />
          <Route
            path="/product/:id"
            element={
              <ClientLayout>
                <ProductDetail />
              </ClientLayout>
            }
          />
          <Route
            path="/cart"
            element={
              <ClientLayout>
                <Cart />
              </ClientLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <ClientLayout>
                <Orders />
              </ClientLayout>
            }
          />
          <Route
            path="/payment"
            element={
              <ClientLayout>
                <Payment />
              </ClientLayout>
            }
          />
          <Route
            path="/about"
            element={
              <ClientLayout>
                <About />
              </ClientLayout>
            }
          />
          <Route
            path="/faq"
            element={
              <ClientLayout>
                <FAQ />
              </ClientLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <ClientLayout>
                <Contact />
              </ClientLayout>
            }
          />
          <Route
            path="/profil"
            element={
              <ClientLayout>
                <Profile />
              </ClientLayout>
            }
          />
          <Route
            path="*"
            element={
              <ClientLayout>
                <NotFound />
              </ClientLayout>
            }
          />
        </Routes>
      </Suspense>

      <ToastContainer
        position="bottom-right"
        autoClose={1000}
        theme="dark"
        toastStyle={{
          background: "hsl(220, 18%, 11%)",
          border: "1px solid hsl(220, 15%, 18%)",
          color: "hsl(0, 0%, 96%)",
          fontFamily: "'Barlow Condensed', sans-serif",
          letterSpacing: "0.03em",
        }}
      />
    </BrowserRouter>
  );
};

const App = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
