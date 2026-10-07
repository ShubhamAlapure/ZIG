import { useState, useEffect, useMemo } from 'react'
import {
  ArrowRight,
  ArrowDown,
  CheckCircle2,
  X,
  Landmark,
  ShieldCheck,
  Ticket,
  Calendar,
  Eye,
  EyeOff,
  Check,
  Share2,
} from 'lucide-react'

// ── 1. Vertical Luxury Museum-Style "JOIN US" Registration Modal ──────────────
function JoinUsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
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

  if (!isOpen) return null

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
    setIsRegistered(true)
  }

  const handleGoogleJoin = () => {
    if (!fullName) setFullName('Google Patron')
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
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      className="jur-overlay fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
    >
      <style>{`
        .jur-overlay {
          --bg:#0f0c2b;
          --card:#1a1547;
          --ink:#f3efe2;
          --mute:#a9a5c4;
          --line:#3a3470;
          --gold:#cfb04e;
          --gold-d:#e0c46a;
          --err:#ff8f87;
          --ok:#7bd49c;
          --on-gold:#17123f;
          box-sizing: border-box;
          font-family: Montserrat, system-ui, sans-serif;
        }
        .jur-card {
          width: 100%;
          max-width: 460px;
          padding: 36px 32px;
          border-radius: 28px;
          background: color-mix(in srgb, var(--card) 95%, transparent);
          -webkit-backdrop-filter: blur(18px) saturate(1.2);
          backdrop-filter: blur(18px) saturate(1.2);
          border: 1px solid color-mix(in srgb, var(--line) 70%, transparent);
          box-shadow: 0 30px 80px rgba(23,18,63,.28);
          position: relative;
          overflow: hidden;
          isolation: isolate;
          --tex: .55;
          text-align: left;
          color: var(--ink);
          margin: auto;
        }
        .jur-card:before {
          content: "";
          position: absolute;
          inset: -30px;
          z-index: -1;
          pointer-events: none;
          opacity: var(--tex);
          filter: blur(14px);
          background: radial-gradient(circle at 16% 10%,#6f94cf 0 15%,transparent 16%),radial-gradient(circle at 88% 28%,#d9c78f 0 9%,transparent 10%),linear-gradient(160deg,transparent 0 34%,#4a74b8 34% 50%,transparent 50%),radial-gradient(circle at 72% 88%,#3f68ad 0 24%,transparent 25%),radial-gradient(circle at 8% 70%,#8fb0e0 0 12%,transparent 13%),repeating-linear-gradient(100deg,#3f68ad 0 16px,transparent 16px 44px);
        }
        .jur-card:after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: .14;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        }
        .jur-hd { text-align: center; margin-bottom: 24px; }
        .jur-eyebrow { font: 600 11px Montserrat,sans-serif; letter-spacing: .3em; text-transform: uppercase; color: var(--gold-d); display: flex; justify-content: center; gap: 10px; align-items: center; }
        .jur-eyebrow:before, .jur-eyebrow:after { content: ""; width: 5px; height: 5px; border-radius: 50%; background: var(--gold); }
        .jur-hd h1 { font: 700 46px/1.05 'Playfair Display', Georgia, serif; margin: 10px 0 6px; letter-spacing: -.01em; color: var(--ink); }
        .jur-sub { color: var(--mute); margin: 0; font-size: 15px; font-weight: 400; line-height: 1.5; }
        .jur-orn { display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 14px; }
        .jur-orn span { width: 56px; height: 1px; background: var(--line); display: block; }
        .jur-orn b { width: 6px; height: 6px; background: var(--gold); transform: rotate(45deg); display: block; }
        .jur-x { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; border: 0; border-radius: 50%; background: none; color: var(--mute); font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .jur-x:hover { background: var(--line); color: var(--ink); }
        .jur-x:focus-visible { outline: 2px solid var(--gold-d); }
        .jur-google { width: 100%; display: flex; align-items: center; justify-content: center; gap: 10px; padding: 13px; border: 1px solid var(--line); background: var(--card); color: var(--ink); border-radius: 12px; font: 500 14px Montserrat,sans-serif; cursor: pointer; transition: border-color .15s, background .15s; }
        .jur-google:hover { border-color: var(--gold-d); }
        .jur-or { display: flex; align-items: center; gap: 12px; color: var(--mute); font-size: 13px; margin: 20px 0; }
        .jur-or:before, .jur-or:after { content: ""; flex: 1; height: 1px; background: var(--line); }
        .jur-seg { display: grid; grid-template-columns: 1fr 1fr; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 4px; margin-bottom: 20px; }
        .jur-seg label { text-align: center; padding: 0; border-radius: 9px; cursor: pointer; font-weight: 500; font-size: 14px; color: var(--mute); transition: background .15s, color .15s; margin: 0; }
        .jur-seg input { position: absolute; opacity: 0; pointer-events: none; }
        .jur-seg input:checked+span { background: var(--gold); color: var(--on-gold); }
        .jur-seg span { display: block; padding: 10px 8px; border-radius: 9px; }
        .jur-seg input:focus-visible+span { outline: 2px solid var(--gold-d); outline-offset: 2px; }
        .jur-field { margin-bottom: 16px; text-align: left; }
        .jur-field label { display: block; font-weight: 500; font-size: 13px; margin-bottom: 6px; color: var(--ink); }
        .jur-inp { position: relative; }
        .jur-inp input { width: 100%; box-sizing: border-box; padding: 13px 14px; border: 1px solid var(--line); border-radius: 12px; background: var(--card); color: var(--ink); font: 400 15px Montserrat,sans-serif; transition: border-color .15s, box-shadow .15s; outline: none; }
        .jur-inp input::placeholder { color: var(--mute); opacity: .7; }
        .jur-inp input:focus { outline: none; border-color: var(--gold-d); box-shadow: 0 0 0 3px rgba(207,176,78,.3); }
        .jur-field.bad input { border-color: var(--err); }
        .jur-field.good input { border-color: var(--ok); }
        .jur-msg { font-size: 12.5px; min-height: 18px; margin-top: 5px; color: var(--err); text-align: left; }
        .jur-eye { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); border: 0; background: none; color: var(--mute); padding: 8px; cursor: pointer; font: 500 12px Montserrat,sans-serif; }
        .jur-eye:focus-visible { outline: 2px solid var(--gold-d); border-radius: 8px; }
        .jur-meter { display: flex; gap: 4px; margin-top: 8px; }
        .jur-meter b { flex: 1; height: 4px; border-radius: 2px; background: var(--line); transition: background .2s; }
        .jur-hint { font-size: 12.5px; color: var(--mute); margin-top: 5px; text-align: left; }
        .jur-chk { display: flex; gap: 10px; align-items: flex-start; font-size: 13px; color: var(--mute); margin: 18px 0 6px; text-align: left; cursor: pointer; }
        .jur-chk input { width: 18px; height: 18px; margin: 1px 0 0; accent-color: var(--gold-d); flex: none; cursor: pointer; }
        .jur-chk a { color: var(--gold-d); font-weight: 500; text-decoration: none; }
        .jur-chk a:hover { text-decoration: underline; }
        .jur-robot { display: flex; align-items: center; gap: 12px; border: 1px solid var(--line); background: var(--card); border-radius: 12px; padding: 12px 14px; margin: 14px 0 18px; font-size: 14px; cursor: pointer; text-align: left; }
        .jur-robot input { width: 20px; height: 20px; accent-color: var(--gold-d); cursor: pointer; }
        .jur-robot label { cursor: pointer; color: var(--ink); margin: 0; font-weight: 400; }
        .jur-robot small { margin-left: auto; color: var(--mute); font-size: 11px; }
        .jur-cta { width: 100%; padding: 15px; border: 0; border-radius: 12px; background: var(--gold); color: var(--on-gold); font: 600 15px Montserrat,sans-serif; cursor: pointer; transition: filter .15s, transform .1s; }
        .jur-cta:hover { filter: brightness(1.06); }
        .jur-cta:active { transform: scale(.99); }
        .jur-cta:disabled { opacity: .55; cursor: not-allowed; }
        .jur-cta:focus-visible, .jur-google:focus-visible { outline: 2px solid var(--gold-d); outline-offset: 3px; }
        .jur-foot { text-align: center; color: var(--mute); margin-top: 16px; margin-bottom: 0; font-size: 14px; }
        .jur-foot a { color: var(--gold-d); font-weight: 600; text-decoration: none; cursor: pointer; background: transparent; border: 0; font-size: inherit; }
        .jur-foot a:hover { text-decoration: underline; }
        @media (max-width:480px){.jur-card{padding:28px 20px;border-radius:20px}}
      `}</style>

      <div className="jur-card">
        <button
          type="button"
          className="jur-x"
          onClick={onClose}
          aria-label="Close"
        >
          &#10005;
        </button>

        {!isRegistered ? (
          <form onSubmit={handleSubmit} noValidate>
            <div className="jur-hd">
              <div className="jur-eyebrow">The Living Gallery</div>
              <h1>JOIN US</h1>
              <p className="jur-sub">Enter your details to get access</p>
              <div className="jur-orn">
                <span></span>
                <b></b>
                <span></span>
              </div>
            </div>

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
            <div className="jur-msg" style={{ margin: '0 0 12px' }}>
              {termsError}
            </div>

            <button className="jur-cta" type="submit">
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
              Already a member?{' '}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  if (!fullName) setFullName('Returning Patron')
                  setIsRegistered(true)
                }}
              >
                Log in
              </a>
            </p>
          </form>
        ) : (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-3 duration-300 text-center py-4">
            <div className="w-16 h-16 rounded-full bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center mx-auto text-[#10B981]">
              <CheckCircle2 size={38} />
            </div>

            <div>
              <span className="text-xs tracking-[0.25em] uppercase text-[#E0C46A] font-bold">
                Pass Confirmed · Verified
              </span>
              <h2
                className="text-2xl sm:text-3xl font-serif text-[#F3EFE2] mt-1.5"
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
              >
                Welcome, {fullName || 'Patron'}
              </h2>
              <p className="text-sm text-[#A9A5C4] mt-1">
                You have received honorary access as an{' '}
                <strong className="text-[#F3EFE2]">
                  {userType === 'artist' ? 'Artist Patron' : 'Art Lover & Collector'}
                </strong>
                .
              </p>
            </div>

            {/* Commemorative Pass Card */}
            <div className="rounded-xl border border-[#3A3470] bg-[#120E36] p-5 text-left shadow-xs space-y-3 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-[#3A3470] pb-3">
                <div className="flex items-center gap-2">
                  <Landmark size={16} className="text-[#E0C46A]" />
                  <span className="text-[10px] uppercase tracking-wider text-[#F3EFE2] font-bold">
                    The Living Gallery · Grand Master Hall
                  </span>
                </div>
                <span className="text-xs font-mono font-semibold text-[#A9A5C4]">
                  № {passNumber}
                </span>
              </div>

              <div className="space-y-1">
                <h3
                  className="text-base font-serif text-[#F3EFE2] font-semibold"
                  style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                >
                  The Living Gallery Exhibition
                </h3>
                <p className="text-xs text-[#A9A5C4]">
                  Grand Master Hall · 3D Interactive Exhibition
                </p>
                <div className="flex items-center gap-2 text-xs text-[#A9A5C4] pt-0.5">
                  <Calendar size={13} className="text-[#E0C46A]" />
                  <span>15 OCT — 30 NOV 2026</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#3A3470] text-xs text-[#A9A5C4]">
                <span>
                  Holder: <strong className="text-[#F3EFE2] font-semibold">{fullName || 'Patron'}</strong>
                </span>
                <span className="text-[#10B981] flex items-center gap-1.5 font-semibold">
                  <ShieldCheck size={14} /> Verified
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={onClose}
                className="w-full sm:w-auto sm:min-w-[180px] bg-[#CFB04E] hover:brightness-105 text-[#17123F] py-3 px-8 rounded-full font-bold text-xs uppercase tracking-wider cursor-pointer transition-all shadow-xs"
              >
                Enter Museum Hall
              </button>
              <button
                onClick={handleCopyCode}
                className="w-full sm:w-auto px-6 py-3 rounded-full border border-[#3A3470] hover:bg-white/5 text-xs font-medium text-[#A9A5C4] hover:text-[#F3EFE2] transition-colors cursor-pointer flex items-center justify-center gap-2"
                title="Copy Pass Reference"
              >
                {isCopied ? <CheckCircle2 size={15} className="text-[#10B981]" /> : <Share2 size={15} />}
                {isCopied ? 'Copied' : 'Share Pass'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 2. Curatorial Details Modal Component ────────────────────────────────────
function ExhibitionDetailsModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar bg-[#FAF8F5] rounded-2xl border border-[#E3DDD3] shadow-[0_24px_64px_rgba(0,0,0,0.35)] p-6 sm:p-8 text-[#16221B]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-black/5 text-[#55635C] hover:text-[#16221B] transition-colors cursor-pointer"
          aria-label="Close modal"
        >
          <X size={17} />
        </button>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#1E362A] font-bold">
            Curatorial Statement
          </span>
        </div>

        <h2
          className="text-2xl sm:text-3xl font-serif text-[#16221B] mb-1"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
        >
          The Living Gallery
        </h2>

        <p className="text-xs text-[#1E362A] mb-5 italic font-serif">
          European Fine Art Archival Society · Master Hall Wing
        </p>

        <div className="space-y-3.5 text-xs text-[#55635C] leading-relaxed">
          <p>
            The European Museum of Fine Art presents an open exhibition bringing together classical European portraiture, monumental ceiling frescoes, dynamic seascapes, and intricate botanical drawings within the monumental Master Hall.
          </p>
          <p>
            Visitors have complete freedom of movement in the full 3D gallery space: step right up to gilded frames, inspect fine brushstrokes in close-up, and explore detailed provenance for each masterwork.
          </p>
        </div>

        {/* Info Grid */}
        <div className="my-5 p-4 rounded-xl bg-white border border-[#E3DDD3] grid grid-cols-2 gap-3.5 text-xs shadow-xs">
          <div>
            <span className="text-[9px] text-[#1E362A] uppercase tracking-wider block font-bold">Chief Curator</span>
            <span className="text-[#16221B] font-medium">Dr. Helena Sterling, MA Oxon</span>
          </div>
          <div>
            <span className="text-[9px] text-[#1E362A] uppercase tracking-wider block font-bold">Admission Policy</span>
            <span className="text-[#16221B] font-medium">Free Exhibition Pass</span>
          </div>
          <div>
            <span className="text-[9px] text-[#1E362A] uppercase tracking-wider block font-bold">Exhibition Wing</span>
            <span className="text-[#16221B] font-medium">Grand Master Hall</span>
          </div>
          <div>
            <span className="text-[9px] text-[#1E362A] uppercase tracking-wider block font-bold">Dates</span>
            <span className="text-[#16221B] font-medium">15 OCT — 30 NOV 2026</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-[#1E362A] hover:bg-[#16281F] text-white py-3 rounded-xl font-semibold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-xs"
        >
          Close Curatorial Notes
        </button>
      </div>
    </div>
  )
}

// ── 3. Completely Rebuilt Right 30% Panel from Scratch ────────────────────────
export function EventAdvertisingPanel() {
  const [isPassModalOpen, setIsPassModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  return (
    <>
      <aside
        className="w-full h-full overflow-y-auto bg-[#FAF8F5] text-[#16221B] px-6 py-6 sm:px-7 sm:py-7 lg:px-8 lg:py-7 flex flex-col justify-between select-text custom-scrollbar border-l border-[#E3DDD3] shadow-[-8px_0_32px_rgba(0,0,0,0.04)]"
        aria-label="Exhibition Editorial Sidebar"
      >
        <div className="flex flex-col gap-4 sm:gap-5">
          {/* ── 1. TOP HEADER ────────────────────────────────────────────────── */}
          <div>
            <div className="flex items-center justify-between pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#1E362A] flex items-center justify-center text-white">
                  <Landmark size={12} />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[10px] sm:text-[10.5px] tracking-[0.22em] uppercase font-bold text-[#16221B] leading-tight font-serif">
                    THE EUROPEAN MUSEUM
                  </span>
                  <span className="text-[8.5px] sm:text-[9px] tracking-[0.2em] uppercase text-[#66776F] font-medium leading-tight">
                    OF FINE ART
                  </span>
                </div>
              </div>

              <span
                className="font-serif text-[13.5px] font-semibold tracking-wider text-[#1E362A]"
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
              >
                NO. 001
              </span>
            </div>

            {/* Thin divider */}
            <div className="h-px bg-[#E3DDD3] w-full" />
          </div>

          {/* ── 2. EXACT HERO DESIGN ELEMENT (CENTERED STANDALONE SECTION) ─────── */}
          <section
            aria-label="Exhibition Invitation Hero"
            className="flex flex-col items-start text-left space-y-2.5 sm:space-y-3 py-1"
          >
            {/* AN OPEN INVITATION */}
            <span className="text-[10.5px] sm:text-[11px] tracking-[0.26em] uppercase font-bold text-[#16221B] block">
              AN OPEN INVITATION
            </span>

            {/* Three Overlapping Thin Circular Rings */}
            <div className="py-1">
              <svg
                width="88"
                height="44"
                viewBox="0 0 88 44"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#7E9D8B]"
                aria-hidden="true"
              >
                <circle cx="22" cy="22" r="18" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="44" cy="22" r="18" stroke="currentColor" strokeWidth="1.3" />
                <circle cx="66" cy="22" r="18" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </div>

            {/* COME A LITTLE CLOSER */}
            <span className="text-[9.5px] sm:text-[10px] tracking-[0.24em] uppercase font-semibold text-[#788880] block">
              COME A LITTLE CLOSER
            </span>

            {/* Main Heading: Not just art. / An experience. */}
            <h1
              className="font-serif text-[36px] sm:text-[40px] xl:text-[44px] leading-[1.04] tracking-[-0.025em] text-[#16221B] pt-0.5"
              style={{ fontFamily: "'Cormorant Garamond', 'Playfair Display', serif" }}
            >
              <span className="block font-semibold">Not just art.</span>
              <span className="block italic font-normal text-[#213C2D]">
                An experience.
              </span>
            </h1>
          </section>

          {/* ── 3. DESCRIPTION (~3 lines) ────────────────────────────────────── */}
          <div>
            <p className="text-[13px] sm:text-[13.5px] text-[#55635C] leading-[1.65] font-normal">
              Some things are better felt than explained. Step inside, slow down, and discover something that speaks to you.
            </p>
          </div>

          {/* ── 4. FEATURED EXHIBITION ───────────────────────────────────────── */}
          <div className="space-y-2">
            <div className="h-px bg-[#E3DDD3] w-full" />
            <div className="pt-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#C2613D] flex-shrink-0" />
                <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-[#16221B]">
                  THE LIVING GALLERY
                </h2>
              </div>
              <p className="text-[12px] text-[#6B7870] mt-0.5 pl-4 font-normal">
                Contemporary art, without boundaries.
              </p>
            </div>

            {/* Small Controlled Exhibition Thumbnail */}
            <div className="relative rounded-xl overflow-hidden border border-[#E3DDD3] aspect-[16/8] shadow-xs bg-[#EDE8DF] mt-2 group">
              <img
                src="/artworks/art_1.jpg"
                alt="The Living Gallery Fresco"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-1.5 left-2.5 right-2.5 text-white flex items-center justify-between">
                <span
                  className="text-[10.5px] font-serif font-medium text-white/95 truncate"
                  style={{ fontFamily: "'Playfair Display', serif" }}
                >
                  Grand Rotunda Fresco · c. 1780
                </span>
                <span className="text-[8px] uppercase tracking-wider bg-white/85 text-[#1E362A] px-1.5 py-0.5 rounded font-bold backdrop-blur-xs">
                  Highlight
                </span>
              </div>
            </div>
          </div>

          {/* ── 5. EXHIBITION INFORMATION (2-Column Grid) ────────────────────── */}
          <section
            aria-label="Exhibition Schedule Information"
            className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-white border border-[#E3DDD3] shadow-xs"
          >
            {/* DATE */}
            <div className="flex flex-col">
              <span className="text-[8.5px] uppercase tracking-[0.2em] font-bold text-[#788880]">
                DATE
              </span>
              <span className="text-[11.5px] font-semibold text-[#16221B] mt-0.5">
                15 OCT — 30 NOV 2026
              </span>
            </div>

            {/* TIME */}
            <div className="flex flex-col">
              <span className="text-[8.5px] uppercase tracking-[0.2em] font-bold text-[#788880]">
                TIME
              </span>
              <span className="text-[11.5px] font-semibold text-[#16221B] mt-0.5">
                10:00 AM — 7:00 PM
              </span>
            </div>

            {/* LOCATION */}
            <div className="flex flex-col pt-1.5 border-t border-[#F0EBE3]">
              <span className="text-[8.5px] uppercase tracking-[0.2em] font-bold text-[#788880]">
                LOCATION
              </span>
              <span className="text-[11.5px] font-semibold text-[#16221B] mt-0.5">
                Grand Master Hall
              </span>
            </div>

            {/* ENTRY */}
            <div className="flex flex-col pt-1.5 border-t border-[#F0EBE3]">
              <span className="text-[8.5px] uppercase tracking-[0.2em] font-bold text-[#788880]">
                ENTRY
              </span>
              <span className="text-[11.5px] font-semibold text-[#1E362A] mt-0.5">
                Free Exhibition Pass
              </span>
            </div>
          </section>

          {/* ── 6. PRIMARY CTA BUTTON ────────────────────────────────────────── */}
          <div className="space-y-2 pt-0.5">
            <button
              id="btn-join-exhibition"
              onClick={() => setIsPassModalOpen(true)}
              className="w-full bg-[#1E362A] hover:bg-[#16281F] text-white px-5 py-3.5 rounded-xl flex items-center justify-between shadow-[0_4px_16px_rgba(30,54,42,0.22)] hover:shadow-[0_6px_22px_rgba(30,54,42,0.32)] cursor-pointer transition-all duration-300 group"
            >
              <span className="text-[13.5px] font-semibold tracking-wide">
                JOIN THE EXHIBITION
              </span>
              <ArrowRight
                size={16}
                className="text-white/90 group-hover:translate-x-1 transition-transform duration-200"
              />
            </button>

            <p className="text-[11px] text-[#788880] text-center font-normal">
              Everyone is welcome. Curiosity is all you need.
            </p>
          </div>

          {/* ── 7. EXPERIENCE SECTION (3 Compact Rows) ───────────────────────── */}
          <section aria-label="Museum Experience Points" className="space-y-2">
            <div className="h-px bg-[#E3DDD3] w-full" />

            <span className="text-[9px] uppercase tracking-[0.22em] font-bold text-[#788880] block pt-0.5">
              THE EXPERIENCE
            </span>

            <div className="space-y-2 text-xs">
              {/* Row 01 */}
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/70 transition-colors">
                <span className="font-mono text-[11px] font-bold text-[#7E9D8B] w-5">
                  01
                </span>
                <span className="font-semibold text-[#16221B] text-[12px]">
                  Explore the Master Hall
                </span>
              </div>

              {/* Row 02 */}
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/70 transition-colors">
                <span className="font-mono text-[11px] font-bold text-[#7E9D8B] w-5">
                  02
                </span>
                <span className="font-semibold text-[#16221B] text-[12px]">
                  Discover Featured Paintings
                </span>
              </div>

              {/* Row 03 */}
              <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/70 transition-colors">
                <span className="font-mono text-[11px] font-bold text-[#7E9D8B] w-5">
                  03
                </span>
                <span className="font-semibold text-[#16221B] text-[12px]">
                  Interactive Artwork Viewing
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* ── 8. BOTTOM EDITORIAL FOOTER ────────────────────────────────────── */}
        <footer className="pt-4 mt-4 border-t border-[#E3DDD3] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {/* Overlapping Monograms (É, M, A) */}
            <div className="flex items-center -space-x-1.5" aria-hidden="true">
              <div
                className="w-6 h-6 rounded-full bg-[#EDE7DD] border border-[#FAF8F5] flex items-center justify-center text-[#16221B] font-serif text-[10px] font-bold shadow-xs"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                É
              </div>
              <div
                className="w-6 h-6 rounded-full bg-[#BD5E3B] border border-[#FAF8F5] flex items-center justify-center text-white font-serif text-[10px] font-bold shadow-xs"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                M
              </div>
              <div
                className="w-6 h-6 rounded-full bg-[#7E9D8B] border border-[#FAF8F5] flex items-center justify-center text-white font-serif text-[10px] font-bold shadow-xs"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                A
              </div>
            </div>

            {/* Editorial Caption */}
            <div className="flex flex-col text-left">
              <span className="text-[10px] text-[#6B7870] font-normal leading-none">
                Different minds.
              </span>
              <span className="text-[11px] text-[#16221B] font-semibold leading-none mt-1">
                One shared space.
              </span>
            </div>
          </div>

          {/* Downward Arrow Trigger */}
          <button
            onClick={() => setIsDetailsModalOpen(true)}
            className="p-1.5 rounded-full hover:bg-black/5 text-[#55635C] hover:text-[#16221B] transition-colors cursor-pointer"
            title="Exhibition Notes & Overview"
            aria-label="Read curatorial notes"
          >
            <ArrowDown size={16} />
          </button>
        </footer>
      </aside>

      {/* Modal Dialogs */}
      <JoinUsModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
      />
      <ExhibitionDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
      />
    </>
  )
}
