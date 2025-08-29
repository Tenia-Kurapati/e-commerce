# Image Migration Script

This script downloads all Unsplash images from your product data and uploads them to Cloudinary, then updates your data files with the new Cloudinary URLs.

## Prerequisites

1. **Cloudinary Account**: You need a Cloudinary account with API credentials
2. **Node.js**: Make sure you have Node.js installed
3. **Dependencies**: Install required packages

## Setup

1. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Verify Cloudinary credentials** in `scripts/migrateToCloudinary.js`:
   ```javascript
   cloudinary.config({
     cloud_name: 'dohs5ggvp',
     api_key: '289829852332987',
     api_secret: 'EdYkYleapKG5Xe8iqRxTOBAPYSo'
   });
   ```

## Usage

Run the migration script:

```bash
npm run migrate-images
```

Or directly:

```bash
node scripts/migrateToCloudinary.js
```

## What the script does:

1. **Downloads** all Unsplash images from your product data
2. **Uploads** them to Cloudinary with optimized transformations (500x400, auto quality)
3. **Updates** your `sampleData.js` file with new Cloudinary URLs
4. **Creates** a backup of your original data
5. **Cleans up** temporary files

## Output

- ✅ **Updated data**: `backend/data/sampleData.js` with Cloudinary URLs
- 💾 **Backup**: `backend/data/sampleData.backup.js` with original data
- 📊 **Logs**: Detailed progress of each product and image

## Benefits

- 🚫 **No more API limits** from Unsplash
- ⚡ **Faster loading** with Cloudinary's CDN
- 🎨 **Optimized images** with automatic transformations
- 🔒 **Reliable hosting** on Cloudinary's infrastructure

## Troubleshooting

- **Rate limits**: Cloudinary has generous limits, but if you hit them, wait and retry
- **Network issues**: The script will retry failed uploads
- **Invalid URLs**: Any non-Unsplash URLs are preserved as-is

## After Migration

1. **Restart** your backend server to load new data
2. **Test** your frontend to ensure images load correctly
3. **Verify** all products display images properly
