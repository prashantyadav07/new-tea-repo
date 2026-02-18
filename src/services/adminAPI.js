import axios from 'axios';

// Backend URLs
const LOCAL_URL = 'http://localhost:5000/api';
const PRODUCTION_URL = 'https://mern-tea-backend.vercel.app/api';

// 1. Get raw URL from env or fallbacks
let rawBaseUrl = import.meta.env.VITE_API_URL;
if (!rawBaseUrl) {
    rawBaseUrl = import.meta.env.PROD
        ? 'https://mern-tea-backend.vercel.app/api'
        : 'http://localhost:5000/api';
}

// 2. Explicitly strip '/auth' if present
let finalBaseUrl = rawBaseUrl;
if (finalBaseUrl.endsWith('/auth')) {
    finalBaseUrl = finalBaseUrl.slice(0, -5);
} else if (finalBaseUrl.endsWith('/auth/')) {
    finalBaseUrl = finalBaseUrl.slice(0, -6);
}

console.log("[AdminAPI] Raw URL:", rawBaseUrl);
console.log("[AdminAPI] Final Base URL:", finalBaseUrl);

const API_URL = finalBaseUrl;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Request interceptor to attach access token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token available');

                // Refresh endpoint is likely at /auth/refresh relative to this new base /api
                // Refresh endpoint is likely at /auth/refresh relative to this new base /api
                const response = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                const { accessToken, refreshToken: newRefreshToken } = response.data;

                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

export const adminAPI = {
    // Dashboard - /api/admin/dashboard-stats
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard-stats');
        return response.data;
    },

    // Orders - /api/admin/orders
    getAllOrders: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.orderStatus) params.append('orderStatus', filters.orderStatus);
        if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);

        const response = await api.get(`/admin/orders?${params.toString()}`);
        return response.data;
    },

    updateOrderStatus: async (orderId, status) => {
        const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
        return response.data;
    }
};

export const adminAxiosInstance = api;
export default adminAPI;
