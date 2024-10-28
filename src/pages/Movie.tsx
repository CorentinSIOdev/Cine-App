import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import styles from '../styles/Movie.module.css';
import ConfirmationPopup from '../components/ConfirmationPopup';

interface MovieData {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  genres?: { id: number; name: string }[];
}

interface Trailer {
  key: string;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface Language {
  iso_639_1: string;
  english_name: string;
}


const Movie: React.FC = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedMovie, setSelectedMovie] = useState<MovieData | null>(null);
  const [trailer, setTrailer] = useState<Trailer | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmationMessage, setConfirmationMessage] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [availableLanguages, setAvailableLanguages] = useState<Language[]>([]);
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [filtersRestored, setFiltersRestored] = useState(false); 
  const navigate = useNavigate();

  // Récupération des genres et langues depuis l'API
  useEffect(() => {
    const fetchGenresAndLanguages = async () => {
      try {
        const genreResponse = await axios.get(
          `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
        );
        setAvailableGenres(genreResponse.data.genres);

        const languageResponse = await axios.get(
          `https://api.themoviedb.org/3/configuration/languages?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        setAvailableLanguages(languageResponse.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des genres ou langues :', error);
      }
    };

    fetchGenresAndLanguages();

    // Restaurer les filtres depuis le localStorage
    const storedGenre = localStorage.getItem('selectedGenre');
    const storedYear = localStorage.getItem('selectedYear');
    const storedLanguage = localStorage.getItem('selectedLanguage');
    const storedRating = localStorage.getItem('selectedRating');

    if (storedGenre) setSelectedGenre(storedGenre);
    if (storedYear) setSelectedYear(storedYear);
    if (storedLanguage) setSelectedLanguage(storedLanguage);
    if (storedRating) setSelectedRating(parseInt(storedRating, 10));

    setFiltersRestored(true); // Marque les filtres comme restaurés
  }, []);

  // Fonction pour récupérer les films
  const fetchMovies = useCallback(async (page: number) => {
    try {
      const genreQuery = selectedGenre ? `&with_genres=${selectedGenre}` : '';
      const ratingQuery = selectedRating ? `&vote_average.gte=${selectedRating * 2}` : '';
      const yearQuery = selectedYear ? `&primary_release_year=${selectedYear}` : '';
      const languageQuery = selectedLanguage ? `&with_original_language=${selectedLanguage}` : '';
      
      const response = await axios.get(
        `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR&page=${page}&sort_by=${sortBy}${genreQuery}${ratingQuery}${yearQuery}${languageQuery}`
      );

      setMovies(response.data.results);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error('Erreur lors de la récupération des films :', error);
    }
  }, [selectedGenre, selectedRating, sortBy, selectedYear, selectedLanguage]);

  // Charger les films lors de la modification des filtres ou du changement de page
  useEffect(() => {
    if (filtersRestored) {
      fetchMovies(currentPage);
    }
  }, [currentPage, fetchMovies, filtersRestored]);

  // Sauvegarder les filtres dans le localStorage
  useEffect(() => {
    if (filtersRestored) { 
      localStorage.setItem('selectedGenre', selectedGenre);
      localStorage.setItem('selectedYear', selectedYear);
      localStorage.setItem('selectedLanguage', selectedLanguage);
      localStorage.setItem('selectedRating', selectedRating.toString());
    }
  }, [selectedGenre, selectedYear, selectedLanguage, selectedRating, filtersRestored]);

  // Gérer les changements de filtres
  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGenre(e.target.value);
  };

  const handleRatingChange = (rating: number) => {
    setSelectedRating(rating);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedYear(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const fetchMovieDetails = async (movieId: number) => {
    try {
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=fr-FR`
      );
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération des détails du film :', error);
      return null;
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

  const openModal = async (movie: MovieData) => {
    const movieDetails = await fetchMovieDetails(movie.id);
    if (movieDetails) {
      setSelectedMovie({ ...movie, genres: movieDetails.genres });
    } else {
      setSelectedMovie(movie);
    }
    await fetchTrailer(movie.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    setTrailer(null);
  };

  const addToFavorites = (movie: MovieData) => {
    const existingFavorites = JSON.parse(localStorage.getItem('user.favoriteMovies') || '[]');
    const isAlreadyFavorite = existingFavorites.some((fav: MovieData) => fav.id === movie.id);
    if (isAlreadyFavorite) {
      setConfirmationMessage(`${movie.title} est déjà dans votre liste de favoris !`);
      closeModal();
      return;
    }
    const updatedFavorites = [...existingFavorites, movie];
    localStorage.setItem('user.favoriteMovies', JSON.stringify(updatedFavorites));
    if (selectedMovie) {
      setConfirmationMessage(`${movie.title} a été ajouté aux favoris !`);
      closeModal();
    }
  };

  const closeConfirmation = () => {
    setConfirmationMessage(null);
  };

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <div className={styles['search-filter-container']}>
        <input
          type="text"
          placeholder="Rechercher un film..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles['search-bar']}
        />
        <select className={styles['filter-select']} value={selectedGenre} onChange={handleGenreChange}>
          <option value="">Tous les genres</option>
          {availableGenres.map(genre => (
            <option key={genre.id} value={genre.id}>{genre.name}</option>
          ))}
        </select>
        <div className={styles['rating-filter']}>
          {[1, 2, 3, 4, 5].map(star => (
            <span
              key={star}
              className={star <= selectedRating ? styles['filled-star'] : styles['empty-star']}
              onClick={() => handleRatingChange(star)}
            >
              ★
            </span>
          ))}
        </div>
        <select className={styles['filter-select']} value={selectedYear} onChange={handleYearChange}>
          <option value="">Toutes les années</option>
          {Array.from({ length: 50 }, (_, index) => {
            const year = new Date().getFullYear() - index;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <select className={styles['filter-select']} value={selectedLanguage} onChange={handleLanguageChange}>
          <option value="">Toutes les langues</option>
          {availableLanguages.map(language => (
            <option key={language.iso_639_1} value={language.iso_639_1}>{language.english_name}</option>
          ))}
        </select>
        <select className={styles['sort-select']} value={sortBy} onChange={handleSortChange}>
          <option value="popularity.desc">Popularité (décroissante)</option>
          <option value="popularity.asc">Popularité (croissante)</option>
          <option value="release_date.desc">Date de sortie (récente)</option>
          <option value="release_date.asc">Date de sortie (ancienne)</option>
          <option value="vote_average.desc">Note (décroissante)</option>
          <option value="vote_average.asc">Note (croissante)</option>
        </select>
      </div>

      <button
        className={styles['favorites-button']}
        onClick={() => navigate('/profile')}
      >
        Voir mon profil / mes favoris
      </button>

      <h2>Films Populaires</h2>
      <div className={styles['movies-list']}>
        {filteredMovies.length > 0 ? (
          filteredMovies.map(movie => (
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
          <p>Aucun film correspondant.</p>
        )}
      </div>

      {isModalOpen && selectedMovie && (
        <div className={styles.modal}>
          <div className={styles['modal-content']}>
            <span className={styles['close-button']} onClick={closeModal}>
              &times;
            </span>
            <h2>{selectedMovie.title}</h2>
            <p>{selectedMovie.overview}</p>
            <p>Genres : {selectedMovie.genres?.map(genre => genre.name).join(', ') || 'Non disponible'}</p>
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
              className={styles['favorite-button']}
              onClick={() => addToFavorites(selectedMovie)}
            >
              Ajouter aux favoris
            </button>
          </div>
        </div>
      )}

      {confirmationMessage && (
        <ConfirmationPopup message={confirmationMessage} onClose={closeConfirmation} />
      )}

      <div className={styles['pagination']}>
        <button
          className={`${styles['pagination-button']} ${currentPage === 1 ? styles['disabled'] : ''}`}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Précédent
        </button>
        <button
          className={`${styles['pagination-button']} ${currentPage === totalPages ? styles['disabled'] : ''}`}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Suivant
        </button>
      </div>
    </div>
  );
};

export default Movie;
