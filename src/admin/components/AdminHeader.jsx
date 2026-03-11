import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const labelMap = {
    '/admin': 'Dashboard Overview',
    '/admin/products': 'Products',
    '/admin/products/add': 'Add Product',
    '/admin/orders': 'Orders',
    '/admin/users': 'Users',
};

export default function AdminHeader({ onMenuClick }) {
    const { user } = useAuth();
    const location = useLocation();

    // find best-match label
    const label = Object.keys(labelMap)
        .filter((k) => location.pathname.startsWith(k))
        .sort((a, b) => b.length - a.length)[0];
    const pageTitle = label ? labelMap[label] : 'Admin Panel';

    const isEdit = location.pathname.includes('/admin/products/edit/');
    const title = isEdit ? 'Edit Product' : pageTitle;

    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && query.trim()) {
            // If on orders page, search orders? For now, let's just go to products search
            // unless we are specifically on orders page
            const target = location.pathname.includes('/admin/orders') ? '/admin/orders' : '/admin/products';
            navigate(`${target}?q=${encodeURIComponent(query.trim())}`);
            setQuery('');
        }
    };

    return (
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 h-16 px-4 md:px-6 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="lg:hidden p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>

                <h1 className="text-[19px] font-bold text-slate-800 tracking-tight m-0 hidden sm:block">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-4 sm:gap-6">
                {/* Search Bar */}
                <div className="hidden md:flex items-center relative">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-slate-400 absolute left-3">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                    <input
                        type="text"
                        placeholder="Search here..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="pl-10 pr-4 py-2 w-64 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 placeholder:text-slate-400"
                    />
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors focus:outline-none">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 border-2 border-white"></span>
                </button>

                {/* Vertical Divider */}
                <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

                {/* User Profile */}
                <div className="flex flex-shrink-0 items-center gap-3 cursor-pointer group">
                    <div className="hidden md:block text-right">
                        <p className="text-[13px] font-bold text-slate-700 m-0 leading-tight group-hover:text-indigo-600 transition-colors">{user?.name || 'Administrator'}</p>
                        <p className="text-[11px] font-medium text-slate-400 m-0 uppercase tracking-widest">{user?.role || 'Admin'}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100/50 shadow-sm relative overflow-hidden group-hover:shadow-md transition-shadow">
                        <img
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Admin')}&background=6366f1&color=fff&bold=true&rounded=false`}
                            alt="Admin avatar"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
