import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import api from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('prabott_token'));
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true); // Start as loading to fetch profile

    const fetchProfile = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const { data } = await api.get('/auth/profile');
            setUser(data);
        } catch (err) {
            console.error("Session expired or invalid token");
            setToken(null);
            localStorage.removeItem('prabott_token');
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    const login = useCallback(async (userData, remember = false) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/login', userData);
            const { token: userToken, ...userWithoutToken } = data;
            
            setToken(userToken);
            setUser(userWithoutToken);
            localStorage.setItem('prabott_token', userToken);
            
            return { success: true, user: userWithoutToken };
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
            return { success: false, message: err.response?.data?.message || 'Login failed' };
        } finally {
            setLoading(false);
        }
    }, []);

    const signup = useCallback(async (userData) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.post('/auth/register', userData);
            const { token: userToken, ...userWithoutToken } = data;
            
            setToken(userToken);
            setUser(userWithoutToken);
            localStorage.setItem('prabott_token', userToken);
            
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
        setToken(null);
        localStorage.removeItem('prabott_token');
    }, []);

    return (
        <AuthContext.Provider value={{ user, token, login, signup, logout, error, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
