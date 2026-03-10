import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const saved = localStorage.getItem('prabott_user') || sessionStorage.getItem('prabott_user');
        return saved ? JSON.parse(saved) : null;
    });

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = useCallback(async (userData, remember = false) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', userData);
            setUser(data);
            if (remember) {
                localStorage.setItem('prabott_user', JSON.stringify(data));
            } else {
                sessionStorage.setItem('prabott_user', JSON.stringify(data));
            }
            return { success: true, user: data };
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    }, []);

    const signup = useCallback(async (userData, remember = false) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/register', userData);
            setUser(data);
            if (remember) {
                localStorage.setItem('prabott_user', JSON.stringify(data));
            } else {
                sessionStorage.setItem('prabott_user', JSON.stringify(data));
            }
            return { success: true };
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
            return { success: false, message: err.response?.data?.message || 'Signup failed' };
        } finally {
            setLoading(false);
        }
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('prabott_user');
        sessionStorage.removeItem('prabott_user');
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, error, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
