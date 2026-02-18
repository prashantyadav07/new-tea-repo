import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Camera, Save, X, Loader2, Leaf, ShieldCheck, Clock } from 'lucide-react';

export default function Profile() {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        photo: null
    });

    const fileInputRef = useRef(null);

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
                <motion.div variants={itemVariants} className="mb-12 text-center">
                    <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#1a1a1a] mb-4">
                        My Profile
                    </h1>
                    <p className="text-gray-500 text-lg">
                        Manage your account settings and preferences
                    </p>
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

                                <div className="w-full pt-6 border-t border-gray-100 flex flex-col gap-2">
                                    <div className="flex items-center gap-3 text-sm text-gray-600 py-2">
                                        <Clock className="w-4 h-4 text-[#385040]" />
                                        <span>Joined February 2026</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 py-2">
                                        <ShieldCheck className="w-4 h-4 text-[#385040]" />
                                        <span>Verified Account</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <motion.div variants={itemVariants} className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-gray-100 border border-gray-100">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="font-display font-bold text-2xl text-[#1a1a1a]">
                                    Running Profile
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
                        </div>

                        {/* Additional Info Cards (Future Proofing) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <motion.div variants={itemVariants} className="bg-[#D4F57B]/20 rounded-2xl p-6 border border-[#D4F57B]/30 flex items-start gap-4">
                                <div className="p-3 bg-white rounded-xl text-[#385040]">
                                    <Leaf className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1a1a1a] mb-1">Tea Club Member</h4>
                                    <p className="text-sm text-gray-600">Enjoy exclusive access to new harvests and blends.</p>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 border border-gray-100 flex items-start gap-4 hover:border-[#385040]/30 transition-colors cursor-pointer group">
                                <div className="p-3 bg-[#FAF9F6] rounded-xl text-gray-400 group-hover:text-[#385040] transition-colors">
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#1a1a1a] mb-1">Security</h4>
                                    <p className="text-sm text-gray-600">Password and authentication settings.</p>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
