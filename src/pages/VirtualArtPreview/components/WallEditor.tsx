import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize,
  Compass,
  Move,
  Scan,
} from 'lucide-react';
import { TransformState } from '../hooks/useArtworkTransform';
import { VirtualArtwork, FrameStyleId, FrameOption } from '../services/artworkService';
import { WallImageInfo } from '../utils/imageProcessing';
import { getMatrix3dCSS, QuadCorners } from '../utils/perspectiveWarp';

interface WallEditorProps {
  wallImage: WallImageInfo;
  selectedArtwork: VirtualArtwork;
  selectedFrame: FrameStyleId;
  frameOption: FrameOption;
  hasMat: boolean;
  transform: TransformState;
  standardCssTransform: string;
  onUpdatePosition: (dx: number, dy: number) => void;
  onSetScale: (scale: number) => void;
  onSetRotation: (deg: number) => void;
  onSetCornerPin: (corner: keyof QuadCorners, x: number, y: number) => void;
  isCompareMode: boolean;
  sliderPosPercent: number;
  onSliderPosChange: (pos: number) => void;
  isPeekingOriginal: boolean;
}

export const WallEditor: React.FC<WallEditorProps> = ({
  wallImage,
  selectedArtwork,
  selectedFrame,
  frameOption,
  hasMat,
  transform,
  standardCssTransform,
  onUpdatePosition,
  onSetScale,
  onSetRotation,
  onSetCornerPin,
  isCompareMode,
  sliderPosPercent,
  onSliderPosChange,
  isPeekingOriginal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);

  // Zoom and pan within editor viewport
  const [zoomLevel, setZoomLevel] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const lastPanPointer = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Dragging states
  const [isDraggingArtwork, setIsDraggingArtwork] = useState<boolean>(false);
  const lastDragPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Resizing state
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const resizeInitial = useRef<{ startX: number; startScale: number }>({ startX: 0, startScale: 32 });

  // Rotating state
  const [isRotating, setIsRotating] = useState<boolean>(false);
  const rotateCenter = useRef<{ cx: number; cy: number }>({ cx: 0, cy: 0 });

  // Corner pin dragging state
  const [activeCorner, setActiveCorner] = useState<keyof QuadCorners | null>(null);

  // Split view dragging state
  const [isDraggingSplit, setIsDraggingSplit] = useState<boolean>(false);

  // 1. Zoom controls
  const handleZoom = (delta: number) => {
    setZoomLevel((prev) => Math.max(0.7, Math.min(2.5, prev + delta)));
  };

  const handleResetView = () => {
    setZoomLevel(1.0);
    setPanOffset({ x: 0, y: 0 });
  };

  // 2. Dragging Artwork on Wall (Pointer Events with pointer capture)
  const handleArtworkPointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0 || transform.isPerspectiveMode) return;
    if ((e.target as HTMLElement).closest('.handle-control')) return;

    e.preventDefault();
    e.stopPropagation();
    setIsDraggingArtwork(true);
    lastDragPos.current = { x: e.clientX, y: e.clientY };

    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleArtworkPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingArtwork || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const dxPx = e.clientX - lastDragPos.current.x;
    const dyPx = e.clientY - lastDragPos.current.y;
    lastDragPos.current = { x: e.clientX, y: e.clientY };

    // Convert pixel delta to percentage of container
    const dxPercent = (dxPx / (rect.width * zoomLevel)) * 100;
    const dyPercent = (dyPx / (rect.height * zoomLevel)) * 100;
    onUpdatePosition(dxPercent, dyPercent);
  };

  const handleArtworkPointerUp = (e: React.PointerEvent) => {
    if (!isDraggingArtwork) return;
    setIsDraggingArtwork(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // 3. Resizing via Corner Handles
  const handleResizePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeInitial.current = {
      startX: e.clientX,
      startScale: transform.scaleWidthPercent,
    };
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleResizePointerMove = (e: React.PointerEvent) => {
    if (!isResizing || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - resizeInitial.current.startX;
    const deltaPercent = (deltaX / rect.width) * 100 * 1.5;
    onSetScale(resizeInitial.current.startScale + deltaPercent);
  };

  const handleResizePointerUp = (e: React.PointerEvent) => {
    if (!isResizing) return;
    setIsResizing(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // 4. Rotation via Top Handle
  const handleRotatePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsRotating(true);
    if (artworkRef.current) {
      const rect = artworkRef.current.getBoundingClientRect();
      rotateCenter.current = {
        cx: rect.left + rect.width / 2,
        cy: rect.top + rect.height / 2,
      };
    }
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleRotatePointerMove = (e: React.PointerEvent) => {
    if (!isRotating) return;
    const angleRad = Math.atan2(
      e.clientY - rotateCenter.current.cy,
      e.clientX - rotateCenter.current.cx
    );
    const angleDeg = Math.round((angleRad * 180) / Math.PI) - 90; // offset so top handle is 0
    onSetRotation(Math.max(-45, Math.min(45, angleDeg)));
  };

  const handleRotatePointerUp = (e: React.PointerEvent) => {
    if (!isRotating) return;
    setIsRotating(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // 5. Corner Pin Dragging (for Perspective Warping)
  const handleCornerPointerDown = (corner: keyof QuadCorners) => (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveCorner(corner);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleCornerPointerMove = (e: React.PointerEvent) => {
    if (!activeCorner || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    onSetCornerPin(activeCorner, xPercent, yPercent);
  };

  const handleCornerPointerUp = (e: React.PointerEvent) => {
    if (!activeCorner) return;
    setActiveCorner(null);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // 6. Split Slider Dragging
  const handleSplitPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingSplit(true);
    try {
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handleSplitPointerMove = (e: React.PointerEvent) => {
    if (!isDraggingSplit || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    onSliderPosChange(pos);
  };

  const handleSplitPointerUp = (e: React.PointerEvent) => {
    setIsDraggingSplit(false);
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  };

  // Calculate CSS perspective matrix if in perspective mode
  const matrix3dStyle = transform.isPerspectiveMode
    ? getMatrix3dCSS(300, 300 / selectedArtwork.aspectRatio, {
        tl: { x: (transform.corners.tl.x / 100) * 800, y: (transform.corners.tl.y / 100) * 450 },
        tr: { x: (transform.corners.tr.x / 100) * 800, y: (transform.corners.tr.y / 100) * 450 },
        br: { x: (transform.corners.br.x / 100) * 800, y: (transform.corners.br.y / 100) * 450 },
        bl: { x: (transform.corners.bl.x / 100) * 800, y: (transform.corners.bl.y / 100) * 450 },
      })
    : '';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-[#080706] overflow-hidden select-none">
      {/* ── Editor Toolbar Overlays ── */}
      <div className="absolute top-4 left-4 z-30 flex items-center gap-1.5 p-1 rounded-full bg-[#14110E]/80 backdrop-blur-md border border-[#C9A94F]/30 shadow-lg">
        <button
          type="button"
          onClick={() => handleZoom(0.15)}
          className="p-1.5 rounded-full hover:bg-white/10 text-[#F5F0E8]/70 hover:text-[#C9A94F] transition-all"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(-0.15)}
          className="p-1.5 rounded-full hover:bg-white/10 text-[#F5F0E8]/70 hover:text-[#C9A94F] transition-all"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <div className="h-4 w-px bg-white/10" />
        <button
          type="button"
          onClick={handleResetView}
          className="p-1.5 rounded-full hover:bg-white/10 text-[#F5F0E8]/70 hover:text-[#C9A94F] transition-all text-xs"
          title="Fit to Screen"
        >
          <Maximize size={13} />
        </button>
        <span className="px-2 text-[10px] font-mono text-[#C9A94F]">
          {Math.round(zoomLevel * 100)}%
        </span>
      </div>

      {/* ── Main Canvas Viewport ── */}
      <div
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center overflow-hidden"
        style={{
          transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
          transformOrigin: 'center center',
          transition: isDraggingArtwork || isResizing || isRotating ? 'none' : 'transform 0.15s ease-out',
        }}
      >
        {/* Room Photograph Layer */}
        <img
          src={wallImage.url}
          alt="Room wall photo"
          className="w-full h-full object-contain pointer-events-none"
        />

        {/* ── Mounted Artwork Composition Layer (Hidden if peeking original) ── */}
        {!isPeekingOriginal && (
          <div
            ref={artworkRef}
            onPointerDown={handleArtworkPointerDown}
            onPointerMove={handleArtworkPointerMove}
            onPointerUp={handleArtworkPointerUp}
            className={`absolute vap-drag-handle transition-shadow ${
              isDraggingArtwork ? 'dragging ring-2 ring-[#C9A94F]/80 z-20' : 'z-10'
            }`}
            style={{
              left: `${transform.posX}%`,
              top: `${transform.posY}%`,
              width: `${transform.scaleWidthPercent}%`,
              transform: `translate(-50%, -50%) ${standardCssTransform}`,
              filter: `drop-shadow(${transform.shadowOffsetX}px ${transform.shadowOffsetY}px ${transform.shadowBlur}px rgba(0,0,0,${transform.shadowOpacity}))`,
              mixBlendMode: transform.blendMode,
            }}
          >
            {/* Real-time Dimension Tag */}
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-[#0D0A08]/90 text-[#E8D5A0] text-[10px] font-mono px-2 py-0.5 rounded-full border border-[#C9A94F]/40 shadow-md whitespace-nowrap pointer-events-none">
              {selectedArtwork.widthCm} × {selectedArtwork.heightCm} cm
            </div>

            {/* Rotation Control Handle */}
            <div
              onPointerDown={handleRotatePointerDown}
              onPointerMove={handleRotatePointerMove}
              onPointerUp={handleRotatePointerUp}
              className="handle-control absolute -top-8 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#C9A94F] text-[#0D0A08] flex items-center justify-center cursor-grab active:cursor-grabbing shadow-lg hover:scale-110 transition-transform"
              title="Drag to rotate artwork"
            >
              <Compass size={11} strokeWidth={2.5} />
            </div>

            {/* Framed Canvas Box */}
            <div
              className={`relative overflow-hidden ${
                selectedFrame === 'ornate-gold'
                  ? 'vap-frame-ornate-gold'
                  : selectedFrame === 'carved-walnut'
                  ? 'vap-frame-carved-walnut'
                  : selectedFrame === 'classic-black'
                  ? 'vap-frame-classic-black'
                  : selectedFrame === 'natural-oak'
                  ? 'vap-frame-natural-oak'
                  : selectedFrame === 'white-minimal'
                  ? 'vap-frame-white-minimal'
                  : 'vap-frame-none'
              }`}
            >
              {/* Optional Linen Mat (Passe-partout) */}
              <div className={hasMat ? 'p-3 vap-mat' : 'p-0'}>
                <img
                  src={selectedArtwork.imageUrl}
                  alt={selectedArtwork.title}
                  className="w-full h-auto block object-cover pointer-events-none"
                  style={{
                    filter: `brightness(${transform.artworkBrightness}) contrast(${transform.artworkContrast})`,
                  }}
                />
              </div>
            </div>

            {/* Resize Handles on 4 Corners */}
            <div
              onPointerDown={handleResizePointerDown}
              onPointerMove={handleResizePointerMove}
              onPointerUp={handleResizePointerUp}
              className="handle-control absolute -bottom-2 -right-2 w-4 h-4 rounded-full bg-[#C9A94F] border-2 border-[#0D0A08] cursor-se-resize shadow-md hover:scale-125 transition-transform"
              title="Drag to resize"
            />
            <div
              onPointerDown={handleResizePointerDown}
              onPointerMove={handleResizePointerMove}
              onPointerUp={handleResizePointerUp}
              className="handle-control absolute -top-2 -left-2 w-4 h-4 rounded-full bg-[#C9A94F] border-2 border-[#0D0A08] cursor-nw-resize shadow-md hover:scale-125 transition-transform"
              title="Drag to resize"
            />
          </div>
        )}

        {/* ── Perspective Corner Pin Mode Handles ── */}
        {transform.isPerspectiveMode && (
          <div className="absolute inset-0 pointer-events-auto z-30">
            {(['tl', 'tr', 'br', 'bl'] as const).map((corner) => {
              const pt = transform.corners[corner];
              return (
                <div
                  key={corner}
                  onPointerDown={handleCornerPointerDown(corner)}
                  onPointerMove={handleCornerPointerMove}
                  onPointerUp={handleCornerPointerUp}
                  className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#C9A94F] border-2 border-white text-[9px] font-bold text-black flex items-center justify-center cursor-move shadow-xl hover:scale-125 active:scale-110 transition-transform uppercase"
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  title={`Drag ${corner.toUpperCase()} corner to adjust perspective`}
                >
                  {corner}
                </div>
              );
            })}
          </div>
        )}

        {/* ── Split Before / After Divider Layer ── */}
        {isCompareMode && (
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              clipPath: `inset(0 0 0 ${sliderPosPercent}%)`,
            }}
          >
            {/* Split line divider */}
            <div
              onPointerDown={handleSplitPointerDown}
              onPointerMove={handleSplitPointerMove}
              onPointerUp={handleSplitPointerUp}
              className="pointer-events-auto absolute top-0 bottom-0 -ml-0.5 w-1 bg-[#C9A94F] shadow-[0_0_12px_rgba(201,169,79,0.8)] cursor-ew-resize flex items-center justify-center"
              style={{ left: `${sliderPosPercent}%` }}
            >
              <div className="w-7 h-7 rounded-full bg-[#C9A94F] text-[#0D0A08] flex items-center justify-center shadow-lg border-2 border-[#0D0A08]">
                <Move size={13} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Helper text overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none bg-[#0D0A08]/80 text-[#F5F0E8]/70 text-[11px] px-3.5 py-1.5 rounded-full border border-white/10 shadow-lg backdrop-blur-md hidden sm:block">
        Drag painting to position · Use corners to resize · Rotate from top pin
      </div>
    </div>
  );
};
