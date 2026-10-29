import { Product } from '../types';

export const CATEGORIES = [
  { 
    id: 'rings', 
    name: 'Rings', 
    image: '/images/products/diamond-gold-engagement-ring-generative-ai-photo.jpg', 
    description: 'Solitaires, eternity bands & statement heirlooms' 
  },
  { 
    id: 'necklaces', 
    name: 'Necklaces & Pendants', 
    image: '/images/products/elegant-gemstone-necklace-shines-with-rare-sophistication-generated-by-ai-photo.jpg', 
    description: 'Handcrafted chains, lockets & diamond pavé' 
  },
  { 
    id: 'earrings', 
    name: 'Earrings', 
    image: '/images/products/ai-generated-golden-drop-earrings-with-crystals-over-a-shiny-backdrop-photo.jpg', 
    description: 'Teardrops, sculptural hoops & brilliant studs' 
  },
  { 
    id: 'bangles', 
    name: 'Bangles & Bracelets', 
    image: '/images/products/gold-jewelry-and-diamond-jewelry-free-photo.jpg', 
    description: 'Artisan cuffs, tennis bracelets & gold links' 
  },
  { 
    id: 'bridal', 
    name: 'Bridal & Heirlooms', 
    image: '/images/products/traditional-gold-and-diamond-jwellery-photo.jpg', 
    description: 'Bespoke suites crafted for generations to come' 
  },
  { 
    id: 'gifts', 
    name: 'Curated Gifts', 
    image: '/images/products/a-shiny-multi-colored-gemstone-necklace-a-luxurious-gift-generated-by-ai-photo.jpg', 
    description: 'Unforgettable gifts presented in iconic packaging' 
  }
];

// All hardcoded mock products have been removed.
// The application only renders products loaded live from the PostgreSQL database API.
export const PRODUCTS: Product[] = [];

export const TRUST_PILLARS = [
  {
    title: 'Complimentary Insured Shipping',
    description: 'White-glove discreet courier delivery with full transit insurance on every order over $250.',
    icon: 'PackageCheck'
  },
  {
    title: 'Private Atelier Concierge',
    description: 'Direct consultation with our resident gemologists for custom sizing, engraving, or bespoke pieces.',
    icon: 'Sparkles'
  },
  {
    title: 'Bespoke Salon Appointments',
    description: 'Book private viewing sessions at our London, Paris, or New York salons, or via 4K virtual atelier.',
    icon: 'Calendar'
  },
  {
    title: 'Lifetime Craftsmanship Care',
    description: 'Complimentary annual prong inspection, ultrasonic cleaning, and repolishing for life.',
    icon: 'ShieldCheck'
  }
];

export const TESTIMONIALS = [
  {
    id: 1,
    quote: "The craftsmanship of The Celestial Empress Solitaire took our breath away. Seeing the diamond catch the evening light was pure enchantment.",
    author: "Elena Rostova",
    role: "Geneva, Switzerland",
    rating: 5,
    productPurchased: "The Celestial Empress Solitaire Ring"
  },
  {
    id: 2,
    quote: "From the silk-lined presentation box to the weight of the solid gold, Shiney delivers authentic haute joaillerie quality.",
    author: "Marcus Vance",
    role: "London, Mayfair",
    rating: 5,
    productPurchased: "Antiquities Byzantine Sculpted Gold Torc"
  },
  {
    id: 3,
    quote: "Their concierge helped me choose the exact chain length and personalized engraving for our 10th anniversary. Unrivaled service.",
    author: "Seraphina Lin",
    role: "Singapore",
    rating: 5,
    productPurchased: "The Sovereign Tear Solitaire Diamond Pendant"
  }
];
