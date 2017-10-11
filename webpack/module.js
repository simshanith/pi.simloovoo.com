'use strict';

const path = require('path');

const projectRoot = path.resolve(__dirname, '..');

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
      use: {
        loader: 'yaml-loader',
      },
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
