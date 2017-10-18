'use strict';

const path = require('path');
const url = require('url');

const webpack = require('webpack');
const ArchivePlugin = require('webpack-archive-plugin');

const pages = require('./pages');
const pagesHash = pages.reduce((memo, page) => {
  const pageUrl = page
    // remove extension
    .replace(/\.pug$/, '')
    // assert leading slash
    .replace(/^\/?/, '/');

  const indexUrl = pageUrl
    // replace trailing /index with trailing slash
    .replace(/\/index$/, '/');

  const pageHtml = page
    // replace extension
    .replace(/\.pug$/, '.html')
    // assert leading slash
    .replace(/^\/?/, '/');

  memo[pageUrl] = pageHtml;
  memo[indexUrl] = pageHtml;
  return memo;
}, {});

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
      before: app => {
        // Instead of proxing nginx we're emulating its rewrites
        app.use((req, res, next) => {
          // 301 redirect to normalized path: remove extension and handle index pages
          const HTML_REGEX=/\.html$/;
          const INDEX_REGEX=/\/index$/
          const reqUrl = url.parse(req.originalUrl);
          const redirectUrl = Object.assign({}, reqUrl, {
            pathname: req.baseUrl +
              req.path
                .replace(HTML_REGEX, '')
                .replace(INDEX_REGEX, '/')
          });

          if (req.path.match(HTML_REGEX) || req.path.match(INDEX_REGEX)) {
            return res.redirect(301, url.format(redirectUrl));
          }

          return next();
        }, (req, res, next) => {
          // rewrite request url internally for known pages
          const reqUrl = url.parse(req.url);
          const rewriteUrl = Object.assign({}, reqUrl, {
            pathname: pagesHash[req.path],
          });

          // checking pages hash is similar to nginx try_files
          if (rewriteUrl.pathname) {
            console.info('Rewriting request url...', req.url);
            req.url = url.format(rewriteUrl);
            console.info('Rewrote request url', req.url);
          }

          return next();
        });
      }
    }
  };
};
