import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Globe, ChevronDown, LogOut, User, Settings } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { authService } from '../../services/api';
import { Avatar } from '../ui';

const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isAuthenticated, setUser } = useAppStore();
  const location = useLocation();
  const navigate = useNavigate();
  const isApp = location.pathname.startsWith('/app');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  if (isApp) return null; // App has its own sidebar navigation

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-nav' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className={`text-xl font-bold font-display ${scrolled ? 'text-[#1e3a5f]' : 'text-white'}`}>
              TripNest
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Features', 'About'].map(item => (
              <Link
                key={item}
                to={`/#${item.toLowerCase()}`}
                className={`text-sm font-semibold hover:text-[#f97316] transition-colors ${scrolled ? 'text-gray-700' : 'text-white/90'}`}
              >
                {item}
              </Link>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <span className={`text-sm font-semibold ${scrolled ? 'text-gray-800' : 'text-white'}`}>{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 ${scrolled ? 'text-gray-500' : 'text-white'}`} />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <Link to="/app/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      <Globe className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link to="/app/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      <User className="w-4 h-4" /> Profile
                    </Link>
                    <Link to="/app/settings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setUserMenuOpen(false)}>
                      <Settings className="w-4 h-4" /> Settings
                    </Link>
                    <hr className="my-1 border-gray-100" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className={`text-sm font-semibold px-4 py-2 rounded-xl hover:bg-white/10 transition-colors ${scrolled ? 'text-gray-700' : 'text-white'}`}>
                  Log in
                </Link>
                <Link to="/signup" className="text-sm font-semibold px-5 py-2.5 bg-[#f97316] text-white rounded-xl hover:bg-[#ea580c] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen
              ? <X className={`w-6 h-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
              : <Menu className={`w-6 h-6 ${scrolled ? 'text-gray-800' : 'text-white'}`} />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 flex flex-col gap-2">
            {['Features', 'About'].map(item => (
              <Link key={item} to={`/#${item.toLowerCase()}`} className="text-sm font-semibold text-gray-700 py-2" onClick={() => setMobileOpen(false)}>
                {item}
              </Link>
            ))}
            <hr className="border-gray-100 my-2" />
            {isAuthenticated ? (
              <>
                <Link to="/app/dashboard" className="text-sm font-semibold text-[#1e3a5f] py-2" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="text-sm font-semibold text-red-500 py-2 text-left">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-semibold text-gray-700 py-2" onClick={() => setMobileOpen(false)}>Log in</Link>
                <Link to="/signup" className="btn-accent text-center py-3 rounded-xl text-sm" onClick={() => setMobileOpen(false)}>Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
