// frontend/src/app/orders/page.jsx
'use client';

import Link from 'next/link';
import { usePurchases } from '@/context/PurchasesContext';
import { ShoppingBag } from 'lucide-react';

export default function OrdersPage() {
    const { purchases } = usePurchases();

    return (
        <div className="container mx-auto px-6 py-12">
            <h1 className="text-3xl font-bold text-slate-800 mb-8">Your Order History</h1>

            {purchases.length > 0 ? (
                <div className="space-y-6">
                    {purchases.map((purchase, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-6 border">
                            <div className="flex justify-between items-start mb-4 pb-4 border-b">
                                <div>
                                    <h2 className="text-lg font-semibold text-slate-800">Order #{purchases.length - index}</h2>
                                    <p className="text-sm text-slate-500">Date: {new Date(purchase.createdAt).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-slate-500">Total</p>
                                    <p className="text-xl font-bold text-slate-900">${purchase.total?.toFixed(2)}</p>
                                </div>
                            </div>
                            <div className="divide-y divide-gray-100">
                                {purchase.items.map((item) => (
                                    <div key={item.id} className="py-3 flex items-center gap-4">
                                        <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                                        <div className="flex-1">
                                            <div className="font-medium text-slate-800">{item.name}</div>
                                            <div className="text-slate-600 text-sm">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="font-semibold">${item.price?.toFixed(2)}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-slate-600 bg-gray-50 rounded-lg">
                    <ShoppingBag className="mx-auto h-16 w-16 text-slate-300 mb-4" />
                    <h2 className="text-xl font-bold text-slate-700">No Orders Found</h2>
                    <p className="mt-2 mb-6">Start shopping to see your orders here.</p>
                    <Link href="/dashboard/products" className="px-5 py-2 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
            )}
        </div>
    );
}