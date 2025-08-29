import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cloudinary URLs that were successfully uploaded during migration
const cloudinaryImageMap = {
  // Product 1: Premium Wireless Headphones
  "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358254/proshop-products/premium-wireless-headphones-1756358253861.jpg",
  "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358256/proshop-products/premium-wireless-headphones-1756358255804.jpg",
  
  // Product 2: Smart Fitness Watch
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358257/proshop-products/smart-fitness-watch-1756358256768.jpg",
  "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358258/proshop-products/smart-fitness-watch-1756358258612.jpg",
  
  // Product 3: Luxury Leather Jacket (only first image worked)
  "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358259/proshop-products/luxury-leather-jacket-1756358259491.jpg",
  
  // Product 4: Ergonomic Office Chair
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358261/proshop-products/ergonomic-office-chair-1756358261611.jpg",
  
  // Product 5: Professional Camera Lens
  "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358262/proshop-products/professional-camera-lens-1756358262394.jpg",
  
  // Product 6: Designer Sunglasses
  "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358264/proshop-products/designer-sunglasses-1756358263866.jpg",
  
  // Product 8: Yoga Mat Pro
  "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358266/proshop-products/yoga-mat-pro-1756358266492.jpg",
  
  // Product 9: Smart LED Lamp
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358267/proshop-products/smart-led-lamp-1756358267480.jpg",
  
  // Product 11: Mountain Bike
  "https://images.unsplash.com/photo-1508780709619-79562169bc64?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358269/proshop-products/mountain-bike-1756358269224.jpg"
};

// Function to replace image URLs
function replaceImageUrls(content) {
  let updatedContent = content;
  
  for (const [oldUrl, newUrl] of Object.entries(cloudinaryImageMap)) {
    updatedContent = updatedContent.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
  }
  
  return updatedContent;
}

// Main function
async function updateImageUrls() {
  try {
    console.log('🔄 Starting image URL update...');
    
    const sampleDataPath = path.join(__dirname, '../data/sampleData.js');
    
    // Read the current file
    const currentContent = fs.readFileSync(sampleDataPath, 'utf8');
    
    // Replace the URLs
    const updatedContent = replaceImageUrls(currentContent);
    
    // Create backup
    const backupPath = sampleDataPath.replace('.js', '.backup.js');
    fs.writeFileSync(backupPath, currentContent);
    console.log(`💾 Backup created: ${backupPath}`);
    
    // Write updated content
    fs.writeFileSync(sampleDataPath, updatedContent);
    
    console.log('✅ Image URLs updated successfully!');
    console.log(`📁 Updated file: ${sampleDataPath}`);
    
    // Count replacements
    let replacementCount = 0;
    for (const [oldUrl, newUrl] of Object.entries(cloudinaryImageMap)) {
      if (currentContent.includes(oldUrl)) {
        replacementCount++;
      }
    }
    
    console.log(`📊 Replaced ${replacementCount} image URLs with Cloudinary URLs`);
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

// Run the update
updateImageUrls();
