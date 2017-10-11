'use strict';

const path = require('path');

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
      },
    },
    module: require('./module'),
    plugins: require('./plugins'),
  };
};
