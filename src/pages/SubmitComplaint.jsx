import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageSquare, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

export default function SubmitComplaint() {
    const { user, isAuthenticated } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // Auto-fill removed


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await adminAPI.submitComplaint({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                subject: formData.subject,
                message: formData.message
            });
            setSubmitted(response);
            toast.success('Complaint submitted successfully!');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || 'Failed to submit complaint. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
                <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center border border-gray-100">
                    <div className="w-16 h-16 bg-[#385040]/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <MessageSquare className="w-8 h-8 text-[#385040]" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-[#1a1a1a] mb-3">Login Required</h2>
                    <p className="text-gray-500 mb-8">
                        To submit and track your complaints effectively, please log in to your account.
                    </p>
                    <a
                        href="/login"
                        className="px-8 py-3 bg-[#385040] text-white rounded-xl font-bold hover:bg-[#2c3e32] transition-colors inline-block w-full"
                    >
                        Login to Continue
                    </a>
                </div>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-lg p-12 max-w-md w-full text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="font-display text-2xl font-bold text-[#1a1a1a] mb-3">Complaint Submitted!</h2>
                    <p className="text-gray-500 mb-4">
                        Thank you for reaching out. You can track the status of this complaint in your profile.
                    </p>

                    <div className="flex flex-col gap-3">
                        <a
                            href="/profile"
                            className="px-6 py-3 bg-[#385040] text-white rounded-lg font-bold hover:bg-[#2c3e32] transition-colors"
                        >
                            View My Complaints
                        </a>
                        <button
                            onClick={() => {
                                setSubmitted(false);
                                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
                            }}
                            className="px-6 py-3 text-[#385040] font-bold hover:bg-[#385040]/5 rounded-lg transition-colors"
                        >
                            Submit Another
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            {/* Hero Header */}
            <div className="bg-[#385040] text-white py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <MessageSquare className="w-8 h-8 text-[#D4F57B]" />
                        </div>
                        <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Submit a Complaint</h1>
                        <p className="text-white/70 text-lg max-w-xl mx-auto font-serif">
                            We're sorry to hear you're facing an issue. Please share your concern and we'll resolve it as soon as possible.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Form Section */}
            <div className="max-w-2xl mx-auto px-6 py-12 -mt-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 lg:p-10"
                >
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name & Email Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                                    Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Your full name"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385040]/20 focus:border-[#385040] transition-colors"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="email"
                                    name="email"
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="your@email.com"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385040]/20 focus:border-[#385040] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                                Phone Number <span className="text-gray-400">(optional)</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385040]/20 focus:border-[#385040] transition-colors"
                            />
                        </div>

                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-bold text-gray-700 mb-2">
                                Subject <span className="text-red-500">*</span>
                            </label>
                            <input
                                required
                                type="text"
                                name="subject"
                                id="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                placeholder="Brief description of your issue"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385040]/20 focus:border-[#385040] transition-colors"
                            />
                        </div>

                        {/* Message */}
                        <div>
                            <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                                Your Complaint <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                required
                                name="message"
                                id="message"
                                rows={5}
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Please describe your issue in detail so we can help you better..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385040]/20 focus:border-[#385040] transition-colors resize-none"
                            />
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#385040] text-white py-4 rounded-xl font-bold text-base hover:bg-[#2c3e32] transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-[#385040]/20"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Complaint
                                </>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center text-gray-400 text-sm mt-6">
                        We take every complaint seriously. You'll receive a response within 24–48 hours.
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
