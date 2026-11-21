export interface Point2D {
  x: number;
  y: number;
}

export interface QuadCorners {
  tl: Point2D;
  tr: Point2D;
  br: Point2D;
  bl: Point2D;
}

/**
 * Solves an 8x8 linear system using Gaussian elimination to find
 * the 3x3 projective transform matrix mapping (0,0),(w,0),(w,h),(0,h) to 4 arbitrary points.
 */
export function computeProjectiveMatrix(
  w: number,
  h: number,
  corners: QuadCorners
): number[] {
  const { tl, tr, br, bl } = corners;

  // Source points
  const x0 = 0, y0 = 0;
  const x1 = w, y1 = 0;
  const x2 = w, y2 = h;
  const x3 = 0, y3 = h;

  // Destination points
  const u0 = tl.x, v0 = tl.y;
  const u1 = tr.x, v1 = tr.y;
  const u2 = br.x, v2 = br.y;
  const u3 = bl.x, v3 = bl.y;

  const A: number[][] = [
    [x0, y0, 1, 0, 0, 0, -u0 * x0, -u0 * y0],
    [0, 0, 0, x0, y0, 1, -v0 * x0, -v0 * y0],
    [x1, y1, 1, 0, 0, 0, -u1 * x1, -u1 * y1],
    [0, 0, 0, x1, y1, 1, -v1 * x1, -v1 * y1],
    [x2, y2, 1, 0, 0, 0, -u2 * x2, -u2 * y2],
    [0, 0, 0, x2, y2, 1, -v2 * x2, -v2 * y2],
    [x3, y3, 1, 0, 0, 0, -u3 * x3, -u3 * y3],
    [0, 0, 0, x3, y3, 1, -v3 * x3, -v3 * y3],
  ];

  const B: number[] = [u0, v0, u1, v1, u2, v2, u3, v3];

  // Gaussian elimination
  const n = 8;
  for (let i = 0; i < n; i++) {
    // Pivot
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) {
        maxRow = k;
      }
    }
    const tmpA = A[i];
    A[i] = A[maxRow];
    A[maxRow] = tmpA;

    const tmpB = B[i];
    B[i] = B[maxRow];
    B[maxRow] = tmpB;

    if (Math.abs(A[i][i]) < 1e-10) continue;

    for (let k = i + 1; k < n; k++) {
      const factor = A[k][i] / A[i][i];
      for (let j = i; j < n; j++) {
        A[k][j] -= factor * A[i][j];
      }
      B[k] -= factor * B[i];
    }
  }

  // Back substitution
  const H = new Array<number>(8);
  for (let i = n - 1; i >= 0; i--) {
    let sum = 0;
    for (let j = i + 1; j < n; j++) {
      sum += A[i][j] * H[j];
    }
    H[i] = (B[i] - sum) / (A[i][i] || 1);
  }

  // h00, h01, h02, h10, h11, h12, h20, h21, h22=1
  return [H[0], H[1], H[2], H[3], H[4], H[5], H[6], H[7], 1];
}

/**
 * Returns a CSS matrix3d string that maps an element of size (w, h)
 * positioned at (0, 0) to the given destination corners.
 */
export function getMatrix3dCSS(w: number, h: number, corners: QuadCorners): string {
  const m = computeProjectiveMatrix(w, h, corners);
  // CSS matrix3d takes column-major 4x4 matrix:
  // [m[0], m[3], 0, m[6],
  //  m[1], m[4], 0, m[7],
  //  0,    0,    1, 0,
  //  m[2], m[5], 0, m[8]]
  return `matrix3d(
    ${m[0].toFixed(6)}, ${m[3].toFixed(6)}, 0, ${m[6].toFixed(8)},
    ${m[1].toFixed(6)}, ${m[4].toFixed(6)}, 0, ${m[7].toFixed(8)},
    0, 0, 1, 0,
    ${m[2].toFixed(6)}, ${m[5].toFixed(6)}, 0, ${m[8].toFixed(6)}
  )`;
}

/**
 * Renders a textured quad to a 2D HTML Canvas using triangular subdivision (affine meshes)
 */
export function drawSubdividedQuad(
  ctx: CanvasRenderingContext2D,
  image: HTMLImageElement | HTMLCanvasElement,
  corners: QuadCorners,
  subdivisions = 16
): void {
  const { tl, tr, br, bl } = corners;
  const iw = image.width;
  const ih = image.height;

  // Bilinear interpolation between 4 corners
  function interp(u: number, v: number): Point2D {
    const x =
      (1 - u) * (1 - v) * tl.x +
      u * (1 - v) * tr.x +
      u * v * br.x +
      (1 - u) * v * bl.x;
    const y =
      (1 - u) * (1 - v) * tl.y +
      u * (1 - v) * tr.y +
      u * v * br.y +
      (1 - u) * v * bl.y;
    return { x, y };
  }

  ctx.save();

  for (let y = 0; y < subdivisions; y++) {
    const v0 = y / subdivisions;
    const v1 = (y + 1) / subdivisions;

    for (let x = 0; x < subdivisions; x++) {
      const u0 = x / subdivisions;
      const u1 = (x + 1) / subdivisions;

      const p00 = interp(u0, v0);
      const p10 = interp(u1, v0);
      const p11 = interp(u1, v1);
      const p01 = interp(u0, v1);

      // Triangle 1: (p00, p10, p01)
      drawTriangle(
        ctx,
        image,
        p00,
        p10,
        p01,
        u0 * iw,
        v0 * ih,
        u1 * iw,
        v0 * ih,
        u0 * iw,
        v1 * ih
      );

      // Triangle 2: (p10, p11, p01)
      drawTriangle(
        ctx,
        image,
        p10,
        p11,
        p01,
        u1 * iw,
        v0 * ih,
        u1 * iw,
        v1 * ih,
        u0 * iw,
        v1 * ih
      );
    }
  }

  ctx.restore();
}

/**
 * Helper to texture-map an affine triangle in HTML5 2D Canvas
 */
function drawTriangle(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | HTMLCanvasElement,
  p0: Point2D,
  p1: Point2D,
  p2: Point2D,
  u0: number,
  v0: number,
  u1: number,
  v1: number,
  u2: number,
  v2: number
) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(p0.x, p0.y);
  ctx.lineTo(p1.x, p1.y);
  ctx.lineTo(p2.x, p2.y);
  ctx.closePath();
  ctx.clip();

  // Affine transform matrix mapping (u, v) to (p.x, p.y)
  const delta = u0 * (v1 - v2) - u1 * (v0 - v2) + u2 * (v0 - v1);
  if (Math.abs(delta) < 1e-7) {
    ctx.restore();
    return;
  }

  const deltaA = p0.x * (v1 - v2) - p1.x * (v0 - v2) + p2.x * (v0 - v1);
  const deltaB = u0 * (p1.x - p2.x) - u1 * (p0.x - p2.x) + u2 * (p0.x - p1.x);
  const deltaC =
    p0.x * (u1 * v2 - u2 * v1) -
    p1.x * (u0 * v2 - u2 * v0) +
    p2.x * (u0 * v1 - u1 * v0);

  const deltaD = p0.y * (v1 - v2) - p1.y * (v0 - v2) + p2.y * (v0 - v1);
  const deltaE = u0 * (p1.y - p2.y) - u1 * (p0.y - p2.y) + u2 * (p0.y - p1.y);
  const deltaF =
    p0.y * (u1 * v2 - u2 * v1) -
    p1.y * (u0 * v2 - u2 * v0) +
    p2.y * (u0 * v1 - u1 * v0);

  ctx.transform(
    deltaA / delta,
    deltaD / delta,
    deltaB / delta,
    deltaE / delta,
    deltaC / delta,
    deltaF / delta
  );

  ctx.drawImage(img, 0, 0);
  ctx.restore();
}
