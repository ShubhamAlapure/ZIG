export interface DummyUser {
  id: number | string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  bgColor: string;
  mobile?: string;
  role?: string;
  artTypes?: string[];
  country?: string;
  stats: {
    totalViews: number;
    totalSpent: number;
    itemsOwned: number;
    collections: number;
    viewsChange: number;
    spentChange: number;
    ownedChange: number;
    collectionsChange: number;
  };
}

export const DUMMY_USERS: DummyUser[] = [
  {
    id: 1,
    name: 'Arsh Deep',
    email: 'arsh@example.com',
    password: 'arsh123',
    avatar: 'AS',
    bgColor: 'bg-blue-600',
    stats: {
      totalViews: 3640,
      totalSpent: 18600,
      itemsOwned: 41,
      collections: 12,
      viewsChange: 12,
      spentChange: 18,
      ownedChange: 8,
      collectionsChange: 3,
    },
  },
  {
    id: 2,
    name: 'Simran Kaur',
    email: 'simran@example.com',
    password: 'simran123',
    avatar: 'SK',
    bgColor: 'bg-pink-600',
    stats: {
      totalViews: 5200,
      totalSpent: 24500,
      itemsOwned: 58,
      collections: 18,
      viewsChange: 15,
      spentChange: 22,
      ownedChange: 12,
      collectionsChange: 5,
    },
  },
  {
    id: 3,
    name: 'Raj Patel',
    email: 'raj@example.com',
    password: 'raj123',
    avatar: 'RP',
    bgColor: 'bg-green-600',
    stats: {
      totalViews: 4800,
      totalSpent: 21000,
      itemsOwned: 45,
      collections: 15,
      viewsChange: 10,
      spentChange: 20,
      ownedChange: 9,
      collectionsChange: 4,
    },
  },
  {
    id: 4,
    name: 'Priya Singh',
    email: 'priya@example.com',
    password: 'priya123',
    avatar: 'PS',
    bgColor: 'bg-purple-600',
    stats: {
      totalViews: 6100,
      totalSpent: 28900,
      itemsOwned: 67,
      collections: 22,
      viewsChange: 18,
      spentChange: 25,
      ownedChange: 14,
      collectionsChange: 6,
    },
  },
  {
    id: 5,
    name: 'Aman Verma',
    email: 'aman@example.com',
    password: 'aman123',
    avatar: 'AV',
    bgColor: 'bg-indigo-600',
    stats: {
      totalViews: 3920,
      totalSpent: 19800,
      itemsOwned: 38,
      collections: 11,
      viewsChange: 11,
      spentChange: 19,
      ownedChange: 7,
      collectionsChange: 2,
    },
  },
];

export const COUNTRY_CODES = [
  { code: '+91', name: 'India' },
  { code: '+1', name: 'USA' },
  { code: '+44', name: 'UK' },
  { code: '+61', name: 'Australia' },
  { code: '+81', name: 'Japan' },
  { code: '+86', name: 'China' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
  { code: '+39', name: 'Italy' },
  { code: '+34', name: 'Spain' },
  { code: '+7', name: 'Russia' },
  { code: '+55', name: 'Brazil' },
  { code: '+52', name: 'Mexico' },
  { code: '+27', name: 'South Africa' },
  { code: '+971', name: 'UAE' },
  { code: '+966', name: 'Saudi Arabia' },
  { code: '+65', name: 'Singapore' },
  { code: '+60', name: 'Malaysia' },
  { code: '+63', name: 'Philippines' },
  { code: '+92', name: 'Pakistan' },
  { code: '+880', name: 'Bangladesh' },
  { code: '+94', name: 'Sri Lanka' },
  { code: '+977', name: 'Nepal' },
  { code: '+31', name: 'Netherlands' },
  { code: '+46', name: 'Sweden' },
  { code: '+47', name: 'Norway' },
  { code: '+45', name: 'Denmark' },
  { code: '+41', name: 'Switzerland' },
  { code: '+43', name: 'Austria' },
  { code: '+32', name: 'Belgium' },
  { code: '+351', name: 'Portugal' },
  { code: '+30', name: 'Greece' },
  { code: '+48', name: 'Poland' },
  { code: '+90', name: 'Turkey' },
  { code: '+20', name: 'Egypt' },
  { code: '+234', name: 'Nigeria' },
  { code: '+254', name: 'Kenya' },
  { code: '+233', name: 'Ghana' },
  { code: '+62', name: 'Indonesia' },
  { code: '+66', name: 'Thailand' },
  { code: '+84', name: 'Vietnam' },
  { code: '+82', name: 'South Korea' },
  { code: '+64', name: 'New Zealand' },
  { code: '+54', name: 'Argentina' },
  { code: '+56', name: 'Chile' },
  { code: '+57', name: 'Colombia' },
  { code: '+51', name: 'Peru' },
];

export const ART_TYPES = [
  'Painting',
  'Sculpture',
  'Digital Art',
  'Drawing',
  'Photography',
  'Prints',
];

export const COUNTRIES = [
  'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Australia', 'Austria',
  'Bangladesh', 'Belgium', 'Brazil', 'Canada', 'Chile', 'China',
  'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'Ethiopia',
  'Finland', 'France', 'Germany', 'Ghana', 'Greece', 'Hungary',
  'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Japan', 'Jordan', 'Kenya', 'Kuwait', 'Malaysia',
  'Mexico', 'Morocco', 'Myanmar', 'Nepal', 'Netherlands', 'New Zealand',
  'Nigeria', 'Norway', 'Pakistan', 'Peru', 'Philippines', 'Poland',
  'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore',
  'South Africa', 'South Korea', 'Spain', 'Sri Lanka', 'Sweden', 'Switzerland',
  'Thailand', 'Turkey', 'UAE', 'Uganda', 'Ukraine', 'United Kingdom',
  'USA', 'Vietnam', 'Zimbabwe'
];
