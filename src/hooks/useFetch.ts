import { useState, useEffect, useCallback } from 'react';

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

type UseFetchReturn<T> = FetchState<T> & {
  refetch: () => Promise<void>;
};

/**
 * Hook personalizado para realizar requisições HTTP
 * @param url URL para a requisição
 * @param options Opções para a requisição fetch
 * @returns Estado da requisição e função para refazer a requisição
 */
function useFetch<T>(url: string, options?: RequestInit): UseFetchReturn<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: true,
    error: null
  });

  const fetchData = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState({ 
        data: null, 
        loading: false, 
        error: error instanceof Error ? error : new Error('Erro desconhecido na requisição') 
      });
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchData();
  }, [fetchData]);

  return { ...state, refetch };
}

export default useFetch;
