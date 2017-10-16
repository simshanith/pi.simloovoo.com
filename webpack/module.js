'use strict';

const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

const extractText = require('./extract-text');

module.exports = {
  rules: [{
    test: /\.(js|jsx)$/,
    enforce: 'pre',
    use: [{
      loader: 'eslint-loader',
      options: {
        formatter: require('eslint/lib/formatters/stylish'),
        eslintPath: require.resolve('eslint'),
      },
    }],
    include: [path.resolve(projectRoot, 'src')],
  }, {
    oneOf: [{
      test: /\.pug$/,
      use: {
        loader: 'pug-loader',
      },
    }, {
      test: /\.yaml$/,
      include: [path.resolve(projectRoot, 'src')],
      use: [{
        loader: 'json-loader',
      }, {
        loader: 'yaml-loader',
      }],
    }, {
      test: /\.md/,
      use: 'raw-loader',
    }, {
      test: extractText.css.test,
      use: extractText.css.loaders,
    }, {
      test: extractText.stylus.test,
      use: extractText.stylus.loaders,
    }, {
      test: /\.(js|jsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          presets: ['env', 'stage-0'],
          plugins: ['transform-react-jsx'],
        },
      },
    }, {
      exclude: [/\.js$/, /\.html$/, /\.json$/],
      use: {
        loader: 'file-loader',
        options: {
          name: '[path][name].[hash:8].[ext]',
        },
      },
    }],
  }],
};
