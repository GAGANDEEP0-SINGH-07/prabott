import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchAdminUsers, updateUserRole, suspendUser, deleteUser } from '../services/adminApi';
import AdminTable from '../components/AdminTable';

export default function Users() {
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const load = useCallback(() => {
        setLoading(true);
        fetchAdminUsers({ page, keyword: search, limit: 10 })
            .then(r => {
                setUsers(r.data.users);
                setTotal(r.data.total || 0);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page, search]);

    useEffect(load, [load]);

    const handleRole = async (id, currentRole) => {
        const newRole = currentRole === 'admin' ? 'customer' : 'admin';
        if (!window.confirm(`Change role to ${newRole.toUpperCase()}?`)) return;
        try {
            await updateUserRole(id, newRole);
            load();
        } catch (err) { alert(err.response?.data?.message || 'Failed to update role'); }
    };

    const handleSuspend = async (id, isSuspended) => {
        const action = isSuspended ? 'Unsuspend' : 'Suspend';
        if (!window.confirm(`${action} this account?`)) return;
        try {
            await suspendUser(id);
            load();
        } catch (err) { alert(err.response?.data?.message || `Failed to ${action.toLowerCase()} user`); }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Permanently delete user "${name}"?`)) return;
        try {
            await deleteUser(id);
            if (users.length === 1 && page > 1) setPage(p => p - 1);
            else load();
        } catch (err) { alert(err.response?.data?.message || 'Failed to delete user'); }
    };

    const columns = [
        {
            key: 'user', header: 'User', render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-sm shadow-sm border border-slate-200 uppercase">
                        {row.name.charAt(0)}
                    </div>
                    <div>
                        <p className="font-bold text-slate-700 mb-0.5">{row.name}</p>
                        <p className="text-xs font-medium text-slate-400">{row.email}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'role', accessor: 'role', header: 'Role', render: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border inline-block
                    ${row.role === 'admin' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'bg-slate-50 text-slate-600 border-slate-200'}
                `}>
                    {row.role}
                </span>
            )
        },
        {
            key: 'status', header: 'Status', render: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border inline-block
                    ${row.suspended ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'}
                `}>
                    {row.suspended ? 'Suspended' : 'Active'}
                </span>
            )
        },
        {
            key: 'joined', header: 'Joined Date', render: (row) => (
                <span className="text-sm font-medium text-slate-500">
                    {new Date(row.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            )
        },
        {
            key: 'actions', header: 'Actions', align: 'right', render: (row) => (
                <div className="flex items-center justify-end gap-2 text-sm">
                    <button
                        onClick={() => navigate(`/admin/users/${row._id}`)}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                        title="View Details"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                    </button>
                    {/* Only superadmin can promote/demote admins. Regular admins can manage other things. */}
                    {(currentUser?.role === 'superadmin' || row.role !== 'user') && (
                        <button
                            onClick={() => handleRole(row._id, row.role)}
                            className={`p-1.5 rounded-md transition-colors ${row.role === 'admin' || row.role === 'superadmin' ? 'text-amber-500 hover:bg-amber-50 hover:text-amber-600' : 'text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
                            title={row.role === 'admin' || row.role === 'superadmin' ? 'Demote to Customer' : 'Promote to Admin'}
                            disabled={row.role === 'superadmin' && currentUser?.role !== 'superadmin'}
                        >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M12 20V10"></path><path d="m18 14-6-6-6 6"></path></svg>
                        </button>
                    )}
                    <button
                        onClick={() => handleSuspend(row._id, row.suspended)}
                        className={`p-1.5 rounded-md transition-colors ${row.suspended ? 'text-emerald-500 hover:bg-emerald-50 hover:text-emerald-600' : 'text-amber-500 hover:bg-amber-50 hover:text-amber-600'}`}
                        title={row.suspended ? 'Unsuspend User' : 'Suspend User'}
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>
                    </button>
                    <button
                        onClick={() => handleDelete(row._id, row.name)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-md transition-colors"
                        title="Delete User"
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
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Users Management</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">{total} registered accounts</p>
                </div>
            </div>
            <AdminTable
                columns={columns}
                data={users}
                serverSide
                totalItems={total}
                currentPage={page}
                pageSize={10}
                onPageChange={setPage}
                onSearchChange={(v) => { setSearch(v); setPage(1); }}
                loading={loading}
                searchPlaceholder="Search by name or email…"
                emptyText="No users found."
            />
        </div>
    );
}
