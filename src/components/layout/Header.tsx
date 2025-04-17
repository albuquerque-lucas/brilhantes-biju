import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingCart, FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import styles from '../../styles/Header.module.scss';
import logo from '../../assets/images/logo.png';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const { isAuthenticated, user } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  // Efeito para detectar scroll da página
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Manipular envio do formulário de pesquisa
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/busca?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  // Alternar menu mobile
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Fechar menu mobile ao clicar em um link
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Calcular quantidade total de itens no carrinho
  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.topBar}>
        <div className={styles.container}>
          <div className={styles.contactInfo}>
            <span>Atendimento: (11) 99999-9999</span>
          </div>
          <div className={styles.userActions}>
            {isAuthenticated ? (
              <Link to="/minha-conta" className={styles.userLink}>
                <FaUser />
                <span>Olá, {user?.name?.split(' ')[0]}</span>
              </Link>
            ) : (
              <Link to="/login" className={styles.userLink}>
                <FaUser />
                <span>Entrar / Cadastrar</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className={styles.mainHeader}>
        <div className={styles.container}>
          <button 
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
            aria-label="Menu"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Link to="/" className={styles.logo}>
            <img src={logo} alt="Brilhante Biju" />
          </Link>

          <div className={styles.searchBar}>
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="O que você está procurando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" aria-label="Buscar">
                <FaSearch />
              </button>
            </form>
          </div>

          <Link to="/carrinho" className={styles.cartLink}>
            <FaShoppingCart />
            {cartItemsCount > 0 && (
              <span className={styles.cartCount}>{cartItemsCount}</span>
            )}
          </Link>
        </div>
      </div>

      <nav className={`${styles.mainNav} ${isMobileMenuOpen ? styles.open : ''}`}>
        <div className={styles.container}>
          <ul className={styles.navList}>
            <li>
              <Link to="/" onClick={closeMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/categoria/aneis" onClick={closeMobileMenu}>
                Anéis
              </Link>
            </li>
            <li>
              <Link to="/categoria/brincos" onClick={closeMobileMenu}>
                Brincos
              </Link>
            </li>
            <li>
              <Link to="/categoria/colares" onClick={closeMobileMenu}>
                Colares
              </Link>
            </li>
            <li>
              <Link to="/categoria/pulseiras" onClick={closeMobileMenu}>
                Pulseiras
              </Link>
            </li>
            <li>
              <Link to="/categoria/bolsas" onClick={closeMobileMenu}>
                Bolsas
              </Link>
            </li>
            <li>
              <Link to="/promocoes" onClick={closeMobileMenu}>
                Promoções
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Header;
