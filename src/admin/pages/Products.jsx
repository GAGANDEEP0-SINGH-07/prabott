import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchAdminProducts, deleteProduct } from '../services/adminApi';
import AdminTable from '../components/AdminTable';
import { formatPrice } from '../../utils/pricing';

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams();
    const initialSearch = searchParams.get('q') || '';
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState(initialSearch);
    const navigate = useNavigate();

    // Update search if URL changes (external search from header)
    useEffect(() => {
        const q = searchParams.get('q') || '';
        if (q !== search) {
            setSearch(q);
            setPage(1);
        }
    }, [searchParams]);

    const load = useCallback(() => {
        setLoading(true);
        fetchAdminProducts({ page, keyword: search, limit: 10 })
            .then(r => {
                setProducts(r.data.products);
                setTotal(r.data.total || 0);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [page, search]);

    useEffect(load, [load]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This action cannot be undone.`)) return;
        try {
            await deleteProduct(id);
            if (products.length === 1 && page > 1) setPage(p => p - 1);
            else load();
        } catch { alert('Failed to delete product'); }
    };
    
    const columns = [
        {
            key: 'image', header: 'Image', sortable: false,
            render: (row) => (
                <img
                    src={row.images?.[0] || 'https://via.placeholder.com/50x50?text=No+Image'}
                    alt={row.name}
                    className="w-12 h-12 object-cover rounded-lg border border-slate-200 shadow-sm"
                    onError={e => { e.target.src = 'https://via.placeholder.com/50x50?text=N/A'; }}
                />
            ),
        },
        {
            key: 'name', accessor: 'name', header: 'Product Name', render: (row) => (
                <span className="font-bold text-slate-700">{row.name}</span>
            )
        },
        {
            key: 'category', accessor: 'category', header: 'Category', render: (row) => (
                <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full text-xs font-semibold">{row.category}</span>
            )
        },
        {
            key: 'price', accessor: 'price', header: 'Price', render: (row) => (
                <span className="font-bold text-emerald-600">{formatPrice(row.price)}</span>
            )
        },
        {
            key: 'stock', accessor: 'stock', header: 'Stock', render: (row) => (
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-block
                    ${row.stock > 10 ? 'bg-emerald-50 text-emerald-600' : row.stock > 0 ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'}
                `}>
                    {row.stock > 0 ? `${row.stock} in stock` : 'Out of stock'}
                </span>
            )
        },
        {
            key: 'ratings', accessor: 'ratings', header: 'Rating', render: (row) => (
                <span className="flex items-center gap-1 font-semibold text-slate-600">
                    <svg className="w-4 h-4 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    {Number(row.ratings || 0).toFixed(1)}
                </span>
            )
        },
        {
            key: 'actions', header: 'Actions', sortable: false, align: 'right',
            render: (row) => (
                <div className="flex items-center justify-end gap-2 text-sm">
                    <button
                        onClick={() => navigate(`/admin/products/edit/${row._id}`)}
                        className="p-1.5 text-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-md transition-colors"
                        title="Edit Product"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </button>
                    <button
                        onClick={() => handleDelete(row._id, row.name)}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-md transition-colors"
                        title="Delete Product"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 tracking-tight">Products Management</h2>
                    <p className="text-sm font-medium text-slate-500 mt-1">{total} products in catalogue</p>
                </div>
                <button
                    onClick={() => navigate('/admin/products/add')}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md shadow-indigo-500/20 transition-all focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                    Add Product
                </button>
            </div>

            <AdminTable
                columns={columns}
                data={products}
                serverSide
                totalItems={total}
                currentPage={page}
                pageSize={10}
                onPageChange={setPage}
                onSearchChange={(v) => { 
                    setSearch(v); 
                    setPage(1);
                    setSearchParams(v ? { q: v } : {});
                }}
                loading={loading}
                searchPlaceholder="Search products by name or category…"
                emptyText="No products found matching your search."
            />
        </div>
    );
}
