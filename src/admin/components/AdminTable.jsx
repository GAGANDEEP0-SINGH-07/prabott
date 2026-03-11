import { useState, useMemo } from 'react';

export default function AdminTable({
    columns,
    data = [],
    searchPlaceholder = 'Search…',
    emptyText = 'No records found',
    // Server-side props
    serverSide = false,
    totalItems = 0,
    currentPage = 1,
    pageSize = 10,
    onPageChange,
    onSearchChange,
    onSortChange,
    loading = false
}) {
    const [localSearch, setLocalSearch] = useState('');
    const [sortKey, setSortKey] = useState('');
    const [sortDir, setSortDir] = useState('asc');
    const [localPage, setLocalPage] = useState(1);
    const rowsPerPage = pageSize;

    // CLIENT-SIDE LOGIC (fallback)
    const filtered = useMemo(() => {
        if (serverSide) return data;
        if (!localSearch.trim()) return data;
        const q = localSearch.toLowerCase();
        return data.filter((row) =>
            columns.some((col) => {
                const val = col.accessor ? row[col.accessor] : '';
                return String(val ?? '').toLowerCase().includes(q);
            })
        );
    }, [data, localSearch, columns, serverSide]);

    const sorted = useMemo(() => {
        if (serverSide) return filtered;
        if (!sortKey) return filtered;
        return [...filtered].sort((a, b) => {
            const av = a[sortKey] ?? '';
            const bv = b[sortKey] ?? '';
            return sortDir === 'asc'
                ? String(av).localeCompare(String(bv), undefined, { numeric: true })
                : String(bv).localeCompare(String(av), undefined, { numeric: true });
        });
    }, [filtered, sortKey, sortDir, serverSide]);

    const itemsToDisplay = serverSide ? data : sorted;
    const totalCount = serverSide ? totalItems : sorted.length;
    const activePage = serverSide ? currentPage : localPage;
    const totalPages = Math.max(1, Math.ceil(totalCount / rowsPerPage));
    const safePage = Math.min(activePage, totalPages);
    
    const paginated = serverSide ? data : sorted.slice((safePage - 1) * rowsPerPage, safePage * rowsPerPage);

    const handleSort = (key) => {
        if (serverSide) {
            const newDir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
            setSortKey(key);
            setSortDir(newDir);
            onSortChange?.(key, newDir);
        } else {
            if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
            else { setSortKey(key); setSortDir('asc'); }
            setLocalPage(1);
        }
    };

    const handleSearch = (val) => {
        if (serverSide) {
            onSearchChange?.(val);
        } else {
            setLocalSearch(val);
            setLocalPage(1);
        }
    };

    const handlePageChange = (p) => {
        if (serverSide) {
            onPageChange?.(p);
        } else {
            setLocalPage(p);
        }
    };

    return (
        <div className={loading ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'}>
            {/* Search bar */}
            <div className="mb-5 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                    <input
                        value={serverSide ? undefined : localSearch}
                        onChange={(e) => handleSearch(e.target.value)}
                        placeholder={searchPlaceholder}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-[13px] text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                    />
                </div>
                <span className="text-[13px] font-medium text-slate-500 sm:ml-auto">
                    {totalCount} {totalCount === 1 ? 'result' : 'results'} found
                </span>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-slate-50/80 border-b border-slate-200">
                                {columns.map((col) => (
                                    <th
                                        key={col.key}
                                        onClick={() => col.sortable !== false && col.accessor && handleSort(col.accessor)}
                                        className={`
                                            px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap select-none
                                            ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                                            ${col.sortable !== false && col.accessor ? 'cursor-pointer hover:bg-slate-100/50 transition-colors' : ''}
                                        `}
                                    >
                                        <div className={`flex items-center gap-1.5 ${col.align === 'right' ? 'justify-end' : col.align === 'center' ? 'justify-center' : 'justify-start'}`}>
                                            {col.header}
                                            {col.accessor && sortKey === col.accessor && (
                                                <span className="text-indigo-500">{sortDir === 'asc' ? '↑' : '↓'}</span>
                                            )}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {paginated.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                        {loading ? 'Fetching data...' : emptyText}
                                    </td>
                                </tr>
                            ) : paginated.map((row, i) => (
                                <tr key={row._id || i} className="hover:bg-slate-50/50 transition-colors group">
                                    {columns.map((col) => (
                                        <td
                                            key={col.key}
                                            className={`
                                                px-6 py-4 text-[13px] text-slate-600 align-middle
                                                ${col.align === 'right' ? 'text-right' : col.align === 'center' ? 'text-center' : 'text-left'}
                                            `}
                                        >
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                            Page {safePage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-1.5">
                            <PagBtn disabled={safePage <= 1} onClick={() => handlePageChange(safePage - 1)}>‹ Prev</PagBtn>
                            {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                                const start = Math.max(1, Math.min(safePage - 2, totalPages - 4));
                                const num = start + idx;
                                if (num > totalPages) return null;
                                return (
                                    <PagBtn key={num} active={num === safePage} onClick={() => handlePageChange(num)}>{num}</PagBtn>
                                );
                            })}
                            <PagBtn disabled={safePage >= totalPages} onClick={() => handlePageChange(safePage + 1)}>Next ›</PagBtn>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function PagBtn({ children, onClick, disabled, active }) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                ${active
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-1 ring-indigo-600'
                    : disabled
                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
                        : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 hover:border-slate-300'
                }
            `}
        >
            {children}
        </button>
    );
}
