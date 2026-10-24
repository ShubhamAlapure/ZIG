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
      {/* ── LEFT 70%: Complete 3D Master Hall Museum Viewport ───────────── */}
      <main
        className="relative h-full flex-shrink-0 w-full lg:w-[70%] z-0"
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

        {/* ── Top Navigation & Session Bar ── */}
        <header className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          {/* Left Title & Status Badge */}
          <div className="flex flex-col gap-2 pointer-events-auto">
            <div className="flex items-center gap-2.5 glass-panel px-4 py-2 rounded-full border border-[#C9A94F]/30 shadow-xl backdrop-blur-xl">
              <Landmark size={15} className="text-[#C9A94F]" />
              <span
                className="text-xs sm:text-sm text-[#F5F0E8] font-medium tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                The European Museum of Fine Art · Master Hall
              </span>
            </div>
            <StatusBadge />
          </div>
        </header>

        {/* ── HUD: Bottom-Left Desktop Controls Guide ── */}
        <div className="absolute bottom-5 left-5 z-20 pointer-events-auto">
          <ControlsHUD />
        </div>

        {/* ── Painting Curatorial Inspection Modal ── */}
        <ArtworkModal />
      </main>

      {/* ── RIGHT 30%: Dedicated Museum Event & Exhibition Advertising Panel ── */}
      <aside
        className="relative h-full w-full lg:w-[30%] flex-shrink-0 z-20 border-l border-[#C9A94F]/15"
        style={{ contain: 'layout style' }}
      >
        <EventAdvertisingPanel />
      </aside>

      {/* ── Yellow Vertical Seam Tab on border of Museum (70%) and Form (30%) ── */}
      <SignInSeamButton />
    </div>
  );
};

export default MuseumView;
