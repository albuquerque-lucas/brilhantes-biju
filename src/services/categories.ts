import { axiosJson, axiosMultipart } from '../config/axios';
import { 
  Category, 
  CategoryCreateData, 
  CategoryUpdateData, 
  PaginatedResponse,
  ApiResponse
} from '../types/api';

export const fetchCategories = async (
  page: number = 1, 
  perPage: number = 20,
  parentId?: number
): Promise<PaginatedResponse<Category>> => {
  const params = { 
    page, 
    per_page: perPage,
    ...(parentId !== undefined && { parent_id: parentId })
  };
  
  const response = await axiosJson.get<PaginatedResponse<Category>>('/categories', { params });
  return response.data;
};

export const fetchAllCategories = async (): Promise<Category[]> => {
  const response = await axiosJson.get<ApiResponse<Category[]>>('/categories/all');
  return response.data.data;
};

export const fetchCategory = async (id: number): Promise<Category> => {
  const response = await axiosJson.get<ApiResponse<Category>>(`/categories/${id}`);
  return response.data.data;
};

export const fetchCategoryBySlug = async (slug: string): Promise<Category> => {
  const response = await axiosJson.get<ApiResponse<Category>>(`/categories/slug/${slug}`);
  return response.data.data;
};

export const createCategory = async (data: CategoryCreateData): Promise<Category> => {
  if (!data.image) {
    const response = await axiosJson.post<ApiResponse<Category>>('/categories', data);
    return response.data.data;
  }
  
  const formData = new FormData();
  
  // Adicionar dados da categoria
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== 'image') {
      formData.append(key, value.toString());
    }
  });
  
  // Adicionar imagem
  if (data.image) {
    formData.append('image', data.image);
  }
  
  const response = await axiosMultipart.post<ApiResponse<Category>>('/categories', formData);
  return response.data.data;
};

export const updateCategory = async (data: CategoryUpdateData): Promise<Category> => {
  if (!data.image) {
    const response = await axiosJson.put<ApiResponse<Category>>(`/categories/${data.id}`, data);
    return response.data.data;
  }
  
  const formData = new FormData();
  
  // Adicionar dados da categoria
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && key !== 'image' && key !== 'id') {
      formData.append(key, value.toString());
    }
  });
  
  // Adicionar método PUT
  formData.append('_method', 'PUT');
  
  // Adicionar imagem
  if (data.image) {
    formData.append('image', data.image);
  }
  
  const response = await axiosMultipart.post<ApiResponse<Category>>(`/categories/${data.id}`, formData);
  return response.data.data;
};

export const deleteCategory = async (id: number): Promise<void> => {
  await axiosJson.delete(`/categories/${id}`);
};
