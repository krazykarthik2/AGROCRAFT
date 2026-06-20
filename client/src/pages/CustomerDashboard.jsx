import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo) {
      navigate('/login');
      return;
    }

    const fetchMyOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
        setOrders(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not fetch your orders');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [userInfo, navigate]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Placed':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Dispatched':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-emerald-900">Loading your orders...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <h1 className="text-3xl font-extrabold text-emerald-950 mb-8 tracking-tight">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12 glassmorphism rounded-2xl p-8 border border-emerald-100">
          <p className="text-emerald-800 text-lg mb-4">You have not placed any orders yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="glassmorphism rounded-2xl p-6 border border-emerald-100 shadow-md flex flex-col md:flex-row md:justify-between"
            >
              <div className="space-y-4 flex-grow pr-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-emerald-600 font-semibold">Order ID: {order._id}</span>
                  <span className="text-xs text-gray-500">Ordered on: {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full border font-bold ${getStatusStyle(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="divide-y divide-emerald-100">
                  {order.products.map((item) => (
                    <div key={item._id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={item.product?.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                          alt={item.product?.name}
                          className="w-12 h-12 object-cover rounded-lg border border-emerald-100"
                        />
                        <div>
                          <div className="font-bold text-emerald-950 text-sm">
                            {item.product ? item.product.name : 'Unknown Product'}
                          </div>
                          {item.product?.farmer && (
                            <div className="text-xs text-emerald-600">Farmer: {item.product.farmer.farmName}</div>
                          )}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-emerald-900">
                        Qty: {item.quantity} x ₹{item.product ? item.product.price : 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-emerald-100 pt-4 md:pt-0 md:pl-6 min-w-[200px]">
                <div className="text-right">
                  <div className="text-xs text-emerald-700 font-semibold mb-1">Total Amount</div>
                  <div className="text-2xl font-black text-emerald-900">₹{order.totalPrice}</div>
                </div>
                <div className="text-right text-xs text-emerald-850 mt-4 md:mt-0 space-y-1">
                  <div className="font-semibold">Shipping Address:</div>
                  <div className="text-gray-600 max-w-[220px]">{order.shippingAddress}</div>
                  <div className="text-gray-600">Phone: {order.phone}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerDashboard;
