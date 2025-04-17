import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, Product, ProductVariations } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string, variation?: ProductVariations) => void;
  updateQuantity: (id: string, quantity: number, variation?: ProductVariations) => void;
  clearCart: () => void;
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  applyCoupon: (code: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [shipping, setShipping] = useState(0);
  
  // Carregar carrinho do localStorage ao iniciar
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error('Erro ao carregar carrinho:', error);
      }
    }
  }, []);
  
  // Salvar carrinho no localStorage quando mudar
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
    
    // Calcular frete baseado no valor do carrinho
    if (cartItems.length === 0) {
      setShipping(0);
    } else {
      const subtotalValue = calculateSubtotal();
      setShipping(subtotalValue >= 200 ? 0 : 15.90);
    }
  }, [cartItems]);
  
  // Calcular subtotal
  const calculateSubtotal = (): number => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  // Adicionar item ao carrinho
  const addToCart = (item: CartItem) => {
    setCartItems(prevItems => {
      // Verificar se o item já existe no carrinho (considerando variações)
      const existingItemIndex = prevItems.findIndex(cartItem => 
        cartItem.id === item.id && 
        JSON.stringify(cartItem.variation) === JSON.stringify(item.variation)
      );
      
      if (existingItemIndex !== -1) {
        // Se o item já existe, atualizar a quantidade
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += item.quantity;
        return updatedItems;
      } else {
        // Se o item não existe, adicionar ao carrinho
        return [...prevItems, item];
      }
    });
  };
  
  // Remover item do carrinho
  const removeFromCart = (id: string, variation?: ProductVariations) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === id && JSON.stringify(item.variation) === JSON.stringify(variation))
      )
    );
  };
  
  // Atualizar quantidade de um item
  const updateQuantity = (id: string, quantity: number, variation?: ProductVariations) => {
    if (quantity <= 0) {
      removeFromCart(id, variation);
      return;
    }
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id && JSON.stringify(item.variation) === JSON.stringify(variation)
          ? { ...item, quantity }
          : item
      )
    );
  };
  
  // Limpar carrinho
  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
  };
  
  // Aplicar cupom de desconto
  const applyCoupon = async (code: string): Promise<void> => {
    // Simulação de verificação de cupom
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const subtotalValue = calculateSubtotal();
        
        // Cupons simulados
        if (code === 'BIJU10') {
          setDiscount(subtotalValue * 0.1); // 10% de desconto
          resolve();
        } else if (code === 'BIJU20') {
          setDiscount(subtotalValue * 0.2); // 20% de desconto
          resolve();
        } else if (code === 'FRETE') {
          setShipping(0); // Frete grátis
          resolve();
        } else {
          reject(new Error('Cupom inválido'));
        }
      }, 1000);
    });
  };
  
  // Calcular valores
  const subtotal = calculateSubtotal();
  const total = subtotal + shipping - discount;
  
  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    discount,
    total,
    applyCoupon
  };
  
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
