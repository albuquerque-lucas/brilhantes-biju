import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { createBrowserHistory } from 'history';

const devUrl = 'http://localhost:8000/api'; // Porta padrão do Laravel

const history = createBrowserHistory();

const redirectToLogin = () => {
  history.push('/');
  window.location.reload();
};

export const axiosJson: AxiosInstance = axios.create({
  baseURL: devUrl,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
});

export const axiosMultipart: AxiosInstance = axios.create({
  baseURL: devUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
    Accept: 'application/json',
  },
  withCredentials: true,
});

axiosJson.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosMultipart.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

axiosJson.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);

axiosMultipart.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      redirectToLogin();
    }
    return Promise.reject(error);
  }
);
