import React, { useState, useRef, useEffect, useId } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { useReducedMotion } from './useReducedMotion';

export interface TonalSelectOption {
  value: string;
  label: string;
}

export interface TonalSelectProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: (TonalSelectOption | string)[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  menuPosition?: 'below' | 'over' | 'above';
}

export const TonalSelect: React.FC<TonalSelectProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled = false,
  className = '',
  searchable = false,
  menuPosition = 'below',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const id = useId();
  const isReduced = useReducedMotion();

  const normalizedOptions: TonalSelectOption[] = options.map((opt) =>
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  );

  const selectedOption = normalizedOptions.find((o) => o.value === value);

  // Filter options when searching
  const filteredOptions = searchQuery.trim()
    ? normalizedOptions.filter((opt) =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opt.value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : normalizedOptions;

  // Reset search and highlight when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setHighlightedIndex(0);
      if (searchable) {
        setTimeout(() => searchInputRef.current?.focus(), 40);
      }
    }
  }, [isOpen, searchable]);

  // Close on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, filteredOptions.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      setHighlightedIndex((prev) => (prev - 1 + filteredOptions.length) % Math.max(1, filteredOptions.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (isOpen && filteredOptions.length > 0) {
        const chosen = filteredOptions[highlightedIndex] || filteredOptions[0];
        if (chosen) {
          onChange(chosen.value);
          setIsOpen(false);
        }
      } else {
        setIsOpen(true);
      }
    } else if (!isOpen && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      // Type-to-open directly
      setIsOpen(true);
      setSearchQuery(e.key);
    }
  };

  const isAbove = menuPosition === 'above';
  const isOver = menuPosition === 'over';

  return (
    <div
      ref={containerRef}
      className={`relative w-full text-left select-none ${isOpen ? 'z-[100]' : 'z-0'} ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* ── Standard Resting Trigger Well (Height 46px on mobile, 52px on desktop) ── */}
      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={`${id}-label`}
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full h-[46px] sm:h-[52px] min-h-[46px] sm:min-h-[52px] px-3.5 sm:px-4 rounded-[12px] sm:rounded-[14px] flex items-center justify-between cursor-pointer transition-all duration-200 backdrop-blur-md outline-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${
          isOpen
            ? 'bg-[#FFFFFF] border-[1.5px] border-[#D4A70E] ring-2 ring-[#C5A059]/25 shadow-[0_4px_18px_rgba(197,160,89,0.18)]'
            : 'bg-white/85 border border-[rgba(212,167,14,0.24)] shadow-[0_2px_10px_rgba(200,160,50,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] hover:border-[rgba(212,167,14,0.45)] hover:bg-white/95'
        }`}
      >
        <div className="flex flex-col justify-center flex-1 min-w-0 pr-1.5">
          {label && (
            <span
              id={`${id}-label`}
              className="text-[9.5px] font-bold uppercase tracking-[0.14em] text-[#9E7A32] leading-none mb-0.5 truncate"
            >
              {label}
            </span>
          )}
          <span className="font-medium text-xs sm:text-[13.5px] text-[#181410] tracking-wide truncate">
            {selectedOption
              ? selectedOption.value.startsWith('+')
                ? selectedOption.value
                : selectedOption.label
              : placeholder}
          </span>
        </div>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-[#9E7A32] flex-shrink-0"
        >
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </div>

      {/* ── Unfolded Dropdown Menu (Above, Over, or Below with 100% Solid Opaque Background) ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: isAbove ? 8 : isOver ? 0 : -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: isAbove ? 8 : isOver ? 0 : -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            style={{ backgroundColor: '#FFFFFF' }}
            className={`
              absolute left-0 right-0 z-[110] rounded-[14px] shadow-[0_20px_60px_rgba(20,16,10,0.30),0_4px_18px_rgba(200,165,100,0.24)] border border-[rgba(200,165,100,0.48)] bg-white overflow-hidden
              ${isAbove ? 'bottom-full mb-1.5 min-w-full' : isOver ? 'top-0 min-w-full' : 'top-full mt-1 min-w-full w-max max-w-[280px]'}
            `}
          >
            {/* Search Bar when searchable */}
            {searchable && (
              <div
                style={{ backgroundColor: '#FFFFFF' }}
                className={`flex items-center gap-2 px-3.5 border-b border-[rgba(200,165,100,0.25)] bg-white ${
                  isOver ? 'h-[46px] sm:h-[52px]' : 'py-2 sm:py-2.5'
                }`}
              >
                <Search className="w-4 h-4 text-[#9E7A32] flex-shrink-0" />
                <div className="flex-1 flex flex-col justify-center min-w-0">
                  {isOver && label && (
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#9E7A32] leading-none mb-0.5">
                      {label}
                    </span>
                  )}
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setHighlightedIndex(0);
                    }}
                    placeholder={isAbove ? 'Type country name to search…' : isOver ? 'Type country name to select…' : 'Type to search…'}
                    className="w-full bg-transparent border-none outline-none font-medium text-xs sm:text-[13.5px] text-[#181410] tracking-wide placeholder:text-[#A89882]/65"
                    style={{ caretColor: '#D4A70E', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  />
                </div>
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="p-1 rounded-full text-[#A89882] hover:text-[#181410]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full text-[#A89882] hover:text-[#181410]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Options List (100% Solid Opaque Background) */}
            <ul
              role="listbox"
              style={{ backgroundColor: '#FFFFFF' }}
              className="max-h-48 overflow-y-auto p-1.5 custom-scrollbar bg-white"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, idx) => {
                  const isSelected = option.value === value;
                  const isHighlighted = idx === highlightedIndex;
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={(e) => {
                        e.stopPropagation();
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setHighlightedIndex(idx)}
                      style={{
                        backgroundColor: isSelected ? undefined : isHighlighted ? '#FAF3E0' : '#FFFFFF',
                        fontFamily: "'Plus Jakarta Sans', sans-serif",
                      }}
                      className={`px-3 py-2.5 rounded-[10px] flex items-center justify-between text-xs sm:text-[13px] font-medium cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-gradient-to-r from-[#F5C518] to-[#E5A91C] text-[#0A0803] font-bold shadow-xs'
                          : isHighlighted
                          ? 'text-[#9E7A32]'
                          : 'text-[#2D241B] hover:text-[#9E7A32]'
                      }`}
                    >
                      <span className="truncate">{option.label}</span>
                      {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                    </li>
                  );
                })
              ) : (
                <li className="px-3 py-4 text-center text-xs text-[#8C7A65] italic" style={{ backgroundColor: '#FFFFFF' }}>
                  No matches for "{searchQuery}"
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TonalSelect;
