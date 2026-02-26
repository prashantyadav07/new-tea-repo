import { adminAxiosInstance as api } from './adminAPI';

export const productAPI = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    create: (formData, extraConfig = {}) => api.post('/products', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
        ...extraConfig
    }),
    update: (id, formData, extraConfig = {}) => api.patch(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
        ...extraConfig
    }),
    delete: (id) => api.delete(`/products/${id}`),
};
