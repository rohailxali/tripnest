import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail]       = useState('');
  const [loading, setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      <div className="w-full max-w-md" style={{ animation: 'fadeUp 0.5s ease-out' }}>
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 bg-[#1e3a5f] rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-[#1e3a5f]">TripNest</span>
          </div>

          {!submitted ? (
            <>
              <h1 className="text-2xl font-bold font-display text-gray-900 mb-2">Forgot your password?</h1>
              <p className="text-gray-500 text-sm mb-8">
                No worries! Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all"
                    />
                  </div>
                </div>

                <Button type="submit" variant="primary" loading={loading} className="w-full py-3.5 text-base">
                  Send Reset Link
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold font-display text-gray-900 mb-2">Check your inbox</h2>
              <p className="text-gray-500 text-sm mb-2">
                We sent a password reset link to
              </p>
              <p className="font-bold text-gray-800 text-sm mb-6">{email}</p>
              <p className="text-gray-400 text-xs">
                Didn't get it? Check your spam folder, or{' '}
                <button
                  onClick={() => { setSubmitted(false); setEmail(''); }}
                  className="text-[#0ea5e9] font-semibold hover:text-blue-700 transition-colors"
                >
                  try again
                </button>
              </p>
            </div>
          )}

          {/* Back to login */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
