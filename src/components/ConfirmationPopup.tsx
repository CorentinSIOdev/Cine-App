// ConfirmationPopup.tsx
import React from 'react';
import styles from '../styles/ConfirmationPopup.module.css';

interface ConfirmationPopupProps {
  message: string;
  onClose: () => void;
}

const ConfirmationPopup: React.FC<ConfirmationPopupProps> = ({ message, onClose }) => {
  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <p>{message}</p>
        <button className={styles.closeButton} onClick={onClose}>
          C'est compris !
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
