jest.mock('three', () => {
  class MockObject3D { rotation = { x: 0, y: 0 }; position = { set: jest.fn() }; }
  class MockGeometry { setAttribute = jest.fn(); }
  class MockMaterial {}
  class MockRenderer { domElement = document.createElement('canvas'); setSize = jest.fn(); setPixelRatio = jest.fn(); render = jest.fn(); }
  class MockScene { add = jest.fn(); }
  class MockCamera extends MockObject3D { aspect = 1; updateProjectionMatrix = jest.fn(); }
  return { AdditiveBlending: 2, BufferAttribute: class {}, BufferGeometry: MockGeometry, PerspectiveCamera: MockCamera, Scene: MockScene, Points: MockObject3D, PointsMaterial: MockMaterial, WebGLRenderer: MockRenderer };
});

import { render } from '@testing-library/react';
import ThreeBackground from './ThreeBackground';

describe('ThreeBackground component', () => {
  it('renders without crashing', () => {
    const { container } = render(<ThreeBackground />);
    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('creates a fixed position overlay box', () => {
    const { container } = render(<ThreeBackground />);
    const div = container.querySelector('div');
    expect(div).toHaveStyle('position: fixed');
  });
});
