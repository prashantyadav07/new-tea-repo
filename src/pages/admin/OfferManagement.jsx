import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Upload, Calendar, Search } from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '../../services/adminAPI';
import { productAPI } from '../../services/productAPI';

export default function OfferManagement() {
    const [offers, setOffers] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingOffer, setEditingOffer] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const emptyForm = {
        title: '', description: '', validFrom: '', validTo: '',
        products: [], displayType: [], bannerImage: null, bannerPreview: '',
    };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => { fetchOffers(); fetchProducts(); }, []);

    const fetchOffers = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getAllOffers();
            if (res.success) {
                const data = res?.data || res;
                setOffers(Array.isArray(data) ? data : []);
            }
        } catch (err) { toast.error('Failed to load offers'); }
        finally { setLoading(false); }
    };

    const fetchProducts = async () => {
        try {
            const res = await productAPI.getAll();
            const data = res?.data || res;
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load products', err);
            setProducts([]);
        }
    };

    const openCreateModal = () => {
        setEditingOffer(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const openEditModal = (offer) => {
        setEditingOffer(offer);
        setForm({
            title: offer.title, description: offer.description || '',
            validFrom: offer.validFrom?.slice(0, 10) || '',
            validTo: offer.validTo?.slice(0, 10) || '',
            products: offer.products?.map(p => p._id || p) || [],
            displayType: offer.displayType || [],
            bannerImage: null,
            bannerPreview: offer.bannerImage?.url || '',
        });
        setShowModal(true);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setForm(f => ({ ...f, bannerImage: file, bannerPreview: URL.createObjectURL(file) }));
        }
    };

    const handleDisplayTypeToggle = (type) => {
        setForm(f => ({
            ...f,
            displayType: f.displayType.includes(type)
                ? f.displayType.filter(t => t !== type)
                : [...f.displayType, type]
        }));
    };

    const handleProductToggle = (id) => {
        setForm(f => ({
            ...f,
            products: f.products.includes(id)
                ? f.products.filter(p => p !== id)
                : [...f.products, id]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.title || !form.validFrom || !form.validTo) {
            return toast.error('Title, start date, and end date are required');
        }
        try {
            const formData = new FormData();
            formData.append('title', form.title);
            formData.append('description', form.description);
            formData.append('validFrom', form.validFrom);
            formData.append('validTo', form.validTo);
            formData.append('products', JSON.stringify(form.products));
            formData.append('displayType', JSON.stringify(form.displayType));
            if (form.bannerImage) formData.append('bannerImage', form.bannerImage);

            if (editingOffer) {
                await adminAPI.updateOffer(editingOffer._id, formData);
                toast.success('Offer updated');
            } else {
                await adminAPI.createOffer(formData);
                toast.success('Offer created');
            }
            setShowModal(false);
            fetchOffers();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save offer');
        }
    };

    const handleToggle = async (id) => {
        try {
            const res = await adminAPI.toggleOffer(id);
            toast.success(res.message);
            fetchOffers();
        } catch { toast.error('Failed to toggle offer'); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this offer?')) return;
        try {
            await adminAPI.deleteOffer(id);
            toast.success('Offer deleted');
            fetchOffers();
        } catch { toast.error('Failed to delete offer'); }
    };

    const displayTypes = ['banner', 'popup', 'toast', 'product-badge'];
    const filteredOffers = Array.isArray(offers)
        ? offers.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()))
        : [];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1a1a1a]">Offer Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Create and manage promotional offers</p>
                </div>
                <button onClick={openCreateModal}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#385040] text-white rounded-xl hover:bg-[#2c3e32] transition-colors font-medium">
                    <Plus className="w-4 h-4" /> Create Offer
                </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search offers..." value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#385040]/20" />
            </div>

            {/* Offers Table */}
            {loading ? (
                <div className="bg-white rounded-2xl p-8 border border-gray-100 animate-pulse">
                    <div className="space-y-4">{[...Array(3)].map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl" />
                    ))}</div>
                </div>
            ) : filteredOffers.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 border border-gray-100 text-center">
                    <Gift className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500">No offers found</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Offer</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Validity</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Display</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Status</th>
                                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredOffers.map(offer => (
                                    <tr key={offer._id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-[#e8efda] flex items-center justify-center">
                                                    <Gift className="w-5 h-5 text-[#385040]" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-[#1a1a1a]">{offer.title}</p>
                                                    <p className="text-gray-400 text-xs line-clamp-1">{offer.description}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden md:table-cell text-gray-500 text-xs">
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(offer.validFrom).toLocaleDateString()} → {new Date(offer.validTo).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 hidden lg:table-cell">
                                            <div className="flex flex-wrap gap-1">
                                                {offer.displayType?.map(d => (
                                                    <span key={d} className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded text-xs">{d}</span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button onClick={() => handleToggle(offer._id)} title={offer.isActive ? 'Disable' : 'Enable'}>
                                                {offer.isActive ? (
                                                    <ToggleRight className="w-6 h-6 text-green-500" />
                                                ) : (
                                                    <ToggleLeft className="w-6 h-6 text-gray-400" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-2">
                                                <button onClick={() => openEditModal(offer)}
                                                    className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-500"><Pencil className="w-4 h-4" /></button>
                                                <button onClick={() => handleDelete(offer._id)}
                                                    className="p-1.5 hover:bg-red-50 rounded-lg text-red-500"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Create/Edit Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}>
                        <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between p-6 border-b border-gray-100">
                                <h2 className="text-lg font-bold text-[#1a1a1a]">
                                    {editingOffer ? 'Edit Offer' : 'Create Offer'}
                                </h2>
                                <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <form onSubmit={handleSubmit} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                                    <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#385040]/20" required />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                        rows={3} className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#385040]/20" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Valid From *</label>
                                        <input type="date" value={form.validFrom}
                                            onChange={e => setForm(f => ({ ...f, validFrom: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#385040]/20" required />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Valid To *</label>
                                        <input type="date" value={form.validTo}
                                            onChange={e => setForm(f => ({ ...f, validTo: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#385040]/20" required />
                                    </div>
                                </div>
                                {/* Display Types */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Type</label>
                                    <div className="flex flex-wrap gap-2">
                                        {displayTypes.map(type => (
                                            <button key={type} type="button" onClick={() => handleDisplayTypeToggle(type)}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${form.displayType.includes(type)
                                                    ? 'bg-[#385040] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* Products */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Link to Products ({form.products.length} selected)
                                    </label>
                                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-2 space-y-1">
                                        {products.map(p => (
                                            <label key={p._id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer">
                                                <input type="checkbox" checked={form.products.includes(p._id)}
                                                    onChange={() => handleProductToggle(p._id)}
                                                    className="rounded border-gray-300" />
                                                <span className="text-sm text-gray-700">{p.name}</span>
                                            </label>
                                        ))}
                                        {products.length === 0 && <p className="text-gray-400 text-xs p-2">No products found</p>}
                                    </div>
                                </div>
                                <div className="flex gap-3 pt-2">
                                    <button type="button" onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
                                    <button type="submit"
                                        className="flex-1 px-4 py-2.5 bg-[#385040] text-white rounded-xl text-sm font-medium hover:bg-[#2c3e32] transition-colors">
                                        {editingOffer ? 'Update' : 'Create'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
