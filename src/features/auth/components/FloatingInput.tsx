import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';

export interface FloatingInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
  error?: string;
  isValid?: boolean;
  isEmail?: boolean;
  leadingIcon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  disabled?: boolean;
  autoComplete?: string;
  required?: boolean;
  hint?: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  error,
  isValid = false,
  isEmail = false,
  leadingIcon,
  onFocus,
  onBlur,
  disabled = false,
  autoComplete,
  required = false,
  hint,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || (value && value.length > 0);

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  return (
    <div className="w-full text-left">
      <div
        className={`canvas-frame-input relative transition-all duration-200 ${
          error ? 'is-invalid' : isValid ? 'is-valid' : ''
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-[#FAF8F5]' : ''}`}
      >
        {/* Leading reactive icon */}
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none text-[#9E8A70] transition-colors duration-200">
          {isEmail ? (
            isValid ? (
              // Open animated envelope icon when email is valid
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
                <path d="M21.2 8.4c.5.38.8.97.8 1.6v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V10a2 2 0 0 1 .8-1.6l8-6a2 2 0 0 1 2.4 0l8 6Z" />
                <path d="m22 10-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 10" />
                <path d="m2 10 7.5 5.5" />
                <path d="m22 10-7.5 5.5" />
              </svg>
            ) : (
              <Mail
                className={`w-4 h-4 transition-colors duration-200 ${
                  isFocused ? 'text-[#C5A059]' : 'text-[#9E8A70]'
                }`}
              />
            )
          ) : (
            leadingIcon || <span className="w-4 h-4 block" />
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

        {/* Input */}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : ''}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className="w-full bg-transparent pl-10 pr-9 py-2.5 sm:py-3 text-[13px] sm:text-sm text-[#171412] placeholder-[#C2B7A3] font-medium outline-none rounded-xl"
        />

        {/* Trailing status tick */}
        {isValid && !error && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#059669] pointer-events-none animate-fadeIn">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
        )}
      </div>

      {/* Error or Hint Message */}
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          aria-live="polite"
          className="text-[11px] font-medium text-[#DC2626] mt-1 pl-1 flex items-center gap-1 animate-fadeIn"
        >
          <span>⚠</span> {error}
        </p>
      ) : hint ? (
        <p
          id={`${id}-hint`}
          className="text-[10.5px] font-medium text-[#8C7B65] mt-0.5 pl-1"
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default FloatingInput;
