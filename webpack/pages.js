'use strict';

const path = require('path');

const glob = require('glob').sync;

const projectRoot = path.resolve(__dirname, '..');
const pagesPath = 'src/markup/pages';
const pages = module.exports = glob('**/*.pug', {
  cwd: path.resolve(projectRoot, pagesPath),
});

pages.path = pagesPath;
