import path from 'path';
import shell from 'shelljs';
import glob from 'tiny-glob';
import esbuild from 'esbuild';
import {fileURLToPath} from 'url';

/**
 * Configuration
 */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.resolve(rootDir, 'dist');

/**
 * Clean up
 */

shell.rm('-rf', distDir);

/**
 * Build
 */

[
	'credentials',
	'nodes',
	'src'
].forEach(async (dir) => {
	const tsFiles = await glob(path.resolve(rootDir, dir, '**/*!(.d).ts'));

	esbuild.build({
		entryPoints: tsFiles,
		format: 'cjs',
		outdir: path.resolve(distDir, dir),
	}).catch(() => process.exit(1));
});
