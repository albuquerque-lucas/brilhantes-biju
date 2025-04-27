import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useCart, useAddToCart, useRemoveFromCart } from '../hooks/useCart';
import { useOrders, useCreateOrder } from '../hooks/useOrders';

// Exemplo de componente que utiliza os hooks de autenticação
const AuthExample: React.FC = () => {
  const { data: user, isLoading } = useAuth.useCurrentUser();
  const login = useAuth.useLogin();
  const logout = useAuth.useLogout();

  const handleLogin = () => {
    login.mutate({ email: 'usuario@exemplo.com', password: 'senha123' });
  };

  const handleLogout = () => {
    logout.mutate();
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div>
      {user ? (
        <div>
          <h2>Bem-vindo, {user.name}!</h2>
          <button onClick={handleLogout}>Sair</button>
        </div>
      ) : (
        <div>
          <h2>Faça login para continuar</h2>
          <button onClick={handleLogin}>Entrar</button>
        </div>
      )}
    </div>
  );
};

// Exemplo de componente que utiliza os hooks de produtos
const ProductsExample: React.FC = () => {
  const { data, isLoading, error } = useProducts(1, 10);
  
  if (isLoading) return <div>Carregando produtos...</div>;
  if (error) return <div>Erro ao carregar produtos</div>;
  
  return (
    <div>
      <h2>Produtos</h2>
      <ul>
        {data?.data.map(product => (
          <li key={product.id}>{product.name} - R$ {product.price.toFixed(2)}</li>
        ))}
      </ul>
    </div>
  );
};

// Exemplo de componente que utiliza os hooks de carrinho
const CartExample: React.FC = () => {
  const { data: cart, isLoading } = useCart();
  const addToCart = useAddToCart();
  const removeFromCart = useRemoveFromCart();
  
  const handleAddToCart = (productId: number) => {
    addToCart.mutate({ product_id: productId, quantity: 1 });
  };
  
  const handleRemoveFromCart = (itemId: number) => {
    removeFromCart.mutate(itemId);
  };
  
  if (isLoading) return <div>Carregando carrinho...</div>;
  
  return (
    <div>
      <h2>Carrinho ({cart?.items.length || 0} itens)</h2>
      {cart?.items.length === 0 ? (
        <p>Seu carrinho está vazio</p>
      ) : (
        <>
          <ul>
            {cart?.items.map(item => (
              <li key={item.id}>
                {item.product.name} - {item.quantity} x R$ {item.product.price.toFixed(2)}
                <button onClick={() => handleRemoveFromCart(item.id)}>Remover</button>
              </li>
            ))}
          </ul>
          <p>Total: R$ {cart?.total.toFixed(2)}</p>
        </>
      )}
      
      <button onClick={() => handleAddToCart(1)}>Adicionar Produto (ID: 1)</button>
    </div>
  );
};

// Exemplo de componente que utiliza os hooks de checkout
const CheckoutExample: React.FC = () => {
  const { data: cart } = useCart();
  const createOrder = useCreateOrder();
  
  const handleCheckout = () => {
    if (!cart) return;
    
    const checkoutData = {
      payment_method: 'credit_card',
      shipping_address_id: 1,
      items: cart.items.map(item => ({
        product_id: item.product_id,
        quantity: item.quantity
      })),
      payment_details: {
        card_number: '4111111111111111',
        card_holder_name: 'USUARIO TESTE',
        card_expiry_month: '12',
        card_expiry_year: '2025',
        card_cvv: '123'
      }
    };
    
    createOrder.mutate(checkoutData);
  };
  
  return (
    <div>
      <h2>Checkout</h2>
      <button 
        onClick={handleCheckout} 
        disabled={!cart || cart.items.length === 0}
      >
        Finalizar Compra
      </button>
      {createOrder.isLoading && <p>Processando pedido...</p>}
      {createOrder.isSuccess && <p>Pedido realizado com sucesso!</p>}
      {createOrder.isError && <p>Erro ao processar pedido</p>}
    </div>
  );
};

export { AuthExample, ProductsExample, CartExample, CheckoutExample };
