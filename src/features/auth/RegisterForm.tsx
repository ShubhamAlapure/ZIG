import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Phone, Eye, EyeOff, Sparkles, LogIn, ChevronDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAppStore } from '@/app/store';
import { CaptchaWidget } from './CaptchaWidget';
import { COUNTRY_CODES, ART_TYPES, COUNTRIES, DUMMY_USERS, DummyUser } from './dummyUsers';
import { TickCheckbox } from './components/TickCheckbox';
import { UiverseSubmitButton } from './components/UiverseSubmitButton';

export const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [isCcOpen, setIsCcOpen] = useState(false);
  const [mobile, setMobile] = useState('');
  const [role, setRole] = useState<'collector' | 'artist' | ''>('');
  const [artTypes, setArtTypes] = useState<string[]>([]);
  const [country, setCountry] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaError, setCaptchaError] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, setAuthMode, setCameraFocusTarget, setIsSuccess } = useAppStore();

  const handleArtTypeToggle = (type: string) => {
    if (artTypes.includes(type)) {
      setArtTypes(artTypes.filter((t) => t !== type));
    } else {
      setArtTypes([...artTypes, type]);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validations matching user requirements
    if (name.trim().length < 3) {
      setError('Name must be at least 3 letters.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!mobile || mobile.length < 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!role) {
      setError('Please select whether you are an Art Lover / Collector or an Artist.');
      return;
    }

    if (role === 'artist') {
      if (artTypes.length === 0) {
        setError('Please select at least one art specialty.');
        return;
      }
      if (!country) {
        setError('Please select your country.');
        return;
      }
    }

    if (!captchaVerified) {
      setCaptchaError(true);
      setError('Please complete the captcha verification.');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);
    setCameraFocusTarget('success');

    setTimeout(() => {
      const newUser: DummyUser = {
        id: Date.now(),
        name: name.trim(),
        email: email.trim(),
        password,
        mobile: `${countryCode} ${mobile}`,
        role,
        artTypes,
        country: role === 'artist' ? country : 'Global',
        avatar: name.trim().substring(0, 2).toUpperCase(),
        bgColor: role === 'artist' ? 'bg-amber-600' : 'bg-yellow-600',
        stats: {
          totalViews: 120,
          totalSpent: 0,
          itemsOwned: role === 'artist' ? 12 : 1,
          collections: 1,
          viewsChange: 100,
          spentChange: 0,
          ownedChange: 1,
          collectionsChange: 1,
        },
      };

      try {
        localStorage.setItem('user', JSON.stringify(newUser));
        DUMMY_USERS.unshift(newUser);
      } catch (err) {
        console.error(err);
      }

      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6, x: 0.25 },
        colors: ['#D4AF37', '#E8D5A0', '#8C6D1F', '#2C1D13'],
      });

      setTimeout(() => {
        login(newUser.email, newUser.name, role === 'artist' ? 'Curator' : 'Patron', {
          avatar: newUser.avatar,
          stats: newUser.stats,
          role: newUser.role,
        });
        setLoading(false);
      }, 700);
    }, 600);
  };

  return (
    <div className="w-full space-y-4 animate-fadeIn">
      {/* Switch to Login / Register Tab Pill */}
      <div className="flex items-center justify-between p-1 bg-amber-50/80 rounded-xl border border-amber-200/60 mb-2">
        <button
          type="button"
          className="flex-1 py-2 text-xs font-bold rounded-lg bg-white text-amber-900 shadow-sm border border-amber-200/80 text-center"
        >
          Join Us
        </button>
        <button
          type="button"
          onClick={() => setAuthMode('login')}
          className="flex-1 py-2 text-xs font-semibold rounded-lg text-amber-800 hover:text-amber-950 hover:bg-white/60 transition-all text-center"
        >
          Sign In
        </button>
      </div>

      <form onSubmit={handleRegister} className="space-y-3.5">
        {/* Row 1: Full Name & Email Address (2 in a row) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 w-3.5 h-3.5 text-amber-600 pointer-events-none" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onFocus={() => setCameraFocusTarget('name')}
                placeholder="Arsh Deep"
                required
                className="w-full pl-8 pr-3 py-2 bg-white/90 border border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition text-amber-950 placeholder-amber-400 text-xs sm:text-sm"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-3.5 h-3.5 text-amber-600 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setCameraFocusTarget('email')}
                placeholder="artist@zigguratss.com"
                required
                className="w-full pl-8 pr-3 py-2 bg-white/90 border border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition text-amber-950 placeholder-amber-400 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Row 2: Password & Mobile (2 in a row) */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
          {/* Password */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-3.5 h-3.5 text-amber-600 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setCameraFocusTarget('password')}
                placeholder="Password"
                required
                className="w-full pl-8 pr-8 py-2 bg-white/90 border border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition text-amber-950 placeholder-amber-400 text-xs sm:text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-2.5 text-amber-600 hover:text-amber-800 p-0.5 rounded transition"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Mobile Number with Country Code Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950 mb-1">
              Mobile Number
            </label>
            <div className="flex gap-1.5 relative">
              {/* Country Code Button */}
              <div className="relative w-16 sm:w-20 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsCcOpen(!isCcOpen)}
                  className="w-full px-1.5 sm:px-2 py-2 bg-white/90 border border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none text-[11px] sm:text-xs font-bold text-amber-950 flex items-center justify-between shadow-2xs"
                >
                  <span>{countryCode}</span>
                  <ChevronDown className="w-3 h-3 text-amber-600" />
                </button>

                {/* Country Code Select Dropdown */}
                {isCcOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 max-h-48 overflow-y-auto bg-white border border-amber-200 rounded-xl shadow-xl z-50 py-1 text-xs divide-y divide-amber-100/60">
                    {COUNTRY_CODES.map(({ code, name }) => (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          setCountryCode(code);
                          setIsCcOpen(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-amber-50/80 cursor-pointer text-amber-900 flex items-center justify-between transition"
                      >
                        <span className="font-semibold">{code}</span>
                        <span className="text-amber-700 text-[11px] truncate">{name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Mobile Input */}
              <div className="relative flex-1 min-w-0">
                <input
                  type="tel"
                  value={mobile}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '');
                    if (val.length <= 10) setMobile(val);
                  }}
                  placeholder="9876543210"
                  required
                  className="w-full px-2.5 py-2 bg-white/90 border border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition text-amber-950 placeholder-amber-400 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-amber-950 mb-1.5">
            Select Your Role
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            <label
              className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition text-xs font-semibold ${role === 'collector'
                  ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-2xs'
                  : 'border-amber-200/80 bg-white/80 text-amber-800 hover:bg-amber-50/50'
                }`}
            >
              <input
                type="radio"
                name="userRole"
                value="collector"
                checked={role === 'collector'}
                onChange={() => setRole('collector')}
                className="accent-amber-600"
              />
              <span>Art Lover / Collector</span>
            </label>

            <label
              className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition text-xs font-semibold ${role === 'artist'
                  ? 'border-amber-600 bg-amber-50 text-amber-950 shadow-2xs'
                  : 'border-amber-200/80 bg-white/80 text-amber-800 hover:bg-amber-50/50'
                }`}
            >
              <input
                type="radio"
                name="userRole"
                value="artist"
                checked={role === 'artist'}
                onChange={() => setRole('artist')}
                className="accent-amber-600"
              />
              <span>Artist</span>
            </label>
          </div>
        </div>

        {/* Artist-Specific Fields (Art Types & Country) */}
        <AnimatePresence>
          {role === 'artist' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-1 border-t border-amber-200/60"
            >
              {/* Art Types Selection */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-900 mb-1">
                  Art Mediums & Specialties
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-xs">
                  {ART_TYPES.map((type) => (
                    <label
                      key={type}
                      className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] cursor-pointer transition ${artTypes.includes(type)
                          ? 'border-amber-600 bg-amber-100/70 text-amber-950 font-semibold'
                          : 'border-amber-200/70 bg-white/70 text-amber-800 hover:bg-amber-50'
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={artTypes.includes(type)}
                        onChange={() => handleArtTypeToggle(type)}
                        className="accent-amber-600 w-3.5 h-3.5 rounded"
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Country Selection */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-900 mb-1">
                  Country
                </label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required={role === 'artist'}
                  className="w-full px-3 py-2 bg-white/90 border border-amber-200 rounded-xl focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 focus:outline-none transition text-amber-950 text-xs cursor-pointer"
                >
                  <option value="">Select Country</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* reCAPTCHA Widget */}
        <div className="pt-0.5">
          <CaptchaWidget
            id="signup-captcha"
            verified={captchaVerified}
            onChange={(val) => {
              setCaptchaVerified(val);
              if (val) setCaptchaError(false);
            }}
            hasError={captchaError}
          />
        </div>

        {/* Terms and Privacy Agreement with Uiverse Animated Tick Checkbox */}
        <div className="flex items-start gap-2.5 pt-1 select-none text-xs text-amber-900/90">
          <TickCheckbox
            checked={termsAccepted}
            onChange={setTermsAccepted}
            ariaLabel="Accept Terms and Conditions and Privacy Policy"
            className="mt-0.5"
          />
          <span
            onClick={() => setTermsAccepted(!termsAccepted)}
            className="leading-tight cursor-pointer"
          >
            By registering, I accept the{' '}
            <span className="font-semibold text-amber-950 underline">Terms &amp; Conditions</span> &amp;{' '}
            <span className="font-semibold text-amber-950 underline">Privacy Policy</span>.
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border-l-4 border-red-500 p-2.5 rounded-lg text-xs text-red-700 font-medium"
          >
            {error}
          </motion.div>
        )}

        {/* Kinetic Uiverse Submit Button */}
        <div className="pt-1">
          <UiverseSubmitButton
            type="submit"
            loading={loading}
            icon={<Sparkles className="w-4 h-4" />}
            loadingText="Creating Account…"
          >
            JOIN US
          </UiverseSubmitButton>
        </div>

        {/* Toggle to Sign In */}
        <div className="text-center pt-1.5 pb-1">
          <p className="text-xs text-amber-900/80">
            One of us?{' '}
            <button
              type="button"
              onClick={() => setAuthMode('login')}
              className="font-bold text-amber-700 hover:text-amber-900 underline ml-1 inline-flex items-center gap-1 cursor-pointer transition"
            >
              Sign In <LogIn className="w-3.5 h-3.5" />
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};
