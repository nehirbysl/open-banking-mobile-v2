/**
 * Salalah Souq catalogue — Omani heritage gifts.
 *
 * SVG illustrations render via react-native-svg in the ProductArtwork component
 * (see components/ProductArtwork.tsx). Products carry a kind key that picks
 * the right SVG; no data URIs, no base64.
 */

export type ProductKind =
  | 'frankincense'
  | 'khanjar'
  | 'coffee'
  | 'honey'
  | 'dates'
  | 'bukhoor'
  | 'silver'
  | 'textile'
  | 'pottery'
  | 'rosewater'
  | 'myrrh'
  | 'amouage';

export type ProductCategory =
  | 'incense'
  | 'food'
  | 'crafts'
  | 'fragrance'
  | 'textiles';

export interface Review {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  kind: ProductKind;
  name: string;
  price: number;
  category: ProductCategory;
  tagline: string;
  description: string;
  highlights: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  featured?: boolean;
  heritage: string;
  reviews: Review[];
}

export const CATEGORIES: { id: ProductCategory; label: string; emoji: string }[] = [
  { id: 'incense', label: 'Incense & Oud', emoji: '🕯️' },
  { id: 'food', label: 'Food & Honey', emoji: '🍯' },
  { id: 'crafts', label: 'Crafts & Silver', emoji: '🗡️' },
  { id: 'fragrance', label: 'Fragrance', emoji: '🌸' },
  { id: 'textiles', label: 'Textiles', emoji: '🧵' },
];

const reviewPool: Omit<Review, 'id'>[] = [
  {
    author: 'Khalid Al-Mahri',
    rating: 5,
    comment: 'Authentic, beautifully packaged. The aroma is unmistakable Dhofari.',
    date: '2026-03-18',
  },
  {
    author: 'Aisha B.',
    rating: 5,
    comment: 'Gifted to my family in London — they loved the craftsmanship.',
    date: '2026-03-02',
  },
  {
    author: 'Matthew H.',
    rating: 4,
    comment: 'High quality. Delivery was faster than expected.',
    date: '2026-02-21',
  },
  {
    author: 'Fatma S.',
    rating: 5,
    comment: 'Exactly what I hoped for. Will order again for Eid.',
    date: '2026-02-11',
  },
  {
    author: 'Ravi K.',
    rating: 4,
    comment: 'Excellent value. The heritage notes on the card are a lovely touch.',
    date: '2026-01-30',
  },
];

function makeReviews(offset: number): Review[] {
  return reviewPool.slice(offset % reviewPool.length).concat(
    reviewPool.slice(0, offset % reviewPool.length),
  ).slice(0, 4).map((r, i) => ({ ...r, id: `r${offset}-${i}` }));
}

export const PRODUCTS: Product[] = [
  {
    id: 'frankincense-hojari',
    kind: 'frankincense',
    name: 'Hojari Frankincense (Silver Grade)',
    price: 12.5,
    category: 'incense',
    tagline: 'The jewel of Dhofar resins',
    description:
      'Hand-harvested silver Hojari frankincense tears from the Boswellia sacra trees of the Dhofar mountains. Burned for millennia, prized by emperors, still collected by the same Bedouin families today.',
    highlights: [
      'Wild-harvested in the Dhofar highlands',
      'Silver grade — the highest UNESCO-recognised category',
      'Comes with brass charcoal burner and lighting instructions',
      'Approx. 120g of whole resin tears',
    ],
    rating: 4.9,
    reviewCount: 218,
    stock: 34,
    featured: true,
    heritage:
      'Dhofar is the only place on Earth where Hojari frankincense grows. The UNESCO-listed Land of Frankincense has supplied the world since 1500 BCE.',
    reviews: makeReviews(0),
  },
  {
    id: 'khanjar-display',
    kind: 'khanjar',
    name: 'Khanjar on Wooden Display',
    price: 85.0,
    category: 'crafts',
    tagline: 'Oman\'s national emblem in silver',
    description:
      'A ceremonial khanjar dagger with curved blade, silver-threaded handle, and embroidered leather scabbard. Mounted on a polished sidr-wood display stand.',
    highlights: [
      'Solid silver handle filigree',
      'Hand-stitched scabbard, traditional seven-ring binding',
      'Sidr-wood display base with brass nameplate',
      'Decorative piece — not a functional weapon',
    ],
    rating: 4.8,
    reviewCount: 96,
    stock: 11,
    featured: true,
    heritage:
      'The khanjar appears on the Omani flag and coat of arms. Every Omani man traditionally receives one on his wedding day.',
    reviews: makeReviews(1),
  },
  {
    id: 'coffee-dallah',
    kind: 'coffee',
    name: 'Dallah Coffee Set (Brass, 6 cups)',
    price: 45.0,
    category: 'crafts',
    tagline: 'Bedouin hospitality in brass',
    description:
      'A full Omani coffee service: hand-hammered brass dallah pot with elongated spout, six handle-less finjan cups, and 150g of qahwa Omani — ground green coffee blended with cardamom.',
    highlights: [
      'Hand-hammered brass construction',
      'Six traditional finjan cups included',
      'Qahwa Omani blend with green cardamom',
      'Serving etiquette guide in English',
    ],
    rating: 4.7,
    reviewCount: 142,
    stock: 22,
    featured: true,
    heritage:
      'Pouring qahwa from the dallah with the left hand is a sign of welcome in every Omani home, from the coast to the desert interior.',
    reviews: makeReviews(2),
  },
  {
    id: 'dhofar-honey',
    kind: 'honey',
    name: 'Dhofar Sidr Honey (1 kg)',
    price: 28.0,
    category: 'food',
    tagline: 'Liquid gold from the monsoon slopes',
    description:
      'Raw, unfiltered sidr honey produced during the khareef monsoon season on the Dhofar escarpment. Dark, rich, and intensely floral — considered a delicacy across the Gulf.',
    highlights: [
      '100% raw and unfiltered',
      'Single-origin Jebel Qara region',
      'Sealed glass jar, tamper-proof label',
      'Certified by Oman Ministry of Agriculture',
    ],
    rating: 4.9,
    reviewCount: 312,
    stock: 58,
    featured: true,
    heritage:
      'The khareef monsoon transforms the Dhofar mountains into green pastures every summer, producing honey found nowhere else on the Arabian Peninsula.',
    reviews: makeReviews(3),
  },
  {
    id: 'dates-gift-box',
    kind: 'dates',
    name: 'Royal Dates Gift Box (800g)',
    price: 18.5,
    category: 'food',
    tagline: 'Five varieties in a lacquered box',
    description:
      'A hand-arranged selection of five Omani date varieties — Khalas, Khunaizi, Naghal, Fardh, and Mabsali — presented in a lacquered wooden gift box with gold trim.',
    highlights: [
      'Five traditional varieties',
      'Lacquered wooden box with gold inlay',
      'Vacuum-sealed for 6-month freshness',
      'Includes tasting notes card',
    ],
    rating: 4.8,
    reviewCount: 189,
    stock: 74,
    heritage:
      'Oman has cultivated over 250 varieties of date palm for more than 5,000 years. The sultanate remains one of the world\'s top ten producers.',
    reviews: makeReviews(4),
  },
  {
    id: 'bukhoor-luxury',
    kind: 'bukhoor',
    name: 'Luxury Bukhoor Burner Set',
    price: 35.0,
    category: 'incense',
    tagline: 'Electric burner with premium oud chips',
    description:
      'A ceramic electric bukhoor burner in deep burgundy with gold filigree, paired with 50g of premium aged oud chips. USB-C powered — travel-ready.',
    highlights: [
      'USB-C powered, travel-safe (no charcoal)',
      'Ceramic bowl with gold-leaf decoration',
      'Includes 50g aged Cambodian oud chips',
      'Auto-shutoff timer (10 / 20 / 30 min)',
    ],
    rating: 4.6,
    reviewCount: 88,
    stock: 19,
    heritage:
      'Bukhoor — scented wood chips soaked in fragrant oils — has perfumed Omani homes for centuries, welcoming guests and marking celebrations.',
    reviews: makeReviews(0),
  },
  {
    id: 'silver-bedouin-necklace',
    kind: 'silver',
    name: 'Bedouin Silver Necklace',
    price: 62.0,
    category: 'crafts',
    tagline: 'Hand-forged tribal silverwork',
    description:
      'A statement silver necklace in the style of the Wahiba Bedouin, with antique coins, coral accents, and filigree medallion. Each piece is one of a kind.',
    highlights: [
      'Hand-forged 925 sterling silver',
      'Genuine red coral accents',
      'Adjustable 40 – 55 cm chain',
      'Comes in embroidered pouch',
    ],
    rating: 4.7,
    reviewCount: 54,
    stock: 6,
    heritage:
      'Bedouin women historically wore their family\'s wealth as jewellery — each necklace was both adornment and portable bank account.',
    reviews: makeReviews(1),
  },
  {
    id: 'pashmina-shawl',
    kind: 'textile',
    name: 'Embroidered Pashmina Shawl',
    price: 48.0,
    category: 'textiles',
    tagline: 'Dhofari motifs on soft pashmina',
    description:
      'A lightweight pashmina shawl hand-embroidered with traditional Dhofari geometric motifs in gold and burgundy thread. Wraps elegantly over a dishdasha or evening dress.',
    highlights: [
      '70% pashmina, 30% silk',
      'Hand-embroidered border',
      '200 × 70 cm',
      'Gift-wrapped in tissue',
    ],
    rating: 4.6,
    reviewCount: 41,
    stock: 14,
    heritage:
      'Pashmina travelled the old frankincense trade routes from Kashmir to Oman for over 500 years. Today, Dhofari embroiderers still work these imported shawls.',
    reviews: makeReviews(2),
  },
  {
    id: 'pottery-bahla',
    kind: 'pottery',
    name: 'Bahla Clay Water Jar',
    price: 22.0,
    category: 'crafts',
    tagline: 'Unglazed clay from the oasis town',
    description:
      'A traditional Bahla pottery water jar, hand-thrown and unglazed. The porous clay naturally cools water by evaporation — the original desert refrigerator.',
    highlights: [
      'Hand-thrown in Bahla, Oman',
      'Naturally cools water (no electricity)',
      '3L capacity, 28 cm tall',
      'Includes carved wooden stopper',
    ],
    rating: 4.5,
    reviewCount: 37,
    stock: 25,
    heritage:
      'Bahla\'s UNESCO-listed oasis has produced pottery continuously for over 2,000 years, using clay and techniques unchanged since the Bronze Age.',
    reviews: makeReviews(3),
  },
  {
    id: 'rosewater-jebel',
    kind: 'rosewater',
    name: 'Jebel Akhdar Rosewater (250ml)',
    price: 14.0,
    category: 'fragrance',
    tagline: 'Distilled from Damask roses',
    description:
      'Pure rosewater double-distilled from Damask roses grown on the terraces of Jebel Akhdar, the Green Mountain. Used in cuisine, skincare, and as a welcome splash for guests.',
    highlights: [
      '100% pure — no alcohol, no additives',
      'Double-distilled traditional method',
      'Glass bottle, 250 ml',
      'Harvested April – May only',
    ],
    rating: 4.8,
    reviewCount: 124,
    stock: 48,
    heritage:
      'For 350 years, the terraces of Jebel Akhdar have produced the Damask roses used in this rosewater — harvested by hand in the cool mountain dawn.',
    reviews: makeReviews(4),
  },
  {
    id: 'myrrh-tears',
    kind: 'myrrh',
    name: 'Myrrh Resin Tears (80g)',
    price: 16.5,
    category: 'incense',
    tagline: 'The deeper, earthier sister of frankincense',
    description:
      'Wild-harvested myrrh resin from Commiphora trees, paired with hojari frankincense\'s ancient partner. Warm, balsamic, slightly bitter — excellent for meditation and ritual.',
    highlights: [
      'Wild-harvested Dhofar myrrh',
      'Approx. 80g whole resin tears',
      'Cloth pouch included',
      'Pairs with any charcoal burner',
    ],
    rating: 4.7,
    reviewCount: 62,
    stock: 31,
    heritage:
      'Myrrh was one of the three gifts of the Magi and has been a staple of Omani trade since the time of the Queen of Sheba.',
    reviews: makeReviews(0),
  },
  {
    id: 'amouage-sample',
    kind: 'amouage',
    name: 'Oman Attar Sample Set',
    price: 38.0,
    category: 'fragrance',
    tagline: 'Five traditional attars in crystal vials',
    description:
      'A discovery set of five traditional Omani attars — oud, amber, musk, saffron, and jasmine — in miniature crystal vials presented in a velvet-lined case.',
    highlights: [
      'Five 3ml crystal vials',
      'Alcohol-free, long-lasting',
      'Velvet presentation case',
      'Hand-blended in Muscat',
    ],
    rating: 4.8,
    reviewCount: 97,
    stock: 17,
    heritage:
      'Omani attar-making traces its roots to the perfume trade that ran from Dhofar through the Silk Roads — a living tradition still practised in Muttrah Souq.',
    reviews: makeReviews(1),
  },
];

export function getProduct(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function getFeatured(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getByCategory(category: ProductCategory | 'all'): Product[] {
  if (category === 'all') return PRODUCTS;
  return PRODUCTS.filter((p) => p.category === category);
}
