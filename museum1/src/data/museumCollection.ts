export type FrameStyle = 'ornate-gold' | 'carved-walnut' | 'antique-bronze' | 'rococo-gilt' | 'ebony-bevel'
export type ArtworkImageKey = 'ref_1' | 'ref_2' | 'ref_3' | 'ref_4' | 'ref_5'

export interface ArtworkData {
  id: string
  title: string
  artist: string
  year: string
  movement: string
  medium: string
  dimensions: string
  description: string
  provenance: string
  imageKey: ArtworkImageKey
  imagePath: string
  frameStyle: FrameStyle
  width: number
  height: number
  position: [number, number, number]
  rotation: [number, number, number]
  hasSpotlight?: boolean
}

export const ARTWORK_METADATA: Record<
  ArtworkImageKey,
  {
    title: string
    artist: string
    year: string
    movement: string
    medium: string
    dimensions: string
    description: string
    provenance: string
    imagePath: string
    aspectRatio: number // width / height
  }
> = {
  ref_1: {
    title: 'Symphony of Impasto and Raw Chroma',
    artist: 'Modern Impasto Master',
    year: '2024',
    movement: 'Contemporary Abstract Expressionism',
    medium: 'Heavy oil impasto on linen canvas',
    dimensions: '160 × 120 cm',
    description: 'Vibrant, sculptural layers of cerulean, vermilion, lemon yellow, and violet pigment applied with bold palette knife strokes to create deep tactile relief.',
    provenance: 'Acquired from the Modern Masters Collection, Munich.',
    imagePath: '/artworks/ref_1.png',
    aspectRatio: 900 / 1200, // 0.750 (Portrait)
  },
  ref_2: {
    title: 'Oceanic Surge in Deep Ultramarine',
    artist: 'Nordic Expressionist Guild',
    year: '2023',
    movement: 'Nordic Sea Tonalism',
    medium: 'Layered oil on Belgian linen',
    dimensions: '180 × 120 cm',
    description: 'A tempestuous ocean wave surging forward in deep Prussian blue and midnight indigo, contrasted against a luminous crest of textured alabaster foam.',
    provenance: 'Scandinavian Marine Art Foundation.',
    imagePath: '/artworks/ref_2.png',
    aspectRatio: 900 / 1350, // 0.6667 (Portrait)
  },
  ref_3: {
    title: 'Solar Blossom: Fluid Chroma in Bloom',
    artist: 'Contemporary Fluid Art Atelier',
    year: '2025',
    movement: 'Organic Fluid Abstraction',
    medium: 'Pigment and resin on cradled panel',
    dimensions: '180 × 120 cm',
    description: 'A radiant floral explosion of molten gold, carmine red, and pearlescent cells radiating outward from a glowing sunburst center.',
    provenance: 'International Contemporary Arts Biennial.',
    imagePath: '/artworks/ref_3.png',
    aspectRatio: 900 / 1350, // 0.6667 (Portrait)
  },
  ref_4: {
    title: 'Botanical Arabesque: Jasmine & Acanthus Cartoon',
    artist: 'William Morris Circle (Arts & Crafts Movement)',
    year: 'c. 1888',
    movement: 'British Arts & Crafts Movement',
    medium: 'Watercolor, gouache, and graphite on heavy rag paper',
    dimensions: '175 × 117 cm',
    description: 'An intricate, flowing pattern of entwined jasmine blossoms, acanthus leaves, and geometric lattice underdrawing designed for classical textile block printing.',
    provenance: 'Kelmscott Manor Archives, London.',
    imagePath: '/artworks/ref_4.png',
    aspectRatio: 900 / 1348, // 0.6676 (Portrait)
  },
  ref_5: {
    title: 'The Atelier: Paintbrushes of the Master',
    artist: 'Studio Still Life Tradition',
    year: '2024',
    movement: 'Contemporary Realism & Studio Ephemera',
    medium: 'Fine art pigment print on archival cotton paper',
    dimensions: '120 × 120 cm',
    description: 'A tactile composition of timeworn wooden paintbrushes soaked in vivid ultramarine, crimson, and turquoise pigment resting beside artist sponges.',
    provenance: 'Permanent Atelier Collection.',
    imagePath: '/artworks/ref_5.png',
    aspectRatio: 900 / 900, // 1.000 (Square)
  },
}

export const MUSEUM_COLLECTION: ArtworkData[] = [
  // ═════════════════════════════════════════════════════════════════════════
  // 1. NORTH MONUMENTAL WALL (Z = -29.65, facing +Z [0, 0, 0])
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'art-n-center',
    ...ARTWORK_METADATA.ref_1,
    imageKey: 'ref_1',
    frameStyle: 'rococo-gilt',
    width: 3.6,
    height: 3.6 / ARTWORK_METADATA.ref_1.aspectRatio, // 4.80m
    position: [0.0, 4.4, -29.65],
    rotation: [0, 0, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-n-left-up',
    ...ARTWORK_METADATA.ref_2,
    imageKey: 'ref_2',
    frameStyle: 'carved-walnut',
    width: 2.0,
    height: 2.0 / ARTWORK_METADATA.ref_2.aspectRatio, // 3.00m
    position: [-7.8, 5.5, -29.65],
    rotation: [0, 0, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-n-left-dn',
    ...ARTWORK_METADATA.ref_5,
    imageKey: 'ref_5',
    frameStyle: 'antique-bronze',
    width: 2.1,
    height: 2.1 / ARTWORK_METADATA.ref_5.aspectRatio, // 2.10m
    position: [-7.8, 2.2, -29.65],
    rotation: [0, 0, 0],
  },
  {
    id: 'art-n-left-outer',
    ...ARTWORK_METADATA.ref_3,
    imageKey: 'ref_3',
    frameStyle: 'ornate-gold',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_3.aspectRatio, // 3.30m
    position: [-14.5, 4.4, -29.65],
    rotation: [0, 0, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-n-right-up',
    ...ARTWORK_METADATA.ref_4,
    imageKey: 'ref_4',
    frameStyle: 'ornate-gold',
    width: 2.0,
    height: 2.0 / ARTWORK_METADATA.ref_4.aspectRatio, // 3.00m
    position: [7.8, 5.5, -29.65],
    rotation: [0, 0, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-n-right-dn',
    ...ARTWORK_METADATA.ref_5,
    imageKey: 'ref_5',
    frameStyle: 'ebony-bevel',
    width: 2.1,
    height: 2.1 / ARTWORK_METADATA.ref_5.aspectRatio, // 2.10m
    position: [7.8, 2.2, -29.65],
    rotation: [0, 0, 0],
  },
  {
    id: 'art-n-right-outer',
    ...ARTWORK_METADATA.ref_2,
    imageKey: 'ref_2',
    frameStyle: 'rococo-gilt',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_2.aspectRatio, // 3.30m
    position: [14.5, 4.4, -29.65],
    rotation: [0, 0, 0],
    hasSpotlight: true,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 2. SOUTH MONUMENTAL WALL (Z = +29.65, facing -Z [0, Math.PI, 0])
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'art-s-center',
    ...ARTWORK_METADATA.ref_3,
    imageKey: 'ref_3',
    frameStyle: 'rococo-gilt',
    width: 3.4,
    height: 3.4 / ARTWORK_METADATA.ref_3.aspectRatio, // 5.10m
    position: [0.0, 4.4, 29.65],
    rotation: [0, Math.PI, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-s-left-up',
    ...ARTWORK_METADATA.ref_1,
    imageKey: 'ref_1',
    frameStyle: 'carved-walnut',
    width: 2.1,
    height: 2.1 / ARTWORK_METADATA.ref_1.aspectRatio, // 2.80m
    position: [-7.8, 5.5, 29.65],
    rotation: [0, Math.PI, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-s-left-dn',
    ...ARTWORK_METADATA.ref_5,
    imageKey: 'ref_5',
    frameStyle: 'ornate-gold',
    width: 2.1,
    height: 2.1 / ARTWORK_METADATA.ref_5.aspectRatio, // 2.10m
    position: [-7.8, 2.2, 29.65],
    rotation: [0, Math.PI, 0],
  },
  {
    id: 'art-s-left-outer',
    ...ARTWORK_METADATA.ref_4,
    imageKey: 'ref_4',
    frameStyle: 'rococo-gilt',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_4.aspectRatio, // 3.30m
    position: [-14.5, 4.4, 29.65],
    rotation: [0, Math.PI, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-s-right-up',
    ...ARTWORK_METADATA.ref_2,
    imageKey: 'ref_2',
    frameStyle: 'antique-bronze',
    width: 2.0,
    height: 2.0 / ARTWORK_METADATA.ref_2.aspectRatio, // 3.00m
    position: [7.8, 5.5, 29.65],
    rotation: [0, Math.PI, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-s-right-dn',
    ...ARTWORK_METADATA.ref_5,
    imageKey: 'ref_5',
    frameStyle: 'carved-walnut',
    width: 2.1,
    height: 2.1 / ARTWORK_METADATA.ref_5.aspectRatio, // 2.10m
    position: [7.8, 2.2, 29.65],
    rotation: [0, Math.PI, 0],
  },
  {
    id: 'art-s-right-outer',
    ...ARTWORK_METADATA.ref_1,
    imageKey: 'ref_1',
    frameStyle: 'ornate-gold',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_1.aspectRatio, // 2.93m
    position: [14.5, 4.4, 29.65],
    rotation: [0, Math.PI, 0],
    hasSpotlight: true,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 3. WEST LONGITUDINAL WALL (X = -17.65, facing +X [0, Math.PI/2, 0])
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'art-w1-a',
    ...ARTWORK_METADATA.ref_4,
    imageKey: 'ref_4',
    frameStyle: 'ornate-gold',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_4.aspectRatio, // 3.30m
    position: [-17.65, 4.4, -25.0],
    rotation: [0, Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-w1-b',
    ...ARTWORK_METADATA.ref_1,
    imageKey: 'ref_1',
    frameStyle: 'rococo-gilt',
    width: 2.0,
    height: 2.0 / ARTWORK_METADATA.ref_1.aspectRatio, // 2.67m
    position: [-17.65, 4.4, -20.5],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: 'art-w2-a',
    ...ARTWORK_METADATA.ref_2,
    imageKey: 'ref_2',
    frameStyle: 'carved-walnut',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_2.aspectRatio, // 3.30m
    position: [-17.65, 4.4, -15.0],
    rotation: [0, Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-w2-b',
    ...ARTWORK_METADATA.ref_5,
    imageKey: 'ref_5',
    frameStyle: 'ebony-bevel',
    width: 2.4,
    height: 2.4 / ARTWORK_METADATA.ref_5.aspectRatio, // 2.40m
    position: [-17.65, 4.4, -10.0],
    rotation: [0, Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-w3-a',
    ...ARTWORK_METADATA.ref_3,
    imageKey: 'ref_3',
    frameStyle: 'antique-bronze',
    width: 2.3,
    height: 2.3 / ARTWORK_METADATA.ref_3.aspectRatio, // 3.45m
    position: [-17.65, 4.4, -4.0],
    rotation: [0, Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-w3-b',
    ...ARTWORK_METADATA.ref_4,
    imageKey: 'ref_4',
    frameStyle: 'ornate-gold',
    width: 1.9,
    height: 1.9 / ARTWORK_METADATA.ref_4.aspectRatio, // 2.85m
    position: [-17.65, 4.4, 2.0],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: 'art-w4-a',
    ...ARTWORK_METADATA.ref_1,
    imageKey: 'ref_1',
    frameStyle: 'carved-walnut',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_1.aspectRatio, // 2.93m
    position: [-17.65, 4.4, 8.0],
    rotation: [0, Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-w4-b',
    ...ARTWORK_METADATA.ref_2,
    imageKey: 'ref_2',
    frameStyle: 'rococo-gilt',
    width: 2.0,
    height: 2.0 / ARTWORK_METADATA.ref_2.aspectRatio, // 3.00m
    position: [-17.65, 4.4, 14.0],
    rotation: [0, Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-w5-a',
    ...ARTWORK_METADATA.ref_5,
    imageKey: 'ref_5',
    frameStyle: 'ornate-gold',
    width: 2.3,
    height: 2.3 / ARTWORK_METADATA.ref_5.aspectRatio, // 2.30m
    position: [-17.65, 4.4, 20.0],
    rotation: [0, Math.PI / 2, 0],
  },
  {
    id: 'art-w5-b',
    ...ARTWORK_METADATA.ref_3,
    imageKey: 'ref_3',
    frameStyle: 'ebony-bevel',
    width: 2.1,
    height: 2.1 / ARTWORK_METADATA.ref_3.aspectRatio, // 3.15m
    position: [-17.65, 4.4, 25.0],
    rotation: [0, Math.PI / 2, 0],
    hasSpotlight: true,
  },

  // ═════════════════════════════════════════════════════════════════════════
  // 4. EAST LONGITUDINAL WALL (X = +17.65, facing -X [0, -Math.PI/2, 0])
  // ═════════════════════════════════════════════════════════════════════════
  {
    id: 'art-e1-a',
    ...ARTWORK_METADATA.ref_2,
    imageKey: 'ref_2',
    frameStyle: 'ornate-gold',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_2.aspectRatio, // 3.30m
    position: [17.65, 4.4, -25.0],
    rotation: [0, -Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-e1-b',
    ...ARTWORK_METADATA.ref_5,
    imageKey: 'ref_5',
    frameStyle: 'carved-walnut',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_5.aspectRatio, // 2.20m
    position: [17.65, 4.4, -20.5],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: 'art-e2-a',
    ...ARTWORK_METADATA.ref_3,
    imageKey: 'ref_3',
    frameStyle: 'rococo-gilt',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_3.aspectRatio, // 3.30m
    position: [17.65, 4.4, -15.0],
    rotation: [0, -Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-e2-b',
    ...ARTWORK_METADATA.ref_1,
    imageKey: 'ref_1',
    frameStyle: 'antique-bronze',
    width: 2.0,
    height: 2.0 / ARTWORK_METADATA.ref_1.aspectRatio, // 2.67m
    position: [17.65, 4.4, -10.0],
    rotation: [0, -Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-e3-a',
    ...ARTWORK_METADATA.ref_4,
    imageKey: 'ref_4',
    frameStyle: 'ornate-gold',
    width: 2.3,
    height: 2.3 / ARTWORK_METADATA.ref_4.aspectRatio, // 3.45m
    position: [17.65, 4.4, -4.0],
    rotation: [0, -Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-e3-b',
    ...ARTWORK_METADATA.ref_2,
    imageKey: 'ref_2',
    frameStyle: 'ebony-bevel',
    width: 1.9,
    height: 1.9 / ARTWORK_METADATA.ref_2.aspectRatio, // 2.85m
    position: [17.65, 4.4, 2.0],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: 'art-e4-a',
    ...ARTWORK_METADATA.ref_1,
    imageKey: 'ref_1',
    frameStyle: 'rococo-gilt',
    width: 2.2,
    height: 2.2 / ARTWORK_METADATA.ref_1.aspectRatio, // 2.93m
    position: [17.65, 4.4, 8.0],
    rotation: [0, -Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-e4-b',
    ...ARTWORK_METADATA.ref_5,
    imageKey: 'ref_5',
    frameStyle: 'carved-walnut',
    width: 2.3,
    height: 2.3 / ARTWORK_METADATA.ref_5.aspectRatio, // 2.30m
    position: [17.65, 4.4, 14.0],
    rotation: [0, -Math.PI / 2, 0],
    hasSpotlight: true,
  },
  {
    id: 'art-e5-a',
    ...ARTWORK_METADATA.ref_3,
    imageKey: 'ref_3',
    frameStyle: 'antique-bronze',
    width: 2.1,
    height: 2.1 / ARTWORK_METADATA.ref_3.aspectRatio, // 3.15m
    position: [17.65, 4.4, 20.0],
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    id: 'art-e5-b',
    ...ARTWORK_METADATA.ref_4,
    imageKey: 'ref_4',
    frameStyle: 'ornate-gold',
    width: 2.1,
    height: 2.1 / ARTWORK_METADATA.ref_4.aspectRatio, // 3.15m
    position: [17.65, 4.4, 25.0],
    rotation: [0, -Math.PI / 2, 0],
    hasSpotlight: true,
  },
]
