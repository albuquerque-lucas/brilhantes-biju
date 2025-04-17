import styles from '../../styles/CategoryGrid.module.scss';
import CategoryCard from './CategoryCard';

interface CategoryProps {
  id: string;
  name: string;
  image: string;
  slug: string;
  productCount: number;
}

interface CategoryGridProps {
  categories: CategoryProps[];
  title?: string;
}

const CategoryGrid = ({ categories, title }: CategoryGridProps) => {
  return (
    <div className={styles.categoryGridContainer}>
      {title && (
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{title}</h2>
        </div>
      )}
      
      <div className={styles.categoryGrid}>
        {categories.map((category) => (
          <CategoryCard key={category.id} {...category} />
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
