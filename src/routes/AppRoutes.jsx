import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// ──────────────────────────────────────────────────────────
// INDUSTRY-GRADE ROUTING: Lazy + Eager Prefetch
//
// Strategy:
//   1. All pages use React.lazy() so the initial render is lightweight
//   2. On first mount, we eagerly prefetch ALL page chunks in parallel
//   3. By the time a user clicks a link (100ms+ later), the chunk is
//      already cached in memory → instant transitions, zero spinners
//
// This avoids:
//   - Static import crashes (WebGL/three.js init race conditions)
//   - Loading spinners on navigation
//   - White screen flashes
// ──────────────────────────────────────────────────────────

const Home = lazy(() => import('../pages/Home'));
const Shop = lazy(() => import('../pages/Shop'));
const ProductDetails = lazy(() => import('../pages/ProductDetails'));
const About = lazy(() => import('../pages/About'));
const Contact = lazy(() => import('../pages/Contact'));
const Courses = lazy(() => import('../pages/Courses'));
const Cart = lazy(() => import('../pages/Cart'));
const NotFound = lazy(() => import('../pages/NotFound'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));
const Profile = lazy(() => import('../pages/Profile'));
const Privacy = lazy(() => import('../pages/Privacy'));
const TermsOfService = lazy(() => import('../pages/TermsOfService'));
const ShippingPolicy = lazy(() => import('../pages/ShippingPolicy'));
const Sustainability = lazy(() => import('../pages/Sustainability'));
const Blog = lazy(() => import('../pages/Blog'));

const AdminLayout = lazy(() => import('../layouts/AdminLayout'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const CategoryManagement = lazy(() => import('../pages/admin/CategoryManagement'));
const ProductManagement = lazy(() => import('../pages/admin/ProductManagement'));
const OrdersPage = lazy(() => import('../pages/admin/OrdersPage'));

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
    import('../pages/NotFound');
    import('../pages/Login');
    import('../pages/Signup');
    import('../pages/Profile');
    import('../pages/Privacy');
    import('../pages/TermsOfService');
    import('../pages/ShippingPolicy');
    import('../pages/Sustainability');
    import('../pages/Blog');

    // Admin Prefetch
    import('../layouts/AdminLayout');
    import('../pages/admin/AdminDashboard');
    import('../pages/admin/CategoryManagement');
    import('../pages/admin/ProductManagement');
    import('../pages/admin/OrdersPage');
  }, []);
}

export default function AppRoutes() {
  usePrefetchAllRoutes();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="courses" element={<Courses />} />
        <Route path="cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
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
      </Route>

      {/* 404 Page (Catch all that didn't match above) */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

