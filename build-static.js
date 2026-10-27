const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'main', 'resources', 'static');
const distDir = path.join(__dirname, 'dist');

function copyDirSync(src, dest) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }
    const entries = fs.readdirSync(src, { withFileTypes: true });
    for (const entry of entries) {
        const srcPath = path.join(src, entry.name);
        const destPath = path.join(dest, entry.name);
        if (entry.isDirectory()) {
            copyDirSync(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

console.log(`Building static distribution from ${srcDir} to ${distDir}...`);
copyDirSync(srcDir, distDir);
console.log('Build complete! All files copied to dist/');
