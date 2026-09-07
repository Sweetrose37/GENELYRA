import sharp from 'sharp';
import { mkdir, rename } from 'node:fs/promises';

// Run once after adding the generated source images to public/assets.
await mkdir('artwork-source', { recursive: true });
const names = ['fanwear', 'embellishment', 'kids', 'business', 'seasonal'];
for (const width of [960, 1920]) {
  await sharp('public/assets/hero.png').resize({ width }).webp({ quality: 84 }).toFile(`public/assets/hero-${width}.webp`);
}
const { width, height } = await sharp('public/assets/portraits.png').metadata();
for (let i=0; i<names.length; i++) {
  const left = Math.round(i*width/5);
  const right = Math.round((i+1)*width/5);
  for (const size of [240, 480]) {
    await sharp('public/assets/portraits.png').extract({ left, top: 0, width: right-left, height }).resize({ width: size }).webp({ quality: 85 }).toFile(`public/assets/${names[i]}-${size}.webp`);
  }
}
// Keep archival originals out of the production bundle.
await rename('public/assets/hero.png', 'artwork-source/hero.png');
await rename('public/assets/portraits.png', 'artwork-source/portraits.png');
console.log('Responsive WebP assets prepared. Originals preserved in artwork-source/.');
