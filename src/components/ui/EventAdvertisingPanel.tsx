import React, { useState, useMemo } from 'react'
import {
  CheckCircle2,
  Landmark,
  ShieldCheck,
  Calendar,
  Share2,
} from 'lucide-react'
import { useAppStore } from '@/app/store'

// ── Registration / Login Form Component for Museum Right-Side 30% Panel ──────
export function EventAdvertisingPanel() {
  const { login } = useAppStore()

  // Authentication mode: 'register' (default when museum page loads) or 'login'
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register')

  // Login form state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [loginEmailError, setLoginEmailError] = useState('')
  const [loginPwError, setLoginPwError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Registration form state
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [userType, setUserType] = useState<'collector' | 'artist'>('collector')
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [isCaptchaChecking, setIsCaptchaChecking] = useState(false)
  const [acceptedTerms, setAcceptedTerms] = useState(false)

  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [pwError, setPwError] = useState('')
  const [termsError, setTermsError] = useState('')
  const [isRegistered, setIsRegistered] = useState(false)
  const [isCopied, setIsCopied] = useState(false)

  const passNumber = useMemo(() => Math.floor(100000 + Math.random() * 900000), [])

  const handleCaptchaClick = () => {
    if (captchaVerified) return
    setIsCaptchaChecking(true)
    setTimeout(() => {
      setIsCaptchaChecking(false)
      setCaptchaVerified(true)
      setTermsError('')
    }, 450)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let valid = true

    if (!fullName.trim() || fullName.trim().length < 2) {
      setNameError('Enter your full name.')
      valid = false
    } else {
      setNameError('')
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setEmailError('Enter a valid email, like you@example.com.')
      valid = false
    } else {
      setEmailError('')
    }

    if (password.length < 8) {
      setPwError('Password needs at least 8 characters.')
      valid = false
    } else if (!/\d/.test(password) || !/[A-Z]/.test(password)) {
      setPwError('Add a number and a capital letter.')
      valid = false
    } else {
      setPwError('')
    }

    if (!captchaVerified) {
      setTermsError("Tick “I’m not a robot” to continue.")
      return
    }

    if (!acceptedTerms) {
      setTermsError('Accept the terms to create your account.')
      return
    }

    if (!valid) return
    setTermsError('')
    login(email, fullName, userType === 'artist' ? 'Member' : 'Patron')
    setIsRegistered(true)
  }

  const handleGoogleJoin = () => {
    const name = fullName || 'Google Patron'
    setFullName(name)
    login('google.patron@museum.art', name, 'Patron')
    setIsRegistered(true)
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let valid = true

    if (!loginEmail.trim()) {
      setLoginEmailError('Enter your email address.')
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(loginEmail.trim())) {
      setLoginEmailError('Enter a valid email, like you@example.com.')
      valid = false
    } else {
      setLoginEmailError('')
    }

    if (!loginPassword) {
      setLoginPwError('Enter your password.')
      valid = false
    } else if (loginPassword.length < 6) {
      setLoginPwError('Password must be at least 6 characters.')
      valid = false
    } else {
      setLoginPwError('')
    }

    if (!valid) return

    setIsLoggingIn(true)
    try {
      await new Promise((r) => setTimeout(r, 400))
      const displayName = loginEmail.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ') || 'Patron'
      setFullName(displayName)
      login(loginEmail, displayName, 'Patron')
      setIsRegistered(true)
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleGoogleLogin = () => {
    setFullName('Google Patron')
    login('google.patron@museum.art', 'Google Patron', 'Patron')
    setIsRegistered(true)
  }

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(`MUSEUM-PASS-#${passNumber}-${fullName || 'PATRON'}`)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  // Password strength score (0 to 4)
  let pwStrength = 0
  if (password.length >= 8) pwStrength++
  if (/[A-Z]/.test(password)) pwStrength++
  if (/\d/.test(password)) pwStrength++
  if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) pwStrength++
  const meterColors = ['#b3261e', '#d9822b', '#cfb04e', '#2e7d4f']

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
          --on-gold: #ffffff;
          box-sizing: border-box;
          font-family: Montserrat, system-ui, sans-serif;
          position: relative;
          isolation: isolate;
          background-color: #fdfcf9;
          background-image:
            radial-gradient(circle at 18% 12%, rgba(212, 175, 55, 0.16) 0%, transparent 40%),
            radial-gradient(circle at 85% 25%, rgba(245, 218, 122, 0.14) 0%, transparent 35%),
            radial-gradient(circle at 75% 75%, rgba(212, 175, 55, 0.14) 0%, transparent 40%),
            radial-gradient(circle at 15% 85%, rgba(197, 155, 39, 0.12) 0%, transparent 35%),
            radial-gradient(circle at 50% 35%, #ffffff 0%, #faf7f0 55%, #fdfcf9 100%);
          background-attachment: local;
          scrollbar-width: thin;
          scrollbar-color: rgba(197, 155, 39, 0.4) transparent;
        }
        .jur-panel:before {
          content: "";
          position: absolute;
          inset: 0;
          min-height: 100%;
          z-index: -2;
          pointer-events: none;
          opacity: 0.35;
          filter: blur(28px);
          background:
            radial-gradient(circle at 16% 10%, rgba(212, 175, 55, 0.22) 0 15%, transparent 16%),
            radial-gradient(circle at 88% 28%, rgba(245, 218, 122, 0.18) 0 9%, transparent 10%),
            linear-gradient(160deg, transparent 0 34%, rgba(212, 175, 55, 0.1) 34% 50%, transparent 50%),
            radial-gradient(circle at 72% 88%, rgba(197, 155, 39, 0.16) 0 24%, transparent 25%),
            radial-gradient(circle at 8% 70%, rgba(230, 200, 110, 0.15) 0 12%, transparent 13%);
        }
        .jur-panel:after {
          content: "";
          position: absolute;
          inset: 0;
          min-height: 100%;
          z-index: -1;
          pointer-events: none;
          opacity: 0.08;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }
        .jur-panel::-webkit-scrollbar {
          width: 6px;
        }
        .jur-panel::-webkit-scrollbar-track {
          background: transparent;
        }
        .jur-panel::-webkit-scrollbar-thumb {
          background: rgba(197, 155, 39, 0.35);
          border-radius: 4px;
        }
        .jur-panel::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 155, 39, 0.6);
        }
        .jur-card {
          width: 100%;
          max-width: 480px;
          padding: 32px 28px;
          border-radius: 26px;
          background: #ffffff;
          -webkit-backdrop-filter: blur(18px) saturate(1.2);
          backdrop-filter: blur(18px) saturate(1.2);
          border: 1px solid rgba(197, 155, 39, 0.28);
          box-shadow: 0 20px 60px rgba(197, 155, 39, 0.16), 0 4px 18px rgba(0, 0, 0, 0.04);
          position: relative;
          overflow: hidden;
          isolation: isolate;
          --tex: .25;
          text-align: left;
          color: var(--ink);
          margin: 0 auto;
          flex-shrink: 0;
        }
        .jur-card:before {
          content: "";
          position: absolute;
          inset: -30px;
          z-index: -1;
          pointer-events: none;
          opacity: var(--tex);
          filter: blur(16px);
          background:
            radial-gradient(circle at 16% 10%, rgba(212, 175, 55, 0.16) 0 15%, transparent 16%),
            radial-gradient(circle at 88% 28%, rgba(245, 218, 122, 0.14) 0 9%, transparent 10%),
            radial-gradient(circle at 72% 88%, rgba(197, 155, 39, 0.14) 0 24%, transparent 25%);
        }
        .jur-card:after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: .06;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }
        .jur-hd { text-align: center; margin-bottom: 20px; }
        .jur-eyebrow { font: 600 11.5px Montserrat,sans-serif; letter-spacing: .16em; text-transform: uppercase; color: var(--gold-d); display: flex; justify-content: center; gap: 10px; align-items: center; }
        .jur-brand-mark { width: 26px; height: 26px; border-radius: 7px; background: #ffffff; border: 1.5px solid var(--gold); box-shadow: 0 2px 6px rgba(197, 155, 39, 0.22); display: inline-flex; align-items: center; justify-content: center; padding: 2px; overflow: hidden; flex-shrink: 0; }
        .jur-brand-mark img { width: 100%; height: 100%; object-fit: contain; }
        .jur-hd h1 { font: 700 36px/1.08 'Playfair Display', Georgia, serif; margin: 8px 0 5px; letter-spacing: -.01em; color: var(--ink); }
        .jur-sub { color: var(--mute); margin: 0; font-size: 13.5px; font-weight: 400; line-height: 1.45; }
        .jur-orn { display: flex; align-items: center; justify-content: center; gap: 9px; margin-top: 10px; }
        .jur-orn span { width: 48px; height: 1px; background: var(--line); display: block; }
        .jur-orn b { width: 6px; height: 6px; background: var(--gold); transform: rotate(45deg); display: block; }
        .jur-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 12px; border: 1px solid var(--line); background: #ffffff; color: var(--ink); border-radius: 12px; font: 500 14px Montserrat,sans-serif; cursor: pointer; transition: border-color .15s, background .15s, box-shadow .15s; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04); }
        .jur-google:hover { border-color: var(--gold); background: #faf7f0; }
        .jur-or { display: flex; align-items: center; gap: 12px; color: var(--mute); font-size: 12px; margin: 15px 0; }
        .jur-or:before, .jur-or:after { content: ""; flex: 1; height: 1px; background: var(--line); }
        .jur-tabs { display: grid; grid-template-columns: 1fr 1fr; background: #faf7f0; border: 1px solid var(--line); border-radius: 12px; padding: 4px; margin-bottom: 18px; gap: 4px; }
        .jur-tab { text-align: center; padding: 9px 12px; border-radius: 9px; cursor: pointer; font-weight: 500; font-size: 13.5px; color: var(--mute); background: transparent; border: 0; transition: background .15s, color .15s; font-family: inherit; }
        .jur-tab.active { background: linear-gradient(135deg, #d4af37 0%, #b88d22 100%); color: #ffffff; font-weight: 600; box-shadow: 0 2px 8px rgba(197, 155, 39, 0.28); }
        .jur-tab:hover:not(.active) { color: var(--ink); background: rgba(197, 155, 39, 0.08); }
        .jur-seg { display: grid; grid-template-columns: 1fr 1fr; background: #faf7f0; border: 1px solid var(--line); border-radius: 12px; padding: 4px; margin-bottom: 15px; }
        .jur-seg label { text-align: center; padding: 0; border-radius: 9px; cursor: pointer; font-weight: 500; font-size: 13.5px; color: var(--mute); transition: background .15s, color .15s; margin: 0; }
        .jur-seg input { position: absolute; opacity: 0; pointer-events: none; }
        .jur-seg input:checked+span { background: linear-gradient(135deg, #d4af37 0%, #b88d22 100%); color: #ffffff; font-weight: 600; box-shadow: 0 2px 8px rgba(197, 155, 39, 0.28); }
        .jur-seg span { display: block; padding: 9px 8px; border-radius: 9px; }
        .jur-seg input:focus-visible+span { outline: 2px solid var(--gold); outline-offset: 1px; }
        .jur-field { margin-bottom: 13px; text-align: left; }
        .jur-field label { display: block; font-weight: 500; font-size: 13px; margin-bottom: 5px; color: var(--ink); }
        .jur-inp { position: relative; }
        .jur-inp input { width: 100%; box-sizing: border-box; padding: 12px 14px; border: 1px solid var(--line); border-radius: 12px; background: #faf7f0; color: var(--ink); font: 400 14px Montserrat,sans-serif; transition: border-color .15s, box-shadow .15s, background .15s; outline: none; }
        .jur-inp input::placeholder { color: var(--mute); opacity: .7; }
        .jur-inp input:focus { outline: none; border-color: var(--gold); background: #ffffff; box-shadow: 0 0 0 3px rgba(197,155,39,.22); }
        .jur-field.bad input { border-color: var(--err); }
        .jur-field.good input { border-color: var(--ok); }
        .jur-msg { font-size: 12px; color: var(--err); text-align: left; }
        .jur-msg:empty { display: none; }
        .jur-msg:not(:empty) { margin-top: 4px; }
        .jur-eye { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); border: 0; background: none; color: var(--mute); padding: 8px; cursor: pointer; font: 500 12px Montserrat,sans-serif; }
        .jur-eye:focus-visible { outline: 2px solid var(--gold-d); border-radius: 6px; }
        .jur-meter { display: flex; gap: 4px; margin-top: 6px; }
        .jur-meter b { flex: 1; height: 4px; border-radius: 2px; background: var(--line); transition: background .2s; }
        .jur-hint { font-size: 12px; color: var(--mute); margin-top: 4px; text-align: left; line-height: 1.35; }
        .jur-chk { display: flex; gap: 9px; align-items: flex-start; font-size: 12.5px; color: var(--mute); margin: 14px 0 6px; text-align: left; cursor: pointer; line-height: 1.4; }
        .jur-chk input { width: 17px; height: 17px; margin: 2px 0 0; accent-color: var(--gold); flex: none; cursor: pointer; }
        .jur-chk a { color: var(--gold-d); font-weight: 500; text-decoration: none; }
        .jur-chk a:hover { text-decoration: underline; }
        .jur-robot { display: flex; align-items: center; gap: 12px; border: 1px solid var(--line); background: #ffffff; border-radius: 12px; padding: 11px 14px; margin: 11px 0 13px; font-size: 13.5px; cursor: pointer; text-align: left; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04); }
        .jur-robot:hover { border-color: var(--gold); }
        .jur-robot input { width: 18px; height: 18px; accent-color: var(--gold); cursor: pointer; }
        .jur-robot label { cursor: pointer; color: var(--ink); margin: 0; font-weight: 400; }
        .jur-robot small { margin-left: auto; color: var(--mute); font-size: 11px; }
        .jur-cta { width: 100%; padding: 13.5px; border: 0; border-radius: 12px; background: linear-gradient(135deg, #d4af37 0%, #b3871d 100%); color: #ffffff; font: 600 14.5px Montserrat,sans-serif; cursor: pointer; box-shadow: 0 4px 18px rgba(197, 155, 39, 0.35); transition: filter .15s, transform .1s, box-shadow .15s; }
        .jur-cta:hover { filter: brightness(1.05); box-shadow: 0 6px 24px rgba(197, 155, 39, 0.45); }
        .jur-cta:active { transform: scale(.99); }
        .jur-cta:disabled { opacity: .55; cursor: not-allowed; }
        .jur-cta:focus-visible, .jur-google:focus-visible { outline: 2px solid var(--gold); outline-offset: 2px; }
        .jur-foot { text-align: center; color: var(--mute); margin-top: 15px; margin-bottom: 0; font-size: 13px; }
        .jur-foot a, .jur-foot button { color: var(--gold-d); font-weight: 600; text-decoration: none; cursor: pointer; background: transparent; border: 0; font-size: inherit; font-family: inherit; padding: 0; }
        .jur-foot a:hover, .jur-foot button:hover { text-decoration: underline; }
        @media (max-width: 480px) {
          .jur-card { padding: 22px 18px; border-radius: 20px; }
        }
      `}</style>

      <div className="jur-card">
        {!isRegistered ? (
          authMode === 'register' ? (
            /* ── REGISTRATION FORM (Default View on Page Load) ── */
            <div>
              <div className="jur-hd">
                <div className="jur-eyebrow">
                  <span className="jur-brand-mark" aria-hidden="true">
                    <img
                      src="/zigguratss-logo.png"
                      alt="Zigguratss Artwork LLP logo"
                    />
                  </span>
                  <span>Zigguratss Artwork LLP</span>
                </div>
                <h1>Create Account</h1>
                <p className="jur-sub">Enter your details to register for the exhibition</p>
                <div className="jur-orn">
                  <span></span>
                  <b></b>
                  <span></span>
                </div>
              </div>


              <form onSubmit={handleSubmit} noValidate>
                <div className={`jur-field ${nameError ? 'bad' : fullName.trim().length >= 2 ? 'good' : ''}`}>
                  <label htmlFor="jur-name">Full Name</label>
                  <div className="jur-inp">
                    <input
                      id="jur-name"
                      autoComplete="name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value)
                        if (nameError) setNameError('')
                      }}
                      placeholder="e.g. Ananya Rao"
                    />
                  </div>
                  <div className="jur-msg">{nameError}</div>
                </div>

                <div className={`jur-field ${emailError ? 'bad' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim()) ? 'good' : ''}`}>
                  <label htmlFor="jur-email">Email address</label>
                  <div className="jur-inp">
                    <input
                      id="jur-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        if (emailError) setEmailError('')
                      }}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="jur-msg">{emailError}</div>
                </div>

                <div className={`jur-field ${pwError ? 'bad' : password.length >= 8 && /\d/.test(password) && /[A-Z]/.test(password) ? 'good' : ''}`}>
                  <label htmlFor="jur-pw">Password</label>
                  <div className="jur-inp">
                    <input
                      id="jur-pw"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        if (pwError) setPwError('')
                      }}
                      placeholder="At least 8 characters"
                      style={{ paddingRight: '64px' }}
                    />
                    <button
                      type="button"
                      className="jur-eye"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="jur-meter" aria-hidden="true">
                    {[0, 1, 2, 3].map((idx) => {
                      const activeColor =
                        password && idx < pwStrength ? meterColors[pwStrength - 1] : ''
                      return (
                        <b
                          key={idx}
                          style={{ backgroundColor: activeColor }}
                        />
                      )
                    })}
                  </div>
                  <div className="jur-hint">
                    Use 8+ characters with a number and a capital letter.
                  </div>
                  <div className="jur-msg">{pwError}</div>
                </div>

                <div className="jur-seg" role="radiogroup" aria-label="Account type">
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="collector"
                      checked={userType === 'collector'}
                      onChange={() => setUserType('collector')}
                    />
                    <span>Art lover / collector</span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="role"
                      value="artist"
                      checked={userType === 'artist'}
                      onChange={() => setUserType('artist')}
                    />
                    <span>Artist</span>
                  </label>
                </div>

                <div className="jur-robot" onClick={handleCaptchaClick}>
                  <input
                    type="checkbox"
                    id="jur-rb"
                    checked={captchaVerified}
                    onChange={handleCaptchaClick}
                    aria-label="I'm not a robot"
                  />
                  <label htmlFor="jur-rb">
                    {isCaptchaChecking ? 'Verifying…' : "I'm not a robot"}
                  </label>
                  <small>reCAPTCHA</small>
                </div>

                <label className="jur-chk">
                  <input
                    type="checkbox"
                    id="jur-tc"
                    checked={acceptedTerms}
                    onChange={(e) => {
                      setAcceptedTerms(e.target.checked)
                      if (termsError) setTermsError('')
                    }}
                  />
                  <span>
                    By registering, I accept the{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Terms &amp; Conditions
                    </a>{' '}
                    &amp;{' '}
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>
                {termsError ? (
                  <div className="jur-msg" style={{ margin: '2px 0 6px' }}>
                    {termsError}
                  </div>
                ) : null}

                <button className="jur-cta" type="submit" id="btn-register-submit">
                  Create account
                </button>

                <div className="jur-or">OR</div>

                <button
                  type="button"
                  className="jur-google"
                  onClick={handleGoogleJoin}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <p className="jur-foot">
                  Already have an account?{' '}
                  <button
                    type="button"
                    id="btn-switch-to-login"
                    onClick={() => {
                      setAuthMode('login')
                      setNameError('')
                      setEmailError('')
                      setPwError('')
                      setTermsError('')
                    }}
                  >
                    Log in
                  </button>
                </p>
              </form>
            </div>
          ) : (
            /* ── LOGIN FORM ── */
            <div>
              <div className="jur-hd">
                <div className="jur-eyebrow">
                  <span className="jur-brand-mark" aria-hidden="true">
                    <img
                      src="/zigguratss-logo.png"
                      alt="Zigguratss Artwork LLP logo"
                    />
                  </span>
                  <span>Zigguratss Artwork LLP</span>
                </div>
                <h1 aria-label="Welcome Back / Login">Welcome Back</h1>
                <p className="jur-sub">Sign in to your museum account</p>
                <div className="jur-orn">
                  <span></span>
                  <b></b>
                  <span></span>
                </div>
              </div>

              <div className="jur-tabs" role="tablist" aria-label="Authentication Type">
                <button
                  type="button"
                  role="tab"
                  id="tab-login"
                  aria-selected={true}
                  className="jur-tab active"
                  onClick={() => setAuthMode('login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  role="tab"
                  id="tab-register"
                  aria-selected={false}
                  className="jur-tab"
                  onClick={() => {
                    setAuthMode('register')
                    setLoginEmailError('')
                    setLoginPwError('')
                  }}
                >
                  Register
                </button>
              </div>

              <form onSubmit={handleLoginSubmit} noValidate>
                <div className={`jur-field ${loginEmailError ? 'bad' : /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(loginEmail.trim()) ? 'good' : ''}`}>
                  <label htmlFor="jur-login-email">Email address</label>
                  <div className="jur-inp">
                    <input
                      id="jur-login-email"
                      type="email"
                      autoComplete="email"
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value)
                        if (loginEmailError) setLoginEmailError('')
                      }}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="jur-msg">{loginEmailError}</div>
                </div>

                <div className={`jur-field ${loginPwError ? 'bad' : loginPassword.length >= 6 ? 'good' : ''}`}>
                  <label htmlFor="jur-login-pw">Password</label>
                  <div className="jur-inp">
                    <input
                      id="jur-login-pw"
                      type={showLoginPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value)
                        if (loginPwError) setLoginPwError('')
                      }}
                      placeholder="Enter your password"
                      style={{ paddingRight: '64px' }}
                    />
                    <button
                      type="button"
                      className="jur-eye"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                    >
                      {showLoginPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                  <div className="jur-msg">{loginPwError}</div>
                </div>

                <button className="jur-cta" type="submit" id="btn-login-submit" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Logging in…' : 'Login'}
                </button>

                <div className="jur-or">OR</div>

                <button
                  type="button"
                  className="jur-google"
                  onClick={handleGoogleLogin}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.5 28.7A14.5 14.5 0 0 1 9.5 24c0-1.6.3-3.2.8-4.7l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.9-6.1z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>

                <p className="jur-foot">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    id="btn-switch-to-register"
                    onClick={() => {
                      setAuthMode('register')
                      setLoginEmailError('')
                      setLoginPwError('')
                    }}
                  >
                    Register
                  </button>
                </p>
              </form>
            </div>
          )
        ) : (
          /* ── PASS CONFIRMED / VERIFIED STATE ── */
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300 text-center py-2">
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
                <span className="text-xs font-mono font-semibold text-[#6e6558]">
                  № {passNumber}
                </span>
              </div>

              <div className="space-y-1">
                <h3
                  className="text-sm font-serif text-[#1c1813] font-semibold"
                  style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                >
                  The Living Gallery Exhibition
                </h3>
                <p className="text-xs text-[#6e6558]">
                  Grand Master Hall · 3D Interactive Exhibition
                </p>
                <div className="flex items-center gap-2 text-xs text-[#6e6558] pt-0.5">
                  <Calendar size={13} className="text-[#c59b27]" />
                  <span>15 OCT — 30 NOV 2026</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-[#e6dfce] text-xs text-[#6e6558]">
                <span>
                  Holder: <strong className="text-[#1c1813] font-semibold">{fullName || 'Patron'}</strong>
                </span>
                <span className="text-[#10B981] flex items-center gap-1.5 font-semibold text-[11px]">
                  <ShieldCheck size={14} /> Verified
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setIsRegistered(false)}
                className="w-full sm:w-auto sm:min-w-[160px] bg-gradient-to-r from-[#d4af37] to-[#b3871d] hover:brightness-105 text-[#ffffff] py-2.5 px-6 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-xs"
              >
                Switch Account
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#e6dfce] hover:bg-[#faf7f0] text-xs font-medium text-[#6e6558] hover:text-[#1c1813] transition-colors cursor-pointer flex items-center justify-center gap-2"
                title="Copy Pass Reference"
              >
                {isCopied ? <CheckCircle2 size={14} className="text-[#10B981]" /> : <Share2 size={14} />}
                {isCopied ? 'Copied' : 'Share Pass'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export const RegistrationLoginForm = EventAdvertisingPanel
export default EventAdvertisingPanel
