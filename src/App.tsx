import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import { authService, userService } from './services/api';

// Pages
import HomePage          from './pages/HomePage';
import { LoginPage, SignupPage } from './pages/AuthPages';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import DashboardPage     from './pages/DashboardPage';
import CreateTripPage    from './pages/CreateTripPage';
import AIPlanResultPage  from './pages/AIPlanResultPage';
import TripDetailPage    from './pages/TripDetailPage';
import TripsPage         from './pages/TripsPage';
import ProfilePage       from './pages/ProfilePage';

import SharedTripPage    from './pages/SharedTripPage';
import CollaboratePage   from './pages/CollaboratePage';
import NotFoundPage      from './pages/NotFoundPage';
import { BudgetPage } from './pages/MapBudgetPages';

// Layout & UI
import Navbar            from './components/layout/Navbar';
import { ToastContainer } from './components/ui';

// â”€â”€â”€ Route Guards â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authLoading } = useAppStore();
  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-4 border-[#1e3a5f] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-gray-500">Loading TripNestâ€¦</p>
      </div>
    </div>
  );
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

const PublicOnlyRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, authLoading } = useAppStore();
  if (authLoading) return null;
  return isAuthenticated ? <Navigate to="/app/dashboard" replace /> : <>{children}</>;
};

// â”€â”€â”€ App â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function App() {
  const { user, setUser, setAuthLoading } = useAppStore();

  useEffect(() => {
    if (user?.preferences?.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.preferences?.darkMode]);



  useEffect(() => {
    (async () => {
      if (!authService.isAuthenticated()) {
        // No token at all â€” definitely not logged in
        setAuthLoading(false);
        return;
      }

      // â”€â”€ Phase 1: Restore from localStorage immediately â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // This runs synchronously so the user never sees a sign-out flash
      // on refresh, even if the backend is slow or temporarily unreachable.
      const cached = localStorage.getItem('tripnest_user');
      if (cached) {
        try {
          const cachedUser = JSON.parse(cached);
          const savedTheme = localStorage.getItem('tripnest_theme');
          if (savedTheme) cachedUser.preferences.darkMode = savedTheme === 'dark';
          setUser(cachedUser);
        } catch {
          // Corrupt cache entry â€” ignore, will be overwritten by server fetch
        }
      }

      // Mark auth as resolved so protected routes render immediately
      setAuthLoading(false);

      // â”€â”€ Phase 2: Refresh profile from server in the background â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // Updates the user with fresh data if the server is reachable.
      // On failure, keep whatever was already set above â€” never sign out
      // unless the server explicitly says the token is invalid (401/403).
      try {
        const fetchedUser = await userService.getProfile();
        const savedTheme = localStorage.getItem('tripnest_theme');
        if (savedTheme) fetchedUser.preferences.darkMode = savedTheme === 'dark';
        setUser(fetchedUser); // overwrites cache with fresh server data
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : '';
        const isAuthError =
          message.includes('401') ||
          message.includes('403') ||
          message.includes('Unauthorized') ||
          message.includes('Forbidden') ||
          message.includes('Invalid token') ||
          message.includes('jwt');

        if (isAuthError) {
          // Token is genuinely invalid â€” force a real sign-out
          authService.logout();
          setUser(null);
        }
        // Any other error (network down, server restarting) â€” silently keep
        // the already-restored cached user. Do NOT call logout().
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* â”€â”€ Public â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Route path="/"                 element={<HomePage />} />
        <Route path="/login"            element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
        <Route path="/signup"           element={<PublicOnlyRoute><SignupPage /></PublicOnlyRoute>} />
        <Route path="/forgot-password"  element={<PublicOnlyRoute><ForgotPasswordPage /></PublicOnlyRoute>} />
        <Route path="/shared/:token"    element={<SharedTripPage />} />

        {/* Placeholder legal pages */}
        <Route path="/terms"            element={<NotFoundPage />} />
        <Route path="/privacy"          element={<NotFoundPage />} />

        {/* â”€â”€ App root redirect â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Route path="/app" element={
          <ProtectedRoute><Navigate to="/app/dashboard" replace /></ProtectedRoute>
        } />

        {/* â”€â”€ Protected app pages â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Route path="/app/dashboard"
          element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

        <Route path="/app/trips"
          element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />

        <Route path="/app/trips/:id"
          element={<ProtectedRoute><TripDetailPage /></ProtectedRoute>} />

        <Route path="/app/trips/:id/plan"
          element={<ProtectedRoute><AIPlanResultPage /></ProtectedRoute>} />

        <Route path="/app/create-trip"
          element={<ProtectedRoute><CreateTripPage /></ProtectedRoute>} />


        <Route path="/app/budget"
          element={<ProtectedRoute><BudgetPage /></ProtectedRoute>} />



        <Route path="/app/collaborate"
          element={<ProtectedRoute><CollaboratePage /></ProtectedRoute>} />



        <Route path="/app/shared"
          element={<ProtectedRoute><TripsPage /></ProtectedRoute>} />

        <Route path="/app/profile"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="/app/settings"
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />



        {/* â”€â”€ 404 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;
