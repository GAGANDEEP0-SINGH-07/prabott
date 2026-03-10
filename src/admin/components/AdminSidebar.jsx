import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
    {
        to: '/admin', label: 'Dashboard', end: true, icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="flex-shrink-0">
                <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
        )
    },
    {
        to: '/admin/products', label: 'Products', icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="flex-shrink-0">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
        )
    },
    {
        to: '/admin/orders', label: 'Orders', icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="flex-shrink-0">
                <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
                <rect x="9" y="3" width="6" height="4" rx="1" /><path d="m9 14 2 2 4-4" />
            </svg>
        )
    },
    {
        to: '/admin/users', label: 'Users', icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="flex-shrink-0">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        )
    },
    {
        to: '/admin/analytics', label: 'Analytics', icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="flex-shrink-0">
                <path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" />
            </svg>
        )
    },
    {
        to: '/admin/settings', label: 'Settings', icon: (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="flex-shrink-0">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
            </svg>
        )
    },
];

export default function AdminSidebar({ isOpen, setIsOpen }) {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <aside className={`
            fixed top-0 left-0 z-50 h-screen w-[260px] 
            bg-gradient-to-b from-slate-900 to-slate-800
            border-r border-slate-700/50 shadow-xl
            flex flex-col transition-transform duration-300 ease-in-out
            ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
            {/* Logo Area */}
            <div className="flex items-center gap-3 px-6 py-5 border-b border-white/5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                    <svg viewBox="0 0 24 24" fill="white" width="20" height="20">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                </div>
                <div className="flex-1">
                    <p className="text-slate-100 font-bold text-base m-0 tracking-tight leading-none mb-1">Prabott.</p>
                    <p className="text-slate-400 text-[11px] m-0 font-medium tracking-wide uppercase">Admin Hub</p>
                </div>
                {/* Close button inside sidebar for mobile */}
                <button
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1">
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider px-3 mb-3">Menu</p>

                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        end={item.end}
                        onClick={() => setIsOpen(false)}
                        className={({ isActive }) => `
                            flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200
                            ${isActive
                                ? 'bg-indigo-500/10 text-indigo-400'
                                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                            }
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                <div className={`transition-colors ${isActive ? 'text-indigo-400' : 'text-slate-500'}`}>
                                    {item.icon}
                                </div>
                                {item.label}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Footer / User Area */}
            <div className="p-4 border-t border-white/5 mt-auto">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 text-[14px] font-medium hover:bg-red-500/20 hover:text-red-400 transition-all duration-200 focus:outline-none"
                >
                    <div className="flex items-center gap-3">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="opacity-80 flex-shrink-0">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16,17 21,12 16,7" /><line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Sign out</span>
                    </div>
                </button>
            </div>
        </aside>
    );
}
