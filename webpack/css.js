'use strict';

const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractText = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  ignoreOrder: false,
  allChunks: true,
});

module.exports = function configureCssLoaders(env={}, argv) {
  return [{
    test: /\.css$/,
    use: createCssLoaders(env),
  }, {
    test: /\.(styl|stylus)$/,
    use: createStylusLoaders(env),
  }];
};

module.exports.extractText = extractText;

function createStylusImportLoaders(env = {}) {
  const { prerender } = env;
  return createCssImportLoaders(env).concat(
    prerender ?
      'stylus-loader' :
      {
        loader: 'stylus-loader',
        options: {
          sourceMap: true,
        }
      }
  );
}

function createCssImportLoaders({ prerender = false } = {}) {
  if (prerender) {
    return [];
  }

  return [{
    loader: 'postcss-loader',
    options: {
      ident: 'postcss',
      sourceMap: true,
      plugins: () => [
        require('autoprefixer')({
          browsers: [
            '>1%',
            'last 4 versions',
            'Firefox ESR',
            'not ie < 9', // React doesn't support IE8 anyway
          ],
          flexbox: 'no-2009',
        }),
      ],
    },
  }];
}

function createLoaders({ prerender = false }, importLoaders) {
  const loaders = [{
    loader: prerender ? 'css-loader/locals' : 'css-loader',
    options: {
      importLoaders: importLoaders.length,
      modules: true,
      sourceMap: !prerender,
    },
  }].concat(importLoaders);

  return prerender ? loaders : extractText.extract({
    fallback: 'style-loader',
    use: loaders,
  });
}

function createCssLoaders(env) {
  return createLoaders(env, createCssImportLoaders(env));
}

function createStylusLoaders(env) {
  return createLoaders(env, createStylusImportLoaders(env));
}
