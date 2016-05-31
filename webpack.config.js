var webpack = require('webpack');

module.exports = {
  entry: './src/Main.js',

  output: {
    path: './server/static/public/js',
    filename: 'index.js',
  },

  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader?presets[]=es2015&presets[]=react' }
    ]
  },
};
