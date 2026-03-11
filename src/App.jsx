import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useParams, Outlet, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';

// Lazy-load below-fold sections for faster initial page load
const Stats = lazy(() => import('./components/Stats/Stats'));
const Products = lazy(() => import('./components/Products/Products'));
const Collection = lazy(() => import('./components/Collection/Collection'));
const CTA = lazy(() => import('./components/CTA/CTA'));
const Footer = lazy(() => import('./components/Footer/Footer'));
const CartPage = lazy(() => import('./components/Cart/CartPage'));
const CheckoutPage = lazy(() => import('./components/Checkout/CheckoutPage'));
const OrderConfirmation = lazy(() => import('./components/Checkout/OrderConfirmation'));
const WishlistPage = lazy(() => import('./components/Wishlist/WishlistPage'));
const ProductDetails = lazy(() => import('./components/ProductDetails/ProductDetails'));

// Lazy-load auth pages (separate bundle)
const AuthPage = lazy(() => import('./components/Auth/AuthDashboard'));

// Lazy-load category pages
const PremiumCategoryApp = lazy(() => import('./components/CategoryPage/PremiumCategoryApp'));

// Lazy-load admin pages
const AdminLayout = lazy(() => import('./admin/components/AdminLayout'));
const AdminDashboard = lazy(() => import('./admin/pages/Dashboard'));
const AdminProducts = lazy(() => import('./admin/pages/Products'));
const AdminAddProduct = lazy(() => import('./admin/pages/AddProduct'));
const AdminEditProduct = lazy(() => import('./admin/pages/EditProduct'));
const AdminOrders = lazy(() => import('./admin/pages/Orders'));
const AdminOrderDetails = lazy(() => import('./admin/pages/OrderDetails'));
const AdminUsers = lazy(() => import('./admin/pages/Users'));
const AdminUserDetails = lazy(() => import('./admin/pages/UserDetails'));
const AdminAnalytics = lazy(() => import('./admin/pages/Analytics'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));

/** Protected Route Guard */
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/** Admin Route Guard */
function AdminRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  // Assuming user role could be 'admin'
  if (user.role !== 'admin') return <Navigate to="/" replace />;
  return children;
}

/** Shared layout — Navbar persists across all main routes */
function MainLayout() {
  return (
    <div className="font-inter min-h-screen bg-[#ffffff]">
      <Navbar />
      <Outlet />
    </div>
  );
}

/** The shop homepage content (no Navbar — provided by layout) */
function ShopHome() {
  return (
    <>
      <Hero />
      <Suspense fallback={<div className="min-h-screen" />}>
        <Stats />
        <Products />
        <Collection />
        <CTA />
        <div className="h-[18px]" />
        <Footer />
      </Suspense>
    </>
  );
}

// Wrapper for the premium app to extract URL param if we navigate directly to a category
function PremiumAppWrapper() {
  const { categoryName } = useParams();

  // Try to match URL param to accepted category names, fallback to Furniture
  let matchedCat = "Furniture";
  if (categoryName) {
    const raw = decodeURIComponent(categoryName.replace(/-/g, ' ')).replace(/and/g, '&');
    const normalize = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
    const valid = ["Furniture", "Outdoor", "Lighting", "Dining", "Bathrooms", "Mirrors & Décor"];
    const found = valid.find(v => normalize(v) === normalize(raw));
    if (found) matchedCat = found;
  }

  return <PremiumCategoryApp initialCategory={matchedCat} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Routes>
              {/* Main layout with shared Navbar */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<ShopHome />} />

                <Route path="/category/:categoryName" element={
                  <Suspense fallback={<div className="min-h-screen bg-[#FDFCFA]" />}>
                    <PremiumAppWrapper />
                  </Suspense>
                } />

                <Route path="/collections" element={
                  <Suspense fallback={<div className="min-h-screen bg-[#FDFCFA]" />}>
                    <PremiumCategoryApp initialCategory="Furniture" />
                  </Suspense>
                } />

                <Route path="/product/:id" element={
                  <Suspense fallback={<div className="min-h-screen bg-[#ffffff]" />}>
                    <ProductDetails />
                  </Suspense>
                } />

                <Route path="/cart" element={
                  <Suspense fallback={<div className="min-h-screen bg-[#ffffff]" />}>
                    <CartPage />
                  </Suspense>
                } />

                <Route path="/wishlist" element={
                  <Suspense fallback={<div className="min-h-screen bg-[#ffffff]" />}>
                    <WishlistPage />
                  </Suspense>
                } />

                {/* Protected Routes inside MainLayout */}
                <Route path="/checkout" element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="min-h-screen bg-[#FDFCFA]" />}>
                      <CheckoutPage />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/order-confirmation" element={
                  <ProtectedRoute>
                    <Suspense fallback={<div className="min-h-screen bg-[#FDFCFA]" />}>
                      <OrderConfirmation />
                    </Suspense>
                  </ProtectedRoute>
                } />

                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F7F5F2" }} />}>
                      <AuthPage initialScreen="dashboard" />
                    </Suspense>
                  </ProtectedRoute>
                } />
              </Route>

              {/* Admin routing section - completely separate from MainLayout */}
              <Route path="/admin" element={
                <AdminRoute>
                  <Suspense fallback={
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#f8fafc' }}>
                      <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
                      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                    </div>
                  }>
                    <AdminLayout />
                  </Suspense>
                </AdminRoute>
              }>
                {/* Nested admin routes rendered via <Outlet /> in AdminLayout */}
                <Route index element={<AdminDashboard />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="products" element={<AdminProducts />} />
                <Route path="products/add" element={<AdminAddProduct />} />
                <Route path="products/edit/:id" element={<AdminEditProduct />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="orders/:id" element={<AdminOrderDetails />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="users/:id" element={<AdminUserDetails />} />
                <Route path="analytics" element={<AdminAnalytics />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Auth routes — no shared navbar */}
              <Route path="/login" element={
                <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F7F5F2" }} />}>
                  <AuthPage initialScreen="login" />
                </Suspense>
              } />
              <Route path="/signup" element={
                <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F7F5F2" }} />}>
                  <AuthPage initialScreen="signup" />
                </Suspense>
              } />
            </Routes>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
