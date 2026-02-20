/**
 * Guest Cart Service — localStorage-based cart for unauthenticated users
 * 
 * Data shape matches backend cart response so components can use the same rendering logic:
 * { items: [{ product: { _id, name, image, variants }, variantSize, quantity, price, itemTotal }], totalPrice }
 */

const STORAGE_KEY = 'guestCart';

const readCart = () => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : { items: [] };
    } catch {
        return { items: [] };
    }
};

const writeCart = (cart) => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
};

const recalculate = (cart) => {
    cart.items.forEach(item => {
        item.itemTotal = item.price * item.quantity;
    });
    cart.totalPrice = cart.items.reduce((sum, item) => sum + item.itemTotal, 0);
    return cart;
};

export const guestCartService = {
    /**
     * Get guest cart (same shape as backend response)
     */
    getCart() {
        return recalculate(readCart());
    },

    /**
     * Add product to guest cart
     * @param {Object} product - Product object { _id, name, image, slug, variants }
     * @param {string} variantSize - e.g. "100g"
     * @param {number} quantity - quantity to add
     */
    addToCart(product, variantSize, quantity = 1) {
        const cart = readCart();
        const variant = product.variants?.find(v => v.size === variantSize);
        if (!variant) throw new Error('Variant not found');

        const existingIndex = cart.items.findIndex(
            item => item.product?._id === product._id && item.variantSize === variantSize
        );

        if (existingIndex >= 0) {
            cart.items[existingIndex].quantity += quantity;
        } else {
            cart.items.push({
                product: {
                    _id: product._id,
                    name: product.name,
                    image: product.image,
                    slug: product.slug,
                    variants: product.variants
                },
                variantSize,
                quantity,
                price: variant.price,
                itemTotal: variant.price * quantity
            });
        }

        writeCart(recalculate(cart));
        console.log('[DEBUG] guestCartService: Added item. New cart:', cart);
        return this.getCart();
    },

    /**
     * Update item quantity
     */
    updateCartItem(productId, variantSize, quantity) {
        const cart = readCart();
        const index = cart.items.findIndex(
            item => (item.product?._id === productId) && item.variantSize === variantSize
        );

        if (index === -1) throw new Error('Item not found in cart');

        if (quantity <= 0) {
            cart.items.splice(index, 1);
        } else {
            cart.items[index].quantity = quantity;
        }

        writeCart(recalculate(cart));
        return this.getCart();
    },

    /**
     * Remove item from cart
     */
    removeFromCart(productId, variantSize) {
        const cart = readCart();
        cart.items = cart.items.filter(
            item => !(item.product?._id === productId && item.variantSize === variantSize)
        );
        writeCart(recalculate(cart));
        return this.getCart();
    },

    /**
     * Clear entire cart
     */
    clearCart() {
        sessionStorage.removeItem(STORAGE_KEY);
        window.dispatchEvent(new Event('cartUpdated'));
    },

    /**
     * Get total item count (for badge)
     */
    getItemCount() {
        const cart = readCart();
        return cart.items.reduce((sum, item) => sum + item.quantity, 0);
    },

    /**
     * Get items formatted for guest order API
     * Returns [{ productId, variantSize, quantity }]
     */
    getOrderItems() {
        const cart = readCart();
        return cart.items.map(item => ({
            productId: item.product?._id,
            variantSize: item.variantSize,
            quantity: item.quantity
        }));
    }
};
