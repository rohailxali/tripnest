import React, { useState } from 'react';
import { User, Mail, MapPin, Lock, Bell, Globe, Save, Camera, LogOut, Moon, Sun } from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import { Button, Avatar, Badge } from '../components/ui';
import { useAppStore } from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { authService, userService } from '../services/api';

const ProfilePage: React.FC = () => {
  const { user, setUser, addToast } = useAppStore();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
  });
  const [notifications, setNotifications] = useState({
    email: user?.preferences.emailNotifications ?? true,
    tripReminders: true,
    budgetAlerts: true,
    collaboration: true,
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', new: '', confirm: '' });

  const onFieldChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSaveProfile = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setUser({ ...user!, ...form });
    addToast({ type: 'success', title: 'Profile updated!' });
    setSaving(false);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
  };

  const handleUpdatePassword = async () => {
    if (!passwordForm.new || passwordForm.new !== passwordForm.confirm) {
      addToast({ type: 'error', title: 'Passwords do not match!' });
      return;
    }
    try {
      await userService.updatePassword(passwordForm.new);
      addToast({ type: 'success', title: 'Password completely updated in database!' });
      setPasswordForm({ current: '', new: '', confirm: '' });
    } catch {
      addToast({ type: 'error', title: 'Failed to update database.' });
    }
  };

  const sections = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'preferences', label: 'Preferences', icon: Globe },
  ];

  return (
    <AppLayout title="Profile & Settings">
      <div className="grid lg:grid-cols-4 gap-6 max-w-5xl">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* User Card */}
          <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-5 shadow-sm mb-4 text-center">
            <div className="relative inline-block mb-3">
              <Avatar src={user?.avatar} name={user?.name || 'User'} size="lg" />
              <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#f97316] rounded-full flex items-center justify-center border-2 border-white dark:border-[#0a1628]">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <p className="font-bold text-gray-900 dark:text-white">{user?.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
            <div className="flex justify-center gap-4 mt-3">
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.tripsCount}</p>
                <p className="text-xs text-gray-400">Trips</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">23</p>
                <p className="text-xs text-gray-400">Countries</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-2 shadow-sm">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all mb-0.5 ${
                  activeSection === id 
                    ? 'bg-[#1e3a5f] dark:bg-blue-600 text-white' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" /> {label}
              </button>
            ))}
            <hr className="my-2 border-gray-100 dark:border-white/5" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeSection === 'profile' && (
            <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.name} onChange={onFieldChange('name')} className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.email} onChange={onFieldChange('email')} type="email" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input value={form.location} onChange={onFieldChange('location')} placeholder="City, Country" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                  </div>
                </div>
              </div>
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={onFieldChange('bio')}
                  rows={3}
                  placeholder="Tell others about your travel style..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                />
              </div>
              {/* Travel styles */}
              <div className="mb-5">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Travel Styles</label>
                <div className="flex flex-wrap gap-2">
                  {(user?.preferences.travelStyle || []).map(s => (
                    <Badge key={s} variant="blue" size="md">{s}</Badge>
                  ))}
                  <button className="px-3 py-1 rounded-full border-2 border-dashed border-gray-300 dark:border-white/10 text-gray-400 text-xs font-semibold hover:border-gray-400 dark:hover:border-white/20 transition-colors">
                    + Add
                  </button>
                </div>
              </div>
              <Button variant="primary" loading={saving} onClick={handleSaveProfile} icon={<Save className="w-4 h-4" />}>
                Save Changes
              </Button>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Notification Preferences</h2>
              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email notifications', desc: 'Receive emails about trip updates and reminders' },
                  { key: 'tripReminders', label: 'Trip reminders', desc: 'Get reminded 7 days before your trip' },
                  { key: 'budgetAlerts', label: 'Budget alerts', desc: 'Alert when spending approaches budget limits' },
                  { key: 'collaboration', label: 'Collaboration updates', desc: 'When collaborators make changes to shared trips' },
                ].map(item => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-transparent dark:border-white/5">
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.desc}</p>
                    </div>
                    <button
                      onClick={() => setNotifications(n => ({ ...n, [item.key]: !n[item.key as keyof typeof n] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${notifications[item.key as keyof typeof notifications] ? 'bg-[#1e3a5f] dark:bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications[item.key as keyof typeof notifications] ? 'translate-x-5' : ''}`} />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="primary" className="mt-5" icon={<Save className="w-4 h-4" />} onClick={() => addToast({ type: 'success', title: 'Preferences saved!' })}>
                Save Preferences
              </Button>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">Security Settings</h2>
              <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="password" value={passwordForm.new} onChange={e => setPasswordForm(f => ({ ...f, new: e.target.value }))} placeholder="Min. 8 characters" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Confirm New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="password" value={passwordForm.confirm} onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))} placeholder="Repeat new password" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                    </div>
                  </div>
              </div>
              <Button variant="primary" className="mt-5" icon={<Lock className="w-4 h-4" />} onClick={handleUpdatePassword}>
                Update Password
              </Button>
            </div>
          )}

          {activeSection === 'preferences' && (
            <div className="bg-white dark:bg-[#0a1628] rounded-2xl border border-gray-100 dark:border-white/5 p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-5">App Preferences</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Currency</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option>USD - US Dollar</option>
                    <option>EUR - Euro</option>
                    <option>GBP - British Pound</option>
                    <option>JPY - Japanese Yen</option>
                    <option>PKR - Pakistani Rupee</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Language</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option>English</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>German</option>
                    <option>Urdu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Date Format</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 dark:bg-white/5 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-white/5 rounded-xl mt-4 border border-transparent dark:border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white dark:bg-[#1e3a5f] rounded-lg shadow-sm">
                      {user?.preferences.darkMode ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-gray-200 text-sm">Appearance</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{user?.preferences.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const newMode = !user!.preferences.darkMode;
                      localStorage.setItem('tripnest_theme', newMode ? 'dark' : 'light');
                      setUser({
                        ...user!,
                        preferences: { ...user!.preferences, darkMode: newMode }
                      });
                    }}
                    className={`relative w-11 h-6 rounded-full transition-colors ${user?.preferences.darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${user?.preferences.darkMode ? 'translate-x-5' : ''}`} />
                  </button>
                </div>
              </div>
              <Button variant="primary" className="mt-5" icon={<Save className="w-4 h-4" />} onClick={() => addToast({ type: 'success', title: 'Preferences saved!' })}>
                Save Preferences
              </Button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default ProfilePage;
