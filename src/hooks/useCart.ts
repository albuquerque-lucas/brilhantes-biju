import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { 
  fetchCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyPromoCode,
  removePromoCode
} from '../services/cart';
import { Cart, AddToCartData } from '../types/api';

// Chaves de consulta
export const cartKeys = {
  all: ['cart'] as const,
  details: () => [...cartKeys.all, 'details'] as const,
};

// Hook para buscar o carrinho
export const useCart = (options?: UseQueryOptions<Cart>) => {
  return useQuery({
    queryKey: cartKeys.details(),
    queryFn: fetchCart,
    ...options,
  });
};

// Hook para adicionar item ao carrinho
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: AddToCartData) => addToCart(data),
    onSuccess: (updatedCart) => {
      // Atualizar o carrinho no cache
      queryClient.setQueryData(cartKeys.details(), updatedCart);
    },
  });
};

// Hook para atualizar item do carrinho
export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: number; quantity: number }) => 
      updateCartItem(itemId, quantity),
    onSuccess: (updatedCart) => {
      // Atualizar o carrinho no cache
      queryClient.setQueryData(cartKeys.details(), updatedCart);
    },
  });
};

// Hook para remover item do carrinho
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (itemId: number) => removeFromCart(itemId),
    onSuccess: (updatedCart) => {
      // Atualizar o carrinho no cache
      queryClient.setQueryData(cartKeys.details(), updatedCart);
    },
  });
};

// Hook para limpar o carrinho
export const useClearCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      // Invalidar o carrinho no cache
      queryClient.invalidateQueries({ queryKey: cartKeys.details() });
    },
  });
};

// Hook para aplicar código promocional
export const useApplyPromoCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (code: string) => applyPromoCode(code),
    onSuccess: (updatedCart) => {
      // Atualizar o carrinho no cache
      queryClient.setQueryData(cartKeys.details(), updatedCart);
    },
  });
};

// Hook para remover código promocional
export const useRemovePromoCode = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: removePromoCode,
    onSuccess: (updatedCart) => {
      // Atualizar o carrinho no cache
      queryClient.setQueryData(cartKeys.details(), updatedCart);
    },
  });
};
