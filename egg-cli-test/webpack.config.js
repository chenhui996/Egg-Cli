const path = require('path')

module.exports = {
  mode: 'development',
  entry: './bin/core.js',
  output: {
    path: path.join(__dirname, './dist'),
    filename: 'core.js',
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|dist)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: [
              [
                '@babel/plugin-transform-runtime',
                {
                  corejs: 3,
                  regenerator: true,
                  useESModules: true,
                  helpers: true,
                },
              ],
            ],
          },
        },
      },
    ],
  },
}
