import { useState } from 'react';
import styles from '../../styles/ProductGrid.module.scss';
import ProductCard from './ProductCard';
import { Product } from '../../types';

interface ProductGridProps {
  products: Product[];
  title?: string;
  viewAllLink?: string;
}

const ProductGrid = ({ products, title, viewAllLink }: ProductGridProps) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className={styles.productGridContainer}>
      {title && (
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
          {viewAllLink && (
            <a href={viewAllLink} className={styles.viewAllLink}>
              Ver todos
            </a>
          )}
        </div>
      )}
      
      <div className={styles.viewControls}>
        <button 
          className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
          onClick={() => setViewMode('grid')}
          aria-label="Visualização em grade"
        >
          <span className={styles.gridIcon}></span>
        </button>
        <button 
          className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
          onClick={() => setViewMode('list')}
          aria-label="Visualização em lista"
        >
          <span className={styles.listIcon}></span>
        </button>
      </div>
      
      <div className={`${styles.productGrid} ${viewMode === 'list' ? styles.listView : ''}`}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
