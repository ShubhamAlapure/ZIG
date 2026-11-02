import React, { useState, useId } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface PasswordFieldProps {
  id?: string;
  label?: string;
  value: string;
  onChange: (val: string) => void;
  error?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  required?: boolean;
  showStrengthMeter?: boolean;
  minLength?: number;
  autoComplete?: string;
  name?: string;
}

/** Compute a 0–5 strength score based on rule checks */
function getStrength(val: string): {
  score: number;
  checks: {
    length: boolean;
    upper: boolean;
    lower: boolean;
    number: boolean;
    symbol: boolean;
  };
} {
  const checks = {
    length: val.length >= 8,
    upper: /[A-Z]/.test(val),
    lower: /[a-z]/.test(val),
    number: /[0-9]/.test(val),
    symbol: /[^A-Za-z0-9]/.test(val),
  };
  return { score: Object.values(checks).filter(Boolean).length, checks };
}

function strengthLabel(score: number): { text: string; color: string } {
  if (score <= 1) return { text: 'Weak', color: 'var(--auth-danger)' };
  if (score <= 2) return { text: 'Weak', color: 'var(--auth-danger)' };
  if (score <= 3) return { text: 'Moderate', color: '#D97706' };
  if (score === 4) return { text: 'Strong', color: 'var(--auth-success)' };
  return { text: 'Fort Knox', color: 'var(--auth-gold)' };
}

function barColor(score: number): string {
  if (score <= 2) return 'var(--auth-danger)';
  if (score <= 3) return '#D97706';
  if (score === 4) return 'var(--auth-success)';
  return 'var(--auth-gold)';
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id: idProp,
  label = 'Password',
  value,
  onChange,
  error,
  onFocus,
  onBlur,
  disabled = false,
  required = false,
  showStrengthMeter = false,
  minLength = 6,
  autoComplete = 'current-password',
  name,
}) => {
  const autoId = useId();
  const id = idProp || autoId;

  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [eyeBlinking, setEyeBlinking] = useState(false);

  const isFloating = isFocused || value.length > 0;
  const isUnlocked = value.length >= minLength;

  const { score: passScore, checks } = getStrength(value);
  const { text: strengthText, color: strengthColor } = strengthLabel(passScore);

  const handleTogglePassword = () => {
    setEyeBlinking(true);
    setShowPassword((prev) => !prev);
    setTimeout(() => setEyeBlinking(false), 200);
  };

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const borderColor = error
    ? 'var(--auth-danger)'
    : isFocused
    ? 'var(--auth-gold-amber)'
    : isUnlocked
    ? '#059669'
    : 'rgba(229,169,28,0.24)';

  const boxShadow = error
    ? '0 0 0 3px var(--auth-danger-ring)'
    : isFocused
    ? 'var(--auth-clay-shadow)'
    : isUnlocked
    ? '0 0 0 2px rgba(5,150,105,0.15)'
    : '0 2px 8px -2px rgba(23,20,18,0.06)';

  const iconColor = isFocused
    ? 'var(--auth-gold)'
    : isUnlocked
    ? '#059669'
    : 'var(--auth-ink-muted)';

  // Strength bar fill: 0–100%
  const barFillPct = passScore === 0 ? 0 : (passScore / 5) * 100;

  return (
    <div className="w-full text-left">
      <div
        className={[
          'relative rounded-2xl transition-all duration-300',
          'bg-white/70 backdrop-blur-[var(--auth-blur)]',
          isFocused ? 'auth-field-focused' : '',
          disabled ? 'opacity-60 cursor-not-allowed' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        style={{
          border: `1px solid ${borderColor}`,
          boxShadow,
          transition: 'border-color 0.25s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Lock icon — animates between locked / unlocked */}
        <div
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-all duration-300"
          style={{ color: iconColor }}
          aria-hidden="true"
        >
          {isUnlocked ? (
            /* Unlocked shackle */
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
          ) : (
            /* Locked shackle */
            <svg
              className="w-[18px] h-[18px]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
        </div>

        {/* Floating Label */}
        <label
          htmlFor={id}
          className="absolute pointer-events-none select-none z-10"
          style={{
            left: isFloating ? '0.75rem' : '2.625rem',
            top: isFloating ? '-0.6rem' : '50%',
            transform: isFloating ? 'translateY(0)' : 'translateY(-50%)',
            fontSize: isFloating ? '0.6875rem' : '0.8125rem',
            color: error
              ? 'var(--auth-danger)'
              : isFocused
              ? 'var(--auth-gold)'
              : 'var(--auth-ink-muted)',
            background: isFloating ? 'white' : 'transparent',
            padding: isFloating ? '0 4px' : undefined,
            borderRadius: isFloating ? '3px' : undefined,
            letterSpacing: isFloating ? '0.04em' : undefined,
            fontWeight: isFloating ? 700 : 500,
            textTransform: isFloating ? 'uppercase' : 'none',
            transition:
              'left 0.2s ease, top 0.2s ease, transform 0.2s ease, font-size 0.2s ease, color 0.2s ease',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--auth-gold)', marginLeft: '2px' }}>*</span>
          )}
        </label>

        {/* Password input */}
        <input
          id={id}
          name={name || id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder=""
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${id}-err`
              : showStrengthMeter
              ? `${id}-strength`
              : undefined
          }
          required={required}
          className="w-full bg-transparent pl-10 pr-10 py-3 text-sm font-medium outline-none rounded-2xl"
          style={{ color: 'var(--auth-ink)', caretColor: 'var(--auth-gold)' }}
        />

        {/* Eye toggle */}
        <button
          type="button"
          onClick={handleTogglePassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg cursor-pointer select-none transition-all duration-200"
          style={{
            color: isFocused ? 'var(--auth-gold)' : 'var(--auth-ink-muted)',
            opacity: eyeBlinking ? 0.5 : 1,
            transform: `translateY(-50%) scale(${eyeBlinking ? 0.88 : 1})`,
            minWidth: '44px',
            minHeight: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${id}-err`}
          role="alert"
          aria-live="polite"
          className="flex items-center gap-1.5 mt-1.5 pl-1 text-[11.5px] font-semibold animate-fadeIn"
          style={{ color: 'var(--auth-danger)' }}
        >
          <svg
            className="w-3.5 h-3.5 flex-shrink-0"
            viewBox="0 0 16 16"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1Zm0 10a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm.75-3.75a.75.75 0 0 1-1.5 0V5.25a.75.75 0 0 1 1.5 0v2z" />
          </svg>
          {error}
        </p>
      )}

      {/* Strength meter */}
      {showStrengthMeter && value.length > 0 && (
        <div
          id={`${id}-strength`}
          className="mt-2 pl-0.5 pr-0.5 space-y-1.5 animate-fadeIn"
          aria-label={`Password strength: ${strengthText}`}
        >
          {/* Bar track */}
          <div className="flex items-center gap-2">
            <div
              className="flex-1 h-1.5 rounded-full overflow-hidden"
              style={{ background: 'rgba(23,20,18,0.08)' }}
            >
              <div
                style={{
                  width: `${barFillPct}%`,
                  height: '100%',
                  background: barColor(passScore),
                  borderRadius: '9999px',
                  animation: 'auth-paint-stroke 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
                  transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1), background 0.3s ease',
                }}
              />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-wider whitespace-nowrap"
              style={{ color: strengthColor, minWidth: '5rem', textAlign: 'right' }}
            >
              {strengthText}
            </span>
          </div>

          {/* Rule checklist */}
          <div className="flex items-center gap-2 flex-wrap">
            {(
              [
                { key: 'length', label: '8+ chars' },
                { key: 'upper', label: 'A–Z' },
                { key: 'lower', label: 'a–z' },
                { key: 'number', label: '0–9' },
                { key: 'symbol', label: '#@!' },
              ] as { key: keyof typeof checks; label: string }[]
            ).map(({ key, label }) => (
              <span
                key={key}
                className="flex items-center gap-0.5 text-[10px] font-semibold transition-colors duration-200"
                style={{
                  color: checks[key] ? 'var(--auth-success)' : 'var(--auth-ink-muted)',
                }}
              >
                {checks[key] ? (
                  <svg
                    className="w-3 h-3"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    style={{
                      strokeDasharray: 18,
                      strokeDashoffset: 0,
                      animation: 'auth-check-draw 0.35s ease forwards',
                    }}
                  >
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                ) : (
                  <svg
                    className="w-3 h-3 opacity-40"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden="true"
                  >
                    <circle cx="6" cy="6" r="4" />
                  </svg>
                )}
                {label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordField;
