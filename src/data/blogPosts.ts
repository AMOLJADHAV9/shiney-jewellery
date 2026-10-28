export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: string;
  authorRole: string;
  image: string;
  excerpt: string;
  content: string[];
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'layering-necklaces-like-a-pro',
    title: 'Layering Necklaces Like a Pro',
    category: 'Accessories',
    date: 'April 16, 2025',
    readTime: '4 min read',
    author: 'Elena Vance',
    authorRole: 'Master Stylist & Gemologist',
    image: '/images/products/diamonds-with-the-dark-blue-sapphire-necklace-on-a-black-background-photo.jpg',
    excerpt: 'Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. Discover our rules for length, texture, and focal points.',
    content: [
      'Layering necklaces is both an art and a science. The secret to effortless stacking lies in varying the chain lengths, balancing delicate textures with bold statement pendants, and choosing a harmonious metal palette.',
      'Start with a base choker (14-16 inches) resting delicately above the collarbone. Add an 18-inch mid-length curb or herringbone chain that catches the natural daylight. Finally, anchor the ensemble with a 22-24 inch pendant or locket.',
      'Pro Tip: Mix chain weights to prevent tangling. Pairing a fine cable chain with a structured paperclip or box chain creates textural contrast while ensuring each piece moves freely.'
    ],
    tags: ['Styling', 'Necklaces', 'Gold Chains', 'Trends']
  },
  {
    id: 'post-2',
    slug: 'behind-the-craft-handmade-jewelry-love',
    title: 'Behind the Craft: Handmade Jewelry Love',
    category: 'Diamonds',
    date: 'April 16, 2025',
    readTime: '6 min read',
    author: 'Julian Thorne',
    authorRole: 'Senior Atelier Goldsmith',
    image: '/images/products/ai-generated-golden-drop-earrings-with-crystals-over-a-shiny-backdrop-photo.jpg',
    excerpt: 'Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. Step inside our atelier to witness lost-wax casting and microscope stone setting.',
    content: [
      'In a world dominated by rapid mechanical casting, true haute joaillerie remains anchored in human intuition and tactile mastery. Every piece crafted in the Shiney atelier requires between 40 and 120 hours of concentrated handwork.',
      'Our metalsmiths hand-forge each shank and bezel over steel mandrels, refining the density of the 18k solid gold through rhythmic hammer blows. This gives the gold structural longevity and a rich, warm glow that machine-cast metal simply cannot emulate.',
      'Under 20x magnification stereoscopic microscopes, our master setters hand-carve delicate beads to cradle each conflict-free diamond, ensuring optimal light refractions and a surface as smooth as silk.'
    ],
    tags: ['Craftsmanship', 'Atelier', 'Diamonds', 'Handmade']
  },
  {
    id: 'post-3',
    slug: 'from-classic-to-modern-our-top-picks',
    title: 'From Classic to Modern: Our Top Picks',
    category: 'Earrings',
    date: 'April 16, 2025',
    readTime: '5 min read',
    author: 'Claire Weston',
    authorRole: 'Curator & Creative Director',
    image: '/images/blogs/blog-top-picks.jpg',
    excerpt: "Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it's t...",
    content: [
      'Earrings frame the face more directly than any other accessory. Whether you gravitate towards the understated brilliance of four-prong diamond studs or the theatrical sway of articulated chandeliers, proportion is everything.',
      'This season, we witness a resurgence of organic, fluid metalwork. Sculptural domes with hand-hammered textures capture ambient candlelight effortlessly, bridging the transition from high-powered daytime boardrooms to private evening dinners.',
      'For bridal and milestone occasions, multi-tiered teardrop drops set with faceted quartz or natural pearls provide luminous movement that flatters all necklines.'
    ],
    tags: ['Earrings', 'Modern Classics', 'Fine Gold', 'Cocktail']
  },
  {
    id: 'post-4',
    slug: 'gift-ideas-that-sparkle',
    title: 'Gift Ideas That Sparkle',
    category: 'Gifts Set',
    date: 'April 16, 2025',
    readTime: '3 min read',
    author: 'Sophie Dubois',
    authorRole: 'Private Client Concierge',
    image: '/images/blogs/blog-gift-ideas.jpg',
    excerpt: "Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it's t...",
    content: [
      'Selecting a jewellery gift is an intimate gesture of permanence. Unlike fleeting luxury goods, precious stones and noble metals carry sentiment across decades, often becoming treasured family heirlooms.',
      'When in doubt, choose versatile staples with subtle personalization: an 18k gold initial signet, a diamond bezel solitaire necklace, or a pair of classic pavé huggies.',
      'Each Shiney creation arrives nestled in our custom silk-lined leather jewel box with archival polishing cloth and Certificate of Origin, transforming the unboxing experience into a lifelong memory.'
    ],
    tags: ['Gifts', 'Anniversary', 'Luxury Packaging', 'Heirlooms']
  },
  {
    id: 'post-5',
    slug: 'timeless-pieces-for-your-collection',
    title: 'Timeless Pieces for Your Collection',
    category: 'Necklaces & Pendants',
    date: 'April 16, 2025',
    readTime: '5 min read',
    author: 'Marcus Vance',
    authorRole: 'Antique Jewelry Historian',
    image: '/images/blogs/blog-timeless-pieces.jpg',
    excerpt: "Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it's t...",
    content: [
      'A true fine jewelry capsule requires just five core investments: a solitaire diamond ring, a tactile solid gold cuff, an everyday chain necklace, graduated diamond studs, and a bespoke evening piece.',
      'By focusing on ethical 18k solid gold rather than plated alternatives, each item maintains its inherent value and structural brilliance forever, resisting tarnish and daily wear.',
      'Invest in timeless silhouettes first, then curate seasonal colored gemstone accents as personal milestones unfold.'
    ],
    tags: ['Capsule Wardrobe', 'Investment Pieces', 'Fine Jewelry', 'Timeless']
  },
  {
    id: 'post-6',
    slug: 'mix-and-match-jewelry-styling-tips',
    title: 'Mix and Match: Jewelry Styling Tips',
    category: 'Pearles',
    date: 'April 16, 2025',
    readTime: '4 min read',
    author: 'Elena Vance',
    authorRole: 'Master Stylist & Gemologist',
    image: '/images/blogs/blog-styling-tips.jpg',
    excerpt: "Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it's t...",
    content: [
      'The outdated rule that yellow gold, white gold, and rose gold should never be worn together is officially retired. Today’s most sophisticated styling embraces deliberate two-tone and tri-color curation.',
      'Combine the warm butteriness of 18k yellow gold with the icy precision of 950 platinum to create depth. Organic Baroque pearls add a soft, natural radiance that softens sharp modern tailoring.',
      'Keep one unifying element consistent—such as polished finishes or diamond accents—to ensure the overall look feels intentional and composed.'
    ],
    tags: ['Pearls', 'Mix & Match', 'Two-Tone', 'Styling Tips']
  },
  {
    id: 'post-7',
    slug: 'the-meaning-behind-birthstone-jewelry',
    title: 'The Meaning Behind Birthstone Jewelry',
    category: 'Rings',
    date: 'April 16, 2025',
    readTime: '5 min read',
    author: 'Julian Thorne',
    authorRole: 'Senior Atelier Goldsmith',
    image: '/images/banner_engagement_ring.jpg',
    excerpt: 'Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. Explore the historical symbolism and geological allure of precious gemstones.',
    content: [
      'Since biblical times, gemstones have carried profound symbolic resonance. From emeralds representing rebirth and intuition to sapphires symbolizing fidelity and nobility, birthstones infuse personal narrative into fine jewellery.',
      'At Shiney, we ethically source natural unheated sapphires from Sri Lanka, deep green emeralds from Muzo Colombia, and scintillating ethical diamonds. Each gem is selected for saturated chromatic purity.',
      'Whether set in a discreet bezel on the inner band of an engagement ring or starring as the focal solitaire, colored gemstones offer bespoke storytelling unique to the wearer.'
    ],
    tags: ['Birthstones', 'Gemology', 'Symbolism', 'Custom Rings']
  },
  {
    id: 'post-8',
    slug: 'jewelry-care-tips-you-should-know',
    title: 'Jewelry Care Tips You Should Know',
    category: 'Wedding',
    date: 'April 16, 2025',
    readTime: '4 min read',
    author: 'Sophie Dubois',
    authorRole: 'Private Client Concierge',
    image: '/images/products/a-shiny-multi-colored-gemstone-necklace-a-luxurious-gift-generated-by-ai-photo.jpg',
    excerpt: 'Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. Keep your diamond engagement rings and precious metal heirlooms pristine.',
    content: [
      'Fine jewellery is crafted from noble materials designed to last generations, but proper care preserves their mirror-like polish and maximum refractive brilliance.',
      'Avoid exposing diamonds and colored gemstones to chlorine pools, hot tubs, or household cleaning solutions. While diamonds are the hardest known mineral, the precious metal prongs holding them can be worn down or bent by hard impact.',
      'Bring your engagement and wedding suites into our salons annually for complimentary ultrasonic bathing and prong inspection. We check for micro-movement to ensure your diamonds remain secure forever.'
    ],
    tags: ['Jewelry Care', 'Cleaning', 'Wedding Bands', 'Maintenance']
  }
];
