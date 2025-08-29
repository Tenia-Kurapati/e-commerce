'use client';

// ... (all other imports are the same)
import { useState, useEffect , use } from 'react'; // Removed 'use' from here
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useLikes } from '@/context/LikesContext';
import { usePurchases } from '@/context/PurchasesContext';
import { Star, Heart, Share2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function ProductDetailPage({ params }) {
  const { id } = use(params); // <-- CORRECTED LINE: Access id directly from params


  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const { isLiked, toggleLike } = useLikes();
  const { addPurchase } = usePurchases();
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/api/products/${id}`)
      .then(res => {
        console.log("Product detail fetch status:", res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log("Fetched product detail response:", data);
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Product detail fetch error:", err);
        setError("Failed to fetch product: " + err.message);
        setLoading(false);
      });
  }, [id]); // id is now correctly available and will trigger useEffect

  const handleAddToCart = () => {
    // ... (no changes here) ...
    if (!product) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.images?.[0] || '',
    });
    setShowAddedMessage(true);
    const timer = setTimeout(() => setShowAddedMessage(false), 3000); // Hide after 3 seconds
    return () => clearTimeout(timer); // Clean up the timer
  };

  const handleBuyNow = () => {
    if (!product) return;
    const purchaseItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.images?.[0] || '',
    };
    addPurchase({
      items: [purchaseItem],
      total: product.price * quantity,
    });
    router.push('/orders');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-lime-800 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading Product Details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error Loading Product</h2>
          <p className="text-red-600 mb-4">{error || "Product not found."}</p>
          <Button onClick={() => router.push('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-slate-200 p-3">
      <div className="w-full max-w-screen-2xl mx-auto bg-white/60 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/50 overflow-hidden flex flex-col">

        {showAddedMessage && (
          <div className="fixed top-24 right-6 bg-lime-300 text-slate-900 px-5 py-3 rounded-full shadow-lg z-50 animate-in slide-in-from-right font-bold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>Added to cart!</span>
          </div>
        )}

        <main className="p-6">
          <div className="bg-slate-50/70 rounded-2xl p-8 lg:p-12 border border-white/50">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Image Gallery */}
              <div className="space-y-4 sticky top-24">
                <div className="aspect-square bg-slate-200 rounded-2xl overflow-hidden">
                  {product.images && product.images[selectedImage] ? (
                    <Image src={product.images[selectedImage]} alt={product.name} width={600} height={600} className="w-full h-full object-cover" />
                  ) : <div className="w-full h-full flex items-center justify-center text-slate-400">No image</div>}
                </div>
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-3 overflow-x-auto">
                    {product.images.map((image, index) => (
                      <button key={index} onClick={() => setSelectedImage(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${selectedImage === index ? 'border-lime-400' : 'border-slate-200 hover:border-slate-300'}`}>
                        <Image src={image} alt={`${product.name} thumbnail ${index + 1}`} width={80} height={80} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <Badge className="w-fit mb-4 bg-slate-800 text-white rounded-full">{product.category}</Badge>
                <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-4">{product.name}</h1>
                <div className="flex items-center mb-6 space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => <Star key={i} className={`h-5 w-5 ${i < Math.floor(product.rating || 0) ? 'text-amber-400 fill-current' : 'text-slate-300'}`} />)}
                  </div>
                  <span className="text-base text-slate-600 font-medium">{product.rating ? `${product.rating.toFixed(1)} / 5.0` : 'No rating'}</span>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed mb-8">{product.description}</p>
                <div className="mb-8">
                  <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold text-slate-800">${product.price?.toFixed(2)}</span>
                    {product.originalPrice && <span className="text-2xl text-slate-400 line-through">${product.originalPrice.toFixed(2)}</span>}
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Quantity</label>
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="outline" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="rounded-full h-10 w-10">-</Button>
                    <span className="w-16 text-center font-bold text-lg tabular-nums">{quantity}</span>
                    <Button size="icon" variant="outline" onClick={() => setQuantity(quantity + 1)} className="rounded-full h-10 w-10">+</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <Button onClick={handleAddToCart} disabled={!product.inStock} size="lg" className="bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold text-base h-14">Add to Cart</Button>
                  <Button onClick={handleBuyNow} disabled={!product.inStock} size="lg" className="bg-lime-300 hover:bg-lime-400 text-slate-900 rounded-full font-bold text-base h-14">Buy Now</Button>
                </div>
                <div className="flex items-center gap-6 text-slate-600">
                  <button onClick={() => toggleLike(product.id)} className={`flex items-center gap-2 hover:text-red-500 transition-colors ${isLiked(product.id) ? 'text-red-500' : ''}`}>
                    <Heart className={`h-5 w-5 ${isLiked(product.id) ? 'fill-current' : ''}`} />
                    <span>{isLiked(product.id) ? 'Liked' : 'Add to Wishlist'}</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-slate-900 transition-colors"><Share2 className="h-5 w-5" /><span>Share</span></button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}