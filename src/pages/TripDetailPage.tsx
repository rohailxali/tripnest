import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar, Users, DollarSign, MapPin, Share2, Edit2, ArrowLeft,
  Plus, ChevronDown, ChevronUp, Coffee, Sun, Moon, Sparkles,
  MessageCircle, Clock, AlertTriangle
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { Tabs, Badge, Spinner, Button, EmptyState, Avatar, ProgressBar, Modal } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { tripService } from '../services/api';
import { Trip, Activity, ActivityType, ItineraryDay } from '../types';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ─── Activity Type Icons & Colors ─────────────────────────────────────────────
const activityConfig: Record<ActivityType, { emoji: string; color: string; bg: string }> = {
  attraction: { emoji: '🏛️', color: '#0ea5e9', bg: '#e0f2fe' },
  food: { emoji: '🍽️', color: '#f97316', bg: '#fff7ed' },
  transport: { emoji: '🚗', color: '#6b7280', bg: '#f3f4f6' },
  accommodation: { emoji: '🏨', color: '#8b5cf6', bg: '#f5f3ff' },
  activity: { emoji: '🎯', color: '#14b8a6', bg: '#f0fdfa' },
  shopping: { emoji: '🛍️', color: '#ec4899', bg: '#fdf2f8' },
  custom: { emoji: '⭐', color: '#f59e0b', bg: '#fffbeb' },
  entertainment: { emoji: '🎭', color: '#3b82f6', bg: '#eff6ff' },
};

// ─── Activity Card ────────────────────────────────────────────────────────────
const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => {
  const cfg = activityConfig[activity.type] || activityConfig.custom;
  return (
    <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-lg" style={{ backgroundColor: cfg.bg }}>
        {cfg.emoji}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 dark:text-white text-sm">{activity.name}</p>
        <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 line-clamp-2">{activity.description}</p>
        <div className="flex items-center gap-3 mt-1.5">
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MapPin className="w-3 h-3" /> {activity.location}
          </span>
          {activity.duration && (
            <span className="flex items-center gap-1 text-xs text-gray-400">
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

// ─── Itinerary Day Card ───────────────────────────────────────────────────────
const DayCard: React.FC<{ day: ItineraryDay; defaultOpen?: boolean }> = ({ day, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  const totalActivities = day.morning.length + day.afternoon.length + day.evening.length;
  const totalCost = [...day.morning, ...day.afternoon, ...day.evening].reduce((sum, a) => sum + a.cost, 0);

  return (
    <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-left"
      >
        <div className="w-12 h-12 rounded-xl bg-[#1e3a5f] flex flex-col items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold opacity-70">DAY</span>
          <span className="text-white text-lg font-bold leading-none">{day.day}</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-gray-900 dark:text-white">{day.title}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{format(new Date(day.date), 'EEEE, MMMM d')} · {totalActivities} activities · ${totalCost.toLocaleString()}</p>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4">
          {[
            { period: 'Morning', icon: Coffee, activities: day.morning, color: '#f97316' },
            { period: 'Afternoon', icon: Sun, activities: day.afternoon, color: '#0ea5e9' },
            { period: 'Evening', icon: Moon, activities: day.evening, color: '#8b5cf6' },
          ].map(({ period, icon: Icon, activities, color }) => activities.length > 0 && (
            <div key={period}>
              <div className="flex items-center gap-2 mb-2.5">
                <Icon className="w-4 h-4" style={{ color }} />
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{period}</p>
              </div>
              <div className="space-y-2 pl-1">
                {activities.map(act => <ActivityCard key={act.id} activity={act} />)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Itinerary Tab ────────────────────────────────────────────────────────────
const ItineraryTab: React.FC<{ trip: Trip }> = ({ trip }) => {
  if (trip.itinerary.length === 0) {
    return (
      <EmptyState
        icon={<Sparkles className="w-8 h-8" />}
        title="No itinerary yet"
        description="Generate an AI itinerary or start adding activities manually."
        action={
          <Link to={`/app/trips/${trip.id}/plan`}>
            <Button variant="accent" icon={<Sparkles className="w-4 h-4" />}>
              Generate AI Itinerary
            </Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{trip.itinerary.length} days planned</p>
        <Button variant="ghost" size="sm" icon={<Plus className="w-4 h-4" />}>Add Day</Button>
      </div>
      {trip.itinerary.map((day, i) => (
        <DayCard key={day.id} day={day} defaultOpen={i === 0} />
      ))}
    </div>
  );
};

// ─── Budget Tab ───────────────────────────────────────────────────────────────
const BudgetTab: React.FC<{ trip: Trip }> = ({ trip }) => {
  const { budget } = trip;
  const remaining = budget.total - budget.spent;
  const percentUsed = budget.total > 0 ? (budget.spent / budget.total) * 100 : 0;

  const chartData = budget.categories.map(c => ({
    name: c.name,
    value: c.allocated,
    color: c.color,
  }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Budget', value: `$${budget.total.toLocaleString()}`, color: 'text-gray-900 dark:text-white' },
          { label: 'Spent', value: `$${budget.spent.toLocaleString()}`, color: 'text-[#f97316]' },
          { label: 'Remaining', value: `$${remaining.toLocaleString()}`, color: remaining < 0 ? 'text-red-500' : 'text-green-600' },
        ].map(item => (
          <div key={item.label} className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-4 text-center shadow-sm">
            <p className={`text-xl font-bold ${item.color}`}>{item.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-bold text-gray-900 dark:text-white">Overall Budget</p>
          <span className={`text-sm font-bold ${percentUsed > 90 ? 'text-red-500' : 'text-gray-700 dark:text-gray-300'}`}>
            {Math.round(percentUsed)}% used
          </span>
        </div>
        <ProgressBar value={budget.spent} max={budget.total} showLabel />
        {budget.alerts.map(alert => (
          <div key={alert.id} className={`flex items-center gap-2 mt-3 p-2.5 rounded-xl text-xs font-semibold ${
            alert.type === 'danger' ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
          }`}>
            <AlertTriangle className="w-4 h-4" />
            {alert.message}
          </div>
        ))}
      </div>

      {/* Chart + Categories */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
          <p className="font-bold text-gray-900 dark:text-white mb-4">Budget Allocation</p>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v: any) => [`$${v.toLocaleString()}`, '']} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Categories */}
        <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
          <p className="font-bold text-gray-900 dark:text-white mb-4">Categories</p>
          <div className="space-y-3">
            {budget.categories.map(cat => (
              <div key={cat.id}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                    <span>{cat.icon}</span> {cat.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">${cat.spent.toLocaleString()} / ${cat.allocated.toLocaleString()}</span>
                </div>
                <ProgressBar value={cat.spent} max={cat.allocated} color={cat.color} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Map Tab ──────────────────────────────────────────────────────────────────
const MapTab: React.FC<{ trip: Trip }> = ({ trip }) => (
  <div className="space-y-4">
    {/* Map Placeholder */}
    <div className="relative rounded-2xl overflow-hidden h-80 map-container shadow-sm border dark:border-white/10">
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="bg-white/90 dark:bg-[#0a1628]/90 backdrop-blur-sm rounded-2xl px-6 py-4 text-center shadow-md border dark:border-white/5">
          <MapPin className="w-8 h-8 text-[#1e3a5f] dark:text-blue-400 mx-auto mb-2" />
          <p className="font-bold text-gray-900 dark:text-white">Interactive Map</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Connect Google Maps or Mapbox API</p>
          <p className="text-xs text-gray-400 mt-1">Set REACT_APP_MAPS_KEY in .env</p>
        </div>
      </div>
      {/* Fake map pins */}
      {['30% 40%', '50% 30%', '65% 60%'].map((pos, i) => (
        <div key={i} className="absolute z-10" style={{ left: pos.split(' ')[0], top: pos.split(' ')[1] }}>
          <div className="w-8 h-8 bg-[#f97316] rounded-full border-4 border-white dark:border-blue-900 shadow-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">{i + 1}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Places List */}
    {trip.places.length > 0 ? (
      <div>
        <p className="font-bold text-gray-900 dark:text-white mb-3">Saved Places ({trip.places.length})</p>
        <div className="grid sm:grid-cols-2 gap-3">
          {trip.places.map(place => (
            <div key={place.id} className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="h-28 overflow-hidden">
                <img src={place.imageUrl} alt={place.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">{place.name}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{place.category}</p>
                  </div>
                  <span className="flex items-center gap-0.5 text-xs font-bold text-yellow-600 bg-yellow-50 dark:bg-yellow-500/10 px-2 py-0.5 rounded-full">
                    ★ {place.rating}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ) : (
      <EmptyState
        icon={<MapPin className="w-8 h-8" />}
        title="No places saved yet"
        description="Add places to your trip to see them on the map."
        action={<Button variant="primary" icon={<Plus className="w-4 h-4" />}>Add Place</Button>}
      />
    )}
  </div>
);

// ─── Share Modal ──────────────────────────────────────────────────────────────
const ShareModal: React.FC<{ trip: Trip; onClose: () => void }> = ({ trip, onClose }) => {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState<'view' | 'edit'>('view');
  const [loading, setLoading] = useState(false);
  const { addToast } = useAppStore();

  const handleInvite = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await tripService.shareTrip(trip.id, email, permission);
      addToast({ type: 'success', title: 'Invitation sent!', message: `${email} can now ${permission} this trip.` });
      setEmail('');
      onClose();
    } catch {
      addToast({ type: 'error', title: 'Failed to send invitation' });
    } finally {
      setLoading(false);
    }
  };

  const shareUrl = `${window.location.origin}/shared/${trip.shareToken || trip.id}`;

  return (
    <div className="space-y-5">
      {/* Share Link */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Share link</label>
        <div className="flex gap-2">
          <input value={shareUrl} readOnly className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm bg-gray-50 dark:bg-white/5 dark:text-gray-300 truncate" />
          <Button
            size="sm"
            variant="secondary"
            onClick={() => { navigator.clipboard.writeText(shareUrl); addToast({ type: 'success', title: 'Link copied!' }); onClose(); }}
          >
            Copy
          </Button>
        </div>
      </div>

      {/* Invite by Email */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Invite by email</label>
        <div className="flex gap-2 mb-2">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="friend@example.com"
            className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-white/5 dark:text-white"
          />
          <select
            value={permission}
            onChange={e => setPermission(e.target.value as any)}
            className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm focus:outline-none bg-white dark:bg-[#0f2035] dark:text-white"
          >
            <option value="view">Can view</option>
            <option value="edit">Can edit</option>
          </select>
        </div>
        <Button variant="primary" onClick={handleInvite} loading={loading} className="w-full">Send Invitation</Button>
      </div>

      {/* Current Access */}
      {trip.sharedAccess.length > 0 && (
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">People with access</label>
          <div className="space-y-2">
            {trip.sharedAccess.map(access => (
              <div key={access.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                <Avatar name={access.userName} size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{access.userName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{access.userEmail}</p>
                </div>
                <Badge variant={access.permission === 'edit' ? 'blue' : 'gray'}>{access.permission}</Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Comments Section ─────────────────────────────────────────────────────────
const CommentsSection: React.FC<{ trip: Trip }> = ({ trip }) => {
  const [comment, setComment] = useState('');

  return (
    <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-[#0ea5e9]" />
        Comments ({trip.comments.length})
      </h3>
      <div className="space-y-4 mb-4">
        {trip.comments.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No comments yet. Start the conversation!</p>
        ) : (
          trip.comments.map(c => (
            <div key={c.id} className="flex items-start gap-3">
              <Avatar name={c.userName} src={c.userAvatar} size="sm" />
              <div className="flex-1 bg-gray-50 dark:bg-white/5 rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-bold text-gray-800 dark:text-gray-200">{c.userName}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{format(new Date(c.createdAt), 'MMM d, h:mm a')}</p>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">{c.content}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex gap-2">
        <input
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-white/5 dark:text-white"
          onKeyDown={e => e.key === 'Enter' && setComment('')}
        />
        <Button size="sm" variant="primary" onClick={() => setComment('')}>Post</Button>
      </div>
    </div>
  );
};


// ─── Main Trip Detail Page ────────────────────────────────────────────────────
const TripDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentTrip, setCurrentTrip, addToast } = useAppStore();
  const [loading, setLoading] = useState(!currentTrip || currentTrip.id !== id);
  const [activeTab, setActiveTab] = useState('itinerary');
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id && (!currentTrip || currentTrip.id !== id)) {
      setLoading(true);
      tripService.getById(id)
        .then(setCurrentTrip)
        .catch(() => addToast({ type: 'error', title: 'Trip not found' }))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (loading) return (
    <AppLayout><div className="flex justify-center py-32"><Spinner size="lg" /></div></AppLayout>
  );

  if (!currentTrip) return (
    <AppLayout><EmptyState icon={<MapPin className="w-8 h-8" />} title="Trip not found" description="This trip doesn't exist or was deleted." action={<Link to="/app/dashboard" className="btn-primary">Go to Dashboard</Link>} /></AppLayout>
  );

  const trip = currentTrip;
  const nights = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24));

  return (
    <AppLayout>
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white mb-6 transition-colors font-semibold">
        <ArrowLeft className="w-4 h-4" /> Back to trips
      </button>

      {/* Hero */}
      <div className="relative rounded-3xl overflow-hidden h-64 sm:h-80 mb-6 shadow-md">
        <img src={trip.coverImage} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
          <Badge variant={trip.status === 'upcoming' ? 'teal' : trip.status === 'planning' ? 'blue' : 'gray'} size="md">
            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
          </Badge>
          <h1 className="text-2xl sm:text-4xl font-bold font-display text-white mt-2 mb-2">{trip.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {trip.destination}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}</span>
            <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {trip.travelers} travelers</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {nights} nights</span>
          </div>
        </div>

        {/* Actions */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={() => setShareModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors border border-white/30"
          >
            <Share2 className="w-4 h-4" /> Share
          </button>
          <button
            onClick={() => addToast({ type: 'info', title: 'Edit Trip', message: 'Editing trip details will be available in the next update.' })}
            className="flex items-center gap-2 px-4 py-2 bg-[#f97316] text-white rounded-xl font-semibold text-sm hover:bg-[#ea580c] transition-colors"
          >
            <Edit2 className="w-4 h-4" /> Edit
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Budget', value: `$${trip.budget.total.toLocaleString()}`, icon: DollarSign, color: '#1e3a5f' },
          { label: 'Spent', value: `$${trip.budget.spent.toLocaleString()}`, icon: DollarSign, color: '#f97316' },
          { label: 'Days Planned', value: trip.itinerary.length, icon: Calendar, color: '#0ea5e9' },
          { label: 'Saved Places', value: trip.places.length, icon: MapPin, color: '#14b8a6' },
        ].map(stat => (
          <div key={stat.label} className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-4 shadow-sm flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: stat.color + '15' }}>
              <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
            </div>
            <div>
              <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="mb-6">
          <Tabs
            tabs={[
              { id: 'itinerary', label: 'Itinerary', icon: <Calendar className="w-4 h-4" /> },
              { id: 'budget', label: 'Budget', icon: <DollarSign className="w-4 h-4" /> },
              { id: 'collaborate', label: 'Collaborate', icon: <Users className="w-4 h-4" /> },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'itinerary' && <ItineraryTab trip={trip} />}
        {activeTab === 'budget' && <BudgetTab trip={trip} />}

        {activeTab === 'collaborate' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0ea5e9]" />
                Collaborators ({trip.sharedAccess.length + 1})
              </h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Avatar name="You" size="sm" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-800 dark:text-white">You (Owner)</p>
                  </div>
                  <Badge variant="blue">Owner</Badge>
                </div>
                {trip.sharedAccess.map(a => (
                  <div key={a.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                    <Avatar name={a.userName} src={a.userAvatar} size="sm" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800 dark:text-white">{a.userName}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{a.userEmail}</p>
                    </div>
                    <Badge variant={a.permission === 'edit' ? 'teal' : 'gray'}>{a.permission}</Badge>
                  </div>
                ))}
              </div>
              <Button className="mt-4 w-full" variant="secondary" icon={<Plus className="w-4 h-4" />} onClick={() => setShareModalOpen(true)}>
                Invite Collaborator
              </Button>
            </div>
            <CommentsSection trip={trip} />
          </div>
        )}
      </div>

      {/* Share Modal */}
      <Modal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} title="Share Trip">
        <ShareModal trip={trip} onClose={() => setShareModalOpen(false)} />
      </Modal>
    </AppLayout>
  );
};

export default TripDetailPage;
