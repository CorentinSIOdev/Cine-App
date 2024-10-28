import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/LoginRegister.module.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    const storedUser = localStorage.getItem(`user_${email}`);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      
      if (parsedUser.password === password) {
        localStorage.setItem('userLoggedIn', JSON.stringify(parsedUser));
        alert('Connexion réussie !');
        navigate('/movie');
      } else {
        alert('Mot de passe incorrect.');
      }
    } else {
      alert('Utilisateur non trouvé.');
    }
  };

  return (
    <div className={styles['page-wrapper']}>
      <div className={styles['form-container']}>
        <h2 className={styles['form-title']}>Login</h2>
        <form onSubmit={handleLogin}>
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
          <button type="submit" className={styles['form-button']}>Se connecter</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
