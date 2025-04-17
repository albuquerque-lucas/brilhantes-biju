import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, LoginCredentials, RegisterData, UserProfile } from '../types';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  socialLogin: (provider: 'google' | 'facebook' | 'apple') => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Verificar se o usuário está autenticado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
      }
    }
    setLoading(false);
  }, []);
  
  // Login com email e senha
  const login = async (credentials: LoginCredentials): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuário simulado para demonstração
      const mockUser: User = {
        id: '1',
        name: 'Usuário Teste',
        email: credentials.email,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      setError('Falha ao fazer login. Verifique suas credenciais.');
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Registro de novo usuário
  const register = async (data: RegisterData): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Validar dados
      if (data.password !== data.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
      
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuário simulado para demonstração
      const mockUser: User = {
        id: '1',
        name: data.name,
        email: data.email,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Falha ao registrar. Tente novamente.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Login social (Google, Facebook, Apple)
  const socialLogin = async (provider: 'google' | 'facebook' | 'apple'): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Usuário simulado para demonstração
      const mockUser: User = {
        id: '1',
        name: `Usuário ${provider.charAt(0).toUpperCase() + provider.slice(1)}`,
        email: `usuario.${provider}@example.com`,
      };
      
      setUser(mockUser);
      localStorage.setItem('user', JSON.stringify(mockUser));
    } catch (error) {
      setError(`Falha ao fazer login com ${provider}. Tente novamente.`);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  
  // Logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const value = {
    isAuthenticated: !!user,
    user,
    login,
    register,
    logout,
    socialLogin,
    loading,
    error
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
