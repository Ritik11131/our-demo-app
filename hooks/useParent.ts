// hooks/useParents.ts
import { useCallback } from 'react';
import { useApiClient } from './useApiClient'; // Adjust the import path as necessary
import { Parent, ParentResponse } from '@/interface/parent'; // Adjust the import path as necessary

export const useParents = () => {
  const { isLoading, request } = useApiClient<ParentResponse>({ showToast: true });

  const fetchParents = useCallback(async () => {
    const response = await request({
      method: 'GET',
      url: '/parents/list',
    });
    return response;
  }, [request]);


  const createParents = useCallback(async (data: Parent) => {
    const response = await request(
    {
      method: 'POST',
      url: '/parents/create',
      data,
    },
       {
        loading: 'Creating Parent...',
        success: 'Parent Created successfully!',
        error: 'Creation Failed',
      }
  );
    return response;
  },[request]);

  return {
    isLoading,
    fetchParents,
    createParents
  };
};