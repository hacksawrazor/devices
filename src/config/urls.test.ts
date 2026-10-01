declare const process: { env: { NODE_ENV: string; VITE_DEVICES_API_URL?: string } };

const loadDevicesApiUrl = (): string => {
  let devicesApiUrl = '';
  jest.isolateModules(() => {
    const { urls } = jest.requireActual('./urls') as typeof import('./urls');
    devicesApiUrl = urls.devicesApi;
  });
  return devicesApiUrl;
};

describe('device API URL configuration', () => {
  let originalNodeEnv: string | undefined;
  let originalDevicesApiUrl: string | undefined;

  beforeEach(() => {
    originalNodeEnv = process.env.NODE_ENV;
    originalDevicesApiUrl = process.env.VITE_DEVICES_API_URL;
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    if (originalDevicesApiUrl === undefined) delete process.env.VITE_DEVICES_API_URL;
    else process.env.VITE_DEVICES_API_URL = originalDevicesApiUrl;
  });

  it('defaults to the local devices API in development', () => {
    process.env.NODE_ENV = 'development';
    delete process.env.VITE_DEVICES_API_URL;

    expect(loadDevicesApiUrl()).toBe('http://localhost:3000/devices/api/devices');
  });

  it('uses the configured devices API URL', () => {
    process.env.NODE_ENV = 'development';
    process.env.VITE_DEVICES_API_URL = 'http://127.0.0.1:4321/api/devices';

    expect(loadDevicesApiUrl()).toBe('http://127.0.0.1:4321/api/devices');
  });

  it('defaults to the hosted devices API outside development', () => {
    process.env.NODE_ENV = 'production';
    delete process.env.VITE_DEVICES_API_URL;

    expect(loadDevicesApiUrl()).toBe('https://apis.hacksaw.in/devices/api/devices');
  });
});