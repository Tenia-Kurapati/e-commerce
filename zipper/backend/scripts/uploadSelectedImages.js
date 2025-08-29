import fs from 'fs';
import path from 'path';
import https from 'https';
import { v2 as cloudinary } from 'cloudinary';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

cloudinary.config({
  cloud_name: 'dohs5ggvp',
  api_key: '289829852332987',
  api_secret: 'EdYkYleapKG5Xe8iqRxTOBAPYSo'
});

const targets = [
  { id: '1', name: 'Premium Wireless Headphones', urls: [
    'https://m.media-amazon.com/images/I/61bQrYzzSOL._SL1500_.jpg'
  ] },
  { id: '2', name: 'Smart Fitness Watch', urls: [
    'https://m.media-amazon.com/images/I/612eEvXb2eL._SL1500_.jpg',
    'https://m.media-amazon.com/images/I/61GtNbUw0dL._SL1500_.jpg'
  ] },
  { id: '3', name: 'Luxury Leather Jacket', urls: [
    'https://assets-jiocdn.ajio.com/medias/sys_master/root/20240507/QesY/6639301605ac7d77bb441a81/-1117Wx1400H-467306919-black-MODEL4.jpg',
    'https://assets-jiocdn.ajio.com/medias/sys_master/root/20240718/GGHt/6699158d6f60443f3177df73/-473Wx593H-467306919-black-MODEL.jpg'
  ] },
  { id: '4', name: 'Ergonomic Office Chair', urls: [
    'https://rukminim2.flixcart.com/image/416/416/xif0q/office-study-chair/9/d/w/pp-polypropylene-dgc108-drogo-original-imah9ryywfhyu6jd.jpeg'
  ] },
  { id: '6', name: 'Designer Sunglasses', urls: [
    'https://static5.lenskart.com/media/catalog/product/pro/1/thumbnail/480x480/9df78eab33525d08d6e5fb8d27136e95//v/i/grey-gunmetal-full-rim-aviator-vincent-chase-polarized-all-time-hits-vc-s13110-c15-sunglasses_g_0389_23_08_2023.jpg'
  ] },
  { id: '7', name: 'Organic Skincare Set', urls: [
    'https://m.media-amazon.com/images/I/51VUFu7xLLL._SL1000_.jpg'
  ] },
  { id: '8', name: 'Yoga Mat Pro', urls: [
    'https://m.media-amazon.com/images/I/61DEict44KL._SL1500_.jpg'
  ] },
  { id: '9', name: 'Smart LED Lamp', urls: [
    'https://rukminim2.flixcart.com/image/416/416/table-lamp/h/r/r/s-mart-led-table-lamp-rechargeable-and-dimmable-with-touch-original-imaeqvzzt5rvvs7b.jpeg'
  ] },
];

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
        fs.unlink(filename, () => {});
        reject(err);
      });
    }).on('error', reject);
  });
}

async function uploadToCloudinary(imagePath, productName) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'proshop-products',
      public_id: `${productName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
      transformation: [
        { width: 800, height: 800, crop: 'fill' },
        { quality: 'auto' }
      ]
    });
    fs.unlinkSync(imagePath);
    return result.secure_url;
  } catch (error) {
    if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
    throw error;
  }
}

async function main() {
  const tempDir = path.join(__dirname, 'temp-selected');
  if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

  const uploadedMap = {};

  for (const item of targets) {
    const uploadedUrls = [];
    for (const srcUrl of item.urls) {
      const filename = path.join(tempDir, `${item.id}-${Date.now()}.jpg`);
      console.log(`Downloading ${item.name} image...`);
      await downloadImage(srcUrl, filename);
      console.log(`Uploading ${item.name} image to Cloudinary...`);
      const url = await uploadToCloudinary(filename, item.name);
      uploadedUrls.push(url);
      console.log(`Uploaded ${item.name}: ${url}`);
    }
    uploadedMap[item.id] = uploadedUrls;
  }

  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  const sampleDataPath = path.join(__dirname, '../data/sampleData.js');
  const content = fs.readFileSync(sampleDataPath, 'utf8');

  // Update images array for matching products to use the new uploaded URLs
  let updated = content;
  const productIds = Object.keys(uploadedMap);
  for (const pid of productIds) {
    const urls = uploadedMap[pid];
    const arrayContent = urls.map(u => `"${u}"`).join(', ');
    // Replace entire images array content for the product with id pid
    const regex = new RegExp(`(id:\\s*\"${pid}\"[\\s\\S]*?images:\\s*\\[)[\\s\\S]*?(\\])`, 'm');
    updated = updated.replace(regex, `$1 ${arrayContent} $2`);
  }

  fs.writeFileSync(sampleDataPath, updated);
  console.log('Updated sampleData.js with new Cloudinary URLs for selected products.');
}

main().catch((e) => { console.error(e); process.exit(1); });


