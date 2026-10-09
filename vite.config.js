import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Capacitor carrega os assets a partir de caminhos relativos no build final
  base: './',
});
