import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'admin') {
      navigate('/login');
      return;
    }
    fetchAdminData();
  }, [userInfo, navigate]);

  const fetchAdminData = async () => {
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Fetch users, products, orders in parallel
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/users', config),
        axios.get('http://localhost:5000/api/products'),
        axios.get('http://localhost:5000/api/orders', config),
      ]);

      setUsers(usersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const deleteUserHandler = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? All associated data will be removed.')) return;
    setError('');
    setSuccess('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`http://localhost:5000/api/users/${id}`, config);
      setSuccess('User deleted successfully');
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const deleteProductHandler = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setError('');
    setSuccess('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      setSuccess('Product deleted successfully');
      fetchAdminData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const updateOrderStatusHandler = async (orderId, status) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status },
        config
      );

      alert('Order status updated');
      fetchAdminData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading && users.length === 0) {
    return <div className="text-center py-12 text-emerald-900 font-semibold">Loading Admin Dashboard...</div>;
  }

  // Calculations
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
  const totalFarmers = users.filter((u) => u.role === 'farmer').length;
  const totalCustomers = users.filter((u) => u.role === 'customer').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b border-emerald-100 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Admin Control Panel</h1>
          <p className="text-emerald-700 text-sm">System oversight, data tables, and platform performance stats.</p>
        </div>
        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              activeTab === 'stats' ? 'bg-emerald-800 text-white' : 'bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Metrics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              activeTab === 'users' ? 'bg-emerald-800 text-white' : 'bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              activeTab === 'products' ? 'bg-emerald-800 text-white' : 'bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition shadow-sm ${
              activeTab === 'orders' ? 'bg-emerald-800 text-white' : 'bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-center text-sm mb-6">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-4 text-center text-sm mb-6">
          {success}
        </div>
      )}

      {activeTab === 'stats' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <h3 className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Total Sales</h3>
            <p className="text-3xl font-black text-emerald-950 mt-2">₹{totalRevenue}</p>
          </div>
          <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <h3 className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Total Orders</h3>
            <p className="text-3xl font-black text-emerald-950 mt-2">{orders.length}</p>
          </div>
          <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <h3 className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Farmers Registered</h3>
            <p className="text-3xl font-black text-emerald-950 mt-2">{totalFarmers}</p>
          </div>
          <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <h3 className="text-emerald-700 text-xs font-bold uppercase tracking-wider">Customers Registered</h3>
            <p className="text-3xl font-black text-emerald-950 mt-2">{totalCustomers}</p>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div className="glassmorphism rounded-2xl border border-emerald-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-100 text-left">
              <thead className="bg-emerald-50/50 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 text-sm text-emerald-950">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-emerald-50/20 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{u._id}</td>
                    <td className="px-6 py-4 font-bold">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-700'
                            : u.role === 'farmer'
                            ? 'bg-amber-100 text-amber-700'
                            : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-gray-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => deleteUserHandler(u._id)}
                          className="text-red-500 hover:text-red-700 font-bold text-xs"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="glassmorphism rounded-2xl border border-emerald-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-100 text-left">
              <thead className="bg-emerald-50/50 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Product ID</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4">Farmer / Farm</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 text-sm text-emerald-950">
                {products.map((p) => (
                  <tr key={p._id} className="hover:bg-emerald-50/20 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{p._id}</td>
                    <td className="px-6 py-4 font-bold">{p.name}</td>
                    <td className="px-6 py-4">{p.category}</td>
                    <td className="px-6 py-4 font-bold">₹{p.price}</td>
                    <td className="px-6 py-4">{p.quantity}</td>
                    <td className="px-6 py-4">
                      {p.farmer ? p.farmer.farmName : 'Deleted Farmer'}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteProductHandler(p._id)}
                        className="text-red-500 hover:text-red-700 font-bold text-xs"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="glassmorphism rounded-2xl border border-emerald-100 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-emerald-100 text-left">
              <thead className="bg-emerald-50/50 text-emerald-900 font-bold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Items Count</th>
                  <th className="px-6 py-4">Total Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Update Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50 text-sm text-emerald-950">
                {orders.map((o) => (
                  <tr key={o._id} className="hover:bg-emerald-50/20 transition">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">{o._id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold">{o.customer?.name}</div>
                      <div className="text-xs text-gray-500">{o.customer?.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      {o.products.reduce((acc, curr) => acc + curr.quantity, 0)} items
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-900">₹{o.totalPrice}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-700'
                            : o.status === 'Placed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatusHandler(o._id, e.target.value)}
                        className="bg-white border border-emerald-200 rounded-lg text-xs font-semibold px-2 py-1 text-emerald-950 focus:outline-none"
                      >
                        <option value="Placed">Placed</option>
                        <option value="Processing">Processing</option>
                        <option value="Dispatched">Dispatched</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
