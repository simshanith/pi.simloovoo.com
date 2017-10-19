'use strict';

const ArchivePlugin = require('webpack-archive-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const extractText = require('./extract-text');
const { rules } = require('./module');
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

module.exports = function configurePlugins(env = {}, argv) {
  const envPlugins = env.production ? [
    new ArchivePlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    new webpack.optimize.UglifyJsPlugin(),
  ] : [
    new DashboardPlugin()
  ];

  return [
    extractText.plugin,
    extractText.workaround(rules),
  ]
  .concat(pages.map(createPagePlugin))
  .concat(envPlugins)
  ;
};
