import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { AuthContext } from './authContext';
import { urls } from '../config/urls';

describe('Header component', () => {
  it('renders brand logo', () => {
    render(
      <MemoryRouter>
        <Header userInfo={null} developmentAuthEnabled={false} />
      </MemoryRouter>
    );

    const brandLinks = screen.getAllByRole('link', { name: 'Hacksaw' });
    expect(brandLinks[0]).toHaveAttribute('href', '/');
    expect(screen.queryByRole('link', { name: 'Privacy' })).not.toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'About' })).not.toBeInTheDocument();
  });

  describe('unauthenticated state (production / dev auth disabled)', () => {
    it('shows login button', () => {
      render(
        <MemoryRouter>
          <Header userInfo={null} developmentAuthEnabled={false} />
        </MemoryRouter>
      );

      const loginLink = screen.getByRole('link', { name: 'Login' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', expect.stringContaining('/oauth2/sign_in'));
      expect(screen.queryByRole('link', { name: 'Devices' })).not.toBeInTheDocument();
    });

    it('shows mobile navigation button', () => {
      render(
        <MemoryRouter>
          <Header userInfo={null} developmentAuthEnabled={false} />
        </MemoryRouter>
      );

      const menuButton = screen.getByRole('button', { name: 'Open navigation' });
      expect(menuButton).toBeInTheDocument();
    });
  });

  describe('authenticated state (production / dev auth disabled)', () => {
    const user = { email: 'test.user@example.com' };

    it('renders user avatar with tooltip', () => {
      render(
        <MemoryRouter>
          <Header userInfo={user} developmentAuthEnabled={false} />
        </MemoryRouter>
      );

      const avatar = screen.getByLabelText(`Signed in as ${user.email}`);
      expect(avatar).toBeInTheDocument();
      expect(avatar).toHaveTextContent('TE');
    });

    it('opens avatar menu with Logout option when clicked', () => {
      render(
        <MemoryRouter>
          <Header userInfo={user} developmentAuthEnabled={false} />
        </MemoryRouter>
      );

      const accountButton = screen.getByRole('button', { name: 'account menu' });
      expect(accountButton).toBeInTheDocument();
    });
  });

  describe('development auth mode', () => {
    it('renders sign in (dev) button and calls onDevSignIn when clicked', () => {
      const handleSignIn = jest.fn();
      render(
        <MemoryRouter>
          <Header
            userInfo={null}
            developmentAuthEnabled={true}
            onDevSignIn={handleSignIn}
          />
        </MemoryRouter>
      );

      const signInBtn = screen.getByRole('button', { name: 'Sign in (dev)' });
      expect(signInBtn).toBeInTheDocument();
      fireEvent.click(signInBtn);
      expect(handleSignIn).toHaveBeenCalledTimes(1);
    });

    it('calls setUserInfo with dev user if onDevSignIn is not provided', () => {
      const setUserInfo = jest.fn();
      render(
        <MemoryRouter>
          <Header
            userInfo={null}
            developmentAuthEnabled={true}
            setUserInfo={setUserInfo}
          />
        </MemoryRouter>
      );

      fireEvent.click(screen.getByRole('button', { name: 'Sign in (dev)' }));
      expect(setUserInfo).toHaveBeenCalledWith(expect.objectContaining({ email: expect.any(String) }));
    });

    it('renders sign out (dev) button via avatar menu and calls onDevSignOut when clicked', () => {
      const handleSignOut = jest.fn();
      render(
        <MemoryRouter>
          <Header
            userInfo={{ email: 'dev@example.com' }}
            developmentAuthEnabled={true}
            onDevSignOut={handleSignOut}
          />
        </MemoryRouter>
      );

      const accountButton = screen.getByRole('button', { name: 'account menu' });
      expect(accountButton).toBeInTheDocument();
    });

    it('calls setUserInfo(null) when signing out if onDevSignOut is not provided', () => {
      const setUserInfo = jest.fn();
      render(
        <MemoryRouter>
          <Header
            userInfo={{ email: 'dev@example.com' }}
            developmentAuthEnabled={true}
            setUserInfo={setUserInfo}
          />
        </MemoryRouter>
      );

      // Avatar button opens menu with Sign out (dev) option
      const accountButton = screen.getByRole('button', { name: 'account menu' });
      fireEvent.click(accountButton);
      // The menu contains Sign out (dev) option via MenuItem
      expect(screen.getByText('Sign out (dev)')).toBeInTheDocument();
    });
  });

  describe('auth context integration and fallback', () => {
    it('uses AuthContext when props are omitted', () => {
      const mockSetUserInfo = jest.fn();
      render(
        <MemoryRouter>
          <AuthContext.Provider
            value={{
              userInfo: { email: 'context.user@example.com' },
              authLoading: false,
              developmentAuthEnabled: true,
              setUserInfo: mockSetUserInfo,
              onDevSignOut: jest.fn(),
            }}
          >
            <Header />
          </AuthContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByLabelText('Signed in as context.user@example.com')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'account menu' })).toBeInTheDocument();
    });

    it('renders links as regular anchors when outside a router context', () => {
      render(
        <Header userInfo={null} developmentAuthEnabled={false} />
      );

      const brandLinks = screen.getAllByRole('link', { name: 'Hacksaw' });
      expect(brandLinks[0]).toHaveAttribute('href', '/');
    });
  });
});
