import { useState, useCallback, useEffect, useRef } from 'react';
import { AxiosError } from 'axios';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
}

export const useApi = <T,>(
  fetchFn: () => Promise<any>,
  immediate = true
) => {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchFnRef = useRef(fetchFn);

  useEffect(() => {
    fetchFnRef.current = fetchFn;
  }, [fetchFn]);

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const response = await fetchFnRef.current();
      setState({
        data: response.data || response,
        loading: false,
        error: null,
      });
      return response.data || response;
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error as AxiosError,
      });
      throw error;
    }
  }, []);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [execute, immediate]);

  return { ...state, execute, refetch: execute };
};
