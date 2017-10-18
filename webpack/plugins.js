'use strict';

const ArchivePlugin = require('webpack-archive-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const extractText = require('./extract-text');
const { rules } = require('./module');
const pages = require('./pages');

function createPagePlugin(page) {
  const filename = page.replace(/\.pug$/, '.html');
  const template = `${pages.path}/${page}`;
  return new HtmlWebpackPlugin({
    filename,
    inject: true,
    template,
  });
}

module.exports =  [
  new DashboardPlugin(),
  extractText.plugin,
  extractText.workaround(rules),
].concat(
  pages.map(createPagePlugin)
);
