import * as THREE from 'three'

// ── CatmullRom Path Generator for Smooth Curved Visitor Routes ─────────────
export function createBezierPath(points: [number, number, number][]): THREE.CatmullRomCurve3 {
  const vecPoints = points.map((p) => new THREE.Vector3(...p))
  return new THREE.CatmullRomCurve3(vecPoints, true, 'centripetal')
}

// ── 360-Degree Single-Floor Grand Pavilion Paths ───────────────────────────
export const MUSEUM_PATHS = {
  // 1. Central Exhibition Loop (Around Sculpture and Main Aisle)
  centralHall: [
    [-12, 0, 10] as [number, number, number],
    [-15, 0, -8] as [number, number, number],
    [-6, 0, -16] as [number, number, number],
    [6, 0, -16] as [number, number, number],
    [15, 0, -8] as [number, number, number],
    [12, 0, 10] as [number, number, number],
    [0, 0, 16] as [number, number, number],
  ],

  // 2. Central Sculpture Orbit
  sculptureOrbit: [
    [0, 0, 3.8] as [number, number, number],
    [-4.2, 0, 0] as [number, number, number],
    [0, 0, -4.2] as [number, number, number],
    [4.2, 0, 0] as [number, number, number],
  ],

  // 3. 360 Outer Wall Gallery Promenade (Lining Portrait & Landscape Canvases)
  outerPromenade: [
    [-18, 0, -16] as [number, number, number],
    [-18, 0, 0] as [number, number, number],
    [-18, 0, 16] as [number, number, number],
    [0, 0, 18] as [number, number, number],
    [18, 0, 16] as [number, number, number],
    [18, 0, 0] as [number, number, number],
    [18, 0, -16] as [number, number, number],
    [0, 0, -18] as [number, number, number],
  ],

  // 4. South Pavilion Glass Crystal Loop
  southPavilion: [
    [-8, 0, 10] as [number, number, number],
    [-4, 0, 14] as [number, number, number],
    [4, 0, 14] as [number, number, number],
    [8, 0, 10] as [number, number, number],
  ],

  // 5. Grand Auditorium Entrance Promenade (Traversing from Gallery to Auditorium Aisle)
  auditoriumPromenade: [
    [0, 0, -10] as [number, number, number],
    [0, 0, -20] as [number, number, number],
    [0, 0.4, -28] as [number, number, number],
    [-2, 0.6, -34] as [number, number, number],
    [0, 0.4, -28] as [number, number, number],
    [2, 0, -20] as [number, number, number],
  ],
}

// ── Pre-constructed Smooth CatmullRom Curves ────────────────────────────────
export const CENTRAL_HALL_CURVE = createBezierPath(MUSEUM_PATHS.centralHall)
export const SCULPTURE_ORBIT_CURVE = createBezierPath(MUSEUM_PATHS.sculptureOrbit)
export const OUTER_PROMENADE_CURVE = createBezierPath(MUSEUM_PATHS.outerPromenade)
export const SOUTH_PAVILION_CURVE = createBezierPath(MUSEUM_PATHS.southPavilion)
export const AUDITORIUM_PROMENADE_CURVE = createBezierPath(MUSEUM_PATHS.auditoriumPromenade)
