import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
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

  const { login, setCameraFocusTarget, setIsSuccess } = useAppStore();

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

  const handleGoogleSignIn = () => {
    setLoading(true);
    setTimeout(() => {
      login('artlover@gmail.com', 'Google Patron', 'Patron', {
        avatar: 'GP',
        stats: {
          totalViews: 4120,
          totalSpent: 19500,
          itemsOwned: 34,
          collections: 9,
          viewsChange: 14,
          spentChange: 20,
          ownedChange: 6,
          collectionsChange: 2,
        },
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      <form onSubmit={handleLogin} className="space-y-3.5">
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

        {/* Remember Me & Forgot Password Row */}
        <div className="flex items-center justify-between text-xs pt-0.5">
          <label className="flex items-center gap-1.5 cursor-pointer text-amber-900/80 hover:text-amber-950 select-none">
            <input
              type="checkbox"
              defaultChecked
              className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 accent-amber-600 cursor-pointer"
            />
            <span>Remember me</span>
          </label>
          <a
            href="#forgot-password"
            className="text-amber-700 hover:text-amber-900 hover:underline transition font-medium"
          >
            Forgot password?
          </a>
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
          className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-2.5 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-60 text-sm cursor-pointer"
        >
          <LogIn className="w-4 h-4" />
          {loading ? 'Signing In...' : 'Sign In'}
        </motion.button>
      </form>

      {/* Or Continue With Divider */}
      <div className="relative flex items-center justify-center my-3">
        <div className="border-t border-amber-200/80 w-full" />
        <span className="bg-white/90 px-3 text-[11px] font-medium text-amber-800/70 uppercase tracking-wider whitespace-nowrap absolute">
          or continue with
        </span>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs font-semibold text-amber-950 transition-all duration-200 shadow-xs cursor-pointer active:scale-[0.99]"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Sign in with Google</span>
      </button>

      {/* Trust Strip */}
      <div className="pt-2 text-center">
        <p className="text-[11px] text-amber-800/70 font-medium tracking-tight">
          2,000+ artists · Verified originals · Secure checkout
        </p>
      </div>
    </div>
  );
};
