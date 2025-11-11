const fs = require('fs');
const path = require('path');

function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();
  
  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Clean and recreate output directory
const outDir = path.join(__dirname, '..', 'out', 'preload');
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Copy preload files
const preloadSrc = path.join(__dirname, '..', 'src', 'preload');
const preloadDest = path.join(outDir, 'preload');
copyRecursiveSync(preloadSrc, preloadDest);

// Copy shared files (needed by preload)
const sharedSrc = path.join(__dirname, '..', 'src', 'shared');
const sharedDest = path.join(outDir, 'shared');
copyRecursiveSync(sharedSrc, sharedDest);

console.log('Preload files copied successfully!');
