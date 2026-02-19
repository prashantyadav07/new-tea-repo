import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// ──────────────────────────────────────────────────────────
// INDUSTRY-GRADE ROUTING: Lazy + Eager Prefetch
// ──────────────────────────────────────────────────────────

const Home = lazy(() => import('../pages/Home'));
const Shop = lazy(() => import('../pages/Shop'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Courses = lazy(() => import('../pages/Courses'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const MyOrders = lazy(() => import('../pages/MyOrders'));
const NotFound = lazy(() => import('../pages/NotFound'));
const TrackOrder = lazy(() => import('../pages/TrackOrder'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Profile = lazy(() => import('../pages/Profile'));
const Privacy = lazy(() => import('../pages/Privacy'));
const TermsOfService = lazy(() => import('../pages/TermsOfService'));
const ShippingPolicy = lazy(() => import('../pages/ShippingPolicy'));
const Sustainability = lazy(() => import('../pages/Sustainability'));
const Blog = lazy(() => import('../pages/Blog'));
const SubmitComplaint = lazy(() => import('../pages/SubmitComplaint'));
const TrackComplaint = lazy(() => import('../pages/TrackComplaint'));
const ForgotPassword = lazy(() => import('../pages/ForgotPassword'));
const ResetPassword = lazy(() => import('../pages/ResetPassword'));

// Admin Components
const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const CategoryManagement = lazy(() => import('../pages/admin/CategoryManagement'));
const ProductManagement = lazy(() => import('../pages/admin/ProductManagement'));
const OrdersPage = lazy(() => import('../pages/admin/OrdersPage'));
const AdminAdmins = lazy(() => import('../pages/admin/AdminAdmins'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminComplaints = lazy(() => import('../pages/admin/AdminComplaints'));
const AdminOrderDetail = lazy(() => import('../pages/admin/AdminOrderDetail'));

// Prefetch all page chunks immediately after first render
function usePrefetchAllRoutes() {
  useEffect(() => {
    // Fire all imports in parallel — they cache in Vite's module system
    import('../pages/Home');
    import('../pages/Shop');
    import('../pages/ProductDetails');
    import('../pages/About');
    import('../pages/Contact');
    import('../pages/Courses');
    import('../pages/Cart');
    import('../pages/Checkout');
    import('../pages/MyOrders');
    import('../pages/NotFound');
    import('../pages/TrackOrder');
    import('../pages/Login');
    import('../pages/Signup');
    import('../pages/Profile');
    import('../pages/Privacy');
    import('../pages/TermsOfService');
    import('../pages/ShippingPolicy');
    import('../pages/Sustainability');
    import('../pages/Blog');
    import('../pages/SubmitComplaint');
    import('../pages/TrackComplaint');
    import('../pages/ForgotPassword');
    import('../pages/ResetPassword');

    // Admin Prefetch
    import('../layouts/AdminLayout');
    import('../pages/admin/AdminDashboard');
    import('../pages/admin/CategoryManagement');
    import('../pages/admin/ProductManagement');
    import('../pages/admin/OrdersPage');
    import('../pages/admin/AdminAdmins');
    import('../pages/admin/AdminUsers');
    import('../pages/admin/AdminComplaints');
    import('../pages/admin/AdminOrderDetail');
  }, []);
}



export default function AppRoutes() {
  usePrefetchAllRoutes();

  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF9F6]" />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="courses" element={<Courses />} />
          <Route path="cart" element={<Cart />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="track-order" element={<TrackOrder />} />
          <Route path="orders" element={
            <ProtectedRoute>
              <MyOrders />
            </ProtectedRoute>
          } />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          {/* Footer Pages */}
          <Route path="privacy-policy" element={<Privacy />} />
          <Route path="terms-of-service" element={<TermsOfService />} />
          <Route path="shipping-policy" element={<ShippingPolicy />} />
          <Route path="sustainability" element={<Sustainability />} />
          <Route path="blog" element={<Blog />} />
          <Route path="complaint" element={<SubmitComplaint />} />
          <Route path="track-complaint" element={<TrackComplaint />} />

          {/* Alias for terms */}
          <Route path="terms" element={<Navigate to="/terms-of-service" replace />} />
        </Route>

        {/* Admin Routes - Isolated Layout */}
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
          <Route path="admins" element={<AdminAdmins />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="complaints" element={<AdminComplaints />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
