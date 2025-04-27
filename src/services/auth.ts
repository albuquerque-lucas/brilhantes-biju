import { axiosJson } from '../config/axios';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../types/api';

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await axiosJson.post<AuthResponse>('/auth/login', credentials);
  return response.data;
};

export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await axiosJson.post<AuthResponse>('/auth/register', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await axiosJson.post('/auth/logout');
  localStorage.removeItem('token');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await axiosJson.get<User>('/auth/me');
  return response.data;
};

export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await axiosJson.post<{ message: string }>('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (
  token: string, 
  email: string, 
  password: string, 
  password_confirmation: string
): Promise<{ message: string }> => {
  const response = await axiosJson.post<{ message: string }>('/auth/reset-password', {
    token,
    email,
    password,
    password_confirmation
  });
  return response.data;
};

export const verifyEmail = async (token: string): Promise<{ message: string }> => {
  const response = await axiosJson.get<{ message: string }>(`/auth/verify-email/${token}`);
  return response.data;
};

export const resendVerificationEmail = async (): Promise<{ message: string }> => {
  const response = await axiosJson.post<{ message: string }>('/auth/email/verification-notification');
  return response.data;
};
