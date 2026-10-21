import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/app/store';
import { DUMMY_USERS, DummyUser } from './dummyUsers';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, setAuthMode, setCameraFocusTarget, setIsSuccess } = useAppStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setCameraFocusTarget('success');

    // Simulate API delay
    setTimeout(() => {
      // Check if email and password are not empty
      if (email.trim() === '' || password.trim() === '') {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      // Check if email format is valid
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Check if password is at least 3 characters
      if (password.length < 3) {
        setError('Password must be at least 3 characters');
        setLoading(false);
        return;
      }

      // Try to find user in DUMMY_USERS first
      let matchedUser = DUMMY_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      let userToSave: DummyUser;

      if (!matchedUser) {
        // If not found in DUMMY_USERS, create a new patron user with entered credentials
        userToSave = {
          id: Math.random(),
          name: email.split('@')[0].toUpperCase(),
          email: email.trim(),
          password: password,
          avatar: email.substring(0, 2).toUpperCase(),
          bgColor: 'bg-amber-600',
          stats: {
            totalViews: 3640,
            totalSpent: 18600,
            itemsOwned: 41,
            collections: 12,
            viewsChange: 12,
            spentChange: 18,
            ownedChange: 8,
            collectionsChange: 3,
          },
        };
      } else {
        userToSave = matchedUser;
      }

      // Save user session
      try {
        localStorage.setItem('user', JSON.stringify(userToSave));
      } catch (err) {
        console.error(err);
      }

      setIsSuccess(true);
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6, x: 0.25 },
        colors: ['#D4AF37', '#B88D22', '#F5EEDB', '#8C6D1F'],
      });

      setTimeout(() => {
        login(userToSave.email, userToSave.name, 'Patron', {
          avatar: userToSave.avatar,
          stats: userToSave.stats,
        });
        setLoading(false);
      }, 700);
    }, 500);
  };

  return (
    <div className="w-full space-y-5 animate-fadeIn">
      {/* Switch to Register tab / pill */}
      <div className="flex items-center justify-between p-1 bg-amber-50/80 rounded-xl border border-amber-200/60 mb-1">
        <button
          type="button"
          onClick={() => setAuthMode('register')}
          className="flex-1 py-2 text-xs font-semibold rounded-lg text-amber-800 hover:text-amber-950 hover:bg-white/60 transition-all text-center cursor-pointer"
        >
          Join Us (Register)
        </button>
        <button
          type="button"
          className="flex-1 py-2 text-xs font-bold rounded-lg bg-white text-amber-900 shadow-sm border border-amber-200/80 text-center"
        >
          Sign In
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-600 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setCameraFocusTarget('email')}
              placeholder="arsh@example.com"
              required
              className="w-full pl-10 pr-4 py-2.5 bg-white/90 border border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition text-amber-950 placeholder-amber-400 text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-amber-600 pointer-events-none" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setCameraFocusTarget('password')}
              placeholder="••••••••"
              required
              className="w-full pl-10 pr-11 py-2.5 bg-white/90 border border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition text-amber-950 placeholder-amber-400 text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute right-3.5 top-3 text-amber-600 hover:text-amber-800 p-0.5 rounded transition cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg text-xs text-red-700 font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Login Button */}
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 text-sm cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'Signing In...' : 'Sign In'}
        </motion.button>

        {/* Toggle to Register */}
        <div className="text-center pt-2">
          <p className="text-xs text-amber-900/80">
            New here?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('register')}
              className="font-bold text-amber-700 hover:text-amber-900 underline ml-1 inline-flex items-center gap-1 cursor-pointer transition"
            >
              JOIN US <ArrowRight className="w-3 h-3" />
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
