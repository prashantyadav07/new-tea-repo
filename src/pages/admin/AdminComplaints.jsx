import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, MessageSquare, CheckCircle, Clock, XCircle, Trash2, Send } from 'lucide-react';
import { toast } from 'sonner';

const ResponseModal = ({ isOpen, complaint, onClose, onSubmit }) => {
    const [response, setResponse] = useState('');
    const [status, setStatus] = useState('resolved');

    useEffect(() => {
        if (complaint) {
            setResponse(complaint.adminResponse || '');
            setStatus(complaint.status === 'open' ? 'resolved' : complaint.status);
        }
    }, [complaint, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(complaint._id, { status, adminResponse: response });
    };

    if (!isOpen || !complaint) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-display">Respond to Complaint</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><XCircle className="w-5 h-5" /></button>
                </div>

                <div className="mb-6 bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                        <span className="font-bold text-[#1a1a1a]">{complaint.subject}</span>
                        <span className="text-xs text-gray-400">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-gray-600 italic">"{complaint.message}"</p>
                    <div className="text-xs text-gray-400 mt-2">
                        From: {complaint.name} ({complaint.email})
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385040]/20 focus:border-[#385040]"
                        >
                            <option value="open">Open</option>
                            <option value="in-progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Response Message</label>
                        <textarea
                            required
                            rows={4}
                            value={response}
                            onChange={(e) => setResponse(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385040]/20 focus:border-[#385040] resize-none"
                            placeholder="Type your response here..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#385040] text-white rounded-lg font-medium hover:bg-[#2c3e32] flex items-center gap-2">
                            <Send className="w-4 h-4" /> Send Response
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedComplaint, setSelectedComplaint] = useState(null);

    const fetchComplaints = async () => {
        try {
            const data = await adminAPI.getAllComplaints(statusFilter === 'all' ? '' : statusFilter);
            setComplaints(data.data || []);
        } catch (error) {
            toast.error('Failed to fetch complaints');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [statusFilter]);

    const handleRespond = async (id, data) => {
        try {
            await adminAPI.respondToComplaint(id, data);
            toast.success('Response sent successfully');
            setSelectedComplaint(null);
            fetchComplaints();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send response');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this complaint?')) return;
        try {
            await adminAPI.deleteComplaint(id);
            toast.success('Complaint deleted successfully');
            fetchComplaints();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete complaint');
        }
    };

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#385040]" /></div>;

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'open', label: 'Open' },
        { id: 'in-progress', label: 'In Progress' },
        { id: 'resolved', label: 'Resolved' },
        { id: 'closed', label: 'Closed' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-[#1a1a1a]">Customer Complaints</h1>
                    <p className="text-gray-500">Manage and respond to customer inquiries and issues.</p>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-200">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setStatusFilter(tab.id)}
                        className={`px-6 py-3 text-sm font-medium whitespace-nowrap transition-colors relative ${statusFilter === tab.id
                                ? 'text-[#385040]'
                                : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        {tab.label}
                        {statusFilter === tab.id && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#385040]"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {complaints.map((complaint) => (
                    <motion.div
                        key={complaint._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
                    >
                        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                            <div className="flex items-start gap-4">
                                <div className={`mt-1 p-2 rounded-full ${complaint.status === 'open' ? 'bg-red-100 text-red-600' :
                                        complaint.status === 'resolved' ? 'bg-green-100 text-green-600' :
                                            'bg-yellow-100 text-yellow-600'
                                    }`}>
                                    {complaint.status === 'open' ? <Clock className="w-5 h-5" /> :
                                        complaint.status === 'resolved' ? <CheckCircle className="w-5 h-5" /> :
                                            <MessageSquare className="w-5 h-5" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-[#1a1a1a] mb-1">{complaint.subject}</h3>
                                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                                        <span>{complaint.name}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{complaint.email}</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full" />
                                        <span>{new Date(complaint.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${complaint.status === 'open' ? 'bg-red-100 text-red-700' :
                                        complaint.status === 'resolved' ? 'bg-green-100 text-green-700' :
                                            complaint.status === 'closed' ? 'bg-gray-100 text-gray-700' :
                                                'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {complaint.status}
                                </span>
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-700">
                            {complaint.message}
                        </div>

                        {complaint.adminResponse && (
                            <div className="bg-[#385040]/5 rounded-lg p-4 mb-4 border border-[#385040]/10">
                                <p className="text-xs font-bold text-[#385040] uppercase tracking-wider mb-2">Our Response</p>
                                <p className="text-gray-700">{complaint.adminResponse}</p>
                                {complaint.resolvedAt && (
                                    <p className="text-xs text-gray-400 mt-2">Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()}</p>
                                )}
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => handleDelete(complaint._id)}
                                className="px-4 py-2 text-sm font-bold text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" /> Delete
                            </button>
                            <button
                                onClick={() => setSelectedComplaint(complaint)}
                                className="px-4 py-2 text-sm font-bold text-white bg-[#385040] hover:bg-[#2c3e32] rounded-lg transition-colors flex items-center gap-2"
                            >
                                <MessageSquare className="w-4 h-4" />
                                {complaint.adminResponse ? 'Update Response' : 'Respond'}
                            </button>
                        </div>
                    </motion.div>
                ))}

                {complaints.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-gray-200 border-dashed">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-bold text-gray-900">No complaints found</h3>
                        <p className="text-gray-500">There are no complaints with this status.</p>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedComplaint && (
                    <ResponseModal
                        isOpen={!!selectedComplaint}
                        complaint={selectedComplaint}
                        onClose={() => setSelectedComplaint(null)}
                        onSubmit={handleRespond}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
