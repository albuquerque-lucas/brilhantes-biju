import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import Banner from '../components/ui/Banner';
import CategoryGrid from '../components/categories/CategoryGrid';
import ProductGrid from '../components/products/ProductGrid';
import { Category, Product } from '../types';
import styles from '../styles/HomePage.module.scss';

// Dados simulados para categorias
const featuredCategories: Category[] = [
  {
    id: '1',
    name: 'Anéis',
    description: 'Anéis elegantes para todas as ocasiões',
    image: '/src/assets/images/category-rings.jpg',
    slug: 'aneis',
    productCount: 24
  },
  {
    id: '2',
    name: 'Brincos',
    description: 'Brincos sofisticados para complementar seu visual',
    image: '/src/assets/images/category-earrings.jpg',
    slug: 'brincos',
    productCount: 36
  },
  {
    id: '3',
    name: 'Colares',
    description: 'Colares delicados e cheios de estilo',
    image: '/src/assets/images/category-necklaces.jpg',
    slug: 'colares',
    productCount: 18
  },
  {
    id: '4',
    name: 'Pulseiras',
    description: 'Pulseiras para todos os estilos',
    image: '/src/assets/images/category-bracelets.jpg',
    slug: 'pulseiras',
    productCount: 15
  },
  {
    id: '5',
    name: 'Bolsas',
    description: 'Bolsas elegantes para completar seu look',
    image: '/src/assets/images/category-bags.jpg',
    slug: 'bolsas',
    productCount: 12
  }
];

// Dados simulados para produtos em destaque
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Anel Solitário Elegance',
    price: 89.90,
    oldPrice: 129.90,
    image: '/src/assets/images/product-ring-1.jpg',
    slug: 'anel-solitario-elegance',
    category: 'aneis',
    isNew: true,
    discount: 30
  },
  {
    id: '2',
    name: 'Brinco Gota Cristal',
    price: 69.90,
    image: '/src/assets/images/product-earring-1.jpg',
    slug: 'brinco-gota-cristal',
    category: 'brincos'
  },
  {
    id: '3',
    name: 'Colar Pingente Coração',
    price: 79.90,
    oldPrice: 99.90,
    image: '/src/assets/images/product-necklace-1.jpg',
    slug: 'colar-pingente-coracao',
    category: 'colares',
    discount: 20
  },
  {
    id: '4',
    name: 'Pulseira Riviera',
    price: 59.90,
    image: '/src/assets/images/product-bracelet-1.jpg',
    slug: 'pulseira-riviera',
    category: 'pulseiras',
    isNew: true
  },
  {
    id: '5',
    name: 'Bolsa Clutch Festa',
    price: 149.90,
    oldPrice: 199.90,
    image: '/src/assets/images/product-bag-1.jpg',
    slug: 'bolsa-clutch-festa',
    category: 'bolsas',
    discount: 25
  },
  {
    id: '6',
    name: 'Anel Aliança Infinity',
    price: 99.90,
    image: '/src/assets/images/product-ring-2.jpg',
    slug: 'anel-alianca-infinity',
    category: 'aneis'
  },
  {
    id: '7',
    name: 'Brinco Argola Dourada',
    price: 49.90,
    oldPrice: 69.90,
    image: '/src/assets/images/product-earring-2.jpg',
    slug: 'brinco-argola-dourada',
    category: 'brincos',
    discount: 28
  },
  {
    id: '8',
    name: 'Colar Choker Pérolas',
    price: 89.90,
    image: '/src/assets/images/product-necklace-2.jpg',
    slug: 'colar-choker-perolas',
    category: 'colares',
    isNew: true
  }
];

// Dados simulados para produtos em promoção
const saleProducts: Product[] = featuredProducts
  .filter(product => product.discount)
  .concat([
    {
      id: '9',
      name: 'Pulseira Charm',
      price: 45.90,
      oldPrice: 79.90,
      image: '/src/assets/images/product-bracelet-2.jpg',
      slug: 'pulseira-charm',
      category: 'pulseiras',
      discount: 42
    },
    {
      id: '10',
      name: 'Bolsa Transversal Mini',
      price: 119.90,
      oldPrice: 169.90,
      image: '/src/assets/images/product-bag-2.jpg',
      slug: 'bolsa-transversal-mini',
      category: 'bolsas',
      discount: 29
    }
  ]);

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleViewAllCategories = () => {
    navigate('/categorias');
  };

  const handleViewAllPromotions = () => {
    navigate('/promocoes');
  };

  return (
    <div className={styles.homePage}>
      <Helmet>
        <title>Brilhante Biju - Bijuterias Elegantes e Sofisticadas</title>
        <meta name="description" content="Descubra bijuterias elegantes e sofisticadas para todos os estilos na Brilhante Biju. Anéis, colares, brincos, pulseiras e bolsas com design exclusivo." />
      </Helmet>

      <Banner 
        title="Nova Coleção Primavera"
        subtitle="Peças exclusivas com design sofisticado"
        buttonText="Conheça Agora"
        buttonLink="/categoria/lancamentos"
        backgroundImage="/src/assets/images/banner-main.jpg"
        slides={[
          {
            id: '1',
            image: '/src/assets/images/banner-slide-1.jpg',
            title: 'Brilhe com Estilo',
            subtitle: 'Descubra nossa nova coleção de bijuterias',
            buttonText: 'Ver Coleção',
            buttonLink: '/categoria/lancamentos',
            length: 3
          },
          {
            id: '2',
            image: '/src/assets/images/banner-slide-2.jpg',
            title: 'Acessórios que Encantam',
            subtitle: 'Peças únicas para cada ocasião',
            buttonText: 'Explorar Agora',
            buttonLink: '/categoria/lancamentos',
            length: 3
          }
        ]}
        autoPlay={true}
      />

      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Categorias</h2>
            <button 
              className={styles.viewAllButton}
              onClick={handleViewAllCategories}
            >
              Ver Todas <FaArrowRight />
            </button>
          </div>

          <CategoryGrid categories={featuredCategories} title='...' />
        </div>
      </section>

      <section className={styles.featuredSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Destaques</h2>
            <button 
              className={styles.viewAllButton}
              onClick={() => navigate('/produtos')}
            >
              Ver Todos <FaArrowRight />
            </button>
          </div>

          <ProductGrid products={featuredProducts} />
        </div>
      </section>

      <section className={styles.bannerSection}>
        <div className={styles.container}>
          <div className={styles.promoBanner}>
            <div className={styles.promoContent}>
              <h2>Ganhe 15% OFF na primeira compra</h2>
              <p>Use o cupom BRILHANTE15 no carrinho</p>
              <button 
                className={styles.promoButton}
                onClick={() => navigate('/produtos')}
              >
                Comprar Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.saleSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Promoções</h2>
            <button 
              className={styles.viewAllButton}
              onClick={handleViewAllPromotions}
            >
              Ver Todas <FaArrowRight />
            </button>
          </div>

          <ProductGrid products={saleProducts} />
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.container}>
          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <i className="fas fa-truck"></i>
              </div>
              <h3>Frete Grátis</h3>
              <p>Para compras acima de R$ 200</p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <i className="fas fa-credit-card"></i>
              </div>
              <h3>Pagamento Seguro</h3>
              <p>Cartão, boleto ou PIX</p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <i className="fas fa-exchange-alt"></i>
              </div>
              <h3>Troca Garantida</h3>
              <p>7 dias para troca ou devolução</p>
            </div>

            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>
                <i className="fas fa-headset"></i>
              </div>
              <h3>Atendimento</h3>
              <p>Suporte por WhatsApp</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
