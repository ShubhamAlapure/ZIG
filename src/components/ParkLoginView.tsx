import React, { useState, useEffect, useRef, useCallback } from 'react';
import { AuthPanel } from '@/features/auth/AuthPanel';
import { ParkScene } from '@/features/scene/Scene';
import { EnterMuseumButton } from './EnterMuseumButton';

const HINTS = [
  ['drag', 'Drag', 'look around'],
  ['scroll', 'Scroll', 'zoom'],
  ['keys', 'W A S D', 'move'],
  ['click', 'Click', 'follow someone'],
] as const;

const KEY_SET = new Set(['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright']);

export interface ParkLoginViewProps {
  isActive?: boolean;
}

export const ParkLoginView: React.FC<ParkLoginViewProps> = ({ isActive = true }) => {
  const [isReady, setIsReady] = useState(false);
  const [isQuiet, setIsQuiet] = useState(false);
  const [activeHints, setActiveHints] = useState<{ [k: string]: boolean }>({});
  const captionRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<{ zoom: (f: number) => void; reset: () => void } | null>(null);

  const onInteract = useCallback(() => setIsQuiet(true), []);

  useEffect(() => {
    const activeKeys = new Set<string>();
    const timeouts: Record<string, number> = {};

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.closest("input, textarea, select, [contenteditable='true']")) return;
      const k = e.key.toLowerCase();
      if (KEY_SET.has(k)) {
        activeKeys.add(k);
        setActiveHints((prev) => ({ ...prev, keys: true }));
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      activeKeys.delete(e.key.toLowerCase());
      if (!activeKeys.size) {
        setActiveHints((prev) => ({ ...prev, keys: false }));
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (e.target instanceof HTMLCanvasElement) {
        setActiveHints((prev) => ({ ...prev, scroll: true }));
        clearTimeout(timeouts.scroll);
        timeouts.scroll = window.setTimeout(() => {
          setActiveHints((prev) => ({ ...prev, scroll: false }));
        }, 500);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof HTMLCanvasElement) {
        setActiveHints((prev) => ({ ...prev, drag: true }));
      }
    };

    const onPointerUp = () => {
      setActiveHints((prev) => (prev.drag ? { ...prev, drag: false } : prev));
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      Object.values(timeouts).forEach(clearTimeout);
    };
  }, []);

  const [mobileSheetMode, setMobileSheetMode] = useState<'split' | 'expanded' | 'minimized'>('split');
  const seamTop = mobileSheetMode === 'expanded' ? '14dvh' : mobileSheetMode === 'minimized' ? '92dvh' : '65dvh';

  return (
    <div
      className="w-full h-screen flex flex-col-reverse lg:flex-row overflow-hidden bg-[#0D0A08] relative select-none animate-fadeIn"
      style={{ '--mobile-seam-top': seamTop } as React.CSSProperties}
    >
      {/* ── 30% Main Authentication Card Panel / Interactive Mobile Sheet ── */}
      {/* Desktop: Left 30% (lg:w-[30%] lg:min-w-[360px] lg:max-w-[460px] lg:h-full) */}
      {/* Mobile: Dynamic Responsive Sheet (split: 35dvh, expanded: 86dvh, minimized: 8dvh) */}
      <aside
        className={`w-full lg:w-[30%] lg:min-w-[360px] lg:max-w-[460px] flex-shrink-0 z-20 border-t lg:border-t-0 lg:border-r border-[#C5A059]/20 overflow-y-auto bg-[#FCFBF8] shadow-2xl transition-[height] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
                ? 'Full Form View (100%)'
                : mobileSheetMode === 'minimized'
                ? '3D Immersion'
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
                Zigguratss · Sign In
              </span>
            </div>
            <span className="text-[11px] font-bold text-[#9E7A32] flex items-center gap-1">
              Open Form ↑
            </span>
          </div>
        )}

        {/* Main Auth Panel Component */}
        <div className={`w-full flex-1 ${mobileSheetMode === 'minimized' ? 'hidden lg:block' : 'block'}`}>
          <AuthPanel />
        </div>
      </aside>

      {/* ── 70% 3D Interactive Park Viewport ── */}
      {/* Desktop: Right 70% (flex-1 h-full) */}
      {/* Mobile: Top 68% (w-full h-[68dvh] lg:h-full) */}
      <main
        className={`relative w-full flex-1 flex-shrink-0 z-0 overflow-hidden transition-[height] duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          mobileSheetMode === 'expanded'
            ? 'h-[14dvh]'
            : mobileSheetMode === 'minimized'
            ? 'h-[92dvh]'
            : 'h-[65dvh]'
        } lg:h-full`}
        style={{ contain: 'paint layout' }}
        aria-label="Interactive 3D Sculpture Park"
      >
        <section
          className="w-full h-full relative"
          aria-label="Interactive park. Drag or use W A S D and arrow keys to look around; scroll or + and − to zoom; R to reset."
        >
          {/* Static Poster Backdrop */}
          <div className="park-panel-module__olcSJq__poster" data-hidden={isReady ? 'true' : undefined} aria-hidden="true" />

          {/* 3D WebGL Park Scene */}
          <div className="park-panel-module__olcSJq__scene w-full h-full" data-ready={isReady ? 'true' : undefined}>
            <ParkScene
              labelRef={captionRef}
              controlsRef={controlsRef}
              onInteract={onInteract}
              onReady={() => setTimeout(() => setIsReady(true), 400)}
              isActive={isActive}
            />
          </div>

          {/* Interactive Floating Hover / Follow Caption */}
          <div ref={captionRef} className="park-panel-module__olcSJq__caption" aria-hidden="true" />

          {/* Vignette Shade Overlay */}
          <div className="park-panel-module__olcSJq__shade" aria-hidden="true" />

          {/* HUD Keybinding Indicators (Hidden on small mobile for clean view) */}
          <div className="park-panel-module__olcSJq__hints hidden sm:flex" data-quiet={isQuiet ? 'true' : undefined} data-ready={isReady ? 'true' : undefined}>
            {HINTS.map(([id, keyLabel, action]) => (
              <span key={id} className="park-panel-module__olcSJq__hint" data-active={activeHints[id] ? 'true' : undefined}>
                <kbd>{keyLabel}</kbd>
                {action}
              </span>
            ))}
          </div>

          {/* Bottom Right Controls: Zoom In, Zoom Out, Reset Camera */}
          <div className="park-panel-module__olcSJq__controls" data-ready={isReady ? 'true' : undefined}>
            <button type="button" onClick={() => controlsRef.current?.zoom(0.8)} aria-label="Zoom in">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
            <button type="button" onClick={() => controlsRef.current?.zoom(1.25)} aria-label="Zoom out">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M5 12h14" />
              </svg>
            </button>
            <button type="button" onClick={() => controlsRef.current?.reset()} aria-label="Reset view">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12a8 8 0 1 0 2.3-5.6" />
                <path d="M4 4v4h4" />
              </svg>
            </button>
          </div>
        </section>
      </main>

      {/* ── Glowing Museum Navigation Button — straddles 70-30 boundary ── */}
      <EnterMuseumButton />
    </div>
  );
};

export default ParkLoginView;
