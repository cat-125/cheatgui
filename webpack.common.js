const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/js/cheatgui.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'cheatgui.min.js',
		library: {
			name: 'cheatgui',
			type: "umd"
		},
		globalObject: 'this',
		clean: true
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
	]
};