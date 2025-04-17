import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/RegisterPage.module.scss';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: {
      street: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      state: '',
      zipCode: ''
    }
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof typeof formData] as Record<string, string>,
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Validação de nome
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
      isValid = false;
    }
    
    // Validação de e-mail
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
      isValid = false;
    }
    
    // Validação de senha
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
      isValid = false;
    }
    
    // Validação de confirmação de senha
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    // Validação de telefone
    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
      isValid = false;
    } else if (!/^\(\d{2}\) \d{5}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = 'Telefone inválido. Use o formato (99) 99999-9999';
      isValid = false;
    }
    
    // Validação de CEP
    if (!formData.address.zipCode) {
      newErrors['address.zipCode'] = 'CEP é obrigatório';
      isValid = false;
    } else if (!/^\d{5}-\d{3}$/.test(formData.address.zipCode)) {
      newErrors['address.zipCode'] = 'CEP inválido. Use o formato 99999-999';
      isValid = false;
    }
    
    // Validação de endereço
    if (!formData.address.street) {
      newErrors['address.street'] = 'Rua é obrigatória';
      isValid = false;
    }
    
    if (!formData.address.number) {
      newErrors['address.number'] = 'Número é obrigatório';
      isValid = false;
    }
    
    if (!formData.address.neighborhood) {
      newErrors['address.neighborhood'] = 'Bairro é obrigatório';
      isValid = false;
    }
    
    if (!formData.address.city) {
      newErrors['address.city'] = 'Cidade é obrigatória';
      isValid = false;
    }
    
    if (!formData.address.state) {
      newErrors['address.state'] = 'Estado é obrigatório';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    }
  };
  
  const handlePrevStep = () => {
    if (currentStep === 2) {
      setCurrentStep(1);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 1) {
      handleNextStep();
      return;
    }
    
    if (!validateStep2()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register(formData);
      navigate('/login', { state: { message: 'Cadastro realizado com sucesso! Faça login para continuar.' } });
    } catch (error) {
      setErrors({
        ...errors,
        general: error instanceof Error ? error.message : 'Erro ao realizar cadastro'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <h1 className={styles.title}>Criar uma conta</h1>
        
        {errors.general && (
          <div className={styles.errorMessage}>
            {errors.general}
          </div>
        )}
        
        <div className={styles.stepIndicator}>
          <div className={`${styles.step} ${currentStep === 1 ? styles.active : ''}`}>
            <span>1</span>
            <p>Informações Pessoais</p>
          </div>
          <div className={styles.stepDivider}></div>
          <div className={`${styles.step} ${currentStep === 2 ? styles.active : ''}`}>
            <span>2</span>
            <p>Endereço</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.registerForm}>
          {currentStep === 1 ? (
            // Etapa 1: Informações Pessoais
            <>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>
                  <FaUser className={styles.icon} />
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className={styles.input}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Seu nome completo"
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>
                  <FaEnvelope className={styles.icon} />
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  value={formData.email}
                  onChange={handleChange}
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
                  name="password"
                  className={styles.input}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Sua senha"
                />
                {errors.password && <span className={styles.error}>{errors.password}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  <FaLock className={styles.icon} />
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={styles.input}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirme sua senha"
                />
                {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
              </div>
              
              <button 
                type="button" 
                className={styles.nextButton}
                onClick={handleNextStep}
              >
                Próximo
              </button>
            </>
          ) : (
            // Etapa 2: Endereço
            <>
              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>
                  <FaPhone className={styles.icon} />
                  Telefone
                </label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  className={styles.input}
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(99) 99999-9999"
                />
                {errors.phone && <span className={styles.error}>{errors.phone}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="zipCode" className={styles.label}>
                  <FaMapMarkerAlt className={styles.icon} />
                  CEP
                </label>
                <input
                  type="text"
                  id="zipCode"
                  name="address.zipCode"
                  className={styles.input}
                  value={formData.address.zipCode}
                  onChange={handleChange}
                  placeholder="99999-999"
                />
                {errors['address.zipCode'] && <span className={styles.error}>{errors['address.zipCode']}</span>}
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="street" className={styles.label}>
                    Rua
                  </label>
                  <input
                    type="text"
                    id="street"
                    name="address.street"
                    className={styles.input}
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="Nome da rua"
                  />
                  {errors['address.street'] && <span className={styles.error}>{errors['address.street']}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="number" className={styles.label}>
                    Número
                  </label>
                  <input
                    type="text"
                    id="number"
                    name="address.number"
                    className={styles.input}
                    value={formData.address.number}
                    onChange={handleChange}
                    placeholder="Número"
                  />
                  {errors['address.number'] && <span className={styles.error}>{errors['address.number']}</span>}
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="complement" className={styles.label}>
                  Complemento
                </label>
                <input
                  type="text"
                  id="complement"
                  name="address.complement"
                  className={styles.input}
                  value={formData.address.complement}
                  onChange={handleChange}
                  placeholder="Apartamento, bloco, etc. (opcional)"
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="neighborhood" className={styles.label}>
                  Bairro
                </label>
                <input
                  type="text"
                  id="neighborhood"
                  name="address.neighborhood"
                  className={styles.input}
                  value={formData.address.neighborhood}
                  onChange={handleChange}
                  placeholder="Seu bairro"
                />
                {errors['address.neighborhood'] && <span className={styles.error}>{errors['address.neighborhood']}</span>}
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="city" className={styles.label}>
                    Cidade
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="address.city"
                    className={styles.input}
                    value={formData.address.city}
                    onChange={handleChange}
                    placeholder="Sua cidade"
                  />
                  {errors['address.city'] && <span className={styles.error}>{errors['address.city']}</span>}
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="state" className={styles.label}>
                    Estado
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="address.state"
                    className={styles.input}
                    value={formData.address.state}
                    onChange={handleChange}
                    placeholder="Seu estado"
                  />
                  {errors['address.state'] && <span className={styles.error}>{errors['address.state']}</span>}
                </div>
              </div>
              
              <div className={styles.buttonGroup}>
                <button 
                  type="button" 
                  className={styles.backButton}
                  onClick={handlePrevStep}
                >
                  Voltar
                </button>
                
                <button 
                  type="submit" 
                  className={styles.registerButton}
                  disabled={isLoading}
                >
                  {isLoading ? 'Cadastrando...' : 'Cadastrar'}
                </button>
              </div>
            </>
          )}
        </form>
        
        <div className={styles.loginLink}>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
