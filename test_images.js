const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']+)["']/g;

let match;
let count = 0;
console.log('=== AUDITING IMAGES IN INDEX.HTML ===');
while ((match = imgRegex.exec(html)) !== null) {
  count++;
  const src = match[1];
  const alt = match[2];
  const fullPath = path.join(__dirname, src);
  const exists = fs.existsSync(fullPath);
  const size = exists ? (fs.statSync(fullPath).size / 1024).toFixed(1) + ' KB' : 'MISSING';
  console.log(`${count}. [${exists ? 'OK' : 'FAIL'}] ${src} (${size}) -> "${alt}"`);
}

