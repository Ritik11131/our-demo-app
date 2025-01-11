import { useState, useCallback } from 'react';
import { useApiClient } from './useApiClient';
import { useRouter  } from "next/navigation";
import { ResponseInterface } from '@/interface/response';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => 
    !!localStorage.getItem('access_token')
  );
  const router = useRouter();
  const { request } = useApiClient<ResponseInterface>({ showToast: true, clientType: 'auth' });

  const login = useCallback(async (loginId: string, password: string) => {
    
    const data = {
      loginDevice: 'web',
      loginId,
      password,
    };

    const response = await request(
      {
        method: 'POST',
        url: 'token',
        data,
      },
      {
        loading: 'Logging in...',
        success: 'Logged in successfully!',
        error: 'Login failed. Please check your credentials.',
      }
    );

    localStorage.setItem('access_token', response.data);
    // const { role , user_id} = decodeJwt(localStorage.getItem('access_token') || '');
    
    // localStorage.setItem('refresh_token', response.refreshToken);
    setIsAuthenticated(true);
    
    return response;
  }, [request]);

  const logout = useCallback(() => {
    localStorage.removeItem('access_token');
    // localStorage.removeItem('refresh_token');
    localStorage.removeItem('hasVisited');
    setIsAuthenticated(false);
    router.push("/auth/login");
  }, [router]);

  // const refreshToken = useCallback(async () => {
  //   const refreshToken = localStorage.getItem('refresh_token');
  //   if (!refreshToken) {
  //     throw new Error('No refresh token available');
  //   }

  //   const response = await request(
  //     {
  //       method: 'POST',
  //       url: 'oauth/token/refresh',
  //       data: { refresh_token: refreshToken },
  //     },
  //     {
  //       error: 'Failed to refresh token',
  //     }
  //   );

  //   localStorage.setItem('access_token', response.accessToken);
  //   localStorage.setItem('refresh_token', response.refreshToken);
    
  //   return response;
  // }, [request]);

  return {
    isAuthenticated,
    login,
    logout,
    // refreshToken,
  };
};