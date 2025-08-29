'use client';

import Link from 'next/link';
import { usePurchases } from '@/context/PurchasesContext';

export default function BuyPage() {
  const { purchases } = usePurchases();
  const latest = purchases[0];

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Purchase Summary</h1>
      {latest ? (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-4 text-slate-600">Order Date: {new Date(latest.createdAt).toLocaleString()}</div>
          <div className="divide-y">
            {latest.items.map((it) => (
              <div key={it.id} className="py-3 flex items-center gap-3">
                <img src={it.imageUrl} alt={it.name} className="w-16 h-16 object-cover rounded" />
                <div className="flex-1">
                  <div className="font-medium text-slate-800">{it.name}</div>
                  <div className="text-slate-600 text-sm">Qty: {it.quantity}</div>
                </div>
                <div className="font-semibold">${it.price?.toFixed?.(2) ?? it.price}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between">
            <div className="text-lg font-semibold">Total</div>
            <div className="text-lg font-semibold">${latest.total?.toFixed?.(2) ?? latest.total}</div>
          </div>
        </div>
      ) : (
        <div className="text-slate-600">No recent purchase found.</div>
      )}
      <div className="mt-6">
        <Link className="text-indigo-600 hover:underline" href="/dashboard/products">Continue shopping</Link>
      </div>
    </div>
  );
}


