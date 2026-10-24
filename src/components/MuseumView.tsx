import React, { useState } from 'react';
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
  const [mobileSheetMode, setMobileSheetMode] = useState<'split' | 'expanded' | 'minimized'>('split');
  const seamTop = mobileSheetMode === 'expanded' ? '14dvh' : mobileSheetMode === 'minimized' ? '92dvh' : '65dvh';

  return (
    <div
      className="w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-[#0D0A08] relative select-none animate-fadeIn"
      style={{ '--mobile-seam-top': seamTop } as React.CSSProperties}
    >
      {/* ── 70% 3D Master Hall Museum Viewport ───────────── */}
      {/* Desktop: Left 70% (w-full lg:w-[70%] lg:h-full) */}
      {/* Mobile: Dynamic Responsive Height (split: 65dvh, expanded: 14dvh, minimized: 92dvh) */}
      <main
        className={`relative w-full lg:w-[70%] flex-shrink-0 z-0 overflow-hidden transition-[height] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileSheetMode === 'expanded'
            ? 'h-[14dvh]'
            : mobileSheetMode === 'minimized'
            ? 'h-[92dvh]'
            : 'h-[65dvh]'
        } lg:h-full`}
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
                className="text-[11px] sm:text-xs md:text-sm text-[#F5F0E8] font-medium tracking-wide truncate max-w-[180px] sm:max-w-none"
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

      {/* ── 30% Dedicated Museum Event & Exhibition Advertising Panel / Mobile Sheet ── */}
      {/* Desktop: Right 30% (w-full lg:w-[30%] lg:min-w-[360px] lg:max-w-[460px] lg:h-full) */}
      {/* Mobile: Dynamic Responsive Sheet (split: 35dvh, expanded: 86dvh, minimized: 8dvh) */}
      <aside
        className={`relative w-full lg:w-[30%] lg:min-w-[360px] lg:max-w-[460px] flex-shrink-0 z-20 border-t lg:border-t-0 lg:border-l border-[#C5A059]/20 overflow-y-auto bg-[#FCFBF8] shadow-2xl transition-[height] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileSheetMode === 'expanded'
            ? 'h-[86dvh]'
            : mobileSheetMode === 'minimized'
            ? 'h-[8dvh]'
            : 'h-[35dvh]'
        } lg:h-full flex flex-col`}
        style={{ contain: 'layout style' }}
        onFocusCapture={() => {
          if (typeof window !== 'undefined' && window.innerWidth < 1024 && mobileSheetMode !== 'expanded') {
            setMobileSheetMode('expanded');
          }
        }}
      >
        {/* ── Mobile Sheet Header & Interactive Mode Controller ── */}
        <div className="lg:hidden sticky top-0 z-30 w-full bg-[#FCFBF8]/95 backdrop-blur-md border-b border-[#E8DFC8]/80 px-3 py-1.5 flex flex-col gap-1 select-none flex-shrink-0">
          {/* Tactile drag pill */}
          <div
            onClick={() => setMobileSheetMode((prev: 'split' | 'expanded' | 'minimized') => (prev === 'expanded' ? 'split' : 'expanded'))}
            className="w-full flex items-center justify-center py-1 cursor-pointer active:opacity-70"
            aria-label="Tap to toggle form size"
          >
            <div className="w-12 h-1 rounded-full bg-[#C5A059]/40 hover:bg-[#C5A059] transition-colors" />
          </div>

          {/* Status & Quick Toggle Pills */}
          <div className="flex items-center justify-between gap-1 text-[11px]">
            <span className="font-bold uppercase tracking-wider text-[#9E7A32] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A059]" />
              {mobileSheetMode === 'expanded'
                ? 'Join Us Form (100%)'
                : mobileSheetMode === 'minimized'
                ? '3D Full Immersion'
                : '70 / 30 Split View'}
            </span>

            <div className="flex items-center gap-1.5">
              {mobileSheetMode !== 'split' && (
                <button
                  type="button"
                  onClick={() => setMobileSheetMode('split')}
                  className="px-2.5 py-1 rounded-full bg-white border border-[#C5A059]/40 text-[10px] font-bold text-[#171412] shadow-xs active:scale-95 transition-transform"
                >
                  70/30 Split
                </button>
              )}

              {mobileSheetMode !== 'expanded' ? (
                <button
                  type="button"
                  onClick={() => setMobileSheetMode('expanded')}
                  className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#C5A059]/40 text-[10px] font-bold text-[#9E7A32] shadow-xs active:scale-95 transition-transform"
                >
                  Expand Form
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMobileSheetMode('split')}
                  className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#C5A059]/40 text-[10px] font-bold text-[#171412] shadow-xs active:scale-95 transition-transform"
                >
                  Collapse Form
                </button>
              )}

              {mobileSheetMode !== 'minimized' && (
                <button
                  type="button"
                  onClick={() => setMobileSheetMode('minimized')}
                  className="px-2.5 py-1 rounded-full bg-white border border-[#C5A059]/30 text-[10px] font-semibold text-[#7D705C] shadow-xs active:scale-95 transition-transform"
                >
                  Full 3D
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Minimized Quick Bar (Mobile only) */}
        {mobileSheetMode === 'minimized' && (
          <div
            onClick={() => setMobileSheetMode('split')}
            className="lg:hidden w-full h-full flex items-center justify-between px-4 cursor-pointer bg-[#FCFBF8] border-t border-[#C5A059]/30 shadow-lg active:bg-[#FAF8F5]"
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 p-1 rounded-md bg-white border border-[#C5A059]/35 flex items-center justify-center">
                <img src="/zigguratss-logo.png" alt="Logo" className="w-full h-full object-contain" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#171412]">
                Zigguratss · Join Us
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#9E7A32] flex items-center gap-1">
              Open Form ↑
            </span>
          </div>
        )}

        {/* Main Event / Join Us Form Component */}
        <div className={`w-full flex-1 ${mobileSheetMode === 'minimized' ? 'hidden lg:block' : 'block'}`}>
          <EventAdvertisingPanel />
        </div>
      </aside>

      {/* ── Yellow Vertical/Horizontal Seam Tab on border of Museum (70%) and Form (30%) ── */}
      <SignInSeamButton />
    </div>
  );
};

export default MuseumView;
