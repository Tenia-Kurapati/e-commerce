// app/page.jsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";
const PLACEHOLDER_SVG = "data:image/svg+xml;utf8," + encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600'><rect width='100%' height='100%' fill='#e2e8f0'/><text x='50%' y='50%' fill='#94a3b8' font-size='24'>Image</text></svg>");

// Your original, unmodified function for image URLs
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

// A small, dedicated component for the interactive error state
function ErrorDisplay({ error }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
            <div className="text-center p-8">
                <div className="text-red-500 text-5xl mb-3">⚠️</div>
                <h1 className="text-xl font-semibold text-slate-900 mb-2">Error Loading Products</h1>
                <p className="text-slate-600 mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="bg-slate-800 text-white px-5 py-2 rounded-md hover:bg-slate-900 transition">
                    Try Again
                </button>
            </div>
        </div>
    );
}

export default function HomePage() {
    const [products, setProducts] = useState([]);
    const [featured, setFeatured] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Your unmodified data fetching logic
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await fetch(`${API_BASE}/api/products`);
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                setProducts(data);
                const featuredItems = data.filter((p) => (p.rating ?? 0) >= 4.5).slice(0, 4);
                setFeatured(featuredItems);
                const sorted = [...data].sort((a, b) => {
                    const da = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const db = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return db - da;
                });
                setNewArrivals((sorted.length ? sorted : data).slice(0, 6));
            } catch (err) { console.error("Error fetching products:", err); setError(err.message || "Failed to load products"); }
            finally { setLoading(false); }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-slate-800 mx-auto mb-4"></div>
                    <p className="text-sm text-slate-500">Loading elegance…</p>
                </div>
            </div>
        );
    }

    if (error) {
        return <ErrorDisplay error={error} />;
    }

    const heroProduct = featured[0] || products[0];
    const sideBarProduct1 = newArrivals[0] || products[1];
    const sideBarProduct2 = newArrivals[1] || products[2];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-slate-200 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
            <div className="w-full max-w-screen-2xl mx-auto bg-white/60 backdrop-blur-2xl rounded-3xl shadow-2xl shadow-gray-400/30 border border-white/50 overflow-hidden flex flex-col">

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 flex-1">
                    <div className="lg:col-span-2 bg-slate-50/70 rounded-2xl p-8 flex flex-col relative overflow-hidden">
                        <div className="absolute top-4 left-8 text-xs font-semibold bg-gray-200/80 text-slate-600 px-3 py-1 rounded-full">#Music is Classic</div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 items-center gap-8">
                            <div className="z-10">
                                <p className="text-7xl font-light text-gray-300 -mb-2">01</p>
                                <h2 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">Sequoia Inspiring Musico.</h2>
                                <p className="text-sm text-gray-500 mt-4 max-w-xs">Making your dream music come true stay with Sequios Sounds!</p>
                                <Link href="/dashboard/products">
                                    <Button className="mt-8 bg-lime-300 text-slate-900 font-bold hover:bg-lime-400 rounded-full pl-6 pr-2 py-2 flex items-center gap-4 transition-all group text-left">
                                        View All Products
                                        <span className="bg-slate-800 text-white rounded-full h-9 w-9 flex items-center justify-center group-hover:scale-110 transition-transform"><ArrowRight className="h-4 w-4" /></span>
                                    </Button>
                                </Link>
                            </div>
                            <div className="relative h-64 md:h-full w-full">
                                {heroProduct && <Image src={normalizeImageUrl(heroProduct)} alt={heroProduct.name || "Featured Product"} fill className="object-contain" />}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <Link href="/dashboard/products" className="block bg-slate-50/70 rounded-2xl p-5 group hover:bg-slate-100/80 transition-colors">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-slate-800">Explore Collection</h3>
                                <div className="h-9 w-9 flex items-center justify-center rounded-full bg-white/80 group-hover:scale-110 transition-transform"><ArrowRight className="h-5 w-5 text-slate-800" /></div>
                            </div>
                        </Link>
                        {sideBarProduct1 && (
                            <Link href={`/dashboard/products/${sideBarProduct1.id}`} className="block bg-slate-50/70 rounded-2xl p-5 relative group">
                                <div className="flex items-center gap-4">
                                    <Image src={normalizeImageUrl(sideBarProduct1)} alt={sideBarProduct1.name} width={80} height={80} className="object-contain group-hover:scale-105 transition-transform" />
                                    <h3 className="text-2xl font-bold text-slate-800 leading-tight">{sideBarProduct1.name}</h3>
                                </div>
                            </Link>
                        )}
                        {sideBarProduct2 && (
                            <Link href={`/dashboard/products/${sideBarProduct2.id}`} className="block bg-slate-50/70 rounded-2xl relative overflow-hidden group">
                                <Image src={normalizeImageUrl(sideBarProduct2)} alt={sideBarProduct2.name} width={400} height={400} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform" />
                                <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white/90 via-white/80 to-transparent backdrop-blur-sm">
                                    <h3 className="text-lg font-bold text-slate-800">{sideBarProduct2.name}</h3>
                                    <p className="text-sm text-gray-600">{sideBarProduct2.description}</p>
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* THIS IS THE CORRECTED CARD WITH NO NESTED LINKS */}
                    <div className="relative bg-slate-50/70 rounded-2xl p-5 group hover:bg-slate-100/80 transition-colors">
                        <h3 className="font-semibold text-slate-800">More Products</h3>
                        <p className="text-sm text-gray-500">{products.length} plus items.</p>
                        <div className="flex items-end -space-x-4 mt-2">
                            {products.slice(0, 3).map(p => (
                                <div key={p.id} className="h-16 w-16 bg-white p-1 rounded-lg shadow-md flex items-center justify-center border border-gray-200/50">
                                    <Image src={normalizeImageUrl(p)} alt={p.name} width={60} height={60} className="object-contain" />
                                </div>
                            ))}
                        </div>
                        {/* Heart icon link (on top) */}
                        <Link href="/dashboard/liked" aria-label="View liked products" className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-200/50 z-20"><Heart className="h-5 w-5 text-gray-500" /></Link>
                        {/* Full card link (underneath) */}
                        <Link href="/dashboard/products" aria-label="View all products" className="absolute inset-0 z-10" />
                    </div>

                    <div className="bg-slate-50/70 rounded-2xl p-5 flex flex-col items-center justify-center text-center">
                        <h3 className="text-2xl font-bold text-slate-800">5m+ <span className="font-medium">Downloads</span></h3>
                        <div className="flex items-center gap-1 text-sm text-gray-500 mt-1"><Star className="h-4 w-4 text-amber-400 fill-current" /><span>4.6 reviews</span></div>
                    </div>
                    <div className="bg-slate-50/70 rounded-2xl p-5 relative">
                        <Link href="/dashboard/liked" className="absolute top-4 right-4 text-xs font-semibold bg-red-100 text-red-600 px-3 py-1 rounded-full flex items-center gap-1 z-10"><Heart size={12} /> Popular</Link>
                        <h3 className="font-semibold text-slate-800">Listening Has Been Released</h3>
                        <div className="flex items-center gap-4 mt-4">
                            {products.slice(3, 5).map(p => (
                                <Link href={`/dashboard/products/${p.id}`} key={p.id} className="block h-16 w-16 bg-white rounded-full shadow-lg flex items-center justify-center border border-gray-200/50 hover:scale-105 transition-transform">
                                    <Image src={normalizeImageUrl(p)} alt={p.name} width={50} height={50} className="object-contain" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}