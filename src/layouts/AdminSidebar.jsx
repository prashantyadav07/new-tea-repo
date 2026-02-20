import { useState } from 'react';
import { createPortal } from 'react-dom';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderTree, FileText, LogOut, Settings, ExternalLink, Users, Menu, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import bro from '../assets/bro.png';

const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: ShoppingBag },
    { label: 'Categories', path: '/admin/categories', icon: FolderTree },
    { label: 'Orders', path: '/admin/orders', icon: FileText },
    { label: 'Users', path: '/admin/users', icon: Users },
    { label: 'Admins', path: '/admin/admins', icon: Settings },
    { label: 'Complaints', path: '/admin/complaints', icon: MessageSquare },
];

function SidebarContent({ onNavClick }) {
    const { logout } = useAuth();

    return (
        <>
            {/* Logo Area */}
            <div className="h-20 flex items-center px-8 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                    <img src={bro} alt="Logo" className="w-8 h-8 object-contain" />
                    <span className="font-display font-bold text-xl text-[#1a1a1a]">Admin</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onNavClick}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                            ${isActive
                                ? 'bg-[#385040] text-white shadow-lg shadow-[#385040]/20'
                                : 'text-gray-500 hover:bg-gray-50 hover:text-[#385040]'
                            }
                        `}
                    >
                        <item.icon className="w-5 h-5" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Footer: Go to Website + Logout */}
            <div className="p-4 border-t border-gray-100 space-y-2 shrink-0">
                <Link
                    to="/"
                    onClick={onNavClick}
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-[#385040] rounded-xl transition-colors text-sm font-bold"
                >
                    <ExternalLink className="w-5 h-5" />
                    Go to Website
                </Link>

                <button
                    onClick={() => { logout(); onNavClick?.(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </>
    );
}

export default function AdminSidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <>
            {/* ─── Desktop Sidebar (lg+) ─── */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col fixed inset-y-0 z-50">
                <SidebarContent />
            </aside>

            {/* ─── Mobile Top Bar (< lg) ─── */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-white/95 backdrop-blur-xl border-b border-gray-200 flex items-center justify-between px-4 shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <Menu className="w-6 h-6 text-[#1a1a1a]" />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src={bro} alt="Logo" className="w-7 h-7 object-contain" />
                        <span className="font-display font-bold text-lg text-[#1a1a1a]">Admin</span>
                    </div>
                </div>
            </div>

            {/* ─── Mobile Drawer (Portal) ─── */}
            {createPortal(
                <AnimatePresence>
                    {mobileOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setMobileOpen(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9990] lg:hidden"
                            />

                            {/* Drawer */}
                            <motion.aside
                                initial={{ x: '-100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 left-0 bottom-0 w-[80%] max-w-xs bg-white z-[9999] shadow-2xl lg:hidden flex flex-col"
                            >
                                {/* Close Button */}
                                <button
                                    onClick={() => setMobileOpen(false)}
                                    className="absolute top-5 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>

                                <SidebarContent onNavClick={() => setMobileOpen(false)} />
                            </motion.aside>
                        </>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
