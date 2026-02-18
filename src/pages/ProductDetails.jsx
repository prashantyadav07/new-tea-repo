import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Star, ArrowLeft, Minus, Plus, ChevronDown, ChevronUp, Leaf, Check, X, Clock, Thermometer } from 'lucide-react';
import { productAPI } from '@/services/productAPI';
import { ScrollReveal } from '@/components/ScrollAnimations';

export default function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [activeTab, setActiveTab] = useState('description');

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const { data } = await productAPI.getById(id);
                // Map backend data to UI structure
                setProduct({
                    ...data,
                    id: data._id,
                    price: data.variants?.[0]?.price || 0,
                    category: data.category?.name || 'Collection',
                    // Defaults for fields not yet in backend
                    rating: 4.8,
                    reviews: 128, // Mock count
                    bgGradient: 'from-amber-50 to-orange-50', // Default light gradient
                    badge: data.variants?.[0]?.stock < 5 ? 'Low Stock' : null,
                    brewTime: '3-5 mins',
                    brewTemp: '85-90°C',
                    origin: 'Assam, India'
                });
                window.scrollTo(0, 0);
            } catch (error) {
                console.error("Failed to fetch product details", error);
                navigate('/shop'); // Redirect to shop on error
            }
        };

        if (id) {
            fetchProductDetails();
        }
    }, [id, navigate]);

    if (!product) return null;

    const handleAddToCart = () => {
        setAdding(true);
        setTimeout(() => {
            const existingCart = localStorage.getItem('teaCart');
            const cart = existingCart ? JSON.parse(existingCart) : [];
            const existingItemIndex = cart.findIndex(item => item.id === product.id);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += quantity;
            } else {
                cart.push({ ...product, quantity });
            }

            localStorage.setItem('teaCart', JSON.stringify(cart));
            window.dispatchEvent(new Event('cartUpdated'));
            setAdding(false);
            navigate('/cart');
        }, 600);
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] pb-32 font-sans selection:bg-[#D4F57B] selection:text-[#385040]">

            {/* --- HERO SECTION --- */}
            <div className="relative pt-24 pb-12 overflow-hidden bg-white rounded-b-[3rem] shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Breadcrumbs */}
                    <div className="flex items-center gap-2 mb-6">
                        <Link to="/shop" className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:text-[#385040] hover:border-[#385040] transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">/ {product.category}</span>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Image - Floating Style */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className={`relative aspect-[4/5] lg:aspect-square w-full max-w-md mx-auto rounded-[2.5rem] overflow-hidden bg-gradient-to-br ${product.bgGradient} p-8 flex items-center justify-center`}
                        >
                            <motion.img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain drop-shadow-2xl z-10"
                                whileHover={{ scale: 1.05, rotate: 2 }}
                                transition={{ type: "spring", stiffness: 100 }}
                            />
                            {/* Floating Badge */}
                            <div className="absolute top-6 right-6 z-20">
                                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-lg text-[#385040] border border-white/50">
                                    {product.badge || 'Premium'}
                                </span>
                            </div>
                        </motion.div>

                        {/* Details - Clean & Sharp */}
                        <div className="flex flex-col">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="flex text-amber-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold text-gray-500">{product.rating} (128 reviews)</span>
                                </div>

                                <h1 className="font-display text-4xl lg:text-6xl font-black text-[#1A1A1A] leading-tight mb-4">
                                    {product.name}
                                </h1>

                                <div className="flex items-baseline gap-3 mb-8">
                                    <span className="text-4xl font-bold text-[#385040]">₹{product.price.toFixed(2)}</span>
                                    {product.originalPrice && (
                                        <span className="text-lg text-gray-400 line-through">₹{product.originalPrice}</span>
                                    )}
                                    <span className="text-xs font-bold uppercase tracking-wider text-green-600 bg-green-50 px-2 py-1 rounded ml-2">In Stock</span>
                                </div>

                                {/* Compact Metadata Pills */}
                                <div className="flex flex-wrap gap-3 mb-8">
                                    <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#385040]" />
                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{product.brewTime}</span>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                                        <Thermometer className="w-4 h-4 text-[#385040]" />
                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{product.brewTemp}</span>
                                    </div>
                                    <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                                        <Leaf className="w-4 h-4 text-[#385040]" />
                                        <span className="text-xs font-bold text-gray-600 uppercase tracking-wide">{product.origin || 'Assam'}</span>
                                    </div>
                                </div>

                                {/* Collapsible Description - "Read More" feel */}
                                <div className="prose prose-sm text-gray-600 font-serif leading-relaxed mb-8">
                                    <p>{product.description}</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- VISUAL SECTIONS --- */}

            {/* Taste the Difference - Full Width Card */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <ScrollReveal>
                    <div className="rounded-[2.5rem] overflow-hidden bg-[#385040] text-white relative shadow-2xl">
                        {/* Background Pattern */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                        <div className="grid lg:grid-cols-2">
                            <div className="p-10 lg:p-16 flex flex-col justify-center relative z-10">
                                <span className="text-[#D4F57B] font-display font-bold text-6xl opacity-20 absolute top-4 left-4">1912</span>

                                <h2 className="font-display text-3xl lg:text-5xl font-bold mb-6">
                                    Taste the <span className="text-[#D4F57B]">Legacy</span>
                                </h2>
                                <p className="text-white/80 font-serif text-lg leading-relaxed mb-8">
                                    Sourced directly from our 23 heritage estates. No middlemen, just pure, unadulterated tea craftsmanship preserved for over a century.
                                </p>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <div className="text-3xl font-bold text-[#D4F57B]">23</div>
                                        <div className="text-xs uppercase tracking-widest opacity-60">Estates</div>
                                    </div>
                                    <div>
                                        <div className="text-3xl font-bold text-[#D4F57B]">50k+</div>
                                        <div className="text-xs uppercase tracking-widest opacity-60">Acres</div>
                                    </div>
                                </div>
                            </div>
                            <div className="relative min-h-[300px]">
                                <img src="https://images.unsplash.com/photo-1565498971161-42ae3dbbb7ea?auto=format&fit=crop&q=80&w=2835" alt="Estate" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
                                <div className="absolute inset-0 bg-gradient-to-r from-[#385040] to-transparent"></div>
                            </div>
                        </div>
                    </div>
                </ScrollReveal>
            </div>

            {/* Why Choose Us - Visual Comparison */}
            <div className="bg-[#F3F4F1] py-20 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-center font-serif text-3xl md:text-4xl text-[#1A1A1A] mb-12 tracking-wide uppercase">Why Choose Us ?</h2>

                    <div className="grid md:grid-cols-2 gap-8 md:gap-0 relative">
                        {/* Vertical Divider for Desktop */}
                        <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-px bg-gray-300 -ml-px"></div>

                        {/* Left Side: Brand Match */}
                        <div className="flex flex-col items-center text-center p-4">
                            <div className="w-48 h-48 md:w-64 md:h-64 mb-6 rounded-full overflow-hidden bg-white/50 p-2">
                                <img
                                    src="https://images.unsplash.com/photo-1594631252845-d9b50291300f?auto=format&fit=crop&q=80&w=500"
                                    alt="Premium Whole Leaf Tea"
                                    className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-700"
                                />
                            </div>
                            <h3 className="font-serif text-xl tracking-widest text-[#1A1A1A] uppercase mb-6">Borsillah Estates</h3>
                            <ul className="space-y-4 text-left inline-block">
                                {[
                                    'Whole leaf ingredients',
                                    'Hand-blended with care',
                                    'Multiple quality checks',
                                    'Fresh, vibrant, and true to nature'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-gray-700 font-sans text-sm md:text-base">
                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                                            <Check className="w-3 h-3 text-green-600" strokeWidth={3} />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right Side: Other Brands */}
                        <div className="flex flex-col items-center text-center p-4 opacity-80">
                            <div className="w-48 h-48 md:w-64 md:h-64 mb-6 rounded-full overflow-hidden bg-white/50 p-2 grayscale-[50%]">
                                <img
                                    src="https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&q=80&w=500"
                                    alt="Dust Tea Comparison"
                                    className="w-full h-full object-cover rounded-full"
                                />
                            </div>
                            <h3 className="font-serif text-xl tracking-widest text-[#1A1A1A] uppercase mb-6">Other Brands</h3>
                            <ul className="space-y-4 text-left inline-block">
                                {[
                                    'Dust and fannings',
                                    'Mechanically mixed',
                                    'Dull and often artificial',
                                    'Minimal or no quality checks'
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-4 text-gray-500 font-sans text-sm md:text-base">
                                        <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-red-50 flex items-center justify-center">
                                            <X className="w-3 h-3 text-red-500" strokeWidth={3} />
                                        </div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Decorative Lines Bottom */}
                    <div className="mt-16 border-t border-gray-300 w-full mb-1"></div>
                    <div className="border-t border-gray-300 w-full mb-1 opacity-70"></div>
                    <div className="border-t border-gray-300 w-full opacity-40"></div>
                </div>
            </div>

            {/* --- FLOATING BOTTOM ACTION BAR --- */}
            <div className="fixed bottom-6 left-4 right-4 z-50">
                <div className="max-w-xl mx-auto bg-[#1A1A1A] rounded-full p-2 pl-6 shadow-2xl flex items-center justify-between backdrop-blur-xl bg-opacity-95 border border-white/10">
                    {/* Price Block */}
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Total</span>
                        <span className="text-xl font-bold text-white">₹{(product.price * quantity).toFixed(2)}</span>
                    </div>

                    {/* Actions Block */}
                    <div className="flex items-center gap-3">
                        {/* Quantity Pill */}
                        <div className="flex items-center bg-white/10 rounded-full h-12 px-1">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-full flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors">
                                <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-6 text-center font-bold text-white">{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-full flex items-center justify-center text-white hover:bg-white/10 rounded-full transition-colors">
                                <Plus className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={handleAddToCart}
                            disabled={adding}
                            className="h-12 px-8 bg-[#D4F57B] hover:bg-[#c2e860] text-[#1A1A1A] rounded-full font-bold uppercase tracking-widest text-sm transition-all active:scale-95 flex items-center gap-2"
                        >
                            {adding ? '...' : (
                                <>Add <ShoppingBag className="w-4 h-4" /></>
                            )}
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
