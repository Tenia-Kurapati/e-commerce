// components/products/ProductCard.jsx
'use client';

import React, { useMemo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, Heart, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button"; // Using shadcn/ui button for consistency
import { useCart } from "@/context/CartContext";
import { useLikes } from "@/context/LikesContext";
import { usePurchases } from "@/context/PurchasesContext";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Your robust placeholder and image normalization logic
const PLACEHOLDER_SVG = "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#f1f5f9'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#94a3b8' font-size='24' font-family='system-ui'>No image</text></svg>");

function normalizeSrc(input) {
  if (!input) return PLACEHOLDER_SVG;
  if (Array.isArray(input)) { const first = input.find((x) => typeof x === "string" && x.trim().length > 0); return normalizeSrc(first); }
  if (typeof input === "object" && input !== null) { if (typeof input.url === "string") return normalizeSrc(input.url); return PLACEHOLDER_SVG; }
  if (typeof input !== "string") return PLACEHOLDER_SVG;
  let src = input.trim();
  if (!src) return PLACEHOLDER_SVG;
  if (src.startsWith("data:") || src.startsWith("blob:")) return src;
  if (src.includes("res.cloudinary.com")) return src;
  if (src.startsWith("http://") || src.startsWith("https://")) { if (src.includes("localhost") || src.includes("127.0.0.1")) return src; return PLACEHOLDER_SVG; }
  return `${API_BASE}${src.startsWith("/") ? "" : "/"}${src}`;
}

export function ProductCard({ id, name, price, image, rating, oldPrice }) {
  // Your advanced image state handling
  const initialSrc = useMemo(() => normalizeSrc(image), [image]);
  const [currentSrc, setCurrentSrc] = useState(initialSrc);
  const [hadError, setHadError] = useState(false);
  const handleError = useCallback(() => { if (!hadError) { setHadError(true); setCurrentSrc(PLACEHOLDER_SVG); } }, [hadError]);

  // Your context hooks for full functionality
  const { addToCart } = useCart();
  const { isLiked, toggleLike } = useLikes();
  const { addPurchase } = usePurchases();

  // Your event handlers
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, name, price, images: [currentSrc], imageUrl: currentSrc });
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addPurchase({ items: [{ id, name, price, imageUrl: currentSrc, quantity: 1 }], total: price, createdAt: new Date().toISOString() });
    window.location.href = "#"; // Redirect to a purchase/checkout page
  };

  const handleToggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleLike(id);
  };

  return (
    <div className="bg-slate-50/70 rounded-2xl p-4 flex flex-col group relative border border-white/50 transition-shadow hover:shadow-lg">
      <Link href={`/dashboard/products/${id}`} className="block aspect-square relative rounded-lg overflow-hidden mb-4">
        <Image
          src={currentSrc}
          alt={name || "Product image"}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          placeholder="blur"
          blurDataURL={PLACEHOLDER_SVG}
          onError={handleError}
        />
        {/* Sale Badge */}
        {typeof oldPrice === "number" && price < oldPrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full pointer-events-none z-10">
            SALE
          </div>
        )}
        {/* Like/Wishlist Button */}
        <Button
          size="icon"
          variant="ghost"
          onClick={handleToggleLike}
          aria-label="Toggle like"
          className={`absolute top-3 right-3 bg-white/60 backdrop-blur-sm rounded-full h-9 w-9 hover:bg-white transition-colors z-10 ${isLiked(id) ? 'text-red-500' : 'text-slate-600'}`}
        >
          <Heart className={`h-5 w-5 ${isLiked(id) ? 'fill-current' : ''}`} />
        </Button>
      </Link>
      
      {/* Product Info */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-bold text-slate-800 text-base flex-1 leading-snug mb-2">
          <Link href={`/dashboard/products/${id}`} className="hover:underline">{name}</Link>
        </h3>
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <Star className="w-4 h-4 text-amber-400 fill-current" />
          <span className="text-sm text-slate-600 font-medium">{typeof rating === "number" ? rating.toFixed(1) : "N/A"}</span>
        </div>
        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4">
          <p className="text-slate-900 font-bold text-xl">${price?.toFixed(2)}</p>
          {typeof oldPrice === "number" && price < oldPrice && (
            <p className="text-slate-500 text-sm line-through">${oldPrice.toFixed(2)}</p>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-auto">
        <Button
          onClick={handleAddToCart}
          className="w-full bg-slate-800 text-white hover:bg-slate-900 rounded-full font-bold"
        >
          Add to Cart
        </Button>
        <Button
          onClick={handleBuyNow}
          className="w-full bg-lime-300 text-slate-900 hover:bg-lime-400 rounded-full font-bold"
        >
          Buy Now
        </Button>
      </div>
    </div>
  );
}