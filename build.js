const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- Step 1: Installing frontend dependencies ---');
execSync('npm install', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

console.log('--- Step 2: Building frontend with Vite ---');
execSync('npm run build', { cwd: path.join(__dirname, 'frontend'), stdio: 'inherit' });

console.log('--- Step 3: Syncing distribution output to root dist ---');
const srcDist = path.join(__dirname, 'frontend', 'dist');
const rootDist = path.join(__dirname, 'dist');

fs.cpSync(srcDist, rootDist, { recursive: true });
console.log('✅ Build successful! Output available in both frontend/dist and dist.');
