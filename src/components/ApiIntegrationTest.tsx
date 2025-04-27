import React from 'react';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useCart } from '../hooks/useCart';

// Componente de exemplo para demonstrar o uso dos hooks
const ApiIntegrationTest: React.FC = () => {
  // Buscar produtos
  const { 
    data: productsData, 
    isLoading: productsLoading, 
    error: productsError 
  } = useProducts(1, 10);

  // Buscar categorias
  const { 
    data: categoriesData, 
    isLoading: categoriesLoading, 
    error: categoriesError 
  } = useCategories(1, 10);

  // Buscar carrinho
  const { 
    data: cartData, 
    isLoading: cartLoading, 
    error: cartError 
  } = useCart();

  if (productsLoading || categoriesLoading || cartLoading) {
    return <div>Carregando dados...</div>;
  }

  if (productsError || categoriesError || cartError) {
    return <div>Erro ao carregar dados. Por favor, tente novamente.</div>;
  }

  return (
    <div>
      <h1>Teste de Integração da API</h1>
      
      <h2>Produtos ({productsData?.meta.total || 0})</h2>
      <ul>
        {productsData?.data.map(product => (
          <li key={product.id}>{product.name} - R$ {product.price.toFixed(2)}</li>
        ))}
      </ul>
      
      <h2>Categorias ({categoriesData?.meta.total || 0})</h2>
      <ul>
        {categoriesData?.data.map(category => (
          <li key={category.id}>{category.name}</li>
        ))}
      </ul>
      
      <h2>Carrinho ({cartData?.items.length || 0} itens)</h2>
      <ul>
        {cartData?.items.map(item => (
          <li key={item.id}>
            {item.product.name} - {item.quantity} x R$ {item.product.price.toFixed(2)}
          </li>
        ))}
      </ul>
      {cartData?.items.length ? (
        <p>Total: R$ {cartData.total.toFixed(2)}</p>
      ) : (
        <p>Seu carrinho está vazio</p>
      )}
    </div>
  );
};

export default ApiIntegrationTest;
