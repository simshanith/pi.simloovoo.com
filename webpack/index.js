'use strict';

const path = require('path');

const webpack = require('webpack');

const projectRoot = path.resolve(__dirname, '..');

module.exports = function(env, argv) {
  return {
    entry: {
      app: './src/app.js',
    },
    output: {
      path: path.resolve(projectRoot, 'build'),
      filename: '[name].[chunkhash].js',
      publicPath: '/',
    },
    resolve: {
      alias: {
        'markup': path.resolve(projectRoot, 'src/markup'),
        'assets': path.resolve(projectRoot, 'assets'),
      },
    },
    plugins: require('./plugins').concat(
      env.production ? [
        webpack.DefinePlugin({'process.env.NODE_ENV': 'production'})
      ] : []
    ),
    module: require('./module'),
    devtool: 'sourcemap',
  };
};
