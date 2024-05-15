const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: './src/js/cheatgui.ts',
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
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
			},
			{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'cheatgui.min.css'
		})
	]
};