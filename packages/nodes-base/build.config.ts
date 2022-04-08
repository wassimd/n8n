/* tslint:disable:no-default-export */
import {BuildConfig} from 'unbuild';

export default {
	entries: [
		{
			builder: 'mkdist',
			format: 'cjs',
			ext: 'js',
			input: './src',
			outDir: './dist/src',
			declaration: true,
		},
		{
			builder: 'mkdist',
			format: 'cjs',
			ext: 'js',
			input: './nodes',
			outDir: './dist/nodes',
			declaration: true,
		},
		{
			builder: 'mkdist',
			format: 'cjs',
			ext: 'js',
			input: './credentials',
			outDir: './dist/credentials',
			declaration: true,
		},
	],
} as BuildConfig;
