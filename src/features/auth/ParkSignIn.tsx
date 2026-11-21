import React, { useState, useId, useRef, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { LogIn } from 'lucide-react';
import { useAppStore } from '@/app/store';
import { DUMMY_USERS, DummyUser } from './dummyUsers';
import {
  TonalInput,
  PillButton,
  AnimatedCheckbox,
  SplitHeading,
} from './primitives';
import { GoogleAuthModal, GoogleUserProfile } from './components/GoogleAuthModal';
import { RotatingArtQuote } from './RotatingArtQuote';
import gsap from 'gsap';

// ── Staggered Cascade Entrance ──
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.10, delayChildren: 0.06 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.97, filter: 'blur(5px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', stiffness: 280, damping: 24, mass: 0.8 },
  },
};

export const ParkSignIn: React.FC = () => {
  const emailId = useId();
  const passwordId = useId();
  const formRef = useRef<HTMLDivElement>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const { login, setCameraFocusTarget, setIsSuccess } = useAppStore();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isPasswordValid = password.length >= 3;
  const isFormReady = isEmailValid && isPasswordValid;

  const microcopy =
    status === 'success'
      ? 'Access granted · Welcome to the Master Hall'
      : isFormReady
      ? 'Credentials verified · Ready to enter'
      : isEmailValid
      ? 'Welcome back · Enter your access key'
      : 'Sign in to access your curated private collection';

  // Parallax on form scroll
  useEffect(() => {
    const el = formRef.current;
    if (!el) return;
    const handleMouse = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      gsap.to(el, {
        rotateY: dx * 0.6,
        rotateX: -dy * 0.4,
        duration: 0.8,
        ease: 'power2.out',
        transformPerspective: 900,
      });
    };
    const handleLeave = () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' });
    };
    el.addEventListener('mousemove', handleMouse);
    el.addEventListener('mouseleave', handleLeave);
    return () => {
      el.removeEventListener('mousemove', handleMouse);
      el.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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

    setTimeout(() => {
      const matchedUser = DUMMY_USERS.find(
        (u) =>
          u.email.toLowerCase() === email.trim().toLowerCase() &&
          u.password === password
      );

      let userToSave: DummyUser;
      if (!matchedUser) {
        userToSave = {
          id: Math.random(),
          name: email.split('@')[0].toUpperCase(),
          email: email.trim(),
          password,
          avatar: email.substring(0, 2).toUpperCase(),
          bgColor: 'bg-amber-600',
          stats: {
            totalViews: 3820, totalSpent: 18600, itemsOwned: 41, collections: 12,
            viewsChange: 12, spentChange: 18, ownedChange: 8, collectionsChange: 3,
          },
        };
      } else {
        userToSave = matchedUser;
      }

      try { localStorage.setItem('user', JSON.stringify(userToSave)); }
      catch (err) { console.error(err); }

      setIsSuccess(true);
      setStatus('success');
      setTimeout(() => {
        login(userToSave.email, userToSave.name, 'Patron', {
          avatar: userToSave.avatar, stats: userToSave.stats,
        });
      }, 700);
    }, 600);
  };

  const handleGoogleSignIn = () => setIsGoogleModalOpen(true);

  const handleGoogleSuccess = (profile: GoogleUserProfile) => {
    setStatus('loading');
    setCameraFocusTarget('success');
    setIsSuccess(true);
    setTimeout(() => {
      setStatus('success');
      login(profile.email, profile.name, 'Patron', {
        avatar: profile.avatar || profile.name.slice(0, 2).toUpperCase(),
        stats: { totalViews: 4120, totalSpent: 19500, itemsOwned: 34, collections: 9,
          viewsChange: 14, spentChange: 20, ownedChange: 6, collectionsChange: 2 },
      });
    }, 600);
  };

  const handleSendReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (resetEmail.trim()) {
      setResetSent(true);
      setTimeout(() => {
        setResetSent(false);
        setShowForgotModal(false);
        setResetEmail('');
      }, 2500);
    }
  };

  return (
    <motion.div
      ref={formRef}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[370px] mx-auto text-left relative z-10 py-2 px-4 select-text"
      aria-label="Sign In to European Museum of Fine Art"
      style={{ willChange: 'transform', transformStyle: 'preserve-3d' }}
    >
      {/* ── Heading ── */}
      <motion.div variants={itemVariants} className="mb-2">
        <SplitHeading as="h2" subtitle={microcopy}>
          Welcome Back
        </SplitHeading>
      </motion.div>

      {/* ── Rotating Art Quote ── */}
      <motion.div variants={itemVariants} className="hidden sm:block mb-3 sm:mb-5">
        <RotatingArtQuote />
      </motion.div>

      {/* ── Form ── */}
      <form onSubmit={handleLogin} className="space-y-2 sm:space-y-3" noValidate>
        <motion.div variants={itemVariants}>
          <TonalInput
            id={emailId}
            label="Email Address"
            type="email"
            value={email}
            onChange={(val) => { setEmail(val); if (error) setError(''); }}
            icon="mail"
            isValid={isEmailValid}
            placeholder="patron@europeanmuseum.art"
            autoComplete="email"
            required
            onFocus={() => setCameraFocusTarget('email')}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <TonalInput
            id={passwordId}
            label="Password"
            type="password"
            value={password}
            onChange={(val) => { setPassword(val); if (error) setError(''); }}
            icon="lock"
            showPasswordToggle
            minLength={3}
            autoComplete="current-password"
            required
            onFocus={() => setCameraFocusTarget('password')}
          />
        </motion.div>

        {/* Remember / Forgot */}
        <motion.div
          variants={itemVariants}
          className="flex items-center justify-between pt-0.5 select-none"
        >
          <AnimatedCheckbox
            checked={rememberMe}
            onChange={setRememberMe}
            label={
              <span
                className="text-[12.5px] font-medium text-[#2E2419] tracking-normal"
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                Remember me
              </span>
            }
            ariaLabel="Remember me"
          />
          <button
            type="button"
            onClick={() => setShowForgotModal(true)}
            className="text-[12.5px] font-medium text-[#7C5E1A] hover:text-[#B8871E] transition-colors relative group py-0.5 cursor-pointer"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <span>Forgot password?</span>
            <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-[#B8871E] transition-all duration-200 group-hover:w-full" />
          </button>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              role="alert"
              aria-live="polite"
              initial={{ opacity: 0, y: -4, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -4, height: 0 }}
              className="p-2.5 rounded-[10px] text-xs font-semibold flex items-center gap-2 bg-red-50 border border-red-300 text-red-700"
            >
              <span aria-hidden="true" className="text-red-500 font-bold">⚠</span>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit */}
        <motion.div variants={itemVariants} className="pt-1 sm:pt-2.5">
          <PillButton
            type="submit"
            status={status}
            loadingText="Verifying…"
            successText="Access Granted"
            variant="primary"
          >
            Sign In
          </PillButton>
        </motion.div>
      </form>

      {/* ── Divider ── */}
      <motion.div
        variants={itemVariants}
        className="flex items-center gap-3 my-2.5 sm:my-4"
      >
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4A70E]/35 to-[#D4A70E]/35" />
        <span
          className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#6E5A44] whitespace-nowrap select-none"
          style={{ fontFamily: "'Tenor Sans', 'Plus Jakarta Sans', sans-serif" }}
        >
          or continue with
        </span>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#D4A70E]/35 to-[#D4A70E]/35" />
      </motion.div>

      {/* ── Google Button ── */}
      <motion.div variants={itemVariants}>
        <PillButton
          type="button"
          onClick={handleGoogleSignIn}
          disabled={status === 'loading'}
          variant="secondary"
          icon={
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
          }
        >
          Sign in with Google
        </PillButton>
      </motion.div>

      {/* ── Trust Strip ── */}
      <motion.div variants={itemVariants} className="pt-3 sm:pt-4 text-center hidden sm:block">
        <p
          className="text-[11px] font-medium tracking-[0.06em] text-[#6E5C47]"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          2,000+ verified artists · Authenticated originals · Secure vault
        </p>
      </motion.div>

      {/* ── Forgot Password Dialog ── */}
      <AnimatePresence>
        {showForgotModal && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="forgot-pwd-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/55 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className="bg-[#FFFFFF] border border-[#E8DFC8] rounded-[16px] p-5 max-w-sm w-full shadow-2xl relative text-left"
            >
              <h3
                id="forgot-pwd-title"
                className="text-base font-bold text-[#171412]"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                Account Recovery
              </h3>
              <p className="text-xs text-[#6E6352] mt-1 leading-relaxed">
                Enter your fine art account email to receive a secure recovery key.
              </p>

              {resetSent ? (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 p-2.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 font-medium"
                >
                  ✓ Recovery link sent to your email. Check your inbox!
                </motion.div>
              ) : (
                <form onSubmit={handleSendReset} className="mt-3 space-y-2.5">
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="name@europeanmuseum.art"
                    className="w-full px-3 py-2 bg-[#FAF7F0] border border-[#E8DFC8] rounded-[10px] text-xs text-[#171412] outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-[#6E6352] hover:text-[#171412] transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 text-xs font-bold bg-[#F5C518] text-[#0A0803] rounded-full shadow-sm hover:bg-[#E5A91C] transition cursor-pointer"
                    >
                      Send Recovery Link
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        formType="login"
      />
    </motion.div>
  );
};

export default ParkSignIn;
