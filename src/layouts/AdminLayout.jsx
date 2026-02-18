import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
    return (
        <div className="min-h-screen bg-[#FAF9F6] flex">
            <AdminSidebar />
            <main className="flex-1 lg:ml-64 min-w-0">
                <div className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
