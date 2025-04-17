import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import ProductGrid from '../components/products/ProductGrid';
import { ProductProps } from '../components/products/ProductCard';
import styles from '../styles/CategoryPage.module.scss';

interface CategoryData {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
}

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [category, setCategory] = useState<CategoryData | null>(null);
  const [products, setProducts] = useState<ProductProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);

  // Simular carregamento de dados da categoria
  useEffect(() => {
    // Dados simulados para a categoria
    const mockCategories: Record<string, CategoryData> = {
      aneis: {
        id: '1',
        name: 'Anéis',
        description: 'Nossa coleção de anéis combina elegância e sofisticação para todos os estilos.',
        image: '/src/assets/images/category-rings.jpg',
        slug: 'aneis',
      },
      brincos: {
        id: '2',
        name: 'Brincos',
        description: 'Brincos delicados e elegantes para complementar qualquer look.',
        image: '/src/assets/images/category-earrings.jpg',
        slug: 'brincos',
      },
      colares: {
        id: '3',
        name: 'Colares',
        description: 'Colares exclusivos que valorizam sua beleza natural.',
        image: '/src/assets/images/category-necklaces.jpg',
        slug: 'colares',
      },
      pulseiras: {
        id: '4',
        name: 'Pulseiras',
        description: 'Pulseiras sofisticadas para todos os momentos.',
        image: '/src/assets/images/category-bracelets.jpg',
        slug: 'pulseiras',
      },
      bolsas: {
        id: '5',
        name: 'Bolsas',
        description: 'Bolsas elegantes e funcionais para o dia a dia.',
        image: '/src/assets/images/category-bags.jpg',
        slug: 'bolsas',
      },
    };

    // Dados simulados para produtos da categoria
    const mockProducts: ProductProps[] = [
      {
        id: '1',
        name: 'Anel Elegance',
        price: 89.90,
        oldPrice: 129.90,
        image: '/src/assets/images/product1.jpg',
        slug: 'anel-elegance',
        discount: 30,
        category: 'aneis',
      },
      {
        id: '2',
        name: 'Anel Solitário',
        price: 149.90,
        image: '/src/assets/images/product5.jpg',
        slug: 'anel-solitario',
        isNew: true,
        category: 'aneis',
      },
      {
        id: '3',
        name: 'Anel Cristal',
        price: 99.90,
        image: '/src/assets/images/product9.jpg',
        slug: 'anel-cristal',
        category: 'aneis',
      },
      {
        id: '4',
        name: 'Anel Dourado',
        price: 79.90,
        oldPrice: 99.90,
        image: '/src/assets/images/product10.jpg',
        slug: 'anel-dourado',
        discount: 20,
        category: 'aneis',
      },
      {
        id: '5',
        name: 'Brinco Cristal',
        price: 79.90,
        oldPrice: 99.90,
        image: '/src/assets/images/product3.jpg',
        slug: 'brinco-cristal',
        discount: 20,
        category: 'brincos',
      },
      {
        id: '6',
        name: 'Brinco Argola',
        price: 89.90,
        image: '/src/assets/images/product6.jpg',
        slug: 'brinco-argola',
        isNew: true,
        category: 'brincos',
      },
      {
        id: '7',
        name: 'Colar Delicado',
        price: 119.90,
        image: '/src/assets/images/product2.jpg',
        slug: 'colar-delicado',
        category: 'colares',
      },
      {
        id: '8',
        name: 'Colar Pingente',
        price: 129.90,
        image: '/src/assets/images/product7.jpg',
        slug: 'colar-pingente',
        isNew: true,
        category: 'colares',
      },
      {
        id: '9',
        name: 'Pulseira Charm',
        price: 69.90,
        image: '/src/assets/images/product4.jpg',
        slug: 'pulseira-charm',
        category: 'pulseiras',
      },
      {
        id: '10',
        name: 'Pulseira Pérolas',
        price: 99.90,
        image: '/src/assets/images/product8.jpg',
        slug: 'pulseira-perolas',
        isNew: true,
        category: 'pulseiras',
      },
      {
        id: '11',
        name: 'Bolsa Elegante',
        price: 199.90,
        image: '/src/assets/images/product11.jpg',
        slug: 'bolsa-elegante',
        category: 'bolsas',
      },
      {
        id: '12',
        name: 'Bolsa Casual',
        price: 159.90,
        oldPrice: 189.90,
        image: '/src/assets/images/product12.jpg',
        slug: 'bolsa-casual',
        discount: 15,
        category: 'bolsas',
      },
    ];

    // Simular tempo de carregamento
    setTimeout(() => {
      if (slug && mockCategories[slug]) {
        setCategory(mockCategories[slug]);
        
        // Filtrar produtos pela categoria
        const filteredProducts = mockProducts.filter(
          product => product.category === slug
        );
        
        setProducts(filteredProducts);
      }
      setIsLoading(false);
    }, 500);
  }, [slug]);

  // Ordenar produtos
  const sortProducts = (products: ProductProps[], sortBy: string) => {
    const sortedProducts = [...products];
    
    switch (sortBy) {
      case 'price-low':
        return sortedProducts.sort((a, b) => a.price - b.price);
      case 'price-high':
        return sortedProducts.sort((a, b) => b.price - a.price);
      case 'name':
        return sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      case 'discount':
        return sortedProducts.sort((a, b) => {
          const discountA = a.discount || 0;
          const discountB = b.discount || 0;
          return discountB - discountA;
        });
      case 'newest':
      default:
        return sortedProducts.sort((a, b) => (a.isNew ? -1 : 1) - (b.isNew ? -1 : 1));
    }
  };

  // Filtrar produtos por preço
  const filterProductsByPrice = (products: ProductProps[], range: [number, number]) => {
    return products.filter(
      product => product.price >= range[0] && product.price <= range[1]
    );
  };

  // Produtos filtrados e ordenados
  const filteredAndSortedProducts = sortProducts(
    filterProductsByPrice(products, priceRange),
    sortBy
  );

  // Manipular mudança de ordenação
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  // Manipular mudança de faixa de preço
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setPriceRange(prev => {
      if (e.target.name === 'min') {
        return [value, prev[1]];
      } else {
        return [prev[0], value];
      }
    });
  };

  if (isLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (!category) {
    return (
      <div className={styles.notFound}>
        <h2>Categoria não encontrada</h2>
        <Link to="/categorias" className={styles.backLink}>
          <FaArrowLeft /> Voltar para categorias
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.categoryPage}>
      <div className={styles.categoryHeader} style={{ backgroundImage: `url(${category.image})` }}>
        <div className={styles.container}>
          <h1 className={styles.categoryTitle}>{category.name}</h1>
          <p className={styles.categoryDescription}>{category.description}</p>
        </div>
      </div>

      <div className={styles.categoryContent}>
        <div className={styles.container}>
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <label htmlFor="sort-by">Ordenar por:</label>
              <select 
                id="sort-by" 
                value={sortBy} 
                onChange={handleSortChange}
                className={styles.sortSelect}
              >
                <option value="newest">Novidades</option>
                <option value="price-low">Menor Preço</option>
                <option value="price-high">Maior Preço</option>
                <option value="name">Nome (A-Z)</option>
                <option value="discount">Maior Desconto</option>
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Faixa de Preço:</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  name="min"
                  min="0"
                  max={priceRange[1]}
                  value={priceRange[0]}
                  onChange={handlePriceRangeChange}
                  className={styles.priceInput}
                />
                <span>até</span>
                <input
                  type="number"
                  name="max"
                  min={priceRange[0]}
                  max="500"
                  value={priceRange[1]}
                  onChange={handlePriceRangeChange}
                  className={styles.priceInput}
                />
              </div>
            </div>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <ProductGrid products={filteredAndSortedProducts} />
          ) : (
            <div className={styles.noProducts}>
              <p>Nenhum produto encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
