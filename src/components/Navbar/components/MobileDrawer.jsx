import { useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function MobileDrawer({ drawerOpen, setDrawerOpen, navLinks }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const handleSignIn = () => {
        setDrawerOpen(false);
        navigate('/login');
    };

    const handleLogout = () => {
        setDrawerOpen(false);
        logout();
    };

    const handleDashboard = () => {
        setDrawerOpen(false);
        navigate('/dashboard');
    };

    return (
        <>
            {/* ── Drawer Backdrop ── */}
            <div
                className={`fixed inset-0 z-[240] transition-opacity duration-300 ${drawerOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                style={{ background: 'rgba(0,0,0,0.18)', backdropFilter: 'blur(2px)' }}
                onClick={() => setDrawerOpen(false)}
            />

            {/* ── Mobile Drawer ── */}
            <div
                className={`fixed top-0 right-0 bottom-0 w-[280px] bg-white z-[250] flex flex-col gap-2 shadow-[-8px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-[380ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${drawerOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
                style={{ padding: '28px 24px' }}
            >
                <div className="flex items-center justify-between mb-5">
                    <span className="text-[1.1rem] font-bold text-[#111] tracking-[-0.03em]">Prabott.</span>
                    <button
                        className="bg-[#f3f3f3] border-none cursor-pointer rounded-[9px] w-[34px] h-[34px] flex items-center justify-center text-[#555]"
                        onClick={() => setDrawerOpen(false)}
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* User info when logged in */}
                {user && (
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#f0f0f0]">
                        <div className="w-9 h-9 rounded-full bg-[#F0E9DF] flex items-center justify-center text-[0.8rem] font-bold text-[#C8A97E] shrink-0">
                            {user.name?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div>
                            <p className="text-[0.82rem] font-semibold text-[#111] m-0 leading-tight">{user.name}</p>
                            <p className="text-[0.7rem] text-[#888] m-0">{user.email}</p>
                        </div>
                    </div>
                )}

                <nav className="flex flex-col">
                    {navLinks.map((link, i) => (
                        <NavLink
                            key={i}
                            to={`/category/${link.toLowerCase().replace(/ & /g, '-and-').replace(/ /g, '-')}`}
                            onClick={() => setDrawerOpen(false)}
                            className={({ isActive }) => `block px-3.5 py-3 rounded-[10px] text-[0.9rem] no-underline transition-colors ${isActive
                                ? 'bg-[#f0f0f0] text-[#111] font-medium'
                                : 'text-[#555] font-normal hover:bg-[#f5f5f5] hover:text-[#111]'
                                }`}
                        >
                            {link}
                        </NavLink>
                    ))}
                </nav>

                <div className="mt-auto flex flex-col gap-2 border-t border-[#f0f0f0] pt-5">
                    {user ? (
                        <>
                            <button
                                className="flex-1 bg-[#111] text-white border-none rounded-[10px] py-[11px] font-inter text-[0.82rem] font-medium cursor-pointer hover:bg-[#333] transition-colors"
                                onClick={handleDashboard}
                            >
                                Dashboard
                            </button>
                            <button
                                className="flex-1 bg-transparent border border-[#f0d0d0] rounded-[10px] py-[11px] font-inter text-[0.82rem] font-medium cursor-pointer hover:bg-[#FFF5F5] transition-colors"
                                style={{ color: '#E05252' }}
                                onClick={handleLogout}
                            >
                                Log Out
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                className="flex-1 bg-transparent text-[#111] border border-[#ddd] rounded-[10px] py-[11px] font-inter text-[0.82rem] font-medium cursor-pointer hover:bg-[#f5f5f5] transition-colors"
                                onClick={handleSignIn}
                            >
                                Sign In
                            </button>
                            <button className="flex-1 bg-[#111] text-white border-none rounded-[10px] py-[11px] font-inter text-[0.82rem] font-medium cursor-pointer hover:bg-[#333] transition-colors">
                                Shop Now
                            </button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
