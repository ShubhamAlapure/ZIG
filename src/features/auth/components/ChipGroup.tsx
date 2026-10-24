import React from 'react';
import { Check } from 'lucide-react';

export interface ChipGroupProps {
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
  label?: string;
  disabled?: boolean;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({
  options,
  selectedOptions,
  onToggle,
  label = 'Art Specialties',
  disabled = false,
}) => {
  return (
    <div className="w-full text-left space-y-1.5">
      {label && (
        <span className="block text-[11px] font-bold uppercase tracking-wider text-[#7D705C]">
          {label} <span className="text-[#C5A059]">*</span>
        </span>
      )}
      <div
        role="group"
        aria-label={label}
        className="flex flex-wrap gap-2"
      >
        {options.map((option) => {
          const isSelected = selectedOptions.includes(option);
          return (
            <button
              key={option}
              type="button"
              disabled={disabled}
              onClick={() => onToggle(option)}
              aria-pressed={isSelected}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 select-none flex items-center gap-1.5 cursor-pointer ${
                isSelected
                  ? 'bg-gradient-to-r from-[#C5A059] to-[#9E7A32] text-white shadow-xs scale-[1.03] ring-1 ring-[#9E7A32]'
                  : 'bg-[#FAF8F5] text-[#5C5245] border border-[#E8DFC8] hover:border-[#C5A059] hover:bg-white active:scale-95'
              } ${disabled ? 'pointer-events-none opacity-50' : ''}`}
            >
              {isSelected && <Check className="w-3 h-3 stroke-[2.5]" />}
              <span>{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ChipGroup;
