import api from './api';

const AppService = {
    // --- Dashboard ---
    getDashboardData: async () => {
        try {
            const response = await api.get('/dashboard/executive');
            return response.data;
        } catch (error) {
            console.error("API Error (Dashboard):", error);
            return {
                totalRevenue: 0,
                totalOrders: 0,
                totalCustomers: 0,
                averageTicket: 0,
                revenueChart: [],
                recentOrders: []
            };
        }
    },

    // --- Products ---
    getProducts: async () => {
        const response = await api.get('/products');
        return response.data;
    },

    getProductById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    createProduct: async (data) => {
        const response = await api.post('/products', data);
        return response.data;
    },

    updateProduct: async (id, data) => {
        const response = await api.put(`/products/${id}`, data);
        return response.data;
    },

    deleteProduct: async (id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },

    // --- Categories ---
    getCategories: async () => {
        const response = await api.get('/categories');
        return response.data;
    },

    getCategoryById: async (id) => {
        const response = await api.get(`/categories/${id}`);
        return response.data;
    },

    createCategory: async (data) => {
        const response = await api.post('/categories', data);
        return response.data;
    },

    updateCategory: async (id, data) => {
        const response = await api.put(`/categories/${id}`, data);
        return response.data;
    },

    deleteCategory: async (id) => {
        const response = await api.delete(`/categories/${id}`);
        return response.data;
    },

    // --- Orders ---
    getOrders: async () => {
        const response = await api.get('/orders');
        return response.data;
    },

    getOrderById: async (id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },

    updateOrderStatus: async (id, status) => {
        const response = await api.patch(`/orders/${id}/status`, { status });
        return response.data;
    },

    // --- Customers (Users) ---
    getCustomers: async () => {
        const response = await api.get('/users');
        return response.data;
    },

    getCustomerById: async (id) => {
        const response = await api.get(`/users/${id}`);
        return response.data;
    },

    // --- Settings ---
    getSettings: async () => {
        try {
            const response = await api.get('/config');
            return response.data;
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            return null;
        }
    },

    updateSettings: async (data) => {
        const response = await api.post('/config', data);
        return response.data;
    },

    // --- Shipping Rules ---
    getShippingRules: async () => {
        const response = await api.get('/shipping/rules');
        return response.data;
    },

    createShippingRule: async (data) => {
        const response = await api.post('/shipping/rules', data);
        return response.data;
    },

    updateShippingRule: async (id, data) => {
        const response = await api.put(`/shipping/rules/${id}`, data);
        return response.data;
    },

    deleteShippingRule: async (id) => {
        const response = await api.delete(`/shipping/rules/${id}`);
        return response.data;
    },

    // --- Coupons ---
    getCoupons: async () => {
        const response = await api.get('/coupons');
        return response.data;
    },

    createCoupon: async (data) => {
        const response = await api.post('/coupons', data);
        return response.data;
    },

    updateCoupon: async (id, data) => {
        const response = await api.put(`/coupons/${id}`, data);
        return response.data;
    },

    deleteCoupon: async (id) => {
        const response = await api.delete(`/coupons/${id}`);
        return response.data;
    }
};

export default AppService;
