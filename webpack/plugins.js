'use strict';

import ArchivePlugin from 'webpack-archive-plugin';
import ChildCompilerLoaderListPlugin from 'child-compiler-loader-list-webpack-plugin';
import DashboardPlugin from 'webpack-dashboard/plugin';
import FaviconsWebpackPlugin from 'favicons-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import { StatsWriterPlugin } from 'webpack-stats-plugin';
import webpack from 'webpack';

import { configureRules } from './module';
import { extractText } from './css';
import pages from './pages';

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

export default function configurePlugins(env = {}, argv) {
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
    new webpack.HashedModuleIdsPlugin(),
  ] : [
    new DashboardPlugin(),
    new webpack.NamedModulesPlugin()
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
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime'
    }),
  ]
  .concat(pages.map(createPagePlugin))
  .concat(envPlugins)
  ;
};
