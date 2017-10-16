const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ChildCompilerLoaderListPlugin = require('child-compiler-loader-list-webpack-plugin');

exports.css = {};
exports.stylus = {};

exports.plugin = new ExtractTextPlugin({
  filename: '[name].[contenthash].css',
  ignoreOrder: false,
  allChunks: true,
});
exports.stylus.test = /\.(styl|stylus)$/;
exports.css.test = /\.css$/;

const postCssLoader = {
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
};

function createCssLoaders({ prerender = false, stylus = false} = {}) {
  const importLoaders = [];

  if (prerender) {
    if (stylus) {
      importLoaders.push('stylus-loader');
    }
  } else {
    importLoaders.push(postCssLoader);
    if (stylus) {
      importLoaders.push({
        loader: 'stylus-loader',
        options: {
          sourceMap: true,
        },
      });
    }
  }

  return [{
    loader: prerender ? 'css-loader/locals' : 'css-loader',
    options: {
      importLoaders: importLoaders.length,
      modules: true,
      sourceMap: !prerender,
    },
  }].concat(importLoaders);
}

exports.css.loaders = exports.plugin.extract({
  fallback: 'style-loader',
  use: createCssLoaders(),
});

exports.stylus.loaders = exports.plugin.extract({
  fallback: 'style-loader',
  use: createCssLoaders({stylus: true}),
});

exports.workaround = function (rules) {
  return new ChildCompilerLoaderListPlugin({
    test: /html-webpack-plugin/,
    rules: rules.map(function(rule) {
      let stylusRule;
      if (rule.oneOf) {
        return Object.assign({}, rule, {
          oneOf: rule.oneOf.filter(item => {
            return ![exports.stylus.test, exports.css.test].includes(item.test);
          })
          .slice(0, -1)
          .concat([{
            test: exports.css.test,
            use: createCssLoaders({prerender: true})
          }, {
            test: exports.stylus.test,
            use: createCssLoaders({stylus: true, prerender: true}),
          }])
          .concat(rule.oneOf.slice(-1))
        });
      }
      return rule;
    }),
  });
};
