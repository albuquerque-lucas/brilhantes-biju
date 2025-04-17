import React from 'react';
import { Link } from 'react-router-dom';
import { FaExclamationTriangle, FaHome, FaArrowLeft } from 'react-icons/fa';
import styles from '../styles/NotFoundPage.module.scss';

const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.notFoundContent}>
        <div className={styles.errorIcon}>
          <FaExclamationTriangle size={64} />
        </div>
        
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorTitle}>Página não encontrada</h2>
        
        <p className={styles.errorMessage}>
          Desculpe, a página que você está procurando não existe ou foi movida.
        </p>
        
        <div className={styles.actionButtons}>
          <Link to="/" className={styles.homeButton}>
            <FaHome className={styles.buttonIcon} />
            Voltar para a Página Inicial
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className={styles.backButton}
          >
            <FaArrowLeft className={styles.buttonIcon} />
            Voltar para a Página Anterior
          </button>
        </div>
        
        <div className={styles.suggestionsSection}>
          <h3>Você pode estar procurando por:</h3>
          <ul className={styles.suggestionsList}>
            <li>
              <Link to="/categoria/aneis">Anéis</Link>
            </li>
            <li>
              <Link to="/categoria/colares">Colares</Link>
            </li>
            <li>
              <Link to="/categoria/brincos">Brincos</Link>
            </li>
            <li>
              <Link to="/categoria/pulseiras">Pulseiras</Link>
            </li>
            <li>
              <Link to="/categoria/bolsas">Bolsas</Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
