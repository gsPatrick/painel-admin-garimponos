import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: 'https://geral-apilorenaecommerce.r954jc.easypanel.host/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        // Check if running in browser environment
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Optional: Handle token expiration / logout here if not handled by useAuth
        }
        if (error.response?.status === 403) {
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('access-denied'));
            }
        }
        const message = error.response?.data?.message || "Erro de conexão com o servidor.";
        console.error("API Error:", error);

        // Prevent toast spam for 404s if handled locally, but generally show error
        if (error.code === "ERR_NETWORK") {
            toast.error("Não foi possível conectar ao servidor (Porta 4000).");
        } else if (error.response?.status >= 500) {
            toast.error(`Erro no servidor: ${message}`);
        } else {
            // Client errors (400, 401, etc) might be handled by the component, 
            // but we can show a generic warning if needed.
            // For now, let's just log it and let the component decide, 
            // or show a toast if it's a critical action.
        }

        return Promise.reject(error);
    }
);

export default api;
