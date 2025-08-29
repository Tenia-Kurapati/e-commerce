'use client';

import { useState, useEffect, useMemo } from 'react';
// Import recharts components and extra icons
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PlusCircle, Edit, Trash2, Box, Archive, LayoutGrid, AlertCircle, X, Plus } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

// --- Analytics Chart Components ---

const StatCard = ({ title, value, icon, color }) => (
    <div className={`relative p-5 bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200/50`}>
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800">{value}</p>
            </div>
            <div className={`p-3 rounded-full bg-${color}-100 text-${color}-600`}> {icon} </div>
        </div>
        <div className={`absolute -bottom-4 -right-4 w-16 h-16 bg-${color}-100/50 rounded-full`}></div>
    </div>
);

const InventoryPieChart = ({ products }) => {
    const chartData = useMemo(() => {
        const statusCounts = { inStock: 0, lowStock: 0, outOfStock: 0 };
        products.forEach(p => {
            if (p.stockCount === 0) statusCounts.outOfStock++;
            else if (p.stockCount < 10) statusCounts.lowStock++;
            else statusCounts.inStock++;
        });
        return [
            { name: 'In Stock (>=10)', value: statusCounts.inStock },
            { name: 'Low Stock (<10)', value: statusCounts.lowStock },
            { name: 'Out of Stock', value: statusCounts.outOfStock },
        ];
    }, [products]);

    const COLORS = ['#22c55e', '#f59e0b', '#ef4444']; // Green, Amber, Red

    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200/50 h-[420px] flex flex-col">
            <h3 className="font-bold text-gray-700 mb-4">Inventory Status</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={chartData} cx="50%" cy="50%" labelLine={false} innerRadius={60} outerRadius={100} fill="#8884d8" dataKey="value" paddingAngle={5}>
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, name]} />
                    <Legend iconType="circle" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

const CategoryBarChart = ({ products }) => {
    const chartData = useMemo(() => {
        const categoryCounts = products.reduce((acc, product) => {
            acc[product.category] = (acc[product.category] || 0) + 1;
            return acc;
        }, {});
        return Object.entries(categoryCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
    }, [products]);

    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200/50 h-80 flex flex-col">
            <h3 className="font-bold text-gray-700">Products per Category</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" hide={true} />
                    <YAxis allowDecimals={false} width={30} />
                    <Tooltip cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} />
                    <Legend />
                    <Bar dataKey="count" name="Products" fill="#334155" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

// --- NEW: Component to fill the empty space ---
const LowStockProducts = ({ products }) => {
    const lowStockItems = useMemo(() => {
        return products
            .filter(p => p.stockCount > 0 && p.stockCount < 10)
            .sort((a, b) => a.stockCount - b.stockCount);
    }, [products]);

    return (
        <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-200/50 flex-grow">
            <h3 className="font-bold text-gray-700 mb-4">Low Stock Alerts</h3>
            {lowStockItems.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                    {lowStockItems.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-2 rounded-md bg-amber-50">
                            <span className="text-sm font-medium text-gray-700">{item.name}</span>
                            <span className="text-sm font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">{item.stockCount} left</span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10">
                    <p className="text-sm text-gray-500">No items with low stock.</p>
                </div>
            )}
        </div>
    )
}


const AnalyticsDashboard = ({ products }) => {
    const analytics = useMemo(() => {
        if (!products || products.length === 0) return { totalProducts: 0, totalStock: 0 };
        const totalStock = products.reduce((sum, p) => sum + (p.stockCount || 0), 0);
        return { totalProducts: products.length, totalStock };
    }, [products]);

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-700 mb-4">Store Analytics</h2>
            {/* --- MODIFIED: A more balanced 3-column layout --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <StatCard title="Total Products" value={analytics.totalProducts} icon={<Box size={24} />} color="sky" />
                    <StatCard title="Total Stock" value={analytics.totalStock.toLocaleString()} icon={<Archive size={24} />} color="lime" />
                    <CategoryBarChart products={products} />
                </div>
                <div className="lg:col-span-2 space-y-6 flex flex-col">
                    <InventoryPieChart products={products} />
                    <LowStockProducts products={products} />
                </div>
            </div>
        </div>
    );
};


// --- Reusable UI Components ---
const Button = ({ onClick, children, className = '' }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 font-semibold text-white bg-slate-800 rounded-md hover:bg-slate-900 transition-colors ${className}`}>
        {children}
    </button>
);

const Input = ({ label, name, value, onChange, placeholder, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500"
        />
    </div>
);

// --- Main Page Component ---
export default function ProductManagementPage() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);

    const fetchProducts = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${API_BASE_URL}/products`);
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleAddNew = () => {
        setCurrentProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setIsModalOpen(true);
    };

    const handleDelete = async (productId) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
                    method: 'DELETE',
                });
                if (!response.ok) throw new Error('Failed to delete product');
                fetchProducts();
            } catch (err) {
                alert(`Error: ${err.message}`);
            }
        }
    };

    const handleSave = () => {
        setIsModalOpen(false);
        fetchProducts();
    };

    if (isLoading) return <div className="text-center p-10">Loading products...</div>;
    if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;

    return (
        <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-slate-800">Product Management</h1>
                <Button onClick={handleAddNew}>
                    <PlusCircle size={20} />
                    Add New Product
                </Button>
            </div>

            <AnalyticsDashboard products={products} />

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id}>
                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{product.name}</div></td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.category}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${(product.price || 0).toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.stockCount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(product)} className="text-lime-600 hover:text-lime-900 mr-4"><Edit size={20} /></button>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900"><Trash2 size={20} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <ProductModal
                    product={currentProduct}
                    onClose={() => setIsModalOpen(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

// --- Product Modal (No changes from previous step) ---
function ProductModal({ product, onClose, onSave }) {
    const [formData, setFormData] = useState({
        name: product?.name || '',
        price: product?.price || '',
        category: product?.category || 'Other',
        stock: product?.stockCount || 0,
        images: product?.images || [],
        description: product?.description || '',
    });
    const [currentImageUrl, setCurrentImageUrl] = useState('');
    const isEditing = !!product;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddImage = (e) => {
        e.preventDefault();
        const trimmedUrl = currentImageUrl.trim();
        if (trimmedUrl && !formData.images.includes(trimmedUrl)) {
            setFormData(prev => ({ ...prev, images: [...prev.images, trimmedUrl] }));
            setCurrentImageUrl('');
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const submissionData = { ...formData };

        const url = isEditing ? `${API_BASE_URL}/products/${product.id}` : `${API_BASE_URL}/products`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submissionData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save product');
            }
            alert(`Product ${isEditing ? 'updated' : 'added'} successfully!`);
            onSave();
        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input label="Product Name" name="name" value={formData.name} onChange={handleChange} placeholder="e.g., Classic T-Shirt" />
                    <Input label="Price" name="price" value={formData.price} onChange={handleChange} placeholder="e.g., 29.99" type="number" />
                    <Input label="Category" name="category" value={formData.category} onChange={handleChange} placeholder="e.g., Apparel" />
                    <Input label="Stock Count" name="stock" value={formData.stock} onChange={handleChange} placeholder="e.g., 100" type="number" />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs</label>
                        <div className="flex items-center gap-2">
                            <input type="url" value={currentImageUrl} onChange={(e) => setCurrentImageUrl(e.target.value)} placeholder="https://..." className="flex-grow mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500" />
                            <button onClick={handleAddImage} className="p-2 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300"><Plus size={20} /></button>
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {formData.images.map((url, index) => (
                                <div key={index} className="flex items-center gap-2 bg-lime-100 text-lime-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                    <span className="truncate max-w-xs">{url}</span>
                                    <button type="button" onClick={() => handleRemoveImage(index)} className="text-lime-600 hover:text-lime-900"><X size={14} /></button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                        <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lime-500 focus:border-lime-500"></textarea>
                    </div>
                    <div className="flex justify-end gap-4 pt-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-slate-800 text-white rounded-md hover:bg-slate-900">{isEditing ? 'Update Product' : 'Add Product'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
}