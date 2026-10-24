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

  return (
    <div className="w-full h-screen flex flex-col-reverse lg:flex-row overflow-hidden bg-[#0D0A08] relative select-none animate-fadeIn">
      {/* ── 30% Main Authentication Card Panel ── */}
      {/* Desktop: Left 30% (lg:w-[30%] lg:min-w-[360px] lg:max-w-[460px] h-full) */}
      {/* Mobile: Bottom 32% (w-full h-[32dvh] lg:h-full overflow-y-auto) */}
      <aside
        className="w-full lg:w-[30%] lg:min-w-[360px] lg:max-w-[460px] h-[32dvh] lg:h-full flex-shrink-0 z-20 border-t lg:border-t-0 lg:border-r border-[#C5A059]/20 overflow-y-auto bg-[#FCFBF8] shadow-2xl"
        style={{ contain: 'layout style' }}
      >
        <AuthPanel />
      </aside>

      {/* ── 70% 3D Interactive Park Viewport ── */}
      {/* Desktop: Right 70% (flex-1 h-full) */}
      {/* Mobile: Top 68% (w-full h-[68dvh] lg:h-full) */}
      <main
        className="relative w-full flex-1 h-[68dvh] lg:h-full flex-shrink-0 z-0 overflow-hidden"
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
