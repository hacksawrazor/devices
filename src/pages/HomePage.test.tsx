import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';

describe('HomePage', () => {
  it('renders landing content heading', () => {
    render(<HomePage />);
    expect(screen.getByText('Make the next move')).toBeInTheDocument();
  });

  it('displays approach sections', () => {
    render(<HomePage />);
    expect(screen.getByText('Find the signal')).toBeInTheDocument();
    expect(screen.getByText('Shape the system')).toBeInTheDocument();
    expect(screen.getByText('Ship with intent')).toBeInTheDocument();
  });

  it('shows signal cards', () => {
    render(<HomePage />);
    expect(screen.getByText('Sharp thinking')).toBeInTheDocument();
    expect(screen.getByText('Built for the bold.')).toBeInTheDocument();
  });

  it('displays contact CTA', () => {
    render(<HomePage />);
    expect(screen.getByText(/Have a sharp idea/)).toBeInTheDocument();
  });

  it('renders header and footer components', () => {
    render(<HomePage />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});

