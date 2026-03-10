import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('prabott_user') || sessionStorage.getItem('prabott_user');
        if (userInfo) {
            try {
                const parsedUserInfo = JSON.parse(userInfo);
                if (parsedUserInfo.token) {
                    config.headers.Authorization = `Bearer ${parsedUserInfo.token}`;
                }
            } catch (error) {
                console.error('Error parsing user info from local storage:', error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
