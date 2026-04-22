import React from 'react';
import { Menu } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from './Sidebar';
import MobileBottomNav from './MobileBottomNav';
import CommandPalette from '../ui/CommandPalette';
import { useAppStore } from '../../store/useAppStore';
import { Avatar } from '../ui';
import { GlobalModal } from '../ui/GlobalModal';
import { PageTransition } from '../ui/motion';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  headerRight?: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children, title, subtitle, headerRight }) => {
  const { setSidebarOpen, user } = useAppStore();


  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-[#060e1a] overflow-hidden transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* ── Top bar ────────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0a1628]/90 backdrop-blur-md border-b border-gray-100/80 dark:border-white/5 px-4 sm:px-8 py-3">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>

            {/* Page title */}
            <div className="flex-1 min-w-0">
              {title && (
                <>
                  <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white truncate leading-tight">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">{subtitle}</p>
                  )}
                </>
              )}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-2">
              <CommandPalette />

              {headerRight}

              {/* User avatar */}
              {user && (
                <div className="hidden sm:block">
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* ── Page content with transition ────────────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8">
          <AnimatePresence mode="wait">
            <PageTransition key={title ?? 'page'}>
              {children}
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>

      <MobileBottomNav />
      <GlobalModal />
    </div>
  );
};

export default AppLayout;
