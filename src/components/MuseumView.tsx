import React from 'react';
import { GalleryCanvas } from './3d/GalleryCanvas';
import { EventAdvertisingPanel } from './ui/EventAdvertisingPanel';
import { ArtworkModal } from './ui/ArtworkModal';
import {
  ControlsHUD,
  StatusBadge,
  AudioToggle,
  FPSReticle,
} from './ui/HUD';
import { Landmark, LogOut, UserCheck, Sparkles } from 'lucide-react';
import { useAppStore } from '@/app/store';

export const MuseumView: React.FC = () => {
  const { currentUser, logout } = useAppStore();

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-[#0D0A08] relative select-none animate-fadeIn">
      {/* ── LEFT 70%: Complete 3D Master Hall Museum Viewport ───────────── */}
      <main
        className="relative h-full flex-shrink-0 w-full lg:w-[70%] z-0"
        aria-label="3D Master Hall Museum Viewport"
      >
        {/* Subtle Atmospheric Gallery Vignette */}
        <div className="absolute inset-0 z-10 vignette pointer-events-none" />

        {/* FPS Reticle */}
        <FPSReticle />

        {/* Full Interactive 3D WebGL Canvas */}
        <div className="w-full h-full relative z-0">
          <GalleryCanvas />
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

          {/* Right Session Details & Signout Controls */}
          <div className="flex items-center gap-2 pointer-events-auto">
            {/* User Session Pill */}
            <div className="hidden sm:flex items-center gap-2 glass-panel px-3 py-1.5 rounded-full border border-[#C9A94F]/25 text-xs text-[#F5F0E8] shadow-md">
              <UserCheck size={14} className="text-[#C9A94F]" />
              <span className="font-medium truncate max-w-[140px]">
                {currentUser?.name || currentUser?.email || 'Patron'}
              </span>
              <span className="px-1.5 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-[#C9A94F]/20 text-[#E8D5A0] border border-[#C9A94F]/30">
                {currentUser?.tier || 'Member'}
              </span>
            </div>

            {/* Audio Toggle */}
            <AudioToggle />

            {/* Logout / Switch to Park Login */}
            <button
              type="button"
              onClick={logout}
              title="Return to Park Login / Sign Out"
              aria-label="Sign out"
              className="flex items-center gap-1.5 glass-panel hover:bg-[#C9A94F]/20 px-3.5 py-2 rounded-full border border-[#C9A94F]/30 text-xs text-[#F5F0E8] hover:text-[#E8D5A0] transition-all cursor-pointer shadow-lg active:scale-95"
            >
              <LogOut size={13} className="text-[#C9A94F]" />
              <span className="hidden md:inline font-medium">Exit to Portal</span>
            </button>
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
      <aside className="relative h-full w-full lg:w-[30%] flex-shrink-0 z-20 border-l border-[#C9A94F]/15">
        <EventAdvertisingPanel />
      </aside>
    </div>
  );
};

export default MuseumView;
