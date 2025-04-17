import React from 'react';
import { useOptimizedImage, ImageOptimizer } from '../../utils/imageOptimizer';
import styles from '../../styles/OptimizedImage.module.scss';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  sizes?: string;
  lazy?: boolean;
  placeholderColor?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Componente para exibir imagens otimizadas com lazy loading e responsividade
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  sizes = '100vw',
  lazy = true,
  placeholderColor = '#f0f0f0',
  objectFit = 'cover'
}) => {
  const { isLoading, placeholder, aspectRatio } = useOptimizedImage(src, placeholderColor);
  
  // Gerar srcSet para diferentes tamanhos de tela
  const srcSet = ImageOptimizer.generateSrcSet(src);
  
  // Calcular altura se não fornecida mas temos largura e aspect ratio
  const calculatedHeight = (width && aspectRatio) 
    ? ImageOptimizer.calculateHeight(width, aspectRatio) 
    : height;
  
  return (
    <div 
      className={`${styles.imageContainer} ${className}`}
      style={{ 
        width: width ? `${width}px` : '100%',
        height: calculatedHeight ? `${calculatedHeight}px` : 'auto',
        backgroundColor: placeholderColor
      }}
    >
      {isLoading && (
        <div className={styles.placeholder} style={{ backgroundColor: placeholderColor }} />
      )}
      
      <img
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        className={styles.image}
        style={{ objectFit }}
        onLoad={() => {
          // Remover placeholder quando a imagem carregar completamente
          const imgElement = document.querySelector(`.${styles.image}`);
          if (imgElement) {
            imgElement.classList.add(styles.loaded);
          }
        }}
      />
    </div>
  );
};

export default OptimizedImage;
