import { useState, useEffect, useRef, useCallback } from 'react';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'sonner';
import {
    Search, Filter, Eye, MoreHorizontal, CheckCircle,
    Truck, Package, XCircle, Clock, Calendar, DollarSign,
    ChevronLeft, ChevronRight, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import OrderDetailsModal from './OrderDetailsModal';

// Status Badge Component
const StatusBadge = ({ status }) => {
    const styles = {
        placed: "bg-blue-50 text-blue-700 border-blue-200",
        dispatched: "bg-yellow-50 text-yellow-700 border-yellow-200",
        shipped: "bg-purple-50 text-purple-700 border-purple-200",
        delivered: "bg-green-50 text-green-700 border-green-200",
        cancelled: "bg-red-50 text-red-700 border-red-200",
        pending: "bg-gray-50 text-gray-700 border-gray-200",
        cod: "bg-orange-50 text-orange-700 border-orange-200",
        paid: "bg-emerald-50 text-emerald-700 border-emerald-200"
    };

    return (
        <span className={`px-3 py-1 text-xs font-bold rounded-full border ${styles[status] || styles.pending} uppercase tracking-wide`}>
            {status}
        </span>
    );
};

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        orderStatus: '',
        paymentStatus: ''
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [viewOrder, setViewOrder] = useState(null); // For details view
    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [lastRefreshed, setLastRefreshed] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const intervalRef = useRef(null);

    // Fetch Orders
    const fetchOrders = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        setIsRefreshing(true);
        try {
            const response = await adminAPI.getAllOrders(filters);
            if (response.success) {
                setOrders(response.data);
                setLastRefreshed(new Date());
            }
        } catch (error) {
            console.error("Failed to fetch orders", error);
            if (!silent) toast.error("Failed to fetch orders");
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    }, [filters]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    // Auto-refresh every 30 seconds for real-time order updates
    useEffect(() => {
        intervalRef.current = setInterval(() => {
            fetchOrders(true); // silent refresh
        }, 30000);
        return () => clearInterval(intervalRef.current);
    }, [fetchOrders]);

    // Also refresh when tab becomes visible
    useEffect(() => {
        const handleVisibility = () => {
            if (document.visibilityState === 'visible') {
                fetchOrders(true);
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);
        return () => document.removeEventListener('visibilitychange', handleVisibility);
    }, [fetchOrders]);

    // Update Status Handler
    const handleStatusUpdate = async (newStatus) => {
        if (!selectedOrder) return;

        try {
            const response = await adminAPI.updateOrderStatus(selectedOrder._id, newStatus);
            if (response.success) {
                toast.success(`Order status updated to ${newStatus}`);
                setOrders(orders.map(o => o._id === selectedOrder._id ? response.data : o));
                setIsStatusModalOpen(false);
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error("Update failed", error);
            toast.error(error.response?.data?.message || "Failed to update status");
        }
    };

    // Mark Payment as Received (COD)
    const handlePaymentUpdate = async (orderId) => {
        try {
            const response = await adminAPI.updatePaymentStatus(orderId, 'paid');
            if (response.success) {
                toast.success('Payment marked as received');
                setOrders(orders.map(o => o._id === orderId ? response.data : o));
                setIsStatusModalOpen(false);
                setSelectedOrder(null);
            }
        } catch (error) {
            console.error("Payment update failed", error);
            toast.error(error.response?.data?.message || "Failed to update payment");
        }
    };

    return (
        <div className="space-y-6">
            {/* Header & Filters */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display font-bold text-3xl text-[#1a1a1a]">Orders</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-gray-500">Manage and track customer orders</p>
                        <span className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            Auto-refreshing · Last: {lastRefreshed.toLocaleTimeString()}
                        </span>
                    </div>
                </div>

                <div className="flex gap-3">
                    <select
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#385040] outline-none"
                        value={filters.orderStatus}
                        onChange={(e) => setFilters(prev => ({ ...prev, orderStatus: e.target.value }))}
                    >
                        <option value="">All Statuses</option>
                        <option value="placed">Placed</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#385040] outline-none"
                        value={filters.paymentStatus}
                        onChange={(e) => setFilters(prev => ({ ...prev, paymentStatus: e.target.value }))}
                    >
                        <option value="">All Payments</option>
                        <option value="pending">Pending</option>
                        <option value="cod">COD</option>
                        <option value="paid">Paid</option>
                    </select>

                    <button
                        onClick={() => fetchOrders(false)}
                        disabled={isRefreshing}
                        className="p-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                        title="Refresh Orders"
                    >
                        <RefreshCw className={`w-5 h-5 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                                <th className="px-6 py-4">Order ID</th>
                                <th className="px-6 py-4">Customer</th>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Total</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Payment</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                // Skeleton Loader Info
                                [...Array(5)].map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-20"></div></td>
                                        <td className="px-6 py-4"><div className="h-6 bg-gray-200 rounded-full w-16"></div></td>
                                        <td className="px-6 py-4"><div className="h-8 bg-gray-200 rounded w-8 ml-auto"></div></td>
                                    </tr>
                                ))
                            ) : orders.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                        No orders found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                orders.map((order) => (
                                    <tr key={order._id} className="hover:bg-gray-50 transition-colors group">
                                        <td className="px-6 py-4 font-mono text-sm text-gray-600">
                                            #{order.orderNumber?.split('-')[2] || order._id.slice(-6)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-[#1a1a1a]">{order.shippingAddress?.fullName || 'N/A'}</div>
                                            <div className="text-xs text-gray-400">{order.user?.email}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 font-bold text-[#1a1a1a]">
                                            ₹{order.total}
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={order.orderStatus} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full ${order.paymentStatus === 'paid'
                                                ? 'bg-green-50 text-green-600 border border-green-200'
                                                : order.paymentStatus === 'cod'
                                                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                                    : 'bg-yellow-50 text-yellow-600 border border-yellow-200'
                                                }`}>
                                                {order.paymentStatus === 'cod' ? 'COD' : order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => setViewOrder(order)}
                                                    className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all text-gray-400 hover:text-[#385040]"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedOrder(order);
                                                        setIsStatusModalOpen(true);
                                                    }}
                                                    className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all text-gray-400 hover:text-[#385040]"
                                                    title="Update Status"
                                                >
                                                    <MoreHorizontal className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* View Details Modal */}
            <AnimatePresence>
                {viewOrder && (
                    <OrderDetailsModal
                        isOpen={!!viewOrder}
                        onClose={() => setViewOrder(null)}
                        order={viewOrder}
                    />
                )}
            </AnimatePresence>

            {/* Update Status Modal */}
            <AnimatePresence>
                {isStatusModalOpen && selectedOrder && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
                            onClick={() => setIsStatusModalOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-xl z-50 p-6 border border-gray-100"
                        >
                            <h3 className="text-xl font-bold text-[#1a1a1a] mb-4">Update Order Status</h3>
                            <p className="text-gray-500 mb-6">
                                Change status for Order <span className="font-mono font-bold text-[#1a1a1a]">#{selectedOrder.orderNumber}</span>
                            </p>

                            <div className="grid grid-cols-1 gap-2">
                                {['placed', 'dispatched', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => handleStatusUpdate(status)}
                                        className={`
                                            px-4 py-3 rounded-xl text-left font-medium transition-all flex items-center justify-between
                                            ${selectedOrder.orderStatus === status
                                                ? 'bg-[#385040] text-white shadow-lg shadow-[#385040]/20'
                                                : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                            }
                                        `}
                                    >
                                        <span className="capitalize">{status}</span>
                                        {selectedOrder.orderStatus === status && <CheckCircle className="w-5 h-5" />}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={() => setIsStatusModalOpen(false)}
                                className="mt-4 w-full py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl transition-colors"
                            >
                                Cancel
                            </button>

                            {/* Mark Payment Received (for COD/pending orders) */}
                            {selectedOrder.paymentStatus !== 'paid' && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-sm text-gray-500 mb-2">Payment: <span className="font-bold capitalize">{selectedOrder.paymentStatus}</span></p>
                                    <button
                                        onClick={() => handlePaymentUpdate(selectedOrder._id)}
                                        className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Mark Payment Received
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
