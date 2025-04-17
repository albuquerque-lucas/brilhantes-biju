import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import App from '../App';

// Mock dos componentes principais para evitar renderização completa
jest.mock('../AppRoutes', () => () => <div data-testid="app-routes">App Routes Mock</div>);

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

describe('App Component', () => {
  test('renderiza corretamente com os providers', () => {
    render(
      <App />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se o componente AppRoutes está sendo renderizado
    expect(screen.getByTestId('app-routes')).toBeInTheDocument();
  });
});
