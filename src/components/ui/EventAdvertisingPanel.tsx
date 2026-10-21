import React, { useState, useMemo } from 'react'
import {
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Calendar,
  Share2,
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Phone,
  ChevronDown,
  Sparkles,
} from 'lucide-react'
import { useAppStore } from '@/app/store'
import { CaptchaWidget } from '../../features/auth/CaptchaWidget'
import { COUNTRY_CODES, ART_TYPES, COUNTRIES } from '../../features/auth/dummyUsers'

// ── Registration / Login Form Component for Museum Right-Side 30% Panel ──────
export function EventAdvertisingPanel() {
  const { login } = useAppStore()

  // Authentication mode: 'register' (default when museum page loads) or 'login'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')

  // Registration form state (identical to starting registration form)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [countryCode, setCountryCode] = useState('+91')
  const [isCcOpen, setIsCcOpen] = useState(false)
  const [mobile, setMobile] = useState('')
  const [userType, setUserType] = useState<'collector' | 'artist' | ''>('')
  const [artTypes, setArtTypes] = useState<string[]>([])
  const [country, setCountry] = useState('')
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [captchaError, setCaptchaError] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [regError, setRegError] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)

  // Login form state (identical to starting login form)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Confirmed pass state
  const [isRegistered, setIsRegistered] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const passNumber = useMemo(() => Math.floor(100000 + Math.random() * 900000), [])

  const handleArtTypeToggle = (type: string) => {
    if (artTypes.includes(type)) {
      setArtTypes(artTypes.filter((t) => t !== type))
    } else {
      setArtTypes([...artTypes, type])
    }
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')

    if (fullName.trim().length < 3) {
      setRegError('Name must be at least 3 letters.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      setRegError('Please enter a valid email address.')
      return
    }

    if (password.length < 6) {
      setRegError('Password must be at least 6 characters.')
      return
    }

    if (!mobile || mobile.length < 10) {
      setRegError('Please enter a valid 10-digit mobile number.')
      return
    }

    if (!userType) {
      setRegError('Please select whether you are an Art Lover / Collector or an Artist.')
      return
    }

    if (userType === 'artist') {
      if (artTypes.length === 0) {
        setRegError('Please select at least one art specialty.')
        return
      }
      if (!country) {
        setRegError('Please select your country.')
        return
      }
    }

    if (!captchaVerified) {
      setCaptchaError(true)
      setRegError('Please complete the captcha verification.')
      return
    }

    if (!acceptedTerms) {
      setRegError('Please accept the Terms & Conditions and Privacy Policy.')
      return
    }

    setIsRegistering(true)

    setTimeout(() => {
      login(email.trim(), fullName.trim(), userType === 'artist' ? 'Curator' : 'Patron', {
        role: userType,
      })
      setIsRegistered(true)
      setIsRegistering(false)
    }, 500)
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')

    if (!loginEmail.trim()) {
      setLoginError('Please enter your email address.')
      return
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginEmail.trim())) {
      setLoginError('Please enter a valid email address.')
      return
    }

    if (!loginPassword) {
      setLoginError('Please enter your password.')
      return
    } else if (loginPassword.length < 3) {
      setLoginError('Password must be at least 3 characters.')
      return
    }

    setIsLoggingIn(true)
    setTimeout(() => {
      const displayName = loginEmail.split('@')[0].toUpperCase() || 'Patron'
      setFullName(displayName)
      login(loginEmail.trim(), displayName, 'Patron')
      setIsRegistered(true)
      setIsLoggingIn(false)
    }, 500)
  }

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(`MUSEUM-PASS-#${passNumber}-${fullName || 'PATRON'}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div
      className="jur-panel w-full h-full overflow-y-auto overflow-x-hidden p-4 sm:p-5 lg:p-6 flex flex-col justify-start items-center select-text custom-scrollbar"
      aria-label="Exhibition Registration and Authentication"
      onKeyDown={(e) => {
        // Prevent keyboard events inside form inputs from propagating to 3D scene camera controls
        e.stopPropagation()
      }}
      onKeyUp={(e) => {
        e.stopPropagation()
      }}
    >
      <style>{`
        .jur-panel {
          --bg: #fdfcf9;
          --card: #ffffff;
          --ink: #1c1813;
          --mute: #6e6558;
          --line: #e6dfce;
          --gold: #d4af37;
          --gold-d: #c59b27;
          --err: #c62828;
          --ok: #2e7d32;
          box-sizing: border-box;
          font-family: Montserrat, system-ui, sans-serif;
          position: relative;
          isolation: isolate;
          background-color: #fdfcf9;
          background-image:
            radial-gradient(circle at 18% 12%, rgba(212, 175, 55, 0.16) 0%, transparent 40%),
            radial-gradient(circle at 85% 25%, rgba(245, 218, 122, 0.14) 0%, transparent 35%),
            radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.14) 0%, transparent 40%),
            radial-gradient(circle at 50% 35%, #ffffff 0%, #faf7f0 55%, #fdfcf9 100%);
          background-attachment: local;
          scrollbar-width: thin;
          scrollbar-color: rgba(197, 155, 39, 0.4) transparent;
        }
        .jur-card {
          width: 100%;
          max-width: 480px;
          padding: 28px 24px;
          border-radius: 24px;
          background: #ffffff;
          -webkit-backdrop-filter: blur(18px) saturate(1.2);
          backdrop-filter: blur(18px) saturate(1.2);
          border: 1px solid rgba(197, 155, 39, 0.28);
          box-shadow: 0 20px 60px rgba(197, 155, 39, 0.16), 0 4px 18px rgba(0, 0, 0, 0.04);
          position: relative;
          overflow: hidden;
          isolation: isolate;
          text-align: left;
          color: var(--ink);
          margin: 0 auto;
          flex-shrink: 0;
        }
        .jur-hd { text-align: center; margin-bottom: 18px; }
        .jur-eyebrow { font: 600 11.5px Montserrat,sans-serif; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-d); display: flex; justify-content: center; gap: 8px; align-items: center; }
        .jur-brand-mark { width: 24px; height: 24px; border-radius: 6px; background: #ffffff; border: 1.5px solid var(--gold); display: inline-flex; align-items: center; justify-content: center; padding: 2px; overflow: hidden; flex-shrink: 0; }
        .jur-brand-mark img { width: 100%; height: 100%; object-fit: contain; }
        .jur-hd h1 { font: 700 28px/1.1 'Playfair Display', Georgia, serif; margin: 6px 0 4px; color: var(--ink); }
        .jur-sub { color: var(--mute); margin: 0; font-size: 12.5px; font-weight: 400; line-height: 1.4; }
        .jur-tabs { display: grid; grid-template-columns: 1fr 1fr; background: #faf7f0; border: 1px solid var(--line); border-radius: 12px; padding: 4px; margin-bottom: 16px; gap: 4px; }
        .jur-tab { text-align: center; padding: 8px 12px; border-radius: 9px; cursor: pointer; font-weight: 500; font-size: 13px; color: var(--mute); background: transparent; border: 0; transition: background .15s, color .15s; font-family: inherit; }
        .jur-tab.active { background: linear-gradient(135deg, #d4af37 0%, #b88d22 100%); color: #ffffff; font-weight: 600; box-shadow: 0 2px 8px rgba(197, 155, 39, 0.28); }
        .jur-tab:hover:not(.active) { color: var(--ink); background: rgba(197, 155, 39, 0.08); }
        .jur-field { margin-bottom: 12px; text-align: left; }
        .jur-field label { display: block; font-weight: 600; font-size: 11px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: .05em; color: var(--ink); }
        .jur-inp { position: relative; }
        .jur-inp input, .jur-inp select { width: 100%; box-sizing: border-box; padding: 10px 12px; border: 1px solid var(--line); border-radius: 11px; background: #faf7f0; color: var(--ink); font: 400 13px Montserrat,sans-serif; transition: border-color .15s, box-shadow .15s, background .15s; outline: none; }
        .jur-inp input:focus, .jur-inp select:focus { outline: none; border-color: var(--gold); background: #ffffff; box-shadow: 0 0 0 3px rgba(197,155,39,.18); }
        .jur-eye { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); border: 0; background: none; color: var(--mute); padding: 6px; cursor: pointer; }
        .jur-chk { display: flex; gap: 8px; align-items: flex-start; font-size: 12px; color: var(--mute); margin: 12px 0 6px; text-align: left; cursor: pointer; line-height: 1.35; }
        .jur-chk input { width: 16px; height: 16px; margin: 2px 0 0; accent-color: var(--gold); flex: none; cursor: pointer; }
        .jur-cta { width: 100%; padding: 12px; border: 0; border-radius: 11px; background: linear-gradient(135deg, #d4af37 0%, #b3871d 100%); color: #ffffff; font: 600 14px Montserrat,sans-serif; cursor: pointer; box-shadow: 0 4px 18px rgba(197, 155, 39, 0.35); transition: filter .15s, transform .1s; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .jur-cta:hover { filter: brightness(1.05); }
        .jur-cta:disabled { opacity: .6; cursor: not-allowed; }
        .jur-foot { text-align: center; color: var(--mute); margin-top: 14px; margin-bottom: 0; font-size: 12.5px; }
        .jur-foot button { color: var(--gold-d); font-weight: 600; text-decoration: none; cursor: pointer; background: transparent; border: 0; font-size: inherit; font-family: inherit; padding: 0; }
        .jur-foot button:hover { text-decoration: underline; }
      `}</style>

      <div className="jur-card">
        {!isRegistered ? (
          authMode === 'register' ? (
            /* ── REGISTRATION FORM (Identical fields to the starting registration form) ── */
            <div>
              <div className="jur-hd">
                <div className="jur-eyebrow">
                  <span className="jur-brand-mark" aria-hidden="true">
                    <img src="/zigguratss-logo.png" alt="Zigguratss Logo" />
                  </span>
                  <span>Zigguratss Artwork LLP</span>
                </div>
                <h1>Join Us</h1>
                <p className="jur-sub">Art Gallery & Collection Platform</p>
              </div>

              {/* Tabs Switcher */}
              <div className="jur-tabs" role="tablist">
                <button
                  type="button"
                  className="jur-tab active"
                >
                  Join Us (Active)
                </button>
                <button
                  type="button"
                  className="jur-tab"
                  onClick={() => {
                    setAuthMode('login')
                    setRegError('')
                  }}
                >
                  Sign In
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3">
                {/* 1. Full Name */}
                <div className="jur-field">
                  <label htmlFor="jur-reg-name">Full Name</label>
                  <div className="jur-inp">
                    <input
                      id="jur-reg-name"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Arsh Deep"
                      required
                    />
                  </div>
                </div>

                {/* 2. Email Address */}
                <div className="jur-field">
                  <label htmlFor="jur-reg-email">Email Address</label>
                  <div className="jur-inp">
                    <input
                      id="jur-reg-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="artist@zigguratss.com"
                      required
                    />
                  </div>
                </div>

                {/* 3. Password */}
                <div className="jur-field">
                  <label htmlFor="jur-reg-pw">Password</label>
                  <div className="jur-inp">
                    <input
                      id="jur-reg-pw"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create strong password"
                      style={{ paddingRight: '40px' }}
                      required
                    />
                    <button
                      type="button"
                      className="jur-eye"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* 4. Mobile Number with Country Code Dropdown */}
                <div className="jur-field">
                  <label htmlFor="jur-reg-mobile">Mobile Number</label>
                  <div className="flex gap-2 relative">
                    <div className="relative w-24 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsCcOpen(!isCcOpen)}
                        className="w-full px-2.5 py-2.5 bg-[#faf7f0] border border-[#e6dfce] rounded-xl text-xs font-bold text-[#1c1813] flex items-center justify-between"
                      >
                        <span>{countryCode}</span>
                        <ChevronDown size={14} className="text-[#c59b27]" />
                      </button>

                      {isCcOpen && (
                        <div className="absolute left-0 top-full mt-1 w-52 max-h-48 overflow-y-auto bg-white border border-amber-200 rounded-xl shadow-xl z-50 py-1 text-xs divide-y divide-amber-100/60">
                          {COUNTRY_CODES.map(({ code, name: cName }) => (
                            <button
                              key={code}
                              type="button"
                              onClick={() => {
                                setCountryCode(code)
                                setIsCcOpen(false)
                              }}
                              className="w-full text-left px-3 py-1.5 hover:bg-amber-50 cursor-pointer text-amber-900 flex items-center justify-between"
                            >
                              <span className="font-semibold">{code}</span>
                              <span className="text-amber-700 text-[11px] truncate">{cName}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="relative flex-1 jur-inp">
                      <input
                        id="jur-reg-mobile"
                        type="tel"
                        value={mobile}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '')
                          if (val.length <= 10) setMobile(val)
                        }}
                        placeholder="9876543210"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Role Selection */}
                <div className="jur-field">
                  <label>Select Your Role</label>
                  <div className="grid grid-cols-2 gap-2">
                    <label
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer text-xs font-semibold ${
                        userType === 'collector'
                          ? 'border-amber-600 bg-amber-50 text-amber-950'
                          : 'border-amber-200/80 bg-white text-amber-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="museumUserRole"
                        value="collector"
                        checked={userType === 'collector'}
                        onChange={() => setUserType('collector')}
                        className="accent-amber-600"
                      />
                      <span>Art Lover / Collector</span>
                    </label>

                    <label
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer text-xs font-semibold ${
                        userType === 'artist'
                          ? 'border-amber-600 bg-amber-50 text-amber-950'
                          : 'border-amber-200/80 bg-white text-amber-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="museumUserRole"
                        value="artist"
                        checked={userType === 'artist'}
                        onChange={() => setUserType('artist')}
                        className="accent-amber-600"
                      />
                      <span>Artist</span>
                    </label>
                  </div>
                </div>

                {/* 6. Artist-Specific Fields (Art Mediums & Country) */}
                {userType === 'artist' && (
                  <div className="space-y-3 pt-1 border-t border-amber-200/60">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-amber-900 mb-1">
                        Art Mediums & Specialties
                      </label>
                      <div className="grid grid-cols-2 gap-1.5 text-xs">
                        {ART_TYPES.map((type) => (
                          <label
                            key={type}
                            className={`flex items-center gap-1.5 p-1.5 rounded-lg border text-[11px] cursor-pointer ${
                              artTypes.includes(type)
                                ? 'border-amber-600 bg-amber-100/70 text-amber-950 font-semibold'
                                : 'border-amber-200/70 bg-white text-amber-800'
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

                    <div className="jur-field">
                      <label htmlFor="jur-reg-country">Country</label>
                      <div className="jur-inp">
                        <select
                          id="jur-reg-country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          required={userType === 'artist'}
                        >
                          <option value="">Select Country</option>
                          {COUNTRIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 7. reCAPTCHA Widget */}
                <div className="pt-0.5">
                  <CaptchaWidget
                    id="museum-signup-captcha"
                    verified={captchaVerified}
                    onChange={(val) => {
                      setCaptchaVerified(val)
                      if (val) setCaptchaError(false)
                    }}
                    hasError={captchaError}
                  />
                </div>

                {/* 8. Terms and Privacy Agreement */}
                <label className="jur-chk">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                  />
                  <span>
                    By registering, I accept the{' '}
                    <span className="font-semibold text-amber-950 underline">Terms &amp; Conditions</span> &amp;{' '}
                    <span className="font-semibold text-amber-950 underline">Privacy Policy</span>.
                  </span>
                </label>

                {/* Error Message */}
                {regError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-2.5 rounded-lg text-xs text-red-700 font-medium">
                    {regError}
                  </div>
                )}

                {/* 9. Submit Button */}
                <button
                  type="submit"
                  disabled={isRegistering}
                  className="jur-cta mt-2"
                >
                  {isRegistering ? (
                    'Creating Account...'
                  ) : (
                    <>
                      <Sparkles size={16} />
                      JOIN US
                    </>
                  )}
                </button>

                {/* 10. Switch to Login */}
                <p className="jur-foot">
                  One of us?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('login')
                      setRegError('')
                    }}
                  >
                    Sign In
                  </button>
                </p>
              </form>
            </div>
          ) : (
            /* ── LOGIN FORM (Identical fields to the starting login form) ── */
            <div>
              <div className="jur-hd">
                <div className="jur-eyebrow">
                  <span className="jur-brand-mark" aria-hidden="true">
                    <img src="/zigguratss-logo.png" alt="Zigguratss Logo" />
                  </span>
                  <span>Zigguratss Artwork LLP</span>
                </div>
                <h1>Welcome Back</h1>
                <p className="jur-sub">Sign in to your account</p>
              </div>

              {/* Tabs Switcher */}
              <div className="jur-tabs" role="tablist">
                <button
                  type="button"
                  className="jur-tab"
                  onClick={() => {
                    setAuthMode('register')
                    setLoginError('')
                  }}
                >
                  Join Us
                </button>
                <button
                  type="button"
                  className="jur-tab active"
                >
                  Sign In (Active)
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} noValidate className="space-y-3.5">
                {/* 1. Email Address */}
                <div className="jur-field">
                  <label htmlFor="jur-login-email">Email Address</label>
                  <div className="jur-inp">
                    <input
                      id="jur-login-email"
                      type="email"
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="arsh@example.com"
                      required
                    />
                  </div>
                </div>

                {/* 2. Password */}
                <div className="jur-field">
                  <label htmlFor="jur-login-pw">Password</label>
                  <div className="jur-inp">
                    <input
                      id="jur-login-pw"
                      type={showLoginPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{ paddingRight: '40px' }}
                      required
                    />
                    <button
                      type="button"
                      className="jur-eye"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {loginError && (
                  <div className="bg-red-50 border-l-4 border-red-500 p-2.5 rounded-lg text-xs text-red-700 font-medium">
                    {loginError}
                  </div>
                )}

                {/* 3. Submit Button */}
                <button
                  type="submit"
                  disabled={isLoggingIn}
                  className="jur-cta mt-3"
                >
                  {isLoggingIn ? 'Signing In...' : 'Sign In'}
                </button>

                {/* Switch to Register */}
                <p className="jur-foot">
                  New here?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('register')
                      setLoginError('')
                    }}
                  >
                    JOIN US
                  </button>
                </p>
              </form>
            </div>
          )
        ) : (
          /* ── PASS CONFIRMED / VERIFIED STATE ── */
          <div className="space-y-4 text-center py-2">
            <div className="w-14 h-14 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center mx-auto text-[#10B981]">
              <CheckCircle2 size={34} />
            </div>

            <div>
              <span className="text-[11px] tracking-[0.25em] uppercase text-[#c59b27] font-bold">
                Pass Confirmed · Verified
              </span>
              <h2
                className="text-2xl font-serif text-[#1c1813] mt-1"
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
              >
                Welcome, {fullName || 'Patron'}
              </h2>
              <p className="text-xs text-[#6e6558] mt-1">
                You have received honorary access as an{' '}
                <strong className="text-[#1c1813]">
                  {userType === 'artist' ? 'Artist Patron' : 'Art Lover & Collector'}
                </strong>
                .
              </p>
            </div>

            {/* Commemorative Pass Card */}
            <div className="rounded-xl border border-[#e6dfce] bg-[#faf7f0] p-4 text-left shadow-xs space-y-2.5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#e6dfce] pb-2.5">
                <div className="flex items-center gap-2">
                  <Landmark size={15} className="text-[#c59b27]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#1c1813] font-bold">
                    The Living Gallery · Master Hall
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#10B981] font-semibold">
                  <ShieldCheck size={13} />
                  <span>Authenticated</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <div className="text-[10px] text-[#6e6558] uppercase">Patron Pass #</div>
                  <div className="font-mono font-bold text-sm text-[#1c1813]">
                    EUR-{passNumber}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#6e6558] uppercase">Valid Through</div>
                  <div className="font-semibold text-[#1c1813] flex items-center gap-1 justify-end">
                    <Calendar size={12} className="text-[#c59b27]" />
                    <span>2026 – Permanent</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#e6dfce] flex items-center justify-between text-[11px]">
                <span className="text-[#6e6558]">Curatorial Society Access</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="text-[#c59b27] hover:text-[#946e10] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Share2 size={12} />
                  <span>{isCopied ? 'Pass Copied!' : 'Copy Pass Token'}</span>
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsRegistered(false)
                setAuthMode('register')
              }}
              className="text-xs text-[#c59b27] hover:underline cursor-pointer font-medium mt-2"
            >
              Register Another Patron Account
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventAdvertisingPanel
