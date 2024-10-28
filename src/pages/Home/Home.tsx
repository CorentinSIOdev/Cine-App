import React from 'react';
import { useNavigate } from 'react-router-dom';
import YouTube from 'react-youtube';
import styles from '../../styles/Home.module.css';
import Button from '../../components/ButtonComponent';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const videoOptions = {
    playerVars: {
      autoplay: 1,
      loop: 1,
      mute: 1,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      disablekb: 1,
      rel: 0,
      iv_load_policy: 3,
      fs: 0,
      vq: 'hd1080',
      listType: 'playlist',
      list: 'PLuAiHxLeTqiTeCoAiB39PUYALbxKprq6e',
    },
  };

  return (
    <div className={styles.homeContainer}>
      {/* YouTube Video Background */}
      <div className={styles.backgroundVideo}>
        <YouTube opts={videoOptions} />
      </div>

      {/* Contenu au-dessus de la vidéo */}
      <div className={styles.content}>
        <h1>Bienvenue sur CineApp !</h1>
        <p>Profitez de films et séries en illimité, partout et à tout moment.</p>
        <Button label="Connexion" onClick={() => navigate('/login')} />
        <Button label="Inscription" onClick={() => navigate('/register')} />
      </div>
    </div>
  );
};

export default Home;
