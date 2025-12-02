import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '@/services/api'; // Use the real API service
import { toast } from 'sonner';

const useAuth = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null });
                try {
                    const response = await api.post('/users/login', { email, password });
                    const { user, token } = response.data;

                    // Ensure permissions are flattened for easier access if needed, 
                    // or just store the whole user object including Role.
                    set({
                        user: user,
                        token: token,
                        isAuthenticated: true,
                        isLoading: false
                    });

                    // Set token in API headers immediately
                    // Note: api.js interceptors should handle this if configured to read from storage,
                    // but setting it here ensures immediate availability.
                    // api.defaults.headers.common['Authorization'] = `Bearer ${token}`; 

                    toast.success("Login realizado com sucesso!");
                    return true;
                } catch (error) {
                    const msg = error.response?.data?.error || "Falha ao realizar login";
                    set({ error: msg, isLoading: false });
                    toast.error(msg);
                    return false;
                }
            },

            logout: () => {
                set({ user: null, token: null, isAuthenticated: false });
                toast.info("Logout realizado");
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            },

            checkAuth: async () => {
                const { token } = get();
                if (!token) return false;

                try {
                    // Verify token validity by fetching profile
                    const response = await api.get('/users/profile');
                    set({ user: response.data, isAuthenticated: true });
                    return true;
                } catch (error) {
                    // If 401, logout
                    get().logout();
                    return false;
                }
            },
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }),
        }
    )
);

export default useAuth;
