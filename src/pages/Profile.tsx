import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../styles/Movie.module.css';
import ConfirmationPopup from '../components/ConfirmationPopup';

interface MovieData {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  release_date: string;
  vote_average: number;
  genres?: { id: number; name: string }[];
}

interface Trailer {
  key: string;
  name: string;
}

const Profile: React.FC = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<MovieData[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayedUsername, setDisplayedUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Chargement des informations de l'utilisateur connecté
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userLoggedIn') || '{}');
    if (storedUser && typeof storedUser === 'object') {
      setUsername(storedUser.username || '');
      setEmail(storedUser.email || '');
      setDisplayedUsername(storedUser.username || '');
    } else {
      console.warn('Les données utilisateur ne sont pas valides.');
    }

    // Chargement des films favoris
    const storedFavorites = JSON.parse(localStorage.getItem('user.favoriteMovies') || '[]');
    setFavoriteMovies(storedFavorites);
  }, []);

  const removeFavorite = (movieId: number) => {
    const updatedFavorites = favoriteMovies.filter(movie => movie.id !== movieId);
    setFavoriteMovies(updatedFavorites);
    localStorage.setItem('user.favoriteMovies', JSON.stringify(updatedFavorites));
    if (selectedMovie?.id === movieId) {
      setConfirmationMessage('Le film a été supprimé des favoris.');
      closeModal();
    }
  };

  const closeConfirmation = () => {
    setConfirmationMessage(null);
  };

  const openModal = async (movie: MovieData) => {
    await fetchMovieDetails(movie.id);
    await fetchTrailer(movie.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    setTrailer(null);
  };

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
      );
      setSelectedMovie(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du film :', error);
    }
  };

  const fetchTrailer = async (movieId: number) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
      );
      const trailers = response.data.results;
      if (trailers.length > 0) {
        const randomTrailer = trailers[Math.floor(Math.random() * trailers.length)];
        setTrailer(randomTrailer);
      } else {
        setTrailer(null);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la bande-annonce :', error);
      setTrailer(null);
    }
  };

  const handleUpdateProfile = () => {
    // Validation des champs
    if (!username.trim() || !email.trim() || !password.trim()) {
      setErrorMessage('Tous les champs sont obligatoires.');
      return;
    }

    const updatedUser = { username: username.trim(), email: email.trim(), password: password.trim() };
    localStorage.setItem('userLoggedIn', JSON.stringify(updatedUser));
    setDisplayedUsername(username);
    setConfirmationMessage('Profil mis à jour avec succès');
    setErrorMessage(null); // Réinitialiser le message d'erreur
  };

  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 2); 
    return (
      <div>
        {Array.from({ length: 5 }, (_, index) => (
          <span key={index} className={index < stars ? styles['filled-star'] : styles['empty-star']}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className={styles['movies-container']}>
      <div className={styles.profileContainer}>
        <h2>Bonjour, {displayedUsername}!</h2>
        <form className={styles.profileForm}>
          <div className={styles.formGroup}>
            <label>Nom d'utilisateur</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
          <button
            type="button"
            onClick={handleUpdateProfile}
            className={styles.updateButton}
          >
            Mettre à jour le profil
          </button>
        </form>
        {confirmationMessage && (
          <ConfirmationPopup message={confirmationMessage} onClose={closeConfirmation} />
        )}
      </div>

      <h2>Mes Films Favoris</h2>
      <div className={styles['movies-list']}>
        {favoriteMovies.length > 0 ? (
          favoriteMovies.map(movie => (
            <div
              className={styles['movie-card']}
              key={movie.id}
              onClick={() => openModal(movie)}
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <div className={styles['movie-info']}>
                <h3 className={styles['movie-title']}>{movie.title}</h3>
                <div className={styles['movie-details']}>
                  <div className={styles['movie-rating']}>
                    {renderStars(movie.vote_average)}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Aucun film favori enregistré.</p>
        )}
      </div>
      {favoriteMovies.length > 0 && (
        <button
          className={styles['clear-all-button']}
          onClick={() => {
            setFavoriteMovies([]);
            localStorage.removeItem('user.favoriteMovies');
          }}
        >
          Supprimer tous les favoris
        </button>
      )}

      {isModalOpen && selectedMovie && (
        <div className={styles.modal}>
          <div className={styles['modal-content']}>
            <span className={styles['close-button']} onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.overview}</p>
            <p>Genres : {selectedMovie.genres?.map(genre => genre.name).join(', ') || 'N/A'}</p>
            <p>Date de sortie : {selectedMovie.release_date}</p>
            <div>Note : {renderStars(selectedMovie.vote_average)}</div>
            {trailer ? (
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title={trailer.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <p>Aucune bande-annonce disponible</p>
            )}
            <button
              className={styles['remove-favorite-button']}
              onClick={() => removeFavorite(selectedMovie.id)}
            >
              Supprimer des favoris
            </button>
          </div>
        </div>
      )}

      {confirmationMessage && (
        <ConfirmationPopup message={confirmationMessage} onClose={closeConfirmation} />
      )}
    </div>
  );
};

export default Profile;
