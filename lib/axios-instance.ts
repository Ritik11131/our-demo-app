import axios, { AxiosInstance } from 'axios';
import environment from '@/environment';

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const handleTokenRefresh = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  if (!refreshToken) {
    throw new Error('No refresh token available.');
  }

  const response = await axios.post(`${environment.authUrl}/oauth/token/refresh`, {
    refresh_token: refreshToken,
  });

  const { accessToken } = response.data;
  localStorage.setItem('access_token', accessToken);

  return accessToken;
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

const addSubscriber = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

export const createApiClient = (baseURL: string): AxiosInstance => {
  const apiClient = axios.create({ baseURL });

  apiClient.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = token;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (originalRequest?.url?.endsWith('oauth/token')) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            addSubscriber((token) => {
              originalRequest.headers.Authorization = token;
              resolve(apiClient(originalRequest));
            });
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await handleTokenRefresh();
          onTokenRefreshed(newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          localStorage.clear();
          window.location.href = '/auth/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
};

// Auth API client
export const authApiClient = createApiClient(environment.authUrl);

// API client for other requests
export const apiClient = createApiClient(environment.apiUrl);
