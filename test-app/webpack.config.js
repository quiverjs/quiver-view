var webpack = require('webpack')

module.exports = {
  entry: {
    index: './lib',
  },
  output: {
    path: './public',
    publicPath: '/build/',
    filename: "[name].js"
  },
  devtool: '#source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: function(path) {
          if(path.includes('/node_modules/quiver-')) return false
          if(path.includes('/node_modules/')) return true
          return false
        },
        loader: 'babel-loader',
        query: {
          presets: [
            'es2015', 'quiver-babel/node-jsx-preset'
          ]
        }
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
    ]
  }
}
