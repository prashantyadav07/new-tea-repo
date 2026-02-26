import { useState, useEffect, useRef } from 'react';
import { categoryAPI } from '../../services/categoryAPI';
import { toast } from 'sonner';
import { Plus, X, Image as ImageIcon, Loader2, Trash2, Edit2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import imageCompression from 'browser-image-compression';

const COMPRESSION_OPTIONS = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/webp',
};

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isCompressing, setIsCompressing] = useState(false);

    // Form State
    const [formData, setFormData] = useState({ name: '', description: '', image: null });
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);

    const fetchCategories = async () => {
        try {
            const res = await categoryAPI.getAll();
            setCategories(res.data);
        } catch (error) {
            console.error(error);
            toast.error("Failed to load categories");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview immediately from original
        setPreview(URL.createObjectURL(file));

        // Compress in the background
        setIsCompressing(true);
        try {
            const originalSize = file.size;
            const compressed = await imageCompression(file, COMPRESSION_OPTIONS);
            setFormData({ ...formData, image: compressed });
            toast.success(`Image compressed (${originalSize > 1024 * 1024
                ? (originalSize / (1024 * 1024)).toFixed(1) + 'MB'
                : (originalSize / 1024).toFixed(0) + 'KB'
                } → ${compressed.size > 1024 * 1024
                    ? (compressed.size / (1024 * 1024)).toFixed(1) + 'MB'
                    : (compressed.size / 1024).toFixed(0) + 'KB'
                })`);
        } catch (err) {
            console.error('Compression failed, using original:', err);
            setFormData({ ...formData, image: file });
        } finally {
            setIsCompressing(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setUploadProgress(0);

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        if (formData.image) data.append('image', formData.image);

        try {
            const config = {
                onUploadProgress: (progressEvent) => {
                    const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(percent);
                }
            };

            await categoryAPI.create(data, config);
            toast.success("Category created successfully!");
            setIsCreating(false);
            setFormData({ name: '', description: '', image: null });
            setPreview(null);
            fetchCategories();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to create category");
        } finally {
            setIsSubmitting(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure? This cannot be undone.")) return;
        try {
            await categoryAPI.delete(id);
            toast.success("Category deleted");
            setCategories(categories.filter(c => c._id !== id));
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="font-display font-bold text-2xl text-[#1a1a1a]">Categories</h1>
                    <p className="text-gray-500 text-sm">Manage your product categories</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#385040] text-white rounded-xl font-bold text-sm hover:bg-[#2E4235] transition-colors shadow-lg shadow-[#385040]/20"
                >
                    <Plus className="w-4 h-4" /> Add New
                </button>
            </div>

            {/* Create Category Modal */}
            <AnimatePresence>
                {isCreating && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg">Create Category</h3>
                                <button onClick={() => setIsCreating(false)}><X className="w-5 h-5 text-gray-400" /></button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div onClick={() => fileInputRef.current?.click()} className="cursor-pointer border-2 border-dashed border-gray-200 rounded-xl h-48 flex items-center justify-center relative overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors">
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <ImageIcon className="w-8 h-8" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Upload Image</span>
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
                                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} required />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-[#385040]"
                                        placeholder="e.g. Green Tea"
                                        required
                                    />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium focus:outline-none focus:border-[#385040]"
                                        placeholder="Category description..."
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
                                    {isCompressing ? 'Compressing Image...' : 'Create Category'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Categories List */}
            {isLoading ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 text-[#385040] animate-spin" /></div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {categories.map((category) => (
                        <div key={category._id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
                            <div className="h-40 bg-gray-100 relative">
                                <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <button onClick={() => handleDelete(category._id)} className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="p-4">
                                <h3 className="font-bold text-[#1a1a1a]">{category.name}</h3>
                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">{category.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
