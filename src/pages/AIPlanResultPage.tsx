import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Sparkles, CheckCircle, Calendar, MapPin, DollarSign,
  Users, RefreshCw, Edit2, Share2, ArrowRight, Coffee, Sun, Moon,
  ChevronDown, ChevronUp, Clock, Plus
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { Button } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { tripService } from '../services/api';
import { Trip, ActivityType, ItineraryDay, TripWizardData } from '../types';
import { format } from 'date-fns';

// ─── Activity type decorations ────────────────────────────────────────────────
const actCfg: Record<ActivityType, { emoji: string; bg: string; color: string }> = {
  attraction:    { emoji: '🏛️', bg: '#e0f2fe', color: '#0ea5e9' },
  food:          { emoji: '🍽️', bg: '#fff7ed', color: '#f97316' },
  transport:     { emoji: '🚗', bg: '#f3f4f6', color: '#6b7280' },
  accommodation: { emoji: '🏨', bg: '#f5f3ff', color: '#8b5cf6' },
  activity:      { emoji: '🎯', bg: '#f0fdfa', color: '#14b8a6' },
  shopping:      { emoji: '🛍️', bg: '#fdf2f8', color: '#ec4899' },
  custom:        { emoji: '⭐', bg: '#fffbeb', color: '#f59e0b' },
  entertainment: { emoji: '🎭', bg: '#eff6ff', color: '#3b82f6' },
};

// ─── Skeleton Loader ──────────────────────────────────────────────────────────
const SkeletonCard: React.FC = () => (
  <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm animate-pulse">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-12 h-12 bg-gray-200 dark:bg-white/10 rounded-xl" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded w-1/2 mb-2" />
        <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/3" />
      </div>
    </div>
    {[1, 2, 3].map(i => (
      <div key={i} className="flex gap-3 mb-3">
        <div className="w-9 h-9 bg-gray-100 dark:bg-white/5 rounded-lg flex-shrink-0" />
        <div className="flex-1">
          <div className="h-3 bg-gray-200 dark:bg-white/10 rounded w-3/4 mb-1.5" />
          <div className="h-2 bg-gray-100 dark:bg-white/5 rounded w-1/2" />
        </div>
      </div>
    ))}
  </div>
);

// ─── Generating Screen ────────────────────────────────────────────────────────
const GeneratingScreen: React.FC<{ destination: string }> = ({ destination }) => {
  const [step, setStep] = useState(0);
  const steps = [
    { icon: '🔍', text: 'Researching top attractions…' },
    { icon: '🗺️', text: 'Mapping the best routes…' },
    { icon: '🍽️', text: 'Finding local restaurants…' },
    { icon: '🏨', text: 'Checking accommodation options…' },
    { icon: '✨', text: 'Crafting your perfect itinerary…' },
  ];

  useEffect(() => {
    const t = setInterval(() => setStep(s => (s + 1) % steps.length), 900);
    return () => clearInterval(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      {/* Pulsing orb */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1e3a5f] to-[#0ea5e9] flex items-center justify-center shadow-2xl">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <div className="absolute inset-0 rounded-full border-4 border-blue-200 animate-ping opacity-40" />
        <div className="absolute -inset-2 rounded-full border-2 border-blue-100 animate-ping opacity-20" style={{ animationDelay: '0.3s' }} />
      </div>

      <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">
        AI is planning your {destination.split(',')[0]} trip
      </h2>
      <p className="text-gray-500 text-sm mb-8 max-w-sm">
        Our AI is crafting a personalized day-by-day itinerary just for you. This takes about 10–15 seconds.
      </p>

      {/* Step indicator */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm w-full max-w-sm">
        {steps.map((s, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 py-2.5 transition-all duration-300 ${
              i === step ? 'opacity-100' : i < step ? 'opacity-40' : 'opacity-20'
            }`}
          >
            <span className="text-lg">{s.icon}</span>
            <span className={`text-sm font-medium ${i === step ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-600'}`}>
              {s.text}
            </span>
            {i < step && <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />}
            {i === step && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin ml-auto flex-shrink-0" />}
          </div>
        ))}
      </div>

      {/* Skeleton preview */}
      <div className="w-full max-w-2xl mt-8 space-y-4 opacity-40">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

// ─── Day Card ─────────────────────────────────────────────────────────────────
const DayCard: React.FC<{ day: ItineraryDay; index: number; defaultOpen?: boolean }> = ({
  day, index, defaultOpen = false
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const allActs = [...day.morning, ...day.afternoon, ...day.evening];
  const totalCost = allActs.reduce((s, a) => s + a.cost, 0);

  return (
    <div
      className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
      style={{ animation: `fadeUp 0.4s ease-out ${index * 0.08}s both` }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 hover:bg-gray-50/70 transition-colors text-left"
      >
        {/* Day number */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1e3a5f] to-[#0ea5e9] flex flex-col items-center justify-center flex-shrink-0 shadow-md">
          <span className="text-white/70 text-[10px] font-bold uppercase tracking-wider">Day</span>
          <span className="text-white text-2xl font-bold leading-none">{day.day}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 dark:text-white text-base">{day.title}</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">
            {format(new Date(day.date), 'EEEE, MMMM d')}
            {' · '}{allActs.length} activities
            {totalCost > 0 && ` · ~$${totalCost.toLocaleString()}`}
          </p>
          {/* Activity type pills */}
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {allActs.slice(0, 4).map(act => {
              const cfg = actCfg[act.type] ?? actCfg.custom;
              return (
                <span
                  key={act.id}
                  className="px-2 py-0.5 rounded-full text-xs font-medium dark:opacity-90"
                  style={{ backgroundColor: cfg.bg, color: cfg.color }}
                >
                  {cfg.emoji} {act.name.split(' ')[0]}
                </span>
              );
            })}
            {allActs.length > 4 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">
                +{allActs.length - 4} more
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0">
          {open
            ? <ChevronUp className="w-5 h-5 text-gray-400" />
            : <ChevronDown className="w-5 h-5 text-gray-400" />
          }
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-50 px-5 pb-5 pt-4 space-y-5">
          {[
            { label: 'Morning',   Icon: Coffee, items: day.morning,   color: '#f97316' },
            { label: 'Afternoon', Icon: Sun,    items: day.afternoon, color: '#0ea5e9' },
            { label: 'Evening',   Icon: Moon,   items: day.evening,   color: '#8b5cf6' },
          ].map(({ label, Icon, items, color }) => items.length > 0 && (
            <div key={label}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4" style={{ color }} />
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{label}</span>
                <div className="flex-1 h-px bg-gray-100 dark:bg-white/5" />
              </div>
              <div className="space-y-2 pl-2">
                {items.map(act => {
                  const cfg = actCfg[act.type] ?? actCfg.custom;
                  return (
                    <div key={act.id} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 transition-colors group">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                        style={{ backgroundColor: cfg.bg }}
                      >
                        {cfg.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-white text-sm">{act.name}</p>
                        <p className="text-gray-400 dark:text-gray-500 text-xs mt-0.5 line-clamp-2">{act.description}</p>
                        <div className="flex flex-wrap items-center gap-3 mt-1.5">
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {act.location}
                          </span>
                          {act.duration && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {act.duration}
                            </span>
                          )}
                          {act.cost > 0 && (
                            <span className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-500/10 px-1.5 py-0.5 rounded-full">
                              ${act.cost}
                            </span>
                          )}
                        </div>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white rounded-lg">
                        <Plus className="w-3.5 h-3.5 text-gray-400" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Plan Result Page ─────────────────────────────────────────────────────────
const AIPlanResultPage: React.FC = () => {
  const { id }               = useParams<{ id: string }>();
  const navigate             = useNavigate();
  const { addToast, updateTrip } = useAppStore();
  const [trip, setTrip]      = useState<Trip | null>(null);
  const [generating, setGenerating] = useState(true);
  const [revealed, setRevealed]     = useState(false);

  /** Run the itinerary generator and update local + global state. */
  const runGeneration = async (tripId: string) => {
    try {
      // First fetch the trip to get its stored wizardData
      const base = await tripService.getById(tripId);

      if (!base.wizardData) {
        // No wizard data — trip was not created through the wizard (e.g. it's a demo trip).
        // Just show the trip as-is without generating.
        setTrip(base);
        setGenerating(false);
        setTimeout(() => setRevealed(true), 200);
        return;
      }

      // Call the generator — this runs deterministic logic based on form inputs
      const generated = await tripService.generatePlan(tripId, base.wizardData as TripWizardData);

      setTrip(generated);
      // Sync the updated itinerary into the global store so TripDetailPage sees it
      updateTrip(tripId, { itinerary: generated.itinerary });

      setGenerating(false);
      setTimeout(() => setRevealed(true), 200);
    } catch {
      addToast({ type: 'error', title: 'Failed to generate trip plan' });
      navigate('/app/dashboard');
    }
  };

  useEffect(() => {
    if (!id) return;
    // Short delay for the animated loading screen before running generation
    const timer = setTimeout(() => runGeneration(id), 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleRegenerate = async () => {
    if (!id) return;
    setGenerating(true);
    setRevealed(false);
    await runGeneration(id);
    addToast({ type: 'success', title: 'Itinerary regenerated!', message: 'Plan rebuilt from your trip inputs.' });
  };

  return (
    <AppLayout title={generating ? 'Generating Your Plan…' : 'Your AI Trip Plan'}>
      {generating ? (
        <GeneratingScreen destination={trip?.destination ?? 'your destination'} />
      ) : !trip ? null : (
        <div className={`space-y-6 transition-all duration-500 ${revealed ? 'opacity-100' : 'opacity-0 translate-y-4'}`}>
          {/* Success Banner */}
          <div
            className="relative overflow-hidden rounded-3xl p-6 text-white shadow-lg"
            style={{ background: 'linear-gradient(135deg, #0f2035 0%, #1e3a5f 50%, #0ea5e9 100%)' }}
          >
            {/* Decorative orb */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10"
              style={{ background: 'radial-gradient(circle, white 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />

            <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-14 h-14 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-green-300 text-sm font-semibold">Itinerary Generated Successfully</span>
                </div>
                <h2 className="text-2xl font-bold font-display">{trip.title}</h2>
                <div className="flex flex-wrap gap-4 mt-2 text-white/75 text-sm">
                  <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {trip.destination}</span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
                  </span>
                  <span className="flex items-center gap-1.5"><Users className="w-4 h-4" /> {trip.travelers} travelers</span>
                  <span className="flex items-center gap-1.5"><DollarSign className="w-4 h-4" /> ${trip.budget.total.toLocaleString()} budget</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <button
                  onClick={handleRegenerate}
                  className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 border border-white/30 text-white text-sm font-semibold rounded-xl transition-all backdrop-blur-sm"
                >
                  <RefreshCw className="w-4 h-4" /> Regenerate
                </button>
                <Link
                  to={`/app/trips/${trip.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-[#f97316] hover:bg-[#ea580c] text-white text-sm font-bold rounded-xl transition-all shadow-md"
                >
                  <Edit2 className="w-4 h-4" /> Edit Plan
                </Link>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              {
                icon: Calendar,
                label: 'Days Planned',
                value: trip.itinerary.length,
                sub: `${trip.itinerary.length} full days`,
                color: '#1e3a5f', bg: '#e0e7ff',
              },
              {
                icon: Sparkles,
                label: 'Activities',
                value: trip.itinerary.flatMap(d => [...d.morning, ...d.afternoon, ...d.evening]).length,
                sub: 'AI curated picks',
                color: '#0ea5e9', bg: '#e0f2fe',
              },
              {
                icon: DollarSign,
                label: 'Est. Cost',
                value: `$${trip.itinerary.flatMap(d => [...d.morning, ...d.afternoon, ...d.evening]).reduce((s, a) => s + a.cost, 0).toLocaleString()}`,
                sub: 'Based on avg prices',
                color: '#f97316', bg: '#fff7ed',
              },
              {
                icon: Users,
                label: 'Travelers',
                value: trip.travelers,
                sub: trip.type.charAt(0).toUpperCase() + trip.type.slice(1) + ' trip',
                color: '#14b8a6', bg: '#f0fdfa',
              },
            ].map(({ icon: Icon, label, value, sub, color, bg }) => (
              <div key={label} className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-4 shadow-sm">
                <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon className="w-4.5 h-4.5" style={{ color }} />
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>
                <p className="text-xs text-gray-300 dark:text-gray-600 mt-0.5">{sub}</p>
              </div>
            ))}
          </div>

          {/* Tags */}
          {trip.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {trip.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 text-xs font-semibold rounded-full capitalize shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Itinerary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold font-display text-gray-900 dark:text-white">Day-by-Day Itinerary</h3>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5">AI-generated · fully customizable</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" icon={<Share2 className="w-4 h-4" />}
                  onClick={() => addToast({ type: 'success', title: 'Share link copied!' })}>
                  Share
                </Button>
                <Button size="sm" variant="secondary" icon={<Plus className="w-4 h-4" />}>
                  Add Day
                </Button>
              </div>
            </div>

            {trip.itinerary.length === 0 ? (
              <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-dashed border-gray-200 dark:border-white/10 p-12 text-center">
                <Sparkles className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                <p className="text-gray-400 dark:text-gray-500 font-medium">No itinerary yet. Try regenerating the plan.</p>
                <Button className="mt-4" variant="accent" onClick={handleRegenerate} icon={<RefreshCw className="w-4 h-4" />}>
                  Generate Itinerary
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {trip.itinerary.map((day, i) => (
                  <DayCard key={day.id} day={day} index={i} defaultOpen={i === 0} />
                ))}
              </div>
            )}
          </div>

          {/* Bottom CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
            <div>
              <p className="font-bold text-gray-900 dark:text-white">Happy with this plan?</p>
              <p className="text-sm text-gray-400 dark:text-gray-500">Save it to your trips and start inviting your travel companions.</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleRegenerate} icon={<RefreshCw className="w-4 h-4" />}>
                Try Again
              </Button>
              <Link
                to={`/app/trips/${trip.id}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1e3a5f] text-white font-bold rounded-xl hover:bg-[#162d4a] transition-all text-sm shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                Open Full Trip <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default AIPlanResultPage;
