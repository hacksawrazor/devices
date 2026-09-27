import '@testing-library/jest-dom';

(window as any).TextEncoder = class TextEncoder { encode(s: string) { return new Uint8Array(0); } };
(window as any).TextDecoder = class TextDecoder { decode(b?: Uint8Array) { return ''; } };

Object.defineProperty(window, 'requestAnimationFrame', {
  writable: true,
  value: jest.fn(() => 1),
});

Object.defineProperty(window, 'cancelAnimationFrame', {
  writable: true,
  value: jest.fn(),
});
