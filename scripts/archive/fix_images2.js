import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directoryPath = 'public/images';

async function processImages() {
    try {
        const files = await fs.promises.readdir(directoryPath);
        for (const file of files) {
            if (file.endsWith('.webp')) {
                const filePath = path.join(directoryPath, file);
                try {
                    const tempPath = filePath + '.tmp.webp';
                    await sharp(filePath)
                        .resize({ width: 800, withoutEnlargement: true })
                        .webp({ quality: 60 })
                        .toFile(tempPath);
                    await fs.promises.rename(tempPath, filePath);
                    console.log('Compressed:', file);
                } catch(e) {}
            }
        }
    } catch (err) {
        console.error('Error processing images', err);
    }
}

processImages();
