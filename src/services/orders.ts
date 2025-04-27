import { axiosJson } from '../config/axios';
import { 
  Order, 
  CheckoutData,
  Address,
  PaginatedResponse,
  ApiResponse
} from '../types/api';

export const fetchOrders = async (
  page: number = 1, 
  perPage: number = 10
): Promise<PaginatedResponse<Order>> => {
  const params = { page, per_page: perPage };
  const response = await axiosJson.get<PaginatedResponse<Order>>('/orders', { params });
  return response.data;
};

export const fetchOrder = async (id: number): Promise<Order> => {
  const response = await axiosJson.get<ApiResponse<Order>>(`/orders/${id}`);
  return response.data.data;
};

export const createOrder = async (checkoutData: CheckoutData): Promise<Order> => {
  const response = await axiosJson.post<ApiResponse<Order>>('/orders', checkoutData);
  return response.data.data;
};

export const cancelOrder = async (id: number): Promise<Order> => {
  const response = await axiosJson.post<ApiResponse<Order>>(`/orders/${id}/cancel`);
  return response.data.data;
};

// Endereços
export const fetchAddresses = async (): Promise<Address[]> => {
  const response = await axiosJson.get<ApiResponse<Address[]>>('/addresses');
  return response.data.data;
};

export const fetchAddress = async (id: number): Promise<Address> => {
  const response = await axiosJson.get<ApiResponse<Address>>(`/addresses/${id}`);
  return response.data.data;
};

export const createAddress = async (address: Omit<Address, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Address> => {
  const response = await axiosJson.post<ApiResponse<Address>>('/addresses', address);
  return response.data.data;
};

export const updateAddress = async (id: number, address: Partial<Address>): Promise<Address> => {
  const response = await axiosJson.put<ApiResponse<Address>>(`/addresses/${id}`, address);
  return response.data.data;
};

export const deleteAddress = async (id: number): Promise<void> => {
  await axiosJson.delete(`/addresses/${id}`);
};

export const setDefaultAddress = async (id: number): Promise<Address> => {
  const response = await axiosJson.post<ApiResponse<Address>>(`/addresses/${id}/default`);
  return response.data.data;
};

// Pagamento
export const getPaymentStatus = async (orderId: number): Promise<Order> => {
  const response = await axiosJson.get<ApiResponse<Order>>(`/orders/${orderId}/payment-status`);
  return response.data.data;
};

export const generatePaymentQRCode = async (orderId: number): Promise<{ qr_code: string, qr_code_url: string }> => {
  const response = await axiosJson.get<ApiResponse<{ qr_code: string, qr_code_url: string }>>(`/orders/${orderId}/pix-qrcode`);
  return response.data.data;
};

export const generateBoleto = async (orderId: number): Promise<{ boleto_url: string, boleto_code: string }> => {
  const response = await axiosJson.get<ApiResponse<{ boleto_url: string, boleto_code: string }>>(`/orders/${orderId}/boleto`);
  return response.data.data;
};
