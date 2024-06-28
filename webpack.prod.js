const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const PACKAGE = require('./package.json');

module.exports = merge(common, {
	mode: 'production',
	plugins: [
		new webpack.BannerPlugin({
			banner: `cheatgui v${PACKAGE.version} | https://github.com/cat-125/cheatgui`,
		})
	],
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				extractComments: false
			}),
			new CssMinimizerPlugin()
		]
	}
});