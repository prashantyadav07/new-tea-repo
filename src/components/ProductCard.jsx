import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Star, Heart } from 'lucide-react';



export default function ProductCard({ product, index }) {
    const navigate = useNavigate();

    // Handle both backend data and potential legacy/dummy structure
    const id = product._id || product.id;
    const name = product.name;
    const category = product.category?.name || product.category || 'Collection';
    const price = product.variants?.[0]?.price || product.price || 0;
    const image = product.image;

    // Defaults for fields not in backend yet
    const rating = product.rating || 4.8;
    const originalPrice = product.originalPrice || null;
    const badge = product.badge || (product.variants?.[0]?.stock < 5 ? 'Low Stock' : null);
    const bgGradient = product.bgGradient || 'from-white to-[#f0fff4]';
    const categoryColor = product.categoryColor || 'text-tea-primary';

    const handleAddToCart = () => {
        const existingCart = localStorage.getItem('teaCart');
        const cart = existingCart ? JSON.parse(existingCart) : [];
        const existingItemIndex = cart.findIndex(item => item.id === id);

        const cartItem = {
            id,
            name,
            price,
            image,
            quantity: 1,
            variant: product.variants?.[0]
        };

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += 1;
        } else {
            cart.push(cartItem);
        }

        localStorage.setItem('teaCart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cartUpdated'));
        navigate('/cart');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ y: -8 }}
            onClick={() => navigate(`/product/${id}`)}
            className="group relative bg-gradient-to-br from-white to-[#f0fff4] dark:from-[#1A1A1A] dark:to-[#1F3324] rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer border border-transparent hover:border-tea-primary/10 overflow-hidden"
        >
            {/* Image Container */}
            <div className={`relative h-64 sm:h-72 w-full bg-gradient-to-br ${bgGradient} dark:from-white/5 dark:to-white/10 flex items-center justify-center overflow-hidden`}>
                {/* Badge */}
                {badge && (
                    <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-sm rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                            {badge}
                        </span>
                    </div>
                )}

                {/* Wishlist Button */}
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={(e) => { e.stopPropagation(); /* Add wishlist logic */ }}
                        className="p-2.5 rounded-full bg-white/60 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 backdrop-blur-sm transition-all text-red-500 hover:scale-110"
                    >
                        <Heart className="w-4 h-4" />
                    </button>
                </div>

                {/* Product Image */}
                <div className="block w-full h-full relative z-10">
                    <motion.img
                        src={image}
                        alt={name}
                        className="w-full h-full object-cover drop-shadow-2xl"
                        whileHover={{ scale: 1.1, rotate: 2 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="px-2 sm:px-4 pb-2 sm:pb-4 pt-2 sm:pt-4">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${categoryColor}`}>
                            {category}
                        </p>
                        <h3 className="font-display font-bold text-sm sm:text-xl text-foreground group-hover:text-tea-primary transition-colors leading-tight">
                            {name}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-foreground">{rating}</span>
                    </div>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 mb-3 sm:mb-6 h-8 sm:h-10 hidden sm:block">
                    {product.description}
                </p>

                <div className="mt-auto flex flex-col gap-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-foreground">₹{Number(price).toFixed(2)}</span>
                        {originalPrice && (
                            <span className="text-xs text-muted-foreground line-through decoration-red-400/50">₹{originalPrice.toFixed(2)}</span>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/product/${id}`);
                            }}
                            className="px-3 py-2.5 rounded-xl text-xs font-bold border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 transition-colors text-center w-full"
                        >
                            View Details
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart();
                            }}
                            className="bg-[#1A1A1A] text-white px-3 py-2.5 rounded-xl text-xs font-bold shadow-lg hover:shadow-xl hover:bg-black transition-all active:scale-95 flex items-center justify-center gap-2 w-full"
                        >
                            <span>Add</span> <ShoppingBag className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
