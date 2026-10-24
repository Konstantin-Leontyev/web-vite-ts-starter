import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    checker({
      typescript: true,
      eslint: {
        lintCommand: 'eslint .',
        useFlatConfig: true,
      },
    }),
    react({
      babel: {
        plugins: [['babel-plugin-styled-components', { displayName: true, fileName: true }]],
      },
    }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
