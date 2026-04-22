import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe, Eye, EyeOff, ArrowLeft, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { authService } from '../services/api';
import { useAppStore } from '../store/useAppStore';
import { Button } from '../components/ui';

// â”€â”€â”€ Shared Input â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const Field: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
      {label}
    </label>
    {children}
  </div>
);

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 ' +
  'bg-white dark:bg-[#0f2035] text-gray-900 dark:text-white ' +
  'placeholder:text-gray-400 dark:placeholder:text-gray-600 ' +
  'focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-transparent text-sm transition-all';

// â”€â”€â”€ Shared Auth Layout â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const AuthLayout: React.FC<{
  children: React.ReactNode;
  title: string;
  subtitle: string;
  image: string;
}> = ({ children, title, subtitle, image }) => (
  <div className="min-h-screen flex bg-white dark:bg-[#060e1a]">
    {/* Left Panel */}
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className="flex-1 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12"
    >
      <div className="max-w-md w-full mx-auto">
        {/* Back link */}
        <Link to="/" className="flex items-center gap-2 mb-10 group w-fit">
          <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            Back to home
          </span>
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-9 h-9 bg-[#1e3a5f] rounded-xl flex items-center justify-center shadow-lg">
            <Globe className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-display text-[#1e3a5f] dark:text-white">
            TripNest
          </span>
        </div>

        <h1 className="text-3xl font-bold font-display text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">{subtitle}</p>

        {children}
      </div>
    </motion.div>

    {/* Right Panel â€“ Image */}
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.1 }}
      className="hidden lg:block w-1/2 relative overflow-hidden"
    >
      <img src={image} alt="Travel" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0"
        style={{ background: 'linear-gradient(135deg, rgba(15,32,53,0.65) 0%, rgba(14,165,233,0.2) 100%)' }} />

      {/* Floating badge */}
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 right-10 bg-white/12 backdrop-blur-xl rounded-2xl px-4 py-3 flex items-center gap-2.5 border border-white/20"
      >
        <Sparkles className="w-4 h-4 text-[#f97316]" />
        <span className="text-white text-sm font-semibold">AI-Powered Planning</span>
      </motion.div>

      {/* Quote card */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-12 left-10 right-10 bg-white/12 backdrop-blur-xl rounded-2xl p-6 border border-white/20 shadow-2xl"
      >
        <p className="text-white font-semibold text-lg mb-2 leading-snug">
          "TripNest made planning our honeymoon an absolute joy."
        </p>
        <p className="text-white/60 text-sm">â€” Sophia &amp; Liam, Bali 2025</p>
      </motion.div>
    </motion.div>
  </div>
);

// â”€â”€â”€ Login Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const LoginPage: React.FC = () => {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPwd, setShowPwd]     = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const { setUser, addToast }     = useAppStore();
  const navigate                  = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { user } = await authService.login(email, password);
      const savedTheme = localStorage.getItem('tripnest_theme');
      if (savedTheme) user.preferences.darkMode = savedTheme === 'dark';
      setUser(user);
      addToast({ type: 'success', title: `Welcome back, ${user.name.split(' ')[0]}!` });
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue planning your adventures"
      image="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=900"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <Field label="Email address">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com" required className={inputCls} />
        </Field>

        <Field label="Password">
          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Your password" required
              className={`${inputCls} pr-12`} />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex justify-end mt-2">
            <Link to="/forgot-password"
              className="text-xs text-[#0ea5e9] hover:text-blue-700 font-semibold transition-colors">
              Forgot password?
            </Link>
          </div>
        </Field>

        <Button type="submit" variant="primary" loading={loading} className="w-full py-3.5 text-base">
          Sign In <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

        <div className="relative text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200 dark:border-white/10" />
          </div>
          <span className="relative bg-white dark:bg-[#060e1a] px-4 text-sm text-gray-400">
            or continue with
          </span>
        </div>

        <button type="button"
          className="w-full flex items-center justify-center gap-3 py-3 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-sm font-semibold text-gray-700 dark:text-gray-300">
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-4 h-4" />
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup"
            className="text-[#1e3a5f] dark:text-sky-400 font-bold hover:text-[#0ea5e9] transition-colors">
            Create one free
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

// â”€â”€â”€ Sign Up Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const SignupPage: React.FC = () => {
  const [form, setForm]       = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [agreed, setAgreed]   = useState(false);
  const { setUser, addToast } = useAppStore();
  const navigate              = useNavigate();

  const onChange = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
    if (!agreed) { setError('Please agree to the Terms of Service'); return; }
    setLoading(true);
    try {
      const { user } = await authService.register(form.name, form.email, form.password);
      setUser(user);
      addToast({ type: 'success', title: 'Account created!', message: 'Welcome to TripNest ðŸŽ‰' });
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start planning smarter trips for free"
      image="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-600 dark:text-red-400 text-sm"
          >
            {error}
          </motion.div>
        )}

        <Field label="Full name">
          <input type="text" value={form.name} onChange={onChange('name')}
            placeholder="Sarah Johnson" required className={inputCls} />
        </Field>

        <Field label="Email address">
          <input type="email" value={form.email} onChange={onChange('email')}
            placeholder="you@example.com" required className={inputCls} />
        </Field>

        <Field label="Password">
          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} value={form.password}
              onChange={onChange('password')} placeholder="Min. 8 characters"
              required minLength={8} className={`${inputCls} pr-12`} />
            <button type="button" onClick={() => setShowPwd(!showPwd)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors">
              {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </Field>

        <Field label="Confirm password">
          <input type="password" value={form.confirm} onChange={onChange('confirm')}
            placeholder="Repeat your password" required className={inputCls} />
        </Field>

        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)}
            className="mt-0.5 rounded accent-[#1e3a5f]" />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            I agree to the{' '}
            <Link to="/terms" className="text-[#1e3a5f] dark:text-sky-400 font-semibold hover:underline">Terms of Service</Link>
            {' '}and{' '}
            <Link to="/privacy" className="text-[#1e3a5f] dark:text-sky-400 font-semibold hover:underline">Privacy Policy</Link>
          </span>
        </label>

        <Button type="submit" variant="accent" loading={loading} className="w-full py-3.5 text-base">
          Create Free Account <ArrowRight className="w-4 h-4 ml-1" />
        </Button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login"
            className="text-[#1e3a5f] dark:text-sky-400 font-bold hover:text-[#0ea5e9] transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};
