import React from 'react';
import { useNavigate } from 'react-router-dom';
import PagSeguroCheckout from '../components/checkout/PagSeguroCheckout';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { PagSeguroPaymentResponse } from '../types';
import useModal from '../hooks/useModal';
import styles from '../styles/CheckoutPage.module.scss';

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cartItems, total } = useCart();
  const { isOpen, openModal, closeModal, data } = useModal();

  // Redirecionar para login se não estiver autenticado
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);

  // Redirecionar para carrinho se estiver vazio
  React.useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/carrinho');
    }
  }, [cartItems, navigate]);

  // Manipular conclusão do pagamento
  const handlePaymentComplete = (response: PagSeguroPaymentResponse) => {
    openModal({
      success: true,
      message: 'Pagamento processado com sucesso!',
      transactionId: response.transactionId,
      status: response.status,
      paymentUrl: response.paymentUrl
    });
  };

  // Manipular erro no pagamento
  const handlePaymentError = (errorMessage: string) => {
    openModal({
      success: false,
      message: `Erro no pagamento: ${errorMessage}`
    });
  };

  // Continuar comprando após pagamento
  const handleContinueShopping = () => {
    closeModal();
    navigate('/');
  };

  // Visualizar boleto ou QR code PIX
  const handleViewPayment = () => {
    if (data?.paymentUrl) {
      window.open(data.paymentUrl, '_blank');
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Finalizar Compra</h1>

        <div className={styles.checkoutContent}>
          <PagSeguroCheckout
            onPaymentComplete={handlePaymentComplete}
            onPaymentError={handlePaymentError}
          />
        </div>

        {/* Modal de confirmação de pagamento */}
        {isOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              <div className={`${styles.modalHeader} ${data?.success ? styles.success : styles.error}`}>
                <h3>{data?.success ? 'Pagamento Realizado' : 'Erro no Pagamento'}</h3>
              </div>
              
              <div className={styles.modalBody}>
                <p>{data?.message}</p>
                
                {data?.success && data?.transactionId && (
                  <p className={styles.transactionInfo}>
                    ID da Transação: <span>{data.transactionId}</span>
                  </p>
                )}
                
                {data?.success && data?.status && (
                  <p className={styles.statusInfo}>
                    Status: <span>{data.status}</span>
                  </p>
                )}
                
                {data?.success && data?.paymentUrl && (
                  <p className={styles.paymentUrlInfo}>
                    {data.transactionId?.startsWith('BOL_') 
                      ? 'Seu boleto foi gerado com sucesso!' 
                      : 'Seu QR Code PIX foi gerado com sucesso!'}
                  </p>
                )}
              </div>
              
              <div className={styles.modalFooter}>
                {data?.success && data?.paymentUrl && (
                  <button 
                    className={styles.viewPaymentButton}
                    onClick={handleViewPayment}
                  >
                    {data.transactionId?.startsWith('BOL_') 
                      ? 'Visualizar Boleto' 
                      : 'Visualizar QR Code PIX'}
                  </button>
                )}
                
                <button 
                  className={styles.continueButton}
                  onClick={handleContinueShopping}
                >
                  {data?.success 
                    ? 'Continuar Comprando' 
                    : 'Tentar Novamente'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutPage;
