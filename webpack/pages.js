'use strict';

const path = require('path');
const url = require('url');

const glob = require('glob').sync;

const projectRoot = path.resolve(__dirname, '..');
const pagesPath = 'src/markup/pages';
const pages = module.exports = glob('**/*.pug', {
  cwd: path.resolve(projectRoot, pagesPath),
});

pages.path = pagesPath;

const HTML_REGEX = /\.html$/;
const INDEX_REGEX = /\/index$/;
const PUG_REGEX=/\.pug$/
const OPTIONAL_LEADING_SLASH=/^\/?/;

pages.hash = pages.reduce((memo, page) => {
  const pageUrl = page
    // remove extension
    .replace(PUG_REGEX, '')
    // assert leading slash
    .replace(OPTIONAL_LEADING_SLASH, '/');

  const indexUrl = pageUrl.match(INDEX_REGEX) ?
    pageUrl
      // replace trailing /index with trailing slash
      .replace(INDEX_REGEX, '/') :
    null;

  const pageHtml = page
    // replace extension
    .replace(PUG_REGEX, '.html')
    // assert leading slash
    .replace(OPTIONAL_LEADING_SLASH, '/');

  if (indexUrl) {
    memo.pages[indexUrl] = pageHtml;
    // Add `'/path/index.html':'/path/' to urls
    memo.urls[pageHtml] = indexUrl;
  } else {
    // Add `'/path':'/path.html'` to pages
    memo.pages[pageUrl] = pageHtml;
    // Add `'/path.html':'/path'` to urls
    memo.urls[pageHtml] = pageUrl;
  }

  memo.templates[pageHtml] = page;
  memo.templatePages[page] = pageHtml;

  return memo;
}, {
  // canonical URLs => html pages
  pages: {},
  // html pages => canonical urls
  urls: {},
  // html pages => pug templates
  templates: {},
  // pug templates => html pages
  templatePages: {},
});

pages.redirectUrl = redirectUrl;
pages.rewriteUrl = rewriteUrl;

function redirectUrl(requestUrl) {
  const reqUrl = url.parse(requestUrl);

  if (!reqUrl.pathname.match(HTML_REGEX) && !reqUrl.pathname.match(INDEX_REGEX)) {
    return false;
  }

  const redirectUrl = Object.assign({}, reqUrl, {
    pathname:
      reqUrl.pathname
        .replace(HTML_REGEX, '')
        .replace(INDEX_REGEX, '/'),
  });
  return url.format(redirectUrl);
}

function rewriteUrl(requestUrl) {
  const reqUrl = url.parse(requestUrl);
  const rewritePathname = pages.hash.pages[reqUrl.pathname];

  if (!rewritePathname) {
    return false;
  }

  const rewriteUrl = Object.assign({}, reqUrl, {
    pathname: rewritePathname,
  });

  return url.format(rewriteUrl);
}
