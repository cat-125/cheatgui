import { defineConfig } from 'vite';
import { sass } from 'sass';

export default defineConfig({
	build: {
		lib: {
			entry: 'src/js/cheatgui.ts',
			name: 'cheatgui',
			formats: ['es', 'iife'],
			fileName: 'cheatgui.min'
		},
		sourcemap: true,
		rollupOptions: {
			output: {
				assetFileNames: '[name][extname]'
			}
		}
	},
	css: {
		preprocessorOptions: {
			scss: {}
		}
	}
});
