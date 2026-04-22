import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass, Plus, Map, User } from 'lucide-react';

const navItems = [
  { to: '/app/dashboard',  icon: LayoutDashboard, label: 'Home'   },
  { to: '/app/trips',      icon: Compass,          label: 'Trips'  },
  { to: '/app/create-trip',icon: Plus,             label: 'New',  accent: true },
  { to: '/app/map',        icon: Map,              label: 'Map'    },
  { to: '/app/profile',    icon: User,             label: 'Profile'},
];

const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const isApp = location.pathname.startsWith('/app');
  if (!isApp) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#0a1628] border-t border-gray-200 dark:border-white/5 safe-area-pb transition-colors duration-300">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map(({ to, icon: Icon, label, accent }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all ${
                accent
                  ? 'bg-[#f97316] text-white shadow-md -mt-4 w-14 h-14 items-center justify-center rounded-2xl border-4 border-white dark:border-[#0a1628]'
                  : isActive
                    ? 'text-[#1e3a5f] dark:text-blue-400'
                    : 'text-gray-400 dark:text-gray-500'
              }`
            }
          >
            <Icon className={accent ? 'w-6 h-6' : 'w-5 h-5'} />
            {!accent && <span className="text-[10px] font-semibold">{label}</span>}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default MobileBottomNav;
