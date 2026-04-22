import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Globe, MapPin, Calendar, Users, DollarSign,
  Clock, Coffee, Sun, Moon, ChevronDown, ChevronUp, Lock
} from 'lucide-react';
import { mockTrips } from '../data/mockData';
import { Trip, ItineraryDay, Activity, ActivityType } from '../types';
import { Badge } from '../components/ui';
import { format } from 'date-fns';

const activityConfig: Record<ActivityType, { emoji: string; bg: string }> = {
  attraction:    { emoji: 'ðŸ›ï¸', bg: '#e0f2fe' },
  food:          { emoji: 'ðŸ½ï¸', bg: '#fff7ed' },
  transport:     { emoji: 'ðŸš—', bg: '#f3f4f6' },
  accommodation: { emoji: 'ðŸ¨', bg: '#f5f3ff' },
  activity:      { emoji: 'ðŸŽ¯', bg: '#f0fdfa' },
  shopping:      { emoji: 'ðŸ›ï¸', bg: '#fdf2f8' },
  custom:        { emoji: 'â­', bg: '#fffbeb' },
  entertainment: { emoji: 'ðŸŽ­', bg: '#eff6ff' },
};

const ActivityRow: React.FC<{ activity: Activity }> = ({ activity }) => {
  const cfg = activityConfig[activity.type] ?? activityConfig.custom;
  return (
    <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-base flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
        {cfg.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-900 text-sm">{activity.name}</p>
        <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{activity.description}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {activity.location}
          </span>
          {activity.duration && (
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> {activity.duration}
            </span>
          )}
          {activity.cost > 0 && (
            <span className="text-xs font-semibold text-green-600">${activity.cost}</span>
          )}
        </div>
      </div>
    </div>
  );
};

const DayCard: React.FC<{ day: ItineraryDay; open: boolean; onToggle: () => void }> = ({ day, open, onToggle }) => {
  const total = [...day.morning, ...day.afternoon, ...day.evening].reduce((s, a) => s + a.cost, 0);
  const count = day.morning.length + day.afternoon.length + day.evening.length;
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <button onClick={onToggle} className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors text-left">
        <div className="w-12 h-12 rounded-xl bg-[#1e3a5f] flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-white text-[10px] font-bold opacity-60 uppercase">Day</span>
          <span className="text-white text-xl font-bold leading-none">{day.day}</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900">{day.title}</p>
          <p className="text-sm text-gray-400">{format(new Date(day.date), 'EEEE, MMMM d')} Â· {count} activities Â· ${total.toLocaleString()}</p>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-gray-50">
          {[
            { label: 'Morning',   Icon: Coffee, items: day.morning,   color: '#f97316' },
            { label: 'Afternoon', Icon: Sun,    items: day.afternoon, color: '#0ea5e9' },
            { label: 'Evening',   Icon: Moon,   items: day.evening,   color: '#8b5cf6' },
          ].map(({ label, Icon, items, color }) => items.length > 0 && (
            <div key={label} className="pt-4">
              <div className="flex items-center gap-2 mb-2.5">
                <Icon className="w-4 h-4" style={{ color }} />
                <p className="text-sm font-bold text-gray-700">{label}</p>
              </div>
              <div className="space-y-2">
                {items.map(act => <ActivityRow key={act.id} activity={act} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SharedTripPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDay, setOpenDay] = useState<number>(0);

  useEffect(() => {
    setTimeout(() => {
      const found = mockTrips.find(t => t.shareToken === token || t.isPublic) ?? mockTrips[0];
      setTrip(found);
      setLoading(false);
    }, 600);
  }, [token]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading shared tripâ€¦</p>
      </div>
    </div>
  );

  if (!trip) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <Lock className="w-8 h-8 text-gray-400" />
      </div>
      <h2 className="text-xl font-bold text-gray-900">Trip not found</h2>
      <p className="text-gray-500 text-sm max-w-xs">This shared trip link may have expired or been removed.</p>
      <Link to="/" className="px-5 py-2.5 bg-[#1e3a5f] text-white rounded-xl font-semibold text-sm hover:bg-[#162d4a] transition-all">
        Go to TripNest
      </Link>
    </div>
  );

  const nights = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold font-display text-[#1e3a5f]">TripNest</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 hidden sm:block">Shared trip Â· view only</span>
            <Link to="/signup" className="px-4 py-1.5 bg-[#f97316] text-white text-xs font-bold rounded-xl hover:bg-[#ea580c] transition-all">
              Plan my own â†’
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Hero */}
        <div className="relative rounded-3xl overflow-hidden h-64 shadow-md">
          <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mb-1">{trip.title}</h1>
            <div className="flex flex-wrap items-center gap-3 text-white/75 text-sm">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{trip.destination}</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{format(new Date(trip.startDate), 'MMM d')} â€“ {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{trip.travelers} travelers</span>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <Badge variant="teal" size="md">Shared Trip</Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Clock,       label: 'Duration',  value: `${nights} nights` },
            { icon: Users,       label: 'Travelers', value: `${trip.travelers} ${trip.travelers === 1 ? 'person' : 'people'}` },
            { icon: DollarSign,  label: 'Budget',    value: `$${trip.budget.total.toLocaleString()}` },
            { icon: Calendar,    label: 'Itinerary', value: `${trip.itinerary.length} days` },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm text-center">
              <Icon className="w-5 h-5 text-[#0ea5e9] mx-auto mb-1.5" />
              <p className="font-bold text-gray-900 text-sm">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        {trip.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {trip.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-semibold text-gray-600 capitalize shadow-sm">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Itinerary */}
        {trip.itinerary.length > 0 ? (
          <div>
            <h2 className="text-xl font-bold font-display text-gray-900 mb-4">Day-by-Day Itinerary</h2>
            <div className="space-y-3">
              {trip.itinerary.map((day, i) => (
                <DayCard
                  key={day.id}
                  day={day}
                  open={openDay === i}
                  onToggle={() => setOpenDay(openDay === i ? -1 : i)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center shadow-sm">
            <p className="text-gray-400">No itinerary available for this trip yet.</p>
          </div>
        )}

        {/* CTA Banner */}
        <div className="rounded-2xl p-6 text-white text-center" style={{ background: 'linear-gradient(135deg, #0f2035, #1e3a5f)' }}>
          <p className="font-bold text-lg mb-1">Want to plan a trip like this?</p>
          <p className="text-white/70 text-sm mb-4">TripNest's AI creates personalized itineraries in seconds â€” totally free.</p>
          <Link to="/signup" className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#f97316] text-white font-bold rounded-xl hover:bg-[#ea580c] transition-all text-sm shadow-md">
            Start Planning Free â†’
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SharedTripPage;
