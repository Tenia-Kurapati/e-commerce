// app/products/page.jsx
'use client';

import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { ProductCard } from '@/components/products/ProductCard';
import { ProductListItem } from '@/components/products/ProductListItem'; // Import the new component
import Header from '@/components/Header'; // Assuming this is used for layout if not within a shared layout
import Footer from '@/components/Footer'; // Assuming this is used for layout
import { Button } from '@/components/ui/button';
import { Grid, List, Search, X } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryFromUrl = searchParams.get('category');
    const searchFromUrl = searchParams.get('search');

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`${API_BASE}/api/products`, { signal }),
          fetch(`${API_BASE}/api/categories`, { signal })
        ]);

        if (!productsRes.ok) throw new Error(`Products error: ${productsRes.status}`);
        if (!categoriesRes.ok) throw new Error(`Categories error: ${categoriesRes.status}`);

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        console.log("Fetched products list response:", productsData); // <-- LOG PRODUCTS
        console.log("Fetched categories response:", categoriesData);  // <-- LOG CATEGORIES

        setProducts(productsData);
        setCategories(categoriesData);

      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error("❌ Error during fetch:", err);
          setError(err.message || "Failed to load data");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter(product => {
        const matchesCategory = !selectedCategory || product.category === selectedCategory;
        const matchesSearch = !searchTerm || product.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        let aValue = a[sortBy] || (sortBy === 'price' || sortBy === 'rating' ? 0 : '');
        let bValue = b[sortBy] || (sortBy === 'price' || sortBy === 'rating' ? 0 : '');

        // Handle string comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        // Handle numeric comparison
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
      });
  }, [products, selectedCategory, searchTerm, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-300 border-t-slate-800 mx-auto mb-4"></div>
          <p className="text-slate-500">Loading Products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 text-center p-4">
        <div>
          <h2 className="text-2xl font-bold text-red-700 mb-2">Something Went Wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 via-gray-100 to-slate-200 p-8">
      {/* --- MODIFIED LINE: Changed rounded-b-3xl to rounded-3xl --- */}
      <div className="w-full max-w-screen-2xl mx-auto bg-white/60 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/50 overflow-hidden flex flex-col">
        {/* <Header /> Removing Header/Footer if they are part of a global layout component */}
        <main className="p-6 flex-1">
          <div className="mb-8 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-2">
              {selectedCategory ? categories.find(c => c.id === selectedCategory)?.name : 'Products'}
            </h1>
            <p className="text-slate-600">{filteredAndSortedProducts.length} results found</p>
          </div>

          <div className="bg-slate-50/70 rounded-2xl p-4 mb-8 border border-white/50 sticky top-4 z-40 backdrop-blur-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white/80 rounded-full border border-slate-200 focus:ring-2 focus:ring-lime-400 focus:border-transparent"
                />
              </div>
              <div className="flex items-center gap-4 justify-self-start lg:justify-self-center">
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [newSortBy, newSortOrder] = e.target.value.split('-');
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder);
                  }}
                  className="bg-white/80 rounded-full border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-lime-400"
                >
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="price-asc">Price Low-High</option>
                  <option value="price-desc">Price High-Low</option>
                  <option value="rating-desc">Rating High-Low</option>
                </select>
                <div className="flex items-center gap-1 bg-white/80 rounded-full border border-slate-200 p-1">
                  <Button size="icon" variant="ghost" onClick={() => setViewMode('grid')} className={`rounded-full ${viewMode === 'grid' && 'bg-slate-200'}`}><Grid className="h-5 w-5" /></Button>
                  <Button size="icon" variant="ghost" onClick={() => setViewMode('list')} className={`rounded-full ${viewMode === 'list' && 'bg-slate-200'}`}><List className="h-5 w-5" /></Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 justify-self-start md:col-span-2 lg:col-span-1 lg:justify-self-end">
                <Button variant="ghost" onClick={() => setSelectedCategory('')} className={`rounded-full ${!selectedCategory && 'bg-slate-800 text-white hover:bg-slate-900 hover:text-white'}`}>All</Button>
                {categories.map((cat) => (
                  <Button key={cat.id} variant="ghost" onClick={() => setSelectedCategory(cat.id)} className={`rounded-full ${selectedCategory === cat.id && 'bg-slate-800 text-white hover:bg-slate-900 hover:text-white'}`}>
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {filteredAndSortedProducts.length > 0 ? (
            <div className={`grid gap-6 ${viewMode === 'grid' ? 'sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {filteredAndSortedProducts.map((product) => (
                viewMode === 'grid' ? (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.images?.[0] || product.image}
                    rating={product.rating}
                    oldPrice={product.originalPrice}
                  />
                ) : (
                  <ProductListItem // Render ProductListItem for list view
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.images?.[0] || product.image}
                    rating={product.rating}
                    description={product.description} // Pass description
                    category={product.category}     // Pass category
                    oldPrice={product.originalPrice}
                  />
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50/70 rounded-2xl">
              <Search className="mx-auto h-16 w-16 text-slate-400 mb-4" />
              <h2 className="text-2xl font-bold text-slate-800">No Products Found</h2>
              <p className="text-slate-500 mt-2 mb-6">Try adjusting your search or filter criteria.</p>
              <Button onClick={clearFilters} className="bg-slate-800 hover:bg-slate-900 text-white rounded-full font-bold">
                <X className="mr-2 h-4 w-4" /> Clear Filters
              </Button>
            </div>
          )}
        </main>
        {/* <Footer /> Removing Header/Footer if they are part of a global layout component */}
      </div>
    </div>
  );
}