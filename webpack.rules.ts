import type { ModuleOptions, ResolveOptions } from 'webpack';
import path from 'path';

export const rules: Required<ModuleOptions>['rules'] = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator loader generates a
    // "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    use: {
      loader: '@vercel/webpack-asset-relocator-loader',
      options: {
        outputAssetBase: 'native_modules',
      },
    },
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
    },
  },
  {
    test: /\.ts$/,
    exclude: /(node_modules|\.webpack)/,
    loader: 'ts-loader',
    options: {
      transpileOnly: true,
    },
  },
];

export const alias: Required<ResolveOptions>['alias'] = {
  '@/': path.resolve(__dirname, 'src/main/'),
  '@main': path.resolve(__dirname, 'src/main'),
  '@core': path.resolve(__dirname, 'src/core'),
  '@renderer': path.resolve(__dirname, 'src/renderer'),
};
