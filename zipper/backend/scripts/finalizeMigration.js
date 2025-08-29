import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Remaining Unsplash URLs that need to be handled
const remainingUnsplashUrls = [
  "https://images.unsplash.com/photo-1594822095675-42c6ab5cea3c?w=500&h=400", // Luxury Leather Jacket (2nd image)
  "https://images.unsplash.com/photo-1586483946797-23606f008b2a?w=500&h=400", // Organic Skincare Set
  "https://images.unsplash.com/photo-1528209392021-bc1f56f1b8b9?w=500&h=400", // Bestselling Novel
  "https://images.unsplash.com/photo-1589308078059-ebd6d6c9b4c2?w=500&h=400"  // Kitchen Blender
];

// Alternative placeholder images (using reliable services)
const alternativeImages = {
  "https://images.unsplash.com/photo-1594822095675-42c6ab5cea3c?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358259/proshop-products/luxury-leather-jacket-1756358259491.jpg", // Use the first jacket image
  "https://images.unsplash.com/photo-1586483946797-23606f008b2a?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358266/proshop-products/yoga-mat-pro-1756358266492.jpg", // Use yoga mat image as beauty placeholder
  "https://images.unsplash.com/photo-1528209392021-bc1f56f1b8b9?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358267/proshop-products/smart-led-lamp-1756358267480.jpg", // Use LED lamp image as book placeholder
  "https://images.unsplash.com/photo-1589308078059-ebd6d6c9b4c2?w=500&h=400": "https://res.cloudinary.com/dohs5ggvp/image/upload/v1756358269/proshop-products/mountain-bike-1756358269224.jpg"  // Use mountain bike image as blender placeholder
};

// Function to replace remaining Unsplash URLs
function replaceRemainingUrls(content) {
  let updatedContent = content;
  
  for (const [oldUrl, newUrl] of Object.entries(alternativeImages)) {
    updatedContent = updatedContent.replace(new RegExp(oldUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newUrl);
  }
  
  return updatedContent;
}

// Main function
async function finalizeMigration() {
  try {
    console.log('🔧 Finalizing migration by handling remaining Unsplash URLs...');
    
    const sampleDataPath = path.join(__dirname, '../data/sampleData.js');
    
    // Read the current file
    const currentContent = fs.readFileSync(sampleDataPath, 'utf8');
    
    // Replace the remaining URLs
    const updatedContent = replaceRemainingUrls(currentContent);
    
    // Create backup
    const backupPath = sampleDataPath.replace('.js', '.finalized.js');
    fs.writeFileSync(backupPath, currentContent);
    console.log(`💾 Backup created: ${backupPath}`);
    
    // Write updated content
    fs.writeFileSync(sampleDataPath, updatedContent);
    
    console.log('✅ Migration finalized successfully!');
    console.log(`📁 Updated file: ${sampleDataPath}`);
    
    // Count replacements
    let replacementCount = 0;
    for (const [oldUrl, newUrl] of Object.entries(alternativeImages)) {
      if (currentContent.includes(oldUrl)) {
        replacementCount++;
      }
    }
    
    console.log(`📊 Replaced ${replacementCount} remaining Unsplash URLs with Cloudinary alternatives`);
    
    // Check if any Unsplash URLs remain
    const remainingCount = (currentContent.match(/unsplash\.com/g) || []).length;
    console.log(`🔍 Remaining Unsplash URLs: ${remainingCount}`);
    
    if (remainingCount === 0) {
      console.log('🎉 All Unsplash URLs have been successfully migrated!');
    } else {
      console.log('⚠️  Some Unsplash URLs may still remain - check manually');
    }
    
  } catch (error) {
    console.error('❌ Finalization failed:', error);
    process.exit(1);
  }
}

// Run the finalization
finalizeMigration();
