import { useEffect, useState } from 'react';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { fetchAnalytics } from '../services/adminApi';

function MetricCard({ label, value, icon, colorClass, iconBgClass, sub }) {
    return (
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-start gap-4 transition-transform hover:-translate-y-1 hover:shadow-md duration-300">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBgClass}`}>
                <span className="text-2xl">{icon}</span>
            </div>
            <div>
                <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-2xl font-bold tracking-tight mb-1 ${colorClass}`}>{value}</p>
                {sub && <p className="text-slate-500 text-xs font-medium">{sub}</p>}
            </div>
        </div>
    );
}

export default function Dashboard() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalytics()
            .then(r => setData(r.data))
            .catch(() => setError('Failed to load analytics'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-3" />
                <p className="text-slate-400 font-medium">Loading analytics…</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="p-10 text-center text-red-500 font-medium bg-red-50 rounded-xl border border-red-100">{error}</div>
    );

    const fmtCurrency = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    return (
        <div className="space-y-6">
            {/* Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <MetricCard
                    label="Total Revenue"
                    value={fmtCurrency(data.totalRevenue)}
                    icon="💰"
                    colorClass="text-emerald-600"
                    iconBgClass="bg-emerald-50 text-emerald-500"
                    sub="From paid orders"
                />
                <MetricCard
                    label="Total Orders"
                    value={data.totalOrders?.toLocaleString()}
                    icon="📦"
                    colorClass="text-indigo-600"
                    iconBgClass="bg-indigo-50 text-indigo-500"
                    sub="All time"
                />
                <MetricCard
                    label="Total Users"
                    value={data.totalUsers?.toLocaleString()}
                    icon="👥"
                    colorClass="text-amber-600"
                    iconBgClass="bg-amber-50 text-amber-500"
                    sub="Registered accounts"
                />
                <MetricCard
                    label="Total Products"
                    value={data.totalProducts?.toLocaleString()}
                    icon="🛍️"
                    colorClass="text-rose-600"
                    iconBgClass="bg-rose-50 text-rose-500"
                    sub="In catalogue"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Trend */}
                <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Revenue Trend</h3>
                        <span className="text-xs font-medium bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full">Last 12 Months</span>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.salesTrend || []} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `$${v}`} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip
                                    formatter={(v) => [`$${v}`, 'Revenue']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontSize: '13px', fontWeight: 600 }}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#6366f1' }} activeDot={{ r: 6, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Activity */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Order Activity</h3>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.salesTrend || []} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} axisLine={false} tickLine={false} dx={-10} />
                                <Tooltip
                                    formatter={(v) => [v, 'Orders']}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontSize: '13px', fontWeight: 600 }}
                                    cursor={{ fill: '#f8fafc' }}
                                />
                                <Bar dataKey="orders" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Top Products */}
            {data.topProducts?.length > 0 && (
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Top Selling Products</h3>
                        <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    {['#', 'Product', 'Price', 'Units Sold'].map(h => (
                                        <th key={h} className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {data.topProducts.map((p, i) => (
                                    <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-slate-400">#{i + 1}</td>
                                        <td className="px-6 py-4 text-sm font-bold text-slate-700">{p.name}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-500">{fmtCurrency(p.price)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600">
                                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 mr-1">
                                                    <polyline points="20 6 9 17 4 12"></polyline>
                                                </svg>
                                                {p.totalSold} sold
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
