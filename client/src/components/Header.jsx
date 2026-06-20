import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

const Header = () => {
  const { state, dispatch } = useContext(CartContext);
  const {
    cart: { cartItems },
  } = state;

  const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem('userInfo')));
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorage = () => {
      setUserInfo(JSON.parse(localStorage.getItem('userInfo')));
    };
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    setUserInfo(null);
    dispatch({ type: 'CART_REMOVE_ITEM', payload: {} }); // We can clear cart or just leave it
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  return (
    <header className="bg-emerald-800 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-black tracking-tight flex items-center space-x-2">
          <span className="text-emerald-400">AGRO</span>
          <span className="text-white">CRAFT</span>
        </Link>
        <nav className="flex items-center space-x-1 sm:space-x-4">
          <Link to="/" className="hover:text-emerald-300 font-medium px-2 py-1 transition">
            Home
          </Link>
          <Link to="/products" className="hover:text-emerald-300 font-medium px-2 py-1 transition">
            Products
          </Link>
          
          {userInfo && userInfo.role === 'customer' && (
            <>
              <Link to="/cart" className="hover:text-emerald-300 font-medium px-2 py-1 transition relative flex items-center">
                <span>Cart</span>
                {cartItems.length > 0 && (
                  <span className="ml-1.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {cartItems.reduce((a, c) => a + c.quantity, 0)}
                  </span>
                )}
              </Link>
              <Link to="/customer-dashboard" className="hover:text-emerald-300 font-medium px-2 py-1 transition">
                My Orders
              </Link>
            </>
          )}

          {userInfo && userInfo.role === 'farmer' && (
            <Link to="/farmer-dashboard" className="hover:text-emerald-300 font-medium px-2 py-1 transition">
              Farmer Dashboard
            </Link>
          )}

          {userInfo && userInfo.role === 'admin' && (
            <Link to="/admin-dashboard" className="hover:text-emerald-300 font-medium px-2 py-1 transition">
              Admin Dashboard
            </Link>
          )}

          {userInfo ? (
            <div className="flex items-center space-x-3 pl-4 border-l border-emerald-700">
              <span className="text-emerald-300 text-sm hidden md:inline font-semibold">
                Hi, {userInfo.name}
              </span>
              <button
                onClick={logoutHandler}
                className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold text-xs px-3.5 py-2 rounded-lg transition shadow-sm border border-emerald-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2 pl-4 border-l border-emerald-700">
              <Link
                to="/login"
                className="hover:text-emerald-300 text-sm font-semibold px-2 py-1"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold px-4 py-2 rounded-xl shadow-sm transition"
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
