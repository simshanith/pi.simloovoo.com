'use strict';

const path = require('path');

const configureCssLoaders = require('./css');

const projectRoot = path.resolve(__dirname, '..');

function configureRules(env = {}, argv) {
  return [{
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
    }]
    .concat(configureCssLoaders(env, argv))
    .concat([{
      test: /\.(js|jsx)$/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: true,
          babelrc: false,
          presets: ['env', 'stage-0', ],
          plugins: ['transform-react-jsx'].concat(
            env.production ? [] :
            'transform-react-jsx-source'
          ),
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
    }]),
  }];
}

module.exports = function configureModule(env={}, argv) {
  return {
    rules: configureRules(env, argv),
  };
};

module.exports.configureRules = configureRules;
