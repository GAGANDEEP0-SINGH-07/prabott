import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const inputDir = './public/picture';
const outputDir = './public/picture/optimized';

// Create output dir
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.png'));

console.log(`Found ${files.length} PNG files to optimize...`);

for (const file of files) {
    const inputPath = path.join(inputDir, file);
    const outputName = file.replace('.png', '.webp');
    const outputPath = path.join(outputDir, outputName);

    const stats = fs.statSync(inputPath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(1);

    try {
        await sharp(inputPath)
            .resize({ width: 1920, withoutEnlargement: true })
            .webp({ quality: 82 })
            .toFile(outputPath);

        const outStats = fs.statSync(outputPath);
        const outSizeKB = (outStats.size / 1024).toFixed(0);
        console.log(`✅ ${file} (${sizeMB}MB) → ${outputName} (${outSizeKB}KB)`);
    } catch (err) {
        console.error(`❌ ${file}: ${err.message}`);
    }
}

console.log('\nDone! Optimized images saved to public/picture/optimized/');
