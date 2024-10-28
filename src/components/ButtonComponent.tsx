import React from 'react';
import styles from '../styles/Button.module.css';

interface ButtonComponentProps {
  label: string;
  onClick: () => void;
}

const Button: React.FC<ButtonComponentProps> = ({ label, onClick }) => {
  return (
    <button className={styles.button} onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
