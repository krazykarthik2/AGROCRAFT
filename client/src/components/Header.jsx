import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { state } = useContext(CartContext);
  const {
    cart: { cartItems },
  } = state;

  return (
    <header className="bg-green-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          AGROCRAFT
        </Link>
        <nav>
          <Link to="/" className="px-4">Home</Link>
          <Link to="/products" className="px-4">Products</Link>
          <Link to="/cart" className="px-4">
            Cart
            {cartItems.length > 0 && (
              <span className="ml-1 bg-red-600 text-xs font-bold px-2 py-1 rounded-full">
                {cartItems.reduce((a, c) => a + c.quantity, 0)}
              </span>
            )}
          </Link>
          <Link to="/login" className="px-4">Login</Link>
          <Link to="/signup" className="px-4">Sign Up</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
