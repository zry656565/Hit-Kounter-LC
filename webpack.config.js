module.exports = {
  entry: {
    'hit-kounter': './scripts/index.js'
  },
  output: {
    path: './build',
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.jade$/,
        loader: 'jade'
      }
    ]
  },
  resolve: {
    extensions: ['', '.js']
  }
}