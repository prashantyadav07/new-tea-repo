import { useEffect, useState } from 'react';
import { ScrollText, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '../../services/adminAPI';

export default function AdminLogsPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filterAction, setFilterAction] = useState('');
    const [filterTarget, setFilterTarget] = useState('');

    useEffect(() => { fetchLogs(); }, [page, filterAction, filterTarget]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const params = { page, limit: 30 };
            if (filterAction) params.action = filterAction;
            if (filterTarget) params.targetType = filterTarget;

            const res = await adminAPI.getAdminLogs(params);
            if (res.success) {
                setLogs(res.data);
                setTotalPages(res.totalPages || 1);
            }
        } catch (err) {
            toast.error('Failed to load activity logs');
        } finally { setLoading(false); }
    };

    const formatDate = (d) => new Date(d).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    const actionColors = {
        created: 'bg-green-50 text-green-700',
        updated: 'bg-blue-50 text-blue-700',
        deleted: 'bg-red-50 text-red-700',
        toggled: 'bg-amber-50 text-amber-700',
    };

    const getActionColor = (action) => {
        const key = Object.keys(actionColors).find(k => action.includes(k));
        return actionColors[key] || 'bg-gray-50 text-gray-700';
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1a1a1a]">Activity Logs</h1>
                <p className="text-gray-500 text-sm mt-1">Track admin actions across the system</p>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
                <select value={filterTarget} onChange={e => { setFilterTarget(e.target.value); setPage(1); }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#385040]/20">
                    <option value="">All Targets</option>
                    <option value="offer">Offers</option>
                    <option value="order">Orders</option>
                    <option value="product">Products</option>
                    <option value="settings">Settings</option>
                    <option value="notification">Notifications</option>
                </select>
                <input type="text" placeholder="Filter by action..." value={filterAction}
                    onChange={e => { setFilterAction(e.target.value); setPage(1); }}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#385040]/20" />
            </div>

            {/* Logs Table */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-3">
                        {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />)}
                    </div>
                ) : logs.length === 0 ? (
                    <div className="p-12 text-center">
                        <ScrollText className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-400">No activity logs found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Time</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Admin</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Action</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Target</th>
                                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden lg:table-cell">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {logs.map(log => (
                                    <tr key={log._id} className="hover:bg-gray-50/50">
                                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(log.createdAt)}</td>
                                        <td className="px-4 py-3 font-medium text-[#1a1a1a]">{log.admin?.name || 'System'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">
                                            <span className="text-xs">{log.targetType}</span>
                                            {log.targetId && <span className="text-gray-400 ml-1">#{log.targetId.slice(-6)}</span>}
                                        </td>
                                        <td className="px-4 py-3 text-gray-400 text-xs hidden lg:table-cell">
                                            {log.details?.method} {log.details?.path}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-3">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                    <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                </div>
            )}
        </div>
    );
}
