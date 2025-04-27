// Tipos básicos para a API

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Tipos para autenticação
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

// Tipos para produtos
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  old_price?: number;
  stock: number;
  category_id: number;
  is_featured: boolean;
  is_new: boolean;
  discount?: number;
  images: ProductImage[];
  category?: Category;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_path: string;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductCreateData {
  name: string;
  description: string;
  price: number;
  old_price?: number;
  stock: number;
  category_id: number;
  is_featured?: boolean;
  is_new?: boolean;
}

export interface ProductUpdateData extends Partial<ProductCreateData> {
  id: number;
}

// Tipos para categorias
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image_path?: string;
  parent_id?: number;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface CategoryCreateData {
  name: string;
  description?: string;
  parent_id?: number;
  image?: File;
}

export interface CategoryUpdateData extends Partial<CategoryCreateData> {
  id: number;
}

// Tipos para carrinho
export interface CartItem {
  id: number;
  product_id: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
  item_count: number;
}

export interface AddToCartData {
  product_id: number;
  quantity: number;
}

// Tipos para pedidos
export interface Order {
  id: number;
  user_id: number;
  status: OrderStatus;
  total: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  shipping_address: Address;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: Product;
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled'
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit_card',
  BOLETO = 'boleto',
  PIX = 'pix'
}

export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded'
}

export interface Address {
  id?: number;
  user_id?: number;
  name: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  is_default?: boolean;
  created_at?: string;
  updated_at?: string;
}

// Tipos para checkout
export interface CheckoutData {
  payment_method: PaymentMethod;
  shipping_address_id: number;
  items: {
    product_id: number;
    quantity: number;
  }[];
  payment_details?: PaymentDetails;
}

export interface PaymentDetails {
  card_number?: string;
  card_holder_name?: string;
  card_expiry_month?: string;
  card_expiry_year?: string;
  card_cvv?: string;
}
