import { ARTWORK_METADATA, ArtworkImageKey } from '../../../data/museumCollection';
import { parseDimensions } from '../utils/dimensionUtils';

export type FrameStyleId =
  | 'none'
  | 'classic-black'
  | 'natural-oak'
  | 'ornate-gold'
  | 'carved-walnut'
  | 'white-minimal';

export interface FrameOption {
  id: FrameStyleId;
  name: string;
  description: string;
  borderStyle: string;
  borderColor: string;
  bevelColor: string;
  shadowColor: string;
  colorHex: string;
}

export const AVAILABLE_FRAMES: FrameOption[] = [
  {
    id: 'none',
    name: 'Gallery Canvas Wrap',
    description: 'Frameless stretched canvas with painted museum edges',
    borderStyle: 'none',
    borderColor: 'transparent',
    bevelColor: 'rgba(0,0,0,0.2)',
    shadowColor: 'rgba(0,0,0,0.45)',
    colorHex: '#3a352f',
  },
  {
    id: 'ornate-gold',
    name: 'Museum Ornate Gold',
    description: 'Classical hand-gilded Florentine antique gold frame',
    borderStyle: 'solid',
    borderColor: '#C9A94F',
    bevelColor: '#E8D5A0',
    shadowColor: 'rgba(201,169,79,0.25)',
    colorHex: '#C9A94F',
  },
  {
    id: 'carved-walnut',
    name: 'Carved Walnut',
    description: 'Rich dark walnut with traditional museum molding',
    borderStyle: 'solid',
    borderColor: '#4A3319',
    bevelColor: '#6B4C28',
    shadowColor: 'rgba(0,0,0,0.5)',
    colorHex: '#4A3319',
  },
  {
    id: 'classic-black',
    name: 'Ebony Bevel',
    description: 'Contemporary satin black with subtle inner bevel',
    borderStyle: 'solid',
    borderColor: '#18181B',
    bevelColor: '#27272A',
    shadowColor: 'rgba(0,0,0,0.6)',
    colorHex: '#18181B',
  },
  {
    id: 'natural-oak',
    name: 'Scandinavian Oak',
    description: 'Light architectural Nordic oak with fine grain',
    borderStyle: 'solid',
    borderColor: '#C2A379',
    bevelColor: '#DAC4A5',
    shadowColor: 'rgba(0,0,0,0.3)',
    colorHex: '#C2A379',
  },
  {
    id: 'white-minimal',
    name: 'Studio White',
    description: 'Clean gallery profile in soft matte alabaster',
    borderStyle: 'solid',
    borderColor: '#EDEAE4',
    bevelColor: '#FFFFFF',
    shadowColor: 'rgba(0,0,0,0.25)',
    colorHex: '#EDEAE4',
  },
];

export interface VirtualArtwork {
  id: string;
  imageKey: string;
  title: string;
  artist: string;
  year: string;
  movement: string;
  medium: string;
  dimensions: string;
  description: string;
  provenance: string;
  imageUrl: string;
  aspectRatio: number;
  widthCm: number;
  heightCm: number;
  depthCm: number;
  isApproximateDimension: boolean;
  category: string;
  defaultFrame: FrameStyleId;
}

// Additional museum archive artworks present in public/artworks
const SUPPLEMENTAL_ARTWORKS: VirtualArtwork[] = [
  {
    id: 'art_1',
    imageKey: 'art_1',
    title: 'Renaissance Portrait: Noblewoman in Crimson',
    artist: 'Florentine Court Painter',
    year: 'c. 1540',
    movement: 'High Renaissance & Mannerism',
    medium: 'Oil and tempera on cradled poplar panel',
    dimensions: '110 × 85 cm',
    description: 'A distinguished portrait exhibiting delicate sfumato glazing, ornate crimson brocade vestments, and introspective gaze.',
    provenance: 'Medici Ducal Collection, Florence.',
    imageUrl: '/artworks/art_1.jpg',
    aspectRatio: 85 / 110,
    widthCm: 85,
    heightCm: 110,
    depthCm: 4,
    isApproximateDimension: false,
    category: 'Renaissance',
    defaultFrame: 'ornate-gold',
  },
  {
    id: 'art_2',
    imageKey: 'art_2',
    title: 'The Cartographer’s Solitude',
    artist: 'Northern Baroque Master',
    year: '1668',
    movement: 'Dutch Golden Age',
    medium: 'Oil on fine weave canvas',
    dimensions: '95 × 80 cm',
    description: 'Intimate depiction of a scholar illuminated by directional window light, surrounded by celestial globes and parchment charts.',
    provenance: 'Amsterdam Civic Guard Hall.',
    imageUrl: '/artworks/art_2.jpg',
    aspectRatio: 80 / 95,
    widthCm: 80,
    heightCm: 95,
    depthCm: 3.5,
    isApproximateDimension: false,
    category: 'Baroque',
    defaultFrame: 'carved-walnut',
  },
  {
    id: 'art_3',
    imageKey: 'art_3',
    title: 'Twilight Over the Grand Canal',
    artist: 'Venetian Vedute Tradition',
    year: '1745',
    movement: 'Rococo Vedutismo',
    medium: 'Oil on fine linen',
    dimensions: '140 × 90 cm',
    description: 'Atmospheric panoramic vista of Venice during the golden hour with gondolas and historic palazzo facades mirrored in shimmering water.',
    provenance: 'Palazzo Ducale Archives, Venice.',
    imageUrl: '/artworks/art_3.jpg',
    aspectRatio: 140 / 90,
    widthCm: 140,
    heightCm: 90,
    depthCm: 3.5,
    isApproximateDimension: false,
    category: 'Classical',
    defaultFrame: 'ornate-gold',
  },
  {
    id: 'art_4',
    imageKey: 'art_4',
    title: 'Flora’s Awakening: Garden of Myth',
    artist: 'Pre-Raphaelite Brotherhood Circle',
    year: '1892',
    movement: 'Symbolism & Pre-Raphaelitism',
    medium: 'Gouache and oil varnish on linen',
    dimensions: '150 × 100 cm',
    description: 'Lush allegorical composition filled with blossoming roses, celestial light beams, and evocative romantic symbolism.',
    provenance: 'Oxford Curatorial Trust.',
    imageUrl: '/artworks/art_4.png',
    aspectRatio: 100 / 150,
    widthCm: 100,
    heightCm: 150,
    depthCm: 3.5,
    isApproximateDimension: false,
    category: 'Romanticism',
    defaultFrame: 'carved-walnut',
  },
  {
    id: 'art_5',
    imageKey: 'art_5',
    title: 'Geometric Cadence in Gold & Noir',
    artist: 'Constructivist Vanguard',
    year: '1928',
    movement: 'Modernist Constructivism',
    medium: 'Enamel and gold leaf on primed wood',
    dimensions: '100 × 100 cm',
    description: 'Rhythmic harmony of crisp diagonal axes, deep black planes, and burnished gold leaf partitions.',
    provenance: 'Bauhaus Dessau Archive.',
    imageUrl: '/artworks/art_5.png',
    aspectRatio: 1.0,
    widthCm: 100,
    heightCm: 100,
    depthCm: 3,
    isApproximateDimension: false,
    category: 'Modernism',
    defaultFrame: 'classic-black',
  },
];

export class ArtworkService {
  private static cachedCollection: VirtualArtwork[] | null = null;

  /**
   * Retrieves all artworks from the existing museum collection, augmented with parsed physical dimensions.
   */
  public static getAllArtworks(): VirtualArtwork[] {
    if (this.cachedCollection) return this.cachedCollection;

    const metadataKeys: ArtworkImageKey[] = ['ref_1', 'ref_2', 'ref_3', 'ref_4', 'ref_5'];
    
    const coreArtworks: VirtualArtwork[] = metadataKeys.map((key) => {
      const meta = ARTWORK_METADATA[key];
      const parsed = parseDimensions(meta.dimensions, meta.aspectRatio);

      let category = 'Contemporary';
      let defaultFrame: FrameStyleId = 'ornate-gold';

      if (key === 'ref_1') {
        category = 'Abstract Expressionism';
        defaultFrame = 'ornate-gold';
      } else if (key === 'ref_2') {
        category = 'Nordic Tonalism';
        defaultFrame = 'carved-walnut';
      } else if (key === 'ref_3') {
        category = 'Fluid Abstraction';
        defaultFrame = 'ornate-gold';
      } else if (key === 'ref_4') {
        category = 'Arts & Crafts';
        defaultFrame = 'carved-walnut';
      } else if (key === 'ref_5') {
        category = 'Contemporary Realism';
        defaultFrame = 'classic-black';
      }

      return {
        id: key,
        imageKey: key,
        title: meta.title,
        artist: meta.artist,
        year: meta.year,
        movement: meta.movement,
        medium: meta.medium,
        dimensions: meta.dimensions,
        description: meta.description,
        provenance: meta.provenance,
        imageUrl: meta.imagePath,
        aspectRatio: meta.aspectRatio,
        widthCm: parsed.widthCm,
        heightCm: parsed.heightCm,
        depthCm: parsed.depthCm,
        isApproximateDimension: parsed.isApproximate,
        category,
        defaultFrame,
      };
    });

    this.cachedCollection = [...coreArtworks, ...SUPPLEMENTAL_ARTWORKS];
    return this.cachedCollection;
  }

  /**
   * Finds an artwork by key or id
   */
  public static getArtworkById(idOrKey: string): VirtualArtwork | undefined {
    const list = this.getAllArtworks();
    return list.find((art) => art.id === idOrKey || art.imageKey === idOrKey);
  }

  /**
   * Filter and search artworks
   */
  public static filterArtworks(query: string, category: string): VirtualArtwork[] {
    let list = this.getAllArtworks();

    if (category && category !== 'All') {
      list = list.filter((art) => art.category.toLowerCase() === category.toLowerCase());
    }

    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(
        (art) =>
          art.title.toLowerCase().includes(q) ||
          art.artist.toLowerCase().includes(q) ||
          art.movement.toLowerCase().includes(q) ||
          art.medium.toLowerCase().includes(q)
      );
    }

    return list;
  }

  /**
   * Get distinct categories
   */
  public static getCategories(): string[] {
    const list = this.getAllArtworks();
    const cats = new Set<string>();
    list.forEach((art) => cats.add(art.category));
    return ['All', ...Array.from(cats)];
  }
}
