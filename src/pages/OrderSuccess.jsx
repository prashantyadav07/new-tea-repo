import { useLocation, Link, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, ArrowRight, ShoppingBag, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
    const location = useLocation();
    const { orderNumber, orderId, amount, paymentId } = location.state || {};
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!orderNumber) return;
        // Initial burst from left & right
        const fire = (opts) => confetti({ ...opts, colors: ['#385040', '#4CAF50', '#D4F57B', '#C8A96E', '#ffffff', '#f97316'] });
        fire({ particleCount: 60, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, scalar: 1.3, gravity: 1.1, ticks: 250 });
        fire({ particleCount: 60, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, scalar: 1.3, gravity: 1.1, ticks: 250 });
        // Delayed center burst
        const t = setTimeout(() => {
            fire({ particleCount: 80, spread: 100, origin: { y: 0.4 }, scalar: 1.5, gravity: 0.9, ticks: 300 });
        }, 350);
        return () => clearTimeout(t);
    }, [orderNumber]);

    // If no state, redirect to home
    if (!orderNumber) {
        return <Navigate to="/" replace />;
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(paymentId || orderNumber);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-[#F9F9F9] pt-24 pb-16 font-sans text-[#1A1A1A]">
            <div className="max-w-lg mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="bg-white rounded-2xl border border-gray-200 shadow-lg p-8 sm:p-10 text-center"
                >
                    {/* Success Icon */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center"
                    >
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </motion.div>

                    <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A] mb-2">
                        Payment Successful! 🎉
                    </h1>
                    <p className="text-gray-500 mb-8">
                        Your order has been placed and payment has been confirmed.
                    </p>

                    {/* Order Details Card */}
                    <div className="bg-[#F5F5F0] rounded-xl p-6 mb-8 text-left space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Order Number</span>
                            <span className="font-mono font-bold text-[#385040] text-sm">{orderNumber}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Amount Paid</span>
                            <span className="font-bold text-[#1A1A1A] text-lg">₹{amount?.toFixed(2)}</span>
                        </div>
                        {paymentId && (
                            <div className="flex justify-between items-center">
                                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Payment ID</span>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-1.5 text-xs font-mono text-gray-600 hover:text-[#385040] transition-colors"
                                >
                                    {paymentId.slice(0, 18)}...
                                    {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Status</span>
                            <span className="px-3 py-1 text-xs font-bold rounded-full bg-green-100 text-green-700 border border-green-200 uppercase">
                                Paid ✓
                            </span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <Link
                            to="/orders"
                            className="w-full py-3.5 bg-[#385040] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#2c3f33] transition-all shadow-md flex items-center justify-center gap-2"
                        >
                            <Package className="w-4 h-4" />
                            View My Orders
                        </Link>
                        <Link
                            to="/shop"
                            className="w-full py-3.5 bg-white text-[#1A1A1A] rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-50 transition-all border border-gray-200 flex items-center justify-center gap-2"
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
