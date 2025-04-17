import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from '../contexts/CartContext';
import { AuthProvider } from '../contexts/AuthContext';
import OptimizedImage from '../components/ui/OptimizedImage';

// Mock do hook useOptimizedImage
jest.mock('../utils/imageOptimizer', () => ({
  ImageOptimizer: {
    generateSrcSet: jest.fn().mockReturnValue('image-320.jpg 320w, image-640.jpg 640w'),
    generateSizes: jest.fn().mockReturnValue('(max-width: 768px) 100vw, 50vw'),
    getImageDimensions: jest.fn(),
    calculateAspectRatio: jest.fn().mockReturnValue(1.5),
    calculateHeight: jest.fn().mockImplementation((width, aspectRatio) => width / aspectRatio),
    generatePlaceholder: jest.fn().mockReturnValue('data:image/svg+xml,...')
  },
  useOptimizedImage: jest.fn().mockReturnValue({
    isLoading: false,
    dimensions: { width: 800, height: 600 },
    placeholder: 'data:image/svg+xml,...',
    aspectRatio: 1.5
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

describe('OptimizedImage Component', () => {
  test('renderiza corretamente com as propriedades padrão', () => {
    render(
      <OptimizedImage 
        src="/src/assets/images/product-1.jpg"
        alt="Produto 1"
      />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se a imagem está presente com os atributos corretos
    const image = screen.getByAltText('Produto 1');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/src/assets/images/product-1.jpg');
    expect(image).toHaveAttribute('srcSet', 'image-320.jpg 320w, image-640.jpg 640w');
    expect(image).toHaveAttribute('sizes', '(max-width: 768px) 100vw, 50vw');
    expect(image).toHaveAttribute('loading', 'lazy');
  });
  
  test('renderiza com largura e altura específicas', () => {
    render(
      <OptimizedImage 
        src="/src/assets/images/product-1.jpg"
        alt="Produto 1"
        width={400}
        height={300}
      />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se o container tem as dimensões corretas
    const container = screen.getByAltText('Produto 1').parentElement;
    expect(container).toHaveStyle('width: 400px');
    expect(container).toHaveStyle('height: 300px');
  });
  
  test('renderiza com lazy loading desativado quando especificado', () => {
    render(
      <OptimizedImage 
        src="/src/assets/images/product-1.jpg"
        alt="Produto 1"
        lazy={false}
      />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se a imagem tem o atributo loading="eager"
    const image = screen.getByAltText('Produto 1');
    expect(image).toHaveAttribute('loading', 'eager');
  });
  
  test('renderiza com cor de placeholder personalizada', () => {
    // Mock do hook useOptimizedImage para este teste específico
    require('../utils/imageOptimizer').useOptimizedImage.mockReturnValueOnce({
      isLoading: true,
      dimensions: { width: 800, height: 600 },
      placeholder: 'data:image/svg+xml,...',
      aspectRatio: 1.5
    });
    
    render(
      <OptimizedImage 
        src="/src/assets/images/product-1.jpg"
        alt="Produto 1"
        placeholderColor="#ff0000"
      />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se o placeholder tem a cor correta
    const container = screen.getByAltText('Produto 1').parentElement;
    expect(container).toHaveStyle('background-color: #ff0000');
  });
  
  test('renderiza com object-fit personalizado', () => {
    render(
      <OptimizedImage 
        src="/src/assets/images/product-1.jpg"
        alt="Produto 1"
        objectFit="contain"
      />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se a imagem tem o estilo object-fit correto
    const image = screen.getByAltText('Produto 1');
    expect(image).toHaveStyle('object-fit: contain');
  });
  
  test('calcula altura proporcional quando apenas largura é fornecida', () => {
    render(
      <OptimizedImage 
        src="/src/assets/images/product-1.jpg"
        alt="Produto 1"
        width={600}
      />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se a altura foi calculada corretamente (600 / 1.5 = 400)
    const container = screen.getByAltText('Produto 1').parentElement;
    expect(container).toHaveStyle('width: 600px');
    expect(container).toHaveStyle('height: 400px');
  });
  
  test('adiciona classe quando a imagem é carregada', () => {
    render(
      <OptimizedImage 
        src="/src/assets/images/product-1.jpg"
        alt="Produto 1"
      />,
      { wrapper: AllTheProviders }
    );
    
    // Simula o evento onLoad da imagem
    const image = screen.getByAltText('Produto 1');
    fireEvent.load(image);
    
    // Verifica se a classe loaded foi adicionada
    expect(image).toHaveClass('loaded');
  });
});
