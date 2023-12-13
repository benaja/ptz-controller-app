import { defineConfig } from 'vite';
import { join } from 'node:path';
const PACKAGE_ROOT = __dirname;

// https://vitejs.dev/config
export default defineConfig({
  resolve: {
    alias: {
      '@/*': join(PACKAGE_ROOT, 'src/main/*'),
      '@main': join(PACKAGE_ROOT, 'src/main'),
      '@renderer/*': join(PACKAGE_ROOT, 'src/renderer/*'),
    },
  },
});
