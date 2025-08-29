// frontend/src/components/OrdersPanel.jsx
'use client';

import Link from 'next/link';
import { usePurchases } from '@/context/PurchasesContext';
import { useUI } from '@/context/UIContext';
import { X, ShoppingBag } from 'lucide-react';
import { useEffect } from 'react';

export default function OrdersPanel() {
    const { purchases } = usePurchases();
    const { isOrdersPanelOpen, closeOrdersPanel } = useUI();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') closeOrdersPanel();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [closeOrdersPanel]);

    return (
        <>
            <div
                onClick={closeOrdersPanel}
                className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${isOrdersPanelOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            />

            <div
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-gray-50 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOrdersPanelOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b bg-white">
                        <h2 className="text-xl font-bold text-slate-800">Recent Orders</h2>
                        <button onClick={closeOrdersPanel} className="p-2 rounded-full hover:bg-gray-200">
                            <X className="h-6 w-6 text-slate-600" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {purchases.length > 0 ? (
                            purchases.map((purchase, index) => (
                                <div key={index} className="bg-white rounded-lg shadow-sm p-4 border">
                                    <div className="flex justify-between items-baseline mb-2 pb-2 border-b">
                                        <div>
                                            <div className="text-xs text-slate-500">Order Date</div>
                                            <div className="font-medium text-slate-700">{new Date(purchase.createdAt).toLocaleString()}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-slate-500">Total</div>
                                            <div className="font-bold text-slate-800">${purchase.total?.toFixed(2)}</div>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        {purchase.items.map(item => (
                                            <div key={item.id} className="flex items-center gap-3 text-sm">
                                                <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded" />
                                                <div className="flex-1">
                                                    <div className="font-medium text-slate-800 line-clamp-1">{item.name}</div>
                                                    <div className="text-slate-500">Qty: {item.quantity}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 text-slate-500">
                                <ShoppingBag className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                                You haven't made any purchases yet.
                            </div>
                        )}
                    </div>

                    <div className="p-4 border-t bg-white">
                        <Link href="/orders" onClick={closeOrdersPanel} className="block w-full text-center px-4 py-3 bg-slate-800 text-white font-semibold rounded-lg hover:bg-slate-900 transition-colors">
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}