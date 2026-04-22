import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Compass } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import TripCard from '../components/trip/TripCard';
import { EmptyState, Spinner } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { tripService } from '../services/api';
import { TripStatus } from '../types';

const STATUS_FILTERS: { label: string; value: TripStatus | 'all' }[] = [
  { label: 'All Trips', value: 'all' },
  { label: 'Planning', value: 'planning' },
  { label: 'Upcoming', value: 'upcoming' },
  { label: 'Completed', value: 'completed' },
];

const TripsPage: React.FC = () => {
  const { trips, setTrips, setTripsLoading, tripsLoading, addToast, removeTrip } = useAppStore();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TripStatus | 'all'>('all');

  useEffect(() => {
    const load = async () => {
      setTripsLoading(true);
      try { setTrips(await tripService.getAll()); }
      catch { addToast({ type: 'error', title: 'Failed to load trips' }); }
      finally { setTripsLoading(false); }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = trips.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.destination.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const handleDelete = async (id: string) => {
    try { await tripService.delete(id); removeTrip(id); addToast({ type: 'success', title: 'Trip deleted' }); }
    catch { addToast({ type: 'error', title: 'Failed to delete' }); }
  };

  return (
    <AppLayout title="My Trips">
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search trips or destinations..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUS_FILTERS.map(f => (
              <button
                key={f.value}
                onClick={() => setStatusFilter(f.value)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all ${
                  statusFilter === f.value 
                    ? 'bg-[#1e3a5f] dark:bg-blue-600 text-white shadow-sm' 
                    : 'bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <Link to="/app/create-trip" className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#f97316] text-white font-bold rounded-xl hover:bg-[#ea580c] transition-all text-sm flex-shrink-0">
            <Plus className="w-4 h-4" /> New Trip
          </Link>
        </div>

        {/* Results */}
        {tripsLoading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<Compass className="w-8 h-8" />}
            title={search ? 'No trips match your search' : 'No trips yet'}
            description={search ? 'Try a different search term.' : 'Create your first trip and let AI plan it for you!'}
            action={!search && (
              <Link to="/app/create-trip" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#162d4a] transition-all text-sm">
                <Plus className="w-4 h-4" /> Create Trip
              </Link>
            )}
          />
        ) : (
          <>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{filtered.length} trip{filtered.length !== 1 ? 's' : ''} found</p>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filtered.map(trip => (
                <TripCard key={trip.id} trip={trip} onDelete={handleDelete} onShare={() => addToast({ type: 'info', title: 'Link copied!' })} />
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default TripsPage;
