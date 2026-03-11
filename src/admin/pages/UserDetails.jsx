import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAdminUserDetails, updateUserRole, suspendUser } from '../services/adminApi';
import { formatPrice } from '../../utils/pricing';

export default function UserDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchAdminUserDetails(id)
            .then(res => setUser(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);

    const handleRoleChange = async () => {
        const newRole = user.role === 'admin' ? 'customer' : 'admin';
        if (!window.confirm(`Are you sure you want to change this user's role to ${newRole.toUpperCase()}?`)) return;

        setUpdating(true);
        try {
            await updateUserRole(id, newRole);
            setUser(prev => ({ ...prev, role: newRole }));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update user role');
        } finally {
            setUpdating(false);
        }
    };

    const handleSuspend = async () => {
        const action = user.suspended ? 'Unsuspend' : 'Suspend';
        if (!window.confirm(`Are you sure you want to ${action.toLowerCase()} this user?`)) return;

        setUpdating(true);
        try {
            await suspendUser(id);
            setUser(prev => ({ ...prev, suspended: !prev.suspended }));
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to update user status');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-4 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
        </div>
    );

    if (!user) return <div className="p-10 text-center text-red-500">User not found</div>;

    return (
        <div className="max-w-5xl space-y-6 pb-12">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-5 h-5"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </button>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">User Details</h2>
                    <p className="text-sm text-slate-500 font-medium">{user.name}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Information */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                        <div className="flex flex-col items-center text-center space-y-4 mb-8">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-indigo-200">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
                                <p className="text-sm text-slate-500 font-medium">{user.email}</p>
                            </div>
                            <div className="flex gap-2">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                                    {user.role}
                                </span>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${user.suspended ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}`}>
                                    {user.suspended ? 'Suspended' : 'Active'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-4 border-t border-slate-100 pt-6">
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</p>
                                <p className="text-sm text-slate-700 font-medium">{user.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location</p>
                                <p className="text-sm text-slate-700 font-medium whitespace-pre-wrap">{user.address || 'Address not listed'}</p>
                            </div>
                            <div>
                                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Customer Since</p>
                                <p className="text-sm text-slate-700 font-medium">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>

                        <div className="mt-8 space-y-3">
                            <button
                                onClick={handleRoleChange}
                                disabled={updating}
                                className="w-full py-2.5 bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 20V10"></path><path d="m18 14-6-6-6 6"></path></svg>
                                {user.role === 'admin' ? 'Demote to Customer' : 'Promote to Admin'}
                            </button>
                            <button
                                onClick={handleSuspend}
                                disabled={updating}
                                className={`w-full py-2.5 text-xs font-bold rounded-xl border transition-colors flex items-center justify-center gap-2 ${user.suspended ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100'}`}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                                {user.suspended ? 'Unsuspend User' : 'Suspend User'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Activity & History */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Recent Order History</h3>
                            <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">Last 10 Orders</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/80">
                                    <tr>
                                        <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                        <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Total</th>
                                        <th className="px-5 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {user.orders?.length === 0 ? (
                                        <tr>
                                            <td colSpan="4" className="px-5 py-10 text-center text-slate-400 text-sm font-medium">No order history found for this user.</td>
                                        </tr>
                                    ) : user.orders?.map((order) => (
                                        <tr key={order._id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-5 py-4 text-xs font-semibold text-slate-600">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${order.orderStatus === 'Delivered' ? 'bg-emerald-50 text-emerald-600' :
                                                        order.orderStatus === 'Shipped' ? 'bg-purple-50 text-purple-600' :
                                                            'bg-amber-50 text-amber-600'
                                                    }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-xs font-bold text-slate-700 text-right">
                                                {formatPrice(order.totalAmount)}
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <button
                                                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                                                    className="text-indigo-500 hover:text-indigo-700 text-xs font-bold"
                                                >
                                                    View Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Stats Placeholder */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Spent</p>
                             <h4 className="text-2xl font-bold text-slate-800 tracking-tight">
                                 {formatPrice(user.orders?.reduce((sum, o) => sum + o.totalAmount, 0) || 0)}
                             </h4>
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Order Frequency</p>
                            <h4 className="text-2xl font-bold text-slate-800 tracking-tight">
                                {user.orders?.length || 0} Total
                            </h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
