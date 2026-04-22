import React from 'react';

// ─── Generic skeleton primitives ──────────────────────────────────────────────
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`bg-gray-200 rounded-lg animate-pulse ${className}`} />
);

// ─── Trip card skeleton ───────────────────────────────────────────────────────
export const TripCardSkeleton: React.FC = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
    <Skeleton className="h-44 w-full rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-16 rounded-full" />
      </div>
      <Skeleton className="h-10 w-full rounded-xl mt-2" />
    </div>
  </div>
);

// ─── Dashboard skeleton ───────────────────────────────────────────────────────
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-8">
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-40" />
      </div>
      <Skeleton className="h-10 w-28 rounded-xl" />
    </div>

    {/* Banner */}
    <Skeleton className="h-24 w-full rounded-2xl" />

    {/* Stats */}
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3 shadow-sm">
          <Skeleton className="h-11 w-11 rounded-xl" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-4 w-28" />
        </div>
      ))}
    </div>

    {/* Trip cards */}
    <div>
      <Skeleton className="h-6 w-32 mb-4" />
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => <TripCardSkeleton key={i} />)}
      </div>
    </div>
  </div>
);

// ─── Profile skeleton ─────────────────────────────────────────────────────────
export const ProfileSkeleton: React.FC = () => (
  <div className="grid lg:grid-cols-4 gap-6">
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm text-center space-y-3">
        <Skeleton className="w-16 h-16 rounded-full mx-auto" />
        <Skeleton className="h-5 w-28 mx-auto" />
        <Skeleton className="h-4 w-36 mx-auto" />
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-3 shadow-sm space-y-1">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-10 rounded-xl" />)}
      </div>
    </div>
    <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm space-y-4">
      <Skeleton className="h-6 w-40" />
      <div className="grid sm:grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ─── Trip detail skeleton ─────────────────────────────────────────────────────
export const TripDetailSkeleton: React.FC = () => (
  <div className="space-y-6">
    <Skeleton className="h-80 w-full rounded-3xl" />
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex gap-3">
          <Skeleton className="w-10 h-10 rounded-xl flex-shrink-0" />
          <div className="space-y-1 flex-1">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
    <Skeleton className="h-12 w-full max-w-sm rounded-xl" />
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex gap-4">
          <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-16 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);
