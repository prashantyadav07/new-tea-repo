import { adminAxiosInstance as api } from './adminAPI';

export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (productId, variantSize, quantity) => api.post('/cart/add', { productId, variantSize, quantity }),
    updateCartItem: (productId, variantSize, quantity) => api.patch('/cart/update', { productId, variantSize, quantity }),
    removeFromCart: (productId, variantSize) => api.delete('/cart/remove', { data: { productId, variantSize } }),
};
