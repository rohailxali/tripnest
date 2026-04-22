import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, DollarSign, Compass, Sparkles, ArrowLeft, ArrowRight, Check } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { Button, StepIndicator } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { tripService } from '../services/api';
import { TripWizardData, TravelStyle, TripType } from '../types';

const STEPS = ['Destination', 'Dates', 'Travelers', 'Budget', 'Style', 'Generate'];

const initialData: TripWizardData = {
  destination: '',
  startDate: '',
  endDate: '',
  travelers: 1,
  tripType: 'solo',
  budgetMin: 500,
  budgetMax: 3000,
  travelStyles: [],
  preferences: [],
  specialRequests: '',
};

const travelStyles: { id: TravelStyle; label: string; emoji: string; desc: string }[] = [
  { id: 'adventure', label: 'Adventure', emoji: '🏔️', desc: 'Hiking, sports, thrills' },
  { id: 'luxury', label: 'Luxury', emoji: '💎', desc: 'Premium experiences' },
  { id: 'budget', label: 'Budget', emoji: '💰', desc: 'Best value for money' },
  { id: 'cultural', label: 'Cultural', emoji: '🏛️', desc: 'History, arts, museums' },
  { id: 'relaxation', label: 'Relaxation', emoji: '🧘', desc: 'Spa, beach, wellness' },
  { id: 'foodie', label: 'Foodie', emoji: '🍜', desc: 'Local cuisine & dining' },
  { id: 'photography', label: 'Photography', emoji: '📸', desc: 'Scenic shots & views' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧', desc: 'Kid-friendly activities' },
];

const tripTypes: { id: TripType; label: string; emoji: string }[] = [
  { id: 'solo', label: 'Solo', emoji: '🧳' },
  { id: 'couple', label: 'Couple', emoji: '💑' },
  { id: 'family', label: 'Family', emoji: '👨‍👩‍👧' },
  { id: 'group', label: 'Group', emoji: '👥' },
  { id: 'business', label: 'Business', emoji: '💼' },
];

const popularDests = [
  'Paris, France', 'Bali, Indonesia', 'Tokyo, Japan',
  'New York, USA', 'Santorini, Greece', 'Dubai, UAE',
  'Barcelona, Spain', 'Maldives', 'London, UK', 'Sydney, Australia',
];

// ─── Step 1: Destination ──────────────────────────────────────────────────────
const StepDestination: React.FC<{ data: TripWizardData; onChange: (d: Partial<TripWizardData>) => void }> = ({ data, onChange }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Where do you want to go?</label>
      <div className="relative">
        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={data.destination}
          onChange={e => onChange({ destination: e.target.value })}
          placeholder="Enter a city, country, or region..."
          className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#0ea5e9] text-base transition-all"
        />
      </div>
    </div>
    <div>
      <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3">Popular destinations</p>
      <div className="flex flex-wrap gap-2">
        {popularDests.map(d => (
          <button
            key={d}
            onClick={() => onChange({ destination: d })}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold border transition-all ${
              data.destination === d
                ? 'bg-[#1e3a5f] dark:bg-blue-600 text-white border-[#1e3a5f] dark:border-blue-600'
                : 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:border-[#1e3a5f] dark:hover:border-blue-500 hover:text-[#1e3a5f] dark:hover:text-white'
            }`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  </div>
);

// ─── Step 2: Dates ────────────────────────────────────────────────────────────
const StepDates: React.FC<{ data: TripWizardData; onChange: (d: Partial<TripWizardData>) => void }> = ({ data, onChange }) => {
  const nights = data.startDate && data.endDate
    ? Math.max(0, Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Start Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={data.startDate}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => onChange({ startDate: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#0ea5e9] text-base transition-all"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">End Date</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={data.endDate}
              min={data.startDate || new Date().toISOString().split('T')[0]}
              onChange={e => onChange({ endDate: e.target.value })}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#0ea5e9] text-base transition-all"
            />
          </div>
        </div>
      </div>
      {nights > 0 && (
        <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="font-bold text-blue-900 dark:text-blue-400">{nights} nights · {nights + 1} days</p>
            <p className="text-blue-600 dark:text-blue-500 text-sm">AI will plan activities for each day</p>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Step 3: Travelers ────────────────────────────────────────────────────────
const StepTravelers: React.FC<{ data: TripWizardData; onChange: (d: Partial<TripWizardData>) => void }> = ({ data, onChange }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Trip type</label>
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        {tripTypes.map(t => (
          <button
            key={t.id}
            onClick={() => onChange({ tripType: t.id, travelers: t.id === 'solo' ? 1 : t.id === 'couple' ? 2 : data.travelers })}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              data.tripType === t.id 
                ? 'border-[#1e3a5f] dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
            }`}
          >
            <span className="text-2xl">{t.emoji}</span>
            <span className={`text-xs font-bold ${data.tripType === t.id ? 'text-[#1e3a5f] dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>

    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Number of travelers</label>
      <div className="flex items-center gap-4">
        <button
          onClick={() => onChange({ travelers: Math.max(1, data.travelers - 1) })}
          className="w-12 h-12 rounded-xl border-2 border-gray-200 dark:border-white/10 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-white hover:border-[#1e3a5f] dark:hover:border-blue-500 hover:text-[#1e3a5f] dark:hover:text-blue-400 transition-all"
        >-</button>
        <div className="flex-1 text-center">
          <span className="text-4xl font-bold text-[#1e3a5f] dark:text-blue-500">{data.travelers}</span>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{data.travelers === 1 ? 'traveler' : 'travelers'}</p>
        </div>
        <button
          onClick={() => onChange({ travelers: Math.min(50, data.travelers + 1) })}
          className="w-12 h-12 rounded-xl border-2 border-gray-200 dark:border-white/10 flex items-center justify-center text-xl font-bold text-gray-700 dark:text-white hover:border-[#1e3a5f] dark:hover:border-blue-500 hover:text-[#1e3a5f] dark:hover:text-blue-400 transition-all"
        >+</button>
      </div>
    </div>
  </div>
);

// ─── Step 4: Budget ───────────────────────────────────────────────────────────
const budgetPresets = [
  { label: 'Budget', range: [200, 1000], emoji: '💰', desc: 'Hostels, street food' },
  { label: 'Mid-range', range: [1000, 3000], emoji: '🏨', desc: 'Hotels, restaurants' },
  { label: 'Luxury', range: [3000, 8000], emoji: '💎', desc: 'Premium everything' },
  { label: 'Ultra', range: [8000, 20000], emoji: '🌟', desc: 'No limits' },
];

const StepBudget: React.FC<{ data: TripWizardData; onChange: (d: Partial<TripWizardData>) => void }> = ({ data, onChange }) => (
  <div className="space-y-6">
    <div>
      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">Select a budget range (USD, per person)</label>
      <div className="grid grid-cols-2 gap-3">
        {budgetPresets.map(p => (
          <button
            key={p.label}
            onClick={() => onChange({ budgetMin: p.range[0], budgetMax: p.range[1] })}
            className={`flex flex-col items-start p-4 rounded-2xl border-2 transition-all text-left ${
              data.budgetMin === p.range[0] 
                ? 'border-[#1e3a5f] dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
            }`}
          >
            <span className="text-2xl mb-2">{p.emoji}</span>
            <p className={`font-bold text-sm ${data.budgetMin === p.range[0] ? 'text-[#1e3a5f] dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>{p.label}</p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">${p.range[0].toLocaleString()} – ${p.range[1].toLocaleString()}</p>
            <p className="text-gray-400 dark:text-gray-500 text-xs">{p.desc}</p>
          </button>
        ))}
      </div>
    </div>

    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Min budget ($)</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="number"
            value={data.budgetMin}
            onChange={e => onChange({ budgetMin: Number(e.target.value) })}
            className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#0ea5e9] text-base transition-all"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Max budget ($)</label>
        <div className="relative">
          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="number"
            value={data.budgetMax}
            onChange={e => onChange({ budgetMax: Number(e.target.value) })}
            className="w-full pl-10 pr-4 py-4 rounded-2xl border-2 border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#0ea5e9] text-base transition-all"
          />
        </div>
      </div>
    </div>
  </div>
);

// ─── Step 5: Travel Style ─────────────────────────────────────────────────────
const StepStyle: React.FC<{ data: TripWizardData; onChange: (d: Partial<TripWizardData>) => void }> = ({ data, onChange }) => {
  const toggle = (id: TravelStyle) => {
    const styles = data.travelStyles.includes(id)
      ? data.travelStyles.filter(s => s !== id)
      : [...data.travelStyles, id];
    onChange({ travelStyles: styles });
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Select your travel styles (choose all that apply)</p>
      <div className="grid grid-cols-2 gap-3">
        {travelStyles.map(s => {
          const isSelected = data.travelStyles.includes(s.id);
          return (
            <button
              key={s.id}
              onClick={() => toggle(s.id)}
              className={`flex items-start gap-3 p-4 rounded-2xl border-2 text-left transition-all relative ${
                isSelected ? 'border-[#1e3a5f] dark:border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'
              }`}
            >
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#1e3a5f] rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
              <span className="text-2xl">{s.emoji}</span>
              <div>
                <p className={`font-bold text-sm ${isSelected ? 'text-[#1e3a5f] dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>{s.label}</p>
                <p className="text-gray-400 dark:text-gray-500 text-xs">{s.desc}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Special requests or notes (optional)</label>
        <textarea
          value={data.specialRequests}
          onChange={e => onChange({ specialRequests: e.target.value })}
          placeholder="e.g. vegetarian food options, wheelchair accessible, avoid tourist traps..."
          rows={3}
          className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:border-[#0ea5e9] text-sm resize-none transition-all"
        />
      </div>
    </div>
  );
};

// ─── Step 6: Generate ─────────────────────────────────────────────────────────
const StepGenerate: React.FC<{ data: TripWizardData; loading: boolean }> = ({ data, loading }) => {
  const nights = data.startDate && data.endDate
    ? Math.ceil((new Date(data.endDate).getTime() - new Date(data.startDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-[#0ea5e9] animate-pulse" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">AI is crafting your itinerary...</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Analyzing your preferences, finding the best spots, and planning your perfect trip.</p>
          <div className="mt-6 flex flex-col gap-2 max-w-xs mx-auto">
            {['Researching top attractions...', 'Finding hidden gems...', 'Optimizing your route...', 'Building day-by-day plan...'].map((msg, i) => (
              <div key={msg} className="flex items-center gap-2 text-sm text-gray-400" style={{ animationDelay: `${i * 0.5}s` }}>
                <div className="w-4 h-4 rounded-full bg-blue-200 animate-pulse" />
                {msg}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="bg-gray-50 dark:bg-white/5 rounded-2xl p-5 space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white">Trip Summary</h3>
            {[
              { label: 'Destination', value: data.destination, icon: '📍' },
              { label: 'Duration', value: `${nights} nights · ${nights + 1} days`, icon: '📅' },
              { label: 'Travelers', value: `${data.travelers} ${data.travelers === 1 ? 'person' : 'people'} (${data.tripType})`, icon: '👥' },
              { label: 'Budget', value: `$${data.budgetMin.toLocaleString()} – $${data.budgetMax.toLocaleString()}`, icon: '💰' },
              { label: 'Travel Style', value: data.travelStyles.length > 0 ? data.travelStyles.join(', ') : 'Not specified', icon: '🎯' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold">{item.label}</p>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 capitalize">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-900/20">
            <Sparkles className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-blue-900 dark:text-blue-400 text-sm">Ready to generate!</p>
              <p className="text-blue-600 dark:text-blue-500 text-xs mt-0.5">Our AI will create a complete day-by-day itinerary with morning, afternoon, and evening activities, restaurants, and local tips.</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ─── Main Wizard Page ─────────────────────────────────────────────────────────
const CreateTripPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<TripWizardData>(initialData);
  const [loading, setLoading] = useState(false);
  const { addTrip, addToast } = useAppStore();
  const navigate = useNavigate();

  const onChange = (partial: Partial<TripWizardData>) => setData(d => ({ ...d, ...partial }));

  const isStepValid = () => {
    switch (step) {
      case 0: return data.destination.trim().length > 0;
      case 1: return data.startDate && data.endDate && new Date(data.endDate) > new Date(data.startDate);
      case 2: return data.travelers >= 1;
      case 3: return data.budgetMax > data.budgetMin && data.budgetMin >= 0;
      case 4: return true;
      case 5: return true;
      default: return false;
    }
  };

  const handleNext = () => { if (step < STEPS.length - 1) setStep(s => s + 1); };
  const handleBack = () => { if (step > 0) setStep(s => s - 1); };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const newTrip = await tripService.create({
        title: `${data.destination.split(',')[0]} Trip`,
        destination: data.destination,
        startDate: data.startDate,
        endDate: data.endDate,
        travelers: data.travelers,
        type: data.tripType,
        budget: {
          total: data.budgetMax,
          currency: 'USD',
          spent: 0,
          categories: [
            { id: 'c1', name: 'Flights',    icon: '✈️', allocated: Math.round(data.budgetMax * 0.30), spent: 0, color: '#0ea5e9' },
            { id: 'c2', name: 'Hotels',     icon: '🏨', allocated: Math.round(data.budgetMax * 0.30), spent: 0, color: '#8b5cf6' },
            { id: 'c3', name: 'Food',       icon: '🍽️', allocated: Math.round(data.budgetMax * 0.20), spent: 0, color: '#f97316' },
            { id: 'c4', name: 'Activities', icon: '🎭', allocated: Math.round(data.budgetMax * 0.15), spent: 0, color: '#14b8a6' },
            { id: 'c5', name: 'Shopping',   icon: '🛍️', allocated: Math.round(data.budgetMax * 0.05), spent: 0, color: '#ec4899' },
          ],
          alerts: [],
        },
        tags: [...data.travelStyles],
        itinerary: [],            // Will be populated by generatePlan on the result page
        wizardData: data,         // Persisted so the plan page can run the generator
      });

      addTrip(newTrip);
      // Navigate to the dedicated plan result page — generation happens there
      navigate(`/app/trips/${newTrip.id}/plan`);
    } catch {
      addToast({ type: 'error', title: 'Failed to create trip. Please try again.' });
      setLoading(false);
    }
  };

  const stepComponents = [
    <StepDestination data={data} onChange={onChange} />,
    <StepDates data={data} onChange={onChange} />,
    <StepTravelers data={data} onChange={onChange} />,
    <StepBudget data={data} onChange={onChange} />,
    <StepStyle data={data} onChange={onChange} />,
    <StepGenerate data={data} loading={loading} />,
  ];

  const stepIcons = [MapPin, Calendar, Users, DollarSign, Compass, Sparkles];
  const StepIcon = stepIcons[step];

  return (
    <AppLayout title="Create New Trip">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <StepIndicator steps={STEPS} current={step} />
          <div className="mt-6 flex flex-col items-center">
            <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-3">
              <StepIcon className="w-7 h-7 text-[#1e3a5f] dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold font-display text-gray-900 dark:text-white">{STEPS[step]}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Step {step + 1} of {STEPS.length}</p>
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white dark:bg-[#0a1628] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm p-6 sm:p-8 mb-6" style={{ animation: 'fadeIn 0.3s ease-out' }}>
          {stepComponents[step]}
        </div>

        {/* Navigation */}
        {!loading && (
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={handleBack}
              disabled={step === 0}
              icon={<ArrowLeft className="w-4 h-4" />}
            >
              Back
            </Button>

            {step === STEPS.length - 1 ? (
              <Button
                variant="accent"
                onClick={handleGenerate}
                icon={<Sparkles className="w-4 h-4" />}
                size="lg"
              >
                Generate My Trip Plan
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleNext}
                disabled={!isStepValid()}
                iconRight={<ArrowRight className="w-4 h-4" />}
              >
                Continue
              </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default CreateTripPage;
