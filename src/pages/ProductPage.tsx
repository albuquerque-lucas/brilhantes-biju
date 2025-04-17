import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FaShoppingCart, FaHeart, FaShare, FaStar } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import ProductGrid from '../components/products/ProductGrid';
import { ProductProps } from '../components/products/ProductCard';
import styles from '../styles/ProductPage.module.scss';

interface ProductVariation {
  id: string;
  type: 'color' | 'size';
  name: string;
  value: string;
}

interface ProductDetailProps extends ProductProps {
  description: string;
  details: string[];
  variations?: {
    colors?: ProductVariation[];
    sizes?: ProductVariation[];
  };
  relatedProducts?: ProductProps[];
}

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductDetailProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<ProductVariation | null>(null);
  const [selectedSize, setSelectedSize] = useState<ProductVariation | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  // Simular carregamento de dados do produto
  useEffect(() => {
    // Dados simulados para o produto
    const mockProducts: Record<string, ProductDetailProps> = {
      'anel-elegance': {
        id: '1',
        name: 'Anel Elegance',
        price: 89.90,
        oldPrice: 129.90,
        image: '/src/assets/images/product1.jpg',
        slug: 'anel-elegance',
        discount: 30,
        category: 'aneis',
        description: 'Anel banhado a ouro com design elegante e sofisticado, perfeito para ocasiões especiais.',
        details: [
          'Material: Liga metálica banhada a ouro',
          'Acabamento: Polido',
          'Pedra: Zircônia',
          'Garantia: 3 meses contra defeitos de fabricação'
        ],
        variations: {
          sizes: [
            { id: 's1', type: 'size', name: '14', value: '14' },
            { id: 's2', type: 'size', name: '16', value: '16' },
            { id: 's3', type: 'size', name: '18', value: '18' },
            { id: 's4', type: 'size', name: '20', value: '20' },
          ]
        },
        relatedProducts: [
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
          }
        ]
      },
      'colar-delicado': {
        id: '2',
        name: 'Colar Delicado',
        price: 119.90,
        image: '/src/assets/images/product2.jpg',
        slug: 'colar-delicado',
        category: 'colares',
        description: 'Colar delicado banhado a ouro com pingente minimalista, ideal para uso diário.',
        details: [
          'Material: Liga metálica banhada a ouro',
          'Comprimento: 45cm + extensor de 5cm',
          'Acabamento: Polido',
          'Garantia: 3 meses contra defeitos de fabricação'
        ],
        relatedProducts: [
          {
            id: '8',
            name: 'Colar Pingente',
            price: 129.90,
            image: '/src/assets/images/product7.jpg',
            slug: 'colar-pingente',
            isNew: true,
            category: 'colares',
          }
        ]
      },
      'brinco-cristal': {
        id: '5',
        name: 'Brinco Cristal',
        price: 79.90,
        oldPrice: 99.90,
        image: '/src/assets/images/product3.jpg',
        slug: 'brinco-cristal',
        discount: 20,
        category: 'brincos',
        description: 'Brinco com cristais cravejados, elegante e sofisticado para ocasiões especiais.',
        details: [
          'Material: Liga metálica banhada a ródio',
          'Pedras: Cristais',
          'Acabamento: Polido',
          'Garantia: 3 meses contra defeitos de fabricação'
        ],
        variations: {
          colors: [
            { id: 'c1', type: 'color', name: 'Prata', value: '#C0C0C0' },
            { id: 'c2', type: 'color', name: 'Dourado', value: '#FFD700' },
            { id: 'c3', type: 'color', name: 'Rosé', value: '#B76E79' },
          ]
        },
        relatedProducts: [
          {
            id: '6',
            name: 'Brinco Argola',
            price: 89.90,
            image: '/src/assets/images/product6.jpg',
            slug: 'brinco-argola',
            isNew: true,
            category: 'brincos',
          }
        ]
      }
    };

    // Simular tempo de carregamento
    setTimeout(() => {
      if (slug && mockProducts[slug]) {
        setProduct(mockProducts[slug]);
        
        // Inicializar variações se existirem
        if (mockProducts[slug].variations?.colors?.length) {
          setSelectedColor(mockProducts[slug].variations.colors[0]);
        }
        
        if (mockProducts[slug].variations?.sizes?.length) {
          setSelectedSize(mockProducts[slug].variations.sizes[0]);
        }
      }
      setIsLoading(false);
    }, 500);
  }, [slug]);

  // Manipular mudança de quantidade
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  // Incrementar quantidade
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  // Decrementar quantidade
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Adicionar ao carrinho
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      variation: {
        color: selectedColor || undefined,
        size: selectedSize || undefined
      }
    });
  };

  if (isLoading) {
    return <div className={styles.loading}>Carregando...</div>;
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Produto não encontrado</h2>
        <Link to="/" className={styles.backLink}>
          Voltar para a página inicial
        </Link>
      </div>
    );
  }

  // Simular múltiplas imagens do produto
  const productImages = [
    product.image,
    product.image.replace('.jpg', '-2.jpg'),
    product.image.replace('.jpg', '-3.jpg'),
  ];

  return (
    <div className={styles.productPage}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link to="/">Home</Link> &gt; 
          <Link to={`/categoria/${product.category}`}>{product.category}</Link> &gt; 
          <span>{product.name}</span>
        </div>

        <div className={styles.productContent}>
          <div className={styles.productGallery}>
            <div className={styles.mainImage}>
              <img src={productImages[activeImage]} alt={product.name} />
              {product.discount && (
                <span className={styles.discountBadge}>-{product.discount}%</span>
              )}
              {product.isNew && (
                <span className={styles.newBadge}>Novo</span>
              )}
            </div>
            <div className={styles.thumbnails}>
              {productImages.map((image, index) => (
                <div 
                  key={index}
                  className={`${styles.thumbnail} ${index === activeImage ? styles.active : ''}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image} alt={`${product.name} - Imagem ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          <div className={styles.productDetails}>
            <h1 className={styles.productName}>{product.name}</h1>
            
            <div className={styles.productRating}>
              <div className={styles.stars}>
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar />
                <FaStar className={styles.starHalf} />
              </div>
              <span className={styles.reviewCount}>(12 avaliações)</span>
            </div>
            
            <div className={styles.productPrice}>
              {product.oldPrice && (
                <span className={styles.oldPrice}>R$ {product.oldPrice.toFixed(2)}</span>
              )}
              <span className={styles.price}>R$ {product.price.toFixed(2)}</span>
              <span className={styles.installments}>
                ou 3x de R$ {(product.price / 3).toFixed(2)} sem juros
              </span>
            </div>
            
            <p className={styles.productDescription}>{product.description}</p>
            
            {product.variations?.colors && (
              <div className={styles.variationSelector}>
                <h3>Cor:</h3>
                <div className={styles.colorOptions}>
                  {product.variations.colors.map(color => (
                    <button
                      key={color.id}
                      className={`${styles.colorOption} ${selectedColor?.id === color.id ? styles.selected : ''}`}
                      style={{ backgroundColor: color.value }}
                      onClick={() => setSelectedColor(color)}
                      aria-label={`Cor ${color.name}`}
                      title={color.name}
                    />
                  ))}
                </div>
                {selectedColor && (
                  <span className={styles.selectedVariation}>Cor selecionada: {selectedColor.name}</span>
                )}
              </div>
            )}
            
            {product.variations?.sizes && (
              <div className={styles.variationSelector}>
                <h3>Tamanho:</h3>
                <div className={styles.sizeOptions}>
                  {product.variations.sizes.map(size => (
                    <button
                      key={size.id}
                      className={`${styles.sizeOption} ${selectedSize?.id === size.id ? styles.selected : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
                {selectedSize && (
                  <span className={styles.selectedVariation}>Tamanho selecionado: {selectedSize.name}</span>
                )}
              </div>
            )}
            
            <div className={styles.quantitySelector}>
              <h3>Quantidade:</h3>
              <div className={styles.quantityControls}>
                <button 
                  className={styles.quantityButton} 
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className={styles.quantityInput}
                />
                <button 
                  className={styles.quantityButton} 
                  onClick={incrementQuantity}
                >
                  +
                </button>
              </div>
            </div>
            
            <div className={styles.productActions}>
              <button 
                className={styles.addToCartButton}
                onClick={handleAddToCart}
              >
                <FaShoppingCart /> Adicionar ao Carrinho
              </button>
              <button className={styles.wishlistButton}>
                <FaHeart /> Favoritar
              </button>
              <button className={styles.shareButton}>
                <FaShare /> Compartilhar
              </button>
            </div>
          </div>
        </div>

        <div className={styles.productTabs}>
          <div className={styles.tabsHeader}>
            <button className={`${styles.tabButton} ${styles.active}`}>
              Detalhes
            </button>
            <button className={styles.tabButton}>
              Avaliações
            </button>
            <button className={styles.tabButton}>
              Entrega
            </button>
          </div>
          
          <div className={styles.tabContent}>
            <h3>Detalhes do Produto</h3>
            <ul className={styles.productDetailsList}>
              {product.details.map((detail, index) => (
                <li key={index}>{detail}</li>
              ))}
            </ul>
          </div>
        </div>

        {product.relatedProducts && (
          <div className={styles.relatedProducts}>
            <h2>Produtos Relacionados</h2>
            <ProductGrid products={product.relatedProducts} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
