import React, { useState, useId } from 'react';
import { motion } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAppStore } from '@/app/store';
import { DUMMY_USERS, DummyUser } from './dummyUsers';
import { FloatingInput } from './components/FloatingInput';
import { PasswordField } from './components/PasswordField';
import { RememberForgotRow } from './components/RememberForgotRow';
import { UiverseSubmitButton } from './components/UiverseSubmitButton';
import { GoogleAuthModal, GoogleUserProfile } from './components/GoogleAuthModal';

export const LoginForm: React.FC = () => {
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const { login, setCameraFocusTarget, setIsSuccess } = useAppStore();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 3;
  const isFormReady = isEmailValid && isPasswordValid;

  // Dynamic friendly microcopy
  const microcopy =
    status === 'success'
      ? 'Access granted · Welcome to the Master Hall'
      : isFormReady
      ? 'Credentials verified · Ready to enter'
      : isEmailValid
      ? 'Welcome back · Enter your access key'
      : 'Sign in to access your curated private collection';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation checks
    if (!email.trim() || !password.trim()) {
      setError('Please provide both your gallery email and password.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    if (!isEmailValid) {
      setError('Please enter a valid email address.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    if (password.length < 3) {
      setError('Password must contain at least 3 characters.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    setStatus('loading');
    setCameraFocusTarget('success');

    // Simulate authenticating against art vault
    setTimeout(() => {
      let matchedUser = DUMMY_USERS.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
      );

      let userToSave: DummyUser;

      if (!matchedUser) {
        userToSave = {
          id: Math.random(),
          name: email.split('@')[0].toUpperCase(),
          email: email.trim(),
          password: password,
          avatar: email.substring(0, 2).toUpperCase(),
          bgColor: 'bg-amber-600',
          stats: {
            totalViews: 3820,
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

      try {
        localStorage.setItem('user', JSON.stringify(userToSave));
      } catch (err) {
        console.error(err);
      }

      setIsSuccess(true);
      setStatus('success');

      setTimeout(() => {
        login(userToSave.email, userToSave.name, 'Patron', {
          avatar: userToSave.avatar,
          stats: userToSave.stats,
        });
      }, 700);
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setIsGoogleModalOpen(true);
  };

  const handleGoogleSuccess = (profile: GoogleUserProfile) => {
    setStatus('loading');
    setCameraFocusTarget('success');
    setIsSuccess(true);
    setTimeout(() => {
      setStatus('success');
      login(profile.email, profile.name, 'Patron', {
        avatar: profile.avatar || profile.name.slice(0, 2).toUpperCase(),
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
    }, 600);
  };

  return (
    <div className="w-full flex flex-col justify-center select-none text-left animate-fadeIn relative">
      {/* Dynamic friendly microcopy banner (desktop only to save vertical mobile space) */}
      <div className="mb-3.5 pl-0.5 hidden sm:block" aria-live="polite">
        <p className="text-xs sm:text-[12.5px] font-medium text-[#7D705C] transition-all duration-300">
          {microcopy}
        </p>
      </div>

      <form onSubmit={handleLogin} className="space-y-3.5" noValidate>
        {/* Floating Email Field with Reactive Icon */}
        <FloatingInput
          id={emailId}
          label="Email Address"
          type="email"
          value={email}
          onChange={(val) => {
            setEmail(val);
            if (error) setError('');
          }}
          isEmail
          isValid={isEmailValid}
          placeholder="patron@europeanmuseum.art"
          autoComplete="email"
          required
        />

        {/* Floating Password Field with Animated Lock and Eye Toggle */}
        <PasswordField
          id={passwordId}
          label="Password"
          value={password}
          onChange={(val) => {
            setPassword(val);
            if (error) setError('');
          }}
          minLength={3}
          autoComplete="current-password"
          required
        />

        {/* Remember Me and Forgot Password Row */}
        <RememberForgotRow
          rememberMe={rememberMe}
          onRememberChange={setRememberMe}
        />

        {/* Live Inline Error Message */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="p-3 bg-red-50/90 border-l-3 border-[#DC2626] rounded-xl text-xs text-[#991B1B] font-medium flex items-center gap-2 animate-fadeIn"
          >
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Kinetic Uiverse Submit Button for Sign In */}
        <div className="pt-1">
          <UiverseSubmitButton
            type="submit"
            status={status}
            icon={<LogIn className="w-4 h-4" />}
            loadingText="Verifying with Gallery…"
          >
            Sign In
          </UiverseSubmitButton>
        </div>
      </form>

      {/* Or Divider */}
      <div className="relative flex items-center justify-center my-4">
        <div className="border-t border-[#E8DFC8] w-full" />
        <span className="bg-[#FCFBF8] px-3 text-[10px] font-bold text-[#8C7D6B] uppercase tracking-[0.15em] whitespace-nowrap absolute">
          or continue with
        </span>
      </div>

      {/* Google Sign In Secondary Button */}
      <motion.button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={status === 'loading'}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.985 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        className="w-full h-[46px] flex items-center justify-center gap-2.5 px-4 bg-white hover:bg-[#FAF8F5] border border-[#C5A059]/30 hover:border-[#C5A059]/60 rounded-xl text-xs font-semibold text-[#171412] shadow-xs hover:shadow-sm cursor-pointer select-none"
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
      </motion.button>

      {/* Switch to Registration option */}
      <div className="mt-3 text-center hidden sm:block">
        <p className="text-xs text-[#7D705C]">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => login('guest@museum.art', 'Guest Visitor', 'Guest')}
            className="font-bold text-[#9E7A32] hover:text-[#C5A059] underline hover:no-underline cursor-pointer transition ml-0.5"
          >
            Join Us
          </button>
        </p>
      </div>

      {/* Trust Strip */}
      <div className="pt-2 text-center hidden sm:block">
        <p className="text-[11px] text-[#8C7D6B] font-medium tracking-tight">
          2,000+ verified artists · Authenticated originals · Secure vault
        </p>
      </div>
      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        formType="login"
      />
    </div>
  );
};

export default LoginForm;
