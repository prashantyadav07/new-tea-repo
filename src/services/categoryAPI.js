import { adminAxiosInstance as api } from './adminAPI';

export const categoryAPI = {
    getAll: () => api.get('/categories'),
    create: (formData, extraConfig = {}) => api.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
        ...extraConfig
    }),
    update: (id, formData, extraConfig = {}) => api.patch(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 60000,
        ...extraConfig
    }),
    delete: (id) => api.delete(`/categories/${id}`),
};
