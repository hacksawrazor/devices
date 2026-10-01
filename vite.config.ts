import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { getBuildDefines } from './src/config/buildDefines.ts';

export default defineConfig(({ command, mode }) => {
  const envDir = './dev';
  const env = loadEnv(mode, envDir, 'VITE_');

  return {
    plugins: [react()],
    envDir,
    define: getBuildDefines(command, mode, env),
  };
});
