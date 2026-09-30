import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

declare const global: any;
import App from './App';

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
  it('renders home page at /', () => {
    render(<MemoryRouter initialEntries={['/']}><App /></MemoryRouter>);
    expect(screen.getByText('Make the next move')).toBeInTheDocument();
  });

  it('renders add-device page at /add-device', () => {
    render(<MemoryRouter initialEntries={['/add-device']}><App /></MemoryRouter>);
    expect(screen.getByText('Add New Device')).toBeInTheDocument();
  });

  it('renders the devices page at /devices', () => {
    global.fetch = jest.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve([]) })) as unknown as typeof fetch;
    render(<MemoryRouter initialEntries={['/devices']}><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: 'Your devices' })).toBeInTheDocument();
  });

  it('shows navigation links', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByText('Add Device')).toBeInTheDocument();
    expect(screen.getByText('Devices')).toBeInTheDocument();
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
