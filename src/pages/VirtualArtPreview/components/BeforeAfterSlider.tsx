import React, { useState, useRef, useCallback } from 'react';
import { Columns, Eye, EyeOff } from 'lucide-react';

interface BeforeAfterSliderProps {
  wallImageUrl: string;
  isCompareMode: boolean;
  onToggleCompareMode: () => void;
  sliderPosPercent: number;
  onSliderPosChange: (pos: number) => void;
  isPeekingOriginal: boolean;
  onSetPeekingOriginal: (peeking: boolean) => void;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  wallImageUrl,
  isCompareMode,
  onToggleCompareMode,
  sliderPosPercent,
  onSliderPosChange,
  isPeekingOriginal,
  onSetPeekingOriginal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDraggingSlider, setIsDraggingSlider] = useState<boolean>(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingSlider(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSlider || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    onSliderPosChange(percent);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDraggingSlider(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  return (
    <div className="flex items-center gap-2">
      {/* Before / After Split Slider Toggle */}
      <button
        type="button"
        onClick={onToggleCompareMode}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-md ${
          isCompareMode
            ? 'bg-[#C9A94F] text-[#0D0A08] font-semibold'
            : 'glass-panel hover:bg-white/10 text-[#F5F0E8] border border-[#C9A94F]/30'
        }`}
        title="Toggle Split Before/After Slider"
      >
        <Columns size={13} />
        <span>Split View</span>
      </button>

      {/* Instant Peek Button */}
      <button
        type="button"
        onMouseDown={() => onSetPeekingOriginal(true)}
        onMouseUp={() => onSetPeekingOriginal(false)}
        onTouchStart={() => onSetPeekingOriginal(true)}
        onTouchEnd={() => onSetPeekingOriginal(false)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer shadow-md select-none ${
          isPeekingOriginal
            ? 'bg-amber-400 text-black font-semibold'
            : 'glass-panel hover:bg-white/10 text-[#F5F0E8] border border-[#C9A94F]/30'
        }`}
        title="Hold to peek original wall photograph"
      >
        {isPeekingOriginal ? <EyeOff size={13} /> : <Eye size={13} />}
        <span>Hold to Peek Original</span>
      </button>
    </div>
  );
};
