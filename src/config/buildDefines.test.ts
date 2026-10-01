import { getBuildDefines } from './buildDefines';

describe('Vite build environment defines', () => {
  it('uses local development values for the dev server', () => {
    expect(getBuildDefines('serve', 'development', {})).toEqual({
      'process.env.VITE_DEVICES_API_URL': JSON.stringify('http://localhost:3000/devices/api/devices'),
      'process.env.VITE_DEVICE_API_TOKEN': JSON.stringify(''),
      'process.env.VITE_DEV_AUTH_EMAIL': JSON.stringify('developer@local.test'),
    });
  });

  it('passes configured development values to the dev server', () => {
    expect(getBuildDefines('serve', 'development', {
      VITE_DEVICES_API_URL: 'http://127.0.0.1:4310/api/devices',
      VITE_DEVICE_API_TOKEN: 'local-token',
      VITE_DEV_AUTH_EMAIL: 'tester@local.test',
    })).toEqual({
      'process.env.VITE_DEVICES_API_URL': JSON.stringify('http://127.0.0.1:4310/api/devices'),
      'process.env.VITE_DEVICE_API_TOKEN': JSON.stringify('local-token'),
      'process.env.VITE_DEV_AUTH_EMAIL': JSON.stringify('tester@local.test'),
    });
  });

  it('uses production API configuration and strips development credentials from builds', () => {
    expect(getBuildDefines('build', 'production', {
      VITE_DEVICES_API_URL: 'https://api.example.test/devices',
      VITE_DEVICE_API_TOKEN: 'must-not-be-bundled',
      VITE_DEV_AUTH_EMAIL: 'must-not-be-bundled@example.test',
    })).toEqual({
      'process.env.VITE_DEVICES_API_URL': JSON.stringify('https://api.example.test/devices'),
      'process.env.VITE_DEVICE_API_TOKEN': JSON.stringify(''),
      'process.env.VITE_DEV_AUTH_EMAIL': JSON.stringify(''),
    });
  });

  it('defaults production builds to the hosted devices API', () => {
    expect(getBuildDefines('build', 'production', {})['process.env.VITE_DEVICES_API_URL'])
      .toBe(JSON.stringify('https://apis.hacksaw.in/devices/api/devices'));
  });
});