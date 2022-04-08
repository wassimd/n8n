import chokidar from 'chokidar';
import shell from "shelljs";
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const listener = (event, path) => {
	console.log(event, path);
	// shell.exec('npm run build');
}

chokidar.watch([
	path.resolve(__dirname, '..', 'credentials'),
	path.resolve(__dirname, '..', 'nodes'),
	path.resolve(__dirname, '..', 'src'),
], { ignoreInitial: true })
	.on('change', listener)
	.on('add', listener)
	.on('unlink', listener);
