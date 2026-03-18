import sharp from 'sharp'

const tasks = [
  { src: 'src/assets/cright.webp',      widths: [336, 672] },
  { src: 'src/assets/cleft.webp',        widths: [336, 672] },
  { src: 'src/assets/circleimage.webp',  widths: [420]      },
  { src: 'src/assets/brandwo.webp',      widths: [800, 1400] },
]

for (const { src, widths } of tasks) {
  for (const w of widths) {
    const out = src.replace('.webp', `-${w}w.webp`)
    await sharp(src).resize(w).webp({ quality: 85 }).toFile(out)
    console.log('Created:', out)
  }
}

console.log('Done! All resized images created.')
