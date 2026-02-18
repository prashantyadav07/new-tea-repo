import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FolderTree, FileText, LogOut, Settings, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import bro from '../assets/bro.png';

export default function AdminSidebar() {
    const { logout } = useAuth();

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Products', path: '/admin/products', icon: ShoppingBag },
        { label: 'Categories', path: '/admin/categories', icon: FolderTree },
        { label: 'Orders', path: '/admin/orders', icon: FileText },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col fixed inset-y-0 z-50">
            {/* Logo Area */}
            <div className="h-20 flex items-center px-8 border-b border-gray-100">
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

            {/* User Profile / Logout */}
            <div className="p-4 border-t border-gray-100 space-y-2">
                <Link
                    to="/"
                    className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 hover:text-[#385040] rounded-xl transition-colors text-sm font-bold"
                >
                    <ExternalLink className="w-5 h-5" />
                    Go to Website
                </Link>

                <button
                    onClick={logout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
}
