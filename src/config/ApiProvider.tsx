import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Cria uma instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
});

// Componente provedor para envolver a aplicação
export const ApiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

// Exporta o QueryClient para uso em testes ou configurações adicionais
export { queryClient };
