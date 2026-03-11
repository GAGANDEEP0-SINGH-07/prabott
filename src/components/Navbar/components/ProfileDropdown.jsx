import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function ProfileDropdown() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    // Close dropdown on route change
    useEffect(() => {
        setOpen(false);
    }, [location.pathname]);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Close on Escape
    useEffect(() => {
        const handleKey = (e) => { if (e.key === 'Escape') setOpen(false); };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, []);

    const handleLogout = useCallback(() => {
        setOpen(false);
        logout();
    }, [logout]);

    const handleNav = useCallback((path) => {
        setOpen(false);
        navigate(path);
    }, [navigate]);

    // Not logged in → show profile icon that goes to /login
    if (!user) {
        return (
            <button
                className="hidden min-[961px]:flex bg-none border-none cursor-pointer w-9 h-9 rounded-[10px] text-[#444] items-center justify-center hover:text-[#111] hover:bg-black/5 hover:-translate-y-px active:translate-y-0 active:scale-95 transition-all"
                aria-label="Sign in"
                onClick={() => navigate('/login')}
            >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                </svg>
            </button>
        );
    }

    // Logged in → show avatar with dropdown
    const initial = user.name?.charAt(0)?.toUpperCase() || '?';

    return (
        <div ref={ref} className="hidden min-[961px]:block relative">
            {/* Avatar button */}
            <button
                onClick={() => setOpen((o) => !o)}
                className="profile-avatar-btn"
                aria-label="Account menu"
                aria-expanded={open}
            >
                <span className="profile-avatar-circle">
                    {initial}
                </span>
            </button>

            {/* Dropdown */}
            <div
                className={`profile-dropdown ${open ? 'profile-dropdown-open' : ''}`}
                role="menu"
            >
                {/* User info header */}
                <div className="profile-dropdown-header">
                    <span className="profile-dropdown-avatar">{initial}</span>
                    <div>
                        <p className="profile-dropdown-name">{user.name}</p>
                        <p className="profile-dropdown-email">{user.email}</p>
                    </div>
                </div>

                <div className="profile-dropdown-divider" />

                {/* Menu items */}
                <button className="profile-dropdown-item" role="menuitem" onClick={() => handleNav('/dashboard')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                    </svg>
                    Dashboard
                </button>

                <button className="profile-dropdown-item" role="menuitem" onClick={() => handleNav('/dashboard?tab=settings')}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3" />
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                    </svg>
                    Settings
                </button>

                <div className="profile-dropdown-divider" />

                {/* Logout */}
                <button className="profile-dropdown-logout" role="menuitem" onClick={handleLogout}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Log Out
                </button>
            </div>
        </div>
    );
}
