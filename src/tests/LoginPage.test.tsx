import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import LoginPage from '../pages/LoginPage';

// Mock do contexto de autenticação
jest.mock('../contexts/AuthContext', () => ({
  ...jest.requireActual('../contexts/AuthContext'),
  useAuth: () => ({
    login: jest.fn().mockImplementation((email, password) => {
      if (email === 'usuario@teste.com' && password === 'senha123') {
        return Promise.resolve(true);
      } else {
        return Promise.reject(new Error('Credenciais inválidas'));
      }
    }),
    loginWithGoogle: jest.fn().mockResolvedValue(true),
    loginWithFacebook: jest.fn().mockResolvedValue(true),
    loginWithApple: jest.fn().mockResolvedValue(true),
    isAuthenticated: false,
    user: null,
    logout: jest.fn()
  })
}));

// Mock do hook useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ state: { from: '/' } })
}));

// Wrapper para prover os contextos necessários
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
};

describe('LoginPage Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renderiza corretamente com formulário de login e opções de login social', () => {
    render(
      <LoginPage />,
      { wrapper: AllTheProviders }
    );
    
    // Verifica se o título da página está presente
    expect(screen.getByText('Entrar na sua conta')).toBeInTheDocument();
    
    // Verifica se os campos do formulário estão presentes
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
    
    // Verifica se os botões de login estão presentes
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Entrar com Google')).toBeInTheDocument();
    expect(screen.getByText('Entrar com Facebook')).toBeInTheDocument();
    expect(screen.getByText('Entrar com Apple')).toBeInTheDocument();
    
    // Verifica se o link para cadastro está presente
    expect(screen.getByText('Criar uma conta')).toBeInTheDocument();
  });
  
  test('realiza login com credenciais válidas', async () => {
    render(
      <LoginPage />,
      { wrapper: AllTheProviders }
    );
    
    // Preenche o formulário com credenciais válidas
    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'usuario@teste.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'senha123' }
    });
    
    // Clica no botão de login
    fireEvent.click(screen.getByText('Entrar'));
    
    // Verifica se a função login foi chamada com os parâmetros corretos
    expect(jest.requireMock('../contexts/AuthContext').useAuth().login)
      .toHaveBeenCalledWith('usuario@teste.com', 'senha123');
    
    // Verifica se o usuário foi redirecionado após o login
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  test('exibe erro com credenciais inválidas', async () => {
    render(
      <LoginPage />,
      { wrapper: AllTheProviders }
    );
    
    // Preenche o formulário com credenciais inválidas
    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'usuario@teste.com' }
    });
    
    fireEvent.change(screen.getByLabelText('Senha'), {
      target: { value: 'senhaerrada' }
    });
    
    // Clica no botão de login
    fireEvent.click(screen.getByText('Entrar'));
    
    // Verifica se a mensagem de erro é exibida
    expect(await screen.findByText('Credenciais inválidas')).toBeInTheDocument();
  });
  
  test('realiza login com Google', () => {
    render(
      <LoginPage />,
      { wrapper: AllTheProviders }
    );
    
    // Clica no botão de login com Google
    fireEvent.click(screen.getByText('Entrar com Google'));
    
    // Verifica se a função loginWithGoogle foi chamada
    expect(jest.requireMock('../contexts/AuthContext').useAuth().loginWithGoogle)
      .toHaveBeenCalled();
    
    // Verifica se o usuário foi redirecionado após o login
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  test('realiza login com Facebook', () => {
    render(
      <LoginPage />,
      { wrapper: AllTheProviders }
    );
    
    // Clica no botão de login com Facebook
    fireEvent.click(screen.getByText('Entrar com Facebook'));
    
    // Verifica se a função loginWithFacebook foi chamada
    expect(jest.requireMock('../contexts/AuthContext').useAuth().loginWithFacebook)
      .toHaveBeenCalled();
    
    // Verifica se o usuário foi redirecionado após o login
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  test('realiza login com Apple', () => {
    render(
      <LoginPage />,
      { wrapper: AllTheProviders }
    );
    
    // Clica no botão de login com Apple
    fireEvent.click(screen.getByText('Entrar com Apple'));
    
    // Verifica se a função loginWithApple foi chamada
    expect(jest.requireMock('../contexts/AuthContext').useAuth().loginWithApple)
      .toHaveBeenCalled();
    
    // Verifica se o usuário foi redirecionado após o login
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  test('navega para página de cadastro quando o link é clicado', () => {
    render(
      <LoginPage />,
      { wrapper: AllTheProviders }
    );
    
    // Clica no link para cadastro
    fireEvent.click(screen.getByText('Criar uma conta'));
    
    // Verifica se o usuário foi redirecionado para a página de cadastro
    expect(mockNavigate).toHaveBeenCalledWith('/cadastro');
  });
  
  test('valida campos do formulário', () => {
    render(
      <LoginPage />,
      { wrapper: AllTheProviders }
    );
    
    // Clica no botão de login sem preencher o formulário
    fireEvent.click(screen.getByText('Entrar'));
    
    // Verifica se as mensagens de erro são exibidas
    expect(screen.getByText('E-mail é obrigatório')).toBeInTheDocument();
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    
    // Preenche o e-mail com um formato inválido
    fireEvent.change(screen.getByLabelText('E-mail'), {
      target: { value: 'emailinvalido' }
    });
    
    // Clica no botão de login novamente
    fireEvent.click(screen.getByText('Entrar'));
    
    // Verifica se a mensagem de erro de formato de e-mail é exibida
    expect(screen.getByText('E-mail inválido')).toBeInTheDocument();
  });
});
