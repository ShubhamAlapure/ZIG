import React, { useState } from 'react';
import {
  X,
  Camera,
  Maximize2,
  RotateCcw,
  Palette,
  Sliders,
  Check,
} from 'lucide-react';
import { FrameStyleId, AVAILABLE_FRAMES, VirtualArtwork } from '../services/artworkService';

interface ARControlsProps {
  artwork: VirtualArtwork;
  selectedFrame: FrameStyleId;
  onSelectFrame: (id: FrameStyleId) => void;
  scaleFactor: number;
  onScaleChange: (scale: number) => void;
  isPlaced: boolean;
  onReposition: () => void;
  onTakeSnapshot: () => void;
  onExitAR: () => void;
}

export const ARControls: React.FC<ARControlsProps> = ({
  artwork,
  selectedFrame,
  onSelectFrame,
  scaleFactor,
  onScaleChange,
  isPlaced,
  onReposition,
  onTakeSnapshot,
  onExitAR,
}) => {
  const [showFrameDrawer, setShowFrameDrawer] = useState<boolean>(false);
  const [showScaleSlider, setShowScaleSlider] = useState<boolean>(false);

  const displayWidthCm = Math.round(artwork.widthCm * scaleFactor);
  const displayHeightCm = Math.round(artwork.heightCm * scaleFactor);

  return (
    <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* ── Top Bar: Title & Exit Button ── */}
      <div className="flex items-center justify-between w-full pointer-events-auto">
        <div className="glass-panel px-3.5 py-1.5 rounded-full border border-[#C9A94F]/30 backdrop-blur-xl flex items-center gap-2 text-xs text-[#F5F0E8] shadow-lg">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-medium truncate max-w-[160px] sm:max-w-xs">{artwork.title}</span>
          <span className="text-[10px] text-[#C9A94F] font-mono border-l border-white/10 pl-2">
            {displayWidthCm} × {displayHeightCm} cm
          </span>
        </div>

        <button
          type="button"
          onClick={onExitAR}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#14110E]/90 hover:bg-[#C9A94F]/20 text-[#F5F0E8] border border-[#C9A94F]/40 backdrop-blur-xl shadow-xl transition-all cursor-pointer text-xs font-medium"
        >
          <X size={15} className="text-[#C9A94F]" />
          <span>Exit AR</span>
        </button>
      </div>

      {/* ── Bottom Controls ── */}
      <div className="w-full max-w-lg mx-auto flex flex-col items-center gap-3 pointer-events-auto">
        {/* Expandable Frame Selector Bar */}
        {showFrameDrawer && (
          <div className="glass-panel w-full p-2.5 rounded-2xl border border-[#C9A94F]/30 shadow-2xl backdrop-blur-2xl flex items-center gap-2 overflow-x-auto vap-scrollbar animate-in fade-in slide-in-from-bottom-2">
            {AVAILABLE_FRAMES.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => {
                  onSelectFrame(f.id);
                  setShowFrameDrawer(false);
                }}
                className={`flex-shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                  selectedFrame === f.id
                    ? 'bg-[#2B2319] border-[#C9A94F] text-[#E8D5A0] font-semibold'
                    : 'bg-[#181410] border-white/10 text-[#F5F0E8]/70 hover:text-white'
                }`}
              >
                <div
                  className="w-3.5 h-3.5 rounded-full border border-white/20"
                  style={{ backgroundColor: f.colorHex }}
                />
                <span>{f.name}</span>
                {selectedFrame === f.id && <Check size={12} className="text-[#C9A94F]" />}
              </button>
            ))}
          </div>
        )}

        {/* Expandable Scale Slider Bar */}
        {showScaleSlider && (
          <div className="glass-panel w-full p-3 rounded-2xl border border-[#C9A94F]/30 shadow-2xl backdrop-blur-2xl space-y-1 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex justify-between text-xs text-[#F5F0E8]">
              <span>Real-world Scale (1:1 Calibrated)</span>
              <span className="font-mono text-[#C9A94F]">
                {Math.round(scaleFactor * 100)}% ({displayWidthCm} × {displayHeightCm} cm)
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.6"
              step="0.05"
              value={scaleFactor}
              onChange={(e) => onScaleChange(Number(e.target.value))}
              className="w-full vap-range-slider"
            />
          </div>
        )}

        {/* Primary Bottom Floating Button Bar */}
        <div className="glass-panel p-2 rounded-full border border-[#C9A94F]/40 shadow-2xl backdrop-blur-2xl flex items-center gap-2">
          {/* Frame Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowFrameDrawer(!showFrameDrawer);
              setShowScaleSlider(false);
            }}
            className={`p-3 rounded-full transition-all ${
              showFrameDrawer
                ? 'bg-[#C9A94F] text-[#0D0A08]'
                : 'hover:bg-white/10 text-[#F5F0E8]/80 hover:text-[#C9A94F]'
            }`}
            title="Choose Frame"
          >
            <Palette size={18} />
          </button>

          {/* Scale Toggle */}
          <button
            type="button"
            onClick={() => {
              setShowScaleSlider(!showScaleSlider);
              setShowFrameDrawer(false);
            }}
            className={`p-3 rounded-full transition-all ${
              showScaleSlider
                ? 'bg-[#C9A94F] text-[#0D0A08]'
                : 'hover:bg-white/10 text-[#F5F0E8]/80 hover:text-[#C9A94F]'
            }`}
            title="Adjust Real-World Scale"
          >
            <Maximize2 size={18} />
          </button>

          {/* Snapshot Button (Center Accent) */}
          <button
            type="button"
            onClick={onTakeSnapshot}
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#C9A94F] to-[#E8D5A0] text-[#0D0A08] font-bold text-xs shadow-[0_4px_20px_rgba(201,169,79,0.5)] active:scale-95 transition-transform cursor-pointer"
            title="Take Photo Snapshot"
          >
            <Camera size={16} />
            <span className="hidden sm:inline">Snapshot</span>
          </button>

          {/* Reposition Reticle Button */}
          {isPlaced && (
            <button
              type="button"
              onClick={onReposition}
              className="p-3 rounded-full hover:bg-white/10 text-[#F5F0E8]/80 hover:text-[#C9A94F] transition-all cursor-pointer"
              title="Reposition on Wall"
            >
              <RotateCcw size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
