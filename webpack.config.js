'use strict';

const path = require('path');

const DashboardPlugin = require('webpack-dashboard/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = function(env, argv) {
	return {
		entry: {
			app: './src/app.js',
		},
		output: {
    	path: path.resolve(__dirname, 'build'),
			filename: '[name].[chunkhash].js',
			publicPath: '/',
		},
		module: {
			rules: [{
				test: /\.pug$/,
				include: path.resolve(__dirname, 'src'),
				use: 'pug-loader',
			}, {

			}],
		},
		plugins: [
			new DashboardPlugin(),
			new HtmlWebpackPlugin({
				inject: true,
				template: 'src/index.pug'
			}),
		],
	};
};
