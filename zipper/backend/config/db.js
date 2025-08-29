// In backend/config/db.js

const admin = require('firebase-admin');

// IMPORTANT: We use ../ to go up one level from the 'config' folder to find the service key
const serviceAccount = require('../serviceAccountKey.json.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// This is the line that connects to FIRESTORE
const db = admin.firestore();

module.exports = db; // Export the Firestore database instance