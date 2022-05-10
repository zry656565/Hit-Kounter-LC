const webpack = require('webpack')
const config = require('./webpack.common')

module.exports = Object.assign(config, {
  mode: 'production',
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('production')
    }),
  ]
})
