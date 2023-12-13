import { defineConfig } from 'vite';
import { join } from 'node:path';
import path from 'path';
import alias from '@rollup/plugin-alias';
const PACKAGE_ROOT = __dirname;

console.log('mainPath', join(PACKAGE_ROOT, 'src/main'));

// https://vitejs.dev/config
export default defineConfig({
  root: __dirname,
  base: '',
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    browserField: false,
    mainFields: ['module', 'jsnext:main', 'jsnext'],
    resolve: {
      alias: {
        '@main': path.resolve(__dirname, 'src/main'),
        '@renderer': join(PACKAGE_ROOT, 'src/renderer'),
      },
    },
  },

  plugins: [
    alias({
      entries: [
        { find: '@main', replacement: path.resolve(__dirname, 'src/main') },
        { find: '@renderer', replacement: path.resolve(__dirname, 'src/renderer') },
      ],
    }),
  ],
  // build: {
  //   target: 'exnext',
  // },
});
