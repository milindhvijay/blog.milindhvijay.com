const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function ls(dirPath) {
  console.log('scanning: ' + dirPath);
  const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await ls(fullPath);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(entry.name)) {
      try {
        const buffer = await sharp(fullPath)
          .resize(20, null, { withoutEnlargement: true })
          .blur()
          .toBuffer();
        const mimeType = entry.name.toLowerCase().endsWith('.webp') ? 'image/webp' :
                         entry.name.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg';
        const base64 = `data:${mimeType};base64,${buffer.toString('base64')}`;
        console.log(' ');
        console.log(fullPath);
        console.log(' ');
        console.log(base64);
      } catch (err) {
        console.log(' ');
        console.log('Skipping: ' + fullPath + ' - ' + err.message);
      }
    }
  }
}

ls('assets/img/headers').catch(console.error);
ls('assets/img/posts').catch(console.error);


