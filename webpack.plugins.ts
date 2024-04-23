import CopyWebpackPlugin from 'copy-webpack-plugin';

export const plugins = [
  new CopyWebpackPlugin({
    patterns: [
      {
        from: 'src/assets',
        to: 'assets',
      },
    ],
  }),
];
