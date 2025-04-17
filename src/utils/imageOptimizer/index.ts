import { useState, useEffect } from 'react';

interface ImageDimensions {
  width: number;
  height: number;
}

/**
 * Utilitário para otimização de imagens
 */
export const ImageOptimizer = {
  /**
   * Gera URLs responsivas para diferentes tamanhos de tela
   * @param imagePath Caminho da imagem original
   * @param sizes Array de larguras para gerar
   * @returns String formatada para o atributo srcSet
   */
  generateSrcSet: (imagePath: string, sizes: number[] = [320, 640, 960, 1280]): string => {
    // Extrair extensão da imagem
    const extension = imagePath.split('.').pop() || 'jpg';
    const basePath = imagePath.substring(0, imagePath.lastIndexOf('.'));
    
    // Gerar srcSet para cada tamanho
    return sizes
      .map(size => `${basePath}-${size}.${extension} ${size}w`)
      .join(', ');
  },
  
  /**
   * Gera atributo sizes para imagens responsivas
   * @param defaultSize Tamanho padrão (ex: 100vw)
   * @param breakpoints Breakpoints específicos
   * @returns String formatada para o atributo sizes
   */
  generateSizes: (
    defaultSize: string = '100vw', 
    breakpoints: Record<string, string> = {}
  ): string => {
    const breakpointEntries = Object.entries(breakpoints);
    
    if (breakpointEntries.length === 0) {
      return defaultSize;
    }
    
    const breakpointSizes = breakpointEntries
      .map(([breakpoint, size]) => `(max-width: ${breakpoint}) ${size}`)
      .join(', ');
    
    return `${breakpointSizes}, ${defaultSize}`;
  },
  
  /**
   * Carrega uma imagem e obtém suas dimensões
   * @param src URL da imagem
   * @returns Promise com as dimensões da imagem
   */
  getImageDimensions: (src: string): Promise<ImageDimensions> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight
        });
      };
      img.onerror = () => {
        reject(new Error(`Falha ao carregar imagem: ${src}`));
      };
      img.src = src;
    });
  },
  
  /**
   * Calcula o aspect ratio de uma imagem
   * @param width Largura da imagem
   * @param height Altura da imagem
   * @returns Aspect ratio (largura / altura)
   */
  calculateAspectRatio: (width: number, height: number): number => {
    return width / height;
  },
  
  /**
   * Calcula a altura proporcional baseada na largura e aspect ratio
   * @param width Largura desejada
   * @param aspectRatio Aspect ratio (largura / altura)
   * @returns Altura proporcional
   */
  calculateHeight: (width: number, aspectRatio: number): number => {
    return Math.round(width / aspectRatio);
  },
  
  /**
   * Gera um placeholder de baixa qualidade para lazy loading
   * @param width Largura do placeholder
   * @param height Altura do placeholder
   * @param color Cor do placeholder (opcional)
   * @returns URL de data URI para o placeholder
   */
  generatePlaceholder: (
    width: number, 
    height: number, 
    color: string = '#f0f0f0'
  ): string => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='${color.replace('#', '%23')}'/%3E%3C/svg%3E`;
  }
};

/**
 * Hook para carregar imagens de forma otimizada
 * @param src URL da imagem
 * @param placeholderColor Cor do placeholder
 * @returns Objeto com estado de carregamento e URL do placeholder
 */
export const useOptimizedImage = (
  src: string, 
  placeholderColor: string = '#f0f0f0'
) => {
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
  const [placeholder, setPlaceholder] = useState<string>('');
  
  useEffect(() => {
    setIsLoading(true);
    
    ImageOptimizer.getImageDimensions(src)
      .then(dims => {
        setDimensions(dims);
        setPlaceholder(ImageOptimizer.generatePlaceholder(
          dims.width, 
          dims.height, 
          placeholderColor
        ));
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Erro ao carregar imagem:', error);
        // Gerar placeholder genérico em caso de erro
        setPlaceholder(ImageOptimizer.generatePlaceholder(300, 300, placeholderColor));
        setIsLoading(false);
      });
  }, [src, placeholderColor]);
  
  return {
    isLoading,
    dimensions,
    placeholder,
    aspectRatio: dimensions 
      ? ImageOptimizer.calculateAspectRatio(dimensions.width, dimensions.height) 
      : null
  };
};

export default ImageOptimizer;
