const webpack = require('webpack')
const config = require('./webpack.common')

module.exports = Object.assign(config, {
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify('development')
    }),
  ]
})
