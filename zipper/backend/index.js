import express from "express";
import cors from "cors";
import { db } from "./firebase.js";
// To make mockProducts mutable, we must re-assign it to a 'let' variable.
import { mockProducts as initialMockProducts, categories as mockCategories } from "./data/sampleData.js";

const app = express();
app.use(cors());
app.use(express.json());

// This is the key change: Re-assign the imported const array to a mutable 'let' array.
let mockProducts = [...initialMockProducts];

// =========================
// LIKED ITEMS - FIX APPLIED HERE
// =========================

// In a real app, this would be a database table. For now, we declare
// the variable in memory to store the IDs of liked products.
let likedProductIds = new Set(["1", "3", "5"]); // Pre-populate with some example liked items

// =========================
// PRODUCTS
// =========================

// Get all products (Firestore-first, fallback to mock if empty)
app.get("/api/products", async (req, res) => {
  try {
    const snapshot = await db.collection("products").get();
    if (!snapshot.empty) {
      const products = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      console.log("Fetched products from Firestore:", products); // <-- LOG HERE
      return res.status(200).json(products);
    }

    // Fallback to mock if Firestore has no products
    console.log("Firestore empty: serving mock products");
    console.log("Mock products:", mockProducts); // <-- LOG MOCK DATA
    return res.status(200).json(mockProducts);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ message: "Error fetching products." });
  }
});

// Get single product by ID (Firestore-first, fallback to mock)
app.get("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = await db.collection("products").doc(id).get();
    if (docRef.exists) {
      const data = docRef.data();
      return res.status(200).json({
        id: docRef.id,
        name: data.name,
        price: Number(data.price) || 0,
        images: Array.isArray(data.images) ? data.images : (data.imageUrl ? [data.imageUrl] : []), // <-- always array
        description: data.description || "",
        rating: Number(data.rating) || 0,
        category: data.category || "Other",
        stockCount: Number(data.stockCount ?? data.stock ?? 0),
        inStock: (Number(data.stockCount ?? data.stock ?? 0) || 0) > 0,
        createdAt: data.createdAt || null,
        updatedAt: data.updatedAt || null,
      });
    }

    const fallback = mockProducts.find((p) => p.id === id);
    if (!fallback) return res.status(404).json({ message: "Product not found." });
    return res.status(200).json(fallback);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Error fetching product." });
  }
});

// Add new product (persist to Firestore)
app.post("/api/products", async (req, res) => {
  try {
    const { name, price, images, description, rating, category, stock } = req.body;

    const productToSave = {
      name,
      price: Number(price) || 0,
      images: images || [],
      description: description || "",
      rating: Number(rating) || 0,
      category: category || "Other",
      stockCount: Number(stock) || 0,
      inStock: (Number(stock) || 0) > 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await db.collection("products").add(productToSave);
    const saved = { id: docRef.id, ...productToSave };
    return res.status(201).json({ message: "Product added!", product: saved });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ message: "Error adding product." });
  }
});
// ==========================================================
// ===== NEW: API ENDPOINT TO UPDATE A PRODUCT (PUT) ========
// ==========================================================
// Find this route in your index.js
app.put("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, images, description, category, stock } = req.body;

    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found." });
    }

    const updates = {
      ...(name !== undefined ? { name } : {}),
      ...(price !== undefined ? { price: Number(price) } : {}),
      ...(images !== undefined ? { images: images || [] } : {}),
      ...(description !== undefined ? { description } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(stock !== undefined ? { stockCount: Number(stock), inStock: Number(stock) > 0 } : {}),
      updatedAt: new Date(),
    };

    await docRef.update(updates);
    const updatedDoc = await docRef.get();
    const data = updatedDoc.data();
    const product = {
      id: updatedDoc.id,
      name: data.name,
      price: Number(data.price) || 0,
      images: Array.isArray(data.images) ? data.images : [],
      description: data.description || "",
      rating: Number(data.rating) || 0,
      category: data.category || "Other",
      stockCount: Number(data.stockCount ?? 0),
      inStock: (Number(data.stockCount ?? 0) || 0) > 0,
      createdAt: data.createdAt || null,
      updatedAt: data.updatedAt || null,
    };
    return res.status(200).json({ message: "Product updated successfully!", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Error updating product." });
  }
});

// ============================================================
// ===== NEW: API ENDPOINT TO DELETE A PRODUCT (DELETE) =======
// ============================================================
app.delete("/api/products/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const docRef = db.collection("products").doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: "Product not found." });
    }
    await docRef.delete();
    return res.status(200).json({ message: `Product ${id} deleted successfully.` });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product." });
  }
});


app.get("/api/liked", async (req, res) => {
  try {
    console.log("Fetching liked products for IDs:", Array.from(likedProductIds));
    
    // Find the full product objects that match the liked IDs
    const likedItems = mockProducts.filter(product => likedProductIds.has(product.id));
    
    res.status(200).json(likedItems);
    console.log(`Served ${likedItems.length} liked products.`);
  } catch (error) {
    console.error("Error fetching liked products:", error);
    res.status(500).json({ message: "Error fetching liked products." });
  }
});

// POST to like a product
app.post("/api/products/:id/like", (req, res) => {
    const { id } = req.params;
    if (!mockProducts.find(p => p.id === id)) {
        return res.status(404).json({ message: "Product not found." });
    }
    likedProductIds.add(id);
    console.log(`Product ${id} liked. Current liked IDs:`, Array.from(likedProductIds));
    res.status(200).json({ message: `Product ${id} liked successfully.`});
});

// DELETE to unlike a product
app.delete("/api/products/:id/unlike", (req, res) => {
    const { id } = req.params;
    if (likedProductIds.has(id)) {
        likedProductIds.delete(id);
        console.log(`Product ${id} unliked. Current liked IDs:`, Array.from(likedProductIds));
        res.status(200).json({ message: `Product ${id} unliked successfully.`});
    } else {
        res.status(404).json({ message: "Product not in liked list." });
    }
});


// =========================
// CATEGORIES
// =========================

// Get all categories
app.get("/api/categories", async (req, res) => {
  try {
    // Return mock categories instead of Firebase
    res.status(200).json(mockCategories);
    console.log(`Served ${mockCategories.length} categories from sample data`);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Error fetching categories." });
  }
});

// =========================
// REVIEWS
// =========================

// Get reviews for a product
app.get("/api/products/:id/reviews", async (req, res) => {
  try {
    // For now, return empty reviews array
    // TODO: Implement reviews functionality
    res.status(200).json([]);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Error fetching reviews." });
  }
});

// Add a review to a product
app.post("/api/products/:id/reviews", async (req, res) => {
  try {
    const { rating, reviewedBy, comment } = req.body;
    
    // For now, just return success
    // TODO: Implement review storage
    res.status(201).json({ message: "Review added successfully!" });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Error adding review." });
  }
});

// =========================
// TEST ENDPOINTS
// =========================

// Test endpoint to verify sample data
app.get("/api/test", (req, res) => {
  res.json({
    message: "Backend is running with sample data",
    productCount: mockProducts.length,
    categoryCount: mockCategories.length,
    sampleProduct: mockProducts[0],
    sampleCategory: mockCategories[0]
  });
});

// =========================
// ORDERS
// =========================

// Create new order
app.post("/api/orders", async (req, res) => {
  try {
    const orderData = {
      ...req.body,
      createdAt: new Date(),
      status: "pending"
    };
    const docRef = await db.collection("orders").add(orderData);
    res.status(201).json({ message: "Order placed!", id: docRef.id });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Error creating order." });
  }
});

// =========================
// SERVER START
// =========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});