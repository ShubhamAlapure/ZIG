import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { COUNTRY_CODES } from '../dummyUsers';

export interface CountryCodeOption {
  code: string;
  name: string;
}

export interface PhoneFieldProps {
  /** Optional id — unused structurally but accepted for backward compat */
  id?: string;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  mobile: string;
  onMobileChange: (val: string) => void;
  countryCodes?: CountryCodeOption[];
  error?: string;
  onFocus?: () => void;
  /** Accepted for compat but unused — validation is handled by parent */
  required?: boolean;
}

/**
 * PhoneField — glass-clay phone input with country code dropdown.
 *
 * - Country code button: glass pill, opens Framer Motion AnimatePresence dropdown.
 * - Mobile input: FloatingInput glass-clay style.
 * - Dropdown: max-h scrollable list, closes on outside click.
 */
export const PhoneField: React.FC<PhoneFieldProps> = ({
  countryCode,
  onCountryCodeChange,
  mobile,
  onMobileChange,
  countryCodes = COUNTRY_CODES,
  error,
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileFocused, setIsMobileFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handler);
    }
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen]);

  const borderColor = error
    ? 'var(--auth-danger)'
    : isMobileFocused
    ? 'var(--auth-gold-amber)'
    : mobile.length >= 10
    ? '#059669'
    : 'rgba(229,169,28,0.24)';

  return (
    <div className="w-full text-left" ref={containerRef}>
      {/* Field label */}
      <div className="flex gap-2 items-start">
        {/* Country Code Button */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={isOpen}
            aria-label="Select country code"
            className="flex items-center gap-1.5 px-3 py-3 rounded-2xl text-[13px] font-bold cursor-pointer select-none transition-all duration-200 outline-none"
            style={{
              background: 'rgba(255,255,255,0.72)',
              backdropFilter: 'blur(var(--auth-blur))',
              border: isOpen
                ? '1.5px solid var(--auth-gold-amber)'
                : '1px solid rgba(229,169,28,0.24)',
              boxShadow: isOpen
                ? 'var(--auth-clay-shadow)'
                : '0 2px 8px -2px rgba(23,20,18,0.06)',
              color: 'var(--auth-ink)',
              minWidth: '78px',
              minHeight: '48px',
            }}
          >
            <span>{countryCode}</span>
            <motion.span
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-3.5 h-3.5" style={{ color: 'var(--auth-gold)' }} />
            </motion.span>
          </button>

          {/* Dropdown */}
          <AnimatePresence>
            {isOpen && (
              <motion.ul
                role="listbox"
                aria-label="Country codes"
                initial={{ opacity: 0, scale: 0.95, y: -8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -8 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="absolute left-0 top-full mt-1.5 z-50 overflow-y-auto custom-scrollbar"
                style={{
                  width: '220px',
                  maxHeight: '176px',
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(var(--auth-blur))',
                  border: '1px solid rgba(229,169,28,0.22)',
                  borderRadius: '16px',
                  boxShadow: 'var(--auth-clay-shadow)',
                  padding: '4px 0',
                }}
              >
                {countryCodes.map(({ code, name }) => (
                  <li
                    key={code}
                    role="option"
                    aria-selected={countryCode === code}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onCountryCodeChange(code);
                        setIsOpen(false);
                      }}
                      className="w-full text-left px-3.5 py-2 flex items-center justify-between gap-3 text-[11.5px] transition-colors duration-150 cursor-pointer"
                      style={{
                        background:
                          countryCode === code
                            ? 'rgba(229,169,28,0.10)'
                            : 'transparent',
                        color:
                          countryCode === code
                            ? 'var(--auth-ink)'
                            : 'var(--auth-ink-2)',
                      }}
                    >
                      <span className="font-bold">{code}</span>
                      <span
                        className="truncate font-medium"
                        style={{ color: 'var(--auth-ink-muted)' }}
                      >
                        {name}
                      </span>
                    </button>
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile number input */}
        <div
          className="flex-1 relative rounded-2xl transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.70)',
            backdropFilter: 'blur(var(--auth-blur))',
            border: `1px solid ${borderColor}`,
            boxShadow: isMobileFocused
              ? 'var(--auth-clay-shadow)'
              : '0 2px 8px -2px rgba(23,20,18,0.06)',
          }}
        >
          {/* Floating label */}
          <label
            htmlFor="phone-mobile-input"
            className="absolute pointer-events-none select-none z-10"
            style={{
              left:
                isMobileFocused || mobile.length > 0 ? '0.75rem' : '0.875rem',
              top:
                isMobileFocused || mobile.length > 0 ? '-0.6rem' : '50%',
              transform:
                isMobileFocused || mobile.length > 0
                  ? 'translateY(0)'
                  : 'translateY(-50%)',
              fontSize:
                isMobileFocused || mobile.length > 0
                  ? '0.6875rem'
                  : '0.8125rem',
              color: error
                ? 'var(--auth-danger)'
                : isMobileFocused
                ? 'var(--auth-gold)'
                : 'var(--auth-ink-muted)',
              background:
                isMobileFocused || mobile.length > 0 ? 'white' : 'transparent',
              padding:
                isMobileFocused || mobile.length > 0 ? '0 4px' : undefined,
              borderRadius:
                isMobileFocused || mobile.length > 0 ? '3px' : undefined,
              fontWeight:
                isMobileFocused || mobile.length > 0 ? 700 : 500,
              letterSpacing:
                isMobileFocused || mobile.length > 0 ? '0.04em' : undefined,
              textTransform:
                isMobileFocused || mobile.length > 0 ? 'uppercase' : 'none',
              transition:
                'left 0.2s ease, top 0.2s ease, transform 0.2s ease, font-size 0.2s ease, color 0.2s ease',
            }}
          >
            Mobile Number *
          </label>

          <input
            id="phone-mobile-input"
            type="tel"
            inputMode="numeric"
            value={mobile}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '');
              if (val.length <= 15) onMobileChange(val);
            }}
            onFocus={() => {
              setIsMobileFocused(true);
              onFocus?.();
            }}
            onBlur={() => setIsMobileFocused(false)}
            placeholder=""
            aria-invalid={!!error}
            aria-describedby={error ? 'phone-err' : undefined}
            className="w-full bg-transparent px-3.5 py-3 text-sm font-medium outline-none rounded-2xl"
            style={{
              color: 'var(--auth-ink)',
              caretColor: 'var(--auth-gold)',
              minHeight: '48px',
            }}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p
          id="phone-err"
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
    </div>
  );
};

export default PhoneField;
