import { QuadCorners, drawSubdividedQuad } from '../utils/perspectiveWarp';
import { FrameStyleId } from './artworkService';

export interface ExportCompositionOptions {
  wallImage: HTMLImageElement;
  artworkImage: HTMLImageElement;
  corners: QuadCorners;
  frameStyle: FrameStyleId;
  hasMat: boolean;
  matWidthPercent: number; // e.g. 5%
  shadowBlur: number;
  shadowOpacity: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  blendMode: GlobalCompositeOperation;
  artworkBrightness: number; // 0.8 to 1.2
  artworkContrast: number;
  includeWatermark: boolean;
  artworkTitle: string;
  artistName: string;
}

export class ImageExportService {
  /**
   * Renders the framed artwork onto an offscreen canvas at high resolution
   */
  private static renderFramedArtworkCanvas(
    artImg: HTMLImageElement,
    frameStyle: FrameStyleId,
    hasMat: boolean,
    matWidthRatio = 0.06
  ): HTMLCanvasElement {
    const canvas = document.createElement('canvas');
    const baseW = 1600;
    const baseH = Math.round(baseW / (artImg.width / artImg.height));

    let frameThickness = 0;
    if (frameStyle === 'none') {
      frameThickness = Math.round(baseW * 0.015);
    } else {
      frameThickness = Math.round(baseW * 0.045);
    }

    const matThickness = hasMat ? Math.round(baseW * matWidthRatio) : 0;
    const totalBorder = frameThickness + matThickness;

    canvas.width = baseW + totalBorder * 2;
    canvas.height = baseH + totalBorder * 2;
    const ctx = canvas.getContext('2d')!;

    // 1. Draw Frame Background
    if (frameStyle === 'ornate-gold') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, '#E8D5A0');
      grad.addColorStop(0.2, '#C9A94F');
      grad.addColorStop(0.5, '#997A2E');
      grad.addColorStop(0.8, '#D8BC6D');
      grad.addColorStop(1, '#6F561D');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Ornate inner bevel
      ctx.strokeStyle = '#523E11';
      ctx.lineWidth = frameThickness * 0.2;
      ctx.strokeRect(frameThickness * 0.1, frameThickness * 0.1, canvas.width - frameThickness * 0.2, canvas.height - frameThickness * 0.2);
    } else if (frameStyle === 'carved-walnut') {
      const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      grad.addColorStop(0, '#533923');
      grad.addColorStop(0.5, '#382516');
      grad.addColorStop(1, '#25170D');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (frameStyle === 'classic-black') {
      ctx.fillStyle = '#18181B';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // Subtle inner rim
      ctx.strokeStyle = '#27272A';
      ctx.lineWidth = 2;
      ctx.strokeRect(frameThickness * 0.5, frameThickness * 0.5, canvas.width - frameThickness, canvas.height - frameThickness);
    } else if (frameStyle === 'natural-oak') {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, '#D4B892');
      grad.addColorStop(0.5, '#C2A379');
      grad.addColorStop(1, '#B09066');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else if (frameStyle === 'white-minimal') {
      ctx.fillStyle = '#F5F5F3';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    } else {
      // Stretched canvas wrap: deep neutral tone
      ctx.fillStyle = '#1D1A17';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 2. Draw Mat (Passe-partout)
    if (hasMat) {
      ctx.fillStyle = '#F8F6F0';
      ctx.fillRect(frameThickness, frameThickness, canvas.width - frameThickness * 2, canvas.height - frameThickness * 2);
      // Inner mat bevel shadow
      ctx.strokeStyle = 'rgba(0,0,0,0.18)';
      ctx.lineWidth = 2;
      ctx.strokeRect(totalBorder - 2, totalBorder - 2, baseW + 4, baseH + 4);
    }

    // 3. Draw Artwork
    ctx.drawImage(artImg, totalBorder, totalBorder, baseW, baseH);

    return canvas;
  }

  /**
   * Generates a high resolution export canvas
   */
  public static async generatePreviewBlob(options: ExportCompositionOptions): Promise<Blob> {
    const {
      wallImage,
      artworkImage,
      corners,
      frameStyle,
      hasMat,
      matWidthPercent,
      shadowBlur,
      shadowOpacity,
      shadowOffsetX,
      shadowOffsetY,
      blendMode,
      artworkBrightness,
      artworkContrast,
      includeWatermark,
      artworkTitle,
      artistName,
    } = options;

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = wallImage.naturalWidth || wallImage.width || 1920;
    exportCanvas.height = wallImage.naturalHeight || wallImage.height || 1080;
    const ctx = exportCanvas.getContext('2d')!;

    // 1. Draw base wall photograph
    ctx.drawImage(wallImage, 0, 0, exportCanvas.width, exportCanvas.height);

    // 2. Render framed artwork on offscreen canvas
    const framedArtCanvas = this.renderFramedArtworkCanvas(
      artworkImage,
      frameStyle,
      hasMat,
      matWidthPercent
    );

    // 3. Draw Realistic Multi-Pass Ambient & Directional Drop Shadow
    ctx.save();
    const shadowQuad: QuadCorners = {
      tl: { x: corners.tl.x + shadowOffsetX, y: corners.tl.y + shadowOffsetY },
      tr: { x: corners.tr.x + shadowOffsetX, y: corners.tr.y + shadowOffsetY },
      br: { x: corners.br.x + shadowOffsetX, y: corners.br.y + shadowOffsetY },
      bl: { x: corners.bl.x + shadowOffsetX, y: corners.bl.y + shadowOffsetY },
    };

    // Soft ambient shadow silhouette
    ctx.shadowColor = `rgba(0, 0, 0, ${shadowOpacity})`;
    ctx.shadowBlur = shadowBlur;
    ctx.shadowOffsetX = shadowOffsetX * 0.7;
    ctx.shadowOffsetY = shadowOffsetY * 0.7;

    ctx.fillStyle = `rgba(0, 0, 0, ${shadowOpacity * 0.7})`;
    ctx.beginPath();
    ctx.moveTo(shadowQuad.tl.x, shadowQuad.tl.y);
    ctx.lineTo(shadowQuad.tr.x, shadowQuad.tr.y);
    ctx.lineTo(shadowQuad.br.x, shadowQuad.br.y);
    ctx.lineTo(shadowQuad.bl.x, shadowQuad.bl.y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 4. Draw Warped Artwork Quad
    ctx.save();
    if (blendMode && blendMode !== 'source-over') {
      ctx.globalCompositeOperation = blendMode;
    }
    if (artworkBrightness !== 1 || artworkContrast !== 1) {
      ctx.filter = `brightness(${artworkBrightness}) contrast(${artworkContrast})`;
    }

    drawSubdividedQuad(ctx, framedArtCanvas, corners, 16);
    ctx.restore();

    // 5. Optional Museum Curatorial Watermark
    if (includeWatermark) {
      ctx.save();
      const margin = 40;
      const fontSize = Math.max(16, Math.round(exportCanvas.width * 0.012));
      ctx.font = `500 ${fontSize}px 'Cinzel', 'Cormorant Garamond', serif`;
      ctx.fillStyle = 'rgba(245, 240, 232, 0.85)';
      ctx.textAlign = 'right';
      ctx.textBaseline = 'bottom';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 2;

      ctx.fillText('ZIG ART MUSEUM · VIRTUAL WALL PREVIEW', exportCanvas.width - margin, exportCanvas.height - margin - fontSize - 6);
      ctx.font = `italic 400 ${Math.round(fontSize * 0.85)}px 'Cormorant Garamond', serif`;
      ctx.fillStyle = 'rgba(201, 169, 79, 0.9)';
      ctx.fillText(`"${artworkTitle}" by ${artistName}`, exportCanvas.width - margin, exportCanvas.height - margin);
      ctx.restore();
    }

    return new Promise((resolve, reject) => {
      exportCanvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('Failed to generate export image blob'));
        },
        'image/png',
        0.95
      );
    });
  }

  /**
   * Helper to trigger download in browser
   */
  public static triggerDownload(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
}
