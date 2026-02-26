import { useState, useEffect, useRef } from 'react';
import { productAPI } from '../../services/productAPI';
import { categoryAPI } from '../../services/categoryAPI';
import { toast } from 'sonner';
import { Plus, X, Image as ImageIcon, Loader2, Trash2, Search, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';

const COMPRESSION_OPTIONS = {
    maxSizeMB: 0.5,           // Max 500KB per image
    maxWidthOrHeight: 1200,   // Max 1200px
    useWebWorker: true,       // Non-blocking compression
    fileType: 'image/webp',   // Modern format, smaller files
};

async function compressImages(files) {
    return Promise.all(
        files.map(file => imageCompression(file, COMPRESSION_OPTIONS))
    );
}

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isCompressing, setIsCompressing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', stock: '', category: '', images: [], allowMultipleImages: false
    });
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const fetchData = async () => {
        try {
            const [prodRes, catRes] = await Promise.all([
                productAPI.getAll(),
                categoryAPI.getAll()
            ]);
            setProducts(prodRes.data);
            setCategories(catRes.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load data");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleEdit = (product) => {
        setIsCreating(true);
        setIsEditing(true);
        setEditId(product._id);
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.variants?.[0]?.price || '',
            stock: product.variants?.[0]?.stock || '',
            category: product.category?._id || product.category || '',
            images: [],
            allowMultipleImages: product.allowMultipleImages || false
        });
        setPreviews(product.images?.map(img => img.url) || [product.image].filter(Boolean));
    };

    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        if (!files.length) return;

        if (formData.allowMultipleImages) {
            if (files.length > 5) {
                toast.error("Maximum 5 images allowed");
                return;
            }
        } else {
            if (files.length > 1) {
                toast.error("Only 1 image allowed when multiple images are disabled");
                return;
            }
        }

        // Show previews immediately from originals
        setPreviews(files.map(file => URL.createObjectURL(file)));

        // Compress images in the background
        setIsCompressing(true);
        try {
            const compressed = await compressImages(files);
            setFormData({ ...formData, images: compressed });
            toast.success(`Images compressed (${files.reduce((s, f) => s + f.size, 0) > 1024 * 1024
                ? (files.reduce((s, f) => s + f.size, 0) / (1024 * 1024)).toFixed(1) + 'MB'
                : (files.reduce((s, f) => s + f.size, 0) / 1024).toFixed(0) + 'KB'
                } → ${compressed.reduce((s, f) => s + f.size, 0) > 1024 * 1024
                    ? (compressed.reduce((s, f) => s + f.size, 0) / (1024 * 1024)).toFixed(1) + 'MB'
                    : (compressed.reduce((s, f) => s + f.size, 0) / 1024).toFixed(0) + 'KB'
                })`);
        } catch (err) {
            console.error('Compression failed, using originals:', err);
            setFormData({ ...formData, images: files });
        } finally {
            setIsCompressing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadProgress(0);

        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'images' && formData[key]?.length > 0) {
                formData[key].forEach(file => data.append('images', file));
            } else if (key !== 'price' && key !== 'stock' && key !== 'images' && formData[key] !== undefined && formData[key] !== null && formData[key] !== '') {
                data.append(key, formData[key]);
            }
        });

        // Construct variants array
        const variants = [{
            size: 'Standard',
            price: Number(formData.price),
            stock: Number(formData.stock)
        }];
        data.append('variants', JSON.stringify(variants));

        try {
            const config = {
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                }
            };

            if (isEditing) {
                await productAPI.update(editId, data, config);
                toast.success("Product updated successfully!");
            } else {
                if (formData.images.length === 0) {
                    toast.error("Please upload at least one image");
                    setIsSubmitting(false);
                    return;
                }
                await productAPI.create(data, config);
                toast.success("Product created successfully!");
            }
            closeModal();
            fetchData();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} product`);
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const closeModal = () => {
        setIsCreating(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ name: '', description: '', price: '', stock: '', category: '', images: [], allowMultipleImages: false });
        setPreviews([]);
        setUploadProgress(0);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;
        try {
            await productAPI.delete(id);
            toast.success("Product deleted");
            setProducts(products.filter(p => p._id !== id));
        } catch (error) {
            toast.error("Failed to delete product");
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display font-bold text-2xl text-[#1a1a1a]">Products</h1>
                    <p className="text-gray-500 text-sm">Manage your store inventory</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#385040]"
                        />
                    </div>
                    <button
                        onClick={() => {
                            setIsCreating(true);
                            setIsEditing(false);
                            setEditId(null);
                            setFormData({ name: '', description: '', price: '', stock: '', category: '', images: [], allowMultipleImages: false });
                            setPreviews([]);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-[#385040] text-white rounded-xl font-bold text-sm hover:bg-[#2E4235] transition-colors shadow-lg shadow-[#385040]/20"
                    >
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>
            </div>

            {/* Create Product Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">{isEditing ? 'Edit Product' : 'Add New Product'}</h3>
                                <button type="button" onClick={closeModal}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column: Image */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-200">
                                        <input
                                            type="checkbox"
                                            id="allowMultiple"
                                            checked={formData.allowMultipleImages}
                                            onChange={(e) => {
                                                setFormData({ ...formData, allowMultipleImages: e.target.checked, images: [] });
                                                setPreviews([]);
                                            }}
                                            className="w-4 h-4 text-[#385040] rounded border-gray-300 focus:ring-[#385040]"
                                        />
                                        <label htmlFor="allowMultiple" className="flex flex-col cursor-pointer">
                                            <span className="text-sm font-bold text-gray-700">Allow Multiple Images</span>
                                            <span className="text-xs text-gray-500">Upload up to 5 images for gallery</span>
                                        </label>
                                    </div>
                                    <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl aspect-square flex items-center justify-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                                        {previews.length > 0 ? (
                                            <div className={`w-full h-full grid gap-1 ${previews.length === 1 ? 'grid-cols-1' : previews.length === 2 ? 'grid-cols-2' : previews.length <= 4 ? 'grid-cols-2 grid-rows-2' : 'grid-cols-3 grid-rows-2'}`}>
                                                {previews.map((src, i) => (
                                                    <img key={i} src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center gap-2 text-gray-400 text-center">
                                                <ImageIcon className="w-8 h-8 mx-auto" />
                                                <span className="text-xs font-bold uppercase tracking-wider">Upload Image{formData.allowMultipleImages ? 's' : ''}</span>
                                            </div>
                                        )}
                                        {isCompressing && (
                                            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Loader2 className="w-6 h-6 animate-spin text-[#385040]" />
                                                    <span className="text-xs font-bold text-[#385040]">Compressing...</span>
                                                </div>
                                            </div>
                                        )}
                                        <input type="file" ref={fileInputRef} hidden accept="image/*" multiple={formData.allowMultipleImages} onChange={handleImageChange} />
                                    </div>
                                </div>

                                {/* Right Column: Details */}
                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#385040]"
                                            required
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#385040]"
                                                required
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
                                            <input
                                                type="number"
                                                value={formData.stock}
                                                onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#385040]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                                        <select
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#385040]"
                                            required
                                        >
                                            <option value="">Select Category</option>
                                            {categories.map(c => (
                                                <option key={c._id} value={c._id}>{c.name}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-[#385040]"
                                            rows="3"
                                        />
                                    </div>

                                    {/* Upload Progress Bar */}
                                    {isSubmitting && uploadProgress > 0 && (
                                        <div className="space-y-1">
                                            <div className="flex justify-between text-xs text-gray-500">
                                                <span>Uploading...</span>
                                                <span>{uploadProgress}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                <div
                                                    className="bg-[#385040] h-2 rounded-full transition-all duration-300 ease-out"
                                                    style={{ width: `${uploadProgress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={isSubmitting || isCompressing}
                                        className="w-full py-3 bg-[#385040] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#2E4235] transition-colors disabled:opacity-70"
                                    >
                                        {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {isCompressing ? 'Compressing Images...' : isEditing ? 'Update Product' : 'Create Product'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Products List */}
            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#385040] animate-spin" /></div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-xs text-gray-500 uppercase border-b border-gray-100">
                                <th className="px-6 py-4 font-bold">Product</th>
                                <th className="px-6 py-4 font-bold">Category</th>
                                <th className="px-6 py-4 font-bold">Price</th>
                                <th className="px-6 py-4 font-bold">Stock</th>
                                <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map((product) => (
                                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={product.image || (product.images?.length > 0 ? product.images[0].url : '')} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                                            <div>
                                                <p className="font-bold text-sm text-[#1a1a1a]">{product.name}</p>
                                                <p className="text-xs text-gray-400 line-clamp-1">{product.description}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {product.category?.name || 'Uncategorized'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-[#385040]">
                                        ₹{product.variants?.[0]?.price || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${(product.variants?.[0]?.stock || 0) > 10 ? 'bg-green-100 text-green-700' :
                                            (product.variants?.[0]?.stock || 0) > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {product.variants?.[0]?.stock || 0} in stock
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEdit(product)}
                                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                                            title="Edit Product"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(product._id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                            title="Delete Product"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredProducts.length === 0 && (
                        <div className="p-12 text-center text-gray-400">
                            <Search className="w-12 h-12 mx-auto mb-2 opacity-20" />
                            <p>No products found</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
