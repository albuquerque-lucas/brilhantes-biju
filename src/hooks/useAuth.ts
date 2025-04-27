import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  login, 
  register, 
  logout, 
  getCurrentUser, 
  forgotPassword, 
  resetPassword,
  verifyEmail,
  resendVerificationEmail
} from '../services/auth';
import { LoginCredentials, RegisterData, User, AuthResponse } from '../types/api';

// Chaves de consulta
export const authKeys = {
  all: ['auth'] as const,
  currentUser: () => [...authKeys.all, 'me'] as const,
};

// Hook para obter o usuário atual
export const useCurrentUser = () => {
  return useQuery({
    queryKey: authKeys.currentUser(),
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para login
export const useLogin = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data: AuthResponse) => {
      // Salvar token no localStorage
      localStorage.setItem('token', data.token);
      
      // Atualizar o cache do usuário atual
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      
      // Invalidar consultas que possam depender do estado de autenticação
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

// Hook para registro
export const useRegister = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: (data: AuthResponse) => {
      // Salvar token no localStorage
      localStorage.setItem('token', data.token);
      
      // Atualizar o cache do usuário atual
      queryClient.setQueryData(authKeys.currentUser(), data.user);
      
      // Invalidar consultas que possam depender do estado de autenticação
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

// Hook para logout
export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      // Limpar o cache do usuário atual
      queryClient.setQueryData(authKeys.currentUser(), null);
      
      // Invalidar consultas que possam depender do estado de autenticação
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
  });
};

// Hook para recuperação de senha
export const useForgotPassword = () => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
};

// Hook para redefinição de senha
export const useResetPassword = () => {
  return useMutation({
    mutationFn: ({ token, email, password, password_confirmation }: {
      token: string;
      email: string;
      password: string;
      password_confirmation: string;
    }) => resetPassword(token, email, password, password_confirmation),
  });
};

// Hook para verificação de email
export const useVerifyEmail = () => {
  return useMutation({
    mutationFn: (token: string) => verifyEmail(token),
  });
};

// Hook para reenvio de email de verificação
export const useResendVerificationEmail = () => {
  return useMutation({
    mutationFn: resendVerificationEmail,
  });
};
