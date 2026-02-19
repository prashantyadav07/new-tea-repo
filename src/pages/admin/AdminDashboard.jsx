import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { LayoutDashboard, ShoppingBag, FolderTree, Users, ArrowUpRight, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/adminAPI';
import { toast } from 'sonner';

const StatCard = ({ title, value, icon: Icon, color, link, isLoading }) => (
    <motion.div
        whileHover={{ y: -5 }}
        className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden"
    >
        {isLoading ? (
            <div className="animate-pulse space-y-3">
                <div className="flex justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gray-200`} />
                </div>
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
        ) : (
            <>
                <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${color}`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    {link && (
                        <Link to={link} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
                            <ArrowUpRight className="w-4 h-4 text-gray-400" />
                        </Link>
                    )}
                </div>
                <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-[#1a1a1a]">{value}</p>
            </>
        )}
    </motion.div>
);

export default function AdminDashboard() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        totalUsers: 0,
        totalOrders: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await adminAPI.getDashboardStats();
                if (response.success) {
                    setStats(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch dashboard stats:", err);
                setError("Failed to load dashboard statistics.");
                toast.error("Could not load dashboard stats");
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statItems = [
        {
            title: 'Total Products',
            value: stats.totalProducts,
            icon: ShoppingBag,
            color: 'bg-blue-500',
            link: '/admin/products'
        },
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: LayoutDashboard,
            color: 'bg-orange-500',
            link: '/admin/orders'
        },
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'bg-purple-500',
            link: '/admin/users'
        },
        {
            title: 'Open Complaints',
            value: stats.openComplaints,
            icon: AlertCircle,
            color: 'bg-red-500',
            link: '/admin/complaints'
        },
    ];

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-red-100">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Error Loading Dashboard</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[#385040] text-white rounded-lg hover:bg-[#2c3e32] transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-display font-bold text-3xl text-[#1a1a1a] mb-2">Welcome back, {user?.name} 👋</h1>
                <p className="text-gray-500">Here's what's happening with your store today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statItems.map((stat, index) => (
                    <StatCard key={index} {...stat} isLoading={loading} />
                ))}
            </div>

            {/* Recent Activity Section (Placeholder) */}
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
                <h2 className="font-bold text-xl text-[#1a1a1a] mb-6">Recent Activity</h2>
                <div className="flex flex-col gap-4 text-center py-12 text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <LayoutDashboard className="w-12 h-12 mx-auto mb-2 opacity-20" />
                    <p>No recent activity to show</p>
                </div>
            </div>
        </div>
    );
}
