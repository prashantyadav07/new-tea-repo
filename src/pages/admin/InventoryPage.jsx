import { useEffect, useState } from 'react';
import { Package, AlertTriangle, Search, Settings, Save } from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '../../services/adminAPI';

export default function InventoryPage() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLowOnly, setShowLowOnly] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [threshold, setThreshold] = useState('');
    const [thresholdLoading, setThresholdLoading] = useState(false);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [summaryRes, settingsRes] = await Promise.all([
                adminAPI.getStockSummary(),
                adminAPI.getSettings(),
            ]);
            if (summaryRes.success) setSummary(summaryRes.data);
            if (settingsRes.success) setThreshold(String(settingsRes.data.lowStockThreshold));
        } catch (err) {
            toast.error('Failed to load inventory data');
        } finally { setLoading(false); }
    };

    const handleSaveThreshold = async () => {
        const val = parseInt(threshold);
        if (!val || val < 1) return toast.error('Threshold must be at least 1');
        try {
            setThresholdLoading(true);
            await adminAPI.updateSettings({ lowStockThreshold: val });
            toast.success(`Threshold updated to ${val}`);
            fetchData(); // Re-fetch with new threshold
        } catch { toast.error('Failed to update threshold'); }
        finally { setThresholdLoading(false); }
    };

    const filteredProducts = summary?.products?.filter(p => {
        const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!matchSearch) return false;
        if (showLowOnly) return p.variants.some(v => v.stock < summary.threshold);
        return true;
    }) || [];

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                            <div className="h-8 bg-gray-200 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1a1a1a]">Inventory Management</h1>
                    <p className="text-gray-500 text-sm mt-1">Monitor stock levels and configure alerts</p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-blue-100"><Package className="w-5 h-5 text-blue-600" /></div>
                        <span className="text-sm text-gray-500 font-medium">Total Products</span>
                    </div>
                    <p className="text-3xl font-bold text-[#1a1a1a]">{summary?.totalProducts || 0}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-amber-100"><AlertTriangle className="w-5 h-5 text-amber-600" /></div>
                        <span className="text-sm text-gray-500 font-medium">Low Stock Items</span>
                    </div>
                    <p className="text-3xl font-bold text-amber-600">{summary?.lowStockCount || 0}</p>
                    <p className="text-xs text-gray-400 mt-1">Below threshold: {summary?.threshold}</p>
                </div>
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2.5 rounded-xl bg-gray-100"><Settings className="w-5 h-5 text-gray-600" /></div>
                        <span className="text-sm text-gray-500 font-medium">Stock Threshold</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" min="1" value={threshold}
                            onChange={e => setThreshold(e.target.value)}
                            className="w-20 px-2 py-1.5 border border-gray-200 rounded-lg text-lg font-bold text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#385040]/20" />
                        <button onClick={handleSaveThreshold} disabled={thresholdLoading}
                            className="p-2 bg-[#385040] text-white rounded-lg hover:bg-[#2c3e32] transition-colors disabled:opacity-50">
                            <Save className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder="Search products..." value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#385040]/20" />
                </div>
                <button onClick={() => setShowLowOnly(!showLowOnly)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${showLowOnly ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                    {showLowOnly ? '⚠ Low Stock Only' : 'Show All'}
                </button>
            </div>

            {/* Product Stock Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Product</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                                <th className="text-left px-4 py-3 font-semibold text-gray-600">Variants & Stock</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredProducts.map(product => {
                                const hasLow = product.variants.some(v => v.stock < summary.threshold);
                                return (
                                    <tr key={product._id} className={hasLow ? 'bg-red-50/50' : 'hover:bg-gray-50/50'}>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                {product.images?.[0]?.url ? (
                                                    <img src={product.images[0].url} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                                        <Package className="w-4 h-4 text-gray-400" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-[#1a1a1a]">{product.name}</p>
                                                    {hasLow && (
                                                        <span className="text-xs text-red-600 font-medium flex items-center gap-1 mt-0.5">
                                                            <AlertTriangle className="w-3 h-3" /> Low stock
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{product.category?.name || '—'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-2">
                                                {product.variants.map((v, i) => (
                                                    <span key={i} className={`px-2.5 py-1 rounded-lg text-xs font-medium ${v.stock < summary.threshold
                                                        ? 'bg-red-100 text-red-700 ring-1 ring-red-200'
                                                        : 'bg-green-50 text-green-700'}`}>
                                                        {v.size}: {v.stock}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                {filteredProducts.length === 0 && (
                    <div className="p-12 text-center text-gray-400">
                        <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
                        <p>{showLowOnly ? 'No low stock items' : 'No products found'}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
