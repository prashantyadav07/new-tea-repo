import { useEffect, useState, useCallback } from 'react';
import { ShoppingBag, MessageSquare, AlertTriangle, Info, UserPlus, CheckCheck, Trash2, Bell, Filter, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'sonner';

const TYPE_CONFIG = {
    new_order: { icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50', label: 'Orders' },
    complaint: { icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50', label: 'Complaints' },
    low_stock: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: 'Low Stock' },
    payment: { icon: Check, color: 'text-green-500', bg: 'bg-green-50', label: 'Payment' },
    system: { icon: Info, color: 'text-gray-500', bg: 'bg-gray-50', label: 'System' },
    new_user: { icon: UserPlus, color: 'text-green-500', bg: 'bg-green-50', label: 'New Users' },
};

export default function AdminNotifications() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, unread, new_order, low_stock, etc.
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 15,
        total: 0,
        pages: 0
    });

    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            const params = {
                page: pagination.page,
                limit: pagination.limit
            };
            
            if (filter === 'unread') {
                params.isRead = false;
            } else if (filter !== 'all') {
                params.type = filter;
            }

            const res = await adminAPI.getNotifications(params);
            if (res.success) {
                const data = res?.data || res;
                setNotifications(Array.isArray(data) ? data : []);
                if (res.pagination) {
                    setPagination(prev => ({
                        ...prev,
                        total: res.pagination.total,
                        pages: res.pagination.pages
                    }));
                }
            }
        } catch (err) {
            toast.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    }, [pagination.page, pagination.limit, filter]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    const handleMarkAsRead = async (id) => {
        try {
            const res = await adminAPI.markNotificationRead(id);
            if (res.success) {
                setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
            }
        } catch (err) {
            toast.error('Action failed');
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const res = await adminAPI.markAllNotificationsRead();
            if (res.success) {
                setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                toast.success('All notifications marked as read');
            }
        } catch (err) {
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (id) => {
        try {
            const res = await adminAPI.deleteNotification(id);
            if (res.success) {
                setNotifications(prev => prev.filter(n => n._id !== id));
                toast.success('Notification deleted');
            }
        } catch (err) {
            toast.error('Delete failed');
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="font-display font-bold text-3xl text-[#1a1a1a]">Notifications</h1>
                    <p className="text-gray-500 mt-1">Stay updated with the latest activity in your store.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleMarkAllRead}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-[#385040] rounded-xl font-bold text-sm hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <CheckCheck className="w-4 h-4" />
                        Mark all as read
                    </button>
                    <button
                        onClick={fetchNotifications}
                        className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                    >
                        <motion.div whileTap={{ rotate: 180 }}>
                            <Bell className="w-5 h-5" />
                        </motion.div>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-gray-100 shadow-sm">
                    <button
                        onClick={() => { setFilter('all'); setPagination(p => ({ ...p, page: 1 })); }}
                        className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${filter === 'all' ? 'bg-[#385040] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => { setFilter('unread'); setPagination(p => ({ ...p, page: 1 })); }}
                        className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all ${filter === 'unread' ? 'bg-[#385040] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
                    >
                        Unread
                    </button>
                </div>
                <div className="h-4 w-px bg-gray-200 mx-2" />
                {Object.entries(TYPE_CONFIG).map(([type, config]) => (
                    <button
                        key={type}
                        onClick={() => { setFilter(type); setPagination(p => ({ ...p, page: 1 })); }}
                        className={`flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-100 rounded-xl text-sm font-bold whitespace-nowrap transition-all shadow-sm hover:border-[#385040]/30 ${filter === type ? 'ring-2 ring-[#385040] border-transparent text-[#385040]' : 'text-gray-500'}`}
                    >
                        <config.icon className={`w-4 h-4 ${config.color}`} />
                        {config.label}
                    </button>
                ))}
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
                {loading ? (
                    <div className="flex-1 flex items-center justify-center py-20">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-12 border-4 border-[#385040]/10 border-t-[#385040] rounded-full animate-spin" />
                            <p className="text-gray-400 font-medium">Loading notifications...</p>
                        </div>
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
                        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Bell className="w-10 h-10 text-gray-200" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Clean Slate!</h3>
                        <p className="text-gray-500 max-w-xs mx-auto">No notifications found for this category. You're all caught up!</p>
                    </div>
                ) : (
                    <>
                        <div className="divide-y divide-gray-50">
                            {notifications.map((notif) => {
                                const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
                                const Icon = config.icon;
                                return (
                                    <motion.div
                                        key={notif._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className={`group p-6 flex gap-6 transition-all hover:bg-gray-50/50 ${!notif.isRead ? 'bg-blue-50/20' : ''}`}
                                    >
                                        <div className={`w-14 h-14 rounded-2xl ${config.bg} flex items-center justify-center shrink-0 border border-white shadow-sm ring-1 ring-black/5`}>
                                            <Icon className={`w-7 h-7 ${config.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className={`text-lg transition-colors ${!notif.isRead ? 'font-bold text-[#1a1a1a]' : 'font-semibold text-gray-700'}`}>
                                                            {notif.title}
                                                        </h3>
                                                        {!notif.isRead && (
                                                            <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                                        )}
                                                    </div>
                                                    <p className={`text-sm leading-relaxed ${!notif.isRead ? 'text-gray-800' : 'text-gray-500'}`}>
                                                        {notif.message}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {!notif.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notif._id)}
                                                            className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-green-500 hover:border-green-100 hover:bg-green-50/50 shadow-sm transition-all"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(notif._id)}
                                                        className="p-2.5 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50/50 shadow-sm transition-all"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400">
                                                <span className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-lg text-gray-500">
                                                    {config.label}
                                                </span>
                                                <span>{formatTime(notif.createdAt)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="p-6 border-t border-gray-50 bg-gray-50/30 flex items-center justify-between">
                                <p className="text-sm text-gray-500 font-medium">
                                    Showing <span className="text-[#1a1a1a] font-bold">{(pagination.page - 1) * pagination.limit + 1}</span> to <span className="text-[#1a1a1a] font-bold">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="text-[#1a1a1a] font-bold">{pagination.total}</span>
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setPagination(p => ({ ...p, page: Math.max(1, p.page - 1) }))}
                                        disabled={pagination.page === 1}
                                        className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                    </button>
                                    <div className="flex items-center gap-1">
                                        {[...Array(pagination.pages)].map((_, i) => {
                                            const p = i + 1;
                                            if (p === 1 || p === pagination.pages || (p >= pagination.page - 1 && p <= pagination.page + 1)) {
                                                return (
                                                    <button
                                                        key={p}
                                                        onClick={() => setPagination(prev => ({ ...prev, page: p }))}
                                                        className={`w-10 h-10 rounded-xl text-sm font-bold transition-all ${pagination.page === p ? 'bg-[#385040] text-white shadow-lg' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                                    >
                                                        {p}
                                                    </button>
                                                );
                                            }
                                            if (p === 2 || p === pagination.pages - 1) {
                                                return <span key={p} className="px-2 text-gray-400">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    <button
                                        onClick={() => setPagination(p => ({ ...p, page: Math.min(p.pages, p.page + 1) }))}
                                        disabled={pagination.page === pagination.pages}
                                        className="p-2 bg-white border border-gray-200 rounded-xl text-gray-500 disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                                    >
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
            
            <style>{`
                .scrollbar-none::-webkit-scrollbar { display: none; }
                .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        </div>
    );
}
