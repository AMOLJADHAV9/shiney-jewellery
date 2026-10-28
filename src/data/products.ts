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

export const PRODUCTS: Product[] = [
  // 1. Celestial Empress Solitaire Ring
  {
    id: 'sh-rng-01',
    slug: 'the-celestial-empress-solitaire-ring',
    name: 'The Celestial Empress Solitaire Ring',
    shortDescription: 'A captivating 2.0ct DEF flawless oval diamond poised in a tapered 18k solid yellow gold cathedral mount.',
    description: "The Celestial Empress Solitaire epitomizes timeless sophistication. Each piece begins with an ethically created brilliant-cut oval diamond selected for supreme scintillation and fire. Hand-finished by master artisans in our private atelier, the slender 1.8mm band is gently tapered to emphasize the focal gemstone.",
    price: 2150,
    compareAtPrice: 2490,
    currency: 'USD',
    category: 'rings',
    categoryLabel: 'Rings',
    images: [
      '/images/products/diamond-gold-engagement-ring-generative-ai-photo.jpg',
      '/images/products/diamond-ring-9k-gold-free-photo.jpg'
    ],
    material: '18k Solid Yellow Gold',
    gemstone: '2.0ct DEF VS1 Brilliant Diamond',
    weight: '3.9g',
    dimensions: '1.8mm band width',
    variantType: 'ring_size',
    variants: [
      { id: 'v-ce-5', name: 'Size 5', value: '5', inStock: true },
      { id: 'v-ce-6', name: 'Size 6', value: '6', inStock: true },
      { id: 'v-ce-7', name: 'Size 7', value: '7', inStock: true },
      { id: 'v-ce-8', name: 'Size 8', value: '8', inStock: true },
      { id: 'v-ce-9', name: 'Size 9', value: '9', inStock: false }
    ],
    stockStatus: 'in_stock',
    featured: true,
    newArrival: true,
    bestSeller: true,
    tags: ['Best Seller', 'Engagement', 'Handcrafted', 'Solid Gold'],
    rating: 5.0,
    reviewsCount: 46
  },

  // 2. Scarlet Imperial Ruby & Diamond Pavé Ring
  {
    id: 'sh-rng-02',
    slug: 'scarlet-imperial-ruby-diamond-ring',
    name: 'Scarlet Imperial Ruby & Diamond Pavé Ring',
    shortDescription: 'Magnificent cushion-cut pigeon blood ruby encircled by a micro-pavé brilliant diamond halo.',
    description: "Evoking the passionate fire of classic royal regalia, this ring displays an unheated 2.2-carat scarlet ruby nestled in high-polish 18k yellow gold. The shoulders are pavé-set with thirty-six hand-selected diamonds that amplify its crimson glow.",
    price: 1980,
    compareAtPrice: 2300,
    currency: 'USD',
    category: 'rings',
    categoryLabel: 'Rings',
    images: [
      '/images/products/diamond-ring-red-stone-closeup-generate-ai-photo.jpg',
      '/images/products/square-stone-diamond-jewelry-on-table-photo.jpg'
    ],
    material: '18k Solid Yellow Gold',
    gemstone: '2.2ct Pigeon Blood Ruby & 0.65ct Diamond Pavé',
    weight: '4.6g',
    dimensions: '10mm x 8mm focal cluster',
    variantType: 'ring_size',
    variants: [
      { id: 'v-rb-6', name: 'Size 6', value: '6', inStock: true },
      { id: 'v-rb-7', name: 'Size 7', value: '7', inStock: true },
      { id: 'v-rb-8', name: 'Size 8', value: '8', inStock: true }
    ],
    stockStatus: 'in_stock',
    featured: true,
    newArrival: true,
    bestSeller: false,
    tags: ['Ruby', 'Cocktail', 'Royal Collection', 'Precious Gem'],
    rating: 4.9,
    reviewsCount: 28
  },

  // 3. Verdant Sovereign Emerald Cushion Ring
  {
    id: 'sh-rng-03',
    slug: 'verdant-sovereign-emerald-cushion-ring',
    name: 'Verdant Sovereign Emerald Cushion Ring',
    shortDescription: 'Intense forest green Colombian emerald cushion set in 18k gold with flanking tapered baguettes.',
    description: "The Verdant Sovereign captures the spellbinding depths of the finest Colombian emeralds. Flanked by architectural tapered diamond baguettes, this timeless silhouette showcases the natural garden inclusions that prove genuine gemstone heritage.",
    price: 2650,
    compareAtPrice: 3100,
    currency: 'USD',
    category: 'rings',
    categoryLabel: 'Rings',
    images: [
      '/images/products/jewelry-ring-with-emerald-on-black-background-ai-generated-free-photo.jpg'
    ],
    material: '18k Solid Yellow Gold & Platinum',
    gemstone: '2.8ct Colombian Emerald & 0.45ct Baguette Diamonds',
    weight: '5.2g',
    dimensions: '2.2mm comfort-fit shank',
    variantType: 'ring_size',
    variants: [
      { id: 'v-em-5', name: 'Size 5', value: '5', inStock: true },
      { id: 'v-em-6', name: 'Size 6', value: '6', inStock: true },
      { id: 'v-em-7', name: 'Size 7', value: '7', inStock: true },
      { id: 'v-em-8', name: 'Size 8', value: '8', inStock: true }
    ],
    stockStatus: 'low_stock',
    featured: true,
    newArrival: false,
    bestSeller: true,
    tags: ['Emerald', 'High Jewellery', 'Rare Gemstone'],
    rating: 5.0,
    reviewsCount: 32
  },

  // 4. Eternal Vows Dual-Tone Wedding Band Suite
  {
    id: 'sh-brd-04',
    slug: 'eternal-vows-dual-tone-wedding-band-suite',
    name: 'Eternal Vows Dual-Tone Wedding Band Suite',
    shortDescription: 'Harmonious duo of 18k gold and 950 platinum eternity bands celebrating everlasting devotion.',
    description: "Engineered to sit flush together or worn individually, this bridal suite balances warm 18k yellow gold with pure 950 platinum. Accented with round brilliant diamonds along the contoured inner track, it represents an unbroken covenant.",
    price: 3200,
    compareAtPrice: 3750,
    currency: 'USD',
    category: 'bridal',
    categoryLabel: 'Bridal & Heirlooms',
    images: [
      '/images/products/a-beautiful-wedding-ring-eternal-love-the-journey-of-wedding-rings-generative-ai-photo.jpg',
      '/images/products/a-beautiful-wedding-ring-eternal-love-the-journey-of-wedding-rings-generative-ai-photo copy.jpg'
    ],
    material: '18k Gold & Platinum 950',
    gemstone: '1.8ct Cushion Brilliant Center & Micro-Pavé Infinity Trim',
    weight: '9.4g combined',
    variantType: 'ring_size',
    variants: [
      { id: 'v-ev-5', name: 'Size 5', value: '5', inStock: true },
      { id: 'v-ev-6', name: 'Size 6', value: '6', inStock: true },
      { id: 'v-ev-7', name: 'Size 7', value: '7', inStock: true },
      { id: 'v-ev-8', name: 'Size 8', value: '8', inStock: true }
    ],
    stockStatus: 'made_to_order',
    featured: true,
    newArrival: true,
    bestSeller: true,
    tags: ['Bridal', 'Wedding Band', 'Dual Tone', 'Heirloom'],
    rating: 5.0,
    reviewsCount: 54
  },

  // 5. Atelier Solstice Brilliant Diamond Ring
  {
    id: 'sh-rng-05',
    slug: 'atelier-solstice-brilliant-diamond-ring',
    name: 'Atelier Solstice Brilliant Diamond Ring',
    shortDescription: 'Sculptural knife-edge band holding a solitary 1.65ct round brilliant diamond in an open four-prong basket.',
    description: "Clean modernism meets classic craftsmanship. The Solstice ring positions the center diamond above an airy under-gallery, allowing 360-degree light passage for unmatched sparkle in candlelight or midday sun.",
    price: 1750,
    compareAtPrice: 2050,
    currency: 'USD',
    category: 'rings',
    categoryLabel: 'Rings',
    images: [
      '/images/products/ai-generated-jewelry-diamond-ring-on-wooden-table-with-bokeh-background-ai-generative-photo.jpeg',
      '/images/products/ai-generated-jewelry-diamond-ring-on-wooden-table-with-bokeh-background-ai-generative-photo (1).jpeg'
    ],
    material: '18k Solid Yellow Gold',
    gemstone: '1.65ct Round Brilliant Diamond (VVS1)',
    weight: '4.1g',
    dimensions: '2.0mm band width',
    variantType: 'ring_size',
    variants: [
      { id: 'v-as-5', name: 'Size 5', value: '5', inStock: true },
      { id: 'v-as-6', name: 'Size 6', value: '6', inStock: true },
      { id: 'v-as-7', name: 'Size 7', value: '7', inStock: true },
      { id: 'v-as-8', name: 'Size 8', value: '8', inStock: true }
    ],
    stockStatus: 'in_stock',
    featured: false,
    newArrival: true,
    bestSeller: true,
    tags: ['Modern Classic', 'Solitaire', 'Round Cut'],
    rating: 4.9,
    reviewsCount: 22
  },

  // 6. Dune Serenade Handcrafted Bridal Bands
  {
    id: 'sh-brd-06',
    slug: 'dune-serenade-handcrafted-bridal-bands',
    name: 'Dune Serenade Handcrafted Bridal Bands',
    shortDescription: 'Organic undulating golden texture reminiscent of wind-swept desert dunes, set with diamond stars.',
    description: "Crafted with our proprietary matte-drift finish, the Dune Serenade bands evoke the tranquility of open sands. Seven flush-set diamonds are scattered organically across the surface like desert stars.",
    price: 2400,
    compareAtPrice: 2800,
    currency: 'USD',
    category: 'bridal',
    categoryLabel: 'Bridal & Heirlooms',
    images: [
      '/images/products/diamond-rings-on-the-sand-and-they-are-wedding-rings-backgrounds-textures-photo.jpg'
    ],
    material: '18k Textured Yellow Gold',
    gemstone: '0.8ct Round Brilliant Diamonds',
    weight: '7.8g',
    dimensions: '4.5mm width',
    variantType: 'ring_size',
    variants: [
      { id: 'v-ds-6', name: 'Size 6', value: '6', inStock: true },
      { id: 'v-ds-7', name: 'Size 7', value: '7', inStock: true },
      { id: 'v-ds-8', name: 'Size 8', value: '8', inStock: true },
      { id: 'v-ds-9', name: 'Size 9', value: '9', inStock: true }
    ],
    stockStatus: 'in_stock',
    featured: false,
    newArrival: false,
    bestSeller: false,
    tags: ['Artisanal', 'Textured Gold', 'Unique Band'],
    rating: 4.8,
    reviewsCount: 19
  },

  // 7. Prism Spectrum Multicolored Gemstone Collier
  {
    id: 'sh-nck-07',
    slug: 'prism-spectrum-multicolored-gemstone-collier',
    name: 'Prism Spectrum Multicolored Gemstone Collier',
    shortDescription: 'A dazzling kaleidoscope of tourmalines, amethysts, citrines, and blue topazes bezel-set in warm gold.',
    description: "Celebrating nature’s rarest hues, this statement necklace interlaces twelve precision-faceted colored gemstones linked on an Italian cable chain. An iconic gift that brings joyous brilliance to every occasion.",
    price: 3450,
    compareAtPrice: 3900,
    currency: 'USD',
    category: 'necklaces',
    categoryLabel: 'Necklaces & Pendants',
    images: [
      '/images/products/a-shiny-multi-colored-gemstone-necklace-a-luxurious-gift-generated-by-ai-photo.jpg'
    ],
    material: '18k Solid Yellow Gold',
    gemstone: '12.5ctw Multi-Gemstone Spectrum (Tourmaline, Topaz, Amethyst, Citrine)',
    weight: '14.2g',
    dimensions: '17 inch collar drape',
    stockStatus: 'in_stock',
    featured: true,
    newArrival: true,
    bestSeller: true,
    tags: ['Statement', 'Gemstones', 'Curated Gift', 'Kaleidoscope'],
    rating: 5.0,
    reviewsCount: 39
  },

  // 8. The Sovereign Tear Solitaire Diamond Pendant
  {
    id: 'sh-nck-08',
    slug: 'sovereign-tear-solitaire-diamond-pendant',
    name: 'The Sovereign Tear Solitaire Diamond Pendant',
    shortDescription: 'An imposing 2.5ct pear-cut DEF diamond suspended effortlessly from a sleek solid gold trace chain.',
    description: "The Sovereign Tear captures pure purity of form. The elongated teardrop silhouette elongates the neck gracefully, terminating in an exquisite culet that shimmers with celestial luminescence.",
    price: 2890,
    compareAtPrice: 3350,
    currency: 'USD',
    category: 'necklaces',
    categoryLabel: 'Necklaces & Pendants',
    images: [
      '/images/products/ai-generated-a-diamond-necklace-with-a-large-diamond-on-it-photo.jpg',
      '/images/products/gold-chain-necklace-with-large-diamond-pendant-free-photo.jpg'
    ],
    material: '18k Solid Yellow Gold',
    gemstone: '2.5ct DEF Pear Brilliant Diamond',
    weight: '8.6g',
    dimensions: '18-inch adjustable curb chain',
    variantType: 'chain_length',
    variants: [
      { id: 'v-st-16', name: '16 Inch (Choker)', value: '16in', inStock: true },
      { id: 'v-st-18', name: '18 Inch (Classic)', value: '18in', inStock: true },
      { id: 'v-st-20', name: '20 Inch (Extended)', value: '20in', inStock: true }
    ],
    stockStatus: 'in_stock',
    featured: true,
    newArrival: false,
    bestSeller: true,
    tags: ['Pear Cut', 'Iconic Solitaire', 'High Joaillerie'],
    rating: 4.9,
    reviewsCount: 31
  },

  // 9. Midnight Azure Royal Sapphire & Diamond Choker
  {
    id: 'sh-nck-09',
    slug: 'midnight-azure-royal-sapphire-diamond-choker',
    name: 'Midnight Azure Royal Sapphire & Diamond Choker',
    shortDescription: 'High jewellery masterpiece featuring an intense 4.5ct Ceylon blue sapphire flanked by pear diamond florets.',
    description: "Commanding attention from across the ballroom, the Midnight Azure showcases an unheated Ceylon sapphire of velvet royal blue hue. Embraced by graduated clusters of pear-cut DEF diamonds, this choker defines modern aristocratic glamour.",
    price: 4800,
    compareAtPrice: 5500,
    currency: 'USD',
    category: 'necklaces',
    categoryLabel: 'Necklaces & Pendants',
    images: [
      '/images/products/diamonds-with-the-dark-blue-sapphire-necklace-on-a-black-background-photo.jpg',
      '/images/products/exquisite-jewelry-display-featuring-intricate-diamond-and-blue-gemstone-necklace-in-a-luxury-showroom-free-photo.jpeg'
    ],
    material: 'Platinum 950 & 18k White Gold',
    gemstone: '4.5ct Royal Blue Ceylon Sapphire & 2.2ctw Pear Diamonds',
    weight: '19.5g',
    dimensions: '16-inch articulated choker layout',
    stockStatus: 'low_stock',
    featured: true,
    newArrival: true,
    bestSeller: false,
    tags: ['Sapphire', 'High Joaillerie', 'Gala Statement', 'Platinum'],
    rating: 5.0,
    reviewsCount: 18
  },

  // 10. Luminary Riviera Diamond Cascade Necklace
  {
    id: 'sh-nck-10',
    slug: 'luminary-riviera-diamond-cascade-necklace',
    name: 'Luminary Riviera Diamond Cascade Necklace',
    shortDescription: 'Graduated seamless river of brilliant round and marquise diamonds designed for fluid collar contouring.',
    description: "The classic Riviera necklace, reimagined with contemporary sculptural fluidity. Over eighty individual diamond collets are hinged invisibly to rest seamlessly against the collarbone without twisting or flipping.",
    price: 5600,
    compareAtPrice: 6400,
    currency: 'USD',
    category: 'necklaces',
    categoryLabel: 'Necklaces & Pendants',
    images: [
      '/images/products/elegant-gemstone-necklace-shines-with-rare-sophistication-generated-by-ai-photo.jpg',
      '/images/products/elegant-diamond-necklace-displayed-on-a-bust-form-in-a-stylish-boutique-setting-free-photo.jpg'
    ],
    material: '18k White Gold',
    gemstone: '6.8ctw DEF VS1 Graduated Diamonds',
    weight: '22.0g',
    dimensions: '17.5 inch collar length',
    stockStatus: 'made_to_order',
    featured: true,
    newArrival: false,
    bestSeller: true,
    tags: ['Riviera', 'Red Carpet', 'Diamonds', 'Masterpiece'],
    rating: 5.0,
    reviewsCount: 27
  },

  // 11. Majestic Emerald & Gold Heritage Collar
  {
    id: 'sh-nck-11',
    slug: 'majestic-emerald-gold-heritage-collar',
    name: 'Majestic Emerald & Gold Heritage Collar',
    shortDescription: 'Regal hand-chased 22k gold collar adorned with cabochon emerald drops and micro-pavé flourishes.',
    description: "Paying homage to sovereign crown collections of old world monarchies. Lush green Zambian emerald drops hang like dew from hand-pierced floral gold arches, exuding undeniable majesty.",
    price: 4100,
    compareAtPrice: 4700,
    currency: 'USD',
    category: 'necklaces',
    categoryLabel: 'Necklaces & Pendants',
    images: [
      '/images/products/luxury-necklace-with-green-gemstones-on-the-brown-velvet-photo.jpg',
      '/images/products/ornate-green-necklace-generate-ai-photo.jpg'
    ],
    material: '22k Solid Hand-Chased Gold',
    gemstone: '5.2ctw Zambian Emeralds & Natural Diamond Accents',
    weight: '26.4g',
    dimensions: '18 inch draped profile',
    stockStatus: 'in_stock',
    featured: false,
    newArrival: true,
    bestSeller: false,
    tags: ['Emerald', 'Heritage Gold', 'Vintage Royal'],
    rating: 4.9,
    reviewsCount: 14
  },

  // 12. Antiquities Byzantine Sculpted Gold Torc
  {
    id: 'sh-nck-12',
    slug: 'antiquities-byzantine-sculpted-gold-torc',
    name: 'Antiquities Byzantine Sculpted Gold Torc',
    shortDescription: 'Heavy solid sculptural gold torque collar hand-hammered with ancient geometric spiral motifs.',
    description: "Handcrafted from solid gold with an antique satin lustre, this torque collar rests with commanding presence. Featuring spring-hinged flexibility for effortless wear and secure closure.",
    price: 3750,
    compareAtPrice: 4200,
    currency: 'USD',
    category: 'necklaces',
    categoryLabel: 'Necklaces & Pendants',
    images: [
      '/images/products/large-gold-necklace-photo.jpg',
      '/images/products/luxurious-medieval-necklace-on-the-womans-neck-close-up-selective-focus-photo.jpg'
    ],
    material: '24k Rich Gold Electroplate over Solid 18k Gold',
    gemstone: 'Hand-Carved Intaglios with Cabochon Garnet Finials',
    weight: '38.0g',
    dimensions: 'Rigid oval contour (135mm internal width)',
    stockStatus: 'in_stock',
    featured: true,
    newArrival: false,
    bestSeller: true,
    tags: ['Torc', 'Sculptural', 'Solid Gold', 'Statement'],
    rating: 5.0,
    reviewsCount: 23
  },

  // 13. Starlight Pavé Platinum & Diamond Festoon
  {
    id: 'sh-nck-13',
    slug: 'starlight-pave-platinum-diamond-festoon',
    name: 'Starlight Pavé Platinum & Diamond Festoon',
    shortDescription: 'Airy festoon strands of platinum encrusted with brilliant cut diamonds, suspended on a delicate chain.',
    description: "Inspired by the romantic Belle Époque era, the Starlight Festoon creates delicate swags of light across the décolletage. Crafted in featherlight pure platinum for an ethereal floating diamond effect.",
    price: 3250,
    compareAtPrice: 3800,
    currency: 'USD',
    category: 'necklaces',
    categoryLabel: 'Necklaces & Pendants',
    images: [
      '/images/products/necklace-diamonds-silver-free-photo.jpg',
      '/images/products/necklace-isolated-on-white-background-free-photo.jpg'
    ],
    material: '950 Solid Platinum',
    gemstone: '2.8ctw DEF VS1 Brilliant Diamonds',
    weight: '11.8g',
    dimensions: '16.5 inch chain drape',
    stockStatus: 'in_stock',
    featured: false,
    newArrival: true,
    bestSeller: false,
    tags: ['Platinum', 'Festoon', 'Delicate', 'Romantic'],
    rating: 4.8,
    reviewsCount: 16
  },

  // 14. Ethereal Moonlight Sterling & Crystal Pendant
  {
    id: 'sh-nck-14',
    slug: 'ethereal-moonlight-sterling-crystal-pendant',
    name: 'Ethereal Moonlight Sterling & Crystal Pendant',
    shortDescription: 'Luminescent optical crystal pendant suspended in a rhodium-plated sterling silver cage.',
    description: "Crisp, contemporary, and radiant. This pendant holds a custom-faceted pure quartz crystal that catches every ambient glimmer, reflecting cool silver and lilac shimmers.",
    price: 680,
    compareAtPrice: 790,
    currency: 'USD',
    category: 'necklaces',
    categoryLabel: 'Necklaces & Pendants',
    images: [
      '/images/products/silver-necklace-on-a-solid-color-background-in-close-up-ai-generative-free-photo.jpeg',
      '/images/products/young-woman-wearing-crystal-necklace-crop-view-photo.jpg'
    ],
    material: 'Rhodium-Plated 925 Sterling Silver',
    gemstone: 'Faceted Optical Quartz & Micro-Zircon Pavé',
    weight: '6.5g',
    dimensions: '20mm x 14mm pendant on 18in chain',
    stockStatus: 'in_stock',
    featured: false,
    newArrival: false,
    bestSeller: true,
    tags: ['Minimalist', 'Cool Silver', 'Everyday Luxury'],
    rating: 4.7,
    reviewsCount: 35
  },

  // 15. Aura Waterfall Crystal & 18k Drop Earrings
  {
    id: 'sh-ear-15',
    slug: 'aura-waterfall-crystal-drop-earrings',
    name: 'Aura Waterfall Crystal & 18k Drop Earrings',
    shortDescription: 'Cascading briolette crystals and diamond beads linked on flexible 18k yellow gold chains.',
    description: "Echoing the shimmer of water cascading over golden boulders in the sunlight. These long drop earrings produce dynamic kinetic sparkle with every slight head tilt.",
    price: 820,
    compareAtPrice: 950,
    currency: 'USD',
    category: 'earrings',
    categoryLabel: 'Earrings',
    images: [
      '/images/products/ai-generated-golden-drop-earrings-with-crystals-over-a-shiny-backdrop-photo.jpg',
      '/images/products/earrings-made-of-gold-on-a-solid-color-background-close-up-ai-generative-free-photo.jpeg'
    ],
    material: '18k Solid Yellow Gold',
    gemstone: 'Cascading Briolette Crystals & Diamonds',
    weight: '6.8g (pair)',
    dimensions: '45mm drop length',
    stockStatus: 'in_stock',
    featured: true,
    newArrival: true,
    bestSeller: true,
    tags: ['Drop Earrings', 'Kinetic Sparkle', 'Evening'],
    rating: 4.9,
    reviewsCount: 41
  },

  // 16. Maharani Kundan Filigree Chandbali Earrings
  {
    id: 'sh-ear-16',
    slug: 'maharani-kundan-filigree-chandbali-earrings',
    name: 'Maharani Kundan Filigree Chandbali Earrings',
    shortDescription: 'Imperial crescent chandbali earrings hand-set with uncut polki diamonds and natural pearl drops.',
    description: "An authentic tribute to centuries of royal Indian goldsmithing. Crescent moons of beaten 22k gold are inlaid with luminous polki stones and fringed with cultured seed pearls.",
    price: 1450,
    compareAtPrice: 1720,
    currency: 'USD',
    category: 'earrings',
    categoryLabel: 'Earrings',
    images: [
      '/images/products/beautiful-indian-antique-golden-pair-of-earrings-luxury-female-jewelry-indian-jewelry-bridal-earrings-wedding-jewellery-heavy-party-earrings-generative-ai-photo.jpg'
    ],
    material: '22k Antique Solid Gold',
    gemstone: 'Polki Diamond Simulants & Natural Seed Pearls',
    weight: '16.5g (pair)',
    dimensions: '58mm length x 35mm width',
    stockStatus: 'in_stock',
    featured: true,
    newArrival: false,
    bestSeller: true,
    tags: ['Chandbali', 'Kundan', 'Bridal', 'Heritage'],
    rating: 5.0,
    reviewsCount: 29
  },

  // 17. Gilded Luminescence Diamond Huggie Earrings
  {
    id: 'sh-ear-17',
    slug: 'gilded-luminescence-diamond-huggie-earrings',
    name: 'Gilded Luminescence Diamond Huggie Earrings',
    shortDescription: 'Classic wide-profile 18k gold huggie hoops channel-set with two rows of brilliant diamonds.',
    description: "The quintessential daily luxury. Sized perfectly to hug the earlobe, these dual-row diamond hoops provide effortless daytime elevation and transition seamlessly into black-tie galas.",
    price: 720,
    compareAtPrice: 840,
    currency: 'USD',
    category: 'earrings',
    categoryLabel: 'Earrings',
    images: [
      '/images/products/elegant-gold-and-diamond-earrings-displayed-on-a-textured-surface-under-soft-golden-light-free-photo.jpeg',
      '/images/products/white-gold-earrings-with-diamond-isolated-on-the-black-background-photo.jpg'
    ],
    material: '18k Yellow & White Gold',
    gemstone: '0.75ctw Channel-Set DEF Diamonds',
    weight: '4.8g (pair)',
    dimensions: '14mm diameter, 5mm width',
    stockStatus: 'in_stock',
    featured: false,
    newArrival: true,
    bestSeller: true,
    tags: ['Huggies', 'Everyday Luxury', 'Diamonds'],
    rating: 4.9,
    reviewsCount: 38
  },

  // 18. South Sea Baroque Pearl & Gold Drop Earrings
  {
    id: 'sh-ear-18',
    slug: 'south-sea-baroque-pearl-gold-drop-earrings',
    name: 'South Sea Baroque Pearl & Gold Drop Earrings',
    shortDescription: 'Organic 13-14mm Australian South Sea baroque pearls capped in textured 18k solid gold.',
    description: "No two baroque pearls are ever identical. Selected for their thick nacre and deep rainbow iridescence, each pearl is hand-matched and suspended from an articulated gold petal mount.",
    price: 950,
    compareAtPrice: 1120,
    currency: 'USD',
    category: 'earrings',
    categoryLabel: 'Earrings',
    images: [
      '/images/products/elegant-pearl-and-gold-earrings-on-knit-fabric-free-photo.jpg'
    ],
    material: '18k Solid Yellow Gold',
    gemstone: '13-14mm Australian South Sea Baroque Pearls',
    weight: '8.2g (pair)',
    dimensions: '32mm drop length',
    stockStatus: 'in_stock',
    featured: false,
    newArrival: false,
    bestSeller: true,
    tags: ['Pearls', 'Organic Luxury', 'Timeless'],
    rating: 4.8,
    reviewsCount: 24
  },

  // 19. Crimson Gala Burmese Ruby & Diamond Chandelier Earrings
  {
    id: 'sh-ear-19',
    slug: 'crimson-gala-burmese-ruby-diamond-chandelier-earrings',
    name: 'Crimson Gala Burmese Ruby & Diamond Chandelier Earrings',
    shortDescription: 'Multi-tiered articulated chandeliers showcasing oval faceted rubies surrounded by diamond pavé clusters.',
    description: "Dramatic and breathtaking, the Crimson Gala earrings swing with effortless fluidity. Each tier highlights radiant red rubies that bring striking color contrast to evening wear.",
    price: 2850,
    compareAtPrice: 3300,
    currency: 'USD',
    category: 'earrings',
    categoryLabel: 'Earrings',
    images: [
      '/images/products/elegant-red-and-diamond-earrings-displayed-in-a-jewelry-showcase-with-sparkling-lights-in-the-background-photo.jpeg',
      '/images/products/red-and-silver-earrings-with-diamonds-and-pearls-photo.jpg'
    ],
    material: '18k White Gold & Platinum',
    gemstone: '3.4ctw Oval Rubies & 1.2ctw Diamond Halos',
    weight: '12.4g (pair)',
    dimensions: '48mm drop length',
    stockStatus: 'low_stock',
    featured: true,
    newArrival: true,
    bestSeller: false,
    tags: ['Ruby', 'Chandelier', 'Red Carpet', 'High Joaillerie'],
    rating: 5.0,
    reviewsCount: 15
  },

  // 20. Artisanal Amber Flora Resin Statement Earrings
  {
    id: 'sh-ear-20',
    slug: 'artisanal-amber-flora-resin-statement-earrings',
    name: 'Artisanal Amber Flora Resin Statement Earrings',
    shortDescription: 'Translucent amber bio-resin with encapsulated 24k gold leaf flakes and 14k gold posts.',
    description: "Where botanical nature meets modern high art. These featherlight resin earrings capture suspended flakes of 24k gold leaf in warm honeyed amber resin.",
    price: 380,
    compareAtPrice: 450,
    currency: 'USD',
    category: 'earrings',
    categoryLabel: 'Earrings',
    images: [
      '/images/products/handmade-resin-earrings-fashion-jewelry-free-photo.jpg'
    ],
    material: '24k Gold Leaf Encapsulated in Botanical Resin with 14k Gold Posts',
    gemstone: 'Natural Amber Pigments & Gold Leaf Flakes',
    weight: '4.2g (pair)',
    dimensions: '38mm diameter',
    stockStatus: 'in_stock',
    featured: false,
    newArrival: true,
    bestSeller: false,
    tags: ['Artisanal', 'Amber', 'Lightweight', 'Modernist'],
    rating: 4.7,
    reviewsCount: 19
  },

  // 21. Imperial Heirloom Bridal Parure Suite
  {
    id: 'sh-brd-21',
    slug: 'imperial-heirloom-bridal-parure-suite',
    name: 'Imperial Heirloom Bridal Parure Suite',
    shortDescription: 'Comprehensive bridal masterpiece suite: grand choker, statement jhumkas, maang tikka and bracelet.',
    description: "The pinnacle of bridal opulence. Commissioned for extraordinary weddings, this coordinated parure harmonizes over 8 carats of diamonds and deep emeralds set in hand-chased 22k gold.",
    price: 8900,
    compareAtPrice: 10200,
    currency: 'USD',
    category: 'bridal',
    categoryLabel: 'Bridal & Heirlooms',
    images: [
      '/images/products/traditional-gold-and-diamond-jwellery-photo.jpg',
      '/images/products/gold-jewelry-and-diamond-jewelry-free-photo.jpg'
    ],
    material: '22k Solid Gold & Platinum',
    gemstone: '8.5ctw Diamonds & Natural Emeralds (Complete Set)',
    weight: '85.0g suite',
    stockStatus: 'made_to_order',
    featured: true,
    newArrival: true,
    bestSeller: true,
    tags: ['Bridal Suite', 'Full Parure', 'Heirloom', 'Royal Commission'],
    rating: 5.0,
    reviewsCount: 33
  },

  // 22. The Palais Royal High Jewellery Diamond Suite
  {
    id: 'sh-brd-22',
    slug: 'palais-royal-high-jewellery-diamond-suite',
    name: 'The Palais Royal High Jewellery Diamond Suite',
    shortDescription: 'Museum-grade platinum and diamond collar with matching chandelier earrings featuring 11.2 carats of diamonds.',
    description: "Created by our senior master jeweler over 180 hours of hand assembly. Every diamond is triple excellent certified, set with minimal metal visibility to produce a blinding blanket of light.",
    price: 9500,
    compareAtPrice: 11000,
    currency: 'USD',
    category: 'bridal',
    categoryLabel: 'Bridal & Heirlooms',
    images: [
      '/images/products/luxury-jewelry-gold-platinum-diamond-gemstone-rhinestone-crystal-silver-generated-by-ai-photo.jpg'
    ],
    material: 'Platinum 950 & 18k Yellow Gold',
    gemstone: '11.2ctw Marquise, Pear & Princess DEF Flawless Diamonds',
    weight: '62.0g',
    stockStatus: 'made_to_order',
    featured: true,
    newArrival: false,
    bestSeller: true,
    tags: ['Museum Grade', 'High Jewellery', 'Diamonds', 'Masterwork'],
    rating: 5.0,
    reviewsCount: 21
  },

  // 23. Siren of Gold Bespoke Haute Joaillerie Collar
  {
    id: 'sh-gft-23',
    slug: 'siren-of-gold-bespoke-haute-joaillerie-collar',
    name: 'Siren of Gold Bespoke Haute Joaillerie Collar',
    shortDescription: 'Sculptural bib collar in mirrored 18k gold that drapes fluidly like liquid sunlight over the neckline.',
    description: "Unapologetically bold and theatrical. Interlocking hand-curved plates of mirror-polished gold catch every flash of light, presented in our archival velvet vanity case with bespoke velvet gloves.",
    price: 4400,
    compareAtPrice: 5100,
    currency: 'USD',
    category: 'gifts',
    categoryLabel: 'Curated Gifts',
    images: [
      '/images/products/glamorous-young-model-exuding-elegance-in-gold-generated-by-ai-free-photo.jpg',
      '/images/products/glamorous-woman-in-gold-statement-jewelry-with-dramatic-evening-makeup-photo.jpeg'
    ],
    material: '18k High-Polish Sculptural Yellow Gold',
    gemstone: 'Micro-Pavé Diamond Edge Accents (0.45ct)',
    weight: '44.5g',
    stockStatus: 'in_stock',
    featured: true,
    newArrival: true,
    bestSeller: false,
    tags: ['Editorial', 'Curated Gift', 'Liquid Gold', 'Haute Joaillerie'],
    rating: 4.9,
    reviewsCount: 17
  },

  // 24. Astraea Golden Dawn Statement Choker & Hoops
  {
    id: 'sh-gft-24',
    slug: 'astraea-golden-dawn-statement-choker-hoops',
    name: 'Astraea Golden Dawn Statement Choker & Hoops',
    shortDescription: 'Sunburst motif torque necklace and matching chunky hoop earrings crafted in radiant 18k yellow gold.',
    description: "Capturing the golden hour in wearable art. The Astraea set pairs an architecturally ribbed choker with substantial hollow-cast gold hoops, designed for confident daytime style and high glamour.",
    price: 2750,
    compareAtPrice: 3200,
    currency: 'USD',
    category: 'gifts',
    categoryLabel: 'Curated Gifts',
    images: [
      '/images/products/one-young-woman-fashion-model-wearing-luxury-gold-jewelry-outdoors-generated-by-ai-free-photo.jpg',
      '/images/products/portrait-of-woman-with-a-beautiful-make-up-photo.jpg'
    ],
    material: '18k Solid Yellow Gold',
    gemstone: 'Brilliant Diamond Solitaire Accents',
    weight: '28.0g',
    stockStatus: 'in_stock',
    featured: true,
    newArrival: true,
    bestSeller: true,
    tags: ['Golden Hour', 'Gift Set', 'Sunburst', 'Statement'],
    rating: 5.0,
    reviewsCount: 29
  },

  // 25. Faded Grandeur Stud Earrings
  {
    id: 'sh-ear-fg-25',
    slug: 'faded-grandeur-stud-earrings',
    name: 'Faded Grandeur Stud Earrings',
    shortDescription: 'Modern sculptural studs with bezel-set brilliant crystals and pear-cut drops in 18k yellow gold.',
    description: 'The Faded Grandeur Stud Earrings blend architectural symmetry with organic radiance. Featuring stacked brilliant-cut stones culminating in a shimmering teardrop crystal, suspended from an 18k solid gold cross-bar stud.',
    price: 285,
    compareAtPrice: 350,
    currency: 'USD',
    category: 'earrings',
    categoryLabel: 'Accessories, Pearles',
    images: [
      '/images/trending/faded-grandeur-earrings.png',
      '/images/products/ai-generated-golden-drop-earrings-with-crystals-over-a-shiny-backdrop-photo.jpg'
    ],
    material: '18k Solid Yellow Gold',
    gemstone: 'Brilliant Diamond Crystals & Pear Drop',
    weight: '6.4g',
    stockStatus: 'in_stock',
    featured: true,
    newArrival: true,
    bestSeller: true,
    tags: ['earrings', 'studs', 'accessories', 'pearles', 'trending', 'gold'],
    rating: 4.0,
    reviewsCount: 5
  }
];

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
