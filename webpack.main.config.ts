import type { Configuration } from 'webpack';
import { rules, alias } from './webpack.rules';
import { plugins } from './webpack.plugins';

export const mainConfig: Configuration = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/index.ts',

  // Put your normal webpack config below here
  externals: [
    {
      'utf-8-validate': 'commonjs utf-8-validate',
      bufferutil: 'commonjs bufferutil',
      'node-hid': 'commonjs node-hid',
      // '@sensslen/node-gamepad': 'commonjs @sensslen/node-gamepad',
    },
  ],

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
