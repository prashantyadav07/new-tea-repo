import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, ArrowRight, MessageSquare, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';
import { toast } from 'sonner';

export default function TrackComplaint() {
    const [complaintId, setComplaintId] = useState('');
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleTrack = async (e) => {
        e.preventDefault();
        if (!complaintId.trim()) return;

        setLoading(true);
        setSearched(true);
        setComplaint(null);

        try {
            const response = await adminAPI.trackComplaint(complaintId.trim());
            setComplaint(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Complaint not found. Please checks the ID.');
            setComplaint(null);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6]">
            {/* Hero Section */}
            <div className="bg-[#385040] text-white py-20 px-6">
                <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <Search className="w-8 h-8 text-[#D4F57B]" />
                        </div>
                        <h1 className="font-display text-4xl lg:text-5xl font-bold mb-4">Track Your Complaint</h1>
                        <p className="text-white/70 text-lg max-w-xl mx-auto font-serif">
                            Enter your Complaint ID to check the current status and view admin responses.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Search Section */}
            <div className="max-w-md mx-auto px-6 -mt-8 relative z-10">
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    onSubmit={handleTrack}
                    className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 flex gap-2"
                >
                    <input
                        type="text"
                        placeholder="Enter Complaint ID (e.g. 65c1...)"
                        value={complaintId}
                        onChange={(e) => setComplaintId(e.target.value)}
                        className="flex-1 px-4 py-3 rounded-xl bg-transparent focus:outline-none placeholder:text-gray-400 font-medium"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#385040] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#2c3e32] transition-colors disabled:opacity-70 flex items-center gap-2"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Track'}
                    </button>
                </motion.form>
            </div>

            {/* Result Section */}
            <div className="max-w-2xl mx-auto px-6 py-12">
                <AnimatePresence mode="wait">
                    {complaint ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                        >
                            <div className={`p-6 border-b border-gray-100 flex justify-between items-start ${complaint.status === 'open' ? 'bg-red-50' :
                                    complaint.status === 'resolved' ? 'bg-green-50' : 'bg-yellow-50'
                                }`}>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${complaint.status === 'open' ? 'bg-red-100 text-red-700 border-red-200' :
                                                complaint.status === 'resolved' ? 'bg-green-100 text-green-700 border-green-200' :
                                                    'bg-yellow-100 text-yellow-700 border-yellow-200'
                                            }`}>
                                            {complaint.status}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            • {new Date(complaint.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h2 className="font-bold text-xl text-[#1a1a1a]">{complaint.subject}</h2>
                                    <p className="text-sm text-gray-500 mt-1">Submitted by {complaint.name}</p>
                                </div>
                                <div className={`p-2 rounded-full ${complaint.status === 'open' ? 'bg-red-100 text-red-600' :
                                        complaint.status === 'resolved' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {complaint.status === 'open' ? <AlertCircle className="w-6 h-6" /> :
                                        complaint.status === 'resolved' ? <CheckCircle className="w-6 h-6" /> :
                                            <Clock className="w-6 h-6" />}
                                </div>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Message</p>
                                    <div className="bg-gray-50 p-4 rounded-xl text-gray-700 text-sm leading-relaxed">
                                        {complaint.message}
                                    </div>
                                </div>

                                {complaint.adminResponse && (
                                    <div className="relative">
                                        <div className="absolute -left-3 top-0 bottom-0 w-1 bg-[#385040]/20 rounded-full" />
                                        <div className="pl-6">
                                            <p className="text-xs font-bold text-[#385040] uppercase tracking-wider mb-2 flex items-center gap-2">
                                                <MessageSquare className="w-4 h-4" /> Admin Response
                                            </p>
                                            <div className="text-gray-800 leading-relaxed">
                                                {complaint.adminResponse}
                                            </div>
                                            {complaint.resolvedAt && (
                                                <p className="text-xs text-gray-400 mt-2">
                                                    Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {!complaint.adminResponse && (
                                    <div className="text-center py-6">
                                        <p className="text-gray-400 text-sm italic">No response yet. Our team is looking into it.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : searched && !loading && (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Complaint Not Found</h3>
                            <p className="text-gray-500 max-w-xs mx-auto mt-2">
                                We couldn't find a complaint with that ID. Please double-check and try again.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
