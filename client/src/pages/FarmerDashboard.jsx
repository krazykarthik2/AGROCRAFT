import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FarmerDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Add Product form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Vegetables');
  const [quantity, setQuantity] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [success, setSuccess] = useState('');

  // Edit Product state
  const [editProduct, setEditProduct] = useState(null);

  const navigate = useNavigate();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    if (!userInfo || userInfo.role !== 'farmer') {
      navigate('/login');
      return;
    }

    fetchData();
  }, [userInfo, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      // Fetch all products
      const { data: allProducts } = await axios.get('http://localhost:5000/api/products');
      // Filter products belonging to this farmer
      const farmerProducts = allProducts.filter(
        (p) => p.farmer && p.farmer._id === userInfo.farmer
      );
      setProducts(farmerProducts);

      // Fetch farmer orders
      const { data: farmerOrders } = await axios.get('http://localhost:5000/api/orders/farmer', config);
      setOrders(farmerOrders);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const addProductHandler = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(
        'http://localhost:5000/api/products',
        { name, description, price: Number(price), category, quantity: Number(quantity), imageUrl },
        config
      );

      setSuccess('Product added successfully!');
      setName('');
      setDescription('');
      setPrice('');
      setQuantity('');
      setImageUrl('');
      
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add product');
    }
  };

  const updateProductHandler = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/products/${editProduct._id}`,
        editProduct,
        config
      );

      setSuccess('Product updated successfully!');
      setEditProduct(null);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update product');
    }
  };

  const deleteProductHandler = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    setSuccess('');
    setError('');

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.delete(`http://localhost:5000/api/products/${id}`, config);
      setSuccess('Product deleted successfully!');
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete product');
    }
  };

  const updateStatusHandler = async (orderId, newStatus) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.put(
        `http://localhost:5000/api/orders/${orderId}/status`,
        { status: newStatus },
        config
      );

      alert(`Order status updated to ${newStatus}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status');
    }
  };

  if (loading && products.length === 0 && orders.length === 0) {
    return <div className="text-center py-12 text-emerald-900 font-semibold">Loading Dashboard...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-emerald-950 tracking-tight">Farmer Dashboard</h1>
          <p className="text-emerald-700 text-sm">Manage your listings, inventory, and track customer orders directly.</p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all ${
              activeTab === 'products' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            My Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition-all relative ${
              activeTab === 'orders' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-800 hover:bg-emerald-50'
            }`}
          >
            Received Orders
            {orders.filter((o) => o.status === 'Placed').length > 0 && (
              <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-500 text-[8px] text-white font-bold items-center justify-center">
                  {orders.filter((o) => o.status === 'Placed').length}
                </span>
              </span>
            )}
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

      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left panel: Add/Edit Form */}
          <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-md h-fit">
            <h2 className="text-xl font-bold text-emerald-950 mb-4">
              {editProduct ? 'Edit Product' : 'Add New Item'}
            </h2>
            <form onSubmit={editProduct ? updateProductHandler : addProductHandler} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                  placeholder="E.g. Fresh Red Tomatoes"
                  value={editProduct ? editProduct.name : name}
                  onChange={(e) => editProduct ? setEditProduct({ ...editProduct, name: e.target.value }) : setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">Description</label>
                <textarea
                  required
                  rows="3"
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                  placeholder="Describe your item quality, harvest date, freshness..."
                  value={editProduct ? editProduct.description : description}
                  onChange={(e) => editProduct ? setEditProduct({ ...editProduct, description: e.target.value }) : setDescription(e.target.value)}
                ></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                    placeholder="Price per unit"
                    value={editProduct ? editProduct.price : price}
                    onChange={(e) => editProduct ? setEditProduct({ ...editProduct, price: e.target.value }) : setPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                    placeholder="Available qty"
                    value={editProduct ? editProduct.quantity : quantity}
                    onChange={(e) => editProduct ? setEditProduct({ ...editProduct, quantity: e.target.value }) : setQuantity(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">Category</label>
                  <select
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                    value={editProduct ? editProduct.category : category}
                    onChange={(e) => editProduct ? setEditProduct({ ...editProduct, category: e.target.value }) : setCategory(e.target.value)}
                  >
                    <option value="Vegetables">Vegetables</option>
                    <option value="Fruits">Fruits</option>
                    <option value="Grains">Grains</option>
                    <option value="Dairy">Dairy & Poultry</option>
                    <option value="Pulses">Pulses</option>
                    <option value="Spices">Spices</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-emerald-800 mb-1">Image URL</label>
                <input
                  type="text"
                  className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                  placeholder="https://example.com/image.jpg"
                  value={editProduct ? editProduct.imageUrl : imageUrl}
                  onChange={(e) => editProduct ? setEditProduct({ ...editProduct, imageUrl: e.target.value }) : setImageUrl(e.target.value)}
                />
              </div>

              <div className="flex space-x-2 pt-2">
                {editProduct && (
                  <button
                    type="button"
                    onClick={() => setEditProduct(null)}
                    className="w-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-3 px-4 rounded-xl text-sm transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  className={`bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition ${
                    editProduct ? 'w-1/2' : 'w-full'
                  }`}
                >
                  {editProduct ? 'Save Updates' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>

          {/* Right panel: Product List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-emerald-950 mb-1">Active Listings ({products.length})</h2>
            {products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-emerald-200 p-8">
                <p className="text-emerald-800 font-medium">You haven't listed any items yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="glassmorphism rounded-2xl p-4 border border-emerald-100 flex space-x-4 shadow-sm hover:shadow-md transition"
                  >
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200'}
                      alt={product.name}
                      className="w-20 h-20 object-cover rounded-xl border border-emerald-100 shadow-inner"
                    />
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="font-bold text-emerald-950 text-sm line-clamp-1">{product.name}</div>
                        <div className="text-xs text-emerald-600">{product.category}</div>
                        <div className="text-xs text-gray-500 mt-1">Stock: {product.quantity} items</div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="font-extrabold text-emerald-900 text-sm">₹{product.price}</div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setEditProduct(product)}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProductHandler(product._id)}
                            className="text-xs font-semibold text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-emerald-950 mb-1">Customer Orders ({orders.length})</h2>
          {orders.length === 0 ? (
            <div className="text-center py-12 glassmorphism rounded-2xl border border-emerald-100 p-8 shadow-sm">
              <p className="text-emerald-800 font-medium">No orders received yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                // Filter the products in this order that belong to this farmer
                const farmerItems = order.products.filter(
                  (item) => item.product?.farmer?._id === userInfo.farmer
                );

                const getStatusBg = (status) => {
                  switch (status) {
                    case 'Placed':
                      return 'bg-blue-100 text-blue-700';
                    case 'Processing':
                      return 'bg-amber-100 text-amber-700';
                    case 'Dispatched':
                      return 'bg-indigo-100 text-indigo-700';
                    case 'Delivered':
                      return 'bg-emerald-100 text-emerald-700';
                    default:
                      return 'bg-gray-100 text-gray-700';
                  }
                };

                return (
                  <div
                    key={order._id}
                    className={`glassmorphism rounded-2xl p-6 border shadow-sm ${
                      order.status === 'Placed' ? 'border-l-4 border-l-emerald-500 border-emerald-100' : 'border-emerald-100'
                    }`}
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4 pb-4 border-b border-emerald-50">
                      <div>
                        <div className="text-xs font-semibold text-emerald-600">Order ID: {order._id}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          Received on: {new Date(order.createdAt).toLocaleString()}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${getStatusBg(order.status)}`}>
                          {order.status}
                        </span>
                        <select
                          value={order.status}
                          onChange={(e) => updateStatusHandler(order._id, e.target.value)}
                          className="bg-white border border-emerald-200 rounded-lg text-xs font-semibold px-2 py-1 text-emerald-950 focus:outline-none"
                        >
                          <option value="Placed">Placed</option>
                          <option value="Processing">Processing</option>
                          <option value="Dispatched">Dispatched</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Items to Deliver</h4>
                        <div className="space-y-2">
                          {farmerItems.map((item) => (
                            <div key={item._id} className="flex justify-between items-center text-sm text-emerald-950">
                              <span className="font-medium">{item.product?.name}</span>
                              <span className="font-bold">
                                Qty: {item.quantity} x ₹{item.product?.price}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-emerald-100 mt-3 pt-3 flex justify-between font-bold text-emerald-900 text-sm">
                          <span>Total for your products:</span>
                          <span>
                            ₹{farmerItems.reduce((acc, curr) => acc + curr.quantity * (curr.product?.price || 0), 0)}
                          </span>
                        </div>
                      </div>

                      <div className="border-t md:border-t-0 md:border-l border-emerald-100 pt-4 md:pt-0 md:pl-6 text-xs text-emerald-850 space-y-1">
                        <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-2">Customer Details</h4>
                        <div>
                          <span className="font-bold">Name:</span> {order.customer?.name}
                        </div>
                        <div>
                          <span className="font-bold">Email:</span> {order.customer?.email}
                        </div>
                        <div>
                          <span className="font-bold">Contact Phone:</span> {order.phone}
                        </div>
                        <div className="pt-2">
                          <span className="font-bold">Delivery Address:</span>
                          <p className="text-gray-600 mt-0.5">{order.shippingAddress}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FarmerDashboard;
