const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './src/js/cheatgui.js',
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: 'cheatgui.min.js',
		library: 'cheatgui',
		libraryTarget: 'umd',
		globalObject: 'this'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader'
				}
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader',
				]
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'cheatgui.min.css'
		})
	],
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin(),
			new CssMinimizerPlugin()
		],
	}
};