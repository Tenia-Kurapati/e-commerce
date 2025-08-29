'use client';

import Link from 'next/link';
import { useLikes } from '@/context/LikesContext';
import { usePurchases } from '@/context/PurchasesContext';
import { useEffect, useState } from 'react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

export default function CollectionsPage() {
  const { likedIds } = useLikes();
  const { purchases } = usePurchases();
  const [productsById, setProductsById] = useState({});

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/products`);
        const data = await res.json();
        const map = Object.fromEntries(data.map(p => [p.id, p]));
        setProductsById(map);
      } catch {}
    };
    fetchAll();
  }, []);

  const likedProducts = likedIds.map((id) => productsById[id]).filter(Boolean);

  return (
    <div className="container mx-auto px-6 py-10 space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Your Collections</h1>
        <p className="text-slate-600">Quick access to what you love and bought.</p>
      </div>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Liked Items</h2>
        {likedProducts.length ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {likedProducts.map((p) => (
              <Link key={p.id} href={`/dashboard/products/${p.id}`} className="block bg-white rounded-lg shadow hover:shadow-md transition">
                <img src={Array.isArray(p.images)? p.images[0]: p.imageUrl} alt={p.name} className="w-full h-48 object-cover rounded-t-lg" />
                <div className="p-4">
                  <div className="font-semibold text-slate-900">{p.name}</div>
                  <div className="text-slate-700">${p.price}</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-slate-600">No liked items yet.</div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-slate-900 mb-4">Bought Items</h2>
        {purchases.length ? (
          <div className="space-y-4">
            {purchases.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-slate-700">{new Date(order.createdAt).toLocaleString()}</div>
                  <div className="font-semibold">${order.total}</div>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {order.items.map((it) => (
                    <Link key={it.id} href={`/dashboard/products/${it.id}`} className="flex items-center gap-3">
                      <img src={it.imageUrl} alt={it.name} className="w-16 h-16 object-cover rounded" />
                      <div>
                        <div className="font-medium text-slate-900">{it.name}</div>
                        <div className="text-slate-600 text-sm">Qty: {it.quantity}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-slate-600">No purchases yet.</div>
        )}
      </section>
    </div>
  );
}


