import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaAddressCard, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import styles from '../styles/AccountPage.module.scss';

// Componentes internos da página de conta
const AccountOverview: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className={styles.accountSection}>
      <h2>Visão Geral da Conta</h2>
      
      <div className={styles.userInfo}>
        <div className={styles.userAvatar}>
          {user?.name ? user.name.charAt(0).toUpperCase() : <FaUser />}
        </div>
        
        <div className={styles.userDetails}>
          <h3>{user?.name}</h3>
          <p>{user?.email}</p>
          <p>Cliente desde: {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pt-BR') : 'N/A'}</p>
        </div>
      </div>
      
      <div className={styles.accountStats}>
        <div className={styles.statItem}>
          <h4>Pedidos</h4>
          <p>{user?.orders?.length || 0}</p>
        </div>
        
        <div className={styles.statItem}>
          <h4>Lista de Desejos</h4>
          <p>{user?.wishlist?.length || 0}</p>
        </div>
        
        <div className={styles.statItem}>
          <h4>Avaliações</h4>
          <p>{user?.reviews?.length || 0}</p>
        </div>
      </div>
    </div>
  );
};

const OrdersSection: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulação de carregamento de pedidos
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        // Em uma implementação real, isso seria uma chamada de API
        // Aqui estamos apenas simulando alguns pedidos
        setTimeout(() => {
          setOrders([
            {
              id: 'ORD123456',
              date: new Date(2025, 3, 10),
              status: 'Entregue',
              total: 189.90,
              items: [
                { id: 1, name: 'Anel Solitário Elegance', price: 89.90, quantity: 1 },
                { id: 2, name: 'Brinco Gota Cristal', price: 69.90, quantity: 1 },
                { id: 3, name: 'Pulseira Charm', price: 30.10, quantity: 1 }
              ]
            },
            {
              id: 'ORD123457',
              date: new Date(2025, 3, 5),
              status: 'Em processamento',
              total: 139.80,
              items: [
                { id: 2, name: 'Brinco Gota Cristal', price: 69.90, quantity: 2 }
              ]
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        setIsLoading(false);
      }
    };
    
    loadOrders();
  }, [user]);
  
  if (isLoading) {
    return <div className={styles.loading}>Carregando seus pedidos...</div>;
  }
  
  if (orders.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FaShoppingBag size={48} />
        <h3>Você ainda não fez nenhum pedido</h3>
        <p>Quando você fizer um pedido, ele aparecerá aqui.</p>
        <Link to="/" className={styles.shopNowButton}>Comprar Agora</Link>
      </div>
    );
  }
  
  return (
    <div className={styles.accountSection}>
      <h2>Meus Pedidos</h2>
      
      <div className={styles.ordersList}>
        {orders.map(order => (
          <div key={order.id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div>
                <h3>Pedido #{order.id}</h3>
                <p>Data: {order.date.toLocaleDateString('pt-BR')}</p>
              </div>
              <div className={styles.orderStatus}>
                <span className={`${styles.status} ${styles[order.status.toLowerCase().replace(' ', '')]}`}>
                  {order.status}
                </span>
              </div>
            </div>
            
            <div className={styles.orderItems}>
              {order.items.map((item: any) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemQuantity}>Qtd: {item.quantity}</p>
                  </div>
                  <p className={styles.itemPrice}>
                    R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                </div>
              ))}
            </div>
            
            <div className={styles.orderFooter}>
              <p className={styles.orderTotal}>
                Total: <span>R$ {order.total.toFixed(2).replace('.', ',')}</span>
              </p>
              <Link to={`/minha-conta/pedidos/${order.id}`} className={styles.viewOrderButton}>
                Ver Detalhes
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WishlistSection: React.FC = () => {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulação de carregamento da lista de desejos
    const loadWishlist = async () => {
      setIsLoading(true);
      try {
        // Em uma implementação real, isso seria uma chamada de API
        setTimeout(() => {
          setWishlist([
            {
              id: 1,
              name: 'Colar Pingente Coração',
              price: 99.90,
              image: '/src/assets/images/product-necklace-1.jpg'
            },
            {
              id: 2,
              name: 'Anel Solitário Elegance',
              price: 89.90,
              image: '/src/assets/images/product-ring-1.jpg'
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar lista de desejos:', error);
        setIsLoading(false);
      }
    };
    
    loadWishlist();
  }, []);
  
  if (isLoading) {
    return <div className={styles.loading}>Carregando sua lista de desejos...</div>;
  }
  
  if (wishlist.length === 0) {
    return (
      <div className={styles.emptyState}>
        <FaHeart size={48} />
        <h3>Sua lista de desejos está vazia</h3>
        <p>Adicione itens à sua lista de desejos para encontrá-los facilmente mais tarde.</p>
        <Link to="/" className={styles.shopNowButton}>Explorar Produtos</Link>
      </div>
    );
  }
  
  return (
    <div className={styles.accountSection}>
      <h2>Minha Lista de Desejos</h2>
      
      <div className={styles.wishlistGrid}>
        {wishlist.map(item => (
          <div key={item.id} className={styles.wishlistItem}>
            <div className={styles.wishlistItemImage}>
              <img src={item.image} alt={item.name} />
            </div>
            
            <div className={styles.wishlistItemInfo}>
              <h3>{item.name}</h3>
              <p className={styles.wishlistItemPrice}>
                R$ {item.price.toFixed(2).replace('.', ',')}
              </p>
              
              <div className={styles.wishlistItemActions}>
                <button className={styles.addToCartButton}>
                  Adicionar ao Carrinho
                </button>
                <button className={styles.removeFromWishlistButton}>
                  Remover
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AddressesSection: React.FC = () => {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulação de carregamento de endereços
    const loadAddresses = async () => {
      setIsLoading(true);
      try {
        // Em uma implementação real, isso seria uma chamada de API
        setTimeout(() => {
          setAddresses([
            {
              id: 1,
              name: 'Casa',
              street: 'Rua das Flores',
              number: '123',
              complement: 'Apto 101',
              neighborhood: 'Jardim Primavera',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01234-567',
              isDefault: true
            },
            {
              id: 2,
              name: 'Trabalho',
              street: 'Avenida Paulista',
              number: '1000',
              complement: 'Sala 1010',
              neighborhood: 'Bela Vista',
              city: 'São Paulo',
              state: 'SP',
              zipCode: '01310-100',
              isDefault: false
            }
          ]);
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao carregar endereços:', error);
        setIsLoading(false);
      }
    };
    
    loadAddresses();
  }, []);
  
  if (isLoading) {
    return <div className={styles.loading}>Carregando seus endereços...</div>;
  }
  
  return (
    <div className={styles.accountSection}>
      <h2>Meus Endereços</h2>
      
      <div className={styles.addressList}>
        {addresses.map(address => (
          <div key={address.id} className={`${styles.addressCard} ${address.isDefault ? styles.defaultAddress : ''}`}>
            {address.isDefault && <span className={styles.defaultBadge}>Padrão</span>}
            
            <h3>{address.name}</h3>
            
            <div className={styles.addressDetails}>
              <p>{address.street}, {address.number}</p>
              {address.complement && <p>{address.complement}</p>}
              <p>{address.neighborhood}</p>
              <p>{address.city} - {address.state}</p>
              <p>CEP: {address.zipCode}</p>
            </div>
            
            <div className={styles.addressActions}>
              <button className={styles.editButton}>Editar</button>
              {!address.isDefault && (
                <>
                  <button className={styles.setDefaultButton}>Definir como Padrão</button>
                  <button className={styles.deleteButton}>Excluir</button>
                </>
              )}
            </div>
          </div>
        ))}
        
        <div className={styles.addAddressCard}>
          <FaAddressCard size={32} />
          <p>Adicionar Novo Endereço</p>
          <button className={styles.addButton}>Adicionar</button>
        </div>
      </div>
    </div>
  );
};

const AccountSettings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.email) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }
    
    if (showPasswordSection) {
      if (!formData.currentPassword) {
        newErrors.currentPassword = 'Senha atual é obrigatória';
      }
      
      if (!formData.newPassword) {
        newErrors.newPassword = 'Nova senha é obrigatória';
      } else if (formData.newPassword.length < 6) {
        newErrors.newPassword = 'A senha deve ter pelo menos 6 caracteres';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = 'As senhas não coincidem';
      }
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Em uma implementação real, isso seria uma chamada de API
      // Simulando uma atualização bem-sucedida
      setTimeout(() => {
        setIsLoading(false);
        alert('Informações atualizadas com sucesso!');
        setShowPasswordSection(false);
        setFormData({
          ...formData,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      setErrors({
        ...errors,
        general: 'Erro ao atualizar informações'
      });
    }
  };
  
  return (
    <div className={styles.accountSection}>
      <h2>Configurações da Conta</h2>
      
      {errors.general && (
        <div className={styles.errorMessage}>
          {errors.general}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.settingsForm}>
        <div className={styles.formGroup}>
          <label htmlFor="name" className={styles.label}>
            Nome Completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.input}
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className={styles.error}>{errors.name}</span>}
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.input}
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className={styles.error}>{errors.email}</span>}
        </div>
        
        <div className={styles.passwordSection}>
          <button
            type="button"
            className={styles.togglePasswordButton}
            onClick={() => setShowPasswordSection(!showPasswordSection)}
          >
            {showPasswordSection ? 'Cancelar Alteração de Senha' : 'Alterar Senha'}
          </button>
          
          {showPasswordSection && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="currentPassword" className={styles.label}>
                  Senha Atual
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  className={styles.input}
                  value={formData.currentPassword}
                  onChange={handleChange}
                />
                {errors.currentPassword && <span className={styles.error}>{errors.currentPassword}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="newPassword" className={styles.label}>
                  Nova Senha
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  className={styles.input}
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                {errors.newPassword && <span className={styles.error}>{errors.newPassword}</span>}
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirmar Nova Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  className={styles.input}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && <span className={styles.error}>{errors.confirmPassword}</span>}
              </div>
            </>
          )}
        </div>
        
        <button 
          type="submit" 
          className={styles.saveButton}
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </form>
      
      <div className={styles.dangerZone}>
        <h3>Zona de Perigo</h3>
        
        <button 
          type="button" 
          className={styles.logoutButton}
          onClick={handleLogout}
        >
          <FaSignOutAlt className={styles.icon} />
          Sair da Conta
        </button>
        
        <button 
          type="button" 
          className={styles.deleteAccountButton}
          onClick={() => confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')}
        >
          Excluir Conta
        </button>
      </div>
    </div>
  );
};

// Componente principal da página de conta
const AccountPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirecionar se não estiver autenticado (isso é um backup, já que a rota é protegida)
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);
  
  if (!user) {
    return null; // Não renderiza nada enquanto verifica autenticação
  }
  
  return (
    <div className={styles.accountPageContainer}>
      <div className={styles.accountSidebar}>
        <h2>Minha Conta</h2>
        
        <nav className={styles.accountNav}>
          <Link to="/minha-conta" className={styles.navLink} end>
            <FaUser className={styles.navIcon} />
            Visão Geral
          </Link>
          
          <Link to="/minha-conta/pedidos" className={styles.navLink}>
            <FaShoppingBag className={styles.navIcon} />
            Meus Pedidos
          </Link>
          
          <Link to="/minha-conta/lista-desejos" className={styles.navLink}>
            <FaHeart className={styles.navIcon} />
            Lista de Desejos
          </Link>
          
          <Link to="/minha-conta/enderecos" className={styles.navLink}>
            <FaAddressCard className={styles.navIcon} />
            Endereços
          </Link>
          
          <Link to="/minha-conta/configuracoes" className={styles.navLink}>
            <FaUser className={styles.navIcon} />
            Configurações
          </Link>
        </nav>
      </div>
      
      <div className={styles.accountContent}>
        <Routes>
          <Route index element={<AccountOverview />} />
          <Route path="pedidos" element={<OrdersSection />} />
          <Route path="lista-desejos" element={<WishlistSection />} />
          <Route path="enderecos" element={<AddressesSection />} />
          <Route path="configuracoes" element={<AccountSettings />} />
        </Routes>
      </div>
    </div>
  );
};

export default AccountPage;
