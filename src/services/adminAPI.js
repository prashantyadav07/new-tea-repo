import axios from 'axios';

// Backend URL from environment variables
const API_URL = import.meta.env.VITE_API_URL;

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
    // ── Dashboard ────────────────────────────────────────────
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard-stats');
        return response.data;
    },

    // ── Admin Management ─────────────────────────────────────
    getAllAdmins: async () => {
        const response = await api.get('/admin/admins');
        return response.data;
    },
    createAdmin: async (data) => {
        const response = await api.post('/admin/admins', data);
        return response.data;
    },
    updateAdmin: async (id, data) => {
        const response = await api.patch(`/admin/admins/${id}`, data);
        return response.data;
    },
    deleteAdmin: async (id) => {
        const response = await api.delete(`/admin/admins/${id}`);
        return response.data;
    },

    // ── User Management ──────────────────────────────────────
    getAllUsers: async (role) => {
        const query = role ? `?role=${role}` : '';
        const response = await api.get(`/admin/users${query}`);
        return response.data;
    },
    getUserById: async (id) => {
        const response = await api.get(`/admin/users/${id}`);
        return response.data;
    },
    updateUser: async (id, data) => {
        const response = await api.patch(`/admin/users/${id}`, data);
        return response.data;
    },
    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    // ── Order Management ─────────────────────────────────────
    getAllOrders: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.orderStatus) params.append('orderStatus', filters.orderStatus);
        if (filters.paymentStatus) params.append('paymentStatus', filters.paymentStatus);
        if (filters.userId) params.append('userId', filters.userId);

        const response = await api.get(`/admin/orders?${params.toString()}`);
        return response.data;
    },
    getOrderById: async (id) => {
        const response = await api.get(`/admin/orders/${id}`);
        return response.data;
    },
    updateOrderStatus: async (orderId, status) => {
        const response = await api.patch(`/admin/orders/${orderId}/status`, { status });
        return response.data;
    },
    updatePaymentStatus: async (orderId, paymentStatus) => {
        const response = await api.patch(`/admin/orders/${orderId}/payment`, { paymentStatus });
        return response.data;
    },

    // ── Complaint Management ─────────────────────────────────
    submitComplaint: async (data) => {
        // Public endpoint, use raw axios if no auth, or api instance if we want to attach potential token
        // Use 'api' instance to auto-attach token if user is logged in
        const response = await api.post('/complaints', data);
        return response.data;
    },
    getAllComplaints: async (status) => {
        const query = status ? `?status=${status}` : '';
        const response = await api.get(`/admin/complaints${query}`);
        return response.data;
    },
    getComplaintById: async (id) => {
        const response = await api.get(`/admin/complaints/${id}`);
        return response.data;
    },
    respondToComplaint: async (id, data) => {
        const response = await api.patch(`/admin/complaints/${id}`, data);
        return response.data;
    },
    deleteComplaint: async (id) => {
        const response = await api.delete(`/admin/complaints/${id}`);
        return response.data;
    },
    getUserComplaints: async () => {
        const response = await api.get('/complaints/my-complaints');
        return response.data;
    },
    trackComplaint: async (id) => {
        // Public endpoint, use raw axios if needed, but api instance handles it fine
        const response = await api.get(`/complaints/track/${id}`);
        return response.data;
    }
};

export const adminAxiosInstance = api;
export default adminAPI;
