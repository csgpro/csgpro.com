// libs
import * as path from 'path';

// Helper functions
const ROOT = path.resolve(__dirname, '..');

export function hasProcessFlag(flag) {
  return process.argv.join('').indexOf(flag) > -1;
}

export function isWebpackDevServer() {
  return process.argv[1] && !! (/webpack-dev-server$/.exec(process.argv[1]));
}

export function root(pathParts: string|string[]): string {
  if (typeof pathParts === 'string') {
    pathParts = pathParts.split('/');
  }
  return path.join.apply(path, [ROOT, ...pathParts]);
}

export function checkNodeImport(context, request, cb) {
  if (!path.isAbsolute(request) && request.charAt(0) !== '.') {
    cb(null, 'commonjs ' + request); return;
  }
  cb();
}