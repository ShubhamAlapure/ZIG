import React from 'react';
import { GalleryCanvas } from './3d/GalleryCanvas';
import { EventAdvertisingPanel } from './ui/EventAdvertisingPanel';
import { ArtworkModal } from './ui/ArtworkModal';
import {
  ControlsHUD,
  StatusBadge,
  FPSReticle,
  MobileMuseumControls,
} from './ui/HUD';
import { Landmark } from 'lucide-react';
import { SignInSeamButton } from './SignInSeamButton';
import { BackgroundFx } from './ui/BackgroundFx';

export interface MuseumViewProps {
  isActive?: boolean;
}

export const MuseumView: React.FC<MuseumViewProps> = ({ isActive = true }) => {
  return (
    <div className="w-full h-[100dvh] min-h-[100dvh] flex flex-col lg:flex-row overflow-hidden bg-[#FCFBF8] relative select-none animate-fadeIn">
      {/* ── Glowing Yellow Spectral Drape Background Layer (Fixed inset-0, z-0) ── */}
      <BackgroundFx mood="museum" />

      {/* ── 60% 3D Master Hall Museum Viewport on Mobile, Flex on Desktop ───────────── */}
      <main
        className="relative w-full h-[60dvh] lg:h-full lg:flex-1 flex-shrink-0 z-10 overflow-hidden"
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
        <header className="absolute top-2.5 sm:top-4 left-2.5 sm:left-4 right-2.5 sm:right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex flex-col gap-1.5 sm:gap-2 pointer-events-auto">
            {/* Museum Title Badge: Hidden on mobile per request, visible on desktop */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 glass-panel px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border border-[#C9A94F]/30 shadow-xl backdrop-blur-xl">
              <Landmark size={14} className="text-[#C9A94F]" />
              <span
                className="text-[10.5px] sm:text-xs md:text-sm text-[#F5F0E8] font-medium tracking-wide truncate max-w-[210px] sm:max-w-none"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                The European Museum of Fine Art · Master Hall
              </span>
            </div>
            <StatusBadge />
          </div>
        </header>

        {/* HUD: Bottom-Left Desktop Controls Guide (Hidden on mobile) */}
        <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 z-20 pointer-events-auto hidden sm:block">
          <ControlsHUD />
        </div>

        {/* Mobile Touch Guidance Badge */}
        <div className="sm:hidden absolute top-12 left-2.5 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/45 backdrop-blur-md border border-[#C5A059]/40 text-[#F5F0E8] text-[10.5px] font-medium tracking-wide pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059] animate-pulse" />
          <span>Touch &amp; Drag to look · Tap arrows to walk</span>
        </div>

        {/* Mobile Touch Walking Controls (Bottom-Left) */}
        <div className="sm:hidden absolute bottom-3 left-3 z-20 pointer-events-auto">
          <MobileMuseumControls />
        </div>

        {/* Painting Curatorial Inspection Modal */}
        <ArtworkModal />
      </main>

      {/* ── 40% Form Panel on Mobile (scrollable so full form is reachable), 30% on Desktop ── */}
      <div className="relative w-full h-[40dvh] lg:h-full lg:w-[30%] lg:min-w-[360px] lg:max-w-[460px] flex-shrink-0 z-20 flex flex-col">
        {/* ── Desktop Yellow Vertical Seam Tab (Attached flush to the left edge of the form panel, exactly touching) ── */}
        <div className="hidden lg:block absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 z-30 pointer-events-auto">
          <SignInSeamButton />
        </div>

        {/* ── Mobile Seam Clasp ── */}
        <div className="lg:hidden absolute -top-[17px] left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
          <SignInSeamButton isMobile />
        </div>

        {/* ── Scrollable Aside Panel — full height scroll so every field is reachable ── */}
        <aside className="w-full flex-1 min-h-0 bg-transparent overflow-y-auto custom-scrollbar flex flex-col">
          <EventAdvertisingPanel />
        </aside>
      </div>
    </div>
  );
};

export default MuseumView;
