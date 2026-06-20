import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-between">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 relative z-10">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mb-6 border border-emerald-200">
            🌾 Directly connecting Farmers & Customers
          </span>
          <h1 className="text-4xl sm:text-6xl font-black text-emerald-950 tracking-tight leading-none mb-6">
            Fresh Produce from <br className="hidden sm:inline" />
            <span className="text-emerald-600">Local Farms</span> to your Doorstep
          </h1>
          <p className="text-lg text-emerald-800 max-w-xl mx-auto mb-10 font-medium">
            AGROCRAFT is an end-to-end marketplace cutting out the middleman. Empowering local farmers, ensuring the freshest quality for you.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl shadow-md hover:shadow-lg transition-all"
            >
              Explore Products
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold rounded-2xl shadow-sm hover:shadow transition-all"
            >
              Register as Farmer
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="py-12 bg-white/50 border-y border-emerald-100">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="text-3xl mb-4">🚜</div>
              <h3 className="text-lg font-bold text-emerald-950 mb-2">Direct from Farmers</h3>
              <p className="text-sm text-emerald-800">Farmers set their own pricing and harvest timing, ensuring they get 100% of the proceeds.</p>
            </div>
            <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="text-3xl mb-4">🥬</div>
              <h3 className="text-lg font-bold text-emerald-950 mb-2">Always Fresh</h3>
              <p className="text-sm text-emerald-800">Fresh organic vegetables, seasonal fruits, dairy, and spices harvested and shipped immediately.</p>
            </div>
            <div className="glassmorphism p-6 rounded-2xl border border-emerald-100 shadow-sm">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-emerald-950 mb-2">No Middlemen</h3>
              <p className="text-sm text-emerald-800">We bypass traditional wholesale markets, reducing cost for customers and increasing margins for farmers.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
