// backend/data/sampleData.js

const categories = [
    { id: "electronics", name: "Electronics", description: "Latest gadgets and tech" },
    { id: "fashion", name: "Fashion", description: "Trendy clothing and accessories" },
    { id: "home", name: "Home & Garden", description: "Everything for your home" },
    { id: "beauty", name: "Beauty", description: "Skincare and cosmetics" },
    { id: "sports", name: "Sports", description: "Fitness and outdoor gear" },
    { id: "books", name: "Books", description: "Knowledge and entertainment" }
  ];
  
  const mockProducts = [
    {
      id: "1",
      name: "Premium Wireless Headphones",
      description: "Experience crystal-clear audio with noise cancellation.",
      price: 299.99,
      originalPrice: 399.99,
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=400",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=400"
      ],
      category: "electronics",
      subcategory: "audio",
      rating: 4.8,
      reviewCount: 127,
      inStock: true,
      stockCount: 45,
      features: ["Active Noise Cancellation", "30-hour battery life", "Premium leather comfort", "High-resolution audio"],
      specifications: { "Battery Life": "30 hours", "Connectivity": "Bluetooth 5.0", "Weight": "280g", "Warranty": "2 years" },
      isNew: true, isSale: true, isFeatured: true
    },
    {
      id: "2",
      name: "Smart Fitness Watch",
      description: "Track fitness with HR monitor, GPS, and 7-day battery life.",
      price: 249.99,
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=400",
        "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=500&h=400"
      ],
      category: "electronics",
      subcategory: "wearables",
      rating: 4.6,
      reviewCount: 89,
      inStock: true,
      stockCount: 23,
      features: ["Heart rate monitoring", "GPS tracking", "Water resistant", "7-day battery life"],
      specifications: { "Display": "1.4 inch AMOLED", "Battery": "7 days", "Water Resistance": "50M", "Compatibility": "iOS & Android" },
      isNew: true, isFeatured: true
    },
    {
      id: "3",
      name: "Luxury Leather Jacket",
      description: "Handcrafted from premium genuine leather for style & durability.",
      price: 399.99,
      originalPrice: 599.99,
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=400",
        "https://images.unsplash.com/photo-1594822095675-42c6ab5cea3c?w=500&h=400"
      ],
      category: "fashion",
      subcategory: "outerwear",
      rating: 4.9,
      reviewCount: 156,
      inStock: true,
      stockCount: 12,
      features: ["Genuine leather", "Hand-crafted", "Multiple pockets", "Classic fit"],
      specifications: { "Material": "100% Genuine Leather", "Care": "Dry clean only", "Origin": "Italy", "Sizes": "XS - XXL" },
      isSale: true, isFeatured: true
    },
    {
      id: "4",
      name: "Ergonomic Office Chair",
      description: "Boost productivity with lumbar support and adjustable height.",
      price: 499.99,
      images: ["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&h=400"],
      category: "home",
      subcategory: "furniture",
      rating: 4.7,
      reviewCount: 203,
      inStock: true,
      stockCount: 8,
      features: ["Lumbar support", "Adjustable height", "Breathable mesh", "360° swivel"],
      specifications: { "Weight Capacity": "300 lbs", "Height Range": "42-46 in", "Material": "Mesh & Steel", "Warranty": "5 years" },
      isFeatured: true
    },
    {
      id: "5",
      name: "Professional Camera Lens",
      description: "Capture stunning photos with pro optics & stabilization.",
      price: 899.99,
      images: ["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500&h=400"],
      category: "electronics",
      subcategory: "photography",
      rating: 4.9,
      reviewCount: 67,
      inStock: true,
      stockCount: 15,
      features: ["Image stabilization", "Weather sealed", "Fast autofocus", "Pro optics"],
      specifications: { "Focal Length": "24-70mm", "Aperture": "f/2.8", "Weight": "805g", "Mount": "Canon EF" },
      isNew: true
    },
    {
      id: "6",
      name: "Designer Sunglasses",
      description: "Protect your eyes with UV protection and stylish frames.",
      price: 199.99,
      originalPrice: 299.99,
      images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&h=400"],
      category: "fashion",
      subcategory: "accessories",
      rating: 4.5,
      reviewCount: 94,
      inStock: true,
      stockCount: 31,
      features: ["UV 400 protection", "Polarized lenses", "Lightweight frame", "Designer style"],
      specifications: { "UV Protection": "100% UV400", "Frame": "Acetate", "Lens": "Polycarbonate", "Size": "Medium" },
      isSale: true
    },
    // Extra filler products for demo
    {
      id: "7",
      name: "Organic Skincare Set",
      description: "Natural ingredients for glowing skin.",
      price: 59.99,
      category: "beauty",
      subcategory: "skincare",
      rating: 4.3,
      reviewCount: 50,
      inStock: true,
      stockCount: 20,
      images: ["https://images.unsplash.com/photo-1586483946797-23606f008b2a?w=500&h=400"],
      features: ["Organic", "Dermatologist tested"],
      specifications: { "Contents": "Cleanser, Moisturizer, Serum" },
      isNew: true
    },
    {
      id: "8",
      name: "Yoga Mat Pro",
      description: "Durable, eco-friendly yoga mat with non-slip surface.",
      price: 39.99,
      category: "sports",
      subcategory: "fitness",
      rating: 4.7,
      reviewCount: 76,
      inStock: true,
      stockCount: 40,
      images: ["https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=500&h=400"],
      features: ["Eco-friendly", "Non-slip", "6mm thick"],
      specifications: { "Material": "Natural Rubber", "Length": "72 in" }
    },
    {
      id: "9",
      name: "Smart LED Lamp",
      description: "Control brightness & color with your smartphone.",
      price: 79.99,
      category: "home",
      subcategory: "lighting",
      rating: 4.6,
      reviewCount: 88,
      inStock: true,
      stockCount: 18,
      images: ["https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500&h=400"],
      features: ["Smart app control", "16M colors"],
      specifications: { "Power": "10W", "Connectivity": "WiFi" }
    },
    {
      id: "10",
      name: "Bestselling Novel",
      description: "Award-winning fiction novel for book lovers.",
      price: 14.99,
      category: "books",
      subcategory: "fiction",
      rating: 4.8,
      reviewCount: 320,
      inStock: true,
      stockCount: 100,
      images: ["https://images.unsplash.com/photo-1528209392021-bc1f56f1b8b9?w=500&h=400"],
      features: ["Paperback", "Bestseller"],
      specifications: { "Pages": "320", "Publisher": "Famous House" }
    },
    {
      id: "11",
      name: "Mountain Bike",
      description: "Durable MTB with suspension for rough trails.",
      price: 999.99,
      category: "sports",
      subcategory: "cycling",
      rating: 4.9,
      reviewCount: 42,
      inStock: true,
      stockCount: 6,
      images: ["https://images.unsplash.com/photo-1508780709619-79562169bc64?w=500&h=400"],
      features: ["21-speed", "Disc brakes", "Aluminum frame"],
      specifications: { "Weight": "14kg", "Wheel Size": "27.5in" }
    },
    {
      id: "12",
      name: "Kitchen Blender",
      description: "High-speed blender for smoothies & soups.",
      price: 129.99,
      category: "home",
      subcategory: "appliances",
      rating: 4.4,
      reviewCount: 65,
      inStock: true,
      stockCount: 25,
      images: ["https://images.unsplash.com/photo-1589308078059-ebd6d6c9b4c2?w=500&h=400"],
      features: ["1200W motor", "Glass jar"],
      specifications: { "Capacity": "1.5L", "Speeds": "5" },
      isSale: true
    }
  ];
  
export { categories, mockProducts };
  