import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

const HomeButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/')}
      className={styles.homeIcon}
      title="Вернутся на главную страницу"
    >
      🏠
    </button>
  );
};

export default HomeButton;