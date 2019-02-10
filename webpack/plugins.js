import { pick } from 'lodash';
import ArchivePlugin from 'webpack-archive-plugin';
import ChildCompilerLoaderListPlugin from 'child-compiler-loader-list-webpack-plugin';
import DashboardPlugin from 'webpack-dashboard/plugin';
import WebappWebpackPlugin from 'webapp-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { StatsWriterPlugin } from 'webpack-stats-plugin';
import webpack from 'webpack';

import { configureRules } from './module';
import { extractCss } from './css';
import pages from './pages';

function createPagePlugin(page) {
  const filename = pages.hash.templatePages[page].replace(/^\//, '');
  const template = `${pages.path}/${page}`;
  const env = pick(process.env, [
    'COMMIT_MESSAGE'
  ]);
  return new HtmlWebpackPlugin({
    filename,
    inject: true,
    template,
    env,
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

export default function configurePlugins(env = {}, argv) {
  const envPlugins = env.production ? [
    new ArchivePlugin(),
    new StatsWriterPlugin({
      filename: 'webpack-stats.json',
      // no field filtering
      fields: null,
    }),
    new webpack.HashedModuleIdsPlugin(),
  ] : [
    new DashboardPlugin(),
  ];

  return [
    extractCss,
    prerenderPlugin(env, argv),
    new WebappWebpackPlugin({
      logo: 'assets/images/splash.jpg',
      favicons: {
        icons: {
          android: false,
          appleIcon: false,
          appleStartup: false,
          coast: false,
          favicons: true,
          firefox: false,
          windows: false,
          yandex: false,
        },
      },
    }),
  ]
  .concat(pages.map(createPagePlugin))
  .concat(envPlugins)
  ;
};
