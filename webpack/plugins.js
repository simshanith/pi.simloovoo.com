'use strict';

const path = require('path');

const DashboardPlugin = require('webpack-dashboard/plugin');
const glob = require('glob').sync;
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
].concat(
  pages.map(createPagePlugin)
);
