import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, AuthResponse } from '../lib/api';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  logout: () => void;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Проверяем токен при загрузке приложения
  useEffect(() => {
    const checkAuth = async () => {
      const token = apiClient.getToken();
      if (token) {
        try {
          const profile = await apiClient.getProfile();
          setUser(profile);
        } catch (error) {
          apiClient.removeToken();
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Attempting login with:', { email, password: '***' });
      
      const response: AuthResponse = await apiClient.login({ email, password });
      
      console.log('Login response received:', { 
        user: response.user, 
        hasToken: !!response.token,
        message: response.message 
      });
      
      // Сохраняем токен
      apiClient.setToken(response.token);
      
      // Устанавливаем пользователя
      setUser(response.user);
      
      console.log('Login successful, user set');
    } catch (error) {
      console.error('Login error details:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при входе';
      console.error('Setting error message:', errorMessage);
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, fullName: string, role: string = 'CANDIDATE') => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response: AuthResponse = await apiClient.register({ 
        email, 
        password, 
        fullName, 
        role
      });
      
      // Сохраняем токен
      apiClient.setToken(response.token);
      
      // Устанавливаем пользователя
      setUser(response.user);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при регистрации';
      setError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.removeToken();
    setUser(null);
    setError(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    error,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};