'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Search, UserCog, History, LogOut, LogIn } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useUI } from '@/context/UIContext';
import { useAuth } from '@/context/AuthContext';

const AVATAR_URL = "https://i.pravatar.cc/40?u=rymanalex";

export default function Header() {
  const { itemCount } = useCart();
  const { toggleOrdersPanel } = useUI();
  const { user, logOut } = useAuth(); // Get user state and logout function
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (itemCount > 0) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  return (
    <header className="px-6 md:px-8 py-5 flex items-center justify-between border-b bg-white/80 backdrop-blur-lg sticky top-0 z-30">
      <div className="flex items-center gap-4 md:gap-10">
        <Link href="/dashboard/Home" className="text-2xl font-bold text-slate-800 tracking-wider">
          <span className="bg-slate-800 text-white rounded-md px-2 py-1 mr-1">P</span>roShop
        </Link>
        {/* Search form can be added back here if needed */}
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <Link href="/dashboard/cart" aria-label="View shopping cart" className="relative p-2 rounded-full hover:bg-gray-200/50 transition-colors">
          <ShoppingBag className="h-6 w-6 text-slate-700" />
          {itemCount > 0 && (
            <span key={itemCount} className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full ${isAnimating ? 'animate-scale-in-out' : ''}`}>
              {itemCount}
            </span>
          )}
        </Link>
        <Link href="/dashboard/liked" aria-label="View liked products" className="p-2 rounded-full hover:bg-gray-200/50 transition-colors">
          <Heart className="h-6 w-6 text-slate-700" />
        </Link>
        <button onClick={toggleOrdersPanel} aria-label="View Order History" className="p-2 rounded-full hover:bg-gray-200/50 transition-colors">
          <History className="h-6 w-6 text-slate-700" />
        </button>
        {user && ( // Only show admin link if user is logged in
          <Link href="/dashboard/admin/products" aria-label="Product Management" className="p-2 rounded-full hover:bg-gray-200/50 transition-colors">
            <UserCog className="h-6 w-6 text-slate-700" />
          </Link>
        )}

        <div className="flex items-center gap-3 pl-2 md:pl-4 border-l border-gray-200/80">
          {user ? (
            <>
              <span className="font-medium text-slate-800 hidden sm:inline truncate" title={user.email}>
                {user.displayName || user.email.split('@')[0]}
              </span>
              <Image
                src={user.photoURL || AVATAR_URL}
                alt="User Avatar"
                width={36}
                height={36}
                className="rounded-full"
              />
              <button onClick={logOut} title="Log Out" className="p-2 rounded-full hover:bg-gray-200/50 transition-colors">
                <LogOut className="h-5 w-5 text-slate-700" />
              </button>
            </>
          ) : (
            <Link href="/" className="flex items-center gap-2 font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200">
              <LogIn className="h-5 w-5" />
              Log In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}