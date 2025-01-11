import { useState, useCallback } from 'react';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { apiClient, authApiClient } from '../lib/axios-instance';
import toast from 'react-hot-toast';

interface UseApiClientOptions {
  showToast?: boolean;
  clientType?: 'api' | 'auth'; // Determines which client to use
}

interface ToastMessages {
  loading?: string;
  success?: string;
  error?: string;
}

export const useApiClient = <T = any>(options: UseApiClientOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Select client based on `clientType` option
  const client = options.clientType === 'auth' ? authApiClient : apiClient;

  const request = useCallback(
    async <R = T>(
      config: AxiosRequestConfig,
      toastMessages?: ToastMessages
    ): Promise<R> => {
      setIsLoading(true);
      setError(null);

      const promise = client(config)
        .then((response) => response.data)
        .catch((error: AxiosError) => {
          setError(error as Error);
          throw error;
        })
        .finally(() => setIsLoading(false));

      // Handle `GET` requests with spinner only
      if (config.method?.toUpperCase() === 'GET') {
        try {
          return await promise;
        } catch (error) {
          throw error;
        }
      }

      // Show toast notifications for other methods
      if (options.showToast && toastMessages) {
        return toast.promise(promise, {
          loading: toastMessages.loading || 'Loading...',
          success: toastMessages.success || 'Success!',
          error: (err) => toastMessages.error || err.message || 'An error occurred',
        });
      }

      return promise;
    },
    [options.showToast, client]
  );

  return {
    isLoading,
    error,
    request,
  };
};