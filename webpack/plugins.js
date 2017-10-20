'use strict';

const ArchivePlugin = require('webpack-archive-plugin');
const ChildCompilerLoaderListPlugin = require('child-compiler-loader-list-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const FaviconsWebpackPlugin = require('favicons-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
const webpack = require('webpack');

const configureRules = require('./module').configureRules;
const extractText = require('./css').extractText;
const pages = require('./pages');

function createPagePlugin(page) {
  const filename = pages.hash.templatePages[page].replace(/^\//, '');
  const template = `${pages.path}/${page}`;
  return new HtmlWebpackPlugin({
    filename,
    inject: true,
    template,
  });
}

function prerenderPlugin(env = {}, argv) {
  const rules = configureRules(Object.assign({}, env, {
    prerender: true
  }));
  return new ChildCompilerLoaderListPlugin({
    test: /html-webpack-plugin/,
    rules,
  });
}

module.exports = function configurePlugins(env = {}, argv) {
  const envPlugins = env.production ? [
    new ArchivePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new StatsWriterPlugin({
      filename: 'webpack-stats.json',
      // no field filtering
      fields: null,
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ] : [
    new DashboardPlugin()
  ];

  return [
    extractText,
    prerenderPlugin(env, argv),
    new FaviconsWebpackPlugin({
      logo: 'assets/images/splash.jpg',
      icons: {
        android: false,
        appleIcon: false,
        appleStartup: false,
        firefox: false,
      },
    }),
  ]
  .concat(pages.map(createPagePlugin))
  .concat(envPlugins)
  ;
};
