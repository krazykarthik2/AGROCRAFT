import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { state, dispatch } = useContext(CartContext);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError('Could not fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const addToCartHandler = () => {
    if (userInfo && userInfo.role !== 'customer') {
      alert('Only customers can purchase items');
      return;
    }

    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    
    if (product.quantity < quantity) {
      alert('Out of stock or insufficient quantity');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
    alert('Item added to cart!');
  };

  if (loading) {
    return <div className="text-center py-12 text-emerald-900 font-semibold">Loading product details...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500 font-bold">{error}</div>;
  }

  if (!product) {
    return <div className="text-center py-12 text-emerald-800">Product not found</div>;
  }

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link to="/products" className="text-emerald-700 hover:text-emerald-900 font-semibold flex items-center space-x-1 mb-6 text-sm">
        <span>←</span> <span>Back to Marketplace</span>
      </Link>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 glassmorphism p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-md">
        <div className="overflow-hidden rounded-2xl border border-emerald-50">
          <img
            src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600'}
            alt={product.name}
            className="w-full h-auto object-cover max-h-[350px] shadow-inner"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-md">
              {product.category}
            </span>
            <h1 className="text-3xl font-extrabold text-emerald-950 mt-4 leading-tight">{product.name}</h1>
            <p className="text-emerald-600 text-sm mt-1.5 font-medium">
              Sold by: <span className="underline font-semibold">{product.farmer?.farmName || 'Local Farmer'}</span>
            </p>
            <p className="text-emerald-800 text-xs mt-0.5">
              Farm Address: {product.farmer?.address || 'Not Provided'}
            </p>
            <div className="text-3xl font-black text-emerald-900 mt-6">₹{product.price}</div>
            
            <p className="mt-6 text-emerald-850 text-sm leading-relaxed">{product.description}</p>
          </div>
          <div className="mt-8 pt-4 border-t border-emerald-100">
            <div className="flex justify-between text-sm text-emerald-800 mb-4 font-semibold">
              <span>Stock Status:</span>
              <span className={isOutOfStock ? 'text-red-500 font-bold' : 'text-emerald-600 font-bold'}>
                {isOutOfStock ? 'Out of Stock' : `${product.quantity} units available`}
              </span>
            </div>
            
            {(!userInfo || userInfo.role === 'customer') && (
              <button
                onClick={addToCartHandler}
                disabled={isOutOfStock}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all"
              >
                {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
