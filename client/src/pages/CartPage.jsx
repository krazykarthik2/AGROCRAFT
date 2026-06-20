import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const CartPage = () => {
  const { state, dispatch } = useContext(CartContext);
  const {
    cart: { cartItems },
  } = state;

  const removeFromCartHandler = (id) => {
    dispatch({ type: 'CART_REMOVE_ITEM', payload: { _id: id } });
  };

  const checkoutHandler = () => {
    // In a real app, you would redirect to a checkout page or payment gateway
    alert('Proceeding to checkout (not implemented)');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <div>
          Cart is empty. <Link to="/products" className="text-green-600">Go Shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between p-4 mb-4 border-b"
              >
                <div className="flex items-center">
                  <img src={item.imageUrl} alt={item.name} className="w-20 h-20 object-cover rounded" />
                  <div className="ml-4">
                    <Link to={`/product/${item._id}`} className="text-lg font-semibold">
                      {item.name}
                    </Link>
                    <div className="text-gray-600">₹{item.price}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-4">Qty: {item.quantity}</div>
                  <button
                    onClick={() => removeFromCartHandler(item._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-xl font-bold mb-4">
                Subtotal ({cartItems.reduce((a, c) => a + c.quantity, 0)} items)
              </h2>
              <div className="text-2xl font-bold mb-4">
                ₹{cartItems.reduce((a, c) => a + c.quantity * c.price, 0)}
              </div>
              <button
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
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
