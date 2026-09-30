import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

declare const global: typeof globalThis;
import App from './App';
import { urls } from './config/urls';

jest.mock('three', () => {
  class MockObject3D { rotation = { x: 0, y: 0 }; position = { set: jest.fn() }; }
  class MockGeometry { setAttribute = jest.fn(); }
  class MockMaterial {}
  class MockRenderer { domElement = document.createElement('canvas'); setSize = jest.fn(); setPixelRatio = jest.fn(); render = jest.fn(); }
  class MockScene { add = jest.fn(); }
  class MockGroup extends MockObject3D { add = jest.fn(); }
  class MockCamera extends MockObject3D { aspect = 1; updateProjectionMatrix = jest.fn(); }
  return { AdditiveBlending: 2, BufferAttribute: class {}, BufferGeometry: MockGeometry, DodecahedronGeometry: MockGeometry, Group: MockGroup, IcosahedronGeometry: MockGeometry, Mesh: MockObject3D, MeshBasicMaterial: MockMaterial, OctahedronGeometry: MockGeometry, PerspectiveCamera: MockCamera, Points: MockObject3D, PointsMaterial: MockMaterial, Scene: MockScene, WebGLRenderer: MockRenderer };
});

describe('App routing', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: false, json: () => Promise.resolve({}) })) as unknown as typeof fetch;
  });

  it('renders home page at /', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
    expect(screen.getByText('Make the next move')).toBeInTheDocument();
  });

  it('renders the devices page at /devices', () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) })) as unknown as typeof fetch;
    render(<MemoryRouter initialEntries={['/devices']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Your devices' })).toBeInTheDocument();
  });

  it('renders the full-page add form with a back action beside submit', () => {
    render(<MemoryRouter initialEntries={['/devices/new']}><App /></MemoryRouter>);
    expect(screen.getByText('Add New Device')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Back to devices' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Device' })).toBeInTheDocument();
  });

  it('shows navigation links', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByText('Devices')).toBeInTheDocument();
  });

  it('fetches userinfo with credentials and shows Login when signed out', async () => {
    render(<MemoryRouter><App /></MemoryRouter>);

    expect(global.fetch).toHaveBeenCalledWith(urls.userInfo, { credentials: 'include' });
    const loginLink = await screen.findByRole('link', { name: 'Login' });
    expect(loginLink).toHaveAttribute('href', expect.stringContaining('/oauth2/sign_in'));
    expect(screen.queryByRole('img', { name: /Signed in as/ })).not.toBeInTheDocument();
  });

  it('shows an email initials avatar and Logout when signed in', async () => {
    const email = 'ankit.sharma@example.com';
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve({ user: '1', email }) })) as unknown as typeof fetch;
    render(<MemoryRouter><App /></MemoryRouter>);

    const avatar = await screen.findByLabelText(`Signed in as ${email}`);
    expect(avatar).toHaveTextContent('AN');
    expect(screen.getByRole('link', { name: 'Logout' })).toHaveAttribute('href', urls.logout);
    expect(screen.queryByRole('link', { name: 'Login' })).not.toBeInTheDocument();

    fireEvent.mouseOver(avatar);
    expect(await screen.findByRole('tooltip')).toHaveTextContent(email);
  });
});

describe('home screen', () => {
  it('renders the landing page content and primary actions', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Make the next move obvious/ })).toBeInTheDocument();
    expect(screen.getByText('Independent digital studio')).toBeInTheDocument();
    expect(screen.getByText('Sharp thinking')).toBeInTheDocument();
  });
});
