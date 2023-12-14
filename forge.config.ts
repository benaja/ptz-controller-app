import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [new MakerSquirrel({}), new MakerZIP({}, ['darwin']), new MakerRpm({}), new MakerDeb({})],
  plugins: [
    new AutoUnpackNativesPlugin({}),
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: './src/index.html',
            js: './src/renderer/index.tsx',
            name: 'main_window',
            preload: {
              js: './src/preload.ts',
            },
          },
          {
            html: './src/gamepad.html',
            js: './src/renderer/gamepad-listener.tsx',
            name: 'gamepad_window',
            preload: {
              js: './src/preload.ts',
            },
          },
        ],
      },
      loggerPort: 9001,
    }),
    // new VitePlugin({
    //   // `build` can specify multiple entry builds, which can be Main process, Preload scripts, Worker process, etc.
    //   // If you are familiar with Vite configuration, it will look really familiar.
    //   build: [
    //     {
    //       // `entry` is just an alias for `build.lib.entry` in the corresponding file of `config`.
    //       entry: 'src/main/index.ts',
    //       config: 'vite.main.config.ts',
    //     },
    //     {
    //       entry: 'src/preload.ts',
    //       config: 'vite.preload.config.ts',
    //     },
    //   ],
    //   renderer: [
    //     {
    //       name: 'main_window',
    //       config: 'vite.renderer.config.ts',
    //     },
    //   ],
    // }),
  ],
};

export default config;
