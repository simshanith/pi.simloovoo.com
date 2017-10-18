'use strict';

const path = require('path');

const webpack = require('webpack');
const ArchivePlugin = require('webpack-archive-plugin');

const pages = require('./pages');

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
    devServer: {
      contentBase: path.resolve(projectRoot, 'build'),
      before: app => {
        // Instead of proxing nginx we're emulating its rewrites
        app.use((req, res, next) => {
          // 301 redirect to normalized path
          const redirectUrl = pages.redirectUrl(req.originalUrl);
          if (redirectUrl) {
            return res.redirect(301, redirectUrl);
          }

          return next();
        }, (req, res, next) => {
          // rewrite request url internally for known pages
          const rewriteUrl = pages.rewriteUrl(req.url);
          if (rewriteUrl) {
            req.url = rewriteUrl;
          }

          return next();
        });
      }
    }
  };
};
