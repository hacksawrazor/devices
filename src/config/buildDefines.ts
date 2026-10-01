type ViteCommand = 'build' | 'serve';
import { getDefaultDevicesApiUrl } from './runtimeEnvironment.ts';

export function getBuildDefines(
  command: ViteCommand,
  mode: string,
  env: Record<string, string | undefined>,
): Record<string, string> {
  return {
    'process.env.VITE_DEVICES_API_URL': JSON.stringify(env.VITE_DEVICES_API_URL || getDefaultDevicesApiUrl(mode)),
    'process.env.VITE_DEVICE_API_TOKEN': JSON.stringify(command === 'serve' ? env.VITE_DEVICE_API_TOKEN ?? '' : ''),
    'process.env.VITE_DEV_AUTH_EMAIL': JSON.stringify(
      command === 'serve' ? env.VITE_DEV_AUTH_EMAIL ?? 'developer@local.test' : '',
    ),
  };
}