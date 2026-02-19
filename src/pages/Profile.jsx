import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Camera, Save, X, Loader2, Leaf, ShieldCheck, Clock, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react';
import { adminAPI } from '../services/adminAPI';
import { toast } from 'sonner';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'complaints'
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [loadingComplaints, setLoadingComplaints] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        photo: null
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (activeTab === 'complaints') {
            fetchComplaints();
        }
    }, [activeTab]);

    const fetchComplaints = async () => {
        setLoadingComplaints(true);
        try {
            const response = await adminAPI.getUserComplaints();
            setComplaints(response.data);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load complaints');
        } finally {
            setLoadingComplaints(false);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, photo: file });
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        if (formData.photo) {
            data.append('photo', formData.photo);
        }

        const result = await updateProfile(data);
        setIsLoading(false);

        if (result.success) {
            setIsEditing(false);
            setPreviewImage(null);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 bg-[#FAF9F6]">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="max-w-4xl mx-auto"
            >
                {/* Header */}
                <motion.div variants={itemVariants} className="mb-8 text-center">
                    <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#1a1a1a] mb-4">
                        My Account
                    </h1>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Card */}
                    <motion.div variants={itemVariants} className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-xl shadow-gray-100 border border-gray-100 sticky top-28">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative group cursor-pointer mb-6" onClick={() => isEditing && fileInputRef.current?.click()}>
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#FAF9F6] shadow-inner relative">
                                        <img
                                            src={previewImage || user?.photo}
                                            alt={user?.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = `https://ui-avatars.com/api/?name=${user?.name}&background=385040&color=fff`
                                            }}
                                        />
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <h2 className="font-display font-bold text-xl text-[#1a1a1a]">
                                    {user?.name || 'Tea Lover'}
                                </h2>
                                <p className="text-sm text-gray-500 font-medium mt-1 mb-6">
                                    {user?.role === 'admin' ? 'Administrator' : 'Tea Enthusiast'}
                                </p>

                                {/* Navigation Tabs */}
                                <div className="w-full flex flex-col gap-2">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'profile'
                                                ? 'bg-[#385040] text-white shadow-lg shadow-[#385040]/20'
                                                : 'hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <User className="w-5 h-5" />
                                        <span className="font-bold text-sm">Profile Details</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('complaints')}
                                        className={`w-full py-3 px-4 rounded-xl flex items-center gap-3 transition-colors ${activeTab === 'complaints'
                                                ? 'bg-[#385040] text-white shadow-lg shadow-[#385040]/20'
                                                : 'hover:bg-gray-50 text-gray-600'
                                            }`}
                                    >
                                        <MessageSquare className="w-5 h-5" />
                                        <span className="font-bold text-sm">My Complaints</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-100 border border-gray-100 min-h-[400px]">
                            {activeTab === 'profile' ? (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-display font-bold text-2xl text-[#1a1a1a]">
                                            Profile Details
                                        </h3>
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-6 py-2.5 bg-[#FAF9F6] text-[#385040] rounded-full font-bold text-xs uppercase tracking-widest hover:bg-[#F0EEE6] transition-colors border border-transparent hover:border-[#385040]/10"
                                            >
                                                Edit Details
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setPreviewImage(null);
                                                    setFormData({
                                                        name: user?.name,
                                                        email: user?.email,
                                                        photo: null
                                                    });
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <X className="w-6 h-6" />
                                            </button>
                                        )}
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#385040] uppercase tracking-wider ml-1">
                                                Full Name
                                            </label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#385040] transition-colors" />
                                                <input
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-medium text-[#1a1a1a] focus:outline-none focus:border-[#385040] focus:ring-1 focus:ring-[#385040] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-[#385040] uppercase tracking-wider ml-1">
                                                Email Address
                                            </label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#385040] transition-colors" />
                                                <input
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    disabled={!isEditing}
                                                    className="w-full bg-[#FAF9F6] border border-gray-200 rounded-xl py-4 pl-12 pr-4 font-medium text-[#1a1a1a] focus:outline-none focus:border-[#385040] focus:ring-1 focus:ring-[#385040] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
                                                />
                                            </div>
                                        </div>

                                        <AnimatePresence>
                                            {isEditing && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="pt-4"
                                                >
                                                    <button
                                                        type="submit"
                                                        disabled={isLoading}
                                                        className="w-full py-4 bg-[#385040] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-[#2E4235] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#385040]/20 flex items-center justify-center gap-2"
                                                    >
                                                        {isLoading ? (
                                                            <Loader2 className="w-5 h-5 animate-spin" />
                                                        ) : (
                                                            <>
                                                                <Save className="w-5 h-5" />
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </form>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="font-display font-bold text-2xl text-[#1a1a1a]">
                                            My Complaints
                                        </h3>
                                        <div className="text-sm text-gray-500">
                                            {complaints.length} Total
                                        </div>
                                    </div>

                                    {loadingComplaints ? (
                                        <div className="flex justify-center py-12">
                                            <Loader2 className="w-8 h-8 animate-spin text-[#385040]" />
                                        </div>
                                    ) : complaints.length === 0 ? (
                                        <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                <MessageSquare className="w-8 h-8 text-gray-300" />
                                            </div>
                                            <h4 className="font-bold text-gray-900 mb-1">No complaints found</h4>
                                            <p className="text-gray-500 text-sm mb-6">You haven't submitted any complaints yet.</p>
                                            <a href="/complaint" className="px-6 py-2 bg-[#385040] text-white rounded-lg text-sm font-bold hover:bg-[#2c3e32] transition-colors">
                                                Submit a Complaint
                                            </a>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {complaints.map((complaint) => (
                                                <motion.div
                                                    key={complaint._id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex justify-between items-start mb-3">
                                                        <div className="flex items-center gap-3">
                                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${complaint.status === 'open' ? 'bg-red-50 text-red-600 border-red-100' :
                                                                    complaint.status === 'resolved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                                        'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                                }`}>
                                                                {complaint.status}
                                                            </span>
                                                            <span className="text-xs text-gray-400">
                                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <h4 className="font-bold text-lg text-[#1a1a1a] mb-2">{complaint.subject}</h4>
                                                    <p className="text-gray-600 text-sm leading-relaxed mb-4 bg-gray-50 p-3 rounded-lg">
                                                        {complaint.message}
                                                    </p>

                                                    {complaint.adminResponse && (
                                                        <div className="border-t border-gray-100 pt-4 mt-4">
                                                            <p className="text-xs font-bold text-[#385040] uppercase tracking-wider mb-2 flex items-center gap-2">
                                                                <MessageSquare className="w-4 h-4" /> Admin Response
                                                            </p>
                                                            <div className="text-gray-800 text-sm leading-relaxed">
                                                                {complaint.adminResponse}
                                                            </div>
                                                            {complaint.resolvedAt && (
                                                                <p className="text-xs text-gray-400 mt-2">
                                                                    Resolved on {new Date(complaint.resolvedAt).toLocaleDateString()}
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
