import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome text', () => {
  render(<App />);
  const welcomeText = screen.getByText(/Bienvenue sur CineApp !/i);
  expect(welcomeText).toBeInTheDocument();
});
