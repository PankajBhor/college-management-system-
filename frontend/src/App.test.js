import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  expect(screen.getByText(/Jaihind Polytechnic, Kuran/i)).toBeInTheDocument();
  expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument();
});
