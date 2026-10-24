import React from 'react';
import { GalleryCanvas } from './3d/GalleryCanvas';
import { EventAdvertisingPanel } from './ui/EventAdvertisingPanel';
import { ArtworkModal } from './ui/ArtworkModal';
import {
  ControlsHUD,
  StatusBadge,
  FPSReticle,
} from './ui/HUD';
import { Landmark } from 'lucide-react';
import { SignInSeamButton } from './SignInSeamButton';

export interface MuseumViewProps {
  isActive?: boolean;
}

export const MuseumView: React.FC<MuseumViewProps> = ({ isActive = true }) => {
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-[#0D0A08] relative select-none animate-fadeIn">
      {/* ── 70% 3D Master Hall Museum Viewport ───────────── */}
      {/* Desktop: Left 70% (w-full lg:w-[70%] h-full) */}
      {/* Mobile: Top 68% (w-full h-[68dvh] lg:h-full) */}
      <main
        className="relative w-full lg:w-[70%] h-[68dvh] lg:h-full flex-shrink-0 z-0 overflow-hidden"
        style={{ contain: 'paint layout' }}
        aria-label="3D Master Hall Museum Viewport"
      >
        {/* Subtle Atmospheric Gallery Vignette */}
        <div className="absolute inset-0 z-10 vignette pointer-events-none" />

        {/* FPS Reticle */}
        <FPSReticle />

        {/* Full Interactive 3D WebGL Canvas */}
        <div className="w-full h-full relative z-0">
          <React.Suspense
            fallback={
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0D0A08] z-30 text-amber-200 gap-3">
                <div className="w-10 h-10 border-2 border-amber-500/30 border-t-amber-400 rounded-full animate-spin" />
                <p className="text-xs uppercase tracking-widest text-[#E8D5A0] font-medium">
                  Entering Master Hall Museum…
                </p>
              </div>
            }
          >
            <GalleryCanvas isActive={isActive} />
          </React.Suspense>
        </div>

        {/* Top Navigation & Session Bar */}
        <header className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5 sm:gap-2 pointer-events-auto">
            <div className="flex items-center gap-2 sm:gap-2.5 glass-panel px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#C9A94F]/30 shadow-xl backdrop-blur-xl">
              <Landmark size={14} className="text-[#C9A94F]" />
              <span
                className="text-[11px] sm:text-xs md:text-sm text-[#F5F0E8] font-medium tracking-wide truncate max-w-[220px] sm:max-w-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                The European Museum of Fine Art · Master Hall
              </span>
            </div>
            <StatusBadge />
          </div>
        </header>

        {/* HUD: Bottom-Left Desktop Controls Guide */}
        <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 z-20 pointer-events-auto">
          <ControlsHUD />
        </div>

        {/* Painting Curatorial Inspection Modal */}
        <ArtworkModal />
      </main>

      {/* ── 30% Dedicated Museum Event & Exhibition Advertising Panel ── */}
      {/* Desktop: Right 30% (w-full lg:w-[30%] lg:min-w-[360px] lg:max-w-[460px] h-full) */}
      {/* Mobile: Bottom 32% (w-full h-[32dvh] lg:h-full overflow-y-auto) */}
      <aside
        className="relative w-full lg:w-[30%] lg:min-w-[360px] lg:max-w-[460px] h-[32dvh] lg:h-full flex-shrink-0 z-20 border-t lg:border-t-0 lg:border-l border-[#C5A059]/20 overflow-y-auto bg-[#FCFBF8] shadow-2xl"
        style={{ contain: 'layout style' }}
      >
        <EventAdvertisingPanel />
      </aside>

      {/* ── Yellow Vertical/Horizontal Seam Tab on border of Museum (70%) and Form (30%) ── */}
      <SignInSeamButton />
    </div>
  );
};

export default MuseumView;
