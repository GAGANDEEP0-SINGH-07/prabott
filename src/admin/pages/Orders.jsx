import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminTable from '../components/AdminTable';
import { fetchAdminOrders, updateOrderStatus, deleteOrder } from '../services/adminApi';
import { formatPrice } from '../../utils/pricing';

const STATUS_COLORS = {
    Pending: { classes: 'bg-amber-50 text-amber-600 border-amber-200' },
    Processing: { classes: 'bg-blue-50 text-blue-600 border-blue-200' },
    Shipped: { classes: 'bg-purple-50 text-purple-600 border-purple-200' },
    Delivered: { classes: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    Paid: { classes: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    Completed: { classes: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
    Failed: { classes: 'bg-rose-50 text-rose-600 border-rose-200' },
};

export default function Orders() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearch = searchParams.get('q') || '';
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState(initialSearch);

    // Update search if URL changes
    useEffect(() => {
        const q = searchParams.get('q') || '';
        if (q !== search) {
            setSearch(q);
            setPage(1);
        }
    }, [searchParams]);

    const load = useCallback(() => {
        setLoading(true);
        fetchAdminOrders({ page, limit: 10, keyword: search })
            .then(r => {
                setOrders(r.data.orders);
                setTotal(r.data.total || 0);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page, search]);

    useEffect(load, [load]);

    const handleUpdateStatus = async (id, field, value) => {
        try {
            await updateOrderStatus(id, { [field]: value });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, [field]: value } : o));
        } catch { alert('Failed to update status'); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Cancel and delete this order completely?')) return;
        try {
            await deleteOrder(id);
            if (orders.length === 1 && page > 1) setPage(p => p - 1);
            else load();
        } catch { alert('Failed to delete order'); }
    };

    const StatusBadge = ({ status }) => {
        const s = STATUS_COLORS[status] || STATUS_COLORS.Pending;
        return (
            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${s.classes} inline-block`}>
                {status}
            </span>
        );
    };

    const columns = [
        {
            key: 'id', header: 'Order ID', render: (row) => (
                <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                    {row._id.substring(row._id.length - 8).toUpperCase()}
                </span>
            )
        },
        {
            key: 'customer', header: 'Customer', render: (row) => (
                <div>
                    <p className="font-bold text-slate-700 mb-0.5">{row.userId?.name || 'Unknown User'}</p>
                    <p className="text-xs font-medium text-slate-400">{row.userId?.email || 'N/A'}</p>
                </div>
            )
        },
        {
            key: 'date', header: 'Date', render: (row) => (
                <span className="text-sm font-medium text-slate-500">
                    {new Date(row.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            )
        },
        {
            key: 'total', accessor: 'totalAmount', header: 'Total', render: (row) => (
                <span className="font-bold text-emerald-600">{formatPrice(row.totalAmount)}</span>
            )
        },
        {
            key: 'payment', header: 'Payment', render: (row) => (
                <div className="flex flex-col gap-1.5 items-start">
                    <StatusBadge status={row.paymentStatus} />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                        {row.paymentMethod}
                    </span>
                </div>
            )
        },
        {
            key: 'delivery', header: 'Delivery', render: (row) => (
                <select
                    value={row.orderStatus}
                    onChange={(e) => handleUpdateStatus(row._id, 'orderStatus', e.target.value)}
                    className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer transition-all"
                >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                </select>
            )
        },
        {
            key: 'actions', header: 'Actions', align: 'right', render: (row) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => navigate(`/admin/orders/${row._id}`)}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                        title="View Details"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    <button
                        onClick={() => handleDelete(row._id)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-md transition-colors"
                        title="Cancel Order"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            )
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Orders Management</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">{total} total orders placed</p>
                </div>
            </div>
            <AdminTable
                columns={columns}
                data={orders}
                serverSide
                totalItems={total}
                currentPage={page}
                pageSize={10}
                onPageChange={setPage}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                loading={loading}
                searchPlaceholder="Search by customer name or email…"
                emptyText="No orders found."
            />
        </div>
    );
}
