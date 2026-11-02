import React, { useState, useMemo, useId } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Calendar,
  Share2,
  UserPlus,
} from 'lucide-react';
import { useAppStore } from '@/app/store';
import { CaptchaWidget } from './CaptchaWidget';
import { ART_TYPES, COUNTRIES, COUNTRY_CODES } from './dummyUsers';
import {
  TonalInput,
  PillButton,
  PillChip,
  TonalSelect,
  AnimatedCheckbox,
  SplitHeading,
} from './primitives';
import { ProgressRail } from './components/ProgressRail';
import { GoogleAuthModal, GoogleUserProfile } from './components/GoogleAuthModal';

// ── Playful Framer Motion Staggered Incoming Cascade ──
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(3px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 340,
      damping: 24,
    },
  },
};

export const MuseumJoinUs: React.FC = () => {
  const { login, logout } = useAppStore();

  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const mobileId = useId();

  // Registration form state — exact original variables
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [mobile, setMobile] = useState('');
  const [userType, setUserType] = useState<'collector' | 'artist' | ''>('');
  const [artTypes, setArtTypes] = useState<string[]>([]);
  const [country, setCountry] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [regError, setRegError] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  // Confirmed pass state
  const [isRegistered, setIsRegistered] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const passNumber = useMemo(() => Math.floor(100000 + Math.random() * 900000), []);

  // Single-line password strength evaluator
  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: '', barColor: '' };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak password', color: 'text-amber-700', barColor: 'bg-amber-500' };
      case 2:
        return { score: 2, label: 'Fair password', color: 'text-amber-600', barColor: 'bg-amber-400' };
      case 3:
        return { score: 3, label: 'Good password', color: 'text-[#9E7A32]', barColor: 'bg-[#D4A70E]' };
      case 4:
        return { score: 4, label: 'Strong vault cipher', color: 'text-emerald-700', barColor: 'bg-emerald-500' };
      default:
        return { score: 1, label: 'Too short (min 6 chars)', color: 'text-red-600', barColor: 'bg-red-400' };
    }
  }, [password]);

  // Progressive Disclosure checks — exact original validation rules
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const isRow1Filled = fullName.trim().length >= 3 && isEmailValid;
  const isRow2Filled = isRow1Filled && password.length >= 6 && mobile.trim().length === 10;
  const isRoleFilled =
    isRow2Filled &&
    (userType === 'collector' ||
      (userType === 'artist' && artTypes.length > 0 && country.trim().length > 0));

  // Current step for progress rail (1 to 4)
  const currentStep = !isRow1Filled ? 1 : !isRow2Filled ? 2 : !isRoleFilled ? 3 : 4;

  const handleArtTypeToggle = (type: string) => {
    if (artTypes.includes(type)) {
      setArtTypes(artTypes.filter((t) => t !== type));
    } else {
      setArtTypes([...artTypes, type]);
    }
  };

  const handleGoogleSignUp = () => {
    setIsGoogleModalOpen(true);
  };

  const handleGoogleSuccess = (profile: GoogleUserProfile) => {
    setFullName(profile.name);
    setEmail(profile.email);
    const role = userType || 'collector';
    setUserType(role);
    setStatus('loading');
    setTimeout(() => {
      login(profile.email, profile.name, role === 'artist' ? 'Curator' : 'Patron', {
        role,
        avatar: profile.avatar || profile.name.slice(0, 2).toUpperCase(),
      });
      setStatus('success');
      setIsRegistered(true);
    }, 600);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');

    if (fullName.trim().length < 3) {
      setRegError('Name must contain at least 3 letters.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    if (!isEmailValid) {
      setRegError('Please enter a valid email address.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    if (password.length < 6) {
      setRegError('Password must contain at least 6 characters.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    if (!mobile || mobile.length < 10) {
      setRegError('Please enter a valid 10-digit mobile number.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    if (!userType) {
      setRegError('Please select whether you are a Collector or an Artist.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    if (userType === 'artist') {
      if (artTypes.length === 0) {
        setRegError('Please select at least one art specialty.');
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
        return;
      }
      if (!country) {
        setRegError('Please select your country of residence.');
        setStatus('error');
        setTimeout(() => setStatus('idle'), 2000);
        return;
      }
    }

    if (!captchaVerified) {
      setCaptchaError(true);
      setRegError('Please complete the captcha verification.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    if (!acceptedTerms) {
      setRegError('Please accept the Terms of Exhibition and Privacy Policy.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
      return;
    }

    setStatus('loading');

    setTimeout(() => {
      login(email.trim(), fullName.trim(), userType === 'artist' ? 'Curator' : 'Patron', {
        role: userType,
      });
      setStatus('success');
      setIsRegistered(true);
    }, 600);
  };

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(`MUSEUM-PASS-#${passNumber}-${fullName || 'PATRON'}`);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full max-w-[480px] mx-auto text-left relative z-10 pt-8 sm:pt-3 pb-8 sm:pb-24 px-3 sm:px-5 select-text"
      aria-label="Exhibition Registration and Authentication"
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
    >
      {!isRegistered ? (
        <div>
          {/* ── Luxury Company Brand Header ── */}
          <motion.a
            className="group inline-flex items-center gap-2.5 sm:gap-3 no-underline mb-2 sm:mb-3.5 flex-shrink-0"
            aria-label="Zigguratss Artwork LLP home"
            href="/"
            variants={itemVariants}
          >
            <div className="relative flex-shrink-0">
              <img
                src="/zigguratss-logo.png"
                alt="Zigguratss Artwork LLP logo"
                className="w-7 h-7 sm:w-10 sm:h-10 object-contain drop-shadow-[0_3px_12px_rgba(229,169,28,0.30)]"
              />
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full border border-[#D4A70E]/40 pointer-events-none"
                style={{ transform: 'scale(1.2)' }}
              />
            </div>
            <div className="flex flex-col text-left leading-none">
              <span
                className="uppercase text-[#140F0A] tracking-[0.20em] leading-none"
                style={{
                  fontFamily: "'DM Serif Display', 'Bodoni Moda', 'Italiana', Georgia, serif",
                  fontSize: 'clamp(15px, 3.2vw, 21px)',
                  fontWeight: 400,
                  letterSpacing: '0.18em',
                }}
              >
                Zigguratss
              </span>
              <span
                className="mt-1 leading-none text-[#9E7A32]"
                style={{
                  fontFamily: "'Cinzel', sans-serif",
                  fontSize: '7.5px',
                  fontWeight: 700,
                  letterSpacing: '0.36em',
                  textTransform: 'uppercase',
                }}
              >
                Artwork LLP
              </span>
            </div>
          </motion.a>

          {/* ── Brand & Kinetic Heading ── */}
          <motion.div variants={itemVariants} className="mb-2 sm:mb-3">
            <SplitHeading
              as="h1"
              subtitle="European Museum of Fine Art · Curatorial Access"
            >
              Join Us
            </SplitHeading>
          </motion.div>

          {/* Progress Rail */}
          <motion.div variants={itemVariants} className="mb-2 sm:mb-3">
            <ProgressRail
              currentStep={currentStep}
              totalSteps={4}
              stepLabels={['Identity', 'Security', 'Membership', 'Access Pass']}
            />
          </motion.div>

          <form onSubmit={handleRegisterSubmit} noValidate className="space-y-2 sm:space-y-2.5">
            {/* ── STEP 1: Full Name & Email Address ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
              <motion.div variants={itemVariants}>
                <TonalInput
                  id={nameId}
                  label="Full Name"
                  value={fullName}
                  onChange={(val) => {
                    setFullName(val);
                    if (regError) setRegError('');
                  }}
                  icon="user"
                  isValid={fullName.trim().length >= 3}
                  hint={
                    fullName.trim().length >= 3
                      ? `Welcome, ${fullName.trim().split(' ')[0]}`
                      : undefined
                  }
                  placeholder="Arsh Deep"
                  required
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <TonalInput
                  id={emailId}
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(val) => {
                    setEmail(val);
                    if (regError) setRegError('');
                  }}
                  icon="mail"
                  isValid={isEmailValid}
                  placeholder="patron@europeanmuseum.art"
                  required
                />
              </motion.div>
            </div>

            {/* ── STEP 2: Password & Mobile (2 Dedicated Rows, 1-Line Strength Indicator) ── */}
            <AnimatePresence>
              {isRow1Filled && (
                <motion.div
                  initial={{ opacity: 0, y: -14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                  className="space-y-2 sm:space-y-2.5 pt-0.5 relative z-10"
                >
                  {/* Row 1: Password with One-Line Strength Indicator */}
                  <div className="space-y-1.5">
                    <TonalInput
                      id={passwordId}
                      label="Password"
                      type="password"
                      value={password}
                      onChange={(val) => {
                        setPassword(val);
                        if (regError) setRegError('');
                      }}
                      icon="lock"
                      showPasswordToggle
                      isValid={password.length >= 6}
                      minLength={6}
                      required
                    />

                    {/* Single-line password strength indicator */}
                    {password.length > 0 && (
                      <div className="flex items-center gap-2 px-1 select-none">
                        <div className="flex gap-1 flex-1 h-[3.5px]">
                          {[1, 2, 3, 4].map((step) => (
                            <div
                              key={step}
                              className={`flex-1 h-full rounded-full transition-all duration-300 ${
                                passwordStrength.score >= step
                                  ? passwordStrength.barColor
                                  : 'bg-[#171412]/10'
                              }`}
                            />
                          ))}
                        </div>
                        <span
                          className={`text-[11px] font-semibold whitespace-nowrap leading-none ${passwordStrength.color}`}
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                        >
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Row 2: Mobile Number with Country Code Dropdown */}
                  <div className="flex gap-2 items-start">
                    <div className="w-[96px] sm:w-[105px] flex-shrink-0">
                      <TonalSelect
                        value={countryCode}
                        onChange={setCountryCode}
                        options={COUNTRY_CODES.map((c) => ({
                          value: c.code,
                          label: `${c.code} · ${c.name}`,
                        }))}
                      />
                    </div>

                    <div className="flex-1">
                      <TonalInput
                        id={mobileId}
                        label="Mobile Number"
                        type="tel"
                        value={mobile}
                        onChange={(val) => {
                          const cleaned = val.replace(/\D/g, '').slice(0, 10);
                          setMobile(cleaned);
                          if (regError) setRegError('');
                        }}
                        icon="phone"
                        isValid={mobile.length === 10}
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── STEP 3: Patron / Artist Role Cards (Spring Stagger) ── */}
            <AnimatePresence>
              {isRow2Filled && (
                <motion.div
                  initial={{ opacity: 0, y: -14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                  className="pt-1 space-y-2 relative z-30"
                >
                  <span className="block text-[11.5px] font-semibold uppercase tracking-wider text-[#5C4A33] pl-1">
                    Select Your Gallery Membership <span className="text-[#C5A059]">*</span>
                  </span>

                  <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
                    <PillChip
                      variant="card"
                      role="radio"
                      selected={userType === 'collector'}
                      onToggle={() => {
                        setUserType('collector');
                        if (regError) setRegError('');
                      }}
                      icon="🖼️"
                      label="Art Lover / Collector"
                      subtitle="Discover and own fine art"
                    />

                    <PillChip
                      variant="card"
                      role="radio"
                      selected={userType === 'artist'}
                      onToggle={() => {
                        setUserType('artist');
                        if (regError) setRegError('');
                      }}
                      icon="🎨"
                      label="Artist"
                      subtitle="Share your creative work"
                    />
                  </div>

                  {/* Artist Specialty Chips & Country Select */}
                  {userType === 'artist' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.96, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                      className="p-2.5 sm:p-3.5 rounded-[13px] space-y-2 bg-white/75 backdrop-blur-md border border-[rgba(200,165,100,0.30)] shadow-[0_2px_10px_rgba(200,160,50,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] relative z-40"
                    >
                      <div>
                        <span
                          className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-[#5C4A33] mb-1.5 pl-1"
                          style={{ fontFamily: "'Tenor Sans', sans-serif" }}
                        >
                          Your Art Specialties
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {ART_TYPES.map((specialty) => (
                            <PillChip
                              key={specialty}
                              variant="pill"
                              selected={artTypes.includes(specialty)}
                              onToggle={() => handleArtTypeToggle(specialty)}
                              label={specialty}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Country Select with Type-To-Search positioned ABOVE the field */}
                      <TonalSelect
                        label="Country of Origin *"
                        value={country}
                        onChange={(val) => {
                          setCountry(val);
                          if (regError) setRegError('');
                        }}
                        options={COUNTRIES}
                        placeholder="Select or type your country…"
                        searchable
                        menuPosition="above"
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── STEP 4: Captcha & Terms (Spring Drop) ── */}
            <AnimatePresence>
              {isRoleFilled && (
                <motion.div
                  initial={{ opacity: 0, y: -14, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 24 }}
                  className="space-y-2 pt-1"
                >
                  {/* Captcha Widget Container */}
                  <div className="flex flex-col items-center p-2 rounded-[13px] bg-white/75 backdrop-blur-md border border-[rgba(200,165,100,0.30)] shadow-[0_2px_10px_rgba(200,160,50,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)]">
                    <CaptchaWidget
                      verified={captchaVerified}
                      onChange={(verified: boolean) => {
                        setCaptchaVerified(verified);
                        setCaptchaError(!verified);
                      }}
                      hasError={captchaError}
                    />
                  </div>

                  {/* Terms Checkbox */}
                  <div className="pl-1 pt-0.5">
                    <AnimatedCheckbox
                      checked={acceptedTerms}
                      onChange={setAcceptedTerms}
                      ariaLabel="Agree to Terms of Exhibition and Curatorial Privacy Policy"
                      label={
                        <span className="text-[12px] font-medium text-[#2E2419]">
                          I agree to the{' '}
                          <a
                            href="#terms"
                            className="text-[#7C5E1A] underline font-semibold hover:text-[#B8871E] underline-offset-2"
                          >
                            Terms of Exhibition
                          </a>{' '}
                          and{' '}
                          <a
                            href="#privacy"
                            className="text-[#7C5E1A] underline font-semibold hover:text-[#B8871E] underline-offset-2"
                          >
                            Curatorial Privacy Policy
                          </a>
                          .
                        </span>
                      }
                    />
                  </div>

                  {/* Error Message */}
                  {regError && (
                    <motion.div
                      role="alert"
                      aria-live="polite"
                      initial={{ opacity: 0, y: -3 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-2.5 bg-red-50 border border-red-300 rounded-[10px] text-xs text-red-700 font-semibold flex items-center gap-2"
                    >
                      <span className="text-red-500 font-bold">⚠</span>
                      <span>{regError}</span>
                    </motion.div>
                  )}

                  {/* Refined Small Pill Submit Button */}
                  <div className="pt-2 sm:pt-2.5">
                    <PillButton
                      type="submit"
                      status={status}
                      loadingText="Entering…"
                      successText="Pass Verified"
                      variant="primary"
                    >
                      Join Us
                    </PillButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider & Google OAuth */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 my-4 sm:my-5">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#D4A70E]/35 to-[#D4A70E]/35" />
              <span
                className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-[#6E5A44] whitespace-nowrap select-none bg-transparent"
                style={{ fontFamily: "'Tenor Sans', 'Plus Jakarta Sans', sans-serif" }}
              >
                or continue with
              </span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent via-[#D4A70E]/35 to-[#D4A70E]/35" />
            </motion.div>

            <motion.div variants={itemVariants}>
              <PillButton
                type="button"
                onClick={handleGoogleSignUp}
                disabled={status === 'loading'}
                variant="secondary"
                icon={
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
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
                }
              >
                Sign up with Google
              </PillButton>
            </motion.div>
          </form>
        </div>
      ) : (
        /* ── PASS CONFIRMED / VERIFIED SUCCESS STATE ── */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="space-y-3 text-center py-2"
        >
          <div className="w-12 h-12 rounded-full bg-[#FFF9E6] border border-[#D4A70E]/40 flex items-center justify-center mx-auto text-[#9E7A32] shadow-sm">
            <CheckCircle2 size={28} className="stroke-[2.5]" />
          </div>

          <div>
            <span
              className="text-[10px] tracking-[0.22em] uppercase text-[#9E7A32] font-bold"
              style={{ fontFamily: "'Cinzel', serif" }}
            >
              Pass Confirmed · Verified
            </span>
            <h2
              className="text-2xl font-bold tracking-tight text-[#171412] mt-1"
              style={{ fontFamily: "'Cinzel', 'Plus Jakarta Sans', serif" }}
            >
              Welcome, {fullName || 'Patron'}
            </h2>
            <p className="text-xs text-[#6E6352] mt-1 italic">
              You have received honorary access as an{' '}
              <strong className="text-[#9E7A32] not-italic font-semibold">
                {userType === 'artist' ? 'Resident Fine Artist' : 'Curatorial Patron'}
              </strong>
              .
            </p>
          </div>

          {/* Commemorative Pass Card */}
          <div className="rounded-[14px] bg-[#FFFFFF] p-3.5 text-left border border-[#E8DFC8] shadow-xs space-y-2 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-2">
              <div className="flex items-center gap-1.5">
                <Landmark size={14} className="text-[#9E7A32]" />
                <span className="text-[10px] uppercase tracking-wider text-[#171412] font-bold">
                  The Living Gallery · Master Hall
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-semibold">
                <ShieldCheck size={12} />
                <span>Authenticated</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div>
                <div className="text-[9.5px] text-[#8C7D68] uppercase">Patron Pass #</div>
                <div className="font-mono font-bold text-xs sm:text-sm text-[#9E7A32]">
                  EUR-{passNumber}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[9.5px] text-[#8C7D68] uppercase">Valid Through</div>
                <div className="font-semibold text-[#171412] flex items-center gap-1 justify-end">
                  <Calendar size={12} className="text-[#9E7A32]" />
                  <span>2026 – Permanent</span>
                </div>
              </div>
            </div>

            <div className="pt-1.5 border-t border-[#E8DFC8] flex items-center justify-between text-[10.5px]">
              <span className="text-[#8C7D68]">Curatorial Society Access</span>
              <button
                type="button"
                onClick={handleCopyCode}
                className="text-[#9E7A32] hover:text-[#C5A059] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Share2 size={12} />
                <span>{isCopied ? 'Pass Copied!' : 'Copy Pass Token'}</span>
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsRegistered(false);
              setFullName('');
              setEmail('');
              setPassword('');
              setMobile('');
              setUserType('');
              setArtTypes([]);
              setCountry('');
              setCaptchaVerified(false);
              setAcceptedTerms(false);
              setRegError('');
              setStatus('idle');
            }}
            className="text-xs text-[#9E7A32] hover:text-[#C5A059] hover:underline cursor-pointer font-semibold mt-2"
          >
            Register Another Patron Account
          </button>
        </motion.div>
      )}

      {/* Google Authentication Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        onSuccess={handleGoogleSuccess}
        formType="register"
      />
    </motion.div>
  );
};

export default MuseumJoinUs;
