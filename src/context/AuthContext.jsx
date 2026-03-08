import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('prabott_user');
        return saved ? JSON.parse(saved) : null;
    });

    const login = useCallback((userData, remember = false) => {
        setUser(userData);
        if (remember) {
            localStorage.setItem('prabott_user', JSON.stringify(userData));
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('prabott_user');
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
