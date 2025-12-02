import api from './api';

const AppService = {
    // --- Dashboard ---
    getDashboardData: async () => {
        try {
            const response = await api.get('/dashboard/stats');
            return response.data;
        } catch (error) {
            console.error("API Error (Dashboard):", error);
            throw error;
        }
    },

    getSalesReports: async (period = '7d') => {
        try {
            const response = await api.get(`/analytics/reports/sales?period=${period}`);
            return response.data;
        } catch (error) {
            console.error("API Error (Sales Reports):", error);
            return [];
        }
    },

    getFunnelData: async () => {
        try {
            const response = await api.get('/analytics/funnel');
            return response.data;
        } catch (error) {
            console.error("API Error (Funnel):", error);
            return [];
        }
    },

    // --- Products ---
    getProducts: async (params = {}) => {
        const query = new URLSearchParams();
        if (params.category && params.category !== 'all') query.append('category', params.category);
        if (params.status && params.status !== 'all') query.append('status', params.status);
        if (params.search) query.append('search', params.search);

        const response = await api.get(`/products?${query.toString()}`);
        return response.data.data || response.data;
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

    // --- Brands ---
    getBrands: async () => {
        const response = await api.get('/brands');
        return response.data;
    },

    createBrand: async (data) => {
        const response = await api.post('/brands', data);
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
            const configs = response.data || [];

            // Default structure
            const settings = {
                identity: { storeName: '', logoUrl: '', primaryColor: '#000000', secondaryColor: '#ffffff' },
                integrations: { brechoApiUrl: '', brechoApiKey: '', mercadoPagoToken: '', pixKey: '' },
                seo: { whatsapp: '', instagram: '', supportEmail: '', metaTitle: '', metaDescription: '' }
            };

            configs.forEach(cfg => {
                // Map flat config to nested structure based on group
                if (settings[cfg.group]) {
                    settings[cfg.group][cfg.key] = cfg.value;
                }
            });

            return settings;
        } catch (error) {
            console.error("Failed to fetch settings:", error);
            return null;
        }
    },

    updateSettings: async (section, data) => {
        // Transform object to array of configs
        const configs = Object.keys(data).map(key => ({
            key,
            value: data[key],
            group: section,
            is_public: true
        }));

        const response = await api.post('/config/bulk', configs);
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
    },
    // --- Analytics ---
    getAnalyticsReports: async (startDate, endDate) => {
        const query = new URLSearchParams();
        if (startDate) query.append('startDate', startDate);
        if (endDate) query.append('endDate', endDate);

        const response = await api.get(`/analytics/reports/sales?${query.toString()}`);
        return response.data;
    },

    getProductPerformance: async () => {
        const response = await api.get('/analytics/reports/products');
        return response.data;
    },

    // --- Upload ---
    uploadFile: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data; // Expected { url: '...' }
    },

    // --- Roles ---
    getRoles: async () => {
        const response = await api.get('/roles');
        return response.data;
    },

    getRoleById: async (id) => {
        const response = await api.get(`/roles/${id}`);
        return response.data;
    },

    createRole: async (data) => {
        const response = await api.post('/roles', data);
        return response.data;
    },

    updateRole: async (id, data) => {
        const response = await api.put(`/roles/${id}`, data);
        return response.data;
    },

    deleteRole: async (id) => {
        const response = await api.delete(`/roles/${id}`);
        return response.data;
    }
};

export default AppService;
