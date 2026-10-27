import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

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

  const handleTogglePassword = () => {
    setIsBlinking(true);
    setShowPassword((prev) => !prev);
    setTimeout(() => setIsBlinking(false), 200);
  };

  return (
    <div className="w-full text-left">
      <div
        className={`canvas-frame-input relative transition-all duration-200 ${
          error ? 'is-invalid' : isUnlocked ? 'is-valid' : ''
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-[#FAF8F5]' : ''}`}
      >
        {/* Reactive Lock Icon (unlocked vs locked) */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-[#9E8A70] transition-all duration-200">
          {isUnlocked ? (
            // Unlocked golden shackle icon
            <svg
              className="w-4 h-4 text-[#C5A059] transition-transform duration-300 scale-105"
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
                isFocused ? 'text-[#C5A059]' : 'text-[#9E8A70]'
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
              ? 'left-3 -top-2.5 px-1.5 py-0.5 bg-white text-[9.5px] font-bold tracking-[0.06em] uppercase text-[#9E7A32] rounded border border-[#C5A059]/30 shadow-xs z-10'
              : 'left-10 top-1/2 -translate-y-1/2 text-xs font-medium text-[#7D705C]'
          }`}
        >
          {label}
          {required && <span className="text-[#C5A059] ml-0.5">*</span>}
        </label>

        {/* Password Input */}
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
          placeholder=""
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={
            error
              ? `${id}-error`
              : showStrengthMeter
              ? `${id}-strength`
              : undefined
          }
          className="w-full bg-transparent pl-10 pr-10 py-2.5 sm:py-3 text-[13px] sm:text-sm text-[#171412] placeholder-[#C2B7A3] font-medium outline-none rounded-xl"
        />

        {/* Eye Visibility Toggle */}
        <button
          type="button"
          onClick={handleTogglePassword}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-[#9E8A70] hover:text-[#9E7A32] transition-all cursor-pointer select-none ${
            isBlinking ? 'scale-90 opacity-60' : 'scale-100 opacity-100'
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

      {/* Horizontally Fit Compact Password Strength Meter */}
      {showStrengthMeter && value.length > 0 && (
        <div id={`${id}-strength`} className="mt-1.5 pl-0.5 pr-0.5 animate-fadeIn space-y-1">
          {/* Single horizontal row: 4 mini segments + live status badge */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1 flex-1">
              {[1, 2, 3, 4].map((seg) => {
                const isLit = seg <= (passScore <= 1 ? 1 : passScore <= 2 ? 2 : passScore <= 4 ? 3 : 4);
                return (
                  <div
                    key={seg}
                    className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                      isLit
                        ? passScore <= 2
                          ? 'bg-[#DC2626]'
                          : passScore <= 4
                          ? 'bg-[#D97706]'
                          : 'bg-[#059669]'
                        : 'bg-[#EAE2D2]'
                    }`}
                  />
                );
              })}
            </div>
            <span
              className={`text-[9.5px] font-bold uppercase tracking-wider transition-colors duration-200 whitespace-nowrap ${
                passScore <= 2
                  ? 'text-[#DC2626]'
                  : passScore <= 4
                  ? 'text-[#D97706]'
                  : 'text-[#059669]'
              }`}
            >
              {passScore <= 2 ? 'Weak' : passScore <= 4 ? 'Moderate' : 'Strong'}
            </span>
          </div>

          {/* Compact 1-line horizontal tags */}
          <div className="flex items-center justify-between text-[9px] text-[#8C7D6B] whitespace-nowrap">
            <span className={checks.length ? 'text-[#059669] font-bold' : ''}>8+ chars</span>
            <span>·</span>
            <span className={checks.upper ? 'text-[#059669] font-bold' : ''}>Uppercase</span>
            <span>·</span>
            <span className={checks.number ? 'text-[#059669] font-bold' : ''}>Number</span>
            <span>·</span>
            <span className={checks.symbol ? 'text-[#059669] font-bold' : ''}>Symbol</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordField;
