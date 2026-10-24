import React, { useState } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';

export interface PasswordFieldProps {
  id: string;
  label: string;
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
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id,
  label,
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
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);

  const isFloating = isFocused || (value && value.length > 0);
  const isUnlocked = value.length >= minLength;

  // Strength score calculation for registration
  const checks = {
    length: value.length >= 8,
    upper: /[A-Z]/.test(value),
    lower: /[a-z]/.test(value),
    number: /[0-9]/.test(value),
    symbol: /[^A-Za-z0-9]/.test(value),
  };

  const passScore = Object.values(checks).filter(Boolean).length;
  // Strength percentage 0 - 100%
  const strengthPercent = (passScore / 5) * 100;

  const strengthColor =
    passScore <= 2
      ? 'from-red-500 to-amber-500'
      : passScore <= 4
      ? 'from-amber-500 to-yellow-500'
      : 'from-yellow-500 to-emerald-500';

  const strengthLabel =
    passScore <= 2 ? 'Weak' : passScore <= 4 ? 'Moderate' : 'Strong & Masterly';

  const handleTogglePassword = () => {
    setIsBlinking(true);
    setShowPassword((prev) => !prev);
    setTimeout(() => setIsBlinking(false), 250);
  };

  return (
    <div className="w-full text-left">
      <div
        className={`canvas-frame-input relative transition-all duration-200 ${
          error ? 'is-invalid' : isUnlocked ? 'is-valid' : ''
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-[#F9F7F2]' : ''}`}
      >
        {/* Reactive Lock Icon (unlocked vs locked) */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-[#8C7654] transition-all duration-200">
          {isUnlocked ? (
            // Unlocked golden shackle icon
            <svg
              className="w-4 h-4 text-[#D98E04] transition-transform duration-300 scale-105"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 9.9-1" />
            </svg>
          ) : (
            // Locked shackle icon
            <svg
              className={`w-4 h-4 transition-colors duration-200 ${
                isFocused ? 'text-[#D98E04]' : 'text-[#8C7654]'
              }`}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          )}
        </div>

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`absolute pointer-events-none transition-all duration-200 select-none ${
            isFloating
              ? 'left-9 -top-2.5 px-1.5 bg-[#FAF7F0] text-[10px] font-bold uppercase tracking-widest text-[#B37400] rounded-sm shadow-xs'
              : 'left-10 top-1/2 -translate-y-1/2 text-xs font-medium text-[#7D705C]'
          }`}
        >
          {label}
          {required && <span className="text-[#D98E04] ml-0.5">*</span>}
        </label>

        {/* Input */}
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocus?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : showStrengthMeter ? `${id}-strength` : undefined}
          className="w-full bg-transparent pl-10 pr-12 py-2.5 sm:py-3 text-sm text-[#1E1A14] placeholder-[#C2B7A3] font-medium outline-none rounded-xl"
        />

        {/* Blinking Eye toggle button */}
        <button
          type="button"
          onClick={handleTogglePassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-lg text-[#8C7654] hover:text-[#B37400] transition-colors cursor-pointer select-none ${
            isBlinking ? 'scale-75 opacity-50' : 'scale-100 opacity-100'
          }`}
        >
          {showPassword ? (
            <EyeOff className="w-4 h-4 transition-transform duration-200" />
          ) : (
            <Eye className="w-4 h-4 transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Error message */}
      {error && (
        <p
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          className="text-[11px] font-medium text-[#DC2626] mt-1 pl-1 flex items-center gap-1 animate-fadeIn"
        >
          <span>⚠</span> {error}
        </p>
      )}

      {/* Animated Paint-Stroke Strength Meter (When enabled, e.g. for registration) */}
      {showStrengthMeter && value.length > 0 && (
        <div id={`${id}-strength`} className="mt-2 pl-1 pr-1 space-y-1.5 animate-fadeIn">
          <div className="flex items-center justify-between text-[11px] font-semibold">
            <span className="text-[#7D705C]">Palette Strength:</span>
            <span
              className={`font-bold transition-colors duration-300 ${
                passScore <= 2
                  ? 'text-red-600'
                  : passScore <= 4
                  ? 'text-amber-600'
                  : 'text-emerald-700'
              }`}
            >
              {strengthLabel}
            </span>
          </div>

          {/* Liquid brush stroke progress track */}
          <div className="h-1.5 w-full bg-[#EAE2D2] rounded-full overflow-hidden p-[1px] relative">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${strengthColor} transition-all duration-300 relative`}
              style={{ width: `${Math.max(12, strengthPercent)}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse" />
            </div>
          </div>

          {/* Requirements mini-checklist */}
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1 text-[10px] text-[#7D705C]">
            <span className={`flex items-center gap-1 ${checks.length ? 'text-emerald-700 font-semibold' : ''}`}>
              {checks.length ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-[#A89882]" />} 8+ Characters
            </span>
            <span className={`flex items-center gap-1 ${checks.upper ? 'text-emerald-700 font-semibold' : ''}`}>
              {checks.upper ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-[#A89882]" />} Uppercase letter
            </span>
            <span className={`flex items-center gap-1 ${checks.number ? 'text-emerald-700 font-semibold' : ''}`}>
              {checks.number ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-[#A89882]" />} At least 1 number
            </span>
            <span className={`flex items-center gap-1 ${checks.symbol ? 'text-emerald-700 font-semibold' : ''}`}>
              {checks.symbol ? <Check className="w-3 h-3 text-emerald-600" /> : <X className="w-3 h-3 text-[#A89882]" />} Special symbol
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordField;
