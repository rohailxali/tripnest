import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Home, Compass, DollarSign, Users, Plus, LogOut, Globe, X, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../../store/useAppStore';
import { authService } from '../../services/api';
import { Avatar } from '../ui';

const navItems = [
  { path: '/app/dashboard',   icon: Home,       label: 'Dashboard'    },
  { path: '/app/trips',       icon: Compass,    label: 'My Trips'     },
  { path: '/app/budget',      icon: DollarSign, label: 'Budget'       },
  { path: '/app/collaborate', icon: Users,      label: 'Collaboration'},
];

// â”€â”€â”€ Nav Link â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const NavLink: React.FC<{
  path: string; icon: React.ElementType; label: string;
  isActive: boolean; onClick: () => void;
}> = ({ path, icon: Icon, label, isActive, onClick }) => (
  <Link
    to={path}
    onClick={onClick}
    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 text-sm font-semibold transition-all duration-200 ${
      isActive
        ? 'text-white'
        : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
    }`}
  >
    {/* Active background pill */}
    {isActive && (
      <motion.div
        layoutId="activeNav"
        className="absolute inset-0 rounded-xl bg-[#1e3a5f] dark:bg-[#0ea5e9]/20 shadow-sm"
        transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      />
    )}
    <span className="relative z-10 flex items-center gap-3 w-full">
      <Icon className="w-5 h-5 flex-shrink-0" />
      {label}
      {isActive && (
        <motion.div
          layoutId="activeDot"
          className="ml-auto w-1.5 h-1.5 rounded-full bg-[#f97316]"
        />
      )}
    </span>
  </Link>
);

// â”€â”€â”€ Sidebar Content â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const SidebarContent: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, setUser } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-100 dark:border-white/5">
        <motion.div
          whileHover={{ rotate: 15, scale: 1.1 }}
          transition={{ duration: 0.2 }}
          className="w-9 h-9 bg-[#1e3a5f] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md"
        >
          <Globe className="w-5 h-5 text-white" />
        </motion.div>
        <span className="text-xl font-bold font-display text-[#1e3a5f] dark:text-white">
          TripNest
        </span>
        <button
          className="ml-auto lg:hidden p-1.5 hover:bg-gray-100 dark:hover:bg-white/10 rounded-lg transition-colors"
          onClick={onClose}
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* New Trip CTA */}
      <div className="px-4 pt-5 pb-3">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/app/create-trip"
            onClick={onClose}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#f97316] text-white rounded-xl font-bold text-sm hover:bg-[#ea580c] transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" /> New Trip
          </Link>
        </motion.div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <p className="px-3 mb-3 text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
          Menu
        </p>
        {navItems.map(({ icon, label, path }) => {
          const isActive = location.pathname === path ||
            (path !== '/app/dashboard' && location.pathname.startsWith(path));
          return (
            <NavLink
              key={path}
              path={path}
              icon={icon}
              label={label}
              isActive={isActive}
              onClick={onClose}
            />
          );
        })}

        <div className="mt-6">
          <p className="px-3 mb-3 text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-widest">
            Account
          </p>
          <NavLink
            path="/app/profile"
            icon={Settings}
            label="Settings & Profile"
            isActive={location.pathname === '/app/profile' || location.pathname === '/app/settings'}
            onClick={onClose}
          />
        </div>
      </nav>

      {/* User Profile Footer */}
      {user && (
        <div className="px-4 pb-5 pt-3 border-t border-gray-100 dark:border-white/5">
          <motion.div
            whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
            className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 transition-colors"
          >
            <Avatar src={user.avatar} name={user.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors group flex-shrink-0"
            >
              <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// â”€â”€â”€ Sidebar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-white dark:bg-[#0a1628] border-r border-gray-100 dark:border-white/5 sticky top-0 flex-shrink-0">
        <SidebarContent onClose={() => {}} />
      </aside>

      {/* Mobile Sidebar with AnimatePresence */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              className="relative w-72 h-full bg-white dark:bg-[#0a1628] shadow-2xl"
            >
              <SidebarContent onClose={() => setSidebarOpen(false)} />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
