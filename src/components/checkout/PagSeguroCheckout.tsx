import React, { useState } from 'react';
import { useCart } from '../../contexts/CartContext';
import { PaymentMethod, CreditCardData, PagSeguroPaymentResponse } from '../../types';
import PagSeguroService from '../../services/PagSeguroService';
import useForm from '../../hooks/useForm';
import styles from '../../styles/PagSeguroCheckout.module.scss';
import { FaCreditCard, FaBarcode, FaQrcode } from 'react-icons/fa';

interface PagSeguroCheckoutProps {
  onPaymentComplete: (response: PagSeguroPaymentResponse) => void;
  onPaymentError: (error: string) => void;
}

const PagSeguroCheckout: React.FC<PagSeguroCheckoutProps> = ({ 
  onPaymentComplete, 
  onPaymentError 
}) => {
  const { cartItems, subtotal, shipping, discount, total, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.CREDIT_CARD);
  const [isProcessing, setIsProcessing] = useState(false);
  const [installments, setInstallments] = useState(1);
  
  // Instanciar serviço PagSeguro com chave de API simulada
  const pagSeguroService = new PagSeguroService('SANDBOX_API_KEY', true);
  
  // Validação do formulário de cartão de crédito
  const validateCreditCardForm = (values: CreditCardData) => {
    const errors: Partial<Record<keyof CreditCardData, string>> = {};
    
    if (!values.number) {
      errors.number = 'Número do cartão é obrigatório';
    } else if (!/^\d{16}$/.test(values.number.replace(/\s/g, ''))) {
      errors.number = 'Número do cartão inválido';
    }
    
    if (!values.name) {
      errors.name = 'Nome no cartão é obrigatório';
    }
    
    if (!values.expirationMonth) {
      errors.expirationMonth = 'Mês de expiração é obrigatório';
    }
    
    if (!values.expirationYear) {
      errors.expirationYear = 'Ano de expiração é obrigatório';
    }
    
    if (!values.securityCode) {
      errors.securityCode = 'Código de segurança é obrigatório';
    } else if (!/^\d{3,4}$/.test(values.securityCode)) {
      errors.securityCode = 'Código de segurança inválido';
    }
    
    return errors;
  };
  
  // Formulário de cartão de crédito
  const {
    values: creditCardValues,
    errors: creditCardErrors,
    handleChange: handleCreditCardChange,
    handleBlur: handleCreditCardBlur,
    handleSubmit: handleCreditCardSubmit
  } = useForm<CreditCardData>({
    number: '',
    name: '',
    expirationMonth: '',
    expirationYear: '',
    securityCode: '',
    installments: 1
  }, validateCreditCardForm);
  
  // Processar pagamento
  const processPayment = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    
    try {
      // Criar objeto de requisição de pagamento
      const paymentRequest = {
        paymentMethod,
        orderId: `ORDER_${Date.now()}`,
        amount: total,
        customerInfo: {
          name: 'Cliente Teste',
          email: 'cliente@teste.com',
          taxId: '12345678909', // CPF
          phone: '11999999999'
        }
      };
      
      // Adicionar dados do cartão se o método for cartão de crédito
      if (paymentMethod === PaymentMethod.CREDIT_CARD) {
        paymentRequest.creditCard = {
          ...creditCardValues,
          installments
        };
      }
      
      // Processar pagamento via PagSeguro
      const response = await pagSeguroService.processPayment(paymentRequest);
      
      if (response.success) {
        // Limpar carrinho após pagamento bem-sucedido
        clearCart();
        onPaymentComplete(response);
      } else {
        onPaymentError(response.errorMessage || 'Erro ao processar pagamento');
      }
    } catch (error) {
      onPaymentError(error instanceof Error ? error.message : 'Erro desconhecido ao processar pagamento');
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Gerar opções de parcelas
  const installmentOptions = () => {
    const maxInstallments = total >= 100 ? 12 : (total >= 60 ? 6 : 3);
    const options = [];
    
    for (let i = 1; i <= maxInstallments; i++) {
      const installmentValue = total / i;
      const hasInterest = i > 3;
      const interestRate = hasInterest ? 1.99 : 0;
      const installmentWithInterest = hasInterest 
        ? installmentValue * (1 + interestRate / 100) 
        : installmentValue;
      
      options.push(
        <option key={i} value={i}>
          {i}x de R$ {installmentWithInterest.toFixed(2)}
          {hasInterest ? ` (${interestRate}% a.m.)` : ' (sem juros)'}
        </option>
      );
    }
    
    return options;
  };
  
  return (
    <div className={styles.pagSeguroCheckout}>
      <div className={styles.paymentMethods}>
        <h3>Forma de Pagamento</h3>
        
        <div className={styles.methodOptions}>
          <button
            type="button"
            className={`${styles.methodOption} ${paymentMethod === PaymentMethod.CREDIT_CARD ? styles.active : ''}`}
            onClick={() => setPaymentMethod(PaymentMethod.CREDIT_CARD)}
          >
            <FaCreditCard />
            <span>Cartão de Crédito</span>
          </button>
          
          <button
            type="button"
            className={`${styles.methodOption} ${paymentMethod === PaymentMethod.BOLETO ? styles.active : ''}`}
            onClick={() => setPaymentMethod(PaymentMethod.BOLETO)}
          >
            <FaBarcode />
            <span>Boleto</span>
          </button>
          
          <button
            type="button"
            className={`${styles.methodOption} ${paymentMethod === PaymentMethod.PIX ? styles.active : ''}`}
            onClick={() => setPaymentMethod(PaymentMethod.PIX)}
          >
            <FaQrcode />
            <span>PIX</span>
          </button>
        </div>
      </div>
      
      {paymentMethod === PaymentMethod.CREDIT_CARD && (
        <form 
          className={styles.creditCardForm}
          onSubmit={handleCreditCardSubmit(processPayment)}
        >
          <div className={styles.formGroup}>
            <label htmlFor="card-number">Número do Cartão</label>
            <input
              type="text"
              id="card-number"
              name="number"
              placeholder="0000 0000 0000 0000"
              value={creditCardValues.number}
              onChange={handleCreditCardChange}
              onBlur={handleCreditCardBlur}
              maxLength={19}
            />
            {creditCardErrors.number && (
              <span className={styles.errorMessage}>{creditCardErrors.number}</span>
            )}
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="card-name">Nome no Cartão</label>
            <input
              type="text"
              id="card-name"
              name="name"
              placeholder="Nome como está no cartão"
              value={creditCardValues.name}
              onChange={handleCreditCardChange}
              onBlur={handleCreditCardBlur}
            />
            {creditCardErrors.name && (
              <span className={styles.errorMessage}>{creditCardErrors.name}</span>
            )}
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="expiration-month">Mês</label>
              <select
                id="expiration-month"
                name="expirationMonth"
                value={creditCardValues.expirationMonth}
                onChange={handleCreditCardChange}
                onBlur={handleCreditCardBlur}
              >
                <option value="">MM</option>
                {Array.from({ length: 12 }, (_, i) => {
                  const month = i + 1;
                  return (
                    <option key={month} value={month.toString().padStart(2, '0')}>
                      {month.toString().padStart(2, '0')}
                    </option>
                  );
                })}
              </select>
              {creditCardErrors.expirationMonth && (
                <span className={styles.errorMessage}>{creditCardErrors.expirationMonth}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="expiration-year">Ano</label>
              <select
                id="expiration-year"
                name="expirationYear"
                value={creditCardValues.expirationYear}
                onChange={handleCreditCardChange}
                onBlur={handleCreditCardBlur}
              >
                <option value="">AAAA</option>
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() + i;
                  return (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  );
                })}
              </select>
              {creditCardErrors.expirationYear && (
                <span className={styles.errorMessage}>{creditCardErrors.expirationYear}</span>
              )}
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="security-code">CVV</label>
              <input
                type="text"
                id="security-code"
                name="securityCode"
                placeholder="123"
                maxLength={4}
                value={creditCardValues.securityCode}
                onChange={handleCreditCardChange}
                onBlur={handleCreditCardBlur}
              />
              {creditCardErrors.securityCode && (
                <span className={styles.errorMessage}>{creditCardErrors.securityCode}</span>
              )}
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="installments">Parcelas</label>
            <select
              id="installments"
              value={installments}
              onChange={(e) => setInstallments(parseInt(e.target.value))}
            >
              {installmentOptions()}
            </select>
          </div>
          
          <button 
            type="submit" 
            className={styles.payButton}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processando...' : 'Pagar com Cartão de Crédito'}
          </button>
        </form>
      )}
      
      {paymentMethod === PaymentMethod.BOLETO && (
        <div className={styles.boletoPayment}>
          <p className={styles.paymentInfo}>
            O boleto será gerado após a confirmação do pedido. O prazo de validade é de 3 dias úteis.
            Após o pagamento, a compensação bancária pode levar até 3 dias úteis.
          </p>
          
          <button 
            type="button" 
            className={styles.payButton}
            onClick={processPayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processando...' : 'Gerar Boleto'}
          </button>
        </div>
      )}
      
      {paymentMethod === PaymentMethod.PIX && (
        <div className={styles.pixPayment}>
          <p className={styles.paymentInfo}>
            O QR Code do PIX será gerado após a confirmação do pedido. O pagamento é processado instantaneamente.
            O código PIX tem validade de 30 minutos.
          </p>
          
          <button 
            type="button" 
            className={styles.payButton}
            onClick={processPayment}
            disabled={isProcessing}
          >
            {isProcessing ? 'Processando...' : 'Gerar QR Code PIX'}
          </button>
        </div>
      )}
      
      <div className={styles.orderSummary}>
        <h3>Resumo do Pedido</h3>
        
        <div className={styles.summaryItem}>
          <span>Subtotal</span>
          <span>R$ {subtotal.toFixed(2)}</span>
        </div>
        
        <div className={styles.summaryItem}>
          <span>Frete</span>
          <span>
            {shipping === 0 ? (
              <span className={styles.freeShipping}>Grátis</span>
            ) : (
              `R$ ${shipping.toFixed(2)}`
            )}
          </span>
        </div>
        
        {discount > 0 && (
          <div className={styles.summaryItem}>
            <span>Desconto</span>
            <span className={styles.discount}>-R$ {discount.toFixed(2)}</span>
          </div>
        )}
        
        <div className={`${styles.summaryItem} ${styles.totalItem}`}>
          <span>Total</span>
          <span>R$ {total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default PagSeguroCheckout;
