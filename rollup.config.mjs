import typescript from '@rollup/plugin-typescript';
import scss from 'rollup-plugin-scss';
import { terser } from "rollup-plugin-terser";

export default {
	input: 'src/js/cheatgui.ts',
	output: {
		name: 'cheatgui',
		file: 'dist/cheatgui.min.js',
		format: 'iife',
		assetFileNames: '[name][extname]',
		sourcemap: true
	},
	plugins: [
		typescript(),
		scss({
			fileName: 'cheatgui.min.css',
			sourceMap: false,
			outputStyle: 'compressed'
		}),
		terser()
	]
};