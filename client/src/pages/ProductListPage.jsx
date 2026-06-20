import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/products');
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Could not fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter Logic
  useEffect(() => {
    let result = products;

    if (selectedCategory !== 'All') {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          (p.farmer && p.farmer.farmName.toLowerCase().includes(term))
      );
    }

    setFilteredProducts(result);
  }, [searchTerm, selectedCategory, products]);

  if (loading) {
    return <div className="text-center py-12 text-emerald-900 font-semibold">Loading fresh produce...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500 font-bold">{error}</div>;
  }

  const categories = ['All', 'Vegetables', 'Fruits', 'Grains', 'Dairy & Poultry', 'Pulses', 'Spices'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Marketplace</h1>
          <p className="text-emerald-700 text-sm">Buy directly from local farmers with zero middlemen.</p>
        </div>
        
        {/* Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <input
            type="text"
            className="px-4 py-2.5 rounded-xl border border-emerald-100 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm text-sm"
            placeholder="Search items or farms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="px-4 py-2.5 rounded-xl border border-emerald-100 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === 'Dairy & Poultry' ? 'Dairy' : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 bg-white border border-emerald-100 rounded-2xl p-8">
          <p className="text-emerald-800 text-md">No products match your search/filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListPage;
