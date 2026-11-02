import React, { useState, useId } from 'react';

export interface FloatingInputProps {
  id?: string;
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
  name?: string;
}

export const FloatingInput: React.FC<FloatingInputProps> = ({
  id: idProp,
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
  name,
}) => {
  const autoId = useId();
  const id = idProp || autoId;
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused || value.length > 0;

  const handleFocus = () => {
    setIsFocused(true);
    onFocus?.();
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  // Compute border / shadow class based on state
  const borderColor = error
    ? 'var(--auth-danger)'
    : isFocused
    ? 'var(--auth-gold-amber)'
    : isValid
    ? '#059669'
    : 'rgba(229,169,28,0.24)';

  const boxShadow = error
    ? '0 0 0 3px var(--auth-danger-ring)'
    : isFocused
    ? 'var(--auth-clay-shadow)'
    : isValid
    ? '0 0 0 2px rgba(5,150,105,0.15)'
    : '0 2px 8px -2px rgba(23,20,18,0.06)';

  const iconColor = isFocused
    ? 'var(--auth-gold)'
    : isValid
    ? '#059669'
    : 'var(--auth-ink-muted)';

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
        {/* Leading icon */}
        <div
          className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10 transition-all duration-300"
          style={{ color: iconColor }}
          aria-hidden="true"
        >
          {isEmail ? (
            isValid ? (
              /* Open envelope — email validated */
              <svg
                className="w-[18px] h-[18px]"
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
              </svg>
            ) : (
              /* Closed envelope */
              <svg
                className="w-[18px] h-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            )
          ) : (
            leadingIcon || null
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

        {/* Input element */}
        <input
          id={id}
          name={name || id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={isFocused ? placeholder : ''}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-err` : hint ? `${id}-hint` : undefined
          }
          required={required}
          className="w-full bg-transparent pl-10 pr-10 py-3 text-sm font-medium outline-none rounded-2xl"
          style={{ color: 'var(--auth-ink)', caretColor: 'var(--auth-gold)' }}
        />

        {/* Valid checkmark — animates in using auth-check-draw */}
        {isValid && !error && (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-4 h-4"
              viewBox="0 0 16 16"
              fill="none"
              stroke="#059669"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              style={{
                strokeDasharray: 24,
                strokeDashoffset: 0,
                animation: 'auth-check-draw 0.4s ease forwards',
              }}
            >
              <polyline points="3,8 7,12 13,5" />
            </svg>
          </div>
        )}
      </div>

      {/* Error or hint text */}
      {error ? (
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
      ) : hint ? (
        <p
          id={`${id}-hint`}
          className="mt-1 pl-1 text-[11px] font-medium"
          style={{ color: 'var(--auth-ink-muted)' }}
        >
          {hint}
        </p>
      ) : null}
    </div>
  );
};

export default FloatingInput;
