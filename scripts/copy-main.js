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
const outDir = path.join(__dirname, '..', 'out', 'main');
if (fs.existsSync(outDir)) {
  fs.rmSync(outDir, { recursive: true, force: true });
}
fs.mkdirSync(outDir, { recursive: true });

// Copy main files
const mainSrc = path.join(__dirname, '..', 'src', 'main');
const mainDest = path.join(outDir, 'main');
copyRecursiveSync(mainSrc, mainDest);

// Copy shared files
const sharedSrc = path.join(__dirname, '..', 'src', 'shared');
const sharedDest = path.join(outDir, 'shared');
copyRecursiveSync(sharedSrc, sharedDest);

console.log('Main files copied successfully!');
