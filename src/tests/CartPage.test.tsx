import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import CartPage from '../pages/CartPage';

// Mock dos itens do carrinho para testes
const mockCartItems = [
  {
    id: '1',
    name: 'Anel Solitário Elegance',
    price: 89.90,
    image: '/src/assets/images/product-ring-1.jpg',
    quantity: 1
  },
  {
    id: '2',
    name: 'Brinco Gota Cristal',
    price: 69.90,
    image: '/src/assets/images/product-earring-1.jpg',
    quantity: 2
  }
];

// Mock do contexto do carrinho
jest.mock('../contexts/CartContext', () => ({
  ...jest.requireActual('../contexts/CartContext'),
  useCart: () => ({
    cartItems: mockCartItems,
    total: 229.70, // 89.90 + (69.90 * 2)
    removeFromCart: jest.fn(),
    updateQuantity: jest.fn(),
    clearCart: jest.fn()
  })
}));

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

describe('CartPage Component', () => {
  test('renderiza corretamente com os itens do carrinho', () => {
    render(
      <CartPage />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se o título da página está presente
    expect(screen.getByText('Meu Carrinho')).toBeInTheDocument();
    
    // Verifica se os itens do carrinho estão presentes
    expect(screen.getByText('Anel Solitário Elegance')).toBeInTheDocument();
    expect(screen.getByText('Brinco Gota Cristal')).toBeInTheDocument();
    
    // Verifica se as quantidades estão corretas
    expect(screen.getByText('1')).toBeInTheDocument(); // Quantidade do anel
    expect(screen.getByText('2')).toBeInTheDocument(); // Quantidade do brinco
    
    // Verifica se os preços estão formatados corretamente
    expect(screen.getByText('R$ 89,90')).toBeInTheDocument();
    expect(screen.getByText('R$ 139,80')).toBeInTheDocument(); // 69.90 * 2
    
    // Verifica se o total está correto
    expect(screen.getByText('R$ 229,70')).toBeInTheDocument();
  });
  
  test('exibe mensagem quando o carrinho está vazio', () => {
    // Sobrescreve o mock para simular carrinho vazio
    jest.mock('../contexts/CartContext', () => ({
      ...jest.requireActual('../contexts/CartContext'),
      useCart: () => ({
        cartItems: [],
        total: 0,
        removeFromCart: jest.fn(),
        updateQuantity: jest.fn(),
        clearCart: jest.fn()
      })
    }));
    
    render(
      <CartPage />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se a mensagem de carrinho vazio está presente
    expect(screen.getByText('Seu carrinho está vazio')).toBeInTheDocument();
    
    // Verifica se o botão para continuar comprando está presente
    expect(screen.getByText('Continuar Comprando')).toBeInTheDocument();
  });
  
  test('atualiza quantidade quando os botões são clicados', () => {
    const updateQuantityMock = jest.fn();
    
    // Sobrescreve o mock para usar a função mock
    jest.mock('../contexts/CartContext', () => ({
      ...jest.requireActual('../contexts/CartContext'),
      useCart: () => ({
        cartItems: mockCartItems,
        total: 229.70,
        removeFromCart: jest.fn(),
        updateQuantity: updateQuantityMock,
        clearCart: jest.fn()
      })
    }));
    
    render(
      <CartPage />,
      { wrapper: AllTheProviders }
    );
    
    // Encontra os botões de incremento e decremento
    const incrementButton = screen.getAllByLabelText('Aumentar quantidade')[0];
    const decrementButton = screen.getAllByLabelText('Diminuir quantidade')[0];
    
    // Clica no botão de incremento
    fireEvent.click(incrementButton);
    
    // Verifica se a função updateQuantity foi chamada com os parâmetros corretos
    expect(updateQuantityMock).toHaveBeenCalledWith('1', 2);
    
    // Clica no botão de decremento
    fireEvent.click(decrementButton);
    
    // Verifica se a função updateQuantity foi chamada com os parâmetros corretos
    expect(updateQuantityMock).toHaveBeenCalledWith('1', 0);
  });
  
  test('remove item quando o botão de remover é clicado', () => {
    const removeFromCartMock = jest.fn();
    
    // Sobrescreve o mock para usar a função mock
    jest.mock('../contexts/CartContext', () => ({
      ...jest.requireActual('../contexts/CartContext'),
      useCart: () => ({
        cartItems: mockCartItems,
        total: 229.70,
        removeFromCart: removeFromCartMock,
        updateQuantity: jest.fn(),
        clearCart: jest.fn()
      })
    }));
    
    render(
      <CartPage />,
      { wrapper: AllTheProviders }
    );
    
    // Encontra o botão de remover
    const removeButton = screen.getAllByLabelText('Remover item')[0];
    
    // Clica no botão de remover
    fireEvent.click(removeButton);
    
    // Verifica se a função removeFromCart foi chamada com os parâmetros corretos
    expect(removeFromCartMock).toHaveBeenCalledWith('1');
  });
  
  test('navega para checkout quando o botão de finalizar compra é clicado', () => {
    const navigateMock = jest.fn();
    
    // Mock do hook useNavigate
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => navigateMock
    }));
    
    render(
      <CartPage />,
      { wrapper: AllTheProviders }
    );
    
    // Encontra o botão de finalizar compra
    const checkoutButton = screen.getByText('Finalizar Compra');
    
    // Clica no botão de finalizar compra
    fireEvent.click(checkoutButton);
    
    // Verifica se a função navigate foi chamada com o parâmetro correto
    expect(navigateMock).toHaveBeenCalledWith('/checkout');
  });
});
