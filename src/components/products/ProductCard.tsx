import React from 'react';
import { Product } from '../../types';
import OptimizedImage from '../ui/OptimizedImage';
import { useCart } from '../../contexts/CartContext';
import { Link } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaSearch } from 'react-icons/fa';
import styles from '../../styles/ProductCard.module.scss';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, className = '' }) => {
  const { addToCart } = useCart();
  
  // Calcular porcentagem de desconto
  const discountPercentage = product.discount || 
    (product.oldPrice ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100) : 0);
  
  // Adicionar ao carrinho
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  };
  
  return (
    <div className={`${styles.productCard} ${className}`}>
      <Link to={`/produto/${product.slug}`} className={styles.productLink}>
        <div className={styles.imageContainer}>
          <OptimizedImage 
            src={product.image}
            alt={product.name}
            className={styles.productImage}
            lazy={true}
          />
          
          {product.isNew && (
            <span className={`${styles.badge} ${styles.newBadge}`}>Novo</span>
          )}
          
          {discountPercentage > 0 && (
            <span className={`${styles.badge} ${styles.discountBadge}`}>
              -{discountPercentage}%
            </span>
          )}
          
          <div className={styles.productActions}>
            <button 
              className={styles.actionButton}
              onClick={handleAddToCart}
              aria-label="Adicionar ao carrinho"
            >
              <FaShoppingCart />
            </button>
            
            <button 
              className={styles.actionButton}
              aria-label="Adicionar aos favoritos"
            >
              <FaHeart />
            </button>
            
            <Link 
              to={`/produto/${product.slug}`}
              className={styles.actionButton}
              aria-label="Ver detalhes"
            >
              <FaSearch />
            </Link>
          </div>
        </div>
        
        <div className={styles.productInfo}>
          <h3 className={styles.productName}>{product.name}</h3>
          
          <div className={styles.productPrice}>
            {product.oldPrice && (
              <span className={styles.oldPrice}>
                R$ {product.oldPrice.toFixed(2)}
              </span>
            )}
            <span className={styles.price}>
              R$ {product.price.toFixed(2)}
            </span>
          </div>
          
          <div className={styles.productCategory}>
            {product.category}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
