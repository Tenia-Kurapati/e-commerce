// app/liked/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ProductCard } from "@/components/products/ProductCard";
import { useLikes } from "@/context/LikesContext"; // 1. Import the context hook

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function LikedPage() {
  // 2. Get the synced liked IDs and loading state directly from our powerful context.
  const { likedIds, loadingLikes } = useLikes();
  
  const [allProducts, setAllProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // We still need to fetch the full product details (name, price, etc.)
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch(`${API_BASE}/api/products`);
        if (!res.ok) throw new Error("Failed to fetch products.");
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchAllProducts();
  }, []);

  // 3. Filter all products based on the liked IDs from the context. This will always be up-to-date.
  const likedItems = allProducts.filter(product => likedIds.has(product.id));

  const renderContent = () => {
    if (loadingLikes || loadingProducts) {
      return (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading your favorites...</p>
        </div>
      );
    }
    
    if (likedItems.length === 0) {
      return (
        <div className="text-center py-20 col-span-full bg-slate-50/70 rounded-2xl">
          <Heart className="mx-auto h-16 w-16 text-slate-400 mb-4" />
          <h2 className="text-2xl font-bold text-slate-800">No Liked Items Yet</h2>
          <p className="text-slate-500 mt-2 mb-6">Click the heart icon on any product to save it here.</p>
          <Link href="/dashboard/products">
            <Button className="bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold">
              <ArrowLeft className="mr-2 h-4 w-4"/> Start Shopping
            </Button>
          </Link>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* We can now reuse the main ProductCard, which has all the like/cart logic! */}
        {likedItems.map(product => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.images?.[0] || product.image}
            rating={product.rating}
            oldPrice={product.originalPrice}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-slate-200">
      <div className="w-full max-w-screen-2xl mx-auto bg-white/60 backdrop-blur-2xl rounded-b-3xl shadow-lg border border-white/50 overflow-hidden flex flex-col">
        <main className="p-6 flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-8">Your Liked Items</h1>
          {renderContent()}
        </main>
      </div>
    </div>
  );
}