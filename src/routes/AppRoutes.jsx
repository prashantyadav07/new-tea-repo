import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from '../components/ProtectedRoute';

// ──────────────────────────────────────────────────────────
// INDUSTRY-GRADE ROUTING: Lazy + Eager Prefetch
// ──────────────────────────────────────────────────────────

import Home from '../pages/Home';
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
const OrderSuccess = lazy(() => import('../pages/OrderSuccess'));
const OrderFailure = lazy(() => import('../pages/OrderFailure'));
const CityLandingPage = lazy(() => import('../pages/CityLandingPage'));
const BlogArticleTemplate = lazy(() => import('../pages/blog/BlogArticleTemplate'));

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
const AdminNotifications = lazy(() => import('../pages/admin/AdminNotifications'));

// ── New Feature Admin Pages ──
const OfferManagement = lazy(() => import('../pages/admin/OfferManagement'));
const InventoryPage = lazy(() => import('../pages/admin/InventoryPage'));
const ReportsPage = lazy(() => import('../pages/admin/ReportsPage'));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'transparent' }} />}>
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
          <Route path="order-success" element={
            <ProtectedRoute>
              <OrderSuccess />
            </ProtectedRoute>
          } />
          <Route path="order-failure" element={
            <ProtectedRoute>
              <OrderFailure />
            </ProtectedRoute>
          } />
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
          <Route path="blog/:slug" element={<BlogArticleTemplate />} />
          <Route path="complaint" element={<SubmitComplaint />} />
          <Route path="track-complaint" element={<TrackComplaint />} />

          {/* City Landing Pages */}
          <Route path="chai-muzaffarnagar" element={<CityLandingPage citySlug="muzaffarnagar" />} />
          <Route path="chai-meerut" element={<CityLandingPage citySlug="meerut" />} />
          <Route path="chai-saharanpur" element={<CityLandingPage citySlug="saharanpur" />} />
          <Route path="chai-delhi" element={<CityLandingPage citySlug="delhi" />} />
          <Route path="chai-noida" element={<CityLandingPage citySlug="noida" />} />
          <Route path="chai-mumbai" element={<CityLandingPage citySlug="mumbai" />} />
          <Route path="chai-bengaluru" element={<CityLandingPage citySlug="bengaluru" />} />
          <Route path="chai-lucknow" element={<CityLandingPage citySlug="lucknow" />} />
          <Route path="chai-jaipur" element={<CityLandingPage citySlug="jaipur" />} />
          <Route path="chai-kolkata" element={<CityLandingPage citySlug="kolkata" />} />

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
          {/* ── New Feature Routes ── */}
          <Route path="offers" element={<OfferManagement />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="reports" element={<ReportsPage />} />
          <Route path="notifications" element={<AdminNotifications />} />
        </Route>

        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
