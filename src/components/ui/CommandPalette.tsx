import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Compass, LayoutDashboard, Map, DollarSign,
  Users, Settings, Plus, Globe, X, ArrowRight
} from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';

type CommandItem = {
  id: string;
  label: string;
  sublabel?: string;
  icon: React.ReactNode;
  action: () => void;
  category: string;
};

const CommandPalette: React.FC = () => {
  const [open, setOpen]     = useState(false);
  const [query, setQuery]   = useState('');
  const [active, setActive] = useState(0);
  const inputRef            = useRef<HTMLInputElement>(null);
  const navigate            = useNavigate();
  const { trips }           = useAppStore();

  // ── Keyboard shortcut ───────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  // ── Build command list ──────────────────────────────────────────────────────
  const go = (path: string) => { navigate(path); setOpen(false); };

  const staticCommands: CommandItem[] = [
    { id: 'dashboard',   label: 'Dashboard',        icon: <LayoutDashboard className="w-4 h-4" />, action: () => go('/app/dashboard'),   category: 'Navigate' },
    { id: 'trips',       label: 'My Trips',          icon: <Compass className="w-4 h-4" />,         action: () => go('/app/trips'),        category: 'Navigate' },
    { id: 'map',         label: 'Map View',          icon: <Map className="w-4 h-4" />,             action: () => go('/app/map'),          category: 'Navigate' },
    { id: 'budget',      label: 'Budget Overview',   icon: <DollarSign className="w-4 h-4" />,      action: () => go('/app/budget'),       category: 'Navigate' },
    { id: 'collaborate', label: 'Collaboration',     icon: <Users className="w-4 h-4" />,           action: () => go('/app/collaborate'),  category: 'Navigate' },
    { id: 'profile',     label: 'Profile & Settings',icon: <Settings className="w-4 h-4" />,        action: () => go('/app/profile'),      category: 'Navigate' },
    { id: 'create',      label: 'Create New Trip',   icon: <Plus className="w-4 h-4" />,            action: () => go('/app/create-trip'), category: 'Actions',
      sublabel: 'Start the AI trip wizard' },
  ];

  const tripCommands: CommandItem[] = trips.slice(0, 6).map(t => ({
    id: `trip-${t.id}`,
    label: t.title,
    sublabel: t.destination,
    icon: <Globe className="w-4 h-4" />,
    action: () => go(`/app/trips/${t.id}`),
    category: 'Recent Trips',
  }));

  const all = [...staticCommands, ...tripCommands];

  const filtered = query.trim()
    ? all.filter(c =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        (c.sublabel ?? '').toLowerCase().includes(query.toLowerCase())
      )
    : all;

  // ── Keyboard navigation ─────────────────────────────────────────────────────
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown')  { e.preventDefault(); setActive(a => Math.min(a + 1, filtered.length - 1)); }
    if (e.key === 'ArrowUp')    { e.preventDefault(); setActive(a => Math.max(a - 1, 0)); }
    if (e.key === 'Enter' && filtered[active]) { filtered[active].action(); }
  };

  // ── Group by category ───────────────────────────────────────────────────────
  const categories = Array.from(new Set(filtered.map(c => c.category)));

  if (!open) return (
    <button
      onClick={() => setOpen(true)}
      className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-500 transition-colors border border-gray-200"
      title="Search (Ctrl+K)"
    >
      <Search className="w-4 h-4" />
      <span>Search…</span>
      <kbd className="ml-1 text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 font-mono">⌘K</kbd>
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4"
      style={{ animation: 'fadeIn 0.15s ease-out' }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />

      {/* Panel */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100"
        style={{ animation: 'fadeUp 0.2s ease-out' }}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setActive(0); }}
            onKeyDown={handleKey}
            placeholder="Search pages, trips, actions…"
            className="flex-1 text-sm text-gray-800 placeholder-gray-400 focus:outline-none bg-transparent"
          />
          <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto p-2">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-gray-400 text-sm">
              No results for "<span className="font-semibold text-gray-600">{query}</span>"
            </div>
          ) : (
            categories.map(cat => {
              const items = filtered.filter(c => c.category === cat);
              return (
                <div key={cat} className="mb-2">
                  <p className="px-2 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">{cat}</p>
                  {items.map(item => {
                    const globalIdx = filtered.indexOf(item);
                    return (
                      <button
                        key={item.id}
                        onClick={item.action}
                        onMouseEnter={() => setActive(globalIdx)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                          active === globalIdx ? 'bg-[#1e3a5f] text-white' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className={`flex-shrink-0 ${active === globalIdx ? 'text-white' : 'text-gray-400'}`}>
                          {item.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate">{item.label}</p>
                          {item.sublabel && (
                            <p className={`text-xs truncate ${active === globalIdx ? 'text-white/70' : 'text-gray-400'}`}>
                              {item.sublabel}
                            </p>
                          )}
                        </div>
                        <ArrowRight className={`w-3.5 h-3.5 flex-shrink-0 opacity-0 ${active === globalIdx ? 'opacity-100 text-white' : ''}`} />
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hints */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-100 text-xs text-gray-400">
          <span className="flex items-center gap-1"><kbd className="bg-gray-100 rounded px-1 font-mono">↑↓</kbd> Navigate</span>
          <span className="flex items-center gap-1"><kbd className="bg-gray-100 rounded px-1 font-mono">↵</kbd> Open</span>
          <span className="flex items-center gap-1"><kbd className="bg-gray-100 rounded px-1 font-mono">Esc</kbd> Close</span>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
