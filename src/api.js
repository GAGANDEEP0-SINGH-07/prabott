import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('prabott_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for centralized error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Auto logout on unauthorized
            localStorage.removeItem('prabott_token');
            // We can't easily access AuthContext here, so we'll use a custom event or window redirect if needed,
            // but for now, clearing the token will trigger AuthContext's internal state change if it's watching.
            // A more robust way is to reload or use a shared state manager.
            window.location.href = '/login?expired=true';
        }
        return Promise.reject(error);
    }
);

export default api;
