import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminOrderDetails, updateOrderStatus } from '../services/adminApi';

const STATUS_OPTIONS = ['Pending', 'Processing', 'Shipped', 'Delivered'];
const PAYMENT_STATUS_OPTIONS = ['Pending', 'Paid', 'Failed', 'Completed'];

const STATUS_COLORS = {
    Pending: 'bg-amber-50 text-amber-600 border-amber-200',
    Processing: 'bg-blue-50 text-blue-600 border-blue-200',
    Shipped: 'bg-purple-50 text-purple-600 border-purple-200',
    Delivered: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Paid: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    Failed: 'bg-rose-50 text-rose-600 border-rose-200',
};

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchAdminOrderDetails(id)
            .then(res => setOrder(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleStatusChange = async (field, value) => {
        setUpdating(true);
        try {
            await updateOrderStatus(id, { [field]: value });
            setOrder(prev => ({ ...prev, [field]: value }));
        } catch (err) {
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    if (!order) return <div className="p-10 text-center text-red-500">Order not found</div>;

    const Badge = ({ status }) => (
        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${STATUS_COLORS[status] || 'bg-slate-50 text-slate-500 border-slate-200'}`}>
            {status}
        </span>
    );

    return (
        <div className="max-w-5xl space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Order Details</h2>
                    <p className="text-sm text-slate-500 font-medium">#{order._id.toUpperCase()}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100">
                            <h3 className="font-bold text-slate-800">Order Items</h3>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {order.products.map((item, idx) => (
                                <div key={idx} className="p-5 flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                                        <img src={item.productId?.images?.[0]} alt={item.productId?.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-slate-800 truncate">{item.productId?.name || 'Deleted Product'}</h4>
                                        <p className="text-xs text-slate-500 font-medium">${item.price.toFixed(2)} x {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-800">${(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-5 bg-slate-50/50 space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-slate-500 font-medium">Subtotal</span>
                                <span className="text-slate-800 font-bold">${order.totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-base pt-2 border-t border-slate-200">
                                <span className="text-slate-800 font-bold">Total</span>
                                <span className="text-indigo-600 font-extrabold text-lg">${order.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Shipping Information</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Address</p>
                                <p className="text-sm text-slate-700 leading-relaxed">
                                    {order.shippingAddress?.street}<br />
                                    {order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}<br />
                                    {order.shippingAddress?.country}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Notes</p>
                                <p className="text-sm text-slate-500 italic">No notes provided for this order.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    {/* Status Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Order Status</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Delivery Status</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    value={order.orderStatus}
                                    disabled={updating}
                                    onChange={(e) => handleStatusChange('orderStatus', e.target.value)}
                                >
                                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Status</label>
                                <select
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    value={order.paymentStatus}
                                    disabled={updating}
                                    onChange={(e) => handleStatusChange('paymentStatus', e.target.value)}
                                >
                                    {PAYMENT_STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Customer Card */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <h3 className="font-bold text-slate-800 mb-4">Customer Details</h3>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-lg border border-indigo-100">
                                {order.userId?.name?.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">{order.userId?.name || 'Unknown User'}</h4>
                                <p className="text-xs text-slate-500 font-medium">{order.userId?.email || 'N/A'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => navigate(`/admin/users/${order.userId?._id}`)}
                            className="w-full py-2.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors"
                        >
                            View User Profile
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
