import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/adminAPI';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Trash2, Edit2, ShieldAlert, Check, X, Loader2, UserCog } from 'lucide-react';
import { toast } from 'sonner';

const AdminModal = ({ isOpen, onClose, onSubmit, initialData }) => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'admin' });
    const isEdit = !!initialData;

    useEffect(() => {
        if (initialData) setFormData({ ...initialData, password: '' });
        else setFormData({ name: '', email: '', password: '', role: 'admin' });
    }, [initialData, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold font-display">{isEdit ? 'Edit Admin' : 'New Admin'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385040]/20 focus:border-[#385040]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385040]/20 focus:border-[#385040]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {isEdit ? 'New Password (leave blank to keep current)' : 'Password'}
                        </label>
                        <input
                            required={!isEdit}
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#385040]/20 focus:border-[#385040]"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-gray-500 hover:bg-gray-50 rounded-lg font-medium">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#385040] text-white rounded-lg font-medium hover:bg-[#2c3e32]">
                            {isEdit ? 'Save Changes' : 'Create Admin'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default function AdminAdmins() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState(null);

    const fetchAdmins = async () => {
        try {
            const data = await adminAPI.getAllAdmins();
            setAdmins(data.data || []);
        } catch (error) {
            toast.error('Failed to fetch admins');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmins();
    }, []);

    const handleCreate = async (data) => {
        try {
            await adminAPI.createAdmin(data);
            toast.success('Admin created successfully');
            setIsModalOpen(false);
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create admin');
        }
    };

    const handleUpdate = async (data) => {
        try {
            await adminAPI.updateAdmin(editingAdmin._id, data);
            toast.success('Admin updated successfully');
            setIsModalOpen(false);
            setEditingAdmin(null);
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update admin');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this admin?')) return;
        try {
            await adminAPI.deleteAdmin(id);
            toast.success('Admin deleted successfully');
            fetchAdmins();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete admin');
        }
    };

    const filteredAdmins = admins.filter(admin =>
        admin.name.toLowerCase().includes(search.toLowerCase()) ||
        admin.email.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#385040]" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display text-2xl font-bold text-[#1a1a1a]">Admin Management</h1>
                    <p className="text-gray-500">Manage system administrators and their access.</p>
                </div>
                <button
                    onClick={() => { setEditingAdmin(null); setIsModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 bg-[#385040] text-white rounded-lg hover:bg-[#2c3e32] transition-colors"
                >
                    <Plus className="w-4 h-4" /> Add New Admin
                </button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search admins..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-[#385040]"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-bold">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Joined</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAdmins.map((admin) => (
                                <tr key={admin._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#385040]/10 flex items-center justify-center text-[#385040] font-bold">
                                                {admin.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1a1a1a]">{admin.name}</p>
                                                <p className="text-sm text-gray-500">{admin.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200">
                                            <ShieldAlert className="w-3 h-3" /> {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(admin.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => { setEditingAdmin(admin); setIsModalOpen(true); }}
                                            className="p-2 text-gray-400 hover:text-[#385040] hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(admin._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredAdmins.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-400">
                                        <UserCog className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                        <p>No admins found</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <AdminModal
                        isOpen={isModalOpen}
                        initialData={editingAdmin}
                        onClose={() => setIsModalOpen(false)}
                        onSubmit={editingAdmin ? handleUpdate : handleCreate}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
