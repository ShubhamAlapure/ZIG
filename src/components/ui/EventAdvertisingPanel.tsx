import React, { useState, useMemo, useId } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Calendar,
  Share2,
  UserPlus,
} from 'lucide-react'
import { useAppStore } from '@/app/store'
import { CaptchaWidget } from '../../features/auth/CaptchaWidget'
import { ART_TYPES, COUNTRIES } from '../../features/auth/dummyUsers'
import { FloatingInput } from '../../features/auth/components/FloatingInput'
import { PasswordField } from '../../features/auth/components/PasswordField'
import { PhoneField } from '../../features/auth/components/PhoneField'
import { RoleCards } from '../../features/auth/components/RoleCards'
import { ChipGroup } from '../../features/auth/components/ChipGroup'
import { MorphButton } from '../../features/auth/components/MorphButton'
import { ProgressRail } from '../../features/auth/components/ProgressRail'

// ── Enhanced Registration ("Join Us") Form Component for Museum View ──────
export function EventAdvertisingPanel() {
  const { login, logout } = useAppStore()

  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const mobileId = useId()

  // Registration form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [countryCode, setCountryCode] = useState('+91')
  const [mobile, setMobile] = useState('')
  const [userType, setUserType] = useState<'collector' | 'artist' | ''>('')
  const [artTypes, setArtTypes] = useState<string[]>([])
  const [country, setCountry] = useState('')
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [captchaError, setCaptchaError] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)
  const [regError, setRegError] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Confirmed pass state
  const [isRegistered, setIsRegistered] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const passNumber = useMemo(() => Math.floor(100000 + Math.random() * 900000), [])

  // Progressive Disclosure checks:
  // 1. Row 1: Full Name and valid Email Address
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  const isRow1Filled = fullName.trim().length >= 3 && isEmailValid

  // 2. Row 2: Password (min 6 chars) and Mobile number (10 digits)
  const isRow2Filled = isRow1Filled && password.length >= 6 && mobile.trim().length === 10

  // 3. Role: Selected & completed (Collector or Artist with specialty & country)
  const isRoleFilled =
    isRow2Filled &&
    (userType === 'collector' ||
      (userType === 'artist' && artTypes.length > 0 && country.trim().length > 0))

  // 4. Captcha verified & Terms accepted
  const isFormComplete = isRoleFilled && captchaVerified && acceptedTerms

  // Calculate current step for progress rail (1 to 4)
  const currentStep = !isRow1Filled ? 1 : !isRow2Filled ? 2 : !isRoleFilled ? 3 : 4

  const handleArtTypeToggle = (type: string) => {
    if (artTypes.includes(type)) {
      setArtTypes(artTypes.filter((t) => t !== type))
    } else {
      setArtTypes([...artTypes, type])
    }
  }

  const handleGoogleSignUp = () => {
    setStatus('loading')
    setTimeout(() => {
      const gEmail = 'artlover@gmail.com'
      const gName = 'Google Patron'
      setFullName(gName)
      setEmail(gEmail)
      setUserType('collector')
      login(gEmail, gName, 'Patron', {
        role: 'collector',
      })
      setStatus('success')
      setIsRegistered(true)
    }, 600)
  }

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setRegError('')

    if (fullName.trim().length < 3) {
      setRegError('Name must contain at least 3 letters.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
      return
    }

    if (!isEmailValid) {
      setRegError('Please enter a valid email address.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
      return
    }

    if (password.length < 6) {
      setRegError('Password must contain at least 6 characters.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
      return
    }

    if (!mobile || mobile.length < 10) {
      setRegError('Please enter a valid 10-digit mobile number.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
      return
    }

    if (!userType) {
      setRegError('Please select whether you are a Collector or an Artist.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
      return
    }

    if (userType === 'artist') {
      if (artTypes.length === 0) {
        setRegError('Please select at least one art specialty.')
        setStatus('error')
        setTimeout(() => setStatus('idle'), 2000)
        return
      }
      if (!country) {
        setRegError('Please select your country of residence.')
        setStatus('error')
        setTimeout(() => setStatus('idle'), 2000)
        return
      }
    }

    if (!captchaVerified) {
      setCaptchaError(true)
      setRegError('Please complete the captcha verification.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
      return
    }

    if (!acceptedTerms) {
      setRegError('Please accept the Terms of Exhibition and Privacy Policy.')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 2000)
      return
    }

    setStatus('loading')

    setTimeout(() => {
      login(email.trim(), fullName.trim(), userType === 'artist' ? 'Curator' : 'Patron', {
        role: userType,
      })
      setStatus('success')
      setIsRegistered(true)
    }, 600)
  }

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(`MUSEUM-PASS-#${passNumber}-${fullName || 'PATRON'}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div
      className="jur-panel paper-canvas w-full h-full overflow-y-auto overflow-x-hidden p-4 sm:p-5 lg:p-6 flex flex-col justify-start items-center select-text custom-scrollbar relative"
      aria-label="Exhibition Registration and Authentication"
      onKeyDown={(e) => {
        // Prevent keyboard events inside inputs from leaking to 3D scene
        e.stopPropagation()
      }}
      onKeyUp={(e) => {
        e.stopPropagation()
      }}
    >
      <div className="jur-card w-full max-w-[520px] p-4 sm:p-6 rounded-3xl bg-white/95 border border-[#C5A059]/30 shadow-xl relative z-10 backdrop-blur-sm mx-auto">
        {!isRegistered ? (
          <div>
            {/* Header: Strictly Join Us Registration */}
            <div className="text-center mb-3 sm:mb-4">
              <div className="inline-flex items-center justify-center gap-3 mb-2">
                <span className="w-10 h-10 sm:w-11 sm:h-11 p-1.5 rounded-xl bg-white border border-[#C5A059]/35 shadow-xs flex items-center justify-center flex-shrink-0 transition-transform duration-300 hover:scale-105" aria-hidden="true">
                  <img src="/zigguratss-logo.png" alt="Zigguratss Logo" className="w-full h-full object-contain" />
                </span>
                <div className="flex flex-col text-left">
                  <span
                    className="text-[18px] sm:text-[20px] lg:text-[22px] font-black tracking-[0.16em] uppercase text-[#171412] leading-none"
                    style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
                  >
                    Zigguratss
                  </span>
                  <span className="text-[9px] sm:text-[10px] tracking-[0.28em] uppercase font-bold text-[#9E7A32] mt-1 leading-none">
                    Artwork LLP · Fine Art Maison
                  </span>
                </div>
              </div>
              <h1
                className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#171412] mt-1"
                style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
              >
                Join Us
              </h1>
              <p className="text-xs text-[#7D705C] mt-0.5">
                European Museum of Fine Art · Curatorial Access
              </p>
            </div>

            {/* Progress Rail (Paint Dots & Step Indicator) */}
            <ProgressRail
              currentStep={currentStep}
              totalSteps={4}
              stepLabels={['Identity', 'Security', 'Membership', 'Access Pass']}
            />

            <form onSubmit={handleRegisterSubmit} noValidate className="space-y-3.5">
              {/* ── STEP 1: Full Name & Email Address (Side by Side) ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FloatingInput
                  id={nameId}
                  label="Full Name"
                  value={fullName}
                  onChange={(val) => {
                    setFullName(val)
                    if (regError) setRegError('')
                  }}
                  isValid={fullName.trim().length >= 3}
                  hint={
                    fullName.trim().length >= 3
                      ? `Welcome, ${fullName.trim().split(' ')[0]}`
                      : undefined
                  }
                  placeholder="Arsh Deep"
                  required
                />

                <FloatingInput
                  id={emailId}
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={(val) => {
                    setEmail(val)
                    if (regError) setRegError('')
                  }}
                  isEmail
                  isValid={isEmailValid}
                  placeholder="patron@europeanmuseum.art"
                  required
                />
              </div>

              {/* ── STEP 2: Password (with strength meter) & Mobile (Side by Side) ── */}
              <AnimatePresence>
                {isRow1Filled && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1"
                  >
                    <PasswordField
                      id={passwordId}
                      label="Password"
                      value={password}
                      onChange={(val) => {
                        setPassword(val)
                        if (regError) setRegError('')
                      }}
                      showStrengthMeter
                      minLength={6}
                      required
                    />

                    <PhoneField
                      id={mobileId}
                      countryCode={countryCode}
                      onCountryCodeChange={setCountryCode}
                      mobile={mobile}
                      onMobileChange={(val) => {
                        setMobile(val)
                        if (regError) setRegError('')
                      }}
                      required
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── STEP 3: Patron / Artist Role Cards ── */}
              <AnimatePresence>
                {isRow2Filled && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="pt-2 space-y-3"
                  >
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-[#7D705C] text-left">
                      Select Your Gallery Membership <span className="text-[#C5A059]">*</span>
                    </span>

                    <RoleCards
                      selectedRole={userType}
                      onSelectRole={(role) => {
                        setUserType(role)
                        if (regError) setRegError('')
                      }}
                    />

                    {/* Artist Extras: Chips & Country */}
                    {userType === 'artist' && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="p-3.5 bg-[#FAF8F5] border border-[#E8DFC8] rounded-2xl space-y-3"
                      >
                        <ChipGroup
                          options={ART_TYPES}
                          selectedOptions={artTypes}
                          onToggle={handleArtTypeToggle}
                          label="Your Art Specialties"
                        />

                        {/* Country Selector */}
                        <div className="text-left space-y-1">
                          <label
                            htmlFor="artist-country"
                            className="block text-[11px] font-bold uppercase tracking-wider text-[#7D705C]"
                          >
                            Country of Origin <span className="text-[#C5A059]">*</span>
                          </label>
                          <select
                            id="artist-country"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-[#E8DFC8] rounded-xl text-xs font-medium text-[#171412] outline-none focus:border-[#C5A059]"
                          >
                            <option value="">Select your country…</option>
                            {COUNTRIES.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── STEP 4: Captcha & Terms ── */}
              <AnimatePresence>
                {isRoleFilled && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, filter: 'blur(4px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -8, filter: 'blur(4px)' }}
                    transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-3 pt-2"
                  >
                    {/* Captcha Widget */}
                    <div className="flex flex-col items-center">
                      <CaptchaWidget
                        verified={captchaVerified}
                        onChange={(verified: boolean) => {
                          setCaptchaVerified(verified)
                          setCaptchaError(!verified)
                        }}
                        hasError={captchaError}
                      />
                    </div>

                    {/* Terms & Conditions Checkbox */}
                    <label className="flex items-start gap-2.5 text-xs text-[#7D705C] cursor-pointer text-left select-none pl-1">
                      <input
                        type="checkbox"
                        checked={acceptedTerms}
                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-[#D6CBB8] text-[#C5A059] focus:ring-[#C5A059] accent-[#C5A059] cursor-pointer"
                      />
                      <span>
                        I agree to the{' '}
                        <a href="#terms" className="text-[#9E7A32] underline font-semibold hover:text-[#C5A059]">
                          Terms of Exhibition
                        </a>{' '}
                        and{' '}
                        <a href="#privacy" className="text-[#9E7A32] underline font-semibold hover:text-[#C5A059]">
                          Curatorial Privacy Policy
                        </a>
                        .
                      </span>
                    </label>

                    {/* Submission Error Message */}
                    {regError && (
                      <div
                        role="alert"
                        aria-live="polite"
                        className="p-3 bg-red-50/90 border-l-3 border-[#DC2626] rounded-xl text-xs text-[#991B1B] font-medium flex items-center gap-2 animate-fadeIn text-left"
                      >
                        <span>⚠</span>
                        <span>{regError}</span>
                      </div>
                    )}

                    {/* Final Morph Button - strictly 'Join Us' */}
                    <div className="pt-2">
                      <MorphButton
                        type="submit"
                        status={status}
                        icon={<UserPlus className="w-4 h-4" />}
                        loadingText="Entering Vault…"
                        successText="Pass Issued"
                      >
                        Join Us
                      </MorphButton>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Divider & Google OAuth */}
              <div className="relative flex items-center justify-center my-3.5">
                <div className="border-t border-[#E8DFC8] w-full" />
                <span className="bg-white px-3 text-[10px] font-bold text-[#8C7D6B] uppercase tracking-[0.15em] whitespace-nowrap absolute">
                  or continue with
                </span>
              </div>

              <motion.button
                type="button"
                onClick={handleGoogleSignUp}
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
            </form>
          </div>
        ) : (
          /* ── PASS CONFIRMED / VERIFIED STATE ── */
          <div className="space-y-4 text-center py-2 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-[#059669]/15 border border-[#059669]/40 flex items-center justify-center mx-auto text-[#059669]">
              <CheckCircle2 size={34} />
            </div>

            <div>
              <span className="text-[11px] tracking-[0.2em] uppercase text-[#9E7A32] font-bold">
                Pass Confirmed · Verified
              </span>
              <h2
                className="text-2xl font-extrabold tracking-tight text-[#171412] mt-1"
                style={{ fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif" }}
              >
                Welcome, {fullName || 'Patron'}
              </h2>
              <p className="text-xs text-[#7D705C] mt-1">
                You have received honorary access as an{' '}
                <strong className="text-[#171412]">
                  {userType === 'artist' ? 'Resident Fine Artist' : 'Curatorial Patron'}
                </strong>
                .
              </p>
            </div>

            {/* Commemorative Pass Card */}
            <div className="rounded-2xl border border-[#C5A059]/30 bg-[#FAF8F5] p-4 text-left shadow-xs space-y-2.5 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#E8DFC8] pb-2.5">
                <div className="flex items-center gap-2">
                  <Landmark size={15} className="text-[#9E7A32]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#171412] font-bold">
                    The Living Gallery · Master Hall
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#059669] font-semibold">
                  <ShieldCheck size={13} />
                  <span>Authenticated</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs">
                <div>
                  <div className="text-[10px] text-[#7D705C] uppercase">Patron Pass #</div>
                  <div className="font-mono font-bold text-sm text-[#171412]">
                    EUR-{passNumber}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-[#7D705C] uppercase">Valid Through</div>
                  <div className="font-semibold text-[#171412] flex items-center gap-1 justify-end">
                    <Calendar size={12} className="text-[#9E7A32]" />
                    <span>2026 – Permanent</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#E8DFC8] flex items-center justify-between text-[11px]">
                <span className="text-[#7D705C]">Curatorial Society Access</span>
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
                setIsRegistered(false)
                setFullName('')
                setEmail('')
                setPassword('')
                setMobile('')
                setUserType('')
                setArtTypes([])
                setCountry('')
                setCaptchaVerified(false)
                setAcceptedTerms(false)
                setRegError('')
                setStatus('idle')
              }}
              className="text-xs text-[#9E7A32] hover:text-[#C5A059] hover:underline cursor-pointer font-semibold mt-2"
            >
              Register Another Patron Account
            </button>
          </div>
        )}
      </div>

      {/* Option below the card to return to Sign In */}
      <div className="mt-4 mb-2 text-center select-none animate-fadeIn relative z-10">
        <p className="text-xs text-[#7D705C] font-medium">
          Already have an account?{' '}
          <button
            type="button"
            onClick={logout}
            className="font-bold text-[#9E7A32] hover:text-[#C5A059] underline hover:no-underline cursor-pointer transition ml-1"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  )
}

export default EventAdvertisingPanel
