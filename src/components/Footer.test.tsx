import { render, screen } from '@testing-library/react';
import Footer from './Footer';

describe('Footer component', () => {
  it('renders copyright and tagline', () => {
    render(<Footer />);

    expect(screen.getByText('© 2026 Hacksaw Studio')).toBeInTheDocument();
    expect(screen.getByText('Strategy with an edge.')).toBeInTheDocument();
  });

  it('renders in a semantic footer landmark', () => {
    render(<Footer />);

    const footerElement = screen.getByRole('contentinfo');
    expect(footerElement).toBeInTheDocument();
    expect(footerElement).toHaveTextContent('© 2026 Hacksaw Studio');
    expect(footerElement).toHaveTextContent('Strategy with an edge.');
  });
});
