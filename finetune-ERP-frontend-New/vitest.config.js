import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // emulate DOM APIs for component tests
    setupFiles: './setupTests.js',
  },
});
