import { useState } from 'react';
import { Search, Package, Loader2, Phone, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { orderAPI } from '@/services/orderAPI';
import { toast } from 'sonner';

const STATUS_CONFIG = {
    pending: { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Pending' },
    confirmed: { icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Confirmed' },
    shipped: { icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50', label: 'Shipped' },
    delivered: { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', label: 'Delivered' },
    cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', label: 'Cancelled' },
};

export default function TrackOrder() {
    const [mobile, setMobile] = useState('');
    const [orders, setOrders] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        const cleanMobile = mobile.trim();
        if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
            toast.error('Please enter a valid 10-digit mobile number');
            return;
        }

        setLoading(true);
        setSearched(false);
        try {
            const { data } = await orderAPI.trackOrders(cleanMobile);
            setOrders(data.data || []);
            setSearched(true);
        } catch (err) {
            console.error('Track order failed', err);
            toast.error(err.response?.data?.message || 'Failed to track orders');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] pt-32 pb-16 font-sans text-[#1A1A1A]">
            <div className="max-w-2xl mx-auto px-4 sm:px-6">

                {/* Header */}
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-[#385040] rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Package className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="font-display text-3xl font-bold mb-2">Track Your Order</h1>
                    <p className="text-gray-400 text-sm">Enter the mobile number you used during checkout</p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleTrack} className="mb-10">
                    <div className="flex gap-3">
                        <div className="flex-1 relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="tel"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                                placeholder="Enter 10-digit mobile number"
                                maxLength={10}
                                className="w-full pl-11 pr-4 py-4 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#385040] focus:ring-1 focus:ring-[#385040]/20 transition-colors"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-4 bg-[#1A1A1A] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#385040] transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            Track
                        </button>
                    </div>
                </form>

                {/* Results */}
                <AnimatePresence mode="wait">
                    {searched && orders && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {orders.length === 0 ? (
                                <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                                    <Package className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                                    <h2 className="font-display text-xl font-bold text-gray-500 mb-2">No Orders Found</h2>
                                    <p className="text-sm text-gray-400">No orders found for this mobile number.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-500 font-bold">{orders.length} order(s) found</p>
                                    {orders.map((order) => {
                                        const status = STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
                                        const StatusIcon = status.icon;

                                        return (
                                            <motion.div
                                                key={order._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 sm:p-6"
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Order #{order.orderNumber}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                                    </div>
                                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${status.bg} ${status.color}`}>
                                                        <StatusIcon className="w-3.5 h-3.5" />
                                                        {status.label}
                                                    </span>
                                                </div>

                                                {/* Items summary */}
                                                <div className="space-y-2 mb-4">
                                                    {order.items?.map((item, idx) => (
                                                        <div key={idx} className="flex justify-between text-sm">
                                                            <span className="text-gray-600">{item.productName} <span className="text-gray-400">({item.variantSize} × {item.quantity})</span></span>
                                                            <span className="font-bold text-[#1A1A1A]">₹{item.itemTotal?.toFixed(2)}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                                                    <span className="text-sm font-bold text-gray-500">Total</span>
                                                    <span className="font-display text-xl font-bold text-[#1A1A1A]">₹{order.total?.toFixed(2)}</span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
