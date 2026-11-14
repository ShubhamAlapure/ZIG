export interface WallImageInfo {
  url: string;
  name: string;
  width: number;
  height: number;
  fileSize: number;
  formattedSize: string;
  isPreset: boolean;
}

export interface WallPreset {
  id: string;
  name: string;
  description: string;
  url: string;
  previewUrl: string;
  lightingTemp: 'warm' | 'cool' | 'neutral';
}

/**
 * High-definition procedural wall textures for instant zero-friction testing
 */
export const WALL_PRESETS: WallPreset[] = [
  {
    id: 'minimalist-living',
    name: 'Modern Minimalist Wall',
    description: 'Clean warm-ivory plaster with soft ambient daylight',
    url: '/textures/runway_tiles.jpg', // will fallback or generate elegant canvas
    previewUrl: '',
    lightingTemp: 'neutral',
  },
  {
    id: 'classic-gallery',
    name: 'Curator’s Gallery Room',
    description: 'Rich dark slate gallery wall with directional museum spotlighting',
    url: '/textures/oil_painting.jpg',
    previewUrl: '',
    lightingTemp: 'warm',
  },
  {
    id: 'scandinavian-loft',
    name: 'Scandinavian Loft',
    description: 'Textured architectural masonry with soft shadows',
    url: '/textures/cobblestone.jpg',
    previewUrl: '',
    lightingTemp: 'cool',
  },
];

/**
 * Validates an uploaded image file
 */
export function validateWallImage(file: File): { valid: boolean; error?: string } {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPG, PNG, or WEBP).',
    };
  }

  // 25 MB max limit
  const maxBytes = 25 * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: 'File size exceeds 25MB. Please choose a smaller photo.',
    };
  }

  return { valid: true };
}

/**
 * Loads an image from a URL or Object URL and extracts dimensions
 */
export function loadImageDimensions(src: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      resolve({ width: img.naturalWidth || img.width, height: img.naturalHeight || img.height });
    };
    img.onerror = (err) => reject(err);
    img.src = src;
  });
}

/**
 * Format bytes into human-readable string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Generates an elegant procedural wall photograph for preset previews
 */
export function createProceduralWallCanvas(presetId: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const w = canvas.width;
  const h = canvas.height;

  if (presetId === 'minimalist-living') {
    // Warm alabaster wall with baseboard and subtle floor
    const wallGrad = ctx.createLinearGradient(0, 0, 0, h * 0.82);
    wallGrad.addColorStop(0, '#EAE4D9');
    wallGrad.addColorStop(1, '#D8D0C3');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, h * 0.82);

    // Subtle wall grain
    ctx.fillStyle = 'rgba(0,0,0,0.02)';
    for (let i = 0; i < 4000; i++) {
      const rx = Math.random() * w;
      const ry = Math.random() * h * 0.82;
      ctx.fillRect(rx, ry, 1.5, 1.5);
    }

    // Baseboard moulding
    ctx.fillStyle = '#C8BEAE';
    ctx.fillRect(0, h * 0.81, w, 4);
    ctx.fillStyle = '#E8E1D3';
    ctx.fillRect(0, h * 0.81 + 4, w, 18);
    ctx.fillStyle = '#B0A594';
    ctx.fillRect(0, h * 0.81 + 22, w, 3);

    // Warm natural oak wood floor
    const floorGrad = ctx.createLinearGradient(0, h * 0.83, 0, h);
    floorGrad.addColorStop(0, '#75583E');
    floorGrad.addColorStop(1, '#4B3624');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, h * 0.83, w, h * 0.17);

    // Floor planks
    ctx.strokeStyle = 'rgba(0,0,0,0.18)';
    ctx.lineWidth = 1;
    for (let x = -200; x < w + 400; x += 160) {
      ctx.beginPath();
      ctx.moveTo(x, h * 0.83);
      ctx.lineTo(x - 80, h);
      ctx.stroke();
    }

    // Soft architectural window light vignette
    const windowLight = ctx.createRadialGradient(w * 0.25, h * 0.35, 100, w * 0.3, h * 0.4, 750);
    windowLight.addColorStop(0, 'rgba(255, 252, 240, 0.28)');
    windowLight.addColorStop(1, 'rgba(255, 252, 240, 0)');
    ctx.fillStyle = windowLight;
    ctx.fillRect(0, 0, w, h);
  } else if (presetId === 'classic-gallery') {
    // Deep rich charcoal-indigo gallery wall with museum spotlight
    const wallGrad = ctx.createRadialGradient(w * 0.5, h * 0.42, 80, w * 0.5, h * 0.42, 900);
    wallGrad.addColorStop(0, '#2F323A');
    wallGrad.addColorStop(0.5, '#1E2026');
    wallGrad.addColorStop(1, '#111215');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(0, 0, w, h * 0.84);

    // Polished dark herringbone floor
    ctx.fillStyle = '#1A130F';
    ctx.fillRect(0, h * 0.84, w, h * 0.16);
    ctx.fillStyle = '#C9A94F';
    ctx.fillRect(0, h * 0.838, w, 2); // subtle brass inlay line
  } else {
    // Scandinavian Loft: textured warm greige with architectural pillar
    const loftGrad = ctx.createLinearGradient(0, 0, w, h);
    loftGrad.addColorStop(0, '#D6D2CA');
    loftGrad.addColorStop(1, '#BEB8AC');
    ctx.fillStyle = loftGrad;
    ctx.fillRect(0, 0, w, h * 0.85);

    // Clean polished concrete floor
    const concreteGrad = ctx.createLinearGradient(0, h * 0.85, 0, h);
    concreteGrad.addColorStop(0, '#5C5852');
    concreteGrad.addColorStop(1, '#3B3834');
    ctx.fillStyle = concreteGrad;
    ctx.fillRect(0, h * 0.85, w, h * 0.15);
  }

  return canvas.toDataURL('image/jpeg', 0.92);
}
