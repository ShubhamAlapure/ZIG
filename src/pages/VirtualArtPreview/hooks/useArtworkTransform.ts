import { useState, useCallback, useMemo } from 'react';
import { QuadCorners } from '../utils/perspectiveWarp';

export interface TransformState {
  // Center position as percentage of container (0-100)
  posX: number;
  posY: number;
  // Width in percentage of container (10-90)
  scaleWidthPercent: number;
  // Rotation in degrees
  rotationDeg: number;
  // 3D perspective tilt
  pitchX: number; // -30 to 30 deg
  yawY: number;   // -30 to 30 deg
  // Perspective Corner Pin mode enabled
  isPerspectiveMode: boolean;
  // 4 corners in normalized (0-100%) space
  corners: QuadCorners;
  // Realistic shadow controls
  shadowBlur: number;
  shadowOpacity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  // Lighting & compositing
  blendMode: 'normal' | 'multiply' | 'soft-light';
  artworkBrightness: number; // 0.8 to 1.2
  artworkContrast: number;
}

const DEFAULT_TRANSFORM: TransformState = {
  posX: 50,
  posY: 42,
  scaleWidthPercent: 32,
  rotationDeg: 0,
  pitchX: 0,
  yawY: 0,
  isPerspectiveMode: false,
  corners: {
    tl: { x: 34, y: 22 },
    tr: { x: 66, y: 22 },
    br: { x: 66, y: 62 },
    bl: { x: 34, y: 62 },
  },
  shadowBlur: 24,
  shadowOpacity: 0.45,
  shadowOffsetX: 8,
  shadowOffsetY: 14,
  blendMode: 'normal',
  artworkBrightness: 1.0,
  artworkContrast: 1.0,
};

export function useArtworkTransform(aspectRatio = 1.0) {
  const [transform, setTransform] = useState<TransformState>(() => ({
    ...DEFAULT_TRANSFORM,
  }));

  // Recompute corners when in standard mode
  const syncCornersFromCenter = useCallback(
    (
      posX: number,
      posY: number,
      widthPercent: number,
      ratio: number,
      containerAspect = 16 / 9
    ) => {
      const halfW = widthPercent / 2;
      // height in container % based on artwork aspect ratio & container ratio
      const heightPercent = (widthPercent / ratio) * (1 / containerAspect);
      const halfH = heightPercent / 2;

      return {
        tl: { x: Math.max(0, posX - halfW), y: Math.max(0, posY - halfH) },
        tr: { x: Math.min(100, posX + halfW), y: Math.max(0, posY - halfH) },
        br: { x: Math.min(100, posX + halfW), y: Math.min(100, posY + halfH) },
        bl: { x: Math.max(0, posX - halfW), y: Math.min(100, posY + halfH) },
      };
    },
    []
  );

  const updatePosition = useCallback((dx: number, dy: number) => {
    setTransform((prev) => {
      const newX = Math.min(95, Math.max(5, prev.posX + dx));
      const newY = Math.min(95, Math.max(5, prev.posY + dy));
      const deltaX = newX - prev.posX;
      const deltaY = newY - prev.posY;

      const newCorners: QuadCorners = {
        tl: { x: prev.corners.tl.x + deltaX, y: prev.corners.tl.y + deltaY },
        tr: { x: prev.corners.tr.x + deltaX, y: prev.corners.tr.y + deltaY },
        br: { x: prev.corners.br.x + deltaX, y: prev.corners.br.y + deltaY },
        bl: { x: prev.corners.bl.x + deltaX, y: prev.corners.bl.y + deltaY },
      };

      return {
        ...prev,
        posX: newX,
        posY: newY,
        corners: newCorners,
      };
    });
  }, []);

  const setScale = useCallback((newWidthPercent: number) => {
    setTransform((prev) => ({
      ...prev,
      scaleWidthPercent: Math.max(10, Math.min(85, newWidthPercent)),
    }));
  }, []);

  const setRotation = useCallback((deg: number) => {
    setTransform((prev) => ({
      ...prev,
      rotationDeg: deg,
    }));
  }, []);

  const setPerspectiveTilt = useCallback((pitchX: number, yawY: number) => {
    setTransform((prev) => ({
      ...prev,
      pitchX,
      yawY,
    }));
  }, []);

  const setCornerPin = useCallback((cornerKey: keyof QuadCorners, x: number, y: number) => {
    setTransform((prev) => {
      const newCorners = {
        ...prev.corners,
        [cornerKey]: {
          x: Math.min(100, Math.max(0, x)),
          y: Math.min(100, Math.max(0, y)),
        },
      };

      // Recalculate center
      const centerX =
        (newCorners.tl.x + newCorners.tr.x + newCorners.br.x + newCorners.bl.x) / 4;
      const centerY =
        (newCorners.tl.y + newCorners.tr.y + newCorners.br.y + newCorners.bl.y) / 4;

      return {
        ...prev,
        corners: newCorners,
        posX: centerX,
        posY: centerY,
      };
    });
  }, []);

  const togglePerspectiveMode = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      isPerspectiveMode: !prev.isPerspectiveMode,
    }));
  }, []);

  const updateShadows = useCallback(
    (updates: Partial<Pick<TransformState, 'shadowBlur' | 'shadowOpacity' | 'shadowOffsetX' | 'shadowOffsetY'>>) => {
      setTransform((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  const updateLighting = useCallback(
    (updates: Partial<Pick<TransformState, 'blendMode' | 'artworkBrightness' | 'artworkContrast'>>) => {
      setTransform((prev) => ({
        ...prev,
        ...updates,
      }));
    },
    []
  );

  const resetTransform = useCallback(() => {
    setTransform({
      ...DEFAULT_TRANSFORM,
      corners: syncCornersFromCenter(
        DEFAULT_TRANSFORM.posX,
        DEFAULT_TRANSFORM.posY,
        DEFAULT_TRANSFORM.scaleWidthPercent,
        aspectRatio
      ),
    });
  }, [aspectRatio, syncCornersFromCenter]);

  // CSS transform string for standard mode
  const standardCssTransform = useMemo(() => {
    const { rotationDeg, pitchX, yawY } = transform;
    return `rotate(${rotationDeg}deg) perspective(1000px) rotateX(${pitchX}deg) rotateY(${yawY}deg)`;
  }, [transform]);

  return {
    transform,
    updatePosition,
    setScale,
    setRotation,
    setPerspectiveTilt,
    setCornerPin,
    togglePerspectiveMode,
    updateShadows,
    updateLighting,
    resetTransform,
    standardCssTransform,
  };
}
