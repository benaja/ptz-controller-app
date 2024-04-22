import type { Configuration } from 'webpack';
import path from 'path';
import { rules, alias } from './webpack.rules';
import { plugins } from './webpack.plugins';
import nodeExternals from 'webpack-node-externals';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/index.ts',

  externals: [nodeExternals()],
  // Put your normal webpack config below here

  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias,
  },
  optimization: {
    minimize: false,
  },
};
