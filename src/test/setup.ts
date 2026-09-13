import '@testing-library/jest-dom';

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: jest.fn(() => 1),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: jest.fn(),
});
