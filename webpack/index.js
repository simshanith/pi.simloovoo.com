import path from 'path';

import webpack from 'webpack';

import createPlugins from './plugins';
import createModule from './module';
import pages from './pages';

const projectRoot = path.resolve(__dirname, '..');

export default function webpackConfig(env = {}, argv) {
  const stats = {
    modules: false,
    children: false,
  };
  return {
    entry: {
      app: ['./src/app.styl', './src/app.js'],
      vendor: './src/vendor.js'
    },
    context: projectRoot,
    node: {
      __dirname: true,
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
    plugins: createPlugins(env, argv),
    module: createModule(env, argv),
    devtool: 'source-map',
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
      },
      stats,
    },
    stats,
  };
};
