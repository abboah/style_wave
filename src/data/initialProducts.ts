import type { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sw-01',
    title: 'STYLE WAVE Signature Heavyweight Hoodie',
    description: 'Custom 480 GSM French Terry cotton hoodie with dropped shoulders, raw-edge accents, and embroidered chest emblem. Hand-finished in Ghana.',
    price: 650,
    category: 'hoodies',
    type: 'brand',
    condition: 'Brand New',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true,
    brandTag: 'FW26 Collection',
    savesCount: 38,
    createdAt: '2026-10-01T12:00:00Z',
  },
  {
    id: 'sw-02',
    title: 'Wave Boxy Heavyweight Tee',
    description: 'Ultra-heavy 260 GSM combed cotton t-shirt with a boxy, relaxed cut and high-density screenprinted back graphic.',
    price: 320,
    category: 'tees',
    type: 'brand',
    condition: 'Brand New',
    sizes: ['S', 'M', 'L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true,
    brandTag: 'Core Essential',
    savesCount: 52,
    createdAt: '2026-10-02T10:00:00Z',
  },
  {
    id: 'sw-03',
    title: 'Archive Hand-Dyed Indigo Denim Jacket',
    description: "From the creator's private closet archive. Sourced vintage denim custom-dyed using traditional West African indigo techniques with subtle distressing. 1-of-1 piece.",
    price: 1100,
    category: 'jackets',
    type: 'closet',
    condition: 'Custom 1-of-1',
    sizes: ['L'],
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true,
    brandTag: "Creator's Closet",
    savesCount: 64,
    createdAt: '2026-10-03T15:30:00Z',
  },
  {
    id: 'sw-04',
    title: 'Tactical Multi-Pocket Cargo Pants',
    description: 'Constructed from durable ripstop cotton with magnetic buckle closures, articulated knees, and toggle cuffs for versatile styling with sneakers or boots.',
    price: 580,
    category: 'pants',
    type: 'brand',
    condition: 'Brand New',
    sizes: ['30', '32', '34', '36'],
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false,
    brandTag: 'Utility Series',
    savesCount: 29,
    createdAt: '2026-10-04T09:15:00Z',
  },
  {
    id: 'sw-05',
    title: 'Vintage Leather Moto Racing Jacket',
    description: "Personal closet drop: Authentic heavy cowhide racing jacket with worn-in patina, brass hardware, and quilted lining. Kept in pristine collector condition.",
    price: 1450,
    category: 'jackets',
    type: 'closet',
    condition: 'Vintage Archive',
    sizes: ['M', 'L'],
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: true,
    brandTag: 'Closet Vault Drop',
    savesCount: 71,
    createdAt: '2026-10-05T18:20:00Z',
  },
  {
    id: 'sw-06',
    title: 'STYLE WAVE Foam Trucker Cap',
    description: 'Structured 5-panel curved visor trucker hat with breathable mesh back, embossed chrome wave insignia, and snapback adjustment.',
    price: 220,
    category: 'accessories',
    type: 'brand',
    condition: 'Brand New',
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false,
    brandTag: 'Accessories',
    savesCount: 19,
    createdAt: '2026-10-06T11:00:00Z',
  },
  {
    id: 'sw-07',
    title: 'Earth Tones Mohair Oversized Cardigan',
    description: "Straight out of the closet collection. Chunky mohair blend sweater with horn buttons. Worn once for a lookbook shoot; completely fresh and preserved.",
    price: 780,
    category: 'hoodies',
    type: 'closet',
    condition: 'Like New',
    sizes: ['L', 'XL'],
    images: [
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false,
    brandTag: "Creator's Closet",
    savesCount: 43,
    createdAt: '2026-10-07T14:40:00Z',
  },
  {
    id: 'sw-08',
    title: 'Wave Monogram Heavy Canvas Tote',
    description: 'Reinforced 18oz raw canvas tote with waterproof inner lining, internal laptop sleeve, and hand-printed STYLE WAVE motif.',
    price: 260,
    category: 'accessories',
    type: 'brand',
    condition: 'Brand New',
    sizes: ['One Size'],
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80'
    ],
    isFeatured: false,
    brandTag: 'Everyday Carry',
    savesCount: 22,
    createdAt: '2026-10-08T08:00:00Z',
  }
];
