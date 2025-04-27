import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { 
  fetchCategories, 
  fetchAllCategories,
  fetchCategory, 
  fetchCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../services/categories';
import { Category, CategoryCreateData, CategoryUpdateData, PaginatedResponse } from '../types/api';

// Chaves de consulta
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
  list: (filters: {
    page?: number;
    perPage?: number;
    parentId?: number;
  }) => [...categoryKeys.lists(), filters] as const,
  allList: () => [...categoryKeys.lists(), 'all'] as const,
  details: () => [...categoryKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoryKeys.details(), id] as const,
  slug: (slug: string) => [...categoryKeys.details(), 'slug', slug] as const,
};

// Hook para buscar categorias paginadas
export const useCategories = (
  page: number = 1,
  perPage: number = 20,
  parentId?: number,
  options?: UseQueryOptions<PaginatedResponse<Category>>
) => {
  return useQuery({
    queryKey: categoryKeys.list({ page, perPage, parentId }),
    queryFn: () => fetchCategories(page, perPage, parentId),
    ...options,
  });
};

// Hook para buscar todas as categorias (sem paginação)
export const useAllCategories = (options?: UseQueryOptions<Category[]>) => {
  return useQuery({
    queryKey: categoryKeys.allList(),
    queryFn: fetchAllCategories,
    ...options,
  });
};

// Hook para buscar uma categoria por ID
export const useCategory = (id: number, options?: UseQueryOptions<Category>) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => fetchCategory(id),
    ...options,
  });
};

// Hook para buscar uma categoria por slug
export const useCategoryBySlug = (slug: string, options?: UseQueryOptions<Category>) => {
  return useQuery({
    queryKey: categoryKeys.slug(slug),
    queryFn: () => fetchCategoryBySlug(slug),
    ...options,
  });
};

// Hook para criar uma categoria
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CategoryCreateData) => createCategory(data),
    onSuccess: () => {
      // Invalidar todas as listas de categorias
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

// Hook para atualizar uma categoria
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CategoryUpdateData) => updateCategory(data),
    onSuccess: (updatedCategory) => {
      // Atualizar a categoria no cache
      queryClient.setQueryData(
        categoryKeys.detail(updatedCategory.id),
        updatedCategory
      );
      
      // Invalidar todas as listas de categorias
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};

// Hook para excluir uma categoria
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: (_, id) => {
      // Remover a categoria do cache
      queryClient.removeQueries({ queryKey: categoryKeys.detail(id) });
      
      // Invalidar todas as listas de categorias
      queryClient.invalidateQueries({ queryKey: categoryKeys.lists() });
    },
  });
};
