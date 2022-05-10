const webpack = require('webpack')
const config = require('./webpack.common')

module.exports = Object.assign(config, {
  mode: 'development',
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('development')
    }),
  ]
})
