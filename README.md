# Brilhante Biju - Documentação do Projeto

## Visão Geral

Este projeto é uma conversão do site Brilhante Biju de HTML/CSS/JavaScript para uma aplicação moderna em React com TypeScript. A aplicação é um e-commerce completo para venda de bijuterias, com funcionalidades como catálogo de produtos, carrinho de compras, checkout com integração PagSeguro, e sistema de autenticação com login social. O projeto foi realizado em conjunto com a Manus IA, atendendo a uma demanda do idealizador do projeto.

## Tecnologias Utilizadas

- **React 18**: Biblioteca JavaScript para construção de interfaces de usuário
- **TypeScript**: Superset tipado de JavaScript
- **Vite**: Ferramenta de build rápida para desenvolvimento moderno
- **React Router**: Biblioteca para roteamento em aplicações React
- **SASS/SCSS**: Pré-processador CSS para estilos mais organizados
- **CSS Modules**: Para estilos encapsulados por componente
- **React Icons**: Biblioteca de ícones para React
- **React Testing Library**: Framework para testes de componentes React

## Estrutura do Projeto

```
brilhante_biju_typescript/
├── public/                  # Arquivos públicos estáticos
├── src/                     # Código-fonte da aplicação
│   ├── assets/              # Recursos estáticos (imagens, fontes)
│   │   └── images/          # Imagens utilizadas na aplicação
│   ├── components/          # Componentes React reutilizáveis
│   │   ├── categories/      # Componentes relacionados a categorias
│   │   ├── checkout/        # Componentes relacionados ao checkout
│   │   ├── layout/          # Componentes de layout (Header, Footer)
│   │   ├── products/        # Componentes relacionados a produtos
│   │   └── ui/              # Componentes de UI genéricos
│   ├── contexts/            # Contextos React para gerenciamento de estado
│   ├── hooks/               # Hooks personalizados
│   ├── pages/               # Componentes de página
│   ├── services/            # Serviços para comunicação com APIs
│   ├── styles/              # Estilos globais e variáveis SCSS
│   ├── tests/               # Testes unitários e de integração
│   ├── types/               # Definições de tipos TypeScript
│   ├── utils/               # Funções utilitárias
│   │   └── imageOptimizer/  # Utilitários para otimização de imagens
│   ├── App.tsx              # Componente principal da aplicação
│   ├── AppProviders.tsx     # Provedores de contexto da aplicação
│   ├── AppRoutes.tsx        # Configuração de rotas da aplicação
│   ├── index.css            # Estilos globais
│   └── main.tsx             # Ponto de entrada da aplicação
├── .gitignore               # Arquivos ignorados pelo Git
├── index.html               # Arquivo HTML principal
├── package.json             # Dependências e scripts
├── tsconfig.json            # Configuração do TypeScript
└── vite.config.ts           # Configuração do Vite
```

## Principais Funcionalidades

### 1. Catálogo de Produtos
- Listagem de produtos por categoria
- Filtros e ordenação
- Visualização detalhada de produtos

### 2. Carrinho de Compras
- Adição/remoção de produtos
- Atualização de quantidades
- Cálculo de subtotal, frete e total

### 3. Checkout
- Integração com PagSeguro
- Múltiplos métodos de pagamento (cartão, boleto, PIX)
- Formulário de endereço de entrega

### 4. Autenticação
- Login tradicional com e-mail e senha
- Login social (Google, Facebook, Apple)
- Cadastro de novos usuários

### 5. Responsividade
- Design adaptável a diferentes tamanhos de tela
- Otimização de imagens para diferentes dispositivos
- Lazy loading para melhor performance

## Componentes Principais

### Layout
- **Header**: Barra de navegação superior com menu, logo e ícones de carrinho/usuário
- **Footer**: Rodapé com informações de contato, links úteis e newsletter
- **Layout**: Componente que envolve todas as páginas com Header e Footer

### Produtos
- **ProductCard**: Card para exibição de produto em listagens
- **ProductGrid**: Grid responsivo para exibição de múltiplos produtos
- **ProductDetails**: Exibição detalhada de um produto específico

### Carrinho
- **CartItem**: Item individual no carrinho
- **CartSummary**: Resumo do carrinho com subtotal, frete e total
- **CartPage**: Página completa do carrinho

### Checkout
- **CheckoutForm**: Formulário para informações de entrega
- **PagSeguroCheckout**: Componente de integração com PagSeguro
- **PaymentMethods**: Seleção de métodos de pagamento

### UI
- **Banner**: Banner para destaque na página inicial
- **Button**: Botão estilizado e reutilizável
- **OptimizedImage**: Componente para exibição otimizada de imagens
- **Modal**: Modal reutilizável para diálogos

## Contextos

### AuthContext
Gerencia o estado de autenticação do usuário, incluindo:
- Login/logout
- Login social
- Informações do usuário autenticado

### CartContext
Gerencia o estado do carrinho de compras, incluindo:
- Itens no carrinho
- Adição/remoção de produtos
- Atualização de quantidades
- Cálculo de valores

## Hooks Personalizados

### useForm
Hook para gerenciamento de formulários com validação.

### useLocalStorage
Hook para persistência de dados no localStorage.

### useOptimizedImage
Hook para carregamento otimizado de imagens com lazy loading.

### usePagination
Hook para implementação de paginação em listagens.

## Utilitários

### ImageOptimizer
Utilitário para otimização de imagens, incluindo:
- Geração de srcSet para imagens responsivas
- Cálculo de dimensões e aspect ratios
- Criação de placeholders para lazy loading

## Testes

O projeto inclui testes unitários e de integração para os principais componentes:
- **ProductCard.test.tsx**: Testes para o componente ProductCard
- **CartPage.test.tsx**: Testes para a página de carrinho
- **PagSeguroCheckout.test.tsx**: Testes para a integração com PagSeguro
- **LoginPage.test.tsx**: Testes para a página de login
- **OptimizedImage.test.tsx**: Testes para o componente de imagem otimizada

## Instalação e Execução

### Pré-requisitos
- Node.js 14.x ou superior
- npm 6.x ou superior

### Instalação
1. Clone o repositório
2. Instale as dependências:
```bash
cd brilhante_biju_typescript
npm install
```

### Execução em Desenvolvimento
```bash
npm run dev
```

### Build para Produção
```bash
npm run build
```

### Execução de Testes
```bash
npm test
```

## Configuração do PagSeguro

Para utilizar a integração com PagSeguro, é necessário configurar as variáveis de ambiente:

1. Crie um arquivo `.env` na raiz do projeto
2. Adicione as seguintes variáveis:
```
VITE_PAGSEGURO_API_KEY=sua_api_key
VITE_PAGSEGURO_SANDBOX=true # ou false para produção
```

## Configuração do Login Social

Para utilizar o login social, é necessário configurar as variáveis de ambiente:

1. Adicione ao arquivo `.env`:
```
VITE_GOOGLE_CLIENT_ID=seu_client_id
VITE_FACEBOOK_APP_ID=seu_app_id
VITE_APPLE_CLIENT_ID=seu_client_id
```

## Considerações sobre Performance

- Imagens são otimizadas e carregadas com lazy loading
- Componentes são carregados dinamicamente com React.lazy quando apropriado
- CSS é modularizado para evitar conflitos e reduzir o tamanho do bundle
- Estado é gerenciado de forma eficiente com Context API e hooks

## Melhorias Futuras

- Implementação de PWA (Progressive Web App)
- Integração com sistema de busca avançada
- Implementação de sistema de avaliações de produtos
- Adição de mais métodos de pagamento
- Implementação de sistema de cupons de desconto

## Licença

Este projeto é licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.
