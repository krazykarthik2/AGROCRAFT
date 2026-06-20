import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const CheckoutPage = () => {
  const { state, dispatch } = useContext(CartContext);
  const { cart: { cartItems } } = state;

  const [shippingAddress, setShippingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else if (cartItems.length === 0) {
      navigate('/products');
    }
  }, [userInfo, cartItems, navigate]);

  const placeOrderHandler = async (e) => {
    e.preventDefault();
    if (!shippingAddress.trim() || !phone.trim()) {
      setError('Please provide address and phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const orderItems = cartItems.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      }));

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        'http://localhost:5000/api/orders',
        { orderItems, shippingAddress, phone },
        config
      );

      // Order placed successfully, clear cart
      dispatch({ type: 'CART_CLEAR_ITEMS' });
      alert('Order Placed Successfully! Farmer has been notified.');
      navigate('/customer-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = cartItems.reduce((a, c) => a + c.quantity * c.price, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-extrabold text-emerald-950 mb-8 tracking-tight">Checkout</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-md">
            <h2 className="text-xl font-bold text-emerald-950 mb-4">Shipping Details</h2>
            <form onSubmit={placeOrderHandler} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-center text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">
                  Delivery Address
                </label>
                <textarea
                  required
                  rows="4"
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                  placeholder="Street name, City, State, ZIP code"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                ></textarea>
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                  placeholder="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all mt-4"
              >
                {loading ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>
        </div>

        <div>
          <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-md">
            <h2 className="text-xl font-bold text-emerald-950 mb-4">Items Summary</h2>
            <div className="divide-y divide-emerald-100 max-h-64 overflow-y-auto mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-3">
                  <div className="pr-4">
                    <div className="font-bold text-emerald-950 text-sm">{item.name}</div>
                    <div className="text-xs text-emerald-600">Qty: {item.quantity} @ ₹{item.price}</div>
                  </div>
                  <div className="font-bold text-emerald-900 text-sm">₹{item.price * item.quantity}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t border-emerald-200 pt-4 mt-2">
              <span className="font-bold text-emerald-950">Total Amount:</span>
              <span className="text-2xl font-black text-emerald-900">₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
