import React from 'react';
import { Sparkles, Camera, Image as ImageIcon, ArrowLeft, Landmark } from 'lucide-react';

interface ExperienceHeroProps {
  activeMode: 'photo' | 'ar';
  onModeChange: (mode: 'photo' | 'ar') => void;
  onReturnToMuseum: () => void;
}

export const ExperienceHero: React.FC<ExperienceHeroProps> = ({
  activeMode,
  onModeChange,
  onReturnToMuseum,
}) => {
  return (
    <header className="relative w-full border-b border-[#C9A94F]/20 bg-[#0D0A08]/90 backdrop-blur-md px-4 sm:px-8 py-5 z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Brand & Page Title */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onReturnToMuseum}
            className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#C9A94F]/30 hover:border-[#C9A94F] bg-[#14110E] hover:bg-[#C9A94F]/10 text-xs text-[#F5F0E8] transition-all cursor-pointer group shadow-md"
            title="Return to 3D Master Hall Museum"
          >
            <ArrowLeft size={14} className="text-[#C9A94F] transition-transform group-hover:-translate-x-1" />
            <span className="font-medium hidden sm:inline">Return to Museum</span>
          </button>

          <div className="h-6 w-px bg-[#C9A94F]/20 hidden sm:block" />

          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Landmark size={14} className="text-[#C9A94F]" />
              <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase text-[#C9A94F] font-semibold">
                ZIG Art Museum · Curatorial Atelier
              </span>
            </div>
            <h1
              className="text-xl sm:text-2xl md:text-3xl text-[#F5F0E8] font-medium tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Visualize Art in Your Space
            </h1>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 rounded-full bg-[#14110E] border border-[#C9A94F]/25 shadow-inner self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => onModeChange('photo')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeMode === 'photo'
                ? 'bg-gradient-to-r from-[#C9A94F] to-[#E8D5A0] text-[#0D0A08] shadow-[0_2px_12px_rgba(201,169,79,0.4)] font-semibold'
                : 'text-[#F5F0E8]/70 hover:text-[#F5F0E8] hover:bg-white/5'
            }`}
          >
            <ImageIcon size={14} />
            <span>Upload My Wall</span>
          </button>

          <button
            type="button"
            onClick={() => onModeChange('ar')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 sm:px-6 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
              activeMode === 'ar'
                ? 'bg-gradient-to-r from-[#C9A94F] to-[#E8D5A0] text-[#0D0A08] shadow-[0_2px_12px_rgba(201,169,79,0.4)] font-semibold'
                : 'text-[#F5F0E8]/70 hover:text-[#F5F0E8] hover:bg-white/5'
            }`}
          >
            <Camera size={14} />
            <span>View in AR</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A94F] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A94F]" />
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
