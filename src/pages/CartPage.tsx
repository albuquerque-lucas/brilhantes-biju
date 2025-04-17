import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../contexts/CartContext';
import styles from '../styles/CartPage.module.scss';

const CartPage = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    subtotal,
    shipping,
    discount,
    total,
    applyCoupon
  } = useCart();
  
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [couponSuccess, setCouponSuccess] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  // Manipular aplicação de cupom
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setCouponError('Digite um código de cupom válido');
      return;
    }
    
    setIsApplyingCoupon(true);
    setCouponError(null);
    setCouponSuccess(null);
    
    try {
      await applyCoupon(couponCode);
      setCouponSuccess('Cupom aplicado com sucesso!');
      setCouponCode('');
    } catch (error) {
      setCouponError('Cupom inválido ou expirado');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <div className={styles.cartHeader}>
          <h1>Meu Carrinho</h1>
          <Link to="/" className={styles.continueShopping}>
            <FaArrowLeft /> Continuar Comprando
          </Link>
        </div>

        {cartItems.length > 0 ? (
          <div className={styles.cartContent}>
            <div className={styles.cartItems}>
              <div className={styles.cartTable}>
                <div className={styles.cartTableHeader}>
                  <div className={styles.productCol}>Produto</div>
                  <div className={styles.priceCol}>Preço</div>
                  <div className={styles.quantityCol}>Quantidade</div>
                  <div className={styles.subtotalCol}>Subtotal</div>
                  <div className={styles.actionCol}></div>
                </div>
                
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.variation?.color?.id || ''}-${item.variation?.size?.id || ''}`} className={styles.cartItem}>
                    <div className={styles.productCol}>
                      <div className={styles.productInfo}>
                        <img src={item.image} alt={item.name} className={styles.productImage} />
                        <div className={styles.productDetails}>
                          <h3 className={styles.productName}>{item.name}</h3>
                          {item.variation && (
                            <div className={styles.productVariations}>
                              {item.variation.color && (
                                <span className={styles.variationColor}>
                                  Cor: {item.variation.color.name}
                                </span>
                              )}
                              {item.variation.size && (
                                <span className={styles.variationSize}>
                                  Tamanho: {item.variation.size.name}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className={styles.priceCol}>
                      <span className={styles.price}>R$ {item.price.toFixed(2)}</span>
                    </div>
                    
                    <div className={styles.quantityCol}>
                      <div className={styles.quantityControls}>
                        <button 
                          className={styles.quantityButton} 
                          onClick={() => updateQuantity(item.id, item.quantity - 1, item.variation)}
                          disabled={item.quantity <= 1}
                        >
                          <FaMinus />
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button 
                          className={styles.quantityButton} 
                          onClick={() => updateQuantity(item.id, item.quantity + 1, item.variation)}
                        >
                          <FaPlus />
                        </button>
                      </div>
                    </div>
                    
                    <div className={styles.subtotalCol}>
                      <span className={styles.subtotal}>
                        R$ {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    
                    <div className={styles.actionCol}>
                      <button 
                        className={styles.removeButton}
                        onClick={() => removeFromCart(item.id, item.variation)}
                        aria-label="Remover item"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className={styles.cartActions}>
                <button 
                  className={styles.clearCartButton}
                  onClick={clearCart}
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
            
            <div className={styles.cartSummary}>
              <h2 className={styles.summaryTitle}>Resumo do Pedido</h2>
              
              <div className={styles.summaryContent}>
                <div className={styles.summaryRow}>
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                
                <div className={styles.summaryRow}>
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
                  <div className={styles.summaryRow}>
                    <span>Desconto</span>
                    <span className={styles.discount}>-R$ {discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                  <span>Total</span>
                  <span className={styles.totalPrice}>R$ {total.toFixed(2)}</span>
                </div>
                
                <div className={styles.installments}>
                  ou em até 3x de R$ {(total / 3).toFixed(2)} sem juros
                </div>
                
                <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="coupon-code">Cupom de Desconto</label>
                    <div className={styles.couponInput}>
                      <input
                        type="text"
                        id="coupon-code"
                        placeholder="Digite seu cupom"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled={isApplyingCoupon}
                      />
                      <button 
                        type="submit" 
                        className={styles.applyCouponButton}
                        disabled={isApplyingCoupon}
                      >
                        Aplicar
                      </button>
                    </div>
                    {couponError && (
                      <span className={styles.couponError}>{couponError}</span>
                    )}
                    {couponSuccess && (
                      <span className={styles.couponSuccess}>{couponSuccess}</span>
                    )}
                  </div>
                </form>
                
                <Link to="/checkout" className={styles.checkoutButton}>
                  Finalizar Compra
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyCart}>
            <div className={styles.emptyCartContent}>
              <div className={styles.emptyCartIcon}>
                <FaTrash />
              </div>
              <h2>Seu carrinho está vazio</h2>
              <p>Adicione produtos ao seu carrinho para continuar comprando.</p>
              <Link to="/" className={styles.shopNowButton}>
                Comprar Agora
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
