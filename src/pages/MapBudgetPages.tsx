import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Search, Star, Clock, DollarSign, TrendingUp, ArrowRight
} from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import AppLayout from '../components/layout/AppLayout';
import { Button, ProgressBar } from '../components/ui';
import { mockPlaces, mockTrips } from '../data/mockData';
import { PlaceCategory } from '../types';

// ─── Category Filters ─────────────────────────────────────────────────────────
const categoryFilters: { id: PlaceCategory | 'all'; label: string; emoji: string }[] = [
  { id: 'all',        label: 'All',         emoji: '🗺️' },
  { id: 'attraction', label: 'Attractions', emoji: '🏛️' },
  { id: 'restaurant', label: 'Restaurants', emoji: '🍽️' },
  { id: 'hotel',      label: 'Hotels',      emoji: '🏨' },
  { id: 'museum',     label: 'Museums',     emoji: '🎨' },
  { id: 'nature',     label: 'Nature',      emoji: '🌿' },
  { id: 'shopping',   label: 'Shopping',    emoji: '🛍️' },
];

const priceLevelLabel = (level: 1 | 2 | 3 | 4) => '$'.repeat(level);

// ─── Map Page ─────────────────────────────────────────────────────────────────
export const MapPage: React.FC = () => {
  const [search, setSearch]           = useState('');
  const [category, setCategory]       = useState<PlaceCategory | 'all'>('all');
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  const filtered = mockPlaces.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    = category === 'all' || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <AppLayout title="Map View" subtitle="Explore places and build your itinerary">
      <div className="flex flex-col lg:flex-row gap-4" style={{ height: 'calc(100vh - 180px)' }}>

        {/* ── Left Panel ── */}
        <div className="w-full lg:w-96 flex flex-col gap-3 overflow-hidden">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search places..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white dark:bg-white/5 dark:text-white"
            />
          </div>

          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categoryFilters.map(f => (
              <button
                key={f.id}
                onClick={() => setCategory(f.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                  category === f.id
                    ? 'bg-[#1e3a5f] dark:bg-blue-600 text-white shadow-sm'
                    : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                <span>{f.emoji}</span> {f.label}
              </button>
            ))}
          </div>

          {/* Results */}
          <div className="flex-1 overflow-y-auto space-y-3 pr-1">
            <p className="text-xs text-gray-400 font-semibold">{filtered.length} places found</p>
            {filtered.map(place => (
              <div
                key={place.id}
                onClick={() => setSelectedPlace(place.id === selectedPlace ? null : place.id)}
                className={`bg-white dark:bg-[#1e3a5f]/20 rounded-2xl border overflow-hidden cursor-pointer transition-all ${
                  selectedPlace === place.id
                    ? 'border-[#1e3a5f] dark:border-blue-500 shadow-md'
                    : 'border-gray-100 dark:border-white/5 hover:border-gray-200 dark:hover:border-white/10 hover:shadow-sm'
                }`}
              >
                <div className="flex gap-3 p-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={place.imageUrl}
                      alt={place.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{place.name}</p>
                      <span className="text-xs font-semibold text-gray-400 ml-1 flex-shrink-0">
                        {priceLevelLabel(place.priceLevel)}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 capitalize mb-1">{place.category}</p>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-0.5 text-xs font-bold text-yellow-600">
                        <Star className="w-3 h-3" fill="#d97706" /> {place.rating}
                      </span>
                      <span className="text-xs text-gray-400">({place.reviewCount.toLocaleString()})</span>
                    </div>
                    {place.openingHours && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5 truncate">
                        <Clock className="w-3 h-3 flex-shrink-0" /> {place.openingHours}
                      </p>
                    )}
                  </div>
                </div>
                {selectedPlace === place.id && (
                  <div className="px-3 pb-3 flex gap-2">
                    <Button size="sm" variant="primary" className="flex-1 text-xs">Add to Trip</Button>
                    <Button size="sm" variant="ghost" className="text-xs">Details</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Map Area ── */}
        <div className="flex-1 rounded-3xl map-container relative min-h-64 shadow-sm">
          {/* Fake pins */}
          {[
            { top: '35%', left: '25%', label: 'Eiffel Tower' },
            { top: '45%', left: '55%', label: 'Louvre Museum' },
            { top: '28%', left: '65%', label: 'Le Jules Verne' },
            { top: '58%', left: '38%', label: 'Seine Cruise' },
          ].map(pin => (
            <div
              key={pin.label}
              className="absolute z-10 group"
              style={{ top: pin.top, left: pin.left }}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-[#f97316] rounded-full border-4 border-white dark:border-blue-900 shadow-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-white dark:bg-[#0f2035] rounded-lg shadow-lg text-xs font-semibold text-gray-800 dark:text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border dark:border-white/10">
                  {pin.label}
                </div>
              </div>
            </div>
          ))}

          {/* Centre overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-5">
            <div className="bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-2xl px-8 py-6 text-center shadow-xl border border-white/50 dark:border-white/10">
              <MapPin className="w-10 h-10 text-[#1e3a5f] dark:text-blue-400 mx-auto mb-3" />
              <p className="font-bold text-gray-900 dark:text-white text-lg">Interactive Map</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Google Maps or Mapbox ready</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 font-mono bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-lg mt-2">
                REACT_APP_MAPS_KEY=your_key
              </p>
            </div>
          </div>

          {/* Zoom controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-1 z-20">
            {['+', '−'].map(c => (
              <button key={c} className="w-9 h-9 bg-white dark:bg-[#0f2035] rounded-xl shadow flex items-center justify-center text-lg font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border dark:border-white/10">
                {c}
              </button>
            ))}
          </div>

          {/* Filter badge */}
          <div className="absolute bottom-4 left-4 z-20 flex gap-2">
            {['All', 'Food', 'Hotels', 'Attractions'].map(f => (
              <button key={f} className="px-3 py-1.5 bg-white dark:bg-[#0f2035] rounded-full shadow text-xs font-semibold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors border border-gray-100 dark:border-white/10">
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

// ─── Budget Overview Page ─────────────────────────────────────────────────────
export const BudgetPage: React.FC = () => {
  const trips       = mockTrips.filter(t => t.budget.total > 0);
  const totalBudget = trips.reduce((sum, t) => sum + t.budget.total, 0);
  const totalSpent  = trips.reduce((sum, t) => sum + t.budget.spent, 0);
  const remaining   = totalBudget - totalSpent;

  const barData = trips.map(t => ({
    name:   t.title.split(' ').slice(0, 2).join(' '),
    Budget: t.budget.total,
    Spent:  t.budget.spent,
  }));

  // Aggregate categories across all trips
  const categoryTotals: Record<string, { allocated: number; spent: number; color: string }> = {};
  trips.forEach(trip => {
    trip.budget.categories.forEach(cat => {
      if (!categoryTotals[cat.name]) {
        categoryTotals[cat.name] = { allocated: 0, spent: 0, color: cat.color };
      }
      categoryTotals[cat.name].allocated += cat.allocated;
      categoryTotals[cat.name].spent     += cat.spent;
    });
  });

  const pieData = Object.entries(categoryTotals).map(([name, data]) => ({
    name,
    value: data.allocated,
    color: data.color,
  }));

  return (
    <AppLayout title="Budget Overview" subtitle="Track spending across all your trips">
      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Budget',    value: `$${totalBudget.toLocaleString()}`,  Icon: DollarSign,  color: '#1e3a5f', bg: '#e0e7ff' },
            { label: 'Total Spent',     value: `$${totalSpent.toLocaleString()}`,   Icon: TrendingUp,  color: '#f97316', bg: '#fff7ed' },
            {
              label: 'Remaining',
              value: `$${Math.abs(remaining).toLocaleString()}${remaining < 0 ? ' over' : ''}`,
              Icon: DollarSign,
              color: remaining >= 0 ? '#14b8a6' : '#ef4444',
              bg:    remaining >= 0 ? '#f0fdfa'  : '#fef2f2',
            },
          ].map(item => (
            <div key={item.label} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: item.bg }}
                >
                  <item.Icon className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{item.value}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Bar Chart */}
          <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Budget vs Spent by Trip</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="Budget" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Spent"  fill="#f97316" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Category Breakdown</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={90}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, '']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Per-Trip Breakdown */}
        <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-5">Per-Trip Budgets</h3>
          <div className="space-y-5">
            {trips.map(trip => {
              const pct = trip.budget.total > 0
                ? (trip.budget.spent / trip.budget.total) * 100
                : 0;
              return (
                <div key={trip.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <img
                        src={trip.coverImage}
                        alt={trip.title}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white text-sm">{trip.title}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{trip.destination}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900 dark:text-white">
                        ${trip.budget.spent.toLocaleString()} / ${trip.budget.total.toLocaleString()}
                      </p>
                      <Link
                        to={`/app/trips/${trip.id}`}
                        className="text-xs text-[#0ea5e9] flex items-center gap-0.5 justify-end hover:text-blue-700 transition-colors"
                      >
                        View <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                  <ProgressBar
                    value={trip.budget.spent}
                    max={trip.budget.total}
                    color={pct > 90 ? '#ef4444' : pct > 70 ? '#f97316' : '#0ea5e9'}
                  />
                  {/* Category mini-bars */}
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {trip.budget.categories.slice(0, 4).map(cat => (
                      <div key={cat.id} className="flex items-center gap-1.5">
                        <span className="text-xs">{cat.icon}</span>
                        <div className="w-16 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${cat.allocated > 0 ? Math.min((cat.spent / cat.allocated) * 100, 100) : 0}%`,
                              backgroundColor: cat.color,
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-400">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Detail Table */}
        <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">All Categories</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  {['Category', 'Allocated', 'Spent', 'Remaining', 'Usage'].map(h => (
                    <th key={h} className="text-left py-2 px-3 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(categoryTotals).map(([name, data]) => {
                  const pct = data.allocated > 0 ? (data.spent / data.allocated) * 100 : 0;
                  return (
                    <tr key={name} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-700 dark:text-gray-300">${data.allocated.toLocaleString()}</td>
                      <td className="py-3 px-3 font-semibold" style={{ color: pct > 90 ? '#ef4444' : (document.documentElement.classList.contains('dark') ? '#e2e8f0' : '#374151') }}>
                        ${data.spent.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-semibold" style={{ color: data.allocated - data.spent >= 0 ? '#059669' : '#ef4444' }}>
                        ${Math.abs(data.allocated - data.spent).toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all"
                              style={{
                                width: `${Math.min(pct, 100)}%`,
                                backgroundColor: pct > 90 ? '#ef4444' : data.color,
                              }}
                            />
                          </div>
                          <span className="text-xs text-gray-500">{Math.round(pct)}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};
