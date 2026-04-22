import React from 'react';
import AppLayout from '../components/layout/AppLayout';
import { Users, Mail, CheckCircle, XCircle, Search } from 'lucide-react';
import { Badge, Avatar, Button } from '../components/ui';
import { useAppStore } from '../store/useAppStore';

const CollaboratePage: React.FC = () => {
  const { trips } = useAppStore();
  const sharedTrips = trips.filter(t => t.sharedAccess && t.sharedAccess.length > 0);

  return (
    <AppLayout title="Collaboration" subtitle="Manage people you're traveling with">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search collaborators..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0a1628] text-sm focus:outline-none focus:ring-2 focus:ring-[#0ea5e9] dark:text-white transition-shadow"
            />
          </div>
        </div>

        {/* Pending Invites (Mock) */}
        <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm">
          <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5 text-orange-500" /> 
            Pending Invitations (1)
          </h3>
          <div className="flex items-center gap-4 p-4 border border-orange-100 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/5 rounded-xl">
            <Avatar name="David Lee" size="sm" />
            <div className="flex-1">
              <p className="font-bold text-gray-900 dark:text-white text-sm">David Lee invited you</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">To join "Summer in Kyoto"</p>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="secondary" icon={<XCircle className="w-4 h-4" />}>Decline</Button>
              <Button size="sm" variant="accent" icon={<CheckCircle className="w-4 h-4" />}>Accept</Button>
            </div>
          </div>
        </div>

        {/* Active Collaborations */}
        <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 dark:border-white/5">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0ea5e9]" />
              Active Trips with Collaborators
            </h3>
          </div>
          
          <div className="divide-y divide-gray-100 dark:divide-white/5">
            {sharedTrips.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                You aren't collaborating on any trips yet.
              </div>
            ) : sharedTrips.map(trip => (
              <div key={trip.id} className="p-5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white">{trip.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{trip.destination} • {trip.sharedAccess.length} collaborators</p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={() => window.location.href=`/app/trips/${trip.id}`}>
                    Manage Trip
                  </Button>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-3">
                  {trip.sharedAccess.map(access => (
                    <div key={access.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5">
                      <Avatar name={access.userName} src={access.userAvatar} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{access.userName}</p>
                        <p className="text-xs text-gray-400 truncate">{access.userEmail}</p>
                      </div>
                      <Badge variant={access.permission === 'admin' ? 'blue' : access.permission === 'edit' ? 'teal' : 'gray'}>
                        {access.permission}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default CollaboratePage;
