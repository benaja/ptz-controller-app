import { defineConfig } from 'vite';
import { join } from 'node:path';
import alias from '@rollup/plugin-alias';

const PACKAGE_ROOT = __dirname;
console.log('dirname', join(PACKAGE_ROOT, 'src/renderer/*'));

// https://vitejs.dev/config
export default defineConfig({
  base: './',
  build: {
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@/': join(PACKAGE_ROOT, 'src/main/'),
      '@main': join(PACKAGE_ROOT, 'src/main'),
      '@renderer': join(PACKAGE_ROOT, 'src/renderer'),
    },
  },
});
