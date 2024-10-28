import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/LoginRegister.module.css';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Génération automatique de l'ID unique
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password,
    };

    // Sauvegarde des données utilisateur avec l'ID unique généré
    localStorage.setItem(`user_${email}`, JSON.stringify(newUser));

    alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
    navigate('/login');
  };

  return (
    <div className={styles['page-wrapper']}>
      <div className={styles['register-container']}>
        <h2 className={styles['form-title']}>Register</h2>
        <form onSubmit={handleRegister}>
          {/* Champ Nom d'utilisateur */}
          <div>
            <label className={styles['form-label']}>Nom d'utilisateur:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className={styles['form-input']}
            />
          </div>

          {/* Champ Email */}
          <div>
            <label className={styles['form-label']}>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles['form-input']}
            />
          </div>

          {/* Champ Mot de passe */}
          <div>
            <label className={styles['form-label']}>Mot de passe:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles['form-input']}
            />
          </div>

          {/* Bouton de soumission */}
          <button type="submit" className={styles['form-button']}>S'inscrire</button>
        </form>
      </div>
    </div>
  );
};

export default Register;
