import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import { orderAPI } from '../../services/orderAPI';
import { X, Package, Calendar, DollarSign, ShoppingBag, MapPin, Phone, Mail, Clock, CheckCircle, Truck, RefreshCw, ExternalLink, Copy } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OrderDetailsModal({ isOpen, onClose, order }) {
    const [userHistory, setUserHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [trackingData, setTrackingData] = useState(null);
    const [trackingLoading, setTrackingLoading] = useState(false);

    useEffect(() => {
        if (isOpen && order?.user?._id) {
            fetchUserHistory(order.user._id);
        }
    }, [isOpen, order]);

    const fetchUserHistory = async (userId) => {
        setLoadingHistory(true);
        try {
            // Fetch all orders for this user to calculate stats and show history
            const response = await adminAPI.getAllOrders({ userId });
            if (response.success) {
                // Filter out the current order from history list if desired, or keep it. 
                // Let's keep all to show total history.
                const data = response?.data || response;
                setUserHistory(Array.isArray(data) ? data : []);
            }
        } catch (error) {
            console.error("Failed to fetch user history", error);
            setUserHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    };

    const refreshTracking = async () => {
        if (!order?._id) return;
        setTrackingLoading(true);
        try {
            const response = await orderAPI.getOrderTracking(order._id);
            if (response.data) {
                setTrackingData(response.data);
            }
        } catch (error) {
            console.error('Failed to fetch tracking', error);
        } finally {
            setTrackingLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (!isOpen || !order) return null;

    // Calculate Customer Stats
    const totalOrders = userHistory.length;
    const totalSpent = userHistory.reduce((sum, o) => sum + (o.total || 0), 0);
    const averageOrderValue = totalOrders > 0 ? (totalSpent / totalOrders).toFixed(2) : 0;

    // Format Date
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric',
            hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 sticky top-0 z-10">
                    <div>
                        <h2 className="text-lg font-bold text-[#1A1A1A] flex items-center gap-2">
                            Order #{order.orderNumber}
                            <span className={`px-2.5 py-0.5 text-xs rounded-full border ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-blue-50 text-blue-700 border-blue-200'
                                }`}>
                                {order.orderStatus.toUpperCase()}
                            </span>
                        </h2>
                        <p className="text-xs text-gray-500 mt-0.5">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500 hover:text-[#1A1A1A]">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto p-6 flex-1">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left Column: Order Items & Shipping (2/3 width) */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* Order Items */}
                            <section>
                                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <ShoppingBag className="w-4 h-4" /> Order Items ({order.items?.length})
                                </h3>
                                <div className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-100 border-b border-gray-200 text-gray-500">
                                            <tr>
                                                <th className="px-4 py-3 font-medium">Product</th>
                                                <th className="px-4 py-3 font-medium">Size</th>
                                                <th className="px-4 py-3 font-medium text-right">Price</th>
                                                <th className="px-4 py-3 font-medium text-center">Qty</th>
                                                <th className="px-4 py-3 font-medium text-right">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {order.items?.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-white transition-colors">
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
                                                                <img src={item.productImage || item.product?.images?.[0]?.url || ''} alt={item.productName} className="w-full h-full object-cover" />
                                                            </div>
                                                            <span className="font-medium text-[#1A1A1A] line-clamp-1">{item.productName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3 text-gray-600">{item.variantSize}</td>
                                                    <td className="px-4 py-3 text-right text-gray-600">₹{item.price}</td>
                                                    <td className="px-4 py-3 text-center text-gray-600">{item.quantity}</td>
                                                    <td className="px-4 py-3 text-right font-medium text-[#1A1A1A]">₹{item.itemTotal || (item.price * item.quantity)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-white border-t border-gray-200">
                                            <tr>
                                                <td colSpan="4" className="px-4 py-2 text-right text-gray-500 font-medium">Subtotal</td>
                                                <td className="px-4 py-2 text-right font-medium text-[#1A1A1A]">₹{order.subtotal}</td>
                                            </tr>
                                            <tr>
                                                <td colSpan="4" className="px-4 py-2 text-right text-gray-500 font-medium">Delivery Charge</td>
                                                <td className="px-4 py-2 text-right font-medium text-[#1A1A1A]">₹{order.shipping || 0}</td>
                                            </tr>
                                            <tr className="border-t border-gray-100">
                                                <td colSpan="4" className="px-4 py-3 text-right font-bold text-gray-900">Total</td>
                                                <td className="px-4 py-3 text-right font-bold text-[#385040] text-lg">₹{order.total}</td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </section>

                            {/* Shipping & Payment Info Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Shipping */}
                                <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5" /> Shipping Address
                                    </h3>
                                    {order.shippingAddress ? (
                                        <div className="text-sm text-[#1A1A1A]">
                                            <p className="font-bold mb-1">{order.shippingAddress.fullName}</p>
                                            <p className="text-gray-600 leading-relaxed">
                                                {order.shippingAddress.address}<br />
                                                {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                                            </p>
                                            <p className="mt-2 flex items-center gap-2 text-gray-600">
                                                <Phone className="w-3.5 h-3.5" /> {order.shippingAddress.phone}
                                            </p>
                                        </div>
                                    ) : (
                                        <p className="text-gray-400 text-sm italic">No shipping address provided</p>
                                    )}
                                </section>

                                {/* Payment */}
                                <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                        <DollarSign className="w-3.5 h-3.5" /> Payment Info
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Method</span>
                                            <span className="text-sm font-medium text-[#1A1A1A] capitalize">
                                                Online
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-gray-500">Status</span>
                                            <span className={`px-2 py-0.5 text-xs rounded font-bold uppercase ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {order.paymentStatus}
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>

                            {/* Shiprocket Shipping Information */}
                            {(order.awbCode || order.shiprocketOrderId) && (
                                <section className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <Truck className="w-3.5 h-3.5" /> Shipment Details
                                        </h3>
                                        <button
                                            onClick={refreshTracking}
                                            disabled={trackingLoading}
                                            className="flex items-center gap-1.5 text-xs font-medium text-[#385040] hover:text-[#2a3d30] transition-colors disabled:opacity-50"
                                        >
                                            <RefreshCw className={`w-3.5 h-3.5 ${trackingLoading ? 'animate-spin' : ''}`} />
                                            Refresh Tracking
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {order.awbCode && (
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">AWB Code</p>
                                                <div className="flex items-center gap-1.5">
                                                    <span className="text-sm font-bold text-[#1A1A1A] font-mono">{order.awbCode}</span>
                                                    <button onClick={() => copyToClipboard(order.awbCode)} className="text-gray-400 hover:text-gray-600">
                                                        <Copy className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                        {order.courierName && (
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Courier</p>
                                                <p className="text-sm font-medium text-[#1A1A1A]">{order.courierName}</p>
                                            </div>
                                        )}
                                        {order.shiprocketOrderId && (
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Shiprocket Order ID</p>
                                                <p className="text-sm font-mono text-[#1A1A1A]">{order.shiprocketOrderId}</p>
                                            </div>
                                        )}
                                        {order.actualShippingCost != null && (
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Shipping Cost</p>
                                                <p className="text-sm font-medium text-[#1A1A1A]">₹{order.actualShippingCost}</p>
                                            </div>
                                        )}
                                        {order.pickupScheduledDate && (
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Pickup Scheduled</p>
                                                <p className="text-sm text-[#1A1A1A]">{formatDate(order.pickupScheduledDate)}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* PDF Links */}
                                    {(order.labelUrl || order.manifestUrl || order.invoiceUrl) && (
                                        <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
                                            {order.labelUrl && (
                                                <a href={order.labelUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                                                    <ExternalLink className="w-3 h-3" /> Label
                                                </a>
                                            )}
                                            {order.manifestUrl && (
                                                <a href={order.manifestUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                                                    <ExternalLink className="w-3 h-3" /> Manifest
                                                </a>
                                            )}
                                            {order.invoiceUrl && (
                                                <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg">
                                                    <ExternalLink className="w-3 h-3" /> Invoice
                                                </a>
                                            )}
                                        </div>
                                    )}

                                    {/* Tracking Timeline */}
                                    {trackingData?.tracking && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Tracking Timeline</h4>
                                            <div className="space-y-3 max-h-48 overflow-y-auto">
                                                {(trackingData.tracking.shipment_track_activities || []).map((activity, idx) => (
                                                    <div key={idx} className="flex gap-3">
                                                        <div className="flex flex-col items-center">
                                                            <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${idx === 0 ? 'bg-[#385040]' : 'bg-gray-300'}`} />
                                                            {idx < (trackingData.tracking.shipment_track_activities.length - 1) && (
                                                                <div className="w-px h-full bg-gray-200 mt-1" />
                                                            )}
                                                        </div>
                                                        <div className="pb-3">
                                                            <p className="text-sm font-medium text-[#1A1A1A]">{activity.activity}</p>
                                                            <p className="text-xs text-gray-400">{activity.location} &middot; {formatDate(activity.date)}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </section>
                            )}
                        </div>

                        {/* Right Column: Customer Profile & History (1/3 width) */}
                        <div className="space-y-6">

                            {/* Customer Profile Card */}
                            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="bg-gray-900 px-5 py-4">
                                    <h3 className="text-white font-bold flex items-center gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-400" /> Customer Profile
                                    </h3>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                                            {order.user?.name?.charAt(0) || userHistory[0]?.shippingAddress?.fullName?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1A1A1A]">{order.user?.name || order.shippingAddress?.fullName}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                <Mail className="w-3 h-3" /> {order.user?.email || 'Guest User'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Orders</p>
                                            <p className="text-xl font-display font-bold text-[#385040] mt-1">{loadingHistory ? '...' : totalOrders}</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Total Spent</p>
                                            <p className="text-xl font-display font-bold text-[#385040] mt-1">{loadingHistory ? '...' : `₹${totalSpent}`}</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Recent Order History */}
                            <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col max-h-[400px]">
                                <div className="bg-gray-50 px-5 py-3 border-b border-gray-200">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                                        <Clock className="w-3.5 h-3.5" /> Order History
                                    </h3>
                                </div>

                                <div className="overflow-y-auto flex-1 p-0">
                                    {loadingHistory ? (
                                        <div className="p-6 text-center text-gray-400 text-sm">Loading history...</div>
                                    ) : userHistory.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            {userHistory.map((histOrder) => (
                                                <div key={histOrder._id} className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${histOrder._id === order._id ? 'border-green-500 bg-green-50/50' : 'border-transparent'
                                                    }`}>
                                                    <div className="flex justify-between items-start mb-1">
                                                        <span className="font-mono text-xs font-bold text-gray-600">
                                                            #{histOrder.orderNumber?.split('-')[2] || histOrder._id.slice(-6)}
                                                        </span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${histOrder.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                                                            histOrder.orderStatus === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                                            }`}>
                                                            {histOrder.orderStatus}
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between items-end">
                                                        <div>
                                                            <p className="text-xs text-gray-500">{new Date(histOrder.createdAt).toLocaleDateString()}</p>
                                                            <p className="text-xs text-gray-400">{histOrder.items?.length || 0} items</p>
                                                        </div>
                                                        <span className="font-bold text-sm text-[#385040]">₹{histOrder.total}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-6 text-center text-gray-400 text-sm">No other orders found</div>
                                    )}
                                </div>
                            </section>

                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
