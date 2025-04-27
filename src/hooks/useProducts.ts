import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { 
  fetchProducts, 
  fetchProduct, 
  fetchProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  deleteProductImage,
  setFeaturedProducts,
  setNewProducts
} from '../services/products';
import { Product, ProductCreateData, ProductUpdateData, PaginatedResponse } from '../types/api';

// Chaves de consulta
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: {
    page?: number;
    perPage?: number;
    categoryId?: number;
    search?: string;
    featured?: boolean;
    isNew?: boolean;
  }) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: number | string) => [...productKeys.details(), id] as const,
  slug: (slug: string) => [...productKeys.details(), 'slug', slug] as const,
};

// Hook para buscar produtos paginados
export const useProducts = (
  page: number = 1,
  perPage: number = 12,
  categoryId?: number,
  search?: string,
  featured?: boolean,
  isNew?: boolean,
  options?: UseQueryOptions<PaginatedResponse<Product>>
) => {
  return useQuery({
    queryKey: productKeys.list({ page, perPage, categoryId, search, featured, isNew }),
    queryFn: () => fetchProducts(page, perPage, categoryId, search, featured, isNew),
    ...options,
  });
};

// Hook para buscar um produto por ID
export const useProduct = (id: number | string, options?: UseQueryOptions<Product>) => {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => fetchProduct(id),
    ...options,
  });
};

// Hook para buscar um produto por slug
export const useProductBySlug = (slug: string, options?: UseQueryOptions<Product>) => {
  return useQuery({
    queryKey: productKeys.slug(slug),
    queryFn: () => fetchProductBySlug(slug),
    ...options,
  });
};

// Hook para criar um produto
export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, images }: { data: ProductCreateData; images?: File[] }) => 
      createProduct(data, images),
    onSuccess: () => {
      // Invalidar todas as listas de produtos
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Hook para atualizar um produto
export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ data, images }: { data: ProductUpdateData; images?: File[] }) => 
      updateProduct(data, images),
    onSuccess: (updatedProduct) => {
      // Atualizar o produto no cache
      queryClient.setQueryData(
        productKeys.detail(updatedProduct.id),
        updatedProduct
      );
      
      // Invalidar todas as listas de produtos
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Hook para excluir um produto
export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: (_, id) => {
      // Remover o produto do cache
      queryClient.removeQueries({ queryKey: productKeys.detail(id) });
      
      // Invalidar todas as listas de produtos
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Hook para excluir uma imagem de produto
export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ productId, imageId }: { productId: number; imageId: number }) => 
      deleteProductImage(productId, imageId),
    onSuccess: (_, { productId }) => {
      // Invalidar o produto específico
      queryClient.invalidateQueries({ queryKey: productKeys.detail(productId) });
    },
  });
};

// Hook para definir produtos em destaque
export const useSetFeaturedProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productIds: number[]) => setFeaturedProducts(productIds),
    onSuccess: () => {
      // Invalidar todas as listas de produtos
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};

// Hook para definir produtos como novos
export const useSetNewProducts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (productIds: number[]) => setNewProducts(productIds),
    onSuccess: () => {
      // Invalidar todas as listas de produtos
      queryClient.invalidateQueries({ queryKey: productKeys.lists() });
    },
  });
};
