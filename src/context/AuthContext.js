// context/AuthContext.js
"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '../lib/api'; // Importa a instância configurada do Axios

// Cria o contexto de autenticação
const AuthContext = createContext(null);

/**
 * Provedor de Autenticação
 * Este componente envolve a aplicação e fornece o estado e as funções de autenticação
 * para todos os componentes filhos.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Começa como true para verificar o token inicial
  const router = useRouter();
  const pathname = usePathname(); // Hook para saber a rota atual

  // Efeito para verificar se existe um token válido no localStorage ao carregar a aplicação.
  useEffect(() => {
    async function loadUserFromToken() {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // Usa o endpoint /users/me para validar o token e obter dados atualizados do usuário.
          const { data } = await api.get('/users/me'); 
          setUser(data);
        } catch (error) {
          // Se o token for inválido ou expirado (e o refresh token também falhar),
          // o interceptor no api.js já terá tentado renová-lo.
          // Se o erro persistir, limpamos a sessão do cliente.
          console.error("Sessão inválida ou expirada. Realizando logout.");
          localStorage.removeItem('authToken');
          localStorage.removeItem('refreshToken');
          setUser(null);
          
          // Redireciona para o login apenas se o usuário não estiver em uma página pública
          const publicPaths = ['/login', '/register'];
          if (!publicPaths.includes(pathname)) {
             router.push('/login');
          }
        }
      }
      // Finaliza o carregamento inicial
      setLoading(false);
    }
    loadUserFromToken();
  }, [router, pathname]); // Re-executa se a rota mudar, para proteger novas páginas

  /**
   * Função para realizar o login do usuário.
   * @param {string} email - O e-mail do usuário.
   * @param {string} password - A senha do usuário.
   */
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data.accessToken && data.refreshToken) {
        // Salva ambos os tokens no localStorage
        localStorage.setItem('authToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        
        // Atualiza o estado do usuário com os dados retornados pela API
        setUser(data.user);
        
        // Redireciona para o painel principal após o login
        router.push('/onboarding');
      } else {
         throw new Error('Resposta inválida do servidor durante o login.');
      }
    } catch (error) {
      // Limpa quaisquer tokens antigos em caso de falha
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      // Lança o erro para ser tratado na UI (página de login)
      throw new Error(error.response?.data?.message || 'Falha no login. Verifique suas credenciais.');
    }
  };

  /**
   * Função para cadastrar um novo usuário.
   * @param {object} formData - Objeto com { name, email, password, cpf, phone }.
   */
  const register = async (formData) => {
    try {
      const { data } = await api.post('/auth/register', formData);
      
      if (data.accessToken && data.refreshToken) {
        // Após o cadastro, o usuário já é logado automaticamente
        localStorage.setItem('authToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        setUser(data.user);
        
        // Redireciona para o painel
        router.push('/onboarding');
      } else {
        throw new Error('Resposta inválida do servidor após o cadastro.');
      }
    } catch (error) {
      // Lança o erro para ser tratado na UI (página de cadastro)
      throw new Error(error.response?.data?.message || 'Falha no cadastro. Por favor, tente novamente.');
    }
  };
  
  /**
   * Função para realizar o logout do usuário.
   */
  const logout = () => {
    // Limpa os tokens do localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    
    // Reseta o estado do usuário
    setUser(null);
    
    // Redireciona para a página de login
    router.push('/login');
  };

  // O valor fornecido pelo contexto
  const value = {
    isAuthenticated: !!user, // Booleano que indica se o usuário está logado
    user,                     // Objeto com os dados do usuário
    register,                 // Função para cadastro
    login,                    // Função para login
    logout,                   // Função para logout
    loading,                  // Booleano que indica se a autenticação inicial está em andamento
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Só renderiza o conteúdo da aplicação após a verificação inicial de autenticação */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

/**
 * Hook customizado para consumir o AuthContext de forma fácil.
 * Ex: const { isAuthenticated, user, login } = useAuth();
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};