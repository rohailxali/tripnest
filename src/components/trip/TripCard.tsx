import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Users, DollarSign, MapPin,
  MoreVertical, Edit2, Trash2, Share2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trip, TripStatus } from '../../types';
import { Badge } from '../ui';
import { format } from 'date-fns';

const statusConfig: Record<TripStatus, { label: string; variant: 'blue' | 'green' | 'orange' | 'gray' | 'teal' | 'purple' | 'red' }> = {
  planning:  { label: 'Planning',     variant: 'blue'   },
  upcoming:  { label: 'Upcoming',     variant: 'teal'   },
  ongoing:   { label: 'Ongoing Now',  variant: 'green'  },
  completed: { label: 'Completed',    variant: 'gray'   },
  cancelled: { label: 'Cancelled',    variant: 'red'    },
};

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
  onShare?:  (id: string) => void;
  variant?:  'default' | 'compact';
}

const TripCard: React.FC<TripCardProps> = ({ trip, onDelete, onShare, variant = 'default' }) => {
  const [menuOpen, setMenuOpen] = React.useState(false);
  const status     = statusConfig[trip.status];
  const budgetUsed = trip.budget.total > 0 ? (trip.budget.spent / trip.budget.total) * 100 : 0;
  const nights     = Math.ceil(
    (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  // ── Compact variant ────────────────────────────────────────────────────────
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.99 }}
      >
        <Link
          to={`/app/trips/${trip.id}`}
          className="flex items-center gap-4 p-4 card-premium hover:!shadow-md transition-all duration-200 group"
        >
          <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
            <img src={trip.coverImage} alt={trip.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{trip.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" /> {trip.destination}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d, yyyy')}
            </p>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </Link>
      </motion.div>
    );
  }

  // ── Default variant ────────────────────────────────────────────────────────
  return (
    <motion.div
      whileHover={{ y: -5, transition: { duration: 0.22 } }}
      className="card-premium group overflow-hidden"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={trip.coverImage}
          alt={trip.title}
          className="w-full h-full object-cover trip-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <Badge variant={status.variant} size="md">{status.label}</Badge>
        </div>

        {/* Actions menu */}
        <div className="absolute top-3 right-3">
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.preventDefault(); setMenuOpen(!menuOpen); }}
              className="w-8 h-8 glass rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <MoreVertical className="w-4 h-4 text-white" />
            </motion.button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-[#0f2035] rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 py-1.5 z-20 overflow-hidden"
                >
                  <Link to={`/app/trips/${trip.id}`}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                    <Edit2 className="w-3.5 h-3.5" /> View &amp; Edit
                  </Link>
                  {onShare && (
                    <button onClick={() => { onShare(trip.id); setMenuOpen(false); }}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5 w-full transition-colors">
                      <Share2 className="w-3.5 h-3.5" /> Share Trip
                    </button>
                  )}
                  {onDelete && (
                    <button onClick={() => { onDelete(trip.id); setMenuOpen(false); }}
                      className="flex items-center gap-2.5 px-3.5 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 w-full text-left transition-colors">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Title / destination overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <h3 className="font-bold text-white text-lg leading-tight mb-0.5 drop-shadow-md">{trip.title}</h3>
          <p className="text-white/80 text-sm flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {trip.destination}
          </p>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5">
        {/* Meta row */}
        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-400" />
            {format(new Date(trip.startDate), 'MMM d')} – {format(new Date(trip.endDate), 'MMM d')}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-gray-400" />
            {trip.travelers} {trip.travelers === 1 ? 'person' : 'people'}
          </span>
        </div>

        {/* Tags */}
        {trip.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {trip.tags.slice(0, 3).map(tag => (
              <span key={tag}
                className="px-2.5 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 rounded-full text-xs font-medium capitalize">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Budget progress */}
        <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <DollarSign className="w-3 h-3" /> Budget
            </span>
            <span className="text-xs font-bold text-gray-800 dark:text-white">
              ${trip.budget.spent.toLocaleString()} / ${trip.budget.total.toLocaleString()}
            </span>
          </div>
          <div className="h-1.5 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(budgetUsed, 100)}%` }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
              className={`h-full rounded-full ${
                budgetUsed > 90 ? 'bg-red-500' :
                budgetUsed > 70 ? 'bg-orange-500' : 'bg-[#0ea5e9]'
              }`}
            />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-xs text-gray-400">{nights} nights</span>
            <span className="text-xs text-gray-400">{Math.round(budgetUsed)}% used</span>
          </div>
        </div>

        {/* CTA */}
        <Link
          to={`/app/trips/${trip.id}`}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#1e3a5f] dark:bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-[#162d4a] dark:hover:bg-white/15 transition-all group/btn"
        >
          View Details
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
        </Link>
      </div>
    </motion.div>
  );
};

export default TripCard;
