// backend/scripts/seed.js
const db = require("../config/db");
const { categories, mockProducts } = require("../data/SampleData");

async function seedDatabase() {
  try {
    console.log("🌱 Starting Firestore seeding...");

    // ---- Categories ----
    const categoriesRef = db.collection("categories");
    for (const category of categories) {
      await categoriesRef.doc(category.id).set(category);
      console.log(`✅ Category added: ${category.name}`);
    }

    // ---- Products ----
    const productsRef = db.collection("products");
    for (const product of mockProducts) {
      await productsRef.doc(product.id).set(product);
      console.log(`✅ Product added: ${product.name}`);
    }

    console.log("🎉 Database seeding complete!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding database:", err);
    process.exit(1);
  }
}

seedDatabase();
