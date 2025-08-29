// app/cart/page.jsx
'use client';

import { useCart } from '@/context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const PLACEHOLDER_SVG = "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#e2e8f0'/><text x='50%' y='50%' fill='#94a3b8' font-size='24'>Image</text></svg>");

// Using the same robust image handler from the homepage for consistency
function normalizeImageUrl(product) {
  let candidate = product?.imageUrl || product?.image || (Array.isArray(product?.images) ? product.images[0] : null) || product?.img || product?.photo;
  if (!candidate) return PLACEHOLDER_SVG;
  if (typeof candidate !== "string") { if (candidate?.url) candidate = candidate.url; else return PLACEHOLDER_SVG; }
  candidate = candidate.trim();
  if (candidate.startsWith("data:") || candidate.startsWith("blob:")) return candidate;
  if (candidate.includes("res.cloudinary.com")) return candidate;
  if (candidate.startsWith("http://") || candidate.startsWith("https://")) { if (candidate.includes("localhost") || candidate.includes("127.0.0.1")) return candidate; return PLACEHOLDER_SVG; }
  return `${API_BASE}${candidate.startsWith("/") ? "" : "/"}${candidate}`;
}

// A dedicated component for the empty cart state
function EmptyCart() {
    return (
        <div className="text-center py-20 col-span-full bg-slate-50/70 rounded-2xl">
            <ShoppingBag className="mx-auto h-16 w-16 text-slate-400 mb-4" />
            <h2 className="text-3xl font-bold text-slate-800">Your Cart is Empty</h2>
            <p className="text-slate-500 mt-2 mb-6 max-w-sm mx-auto">
                Looks like you haven't added anything yet. Let's find something for you.
            </p>
            <Link href="/">
                <Button className="bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold">
                    <ArrowLeft className="mr-2 h-4 w-4"/>
                    Continue Shopping
                </Button>
            </Link>
        </div>
    );
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-slate-200">
      <div className="w-full max-w-screen-2xl mx-auto bg-white/60 backdrop-blur-2xl rounded-b-3xl shadow-lg border border-white/50 overflow-hidden flex flex-col">
        
        <main className="p-6 flex-1">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800">Shopping Cart</h1>
            {cartItems.length > 0 && (
              <Button
                onClick={clearCart}
                variant="ghost"
                className="text-red-600 hover:text-red-700 hover:bg-red-50 font-medium"
              >
                Clear Cart
              </Button>
            )}
          </div>

          {cartItems.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-slate-50/70 rounded-2xl p-4 flex items-center space-x-4 border border-white/50">
                    <Link href={`/dashboard/products/${item.id}`}>
                      <div className="w-24 h-24 relative flex-shrink-0">
                        <Image
                          src={normalizeImageUrl(item)}
                          alt={item.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>
                    </Link>
                    <div className="flex-1">
                      <Link href={`/dashboard/products/${item.id}`}>
                        <h3 className="text-lg font-bold text-slate-800 hover:underline">{item.name}</h3>
                      </Link>
                      <p className="text-slate-600">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center space-x-2 bg-white/50 rounded-full p-1 border">
                      <Button size="icon" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="rounded-full h-8 w-8">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center font-bold text-slate-800 text-lg tabular-nums">{item.quantity}</span>
                      <Button size="icon" variant="ghost" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="rounded-full h-8 w-8">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="text-right w-24">
                      <p className="font-bold text-slate-800 text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                      <Button size="icon" variant="ghost" onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600 mt-1 mx-auto">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-slate-50/70 rounded-2xl p-6 sticky top-24 border border-white/50">
                  <h2 className="text-2xl font-bold text-slate-800 mb-6">Order Summary</h2>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span className="font-medium text-slate-800">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span className="font-medium text-green-600">Free</span>
                    </div>
                    <div className="border-t border-slate-200/80 pt-4 mt-4">
                      <div className="flex justify-between text-slate-800">
                        <span className="text-xl font-bold">Total</span>
                        <span className="text-xl font-bold">${subtotal.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <Link href="/checkout">
                    <Button size="lg" className="w-full bg-lime-300 text-slate-900 font-bold hover:bg-lime-400 rounded-full text-base">
                      Proceed to Checkout
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>


      </div>
    </div>
  );
}