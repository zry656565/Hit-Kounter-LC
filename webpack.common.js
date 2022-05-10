const path = require('path')

module.exports = {
  entry: {
    'hit-kounter-lc': './scripts/index.js'
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
      },
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        test: /\.jade$/,
        use: ['jade-loader'],
      }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  },
}

