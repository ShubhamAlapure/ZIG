import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check } from 'lucide-react';
import { COUNTRY_CODES } from '../dummyUsers';

// Country flag lookup helper
const FLAG_MAP: Record<string, string> = {
  '+91': '🇮🇳',
  '+1': '🇺🇸',
  '+44': '🇬🇧',
  '+61': '🇦🇺',
  '+81': '🇯🇵',
  '+86': '🇨🇳',
  '+49': '🇩🇪',
  '+33': '🇫🇷',
  '+39': '🇮🇹',
  '+34': '🇪🇸',
  '+7': '🇷🇺',
  '+55': '🇧🇷',
  '+52': '🇲🇽',
  '+27': '🇿🇦',
  '+971': '🇦🇪',
  '+966': '🇸🇦',
  '+65': '🇸🇬',
  '+60': '🇲🇾',
  '+63': '🇵🇭',
  '+92': '🇵🇰',
  '+880': '🇧🇩',
  '+94': '🇱🇰',
  '+977': '🇳🇵',
  '+31': '🇳🇱',
  '+46': '🇸🇪',
  '+47': '🇳🇴',
  '+45': '🇩🇰',
  '+41': '🇨🇭',
  '+43': '🇦🇹',
  '+32': '🇧🇪',
  '+351': '🇵🇹',
  '+30': '🇬🇷',
  '+48': '🇵🇱',
  '+90': '🇹🇷',
  '+20': '🇪🇬',
  '+234': '🇳🇬',
  '+254': '🇰🇪',
  '+233': '🇬🇭',
  '+62': '🇮🇩',
  '+66': '🇹🇭',
  '+84': '🇻🇳',
  '+82': '🇰🇷',
  '+64': '🇳🇿',
};

export interface PhoneFieldProps {
  id: string;
  countryCode: string;
  onCountryCodeChange: (code: string) => void;
  mobile: string;
  onMobileChange: (val: string) => void;
  error?: string;
  disabled?: boolean;
  required?: boolean;
}

export const PhoneField: React.FC<PhoneFieldProps> = ({
  id,
  countryCode,
  onCountryCodeChange,
  mobile,
  onMobileChange,
  error,
  disabled = false,
  required = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFloating = isFocused || (mobile && mobile.length > 0);
  const isValid = mobile.trim().length === 10;

  // Filter country codes by name or code
  const filteredCodes = COUNTRY_CODES.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.code.includes(search)
  );

  const activeCountry =
    COUNTRY_CODES.find((c) => c.code === countryCode) || COUNTRY_CODES[0];
  const activeFlag = FLAG_MAP[activeCountry.code] || '🌐';

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Restrict to digits only, max 10
  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 10);
    onMobileChange(digitsOnly);
  };

  return (
    <div className="w-full text-left relative" ref={dropdownRef}>
      <div
        className={`canvas-frame-input relative flex items-center transition-all duration-200 ${
          error ? 'is-invalid' : isValid ? 'is-valid' : ''
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-[#FAF8F5]' : ''}`}
      >
        {/* Country Code Selector Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Select country code, current ${activeCountry.code} ${activeCountry.name}`}
          className="flex-shrink-0 flex items-center gap-1 pl-2.5 pr-1.5 py-2.5 sm:py-3 border-r border-[#E8DFC8] hover:bg-[#FAF8F5] transition-colors rounded-l-xl text-xs font-bold text-[#171412] cursor-pointer select-none"
        >
          <span className="text-sm leading-none" aria-hidden="true">
            {activeFlag}
          </span>
          <span className="text-[11.5px] font-semibold">{activeCountry.code}</span>
          <ChevronDown
            className={`w-3 h-3 text-[#9E8A70] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`absolute pointer-events-none transition-all duration-200 select-none ${
            isFloating
              ? 'left-3 -top-2.5 px-1.5 py-0.5 bg-white text-[9.5px] font-bold tracking-[0.06em] uppercase text-[#9E7A32] rounded border border-[#C5A059]/30 shadow-xs z-10'
              : 'left-20 top-1/2 -translate-y-1/2 text-xs font-medium text-[#7D705C]'
          }`}
        >
          Mobile Number
          {required && <span className="text-[#C5A059] ml-0.5">*</span>}
        </label>

        {/* Mobile Number Input */}
        <input
          id={id}
          type="tel"
          value={mobile}
          onChange={handleMobileInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={isFocused ? '9876543210' : ''}
          disabled={disabled}
          maxLength={10}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className="flex-1 min-w-0 bg-transparent pl-2.5 pr-7 py-2.5 sm:py-3 text-[13px] tracking-wide text-[#171412] placeholder-[#C2B7A3] font-medium outline-none rounded-r-xl"
        />

        {/* Status tick */}
        {isValid && !error && (
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#059669] pointer-events-none animate-fadeIn">
            <Check className="w-4 h-4 stroke-[2.5]" />
          </div>
        )}
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

      {/* Searchable Country Code Popover Dropdown */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Country codes list"
          className="absolute z-50 left-0 top-full mt-1.5 w-64 max-w-[calc(100vw-48px)] bg-white border border-[#C5A059]/30 rounded-2xl shadow-xl p-2 animate-fadeIn max-h-60 flex flex-col overflow-hidden"
        >
          {/* Search bar */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-[#9E8A70] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code…"
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF8F5] border border-[#E8DFC8] rounded-xl text-xs text-[#171412] placeholder-[#9E8A70] outline-none focus:border-[#C5A059]"
            />
          </div>

          {/* List items */}
          <div className="overflow-y-auto flex-1 space-y-0.5 custom-scrollbar">
            {filteredCodes.map((item) => {
              const isSelected = item.code === countryCode;
              const flag = FLAG_MAP[item.code] || '🌐';

              return (
                <button
                  key={`${item.code}-${item.name}`}
                  type="button"
                  onClick={() => {
                    onCountryCodeChange(item.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 text-[#9E7A32] font-bold'
                      : 'hover:bg-[#FAF8F5] text-[#171412]'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-sm">{flag}</span>
                    <span className="truncate">{item.name}</span>
                  </span>
                  <span className="font-mono text-[11px] text-[#7D705C] ml-2 flex-shrink-0">
                    {item.code}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneField;
