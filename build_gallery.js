import fs from 'fs';
import path from 'path';

const __dirname = process.cwd();

const srcDir = path.join(__dirname, 'pattern_images');
const destDir = path.join(__dirname, 'gallery', 'pattern_images');
const outputFile = path.join(__dirname, 'gallery', 'patterns.json');

if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

// Copy images
fs.readdirSync(srcDir).forEach(file => {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  fs.copyFileSync(src, dest);
});

const files = fs.readdirSync(srcDir);

fs.writeFileSync(outputFile, JSON.stringify({ success: true, files }, null, 2));

console.log(`✅ Copied ${files.length} images and created patterns.json`);