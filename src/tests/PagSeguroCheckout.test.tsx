import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import PagSeguroCheckout from '../components/checkout/PagSeguroCheckout';

// Mock do serviço PagSeguro
jest.mock('../services/PagSeguroService', () => ({
  processPayment: jest.fn().mockImplementation((paymentData) => {
    if (paymentData.cardNumber === '4111111111111111') {
      return Promise.resolve({
        success: true,
        transactionId: 'CARD_123456789',
        status: 'approved',
        message: 'Pagamento aprovado com sucesso'
      });
    } else if (paymentData.method === 'boleto') {
      return Promise.resolve({
        success: true,
        transactionId: 'BOL_123456789',
        status: 'pending',
        message: 'Boleto gerado com sucesso',
        paymentUrl: 'https://example.com/boleto'
      });
    } else if (paymentData.method === 'pix') {
      return Promise.resolve({
        success: true,
        transactionId: 'PIX_123456789',
        status: 'pending',
        message: 'PIX gerado com sucesso',
        paymentUrl: 'https://example.com/pix'
      });
    } else {
      return Promise.reject({
        success: false,
        message: 'Erro ao processar pagamento'
      });
    }
  })
}));

// Mock do contexto do carrinho
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

jest.mock('../contexts/CartContext', () => ({
  ...jest.requireActual('../contexts/CartContext'),
  useCart: () => ({
    cartItems: mockCartItems,
    total: 229.70, // 89.90 + (69.90 * 2)
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

describe('PagSeguroCheckout Component', () => {
  // Mock das funções de callback
  const onPaymentCompleteMock = jest.fn();
  const onPaymentErrorMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza corretamente com as opções de pagamento', () => {
    render(
      <PagSeguroCheckout 
        onPaymentComplete={onPaymentCompleteMock}
        onPaymentError={onPaymentErrorMock}
      />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se as opções de pagamento estão presentes
    expect(screen.getByText('Cartão de Crédito')).toBeInTheDocument();
    expect(screen.getByText('Boleto')).toBeInTheDocument();
    expect(screen.getByText('PIX')).toBeInTheDocument();
    
    // Verifica se o resumo do pedido está presente
    expect(screen.getByText('Resumo do Pedido')).toBeInTheDocument();
    expect(screen.getByText('Total:')).toBeInTheDocument();
    expect(screen.getByText('R$ 229,70')).toBeInTheDocument();
  });
  
  test('processa pagamento com cartão de crédito com sucesso', async () => {
    render(
      <PagSeguroCheckout 
        onPaymentComplete={onPaymentCompleteMock}
        onPaymentError={onPaymentErrorMock}
      />,
      { wrapper: AllTheProviders }
    );
    
    // Seleciona a opção de cartão de crédito
    fireEvent.click(screen.getByText('Cartão de Crédito'));
    
    // Preenche o formulário de cartão de crédito
    fireEvent.change(screen.getByLabelText('Número do Cartão'), {
      target: { value: '4111111111111111' }
    });
    
    fireEvent.change(screen.getByLabelText('Nome no Cartão'), {
      target: { value: 'João Silva' }
    });
    
    fireEvent.change(screen.getByLabelText('Validade'), {
      target: { value: '12/25' }
    });
    
    fireEvent.change(screen.getByLabelText('CVV'), {
      target: { value: '123' }
    });
    
    fireEvent.change(screen.getByLabelText('Parcelas'), {
      target: { value: '1' }
    });
    
    // Clica no botão de finalizar pagamento
    fireEvent.click(screen.getByText('Finalizar Pagamento'));
    
    // Aguarda a resolução da Promise
    await waitFor(() => {
      // Verifica se a função onPaymentComplete foi chamada com os parâmetros corretos
      expect(onPaymentCompleteMock).toHaveBeenCalledWith({
        success: true,
        transactionId: 'CARD_123456789',
        status: 'approved',
        message: 'Pagamento aprovado com sucesso'
      });
    });
  });
  
  test('processa pagamento com boleto com sucesso', async () => {
    render(
      <PagSeguroCheckout 
        onPaymentComplete={onPaymentCompleteMock}
        onPaymentError={onPaymentErrorMock}
      />,
      { wrapper: AllTheProviders }
    );
    
    // Seleciona a opção de boleto
    fireEvent.click(screen.getByText('Boleto'));
    
    // Clica no botão de finalizar pagamento
    fireEvent.click(screen.getByText('Gerar Boleto'));
    
    // Aguarda a resolução da Promise
    await waitFor(() => {
      // Verifica se a função onPaymentComplete foi chamada com os parâmetros corretos
      expect(onPaymentCompleteMock).toHaveBeenCalledWith({
        success: true,
        transactionId: 'BOL_123456789',
        status: 'pending',
        message: 'Boleto gerado com sucesso',
        paymentUrl: 'https://example.com/boleto'
      });
    });
  });
  
  test('processa pagamento com PIX com sucesso', async () => {
    render(
      <PagSeguroCheckout 
        onPaymentComplete={onPaymentCompleteMock}
        onPaymentError={onPaymentErrorMock}
      />,
      { wrapper: AllTheProviders }
    );
    
    // Seleciona a opção de PIX
    fireEvent.click(screen.getByText('PIX'));
    
    // Clica no botão de finalizar pagamento
    fireEvent.click(screen.getByText('Gerar QR Code PIX'));
    
    // Aguarda a resolução da Promise
    await waitFor(() => {
      // Verifica se a função onPaymentComplete foi chamada com os parâmetros corretos
      expect(onPaymentCompleteMock).toHaveBeenCalledWith({
        success: true,
        transactionId: 'PIX_123456789',
        status: 'pending',
        message: 'PIX gerado com sucesso',
        paymentUrl: 'https://example.com/pix'
      });
    });
  });
  
  test('exibe erro quando o pagamento falha', async () => {
    render(
      <PagSeguroCheckout 
        onPaymentComplete={onPaymentCompleteMock}
        onPaymentError={onPaymentErrorMock}
      />,
      { wrapper: AllTheProviders }
    );
    
    // Seleciona a opção de cartão de crédito
    fireEvent.click(screen.getByText('Cartão de Crédito'));
    
    // Preenche o formulário de cartão de crédito com um número inválido
    fireEvent.change(screen.getByLabelText('Número do Cartão'), {
      target: { value: '1111111111111111' } // Número inválido
    });
    
    fireEvent.change(screen.getByLabelText('Nome no Cartão'), {
      target: { value: 'João Silva' }
    });
    
    fireEvent.change(screen.getByLabelText('Validade'), {
      target: { value: '12/25' }
    });
    
    fireEvent.change(screen.getByLabelText('CVV'), {
      target: { value: '123' }
    });
    
    fireEvent.change(screen.getByLabelText('Parcelas'), {
      target: { value: '1' }
    });
    
    // Clica no botão de finalizar pagamento
    fireEvent.click(screen.getByText('Finalizar Pagamento'));
    
    // Aguarda a resolução da Promise
    await waitFor(() => {
      // Verifica se a função onPaymentError foi chamada
      expect(onPaymentErrorMock).toHaveBeenCalledWith('Erro ao processar pagamento');
    });
  });
  
  test('valida campos do formulário de cartão de crédito', () => {
    render(
      <PagSeguroCheckout 
        onPaymentComplete={onPaymentCompleteMock}
        onPaymentError={onPaymentErrorMock}
      />,
      { wrapper: AllTheProviders }
    );
    
    // Seleciona a opção de cartão de crédito
    fireEvent.click(screen.getByText('Cartão de Crédito'));
    
    // Clica no botão de finalizar pagamento sem preencher o formulário
    fireEvent.click(screen.getByText('Finalizar Pagamento'));
    
    // Verifica se as mensagens de erro são exibidas
    expect(screen.getByText('Número do cartão é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Nome no cartão é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Validade é obrigatória')).toBeInTheDocument();
    expect(screen.getByText('CVV é obrigatório')).toBeInTheDocument();
  });
});
