import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const ProductCard = ({ product }) => {
  const { state, dispatch } = useContext(CartContext);

  const addToCartHandler = () => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    dispatch({ type: 'CART_ADD_ITEM', payload: { ...product, quantity } });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Link to={`/product/${product._id}`}>
        <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
      </Link>
      <div className="p-4">
        <h3 className="text-lg font-semibold">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h3>
        <p className="text-gray-600 mt-1">₹{product.price}</p>
        <p className="text-sm text-gray-500 mt-2">Sold by: {product.farmer.farmName}</p>
        <button
          onClick={addToCartHandler}
          className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
