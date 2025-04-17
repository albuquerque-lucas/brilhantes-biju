import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter, FaPinterest, FaEnvelope } from 'react-icons/fa';
import styles from '../../styles/Footer.module.scss';
import logo from '../../assets/images/logo.png';

const Footer: React.FC = () => {
  const [email, setEmail] = React.useState('');
  const [subscribed, setSubscribed] = React.useState(false);

  // Manipular inscrição na newsletter
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && validateEmail(email)) {
      // Simulação de envio para API
      setTimeout(() => {
        setSubscribed(true);
        setEmail('');
      }, 500);
    }
  };

  // Validar formato de email
  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerInfo}>
              <Link to="/" className={styles.footerLogo}>
                <img src={logo} alt="Brilhante Biju" />
              </Link>
              <p className={styles.footerDescription}>
                A Brilhante Biju oferece bijuterias elegantes e sofisticadas para todos os estilos.
                Nossos produtos são cuidadosamente selecionados para garantir qualidade e beleza.
              </p>
              <div className={styles.socialLinks}>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <FaFacebook />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                  <FaTwitter />
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">
                  <FaPinterest />
                </a>
              </div>
            </div>

            <div className={styles.footerLinks}>
              <h3>Categorias</h3>
              <ul>
                <li><Link to="/categoria/aneis">Anéis</Link></li>
                <li><Link to="/categoria/brincos">Brincos</Link></li>
                <li><Link to="/categoria/colares">Colares</Link></li>
                <li><Link to="/categoria/pulseiras">Pulseiras</Link></li>
                <li><Link to="/categoria/bolsas">Bolsas</Link></li>
                <li><Link to="/promocoes">Promoções</Link></li>
              </ul>
            </div>

            <div className={styles.footerLinks}>
              <h3>Informações</h3>
              <ul>
                <li><Link to="/sobre-nos">Sobre Nós</Link></li>
                <li><Link to="/contato">Contato</Link></li>
                <li><Link to="/politica-de-privacidade">Política de Privacidade</Link></li>
                <li><Link to="/termos-de-uso">Termos de Uso</Link></li>
                <li><Link to="/trocas-e-devolucoes">Trocas e Devoluções</Link></li>
                <li><Link to="/faq">Perguntas Frequentes</Link></li>
              </ul>
            </div>

            <div className={styles.footerNewsletter}>
              <h3>Newsletter</h3>
              <p>Inscreva-se para receber nossas novidades e promoções exclusivas.</p>
              {subscribed ? (
                <p className={styles.successMessage}>
                  Obrigado por se inscrever! Em breve você receberá nossas novidades.
                </p>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className={styles.formGroup}>
                  <input
                    type="email"
                    placeholder="Seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button type="submit" aria-label="Inscrever">
                    <FaEnvelope />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <p>&copy; {new Date().getFullYear()} Brilhante Biju. Todos os direitos reservados.</p>
          <div className={styles.footerBottomLinks}>
            <Link to="/politica-de-privacidade">Privacidade</Link>
            <Link to="/termos-de-uso">Termos</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
