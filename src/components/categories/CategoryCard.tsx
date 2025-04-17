import { useState } from 'react';
import styles from '../../styles/CategoryCard.module.scss';
import { Link } from 'react-router-dom';

interface CategoryCardProps {
  id: string;
  name: string;
  image: string;
  slug: string;
  productCount: number;
}

const CategoryCard = ({ name, image, slug, productCount }: CategoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link 
      to={`/categoria/${slug}`}
      className={styles.categoryCard}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.categoryImage}>
        <img src={image} alt={name} />
        <div className={`${styles.categoryOverlay} ${isHovered ? styles.hovered : ''}`}>
          <span className={styles.viewCategory}>Ver Categoria</span>
        </div>
      </div>
      <div className={styles.categoryInfo}>
        <h3 className={styles.categoryName}>{name}</h3>
        <span className={styles.productCount}>{productCount} produtos</span>
      </div>
    </Link>
  );
};

export default CategoryCard;
