import React from 'react';
import { FrameStyleId, AVAILABLE_FRAMES } from '../services/artworkService';
import { Check } from 'lucide-react';

interface FrameSelectorProps {
  selectedFrame: FrameStyleId;
  onSelectFrame: (id: FrameStyleId) => void;
  hasMat: boolean;
  onToggleMat: (hasMat: boolean) => void;
}

export const FrameSelector: React.FC<FrameSelectorProps> = ({
  selectedFrame,
  onSelectFrame,
  hasMat,
  onToggleMat,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs uppercase tracking-wider text-[#C9A94F] font-semibold">
          Frame &amp; Moulding
        </label>
        
        {/* Passe-partout / Mat Toggle */}
        <label className="flex items-center gap-2 cursor-pointer text-xs text-[#F5F0E8]/80 hover:text-[#F5F0E8] select-none">
          <input
            type="checkbox"
            checked={hasMat}
            onChange={(e) => onToggleMat(e.target.checked)}
            className="w-3.5 h-3.5 accent-[#C9A94F] rounded cursor-pointer"
          />
          <span>Museum Linen Mat</span>
        </label>
      </div>

      {/* Frame Options Horizontal / Grid Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {AVAILABLE_FRAMES.map((f) => {
          const isSelected = selectedFrame === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelectFrame(f.id)}
              className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'bg-[#221B14] border-[#C9A94F] shadow-md ring-1 ring-[#C9A94F]'
                  : 'bg-[#181410] border-[#C9A94F]/20 hover:border-[#C9A94F]/40 hover:bg-[#1E1914]'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <div
                  className="w-4 h-4 rounded-full border border-white/20 shadow-inner flex-shrink-0"
                  style={{ backgroundColor: f.colorHex }}
                />
                {isSelected && (
                  <span className="text-[#C9A94F]">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </div>
              <div>
                <p className={`text-xs font-medium leading-tight ${isSelected ? 'text-[#E8D5A0]' : 'text-[#F5F0E8]'}`}>
                  {f.name}
                </p>
                <p className="text-[10px] text-[#F5F0E8]/50 line-clamp-1 mt-0.5">
                  {f.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
