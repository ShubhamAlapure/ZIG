import React from 'react';
import { Scan, Sparkles, X } from 'lucide-react';

interface ARInstructionsProps {
  step: 'scanning' | 'placed';
  onDismiss?: () => void;
}

export const ARInstructions: React.FC<ARInstructionsProps> = ({ step, onDismiss }) => {
  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 max-w-sm w-[90%] pointer-events-none animate-fadeIn">
      <div className="glass-panel rounded-2xl p-3.5 border border-[#C9A94F]/40 shadow-[0_8px_32px_rgba(0,0,0,0.8)] backdrop-blur-xl text-center text-[#F5F0E8] relative pointer-events-auto">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Scan size={15} className="text-[#C9A94F] animate-pulse" />
          <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9A94F] font-semibold">
            {step === 'scanning' ? 'Wall Detection Active' : 'Artwork Anchored'}
          </span>
        </div>

        <p className="text-xs text-[#F5F0E8]/90 font-medium">
          {step === 'scanning'
            ? 'Point camera at your physical wall and tap the gold reticle to mount the painting.'
            : 'Walk around your room to preview from different angles and distances.'}
        </p>

        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="absolute top-2 right-2 p-1 text-[#F5F0E8]/50 hover:text-white"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};
