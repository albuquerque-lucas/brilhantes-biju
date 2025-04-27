import { axiosJson, axiosMultipart } from '../config/axios';
import { 
  Product, 
  ProductCreateData, 
  ProductUpdateData, 
  PaginatedResponse,
  ApiResponse
} from '../types/api';

export const fetchProducts = async (
  page: number = 1, 
  perPage: number = 12,
  categoryId?: number,
  search?: string,
  featured?: boolean,
  isNew?: boolean
): Promise<PaginatedResponse<Product>> => {
  const params = { 
    page, 
    per_page: perPage,
    ...(categoryId && { category_id: categoryId }),
    ...(search && { search }),
    ...(featured !== undefined && { featured }),
    ...(isNew !== undefined && { is_new: isNew })
  };
  
  const response = await axiosJson.get<PaginatedResponse<Product>>('/products', { params });
  return response.data;
};

export const fetchProduct = async (id: number | string): Promise<Product> => {
  const response = await axiosJson.get<ApiResponse<Product>>(`/products/${id}`);
  return response.data.data;
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  const response = await axiosJson.get<ApiResponse<Product>>(`/products/slug/${slug}`);
  return response.data.data;
};

export const createProduct = async (data: ProductCreateData, images?: File[]): Promise<Product> => {
  if (!images || images.length === 0) {
    const response = await axiosJson.post<ApiResponse<Product>>('/products', data);
    return response.data.data;
  }
  
  const formData = new FormData();
  
  // Adicionar dados do produto
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });
  
  // Adicionar imagens
  images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });
  
  const response = await axiosMultipart.post<ApiResponse<Product>>('/products', formData);
  return response.data.data;
};

export const updateProduct = async (data: ProductUpdateData, images?: File[]): Promise<Product> => {
  if (!images || images.length === 0) {
    const response = await axiosJson.put<ApiResponse<Product>>(`/products/${data.id}`, data);
    return response.data.data;
  }
  
  const formData = new FormData();
  
  // Adicionar dados do produto
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      formData.append(key, value.toString());
    }
  });
  
  // Adicionar método PUT
  formData.append('_method', 'PUT');
  
  // Adicionar imagens
  images.forEach((image, index) => {
    formData.append(`images[${index}]`, image);
  });
  
  const response = await axiosMultipart.post<ApiResponse<Product>>(`/products/${data.id}`, formData);
  return response.data.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosJson.delete(`/products/${id}`);
};

export const deleteProductImage = async (productId: number, imageId: number): Promise<void> => {
  await axiosJson.delete(`/products/${productId}/images/${imageId}`);
};

export const setFeaturedProducts = async (productIds: number[]): Promise<void> => {
  await axiosJson.post('/products/featured', { product_ids: productIds });
};

export const setNewProducts = async (productIds: number[]): Promise<void> => {
  await axiosJson.post('/products/new', { product_ids: productIds });
};
