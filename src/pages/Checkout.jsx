import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, CreditCard, Banknote, ShieldCheck, Leaf, MapPin, AlertCircle, Phone, Mail, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { cartAPI } from '@/services/cartAPI';
import { guestCartService } from '@/services/guestCartService';
import { orderAPI } from '@/services/orderAPI';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';



const PAYMENT_METHODS = [
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote, desc: 'Pay when you receive' },
    { id: 'online', label: 'Pay Online (Razorpay)', icon: CreditCard, desc: 'UPI, Cards, Net Banking' },
];

const InputField = ({ label, name, type = 'text', placeholder, value, onChange, error, colSpan = '', autoComplete }) => (
    <div className={colSpan}>
        <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">{label}</label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete={autoComplete}
            className={`w-full px-4 py-3 rounded-lg border ${error ? 'border-red-400 bg-red-50' : 'border-gray-200'} text-sm focus:outline-none focus:border-[#385040] focus:ring-1 focus:ring-[#385040]/20 transition-colors`}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
);

/**
 * Dynamically load Razorpay SDK script
 */
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(true);
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export default function Checkout() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [placing, setPlacing] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [errors, setErrors] = useState({});

    const [address, setAddress] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'India',
    });

    // Guest contact info
    const [guestContact, setGuestContact] = useState({
        mobile: '',
        name: '',
        email: '',
    });

    // Load saved address or pre-fill from user
    useEffect(() => {
        const savedAddress = localStorage.getItem('checkoutAddress');
        if (savedAddress) {
            setAddress(JSON.parse(savedAddress));
        } else if (user?.name) {
            setAddress(prev => ({ ...prev, fullName: user.name }));
        }
    }, [user]);

    // Save address to local storage on change
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            localStorage.setItem('checkoutAddress', JSON.stringify(address));
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [address]);

    // Fetch cart
    useEffect(() => {
        const fetchCart = async () => {
            try {
                if (isAuthenticated) {
                    const { data } = await cartAPI.getCart();
                    const cartData = data.data;
                    if (!cartData || !cartData.items || cartData.items.length === 0) {
                        toast.error('Your cart is empty');
                        navigate('/cart');
                        return;
                    }
                    setCart(cartData);
                } else {
                    const guestCart = guestCartService.getCart();
                    if (!guestCart.items || guestCart.items.length === 0) {
                        toast.error('Your cart is empty');
                        navigate('/cart');
                        return;
                    }
                    setCart(guestCart);
                }
            } catch (err) {
                console.error('Failed to fetch cart', err);
                toast.error('Failed to load cart');
                navigate('/cart');
            } finally {
                setLoading(false);
            }
        };
        fetchCart();
    }, [navigate, isAuthenticated]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleGuestChange = (e) => {
        const { name, value } = e.target;
        setGuestContact(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validate = () => {
        const errs = {};
        if (!address.fullName.trim()) errs.fullName = 'Full name is required';
        if (!address.phone.trim()) errs.phone = 'Phone number is required';
        else if (!/^[6-9]\d{9}$/.test(address.phone.trim())) errs.phone = 'Enter a valid 10-digit phone number';
        if (!address.street.trim()) errs.street = 'Street address is required';
        if (!address.city.trim()) errs.city = 'City is required';
        if (!address.state.trim()) errs.state = 'State is required';
        if (!address.zipCode.trim()) errs.zipCode = 'ZIP code is required';
        else if (!/^\d{6}$/.test(address.zipCode.trim())) errs.zipCode = 'Enter a valid 6-digit ZIP code';

        // Guest-specific validation
        if (!isAuthenticated) {
            if (!guestContact.mobile.trim()) errs.mobile = 'Mobile number is required for guest checkout';
            else if (!/^[6-9]\d{9}$/.test(guestContact.mobile.trim())) errs.mobile = 'Enter a valid 10-digit mobile number';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const buildShippingAddress = useCallback(() => ({
        fullName: address.fullName,
        phone: address.phone,
        address: address.street,
        city: address.city,
        state: address.state,
        pincode: address.zipCode
    }), [address]);

    /**
     * Handle Razorpay Online Payment Flow
     */
    const handleRazorpayPayment = async (shippingAddress) => {
        // 1. Load Razorpay SDK
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
            toast.error('Failed to load payment gateway. Please check your internet connection.');
            return;
        }

        // 2. Create Razorpay order on backend
        let orderData;
        try {
            const response = await orderAPI.createRazorpayOrder(shippingAddress);
            orderData = response.data?.data || response.data;
        } catch (err) {
            console.error('Razorpay order creation failed', err);
            toast.error(err.response?.data?.message || 'Failed to create payment order. Please try again.');
            return;
        }

        const { orderId, orderNumber, razorpayOrderId, amount, currency } = orderData;

        // 3. Open Razorpay Checkout
        const options = {
            key: import.meta.env.VITE_RAZORPAY_PUBLIC_ID, // Use Public ID to avoid deployment warnings
            amount: amount * 100, // Amount in paise
            currency: currency || 'INR',
            name: 'Chai Darbar',
            description: `Order #${orderNumber}`,
            order_id: razorpayOrderId,
            prefill: {
                name: address.fullName,
                contact: address.phone,
                email: user?.email || '',
            },
            theme: {
                color: '#385040',
            },
            handler: async (response) => {
                // 4. Verify payment on backend
                try {
                    await orderAPI.verifyRazorpayPayment({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature,
                        orderId: orderId,
                    });

                    // Payment verified successfully
                    window.dispatchEvent(new Event('cartUpdated'));
                    navigate('/order-success', {
                        state: {
                            orderNumber,
                            orderId,
                            amount,
                            paymentId: response.razorpay_payment_id,
                        }
                    });
                } catch (verifyErr) {
                    console.error('Payment verification failed', verifyErr);
                    navigate('/order-failure', {
                        state: {
                            orderNumber,
                            orderId,
                            reason: verifyErr.response?.data?.message || 'Payment verification failed',
                        }
                    });
                }
            },
            modal: {
                ondismiss: () => {
                    toast.error('Payment cancelled. Your order is pending.');
                    // Navigate to failure page with cancellation info
                    navigate('/order-failure', {
                        state: {
                            orderNumber,
                            orderId,
                            reason: 'Payment was cancelled by user',
                        }
                    });
                },
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
            console.error('Razorpay payment failed', response.error);
            navigate('/order-failure', {
                state: {
                    orderNumber,
                    orderId,
                    reason: response.error?.description || 'Payment failed',
                }
            });
        });
        rzp.open();
    };

    const handlePlaceOrder = async () => {
        if (!validate()) {
            toast.error('Please fill all required fields');
            return;
        }
        setPlacing(true);
        try {
            const shippingAddress = buildShippingAddress();

            if (isAuthenticated && paymentMethod === 'online') {
                // === RAZORPAY ONLINE PAYMENT ===
                await handleRazorpayPayment(shippingAddress);
            } else if (isAuthenticated) {
                // === COD for authenticated users ===
                await orderAPI.createOrder(shippingAddress, paymentMethod);
                toast.success('Order placed successfully! 🎉');
                window.dispatchEvent(new Event('cartUpdated'));
                navigate('/orders');
            } else {
                // === Guest user → COD only ===
                const items = guestCartService.getOrderItems();
                await orderAPI.createGuestOrder({
                    items,
                    shippingAddress,
                    guestContact: {
                        mobile: guestContact.mobile.trim(),
                        name: guestContact.name.trim() || address.fullName,
                        email: guestContact.email.trim() || ''
                    },
                    paymentMethod
                });
                guestCartService.clearCart();
                toast.success('Order placed successfully! 🎉 Track your order with your mobile number.');
                navigate('/track-order');
            }
        } catch (err) {
            console.error('Order placement failed', err);
            toast.error(err.response?.data?.message || 'Failed to place order. Please try again.');
        } finally {
            setPlacing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#385040] animate-spin" />
            </div>
        );
    }

    const totalPrice = cart?.totalPrice || 0;
    const shipping = totalPrice > 500 ? 0 : 50.00;
    const total = totalPrice + shipping;

    return (
        <div className="min-h-screen bg-[#F9F9F9] pt-24 pb-16 font-sans text-[#1A1A1A]">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <Link to="/cart" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#385040] transition-colors uppercase tracking-wide mb-4">
                        <ArrowLeft className="w-4 h-4" /> Back to Cart
                    </Link>
                    <h1 className="font-display text-3xl font-bold">Checkout</h1>
                </div>

                <div className="lg:grid lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT: Form */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Guest Contact Info (only for non-authenticated) */}
                        {!isAuthenticated && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-amber-200 shadow-sm p-6 sm:p-8">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center text-sm font-bold">
                                        <Phone className="w-4 h-4" />
                                    </div>
                                    <h2 className="font-display text-xl font-bold">Guest Checkout</h2>
                                </div>
                                <p className="text-xs text-gray-400 mb-6">Provide your mobile number to track your order. No account needed!</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <InputField
                                        label="Mobile Number *"
                                        name="mobile"
                                        type="tel"
                                        placeholder="9876543210"
                                        value={guestContact.mobile}
                                        onChange={handleGuestChange}
                                        error={errors.mobile}
                                        autoComplete="tel"
                                    />
                                    <InputField
                                        label="Name (optional)"
                                        name="name"
                                        placeholder="Your name"
                                        value={guestContact.name}
                                        onChange={handleGuestChange}
                                        autoComplete="name"
                                    />
                                    <InputField
                                        label="Email (optional)"
                                        name="email"
                                        type="email"
                                        placeholder="email@example.com"
                                        value={guestContact.email}
                                        onChange={handleGuestChange}
                                        autoComplete="email"
                                        colSpan="sm:col-span-2"
                                    />
                                </div>
                            </motion.div>
                        )}

                        {/* Shipping Address */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-[#385040] text-white flex items-center justify-center text-sm font-bold">{isAuthenticated ? '1' : '2'}</div>
                                <h2 className="font-display text-xl font-bold">Shipping Address</h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <InputField
                                    label="Full Name"
                                    name="fullName"
                                    placeholder="John Doe"
                                    value={address.fullName}
                                    onChange={handleChange}
                                    error={errors.fullName}
                                    autoComplete="name"
                                />
                                <InputField
                                    label="Phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="9876543210"
                                    value={address.phone}
                                    onChange={handleChange}
                                    error={errors.phone}
                                    autoComplete="tel"
                                />
                                <InputField
                                    label="Street Address"
                                    name="street"
                                    placeholder="123 Tea Estate Road"
                                    colSpan="sm:col-span-2"
                                    value={address.street}
                                    onChange={handleChange}
                                    error={errors.street}
                                    autoComplete="street-address"
                                />
                                <InputField
                                    label="City"
                                    name="city"
                                    placeholder="Mumbai"
                                    value={address.city}
                                    onChange={handleChange}
                                    error={errors.city}
                                    autoComplete="address-level2"
                                />
                                <InputField
                                    label="State"
                                    name="state"
                                    placeholder="Maharashtra"
                                    value={address.state}
                                    onChange={handleChange}
                                    error={errors.state}
                                    autoComplete="address-level1"
                                />
                                <InputField
                                    label="ZIP Code"
                                    name="zipCode"
                                    placeholder="400001"
                                    value={address.zipCode}
                                    onChange={handleChange}
                                    error={errors.zipCode}
                                    autoComplete="postal-code"
                                />
                                <InputField
                                    label="Country"
                                    name="country"
                                    placeholder="India"
                                    value={address.country}
                                    onChange={handleChange}
                                    error={errors.country}
                                    autoComplete="country-name"
                                />
                            </div>
                        </motion.div>

                        {/* Payment Method */}
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-8 h-8 rounded-full bg-[#385040] text-white flex items-center justify-center text-sm font-bold">{isAuthenticated ? '2' : '3'}</div>
                                <h2 className="font-display text-xl font-bold">Payment Method</h2>
                            </div>

                            <div className="grid gap-3">
                                {PAYMENT_METHODS.map((method) => {
                                    // Guests can only use COD
                                    const isDisabled = !isAuthenticated && method.id === 'online';
                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => !isDisabled && setPaymentMethod(method.id)}
                                            disabled={isDisabled}
                                            className={`flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${paymentMethod === method.id
                                                ? 'border-[#385040] bg-[#385040]/5 shadow-sm'
                                                : 'border-gray-200 hover:border-gray-300'
                                                } ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                                        >
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${paymentMethod === method.id ? 'bg-[#385040] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                <method.icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-[#1A1A1A]">{method.label}</p>
                                                <p className="text-xs text-gray-400">
                                                    {isDisabled ? 'Login required for online payment' : method.desc}
                                                </p>
                                            </div>
                                            <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-[#385040]' : 'border-gray-300'}`}>
                                                {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-[#385040]" />}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            {paymentMethod === 'online' && (
                                <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
                                    <ShieldCheck className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                                    <p className="text-xs text-blue-700">
                                        Your payment is secured by Razorpay. We support UPI, Credit/Debit Cards, Net Banking, and Wallets.
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>

                    {/* RIGHT: Order Summary */}
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 sm:p-8 sticky top-32">
                            <h2 className="font-display text-xl font-bold text-[#1A1A1A] mb-6 border-b border-gray-100 pb-4">Order Summary</h2>

                            {/* Items */}
                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                                {cart?.items?.map((item, idx) => (
                                    <div key={idx} className="flex gap-3 items-center">
                                        <div className="w-14 h-14 bg-[#F5F5F0] rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                            <img src={item.product?.image} alt={item.product?.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-[#1A1A1A] truncate">{item.product?.name}</p>
                                            <p className="text-xs text-gray-400">{item.variantSize} × {item.quantity}</p>
                                        </div>
                                        <span className="text-sm font-bold text-[#1A1A1A] shrink-0">₹{item.itemTotal?.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="border-t border-gray-100 pt-4 space-y-3 mb-6">
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Subtotal</span>
                                    <span className="font-bold">₹{totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600">
                                    <span>Shipping</span>
                                    <span className={`font-bold ${shipping === 0 ? 'text-green-600' : ''}`}>
                                        {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 pt-4 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="text-base font-bold">Total</span>
                                    <span className="font-display text-3xl font-bold text-[#1A1A1A]">₹{total.toFixed(2)}</span>
                                </div>
                                <p className="text-[10px] text-gray-400 text-right mt-1">Inclusive of all taxes</p>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={placing}
                                className="w-full py-4 bg-[#1A1A1A] text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#385040] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
                            >
                                {placing ? (
                                    <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                                ) : paymentMethod === 'online' ? (
                                    <><CreditCard className="w-4 h-4" /> Pay ₹{total.toFixed(2)}</>
                                ) : (
                                    <>Place Order</>
                                )}
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-6 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secure</span>
                                <span className="flex items-center gap-1.5"><Leaf className="w-3.5 h-3.5" /> Estate Direct</span>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </div>
    );
}
