import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, RefreshCw, ShoppingBag, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function OrderFailure() {
    const location = useLocation();
    const { orderNumber, orderId, reason } = location.state || {};

    // If no state, redirect to home
    if (!orderNumber && !reason) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="min-h-screen bg-[#F9F9F9] pt-24 pb-16 font-sans text-[#1A1A1A]">
            <div className="max-w-lg mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-10 text-center"
                >
                    {/* Failure Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center"
                    >
                        <XCircle className="w-10 h-10 text-red-600" />
                    </motion.div>

                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2">
                        Payment Failed
                    </h1>
                    <p className="text-gray-500 mb-6">
                        We couldn't process your payment. Don't worry, no money has been deducted.
                    </p>

                    {/* Error Details Card */}
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 mb-8 text-left">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-red-700 mb-1">What happened?</p>
                                <p className="text-sm text-red-600">{reason || 'An unexpected error occurred during payment processing.'}</p>
                            </div>
                        </div>
                    </div>

                    {orderNumber && (
                        <div className="bg-[#F5F5F0] rounded-xl p-4 mb-8 text-left">
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Order Number</span>
                                <span className="font-mono font-bold text-gray-600 text-sm">{orderNumber}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-2">
                                Your order has been created but payment is pending. You can retry the payment or contact support.
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            to="/orders"
                            className="w-full py-3.5 bg-[#385040] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#2c3f33] transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <RefreshCw className="w-4 h-4" />
                            View My Orders
                        </Link>
                        <Link
                            to="/checkout"
                            className="w-full py-3.5 bg-white text-[#1A1A1A] rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all border border-gray-200 flex items-center justify-center gap-2"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Try Again
                        </Link>
                        <Link
                            to="/shop"
                            className="w-full py-3 text-gray-500 font-bold text-xs uppercase tracking-widest hover:text-[#385040] transition-colors flex items-center justify-center gap-2"
                        >
                            <ShoppingBag className="w-4 h-4" />
                            Continue Shopping
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
