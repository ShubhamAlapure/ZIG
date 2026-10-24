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
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
    onMobileChange(val);
  };

  return (
    <div className="w-full text-left relative" ref={dropdownRef}>
      <div
        className={`canvas-frame-input relative flex items-center transition-all duration-200 ${
          error ? 'is-invalid' : isValid ? 'is-valid' : ''
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-[#F9F7F2]' : ''}`}
      >
        {/* Country Code Trigger Button */}
        <button
          type="button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Select country code, current ${activeCountry.code} ${activeCountry.name}`}
          className="flex items-center gap-1.5 pl-3.5 pr-2 py-2.5 sm:py-3 border-r border-[#E2D8C3] hover:bg-[#FAF7F0] transition-colors rounded-l-xl text-xs font-semibold text-[#1E1A14] cursor-pointer select-none"
        >
          <span className="text-base leading-none" aria-hidden="true">
            {activeFlag}
          </span>
          <span className="text-xs">{activeCountry.code}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#8C7654] transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Floating Label */}
        <label
          htmlFor={id}
          className={`absolute pointer-events-none transition-all duration-200 select-none ${
            isFloating
              ? 'left-3 -top-2.5 px-1.5 bg-[#FAF7F0] text-[10px] font-bold uppercase tracking-widest text-[#B37400] rounded-sm shadow-xs z-10'
              : 'left-[92px] top-1/2 -translate-y-1/2 text-xs font-medium text-[#7D705C]'
          }`}
        >
          Mobile Number
          {required && <span className="text-[#D98E04] ml-0.5">*</span>}
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
          className="w-full flex-1 bg-transparent pl-3 pr-8 py-2.5 sm:py-3 text-sm text-[#1E1A14] placeholder-[#C2B7A3] font-semibold tracking-wide outline-none rounded-r-xl"
        />

        {/* Status tick */}
        {isValid && !error && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#10B981] pointer-events-none animate-fadeIn">
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
          className="absolute z-50 left-0 top-full mt-1.5 w-64 bg-white border border-[#D98E04]/30 rounded-2xl shadow-xl p-2 animate-fadeIn max-h-60 flex flex-col overflow-hidden"
        >
          {/* Search bar */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 text-[#8C7654] absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code…"
              className="w-full pl-8 pr-2.5 py-1.5 bg-[#FAF7F0] border border-[#E2D8C3] rounded-lg text-xs outline-none focus:border-[#D98E04]"
              autoFocus
            />
          </div>

          {/* List of Countries */}
          <div className="overflow-y-auto space-y-0.5 custom-scrollbar pr-1">
            {filteredCodes.map((item) => {
              const flag = FLAG_MAP[item.code] || '🌐';
              return (
                <button
                  key={`${item.name}-${item.code}`}
                  type="button"
                  role="option"
                  aria-selected={item.code === countryCode}
                  onClick={() => {
                    onCountryCodeChange(item.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors cursor-pointer ${
                    item.code === countryCode
                      ? 'bg-amber-100/70 text-[#B37400] font-bold'
                      : 'hover:bg-[#FAF7F0] text-[#1E1A14]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-base leading-none">{flag}</span>
                    <span className="truncate">{item.name}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-[#8C7654] ml-2">
                    {item.code}
                  </span>
                </button>
              );
            })}
            {filteredCodes.length === 0 && (
              <p className="text-center text-xs text-[#8C7654] py-3">
                No matching country found
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneField;
