// frontend/src/components/products/ProductListItem.jsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star, ShoppingBag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have this Button component
import { Badge } from '@/components/ui/badge'; // Assuming you have this Badge component
import { useCart } from '@/context/CartContext';
import { useLikes } from '@/context/LikesContext';

export function ProductListItem({ id, name, price, image, rating, description, category, oldPrice }) {
    const { addToCart } = useCart();
    const { isLiked, toggleLike } = useLikes();

    const handleAddToCart = (e) => {
        e.stopPropagation(); // Prevent navigating to product detail page
        e.preventDefault();
        // Assuming product object structure suitable for cart. Pass quantity: 1 for list view.
        addToCart({ id, name, price, imageUrl: image, quantity: 1, images: [image] });
    };

    const handleToggleLike = (e) => {
        e.stopPropagation(); // Prevent navigating to product detail page
        e.preventDefault();
        toggleLike(id);
    };

    return (
        <Link href={`/dashboard/products/${id}`} className="flex items-center bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-4 gap-4 w-full">
            {/* Product Image */}
            <div className="flex-shrink-0 w-28 h-28 relative overflow-hidden rounded-md bg-gray-100">
                <Image
                    src={image || '/placeholder.jpg'} // Use a placeholder if image is missing
                    alt={name}
                    fill
                    sizes="112px" // 28*4=112px
                    style={{ objectFit: 'contain' }}
                    className="hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Product Info (Name, Category, Description, Rating) */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{name}</h3>
                {category && <Badge variant="secondary" className="w-fit mb-1">{category}</Badge>}
                {description && <p className="text-sm text-gray-600 line-clamp-2">{description}</p>}
                <div className="flex items-center mt-2">
                    <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-4 w-4 ${i < Math.floor(rating || 0) ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    {rating > 0 && <span className="text-sm text-gray-500 ml-1">({rating.toFixed(1)})</span>}
                </div>
            </div>

            {/* Price and Actions (Add to Cart, Like) */}
            <div className="flex flex-col items-end justify-center gap-2 pl-4 border-l border-gray-100 ml-auto">
                <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-slate-800">${price.toFixed(2)}</span>
                    {oldPrice && <span className="text-sm text-gray-400 line-through">${oldPrice.toFixed(2)}</span>}
                </div>
                <Button onClick={handleAddToCart} size="sm" className="bg-slate-800 hover:bg-slate-900 text-white w-28">
                    <ShoppingBag className="h-4 w-4 mr-2" /> Add
                </Button>
                <button onClick={handleToggleLike} className={`p-1 rounded-full ${isLiked(id) ? 'text-red-500 bg-red-100' : 'text-gray-500 hover:bg-gray-100'}`}>
                    <Heart className={`h-4 w-4 ${isLiked(id) ? 'fill-current' : ''}`} />
                </button>
            </div>
        </Link>
    );
}