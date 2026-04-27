import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	{
		ignores: ['dist/**', 'docs/**', 'node_modules/**']
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{js,mjs,cjs,ts}'],
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/ban-ts-comment': 'off',
			'@typescript-eslint/no-this-alias': 'off',
			//'@typescript-eslint/no-unused-vars': 'off',
			//'prefer-const': 'off'
		}
	}
);
