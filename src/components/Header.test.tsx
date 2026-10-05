import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header';
import { AuthContext } from './authContext';
import { urls } from '../config/urls';

describe('Header component', () => {
  it('renders brand logo and default links', () => {
    render(
      <MemoryRouter>
        <Header userInfo={null} developmentAuthEnabled={false} />
      </MemoryRouter>
    );

    const brandLinks = screen.getAllByRole('link', { name: 'Hacksaw' });
    expect(brandLinks[0]).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/');
  });

  describe('unauthenticated state (production / dev auth disabled)', () => {
    it('shows login button and hides devices link', () => {
      render(
        <MemoryRouter>
          <Header userInfo={null} developmentAuthEnabled={false} />
        </MemoryRouter>
      );

      const loginLink = screen.getByRole('link', { name: 'Login' });
      expect(loginLink).toBeInTheDocument();
      expect(loginLink).toHaveAttribute('href', expect.stringContaining('/oauth2/sign_in'));
      expect(screen.queryByRole('link', { name: 'Devices' })).not.toBeInTheDocument();
      expect(screen.queryByRole('img', { name: /Signed in as/ })).not.toBeInTheDocument();
    });

    it('does not include devices link in the mobile navigation menu', () => {
      render(
        <MemoryRouter>
          <Header userInfo={null} developmentAuthEnabled={false} />
        </MemoryRouter>
      );

      const menuButton = screen.getByRole('button', { name: 'Open navigation' });
      fireEvent.click(menuButton);

      expect(screen.getByRole('menuitem', { name: 'Home' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'Privacy' })).toBeInTheDocument();
      expect(screen.getByRole('menuitem', { name: 'About' })).toBeInTheDocument();
      expect(screen.queryByRole('menuitem', { name: 'Devices' })).not.toBeInTheDocument();
    });
  });

  describe('authenticated state (production / dev auth disabled)', () => {
    const user = { email: 'test.user@example.com' };

    it('renders devices link, user avatar, and logout button', async () => {
      render(
        <MemoryRouter>
          <Header userInfo={user} developmentAuthEnabled={false} />
        </MemoryRouter>
      );

      expect(screen.getByRole('link', { name: 'Devices' })).toHaveAttribute('href', '/devices');
      const avatar = screen.getByLabelText(`Signed in as ${user.email}`);
      expect(avatar).toHaveTextContent('TE');

      const logoutLink = screen.getByRole('link', { name: 'Logout' });
      expect(logoutLink).toHaveAttribute('href', urls.logout);
      expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();

      fireEvent.mouseOver(avatar);
      expect(await screen.findByRole('tooltip')).toHaveTextContent(user.email);
    });

    it('includes devices link in the mobile navigation menu and closes on click', () => {
      render(
        <MemoryRouter>
          <Header userInfo={user} developmentAuthEnabled={false} />
        </MemoryRouter>
      );

      const menuButton = screen.getByRole('button', { name: 'Open navigation' });
      fireEvent.click(menuButton);

      const devicesMenuItem = screen.getByRole('menuitem', { name: 'Devices' });
      expect(devicesMenuItem).toHaveAttribute('href', '/devices');

      fireEvent.click(devicesMenuItem);
      expect(screen.queryByRole('menuitem', { name: 'Devices' })).not.toBeInTheDocument();
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

    it('renders sign out (dev) button and calls onDevSignOut when clicked', () => {
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

      const signOutBtn = screen.getByRole('button', { name: 'Sign out (dev)' });
      expect(signOutBtn).toBeInTheDocument();
      fireEvent.click(signOutBtn);
      expect(handleSignOut).toHaveBeenCalledTimes(1);
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

      fireEvent.click(screen.getByRole('button', { name: 'Sign out (dev)' }));
      expect(setUserInfo).toHaveBeenCalledWith(null);
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
      expect(screen.getByRole('button', { name: 'Sign out (dev)' })).toBeInTheDocument();
    });

    it('renders links as regular anchors when outside a router context', () => {
      render(
        <Header userInfo={null} developmentAuthEnabled={false} />
      );

      const brandLinks = screen.getAllByRole('link', { name: 'Hacksaw' });
      expect(brandLinks[0]).toHaveAttribute('href', '/');
      expect(screen.getByRole('link', { name: 'Privacy' })).toHaveAttribute('href', '/');
    });
  });
});

