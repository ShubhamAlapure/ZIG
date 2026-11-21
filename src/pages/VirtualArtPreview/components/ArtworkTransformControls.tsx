import React from 'react';
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Sun,
  Layers,
  Compass,
  Move,
  Scan,
} from 'lucide-react';
import { TransformState } from '../hooks/useArtworkTransform';
import { VirtualArtwork } from '../services/artworkService';

interface ArtworkTransformControlsProps {
  transform: TransformState;
  selectedArtwork: VirtualArtwork;
  onScaleChange: (scale: number) => void;
  onRotationChange: (deg: number) => void;
  onPerspectiveTiltChange: (pitch: number, yaw: number) => void;
  onTogglePerspectiveMode: () => void;
  onUpdateShadows: (updates: Partial<Pick<TransformState, 'shadowBlur' | 'shadowOpacity' | 'shadowOffsetX' | 'shadowOffsetY'>>) => void;
  onUpdateLighting: (updates: Partial<Pick<TransformState, 'blendMode' | 'artworkBrightness' | 'artworkContrast'>>) => void;
  onReset: () => void;
}

export const ArtworkTransformControls: React.FC<ArtworkTransformControlsProps> = ({
  transform,
  selectedArtwork,
  onScaleChange,
  onRotationChange,
  onPerspectiveTiltChange,
  onTogglePerspectiveMode,
  onUpdateShadows,
  onUpdateLighting,
  onReset,
}) => {
  // Approximate physical dimensions at current scale
  const scaleRatio = transform.scaleWidthPercent / 32;
  const currentWidthCm = Math.round(selectedArtwork.widthCm * scaleRatio);
  const currentHeightCm = Math.round(selectedArtwork.heightCm * scaleRatio);

  return (
    <div className="space-y-4 text-xs">
      {/* Real-world dimension readout */}
      <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#181410] border border-[#C9A94F]/20">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#C9A94F] font-semibold block">
            Calibrated Wall Scale
          </span>
          <span className="text-sm font-mono text-[#F5F0E8] font-medium">
            {currentWidthCm} × {currentHeightCm} cm
          </span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 text-[#F5F0E8]/70 hover:text-[#C9A94F] transition-all cursor-pointer text-[11px]"
          title="Reset position & scale"
        >
          <RotateCcw size={12} />
          <span>Reset</span>
        </button>
      </div>

      {/* Scale & Dimensions Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[#F5F0E8]/80 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Maximize2 size={12} className="text-[#C9A94F]" /> Size on Wall
          </span>
          <span className="font-mono text-[#C9A94F]">{transform.scaleWidthPercent}%</span>
        </div>
        <input
          type="range"
          min="12"
          max="80"
          value={transform.scaleWidthPercent}
          onChange={(e) => onScaleChange(Number(e.target.value))}
          className="w-full vap-range-slider"
        />
      </div>

      {/* Rotation Slider */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[#F5F0E8]/80 text-[11px]">
          <span className="flex items-center gap-1.5">
            <Compass size={12} className="text-[#C9A94F]" /> Rotation Angle
          </span>
          <span className="font-mono text-[#C9A94F]">{transform.rotationDeg}°</span>
        </div>
        <input
          type="range"
          min="-45"
          max="45"
          value={transform.rotationDeg}
          onChange={(e) => onRotationChange(Number(e.target.value))}
          className="w-full vap-range-slider"
        />
      </div>

      {/* Perspective Adjustment Mode */}
      <div className="p-3 rounded-lg bg-[#181410] border border-[#C9A94F]/25 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#C9A94F] font-semibold text-xs">
            <Scan size={14} />
            <span>Perspective Alignment</span>
          </div>
          <button
            type="button"
            onClick={onTogglePerspectiveMode}
            className={`px-2.5 py-1 rounded text-[10px] font-medium transition-all cursor-pointer ${
              transform.isPerspectiveMode
                ? 'bg-[#C9A94F] text-[#0D0A08] font-bold shadow'
                : 'bg-white/10 hover:bg-[#C9A94F]/20 text-[#F5F0E8]'
            }`}
          >
            {transform.isPerspectiveMode ? 'Corner Pin (Active)' : 'Enable Corner Pins'}
          </button>
        </div>

        {transform.isPerspectiveMode ? (
          <p className="text-[11px] text-[#F5F0E8]/60 leading-relaxed">
            Drag the 4 corner handles on the wall canvas to align the painting to angled walls.
          </p>
        ) : (
          <div className="space-y-2 pt-1">
            <div className="flex justify-between text-[11px] text-[#F5F0E8]/70">
              <span>3D Wall Tilt (Yaw)</span>
              <span className="font-mono text-[#C9A94F]">{transform.yawY}°</span>
            </div>
            <input
              type="range"
              min="-30"
              max="30"
              value={transform.yawY}
              onChange={(e) => onPerspectiveTiltChange(transform.pitchX, Number(e.target.value))}
              className="w-full vap-range-slider"
            />
          </div>
        )}
      </div>

      {/* Realistic Shadow & Lighting */}
      <div className="p-3 rounded-lg bg-[#181410] border border-[#C9A94F]/25 space-y-3">
        <div className="flex items-center gap-1.5 text-[#C9A94F] font-semibold text-xs">
          <Sun size={14} />
          <span>Realistic Drop Shadow &amp; Lighting</span>
        </div>

        {/* Shadow Opacity */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-[#F5F0E8]/70">
            <span>Shadow Depth</span>
            <span className="font-mono text-[#C9A94F]">{Math.round(transform.shadowOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={transform.shadowOpacity}
            onChange={(e) => onUpdateShadows({ shadowOpacity: Number(e.target.value) })}
            className="w-full vap-range-slider"
          />
        </div>

        {/* Shadow Softness / Blur */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] text-[#F5F0E8]/70">
            <span>Ambient Softness</span>
            <span className="font-mono text-[#C9A94F]">{transform.shadowBlur}px</span>
          </div>
          <input
            type="range"
            min="5"
            max="60"
            value={transform.shadowBlur}
            onChange={(e) => onUpdateShadows({ shadowBlur: Number(e.target.value) })}
            className="w-full vap-range-slider"
          />
        </div>

        {/* Blend Mode for Lighting Integration */}
        <div className="space-y-1">
          <span className="text-[11px] text-[#F5F0E8]/70 block">Wall Blend Mode</span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['normal', 'multiply', 'soft-light'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onUpdateLighting({ blendMode: mode })}
                className={`py-1 text-[10px] rounded capitalize transition-all cursor-pointer ${
                  transform.blendMode === mode
                    ? 'bg-[#C9A94F] text-[#0D0A08] font-bold'
                    : 'bg-[#221B14] hover:bg-white/10 text-[#F5F0E8]/70'
                }`}
              >
                {mode === 'soft-light' ? 'Soft Light' : mode}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
