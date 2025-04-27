# Estrutura de API para Brilhante Biju

Este documento descreve a estrutura de integração com API implementada para o projeto Brilhante Biju, preparada para conectar o frontend React/TypeScript com um backend Laravel 11 usando autenticação JWT.

## Estrutura de Arquivos

```
src/
├── config/
│   ├── axios.ts             # Configuração do Axios com interceptors
│   └── ApiProvider.tsx      # Provedor do React Query para a aplicação
├── services/
│   ├── auth.ts              # Serviços de autenticação
│   ├── products.ts          # Serviços de produtos
│   ├── categories.ts        # Serviços de categorias
│   ├── cart.ts              # Serviços de carrinho
│   └── orders.ts            # Serviços de pedidos e endereços
├── hooks/
│   ├── useAuth.ts           # Hooks para autenticação
│   ├── useProducts.ts       # Hooks para produtos
│   ├── useCategories.ts     # Hooks para categorias
│   ├── useCart.ts           # Hooks para carrinho
│   └── useOrders.ts         # Hooks para pedidos e endereços
├── types/
│   └── api.ts               # Tipos para todos os recursos da API
└── examples/
    └── ApiExamples.tsx      # Exemplos de uso dos hooks
```

## Como Usar

### 1. Configuração Inicial

Primeiro, envolva sua aplicação com o `ApiProvider` para habilitar o React Query:

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApiProvider } from './config/ApiProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApiProvider>
      <App />
    </ApiProvider>
  </React.StrictMode>
);
```

### 2. Autenticação

Para login e gerenciamento de usuário:

```tsx
import { useLogin, useCurrentUser, useLogout } from './hooks/useAuth';

// Em seu componente:
const { data: user, isLoading } = useCurrentUser();
const login = useLogin();
const logout = useLogout();

// Para fazer login:
login.mutate({ email: 'usuario@exemplo.com', password: 'senha123' });

// Para fazer logout:
logout.mutate();
```

### 3. Produtos

Para buscar e gerenciar produtos:

```tsx
import { useProducts, useProduct, useCreateProduct } from './hooks/useProducts';

// Buscar produtos paginados:
const { data, isLoading } = useProducts(1, 10, categoryId, searchTerm);

// Buscar um produto específico:
const { data: product } = useProduct(productId);

// Criar um produto:
const createProduct = useCreateProduct();
createProduct.mutate({ 
  data: { name: 'Novo Produto', price: 99.90, /* ... */ }, 
  images: [file1, file2] 
});
```

### 4. Carrinho

Para gerenciar o carrinho de compras:

```tsx
import { useCart, useAddToCart, useRemoveFromCart } from './hooks/useCart';

// Buscar o carrinho:
const { data: cart } = useCart();

// Adicionar ao carrinho:
const addToCart = useAddToCart();
addToCart.mutate({ product_id: 1, quantity: 2 });

// Remover do carrinho:
const removeFromCart = useRemoveFromCart();
removeFromCart.mutate(cartItemId);
```

### 5. Checkout

Para finalizar pedidos:

```tsx
import { useCreateOrder } from './hooks/useOrders';

const createOrder = useCreateOrder();

// Finalizar compra:
createOrder.mutate({
  payment_method: 'credit_card',
  shipping_address_id: 1,
  items: [{ product_id: 1, quantity: 2 }],
  payment_details: {
    card_number: '4111111111111111',
    card_holder_name: 'USUARIO TESTE',
    card_expiry_month: '12',
    card_expiry_year: '2025',
    card_cvv: '123'
  }
});
```

## Características Principais

1. **Autenticação JWT**: Tokens são automaticamente incluídos em todas as requisições e gerenciados no localStorage.

2. **Tratamento de Erros**: Respostas 401 (não autorizado) redirecionam automaticamente para a página inicial.

3. **Cache Inteligente**: O React Query gerencia o cache de dados, reduzindo requisições desnecessárias.

4. **Tipagem Completa**: Todos os serviços e hooks são completamente tipados para melhor experiência de desenvolvimento.

5. **Suporte a Upload de Arquivos**: Implementação para upload de imagens de produtos e categorias.

6. **Gerenciamento de Estado**: Invalidação automática de consultas relacionadas quando os dados são modificados.

## Endpoints Esperados no Backend

O backend Laravel 11 deverá implementar os seguintes endpoints:

### Autenticação
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `GET /api/auth/verify-email/{token}`
- `POST /api/auth/email/verification-notification`

### Produtos
- `GET /api/products`
- `GET /api/products/{id}`
- `GET /api/products/slug/{slug}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `DELETE /api/products/{id}/images/{imageId}`
- `POST /api/products/featured`
- `POST /api/products/new`

### Categorias
- `GET /api/categories`
- `GET /api/categories/all`
- `GET /api/categories/{id}`
- `GET /api/categories/slug/{slug}`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`

### Carrinho
- `GET /api/cart`
- `POST /api/cart/add`
- `PUT /api/cart/items/{id}`
- `DELETE /api/cart/items/{id}`
- `DELETE /api/cart/clear`
- `POST /api/cart/promo-code`
- `DELETE /api/cart/promo-code`

### Pedidos e Endereços
- `GET /api/orders`
- `GET /api/orders/{id}`
- `POST /api/orders`
- `POST /api/orders/{id}/cancel`
- `GET /api/addresses`
- `GET /api/addresses/{id}`
- `POST /api/addresses`
- `PUT /api/addresses/{id}`
- `DELETE /api/addresses/{id}`
- `POST /api/addresses/{id}/default`
- `GET /api/orders/{id}/payment-status`
- `GET /api/orders/{id}/pix-qrcode`
- `GET /api/orders/{id}/boleto`

## Próximos Passos

1. Implementar o backend Laravel 11 com os endpoints listados acima
2. Configurar a autenticação JWT no Laravel
3. Implementar validação de dados no backend
4. Testar a integração completa entre frontend e backend
