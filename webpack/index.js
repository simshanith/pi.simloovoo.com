'use strict';

const path = require('path');

const webpack = require('webpack');
const ArchivePlugin = require('webpack-archive-plugin');

const projectRoot = path.resolve(__dirname, '..');

module.exports = function(env = {}, argv) {
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
        new ArchivePlugin(),
        new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('production')}),
        new webpack.optimize.UglifyJsPlugin()
      ] : []
    ),
    module: require('./module'),
    devtool: 'sourcemap',
  };
};
