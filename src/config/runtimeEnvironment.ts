declare const process: {
  env: {
    NODE_ENV?: string;
    VITE_DEVICES_API_URL?: string;
    VITE_DEVICE_API_TOKEN?: string;
    VITE_DEV_AUTH_EMAIL?: string;
  };
};

const defaultDevicesApiUrls = {
  development: 'http://localhost:3000/devices/api/devices',
  production: 'https://apis.hacksaw.in/devices/api/devices',
} as const;

export function getDefaultDevicesApiUrl(mode: string): string {
  return mode === 'development' ? defaultDevicesApiUrls.development : defaultDevicesApiUrls.production;
}

export function getRuntimeEnvironment() {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return {
    isDevelopment,
    devicesApiUrl: process.env.VITE_DEVICES_API_URL || getDefaultDevicesApiUrl(process.env.NODE_ENV ?? ''),
    deviceApiToken: isDevelopment ? process.env.VITE_DEVICE_API_TOKEN ?? '' : '',
    devAuthEmail: isDevelopment ? process.env.VITE_DEV_AUTH_EMAIL || 'developer@local.test' : '',
  };
}