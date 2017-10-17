'use strict';

const path = require('path');

const ArchivePlugin = require('webpack-archive-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const glob = require('glob').sync;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const extractText = require('./extract-text');
const { rules } = require('./module');

const projectRoot = path.resolve(__dirname, '..');
const pagesPath = 'src/markup/pages';
const pages = glob('**/*.pug', {
  cwd: path.resolve(projectRoot, pagesPath),
});

function createPagePlugin(page) {
  const filename = page.replace(/\.pug$/, '.html');
  const template = `${pagesPath}/${page}`;
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
