import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import ProductCard from '../components/products/ProductCard';

// Mock do produto para testes
const mockProduct = {
  id: '1',
  name: 'Anel Solitário Elegance',
  price: 89.90,
  oldPrice: 129.90,
  image: '/src/assets/images/product-ring-1.jpg',
  slug: 'anel-solitario-elegance',
  category: 'aneis',
  isNew: true,
  discount: 30
};

// Wrapper para prover os contextos necessários
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('ProductCard Component', () => {
  test('renderiza corretamente com as informações do produto', () => {
    render(
      <ProductCard product={mockProduct} />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se o nome do produto está presente
    expect(screen.getByText('Anel Solitário Elegance')).toBeInTheDocument();
    
    // Verifica se o preço está formatado corretamente
    expect(screen.getByText('R$ 89.90')).toBeInTheDocument();
    
    // Verifica se o preço antigo está presente
    expect(screen.getByText('R$ 129.90')).toBeInTheDocument();
    
    // Verifica se a badge de novo está presente
    expect(screen.getByText('Novo')).toBeInTheDocument();
    
    // Verifica se a badge de desconto está presente
    expect(screen.getByText('-30%')).toBeInTheDocument();
  });
  
  test('adiciona produto ao carrinho quando o botão é clicado', () => {
    // Mock da função addToCart do contexto
    const addToCartMock = jest.fn();
    
    // Sobrescreve o hook useCart para usar o mock
    jest.mock('../contexts/CartContext', () => ({
      ...jest.requireActual('../contexts/CartContext'),
      useCart: () => ({
        addToCart: addToCartMock,
        cartItems: [],
        total: 0,
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn()
      })
    }));
    
    render(
      <ProductCard product={mockProduct} />,
      { wrapper: AllTheProviders }
    );
    
    // Encontra o botão de adicionar ao carrinho e clica nele
    const addToCartButton = screen.getByLabelText('Adicionar ao carrinho');
    fireEvent.click(addToCartButton);
    
    // Verifica se a função addToCart foi chamada com os parâmetros corretos
    expect(addToCartMock).toHaveBeenCalledWith({
      id: '1',
      name: 'Anel Solitário Elegance',
      price: 89.90,
      image: '/src/assets/images/product-ring-1.jpg',
      quantity: 1
    });
  });
  
  test('renderiza corretamente em diferentes tamanhos de tela', () => {
    // Testa em tela grande (desktop)
    window.innerWidth = 1200;
    window.dispatchEvent(new Event('resize'));
    
    const { rerender } = render(
      <ProductCard product={mockProduct} />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se o componente está renderizado corretamente em desktop
    expect(screen.getByText('Anel Solitário Elegance')).toBeInTheDocument();
    
    // Testa em tela média (tablet)
    window.innerWidth = 768;
    window.dispatchEvent(new Event('resize'));
    
    rerender(
      <ProductCard product={mockProduct} />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se o componente está renderizado corretamente em tablet
    expect(screen.getByText('Anel Solitário Elegance')).toBeInTheDocument();
    
    // Testa em tela pequena (mobile)
    window.innerWidth = 375;
    window.dispatchEvent(new Event('resize'));
    
    rerender(
      <ProductCard product={mockProduct} />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se o componente está renderizado corretamente em mobile
    expect(screen.getByText('Anel Solitário Elegance')).toBeInTheDocument();
  });
});
