#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const pkg = require('../package.json');
const productName = pkg.productName || pkg.name || 'Dockyard';

if (process.platform !== 'darwin') {
  console.error('make:ditto-zip can only run on macOS runners.');
  process.exit(1);
}

const arch = process.arch === 'arm64' ? 'arm64' : 'x64';
const appPath = path.join(
  process.cwd(),
  'out',
  `${productName}-darwin-${arch}`,
  `${productName}.app`
);

if (!fs.existsSync(appPath)) {
  console.error(`Expected app bundle not found at ${appPath}. Did you run npm run package first?`);
  process.exit(1);
}

const outputDir = path.join(process.cwd(), 'out', 'ditto-zips');
fs.mkdirSync(outputDir, { recursive: true });
const zipPath = path.join(outputDir, `${productName}-macos-${arch}.zip`);

if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath);
}

console.log(`Creating ditto archive for ${appPath}`);
const result = spawnSync('ditto', ['-c', '-k', '--keepParent', appPath, zipPath], {
  stdio: 'inherit',
});

if (result.status !== 0) {
  console.error('ditto failed to create archive');
  process.exit(result.status ?? 1);
}

console.log(`Archive ready at ${zipPath}`);
