export interface ParsedDimensions {
  widthCm: number;
  heightCm: number;
  depthCm: number;
  isApproximate: boolean;
  label: string;
}

/**
 * Parses dimension strings like "160 × 120 cm", "180 × 120 × 4 cm", or "120 cm"
 */
export function parseDimensions(dimStr: string, fallbackRatio = 1.0): ParsedDimensions {
  if (!dimStr) {
    return {
      widthCm: 100,
      heightCm: Math.round(100 / fallbackRatio),
      depthCm: 3,
      isApproximate: true,
      label: 'Approx. 100 × 100 cm',
    };
  }

  // Remove extra characters, normalize multiplication signs
  const cleaned = dimStr.replace(/[xX×]/g, '×').replace(/cm/gi, '').trim();
  const parts = cleaned.split('×').map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));

  if (parts.length >= 2) {
    const heightCm = parts[0];
    const widthCm = parts[1];
    const depthCm = parts[2] || 3.5;
    return {
      widthCm,
      heightCm,
      depthCm,
      isApproximate: false,
      label: `${widthCm} × ${heightCm} cm`,
    };
  } else if (parts.length === 1) {
    const size = parts[0];
    return {
      widthCm: size,
      heightCm: Math.round(size / fallbackRatio),
      depthCm: 3.5,
      isApproximate: true,
      label: `Approx. ${size} × ${Math.round(size / fallbackRatio)} cm`,
    };
  }

  return {
    widthCm: 120,
    heightCm: Math.round(120 / fallbackRatio),
    depthCm: 3.5,
    isApproximate: true,
    label: 'Approx. 120 × 90 cm',
  };
}

/**
 * Converts centimeters to 3D world space meters (1 cm = 0.01 m)
 */
export function cmToMeters(cm: number): number {
  return cm * 0.01;
}

/**
 * Formats dimension in imperial (inches) and metric (cm)
 */
export function formatBilingualDimensions(widthCm: number, heightCm: number): {
  metric: string;
  imperial: string;
} {
  const widthIn = (widthCm / 2.54).toFixed(1);
  const heightIn = (heightCm / 2.54).toFixed(1);
  return {
    metric: `${widthCm} × ${heightCm} cm`,
    imperial: `${widthIn}″ × ${heightIn}″`,
  };
}
