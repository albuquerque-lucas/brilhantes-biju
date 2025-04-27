import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { 
  fetchOrders,
  fetchOrder,
  createOrder,
  cancelOrder,
  fetchAddresses,
  fetchAddress,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getPaymentStatus,
  generatePaymentQRCode,
  generateBoleto
} from '../services/orders';
import { Order, CheckoutData, Address, PaginatedResponse } from '../types/api';

// Chaves de consulta
export const orderKeys = {
  all: ['orders'] as const,
  lists: () => [...orderKeys.all, 'list'] as const,
  list: (filters: { page?: number; perPage?: number }) => 
    [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, 'detail'] as const,
  detail: (id: number) => [...orderKeys.details(), id] as const,
  payment: (id: number) => [...orderKeys.detail(id), 'payment'] as const,
};

export const addressKeys = {
  all: ['addresses'] as const,
  lists: () => [...addressKeys.all, 'list'] as const,
  details: () => [...addressKeys.all, 'detail'] as const,
  detail: (id: number) => [...addressKeys.details(), id] as const,
};

// Hook para buscar pedidos paginados
export const useOrders = (
  page: number = 1,
  perPage: number = 10,
  options?: UseQueryOptions<PaginatedResponse<Order>>
) => {
  return useQuery({
    queryKey: orderKeys.list({ page, perPage }),
    queryFn: () => fetchOrders(page, perPage),
    ...options,
  });
};

// Hook para buscar um pedido por ID
export const useOrder = (id: number, options?: UseQueryOptions<Order>) => {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: () => fetchOrder(id),
    ...options,
  });
};

// Hook para criar um pedido
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (checkoutData: CheckoutData) => createOrder(checkoutData),
    onSuccess: (newOrder) => {
      // Adicionar o novo pedido ao cache
      queryClient.setQueryData(orderKeys.detail(newOrder.id), newOrder);
      
      // Invalidar a lista de pedidos
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
      
      // Invalidar o carrinho, pois ele deve estar vazio após a criação do pedido
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
};

// Hook para cancelar um pedido
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => cancelOrder(id),
    onSuccess: (updatedOrder) => {
      // Atualizar o pedido no cache
      queryClient.setQueryData(orderKeys.detail(updatedOrder.id), updatedOrder);
      
      // Invalidar a lista de pedidos
      queryClient.invalidateQueries({ queryKey: orderKeys.lists() });
    },
  });
};

// Hook para buscar endereços
export const useAddresses = (options?: UseQueryOptions<Address[]>) => {
  return useQuery({
    queryKey: addressKeys.lists(),
    queryFn: fetchAddresses,
    ...options,
  });
};

// Hook para buscar um endereço por ID
export const useAddress = (id: number, options?: UseQueryOptions<Address>) => {
  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => fetchAddress(id),
    ...options,
  });
};

// Hook para criar um endereço
export const useCreateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => 
      createAddress(address),
    onSuccess: (newAddress) => {
      // Adicionar o novo endereço ao cache
      queryClient.setQueryData(addressKeys.detail(newAddress.id!), newAddress);
      
      // Invalidar a lista de endereços
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
    },
  });
};

// Hook para atualizar um endereço
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, address }: { id: number; address: Partial<Address> }) => 
      updateAddress(id, address),
    onSuccess: (updatedAddress) => {
      // Atualizar o endereço no cache
      queryClient.setQueryData(addressKeys.detail(updatedAddress.id!), updatedAddress);
      
      // Invalidar a lista de endereços
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
    },
  });
};

// Hook para excluir um endereço
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteAddress(id),
    onSuccess: (_, id) => {
      // Remover o endereço do cache
      queryClient.removeQueries({ queryKey: addressKeys.detail(id) });
      
      // Invalidar a lista de endereços
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
    },
  });
};

// Hook para definir um endereço como padrão
export const useSetDefaultAddress = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => setDefaultAddress(id),
    onSuccess: (updatedAddress) => {
      // Atualizar o endereço no cache
      queryClient.setQueryData(addressKeys.detail(updatedAddress.id!), updatedAddress);
      
      // Invalidar a lista de endereços
      queryClient.invalidateQueries({ queryKey: addressKeys.lists() });
    },
  });
};

// Hook para obter o status de pagamento de um pedido
export const usePaymentStatus = (orderId: number, options?: UseQueryOptions<Order>) => {
  return useQuery({
    queryKey: orderKeys.payment(orderId),
    queryFn: () => getPaymentStatus(orderId),
    ...options,
  });
};

// Hook para gerar QR code de pagamento PIX
export const useGeneratePaymentQRCode = () => {
  return useMutation({
    mutationFn: (orderId: number) => generatePaymentQRCode(orderId),
  });
};

// Hook para gerar boleto
export const useGenerateBoleto = () => {
  return useMutation({
    mutationFn: (orderId: number) => generateBoleto(orderId),
  });
};
