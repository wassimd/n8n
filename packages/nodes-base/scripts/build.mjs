import path from 'path';
import glob from 'tiny-glob';
import esbuild from 'esbuild';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

[
	'credentials',
	'nodes',
	'src'
].forEach(async (dir) => {
	const srcDir = path.resolve(__dirname, '..', dir);
	const distDir = path.resolve(__dirname, '..', 'dist', dir);
	const tsFiles = await glob(path.resolve(srcDir, '**/*.ts'));

	esbuild.build({
		entryPoints: tsFiles,
		format: 'cjs',
		outdir: distDir,
	}).catch(() => process.exit(1));
});
