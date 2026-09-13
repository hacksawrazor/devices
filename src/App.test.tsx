import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('three', () => {
  class MockObject3D {
    rotation = { x: 0, y: 0 };
    position = { set: jest.fn() };
  }

  class MockGeometry {
    setAttribute = jest.fn();
  }

  class MockMaterial {}

  class MockRenderer {
    domElement = document.createElement('canvas');
    setSize = jest.fn();
    setPixelRatio = jest.fn();
    render = jest.fn();
  }

  class MockScene {
    add = jest.fn();
  }

  class MockGroup extends MockObject3D {
    add = jest.fn();
  }

  class MockCamera extends MockObject3D {
    aspect = 1;
    updateProjectionMatrix = jest.fn();
  }

  return {
    AdditiveBlending: 2,
    BufferAttribute: class {},
    BufferGeometry: MockGeometry,
    DodecahedronGeometry: MockGeometry,
    Group: MockGroup,
    IcosahedronGeometry: MockGeometry,
    Mesh: MockObject3D,
    MeshBasicMaterial: MockMaterial,
    OctahedronGeometry: MockGeometry,
    PerspectiveCamera: MockCamera,
    Points: MockObject3D,
    PointsMaterial: MockMaterial,
    Scene: MockScene,
    WebGLRenderer: MockRenderer,
  };
});

describe('home screen', () => {
  it('renders the landing page content and primary actions', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Make the next move obvious/ })).toBeInTheDocument();
    expect(screen.getByText('Independent digital studio')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See our approach' })).toHaveAttribute('href', '#approach');
    expect(screen.getByRole('link', { name: 'Start a project' })).toHaveAttribute('href', '#contact');
    expect(screen.getByText('Sharp thinking')).toBeInTheDocument();
  });
});
