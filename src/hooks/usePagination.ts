import { useState, useEffect } from 'react';

/**
 * Hook personalizado para gerenciar paginação
 * @param totalItems Total de itens a serem paginados
 * @param itemsPerPage Quantidade de itens por página
 * @param initialPage Página inicial (começa em 1)
 * @returns Objeto com informações e controles de paginação
 */
function usePagination(totalItems: number, itemsPerPage: number = 10, initialPage: number = 1) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(itemsPerPage);
  
  // Recalcular quando totalItems ou pageSize mudar
  useEffect(() => {
    // Se a página atual for maior que o total de páginas, voltar para a última página
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalItems, pageSize]);
  
  // Calcular total de páginas
  const totalPages = Math.ceil(totalItems / pageSize);
  
  // Calcular índices de início e fim para a página atual
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
  
  // Ir para página específica
  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };
  
  // Ir para próxima página
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Ir para página anterior
  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Ir para primeira página
  const firstPage = () => {
    setCurrentPage(1);
  };
  
  // Ir para última página
  const lastPage = () => {
    setCurrentPage(totalPages);
  };
  
  // Alterar tamanho da página
  const changePageSize = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Voltar para primeira página ao mudar o tamanho
  };
  
  // Gerar array com números de página para navegação
  const getPageNumbers = (maxPageButtons: number = 5): number[] => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calcular páginas a serem exibidas
    const halfButtons = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(currentPage - halfButtons, 1);
    let endPage = startPage + maxPageButtons - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageButtons + 1, 1);
    }
    
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };
  
  return {
    currentPage,
    pageSize,
    totalPages,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    changePageSize,
    getPageNumbers,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1
  };
}

export default usePagination;
