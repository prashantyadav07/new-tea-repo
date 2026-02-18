import axios from 'axios';

// Backend URLs
const LOCAL_URL = 'http://localhost:5000/api/auth';
const PRODUCTION_URL = 'https://mern-tea-backend.vercel.app/api/auth';

// 1. Try VITE_API_URL from .env
// 2. If not set, check if we are in Production mode (deployed) -> Use Production URL
// 3. Fallback to Local URL
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? PRODUCTION_URL : LOCAL_URL);

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true // Ensure cookies are sent (important for refresh tokens if httpOnly)
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

        // Check if error is 401 and we haven't retried yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh token
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) throw new Error('No refresh token available');

                const response = await axios.post(`${API_URL}/refresh`, { refreshToken });

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                if (accessToken) {
                    // Update local storage and header
                    localStorage.setItem('accessToken', accessToken);
                    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);

                    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

                    // Retry original request
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - clean up and redirect to login
                console.error("Token refresh failed:", refreshError);
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

export const authAPI = {
    register: (userData) => api.post('/register', userData),
    login: (credentials) => api.post('/login', credentials),
    logout: () => api.post('/logout'),
    getCurrentUser: () => api.get('/me'), // Assuming a /me endpoint exists or we decode token
    updateProfile: (userData) => {
        return api.patch('/profile', userData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
    },
};

export default api;
