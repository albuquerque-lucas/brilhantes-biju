import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaGoogle, FaFacebook, FaApple, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/LoginPage.module.scss';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email?: string; password?: string; general?: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, loginWithGoogle, loginWithFacebook, loginWithApple } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Obtém a URL de redirecionamento após o login (se houver)
  const from = location.state?.from || '/';
  
  const validateForm = (): boolean => {
    const newErrors: {email?: string; password?: string} = {};
    let isValid = true;
    
    // Validação de e-mail
    if (!email) {
      newErrors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'E-mail inválido';
      isValid = false;
    }
    
    // Validação de senha
    if (!password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate(from);
    } catch (error) {
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : 'Erro ao fazer login'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate(from);
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Erro ao fazer login com Google'
      });
    }
  };
  
  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      navigate(from);
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Erro ao fazer login com Facebook'
      });
    }
  };
  
  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
      navigate(from);
    } catch (error) {
      setErrors({
        ...errors,
        general: 'Erro ao fazer login com Apple'
      });
    }
  };
  
  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1 className={styles.title}>Entrar na sua conta</h1>
        
        {errors.general && (
          <div className={styles.errorMessage}>
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              <FaEnvelope className={styles.icon} />
              E-mail
            </label>
            <input
              type="email"
              id="email"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu e-mail"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              <FaLock className={styles.icon} />
              Senha
            </label>
            <input
              type="password"
              id="password"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Sua senha"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
          </div>
          
          <div className={styles.forgotPassword}>
            <Link to="/recuperar-senha">Esqueceu sua senha?</Link>
          </div>
          
          <button 
            type="submit" 
            className={styles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        
        <div className={styles.divider}>
          <span>ou</span>
        </div>
        
        <div className={styles.socialLogin}>
          <button 
            type="button" 
            className={`${styles.socialButton} ${styles.googleButton}`}
            onClick={handleGoogleLogin}
          >
            <FaGoogle className={styles.socialIcon} />
            Entrar com Google
          </button>
          
          <button 
            type="button" 
            className={`${styles.socialButton} ${styles.facebookButton}`}
            onClick={handleFacebookLogin}
          >
            <FaFacebook className={styles.socialIcon} />
            Entrar com Facebook
          </button>
          
          <button 
            type="button" 
            className={`${styles.socialButton} ${styles.appleButton}`}
            onClick={handleAppleLogin}
          >
            <FaApple className={styles.socialIcon} />
            Entrar com Apple
          </button>
        </div>
        
        <div className={styles.registerLink}>
          Não tem uma conta? <Link to="/cadastro">Criar uma conta</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
