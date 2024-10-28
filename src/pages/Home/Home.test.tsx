import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Home from './Home';

// Mock de useNavigate pour capturer les appels de navigation
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Définir le type des props pour le mock de YouTube
interface YouTubeMockProps {
  opts: {
    playerVars: {
      autoplay: number;
      loop: number;
      mute: number;
      controls: number;
      showinfo: number;
      modestbranding: number;
      disablekb: number;
      rel: number;
      iv_load_policy: number;
      fs: number;
      vq: string;
      listType: string;
      list: string;
    };
  };
}

// Mock de YouTube pour capturer les props passés
jest.mock('react-youtube', () => {
  return ({ opts }: YouTubeMockProps) => (
    <div data-testid="youtube-component" data-opts={JSON.stringify(opts)} />
  );
});

describe('Home Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    // Remet le mock à zéro avant chaque test
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    // Réinitialiser le mock après chaque test
    mockNavigate.mockReset();
  });

  it('renders the title, text, and buttons correctly', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Vérification de la présence du titre
    expect(screen.getByText('Bienvenue sur CineApp !')).toBeInTheDocument();
    
    // Vérification de la présence du texte descriptif
    expect(screen.getByText('Profitez de films et séries en illimité, partout et à tout moment.')).toBeInTheDocument();
    
    // Vérification de la présence des boutons
    expect(screen.getByText('Connexion')).toBeInTheDocument();
    expect(screen.getByText('Inscription')).toBeInTheDocument();
  });

  it('navigates to /login when Connexion button is clicked', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Clique sur le bouton "Connexion"
    fireEvent.click(screen.getByText('Connexion'));

    // Vérifie que la fonction navigate a été appelée avec '/login'
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('navigates to /register when Inscription button is clicked', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Clique sur le bouton "Inscription"
    fireEvent.click(screen.getByText('Inscription'));

    // Vérifie que la fonction navigate a été appelée avec '/register'
    expect(mockNavigate).toHaveBeenCalledWith('/register');
  });
});

describe('Home Component - YouTube Video', () => {
  it('renders the YouTube video with correct options', () => {
    render(
      <BrowserRouter>
        <Home />
      </BrowserRouter>
    );

    // Vérifie que le composant YouTube est rendu
    const youtubeComponent = screen.getByTestId('youtube-component');
    expect(youtubeComponent).toBeInTheDocument();

    // Vérifie les options de configuration de la vidéo
    const expectedOptions = JSON.stringify({
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
    });

    // Compare les options en accédant au data-opts
    expect(youtubeComponent.getAttribute('data-opts')).toEqual(expectedOptions);
  });
});
