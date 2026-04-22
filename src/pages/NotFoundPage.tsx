import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Home, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
    style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdfa 100%)' }}>

    {/* Logo */}
    <div className="flex items-center gap-2.5 mb-12">
      <div className="w-9 h-9 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
        <Globe className="w-5 h-5 text-white" />
      </div>
      <span className="text-xl font-bold font-display text-[#1e3a5f]">TripNest</span>
    </div>

    {/* Illustration */}
    <div className="relative mb-8">
      <div className="text-[160px] font-bold font-display text-[#1e3a5f]/10 leading-none select-none">
        404
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-6xl">ðŸ—ºï¸</div>
      </div>
    </div>

    <h1 className="text-3xl font-bold font-display text-gray-900 mb-3">Page not found</h1>
    <p className="text-gray-500 text-lg mb-8 max-w-md">
      Looks like you've wandered off the map! This destination doesn't exist in TripNest.
    </p>

    <div className="flex flex-wrap gap-3 justify-center">
      <Link
        to="/"
        className="flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#162d4a] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
      >
        <Home className="w-4 h-4" /> Go Home
      </Link>
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
      >
        <ArrowLeft className="w-4 h-4" /> Go Back
      </button>
    </div>

    {/* Suggestions */}
    <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-lg w-full">
      {[
        { emoji: 'ðŸ–ï¸', label: 'Plan a Trip', to: '/app/create-trip' },
        { emoji: 'ðŸ“', label: 'My Trips', to: '/app/trips' },
        { emoji: 'ðŸ—ºï¸', label: 'Explore Map', to: '/app/map' },
      ].map(item => (
        <Link
          key={item.label}
          to={item.to}
          className="flex flex-col items-center gap-2 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <span className="text-2xl">{item.emoji}</span>
          <span className="text-sm font-semibold text-gray-700">{item.label}</span>
        </Link>
      ))}
    </div>
  </div>
);

export default NotFoundPage;
