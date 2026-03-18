import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const directories = [
  path.join(process.cwd(), 'public'),
  path.join(process.cwd(), 'src', 'assets')
];

// Map of filenames to their rendered widths * 2 (for 2x high dpi). 
// Or height if width isn't specified directly.
// brand.png & brandwo.png -> max 600px -> 1200px
// chailogo.png -> h-28 (112px) -> 224px height
// circleimage.png -> max 500px -> 1000px
// blogbg.png -> it's a background or full width carousel image, let's assume 1920 is a safe 2x if it covers full width. 
// cleft.png / cright.png -> (choose left/right) likely half screen, let's say 800px.
const dimensionsMap = {
  'brandwo.png': { width: 1200 },
  'brand.png': { width: 1200 },
  'chailogo.png': { height: 224 },
  'circleimage.png': { width: 1000 },
  'blogbg.png': { width: 1920 },
  'cleft.png': { width: 800 },
  'cright.png': { width: 800 },
  'chooseleft.png': { width: 800 },
  'chooseright.png': { width: 800 },
  'brandtwo.png': { width: 1200 },
  'bro.png': { width: 1000 }
};

const results = [];

async function convertImage(filePath, file) {
  const ext = path.extname(file).toLowerCase();
  if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
    return;
  }
  
  const originalSize = fs.statSync(filePath).size;
  const webpPath = filePath.replace(ext, '.webp');
  
  let transform = sharp(filePath);
  const dims = dimensionsMap[file] || { width: 1000 };
  
  // Resize to 2x rendered width
  transform = transform.resize(dims);
  
  // Convert to WebP quality 82
  await transform.webp({ quality: 82 }).toFile(webpPath);
  
  const newSize = fs.statSync(webpPath).size;
  const savings = (((originalSize - newSize) / originalSize) * 100).toFixed(2);
  
  results.push({
    Filename: file,
    'Original Size (KB)': (originalSize / 1024).toFixed(2),
    'WebP Size (KB)': (newSize / 1024).toFixed(2),
    'Savings %': savings + '%'
  });
}

async function processDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      await processDirectory(filePath);
    } else {
      await convertImage(filePath, file);
    }
  }
}

async function run() {
  console.log('Starting conversion...');
  for (const dir of directories) {
    await processDirectory(dir);
  }
  console.table(results);
}

run().catch(console.error);
