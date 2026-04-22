import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Compass, Calendar, Globe, TrendingUp,
  ArrowRight, Sparkles, Clock, MapPin
} from 'lucide-react';
import { motion } from 'framer-motion';
import AppLayout from '../components/layout/AppLayout';
import TripCard from '../components/trip/TripCard';
import { useAppStore } from '../store/useAppStore';
import { tripService } from '../services/api';
import { mockStats } from '../data/mockData';
import { EmptyState, Badge } from '../components/ui';
import {
  StaggerContainer, StaggerItem, SlideUp, AnimatedCard
} from '../components/ui/motion';
import { format } from 'date-fns';

// ─── Premium Stat Card ─────────────────────────────────────────────────────────
const StatCard: React.FC<{
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
  bg: string;
  trend?: string;
  delay?: number;
}> = ({ icon: Icon, label, value, color, bg, trend, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay, ease: [0.4, 0, 0.2, 1] }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className="card-premium p-5 sm:p-6"
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bg }}
      >
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {trend && (
        <span className="text-xs font-bold px-2.5 py-1 rounded-full"
          style={{ backgroundColor: bg, color }}>
          +{trend}
        </span>
      )}
    </div>
    <motion.p
      key={String(value)}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: delay + 0.1 }}
      className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-1 font-display"
    >
      {value}
    </motion.p>
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
  </motion.div>
);

// ─── Trip Countdown Card ───────────────────────────────────────────────────────
const UpcomingTripCard: React.FC<{ trip: any; index: number }> = ({ trip, index }) => {
  const daysUntil = Math.ceil(
    (new Date(trip.startDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="flex-shrink-0 w-68 sm:w-72 group"
    >
      <Link to={`/app/trips/${trip.id}`}>
        <div className="relative rounded-2xl overflow-hidden h-44 mb-3 shadow-lg">
          <img
            src={trip.coverImage}
            alt={trip.title}
            className="w-full h-full object-cover trip-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

          {/* Days badge */}
          {daysUntil > 0 && (
            <div className="absolute top-3 right-3 glass rounded-xl px-2.5 py-1.5 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-white" />
              <span className="text-white text-xs font-bold">{daysUntil}d</span>
            </div>
          )}

          {/* Trip info */}
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-bold text-sm leading-tight truncate">{trip.title}</p>
            <p className="text-white/70 text-xs flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />{trip.destination}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between px-1">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d')}
          </p>
          <Badge variant={trip.status === 'upcoming' ? 'teal' : 'blue'}>{trip.status}</Badge>
        </div>
      </Link>
    </motion.div>
  );
};

// ─── Skeleton Loaders ─────────────────────────────────────────────────────────
const TripCardSkeleton = () => (
  <div className="card-premium overflow-hidden">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <div className="skeleton h-5 w-3/4" />
      <div className="skeleton h-3.5 w-1/2" />
      <div className="flex gap-3 mt-4">
        <div className="skeleton h-8 flex-1 rounded-xl" />
        <div className="skeleton h-8 flex-1 rounded-xl" />
      </div>
    </div>
  </div>
);

// ─── Dashboard Page ────────────────────────────────────────────────────────────
const DashboardPage: React.FC = () => {
  const { user, trips, setTrips, setTripsLoading, tripsLoading, addToast, removeTrip } = useAppStore();

  useEffect(() => {
    const fetchTrips = async () => {
      setTripsLoading(true);
      try {
        const data = await tripService.getAll();
        setTrips(data);
      } catch {
        addToast({ type: 'error', title: 'Failed to load trips' });
      } finally {
        setTripsLoading(false);
      }
    };
    fetchTrips();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upcomingTrips = trips.filter(t => t.status === 'upcoming' || t.status === 'planning');
  const recentTrips   = trips.slice(0, 6);
  const sharedTrips   = trips.filter(t => t.sharedAccess.length > 0);

  const handleDeleteTrip = async (id: string) => {
    try {
      await tripService.delete(id);
      removeTrip(id);
      addToast({ type: 'success', title: 'Trip deleted' });
    } catch {
      addToast({ type: 'error', title: 'Failed to delete trip' });
    }
  };

  const handleShareTrip = (_id: string) => {
    addToast({ type: 'info', title: 'Share link copied!', message: 'Anyone with the link can view this trip.' });
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <AppLayout>
      <div className="space-y-8 max-w-7xl mx-auto">

        {/* ── Welcome Header ──────────────────────────────────────────────── */}
        <SlideUp>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-gray-900 dark:text-white">
                {greeting},{' '}
                <span className="gradient-text">{user?.name?.split(' ')[0] ?? 'Traveler'}</span> ✈️
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
                {format(new Date(), 'EEEE, MMMM d')} · Ready for your next adventure?
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/app/create-trip"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f97316] text-white font-bold rounded-xl hover:bg-[#ea580c] transition-all shadow-md hover:shadow-lg text-sm self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> New Trip
              </Link>
            </motion.div>
          </div>
        </SlideUp>

        {/* ── AI Prompt Banner ─────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-2xl p-6 text-white noise"
          style={{ background: 'linear-gradient(135deg, #0f2035 0%, #1e3a5f 55%, #0c4a6e 100%)' }}
        >
          {/* Orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #0ea5e9 0%, transparent 70%)', transform: 'translate(40%, -40%)' }} />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #f97316 0%, transparent 70%)' }} />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm"
            >
              <Sparkles className="w-6 h-6 text-white" />
            </motion.div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Plan a trip with AI</h3>
              <p className="text-white/70 text-sm">
                Tell us your dream destination and we'll craft a perfect itinerary in seconds.
              </p>
            </div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/app/create-trip"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f97316] text-white font-bold rounded-xl hover:bg-[#ea580c] transition-all text-sm whitespace-nowrap shadow-lg"
              >
                Start Planning <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* ── Stat Cards ───────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Compass}    label="Total Trips"     value={mockStats.totalTrips}       color="#0ea5e9" bg="#e0f2fe"  trend="2"  delay={0.15} />
          <StatCard icon={Globe}      label="Countries"       value={mockStats.countriesVisited}  color="#8b5cf6" bg="#f5f3ff"  trend="3"  delay={0.22} />
          <StatCard icon={Calendar}   label="Days Traveled"   value={mockStats.totalDays}         color="#f97316" bg="#fff7ed"             delay={0.29} />
          <StatCard icon={TrendingUp} label="Upcoming"        value={mockStats.upcomingTrips}     color="#14b8a6" bg="#f0fdfa"             delay={0.36} />
        </div>

        {/* ── Upcoming Trips ───────────────────────────────────────────────── */}
        {upcomingTrips.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Trips</h2>
              <Link to="/app/trips" className="text-sm text-[#0ea5e9] font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors">
                See all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-3 -mx-1 px-1 snap-x snap-mandatory">
              {upcomingTrips.map((trip, i) => (
                <div key={trip.id} className="snap-start">
                  <UpcomingTripCard trip={trip} index={i} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Recent Trips Grid ────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recent Trips</h2>
            <Link to="/app/trips" className="text-sm text-[#0ea5e9] font-semibold hover:text-blue-700 flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {tripsLoading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => <TripCardSkeleton key={i} />)}
            </div>
          ) : trips.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <EmptyState
                icon={<Compass className="w-8 h-8" />}
                title="No trips yet"
                description="Start planning your first trip and let AI create a perfect itinerary for you."
                action={
                  <Link to="/app/create-trip" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#162d4a] transition-all">
                    <Plus className="w-4 h-4" /> Create Your First Trip
                  </Link>
                }
              />
            </motion.div>
          ) : (
            <StaggerContainer className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6" delay={0.1}>
              {recentTrips.map(trip => (
                <StaggerItem key={trip.id}>
                  <TripCard trip={trip} onDelete={handleDeleteTrip} onShare={handleShareTrip} />
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}
        </div>

        {/* ── Shared Trips ─────────────────────────────────────────────────── */}
        {sharedTrips.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Shared with Others</h2>
            <StaggerContainer className="grid sm:grid-cols-2 gap-4" delay={0.05}>
              {sharedTrips.map(trip => (
                <StaggerItem key={trip.id}>
                  <TripCard trip={trip} variant="compact" />
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
