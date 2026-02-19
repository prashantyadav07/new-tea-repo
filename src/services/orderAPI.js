import { adminAxiosInstance as api } from './adminAPI';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const orderAPI = {
    // ── Authenticated User Routes ────────────────────────────
    createOrder: (shippingAddress, paymentMethod) => api.post('/orders/create', { shippingAddress, paymentMethod }),
    getMyOrders: () => api.get('/orders/my'),
    getOrderById: (id) => api.get(`/orders/${id}`),
    cancelOrder: (id) => api.post(`/orders/${id}/cancel`),

    // ── Razorpay Payment Routes ──────────────────────────────
    createRazorpayOrder: (shippingAddress) => api.post('/orders/razorpay/create', { shippingAddress }),
    verifyRazorpayPayment: (data) => api.post('/orders/razorpay/verify', data),

    // ── Guest Routes (no auth) ───────────────────────────────
    createGuestOrder: (data) => axios.post(`${BASE_URL}/orders/guest`, data),
    trackOrders: (mobile) => axios.get(`${BASE_URL}/orders/track`, { params: { mobile } }),

    // ── Admin Routes ─────────────────────────────────────────
    getAllOrders: (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.orderStatus) params.append('orderStatus', filters.orderStatus);
        if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
        return api.get(`/admin/orders?${params.toString()}`);
    },
    updateOrderStatus: (id, status) => api.patch(`/admin/orders/${id}/status`, { status }),
};
