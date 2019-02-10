'use strict';

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const extractCss = new MiniCssExtractPlugin({
  // Options similar to the same options in webpackOptions.output
  // both options are optional
  filename: '[name].[contenthash].css',
})

module.exports = function configureCssLoaders(env={}, argv) {
  return [{
    test: /\.css$/,
    use: createCssLoaders(env),
  }, {
    test: /\.(styl|stylus)$/,
    use: createStylusLoaders(env),
  }];
};

module.exports.extractCss = extractCss;

function createStylusImportLoaders(env = {}) {
  const { prerender } = env;
  return createCssImportLoaders(env).concat(
    prerender ? 'stylus-loader' :
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

function createLoaders({ prerender = false, production = false }, importLoaders) {
  const loaders = [{
    loader: prerender ? 'css-loader/locals' : 'css-loader',
    options: {
      importLoaders: importLoaders.length,
      modules: true,
      sourceMap: !prerender,
      localIdentName: production ? '[hash:base64]' : '[name]__[local]--[hash:base64:5]',
    },
  }].concat(importLoaders);

  return prerender ? loaders : [MiniCssExtractPlugin.loader, ...loaders];
}

function createCssLoaders(env) {
  return createLoaders(env, createCssImportLoaders(env));
}

function createStylusLoaders(env) {
  return createLoaders(env, createStylusImportLoaders(env));
}
