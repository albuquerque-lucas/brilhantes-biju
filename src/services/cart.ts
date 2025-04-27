import { axiosJson } from '../config/axios';
import { 
  Cart, 
  CartItem, 
  AddToCartData,
  ApiResponse
} from '../types/api';

export const fetchCart = async (): Promise<Cart> => {
  const response = await axiosJson.get<ApiResponse<Cart>>('/cart');
  return response.data.data;
};

export const addToCart = async (data: AddToCartData): Promise<Cart> => {
  const response = await axiosJson.post<ApiResponse<Cart>>('/cart/add', data);
  return response.data.data;
};

export const updateCartItem = async (itemId: number, quantity: number): Promise<Cart> => {
  const response = await axiosJson.put<ApiResponse<Cart>>(`/cart/items/${itemId}`, { quantity });
  return response.data.data;
};

export const removeFromCart = async (itemId: number): Promise<Cart> => {
  const response = await axiosJson.delete<ApiResponse<Cart>>(`/cart/items/${itemId}`);
  return response.data.data;
};

export const clearCart = async (): Promise<void> => {
  await axiosJson.delete('/cart/clear');
};

export const applyPromoCode = async (code: string): Promise<Cart> => {
  const response = await axiosJson.post<ApiResponse<Cart>>('/cart/promo-code', { code });
  return response.data.data;
};

export const removePromoCode = async (): Promise<Cart> => {
  const response = await axiosJson.delete<ApiResponse<Cart>>('/cart/promo-code');
  return response.data.data;
};
