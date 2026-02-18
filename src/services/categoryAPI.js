import { adminAxiosInstance as api } from './adminAPI'; // Using the configured axios instance

export const categoryAPI = {
    getAll: () => api.get('/categories'),
    create: (formData) => api.post('/categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    update: (id, formData) => api.patch(`/categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id) => api.delete(`/categories/${id}`),
};
