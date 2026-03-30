import { useEffect, useState, useRef, useCallback } from 'react';
import { Bell, Check, CheckCheck, Trash2, ShoppingBag, MessageSquare, AlertTriangle, Info, X, UserPlus, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { adminAPI } from '../services/adminAPI';

const TYPE_CONFIG = {
    new_order: { icon: ShoppingBag, color: 'text-blue-500', bg: 'bg-blue-50' },
    complaint: { icon: MessageSquare, color: 'text-purple-500', bg: 'bg-purple-50' },
    low_stock: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    payment: { icon: Check, color: 'text-green-500', bg: 'bg-green-50' },
    system: { icon: Info, color: 'text-gray-500', bg: 'bg-gray-50' },
    new_user: { icon: UserPlus, color: 'text-green-500', bg: 'bg-green-50' },
};

export default function NotificationPanel({ align = 'right' }) {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const lastFetchedAt = useRef(null);
    const panelRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Initial full fetch
    useEffect(() => {
        fetchAll();
        fetchUnreadCount();
    }, []);

    // Incremental polling every 30s
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const params = { limit: 10 };
                if (lastFetchedAt.current) params.since = lastFetchedAt.current;

                const res = await adminAPI.getNotifications(params);
                if (res.success && res.data?.length > 0) {
                    setNotifications(prev => {
                        const existingIds = new Set(prev.map(n => n._id));
                        const newNotifs = res.data.filter(n => !existingIds.has(n._id));
                        return [...newNotifs, ...prev].slice(0, 20);
                    });
                }
                const countRes = await adminAPI.getUnreadCount();
                if (countRes.success) setUnreadCount(countRes.data.count);
            } catch { /* silent */ }
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const fetchAll = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getNotifications({ limit: 10 });
            if (res.success) {
                const data = res?.data || res;
                setNotifications(Array.isArray(data) ? data : []);
                lastFetchedAt.current = new Date().toISOString();
            }
        } catch { /* silent */ }
        finally { setLoading(false); }
    };

    const fetchUnreadCount = async () => {
        try {
            const res = await adminAPI.getUnreadCount();
            if (res.success) setUnreadCount(res.data.count);
        } catch { /* silent */ }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await adminAPI.markNotificationRead(id);
            setNotifications(prev => Array.isArray(prev) ? prev.map(n => n._id === id ? { ...n, isRead: true } : n) : []);
            setUnreadCount(c => Math.max(0, c - 1));
        } catch { /* silent */ }
    };

    const handleMarkAllRead = async () => {
        try {
            await adminAPI.markAllNotificationsRead();
            setNotifications(prev => Array.isArray(prev) ? prev.map(n => ({ ...n, isRead: true })) : []);
            setUnreadCount(0);
        } catch { /* silent */ }
    };

    const handleDelete = async (id) => {
        try {
            await adminAPI.deleteNotification(id);
            setNotifications(prev => Array.isArray(prev) ? prev.filter(n => n._id !== id) : []);
            fetchUnreadCount();
        } catch { /* silent */ }
    };

    const timeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'just now';
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    };

    return (
        <div ref={panelRef} className="relative">
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-xl transition-all duration-300 ${isOpen ? 'bg-[#385040] text-white shadow-lg shadow-[#385040]/30' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
                <Bell className={`w-5 h-5 transition-transform ${isOpen ? 'scale-110' : ''}`} />
                {unreadCount > 0 && (
                    <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 min-w-[20px] h-[20px] flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full px-1 border-2 border-white shadow-md"
                    >
                        {unreadCount > 99 ? '99+' : unreadCount}
                    </motion.span>
                )}
            </button>

            {/* Dropdown Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                        className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} top-full mt-4 w-[calc(100vw-32px)] sm:w-[400px] bg-white/95 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 overflow-hidden z-[10001]`}
                    >
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100/50 bg-gray-50/50 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg text-[#1a1a1a]">Activity</h3>
                                <p className="text-xs text-gray-400 font-medium">Store notifications</p>
                            </div>
                            <div className="flex items-center gap-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="p-2 text-[#385040] hover:bg-[#385040]/10 rounded-xl transition-colors"
                                        title="Mark all as read"
                                    >
                                        <CheckCheck className="w-5 h-5" />
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[420px] overflow-y-auto premium-scrollbar px-2 py-2">
                            {loading ? (
                                <div className="p-4 space-y-4">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-3xl bg-gray-50/50 animate-pulse">
                                            <div className="w-12 h-12 bg-gray-200 rounded-2xl" />
                                            <div className="flex-1 space-y-2">
                                                <div className="h-4 bg-gray-200 rounded w-1/2" />
                                                <div className="h-3 bg-gray-200 rounded w-full" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="py-12 px-6 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bell className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <p className="text-gray-900 font-bold mb-1">No notifications</p>
                                    <p className="text-sm text-gray-400">We'll alert you when something happens.</p>
                                </div>
                            ) : (
                                <div className="space-y-1">
                                    {notifications.map(notif => {
                                        const config = TYPE_CONFIG[notif.type] || TYPE_CONFIG.system;
                                        const Icon = config.icon;
                                        return (
                                            <div
                                                key={notif._id}
                                                className={`group relative flex gap-4 p-4 rounded-[1.5rem] transition-all hover:bg-gray-50 cursor-pointer ${!notif.isRead ? 'bg-[#385040]/5' : ''}`}
                                                onClick={() => !notif.isRead && handleMarkAsRead(notif._id)}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl ${config.bg} flex items-center justify-center shrink-0 shadow-sm border border-white`}>
                                                    <Icon className={`w-6 h-6 ${config.color}`} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-1">
                                                        <p className={`text-sm leading-tight transition-colors ${!notif.isRead ? 'font-bold text-[#1a1a1a]' : 'font-medium text-gray-700'}`}>
                                                            {notif.title}
                                                        </p>
                                                        <div className="flex items-center gap-1 shrink-0">
                                                            {!notif.isRead && (
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]" />
                                                            )}
                                                            <button
                                                                onClick={(e) => { e.stopPropagation(); handleDelete(notif._id); }}
                                                                className="p-1.5 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                            >
                                                                <Trash2 className="w-3.5 h-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">{notif.message}</p>
                                                    <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-wider">{timeAgo(notif.createdAt)}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-gray-100/50 bg-gray-50/30">
                            <Link
                                to="/admin/notifications"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center gap-2 w-full py-3 bg-white border border-gray-100 rounded-2xl text-sm font-bold text-[#385040] hover:bg-gray-50 hover:shadow-md transition-all active:scale-[0.98]"
                            >
                                View all notifications
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                .premium-scrollbar::-webkit-scrollbar { width: 4px; }
                .premium-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
                .premium-scrollbar::-webkit-scrollbar-thumb:hover { background: #D1D5DB; }
            `}</style>
        </div>
    );
}

