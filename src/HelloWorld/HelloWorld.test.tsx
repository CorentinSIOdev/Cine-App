import React from 'react';
import { render, screen } from '@testing-library/react';
import HelloWorld from './HelloWorld';

test.only('renders Hello World message', () => {
  render(<HelloWorld />);
  const helloWorldElement = screen.getByText(/Hello World for unit test/i);
  expect(helloWorldElement).toBeInTheDocument();
});
