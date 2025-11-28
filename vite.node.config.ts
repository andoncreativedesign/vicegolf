import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import react from '@vitejs/plugin-react';
import { reactRouter } from '@react-router/dev/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    react(),          // REQUIRED for SSR JSX
    reactRouter(),    // RR7 server + client routing plugin
  ],

  // Enable SSR features
  ssr: {
    target: 'node',
    noExternal: true,
  },

  build: {
    ssr: true,
    outDir: 'dist-node',
    target: 'node18',

    // Explicit entry for the server bundle
    rollupOptions: {
      input: {
        server: path.resolve(__dirname, 'app/entry.server.tsx'),
      },
    },
  },
});
