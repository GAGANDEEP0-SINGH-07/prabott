import axios from 'axios';

const adminApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL || ''}/api/admin`,
});

adminApi.interceptors.request.use((config) => {
    const userInfo =
        localStorage.getItem('prabott_user') || sessionStorage.getItem('prabott_user');
    if (userInfo) {
        try {
            const parsed = JSON.parse(userInfo);
            if (parsed.token) config.headers.Authorization = `Bearer ${parsed.token}`;
        } catch (_) { }
    }
    return config;
});

// Analytics
export const fetchAnalytics = () => adminApi.get('/analytics');

// Products
export const fetchAdminProducts = (params) => adminApi.get('/products', { params });
export const createProduct = (data) => adminApi.post('/products', data);
export const updateProduct = (id, data) => adminApi.put(`/products/${id}`, data);
export const deleteProduct = (id) => adminApi.delete(`/products/${id}`);

// Orders
export const fetchAdminOrders = (params) => adminApi.get('/orders', { params });
export const fetchAdminOrderDetails = (id) => adminApi.get(`/orders/${id}`);
export const updateOrderStatus = (id, data) => adminApi.put(`/orders/${id}/status`, data);
export const deleteOrder = (id) => adminApi.delete(`/orders/${id}`);

// Users
export const fetchAdminUsers = (params) => adminApi.get('/users', { params });
export const fetchAdminUserDetails = (id) => adminApi.get(`/users/${id}`);
export const updateUserRole = (id, role) => adminApi.put(`/users/${id}/role`, { role });
export const suspendUser = (id) => adminApi.put(`/users/${id}/suspend`);
export const deleteUser = (id) => adminApi.delete(`/users/${id}`);

export default adminApi;
