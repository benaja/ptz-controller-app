import type { Configuration } from 'webpack';

const preloadConfig: Configuration = {
  entry: './src/preload.ts',
  target: 'electron-preload',
  output: {
    filename: 'preload.js',
    path: __dirname + '/.webpack/renderer/main_window',
  },
  resolve: {
    extensions: ['.js', '.ts'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  node: {
    __dirname: false,
    __filename: false,
  },
};

export default preloadConfig;
