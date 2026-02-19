import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Clock, Truck, CheckCircle, XCircle, Loader2, ShoppingBag, ArrowRight, AlertCircle, ChevronDown, ChevronUp, MapPin, Calendar, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '@/services/orderAPI';
import { toast } from 'sonner';

const STATUS_STEPS = ['placed', 'dispatched', 'shipped', 'delivered'];

const STATUS_CONFIG = {
    placed: { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', label: 'Order Placed', desc: 'We have received your order' },
    dispatched: { icon: Package, color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'Dispatched', desc: 'Order is packed and ready' },
    shipped: { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-200', label: 'In Transit', desc: 'Order is on the way' },
    delivered: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-200', label: 'Delivered', desc: 'Package arrived' },
    cancelled: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', label: 'Cancelled', desc: 'Order was cancelled' },
};

export default function MyOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancellingId, setCancellingId] = useState(null);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const fetchOrders = async () => {
        try {
            setError(null);
            const { data } = await orderAPI.getMyOrders();
            setOrders(data.data || []);
        } catch (err) {
            console.error('Failed to fetch orders', err);
            setError('Failed to load your orders. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleCancel = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) return;
        setCancellingId(orderId);
        try {
            const { data } = await orderAPI.cancelOrder(orderId);
            setOrders(prev => prev.map(o => o._id === orderId ? data.data : o));
            toast.success('Order cancelled successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancellingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-[#385040] animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-6 bg-white p-12 rounded-xl shadow-sm border border-gray-100">
                    <AlertCircle className="w-12 h-12 mx-auto text-red-400 mb-4" />
                    <h2 className="font-display text-xl text-[#1A1A1A] mb-3">{error}</h2>
                    <button onClick={fetchOrders} className="inline-flex items-center gap-2 px-6 py-3 bg-[#1A1A1A] text-white rounded-lg font-bold uppercase tracking-widest text-xs hover:bg-[#385040] transition-colors">
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-[#F9F9F9] flex items-center justify-center pt-24 pb-12">
                <div className="text-center max-w-md mx-auto px-6 bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
                    <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-6 opacity-80">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ShoppingBag className="w-10 h-10 text-gray-400" />
                        </div>
                    </motion.div>
                    <h2 className="font-display text-2xl font-bold text-[#1A1A1A] mb-3">No Orders Yet</h2>
                    <p className="text-gray-500 mb-8 text-sm leading-relaxed">It looks like you haven't placed any orders yet. Start exploring our premium tea collection today.</p>
                    <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-4 bg-[#1A1A1A] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#385040] transition-all shadow-lg hover:shadow-xl active:scale-95">
                        Start Shopping <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9F9F9] pt-24 pb-20 font-sans text-[#1A1A1A]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="mb-10">
                    <h1 className="font-display text-3xl font-bold text-[#1A1A1A]">My Orders</h1>
                    <p className="text-gray-500 mt-2">Track and manage your recent purchases</p>
                </div>

                {/* Orders List */}
                <div className="space-y-6">
                    {orders.map((order) => {
                        const statusKey = order.orderStatus;
                        const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.placed;
                        const StatusIcon = status.icon;
                        const isExpanded = expandedOrder === order._id;
                        const canCancel = ['placed', 'pending'].includes(statusKey);

                        // Calculate timeline progress
                        const currentStepIndex = STATUS_STEPS.indexOf(statusKey);
                        const isCancelled = statusKey === 'cancelled';

                        return (
                            <motion.div
                                key={order._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                            >
                                {/* Order Summary Header */}
                                <div className="p-6 border-b border-gray-50/50">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                        {/* Order Info */}
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl ${status.bg} ${status.color} flex items-center justify-center shrink-0`}>
                                                <StatusIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 flex-wrap mb-1">
                                                    <h3 className="font-display font-bold text-lg text-[#1A1A1A]">
                                                        #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                                                    </h3>
                                                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full border uppercase tracking-wider ${status.bg} ${status.color} ${status.border}`}>
                                                        {status.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-xs text-gray-500 font-medium">
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span>{order.items?.length} Item{order.items?.length !== 1 ? 's' : ''}</span>
                                                    <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                    <span className="text-[#1A1A1A] font-bold">₹{order.total?.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex items-center gap-3">
                                            {canCancel && (
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleCancel(order._id); }}
                                                    disabled={cancellingId === order._id}
                                                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center gap-2"
                                                >
                                                    {cancellingId === order._id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                                                    Cancel
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                                className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#1A1A1A] border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                                            >
                                                {isExpanded ? 'Hide Details' : 'View Details'}
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                                        >
                                            <div className="p-6 bg-gray-50/30">

                                                {/* Timeline (Only if not cancelled) */}
                                                {!isCancelled && (
                                                    <div className="mb-8 px-2">
                                                        <div className="relative">
                                                            {/* Background Line */}
                                                            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 rounded-full hidden sm:block"></div>
                                                            <div className="absolute top-0 bottom-0 left-4 w-0.5 bg-gray-200 -translate-x-1/2 rounded-full block sm:hidden"></div>

                                                            {/* Colored Progress Line (Desktop) */}
                                                            <div
                                                                className={`absolute top-1/2 left-0 h-0.5 -translate-y-1/2 rounded-full hidden sm:block transition-all duration-1000 ease-out ${status.bg.replace('bg-', 'bg-').replace('50', '500')}`}
                                                                style={{ width: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                                                            ></div>

                                                            {/* Colored Progress Line (Mobile) */}
                                                            <div
                                                                className={`absolute top-0 left-4 w-0.5 -translate-x-1/2 rounded-full block sm:hidden transition-all duration-1000 ease-out ${status.bg.replace('bg-', 'bg-').replace('50', '500')}`}
                                                                style={{ height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
                                                            ></div>

                                                            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-4 gap-6 sm:gap-0">
                                                                {STATUS_STEPS.map((step, idx) => {
                                                                    const stepConfig = STATUS_CONFIG[step];
                                                                    const StepIcon = stepConfig.icon;
                                                                    const isCompleted = idx <= currentStepIndex;
                                                                    const isCurrent = idx === currentStepIndex;

                                                                    return (
                                                                        <div key={step} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3">
                                                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0
                                                                                ${isCompleted ? `${stepConfig.color} ${stepConfig.border} bg-white` : 'text-gray-300 border-gray-200 bg-white'}
                                                                                ${isCurrent ? 'ring-4 ring-gray-100 scale-110' : ''}
                                                                            `}>
                                                                                <StepIcon className="w-4 h-4" />
                                                                            </div>
                                                                            <div className="text-left sm:text-center">
                                                                                <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? 'text-[#1A1A1A]' : 'text-gray-400'}`}>
                                                                                    {stepConfig.label}
                                                                                </p>
                                                                                {isCurrent && <p className="text-[10px] text-gray-500 mt-0.5 hidden sm:block">{stepConfig.desc}</p>}
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="grid md:grid-cols-2 gap-8">

                                                    {/* Product List */}
                                                    <div className="space-y-4">
                                                        <h4 className="font-display font-bold text-[#1A1A1A] flex items-center gap-2">
                                                            <ShoppingBag className="w-4 h-4 text-gray-400" /> Order Items
                                                        </h4>
                                                        <div className="space-y-3">
                                                            {order.items?.map((item, idx) => (
                                                                <div key={idx} className="flex gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-[#385040]/30 transition-colors">
                                                                    <div className="w-20 h-20 bg-[#F5F5F0] rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                                                        <img src={item.productImage} alt={item.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                                                                        <h5 className="font-display font-bold text-[#1A1A1A] truncate text-base">{item.productName}</h5>
                                                                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                                                            <span className="bg-gray-100 px-2 py-0.5 rounded text-[#1A1A1A] font-bold">{item.variantSize}</span>
                                                                            <span>Qty: {item.quantity}</span>
                                                                        </div>
                                                                        <p className="font-bold text-[#385040] mt-2">₹{(item.price * item.quantity).toFixed(2)}</p>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Shipping & Payment Details */}
                                                    <div className="space-y-6">
                                                        {order.shippingAddress && (
                                                            <div>
                                                                <h4 className="font-display font-bold text-[#1A1A1A] flex items-center gap-2 mb-3">
                                                                    <MapPin className="w-4 h-4 text-gray-400" /> Shipping Address
                                                                </h4>
                                                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                                                    <p className="font-bold text-[#1A1A1A] mb-1">{order.shippingAddress.fullName}</p>
                                                                    <p className="text-sm text-gray-600 leading-relaxed mb-3">
                                                                        {order.shippingAddress.address}, <br />
                                                                        {order.shippingAddress.city}, {order.shippingAddress.state} - <span className="font-bold">{order.shippingAddress.pincode}</span>
                                                                    </p>
                                                                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Phone: {order.shippingAddress.phone}</p>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {order.paymentStatus !== 'cod' && (
                                                            <div>
                                                                <h4 className="font-display font-bold text-[#1A1A1A] flex items-center gap-2 mb-3">
                                                                    <CreditCard className="w-4 h-4 text-gray-400" /> Payment Info
                                                                </h4>
                                                                <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-gray-500">
                                                                            <CreditCard className="w-5 h-5" />
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm font-bold text-[#1A1A1A]">Online Payment</p>
                                                                            <p className="text-xs text-gray-400">
                                                                                {order.paymentStatus === 'paid' ? 'Paid via Gateway' : 'Payment Pending'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <span className={`px-3 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${order.paymentStatus === 'paid' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                                                                        }`}>
                                                                        {order.paymentStatus === 'paid' ? 'PAID' : 'PENDING'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
