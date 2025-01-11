// hooks/useCrew.ts
import { useCallback } from 'react';
import { useApiClient } from './useApiClient';
import { ResponseInterface } from '@/interface/response';

export const useCrew = () => {
  const { isLoading, request } = useApiClient<ResponseInterface>({ showToast: true });

  const fetchVehicleList = useCallback(async () => {
    const response = await request({
      method: 'GET',
      url: 'VehicleList',
    });
    return response;
  }, [request]);

  return {
    isLoading,
    fetchVehicleList
  };
};