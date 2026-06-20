import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { state, dispatch } = useContext(CartContext);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const addToCartHandler = () => {
    if (userInfo && userInfo.role !== 'customer') {
      alert('Only customers can purchase items');
      return;
    }
    
    // Check stock
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product.quantity < quantity) {
      alert('Out of stock or insufficient quantity');
      return;
    }

    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  const isOutOfStock = product.quantity <= 0;

  return (
    <div className="glassmorphism rounded-2xl overflow-hidden border border-emerald-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      <Link to={`/product/${product._id}`} className="relative block aspect-video overflow-hidden">
        <img
          src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400'}
          alt={product.name}
          className="w-full h-48 object-cover hover:scale-105 transition duration-500 shadow-inner"
        />
        {isOutOfStock && (
          <span className="absolute top-3 right-3 bg-red-600/90 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-md shadow">
            Out of Stock
          </span>
        )}
      </Link>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
            {product.category}
          </span>
          <h3 className="text-md font-bold text-emerald-950 mt-2 hover:text-emerald-700 transition">
            <Link to={`/product/${product._id}`}>{product.name}</Link>
          </h3>
          <p className="text-xs text-gray-500 mt-1">Sold by: {product.farmer?.farmName || 'Local Farmer'}</p>
        </div>
        <div className="mt-4 pt-3 border-t border-emerald-50">
          <div className="flex justify-between items-center">
            <div className="font-extrabold text-emerald-950 text-lg">₹{product.price}</div>
            <div className="text-xs text-gray-400">Stock: {product.quantity}</div>
          </div>
          
          {(!userInfo || userInfo.role === 'customer') && (
            <button
              onClick={addToCartHandler}
              disabled={isOutOfStock}
              className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white font-bold py-2 rounded-xl text-xs shadow-sm hover:shadow transition"
            >
              {isOutOfStock ? 'Sold Out' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
