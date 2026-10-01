import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const deviceApiToken = command === 'serve' ? env.VITE_DEVICE_API_TOKEN ?? '' : '';

  return {
    plugins: [react()],
    define: {
      'process.env.VITE_DEVICE_API_TOKEN': JSON.stringify(deviceApiToken),
    },
  };
});
