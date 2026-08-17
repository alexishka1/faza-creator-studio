import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const inputDir = path.resolve('public/images/ASET RUANG FAZA');
const outputDir = path.resolve('public/images/optimized');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function optimizeImages() {
  const files = fs.readdirSync(inputDir);

  for (const file of files) {
    const fullPath = path.join(inputDir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isFile() && /\.(jpg|jpeg|png)$/i.test(file)) {
      const baseName = path.parse(file).name.replace(/\s+/g, '_').replace(/[()]/g, '');
      
      // 1. Desktop version (max width 1600px, quality 82)
      const desktopOut = path.join(outputDir, `${baseName}-1600.webp`);
      await sharp(fullPath)
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 82, effort: 5 })
        .toFile(desktopOut);

      // 2. Mobile version (max width 800px, quality 80)
      const mobileOut = path.join(outputDir, `${baseName}-800.webp`);
      await sharp(fullPath)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80, effort: 5 })
        .toFile(mobileOut);

      // 3. Thumbnail version (max width 450px, quality 78)
      const thumbOut = path.join(outputDir, `${baseName}-thumb.webp`);
      await sharp(fullPath)
        .resize({ width: 450, withoutEnlargement: true })
        .webp({ quality: 78, effort: 4 })
        .toFile(thumbOut);

      console.log(`✓ Processed: ${file} -> ${baseName} (1600w, 800w, thumb)`);
    }
  }

  console.log('✨ All images successfully converted to high-performance WebP!');
}

optimizeImages().catch((err) => {
  console.error('Error optimizing images:', err);
});
