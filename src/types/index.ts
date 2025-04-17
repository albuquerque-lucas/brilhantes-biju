// Tipos para produtos
export interface ProductVariation {
  id: string;
  type: 'color' | 'size';
  name: string;
  value: string;
}

export interface ProductVariations {
  color?: ProductVariation;
  size?: ProductVariation;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  slug: string;
  category: string;
  isNew?: boolean;
  discount?: number;
  description?: string;
  details?: string[];
  variations?: {
    colors?: ProductVariation[];
    sizes?: ProductVariation[];
  };
  stock?: number;
}

// Tipos para carrinho
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  variation?: ProductVariations;
}

// Tipos para usuário e autenticação
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
}

export interface Address {
  id: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

export interface UserProfile extends User {
  addresses: Address[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Tipos para pedidos
export interface OrderItem extends CartItem {
  subtotal: number;
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BOLETO = 'boleto',
  PIX = 'pix'
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELED = 'canceled'
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  shippingAddress: Address;
  createdAt: Date;
  updatedAt: Date;
}

// Tipos para categorias
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  slug: string;
  productCount?: number;
}

// Tipos para PagSeguro
export interface CreditCardData {
  number: string;
  name: string;
  expirationMonth: string;
  expirationYear: string;
  securityCode: string;
  installments: number;
}

export interface PagSeguroPaymentRequest {
  paymentMethod: PaymentMethod;
  creditCard?: CreditCardData;
  orderId: string;
  amount: number;
  customerInfo: {
    name: string;
    email: string;
    taxId: string; // CPF
    phone: string;
  };
}

export interface PagSeguroPaymentResponse {
  success: boolean;
  transactionId?: string;
  status?: string;
  paymentUrl?: string; // Para boleto ou PIX
  errorMessage?: string;
}
