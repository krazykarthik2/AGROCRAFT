import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [farmName, setFarmName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const payload = { name, email, password, role };
      if (role === 'farmer') {
        payload.farmName = farmName;
        payload.address = address;
        payload.phone = phone;
      }
      
      const { data } = await axios.post('http://localhost:5000/api/users/register', payload);
      
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      // Redirect based on role
      if (data.role === 'farmer') {
        navigate('/farmer-dashboard');
      } else if (data.role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/products');
      }
      
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-emerald-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glassmorphism p-8 rounded-2xl shadow-xl border border-emerald-100">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-emerald-900">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-emerald-600">
            Join AGROCRAFT and connect directly.
          </p>
        </div>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-3 text-center text-sm">
              {error}
            </div>
          )}
          <div className="rounded-md space-y-3">
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">Full Name</label>
              <input
                name="name"
                type="text"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                placeholder="Full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">Email Address</label>
              <input
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">Password</label>
              <input
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-emerald-800 mb-1">User Role</label>
              <select
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
              >
                <option value="customer">Customer</option>
                <option value="farmer">Farmer</option>
              </select>
            </div>

            {role === 'farmer' && (
              <div className="space-y-3 pt-3 border-t border-emerald-100 animate-fadeIn">
                <h3 className="text-sm font-bold text-emerald-900">Farmer Information</h3>
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">Farm Name</label>
                  <input
                    name="farmName"
                    type="text"
                    required={role === 'farmer'}
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                    placeholder="E.g. Green Valley Farm"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">Farm Address</label>
                  <input
                    name="address"
                    type="text"
                    required={role === 'farmer'}
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                    placeholder="Full address of the farm"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-800 mb-1">Contact Phone</label>
                  <input
                    name="phone"
                    type="text"
                    required={role === 'farmer'}
                    className="appearance-none rounded-xl relative block w-full px-4 py-3 border border-emerald-200 placeholder-emerald-400 text-emerald-950 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white/70 text-sm"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-md hover:shadow-lg transition-all"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center text-emerald-800">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-emerald-600 hover:text-emerald-700">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
