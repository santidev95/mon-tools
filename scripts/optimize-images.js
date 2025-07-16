const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function optimizeImages() {
  console.log('Starting image optimization with Sharp...');
  
  const publicDir = path.join(__dirname, '..', 'public');
  const files = fs.readdirSync(publicDir).filter(file => 
    file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
  );

  for (const file of files) {
    const inputPath = path.join(publicDir, file);
    const outputPath = path.join(publicDir, `optimized_${file}`);
    
    try {
      const originalStats = fs.statSync(inputPath);
      const originalSize = originalStats.size;
      
      if (file.endsWith('.png')) {
        await sharp(inputPath)
          .png({ quality: 75, compressionLevel: 9 })
          .toFile(outputPath);
      } else {
        await sharp(inputPath)
          .jpeg({ quality: 75, progressive: true })
          .toFile(outputPath);
      }
      
      const optimizedStats = fs.statSync(outputPath);
      const optimizedSize = optimizedStats.size;
      const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
      
      console.log(`${file}: ${(originalSize / 1024 / 1024).toFixed(1)}MB → ${(optimizedSize / 1024 / 1024).toFixed(1)}MB (${savings}% saved)`);
      
      // Replace original with optimized if it's smaller
      if (optimizedSize < originalSize) {
        fs.copyFileSync(outputPath, inputPath);
      }
      
      // Clean up temporary file
      fs.unlinkSync(outputPath);
      
    } catch (error) {
      console.error(`Error optimizing ${file}:`, error.message);
    }
  }
  
  console.log('Image optimization complete!');
}

optimizeImages();