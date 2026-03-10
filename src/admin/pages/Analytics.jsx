import { useEffect, useState } from 'react';
import {
    LineChart, Line, AreaChart, Area, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie
} from 'recharts';
import { fetchAnalytics } from '../services/adminApi';

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics()
            .then(res => setData(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316'];

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Analytics Overview</h2>
                <p className="text-sm text-slate-500 font-medium">Deep dive into your store's performance data.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Detailed Revenue Chart */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-800">Growth Analysis</h3>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Revenue vs Forecast</p>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.salesTrend}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={v => `$${v}`} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Popularity Chart */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <div className="mb-6">
                        <h3 className="font-bold text-slate-800">Product Popularity</h3>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-widest">Units sold per top product</p>
                    </div>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.topProducts} layout="vertical" margin={{ left: 20 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#475569', fontWeight: 600 }} width={80} />
                                <Tooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="totalSold" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20}>
                                    {data.topProducts.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Performance Metrics List */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-800">Key Performance Indicators</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                    <div className="p-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Avg. Order Value</p>
                        <h4 className="text-xl font-bold text-slate-800">${(data.totalRevenue / data.totalOrders || 0).toFixed(2)}</h4>
                    </div>
                    <div className="p-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Conversion Rate</p>
                        <h4 className="text-xl font-bold text-slate-800">3.2%</h4>
                    </div>
                    <div className="p-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">New Users (MoM)</p>
                        <h4 className="text-xl font-bold text-emerald-600">+12%</h4>
                    </div>
                    <div className="p-6">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Return Customer Rate</p>
                        <h4 className="text-xl font-bold text-slate-800">24.5%</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
