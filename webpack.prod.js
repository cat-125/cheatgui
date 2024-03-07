const webpack = require('webpack');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new webpack.BannerPlugin({
			banner: 'CheatGUI | https://github.com/Cat-125/CheatGUI',
		})
	]
});