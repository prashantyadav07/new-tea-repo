import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Package, Truck, CreditCard, User, Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminOrderDetail() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [updatingPayment, setUpdatingPayment] = useState(false);

    const fetchOrder = async () => {
        try {
            const data = await adminAPI.getOrderById(id);
            setOrder(data.data);
        } catch (error) {
            toast.error('Failed to fetch order details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const handleStatusUpdate = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            await adminAPI.updateOrderStatus(id, newStatus);
            toast.success('Order status updated — email notification sent');
            fetchOrder();
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to update status';
            toast.error(msg);
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handlePaymentUpdate = async (newStatus) => {
        setUpdatingPayment(true);
        try {
            await adminAPI.updatePaymentStatus(id, newStatus);
            toast.success('Payment status updated');
            fetchOrder();
        } catch (error) {
            const msg = error.response?.data?.message || 'Failed to update payment status';
            toast.error(msg);
        } finally {
            setUpdatingPayment(false);
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#385040]" /></div>;
    if (!order) return <div className="text-center p-12">Order not found</div>;

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'shipped': return 'bg-blue-100 text-blue-700';
            case 'dispatched': return 'bg-purple-100 text-purple-700';
            case 'confirmed': return 'bg-indigo-100 text-indigo-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-yellow-100 text-yellow-700';
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            <Link to="/admin/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#385040] transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" /> Back to Orders
            </Link>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h1 className="font-display text-3xl font-bold text-[#1a1a1a]">Order #{order.orderNumber}</h1>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${getStatusColor(order.orderStatus)}`}>
                            {order.orderStatus}
                        </span>
                    </div>
                    <p className="text-gray-500">Placed on {new Date(order.createdAt).toLocaleString()}</p>
                </div>

                <div className="flex gap-3 items-center">
                    {updatingStatus && <Loader2 className="w-4 h-4 animate-spin text-[#385040]" />}
                    <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(e.target.value)}
                        disabled={updatingStatus}
                        className={`px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#385040] ${updatingStatus ? 'opacity-60 cursor-not-allowed' : ''}`}
                    >
                        <option value="placed">Placed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="dispatched">Dispatched</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Items */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700 flex items-center gap-2">
                            <Package className="w-4 h-4" /> Order Items ({order.items.length})
                        </div>
                        <div className="divide-y divide-gray-100">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="p-4 flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                        {/* Placeholder for product image if available in future */}
                                        <Package className="w-8 h-8 opacity-20" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-[#1a1a1a]">{item.productName}</h3>
                                        <p className="text-sm text-gray-500">Size: {item.variantSize} | Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#1a1a1a]">₹{item.itemTotal}</p>
                                        <p className="text-sm text-gray-400">₹{item.price} each</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center text-lg font-bold">
                            <span>Total Amount</span>
                            <span>₹{order.totalPrice}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column - Customer & Shipping Info */}
                <div className="space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700 flex items-center gap-2">
                            <User className="w-4 h-4" /> Customer Details
                        </div>
                        <div className="p-4 space-y-3">
                            {order.isGuest ? (
                                <div className="bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-xs font-bold inline-block mb-2">
                                    Guest User
                                </div>
                            ) : (
                                <div className="bg-green-50 text-green-700 px-3 py-1 rounded-lg text-xs font-bold inline-block mb-2">
                                    Registered User
                                </div>
                            )}

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <User className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1a1a1a]">{order.guestContact?.name || order.user?.name || "N/A"}</p>
                                    <p className="text-xs text-gray-400">Customer Name</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1a1a1a] text-sm break-all">{order.guestContact?.email || order.user?.email || "N/A"}</p>
                                    <p className="text-xs text-gray-400">Email Address</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="font-bold text-[#1a1a1a]">{order.guestContact?.mobile || order.shippingAddress?.phone || "N/A"}</p>
                                    <p className="text-xs text-gray-400">Mobile Number</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700 flex items-center gap-2">
                            <Truck className="w-4 h-4" /> Shipping Address
                        </div>
                        <div className="p-4 flex gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-gray-500">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="text-sm text-gray-600">
                                <p className="font-bold text-[#1a1a1a] mb-1">{order.shippingAddress.fullName}</p>
                                <p>{order.shippingAddress.address}</p>
                                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                                <p className="mt-1 font-medium">Phone: {order.shippingAddress.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 bg-gray-50 font-bold text-gray-700 flex items-center gap-2">
                            <CreditCard className="w-4 h-4" /> Payment Details
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Method</span>
                                <span className="font-bold uppercase text-[#1a1a1a]">{order.paymentMethod}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-500">Status</span>
                                <div className="flex items-center gap-2">
                                    {updatingPayment && <Loader2 className="w-3 h-3 animate-spin text-[#385040]" />}
                                    <select
                                        className={`text-sm font-bold border rounded px-2 py-1 ${updatingPayment ? 'opacity-60 cursor-not-allowed' : ''} ${order.paymentStatus === 'paid' ? 'text-green-700 border-green-200 bg-green-50' : 'text-yellow-700 border-yellow-200 bg-yellow-50'
                                            }`}
                                        value={order.paymentStatus}
                                        onChange={(e) => handlePaymentUpdate(e.target.value)}
                                        disabled={updatingPayment}
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="paid">Paid</option>
                                        <option value="failed">Failed</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
