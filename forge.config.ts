import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { AutoUnpackNativesPlugin } from '@electron-forge/plugin-auto-unpack-natives';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';
import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';
import { FuseV1Options, FuseVersion } from '@electron/fuses';
import { FusesPlugin } from '@electron-forge/plugin-fuses';
import MakerWix from '@electron-forge/maker-wix';
import MakerDMG from '@electron-forge/maker-dmg';
import dotenv from 'dotenv';
dotenv.config();

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: './src/assets/img/icon',
  },
  rebuildConfig: {},
  makers: [
    new MakerSquirrel({}),
    new MakerZIP({}, ['darwin', 'linux', 'win32']),
    // new MakerRpm({}),
    // new MakerDeb({}),
    // new MakerWix({}),
    new MakerDMG({
      name: 'PTZ Controller',
    }),
  ],
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
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true,
    }),
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'benaja',
          name: 'ptz-controller-app',
        },
        prerelease: true,
        authToken: process.env.GITHUB_TOKEN,
      },
    },
  ],
};

export default config;
