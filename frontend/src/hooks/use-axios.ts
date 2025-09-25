import { useState } from 'react';
import type { AxiosRequestConfig } from 'axios';
import type { UseAxiosReturn } from '..';
import { api } from '@/services/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useAxios = <T = any>(): UseAxiosReturn<T> => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const request = async (config: AxiosRequestConfig): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.request<T>(config);
      setData(response.data);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Something went wrong. Please try again.';
      setError(message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { data, error, loading, request };
};
