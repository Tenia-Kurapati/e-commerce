import fs from 'fs';
import path from 'path';
import https from 'https';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary configuration
cloudinary.config({
  cloud_name: 'dohs5ggvp',
  api_key: '289829852332987',
  api_secret: 'EdYkYleapKG5Xe8iqRxTOBAPYSo'
});

// Sample data path
const sampleDataPath = path.join(__dirname, '../data/sampleData.js');

// Function to download image from URL
function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
      
      file.on('error', (err) => {
        fs.unlink(filename, () => {}); // Delete the file if there's an error
        reject(err);
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to upload image to Cloudinary
async function uploadToCloudinary(imagePath, productName) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'proshop-products',
      public_id: `${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      transformation: [
        { width: 500, height: 400, crop: 'fill' },
        { quality: 'auto' }
      ]
    });
    
    // Clean up local file
    fs.unlinkSync(imagePath);
    
    return result.secure_url;
  } catch (error) {
    console.error(`Error uploading to Cloudinary: ${error.message}`);
    // Clean up local file even if upload fails
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
    throw error;
  }
}

// Function to extract product name from Unsplash URL
function extractProductNameFromUrl(url, productName) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    const photoId = pathParts[pathParts.length - 1];
    return `${productName}-${photoId}`;
  } catch (error) {
    return `${productName}-${Date.now()}`;
  }
}

// Main migration function
async function migrateImagesToCloudinary() {
  try {
    console.log('🚀 Starting image migration to Cloudinary...');
    
    // Read the sample data
    const sampleData = await import('../data/sampleData.js');
    const { mockProducts } = sampleData;
    
    const updatedProducts = [];
    const tempDir = path.join(__dirname, 'temp-images');
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
    
    for (let i = 0; i < mockProducts.length; i++) {
      const product = mockProducts[i];
      console.log(`\n📦 Processing product ${i + 1}/${mockProducts.length}: ${product.name}`);
      
      if (!product.images || !Array.isArray(product.images)) {
        console.log(`   ⚠️  No images found for ${product.name}`);
        updatedProducts.push(product);
        continue;
      }
      
      const updatedImages = [];
      
      for (let j = 0; j < product.images.length; j++) {
        const imageUrl = product.images[j];
        
        // Skip if not an Unsplash URL
        if (!imageUrl.includes('unsplash.com')) {
          console.log(`   ℹ️  Skipping non-Unsplash image: ${imageUrl}`);
          updatedImages.push(imageUrl);
          continue;
        }
        
        try {
          console.log(`   📥 Downloading image ${j + 1}/${product.images.length}...`);
          
          // Create a unique filename
          const filename = path.join(tempDir, `${product.id}-${j}-${Date.now()}.jpg`);
          
          // Download the image
          await downloadImage(imageUrl, filename);
          console.log(`   ✅ Downloaded: ${filename}`);
          
          // Upload to Cloudinary
          console.log(`   ☁️  Uploading to Cloudinary...`);
          const cloudinaryUrl = await uploadToCloudinary(filename, product.name);
          
          console.log(`   ✅ Uploaded to Cloudinary: ${cloudinaryUrl}`);
          updatedImages.push(cloudinaryUrl);
          
        } catch (error) {
          console.error(`   ❌ Error processing image ${j + 1}: ${error.message}`);
          // Keep the original URL if migration fails
          updatedImages.push(imageUrl);
        }
      }
      
      // Update product with new image URLs
      const updatedProduct = {
        ...product,
        images: updatedImages
      };
      
      updatedProducts.push(updatedProduct);
      console.log(`   ✨ Updated ${product.name} with ${updatedImages.length} images`);
    }
    
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
    
    // Create updated sample data
    const updatedSampleData = `// backend/data/sampleData.js - Updated with Cloudinary URLs

const categories = ${JSON.stringify(sampleData.categories, null, 2)};

const mockProducts = ${JSON.stringify(updatedProducts, null, 2)};

export { categories, mockProducts };
`;
    
    // Write updated data back to file
    fs.writeFileSync(sampleDataPath, updatedSampleData);
    
    console.log('\n🎉 Migration completed successfully!');
    console.log(`📊 Processed ${mockProducts.length} products`);
    console.log(`📁 Updated file: ${sampleDataPath}`);
    
    // Also create a backup
    const backupPath = sampleDataPath.replace('.js', '.backup.js');
    fs.writeFileSync(backupPath, `// Original data backup - ${new Date().toISOString()}\n${fs.readFileSync(sampleDataPath, 'utf8')}`);
    console.log(`💾 Backup created: ${backupPath}`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateImagesToCloudinary();
