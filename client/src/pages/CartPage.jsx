import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const { state, dispatch } = useContext(CartContext);
  const {
    cart: { cartItems },
  } = state;

  const navigate = useNavigate();

  const removeFromCartHandler = (id) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: { _id: id } });
  };

  const checkoutHandler = () => {
    navigate('/checkout');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-extrabold text-emerald-950 mb-8 tracking-tight">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div className="text-center py-16 glassmorphism rounded-2xl border border-emerald-100 p-8 shadow-sm">
          <p className="text-emerald-800 text-lg mb-6">Your shopping cart is empty.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-5 glassmorphism rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded-xl border border-emerald-100 shadow-inner"
                  />
                  <div className="ml-5">
                    <Link
                      to={`/product/${item._id}`}
                      className="text-lg font-bold text-emerald-950 hover:text-emerald-700 transition"
                    >
                      {item.name}
                    </Link>
                    <p className="text-emerald-600 text-sm mt-0.5">Sold by: {item.farmer?.farmName || 'Local Farmer'}</p>
                    <div className="text-emerald-900 font-bold mt-2 text-md">₹{item.price}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-sm font-semibold bg-emerald-100/50 text-emerald-900 px-3 py-1.5 rounded-lg border border-emerald-200">
                    Qty: {item.quantity}
                  </div>
                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="text-red-500 hover:text-red-700 font-semibold text-sm transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-md sticky top-24">
              <h2 className="text-xl font-extrabold text-emerald-950 mb-6">Order Summary</h2>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-emerald-100">
                <span className="text-emerald-800">Total Items:</span>
                <span className="font-bold text-emerald-950">{cartItems.reduce((a, c) => a + c.quantity, 0)}</span>
              </div>
              <div className="flex justify-between items-center mb-8">
                <span className="text-emerald-800 text-lg font-medium">Estimated Subtotal:</span>
                <span className="text-2xl font-black text-emerald-900">
                  ₹{cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
                </span>
              </div>
              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all disabled:bg-gray-300 disabled:shadow-none"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
