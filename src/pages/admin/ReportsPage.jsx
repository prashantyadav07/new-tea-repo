import { useEffect, useState, useMemo } from 'react';
import { BarChart3, Download, FileSpreadsheet, FileText, Calendar, TrendingUp, CreditCard, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';
import { adminAPI } from '../../services/adminAPI';

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ReportsPage() {
    const now = new Date();
    const [month, setMonth] = useState(now.getMonth() + 1);
    const [year, setYear] = useState(now.getFullYear());
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(false);

    const fetchReport = async () => {
        try {
            setLoading(true);
            const res = await adminAPI.getMonthlyReport(month, year);
            if (res.success) setReport(res.data);
        } catch (err) {
            toast.error('Failed to load report');
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchReport(); }, [month, year]);

    const handleExportExcel = async () => {
        try {
            const res = await adminAPI.exportReportExcel(month, year);
            const url = window.URL.createObjectURL(new Blob([res]));
            const a = document.createElement('a');
            a.href = url;
            a.download = `report-${year}-${String(month).padStart(2, '0')}.xlsx`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('Excel report downloaded');
        } catch { toast.error('Failed to export Excel'); }
    };

    const handleExportPDF = async () => {
        try {
            const res = await adminAPI.exportReportPDF(month, year);
            const url = window.URL.createObjectURL(new Blob([res], { type: 'application/pdf' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = `report-${year}-${String(month).padStart(2, '0')}.pdf`;
            a.click();
            window.URL.revokeObjectURL(url);
            toast.success('PDF report downloaded');
        } catch { toast.error('Failed to export PDF'); }
    };

    const years = useMemo(() => {
        const arr = [];
        for (let y = now.getFullYear(); y >= 2020; y--) arr.push(y);
        return arr;
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#1a1a1a]">Monthly Reports</h1>
                    <p className="text-gray-500 text-sm mt-1">Revenue and order analytics</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleExportExcel} disabled={!report}
                        className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-sm disabled:opacity-50">
                        <FileSpreadsheet className="w-4 h-4" /> Excel
                    </button>
                    <button onClick={handleExportPDF} disabled={!report}
                        className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium text-sm disabled:opacity-50">
                        <FileText className="w-4 h-4" /> PDF
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-wrap gap-4 items-end">
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Month</label>
                    <select value={month} onChange={e => setMonth(parseInt(e.target.value))}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#385040]/20">
                        {MONTH_NAMES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Year</label>
                    <select value={year} onChange={e => setYear(parseInt(e.target.value))}
                        className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#385040]/20">
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 animate-pulse">
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-3" />
                            <div className="h-8 bg-gray-200 rounded w-1/3" />
                        </div>
                    ))}
                </div>
            ) : report ? (
                <>
                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 rounded-xl bg-blue-100"><ShoppingBag className="w-5 h-5 text-blue-600" /></div>
                                <span className="text-sm text-gray-500 font-medium">Total Orders</span>
                            </div>
                            <p className="text-3xl font-bold text-[#1a1a1a]">{report.totalOrders}</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 rounded-xl bg-green-100"><CreditCard className="w-5 h-5 text-green-600" /></div>
                                <span className="text-sm text-gray-500 font-medium">Successful Payments</span>
                            </div>
                            <p className="text-3xl font-bold text-green-600">{report.successfulPayments}</p>
                            <p className="text-xs text-gray-400 mt-1">Only paid orders counted</p>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 rounded-xl bg-amber-100"><TrendingUp className="w-5 h-5 text-amber-600" /></div>
                                <span className="text-sm text-gray-500 font-medium">Revenue</span>
                            </div>
                            <p className="text-3xl font-bold text-[#1a1a1a]">₹{report.totalRevenue.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-gray-400 mt-1">From paid orders only</p>
                        </div>
                    </div>

                    {/* Payment Status Breakdown */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="font-bold text-lg text-[#1a1a1a] mb-4">Payment Status Breakdown</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead><tr className="border-b border-gray-100">
                                    <th className="text-left py-2 px-3 font-semibold text-gray-600">Status</th>
                                    <th className="text-right py-2 px-3 font-semibold text-gray-600">Orders</th>
                                    <th className="text-right py-2 px-3 font-semibold text-gray-600">Amount (₹)</th>
                                </tr></thead>
                                <tbody>
                                    {report.statusBreakdown.map(s => (
                                        <tr key={s._id} className="border-b border-gray-50">
                                            <td className="py-2.5 px-3">
                                                <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${s._id === 'paid' ? 'bg-green-50 text-green-700'
                                                    : s._id === 'failed' ? 'bg-red-50 text-red-700'
                                                        : s._id === 'cod' ? 'bg-blue-50 text-blue-700'
                                                            : 'bg-yellow-50 text-yellow-700'}`}>
                                                    {s._id}
                                                </span>
                                            </td>
                                            <td className="py-2.5 px-3 text-right font-medium">{s.count}</td>
                                            <td className="py-2.5 px-3 text-right">₹{s.total.toLocaleString('en-IN')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Daily Breakdown */}
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <h2 className="font-bold text-lg text-[#1a1a1a] mb-4">Daily Breakdown (Paid Orders)</h2>
                        {report.dailyBreakdown.length === 0 ? (
                            <p className="text-gray-400 text-sm py-4 text-center">No paid orders for this period</p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead><tr className="border-b border-gray-100">
                                        <th className="text-left py-2 px-3 font-semibold text-gray-600">Day</th>
                                        <th className="text-right py-2 px-3 font-semibold text-gray-600">Orders</th>
                                        <th className="text-right py-2 px-3 font-semibold text-gray-600">Revenue (₹)</th>
                                    </tr></thead>
                                    <tbody>
                                        {report.dailyBreakdown.map(d => (
                                            <tr key={d._id} className="border-b border-gray-50">
                                                <td className="py-2 px-3 font-medium">{MONTH_NAMES[month - 1]} {d._id}</td>
                                                <td className="py-2 px-3 text-right">{d.orders}</td>
                                                <td className="py-2 px-3 text-right">₹{d.revenue.toLocaleString('en-IN')}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            ) : null}
        </div>
    );
}
