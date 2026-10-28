-- =============================================================================
-- SHINEY HAUTE JOAILLERIE - SEED DATA (v1.0.0)
-- Matches frontend data from products.ts and blogPosts.ts
-- =============================================================================

-- 1. Insert Categories
INSERT INTO categories (id, slug, name, description, display_order) VALUES
('c0000000-0000-0000-0000-000000000001', 'rings', 'Rings & Solitaires', 'Sculpted in 18k solid gold with certified ethical diamonds.', 1),
('c0000000-0000-0000-0000-000000000002', 'necklaces', 'Necklaces & Pendants', 'Cascading brilliance and artisanal statement pendants.', 2),
('c0000000-0000-0000-0000-000000000003', 'earrings', 'Earrings', 'Diamond studs, drops, and sculptural chandeliers.', 3),
('c0000000-0000-0000-0000-000000000004', 'bangles', 'Bangles & Cuffs', 'Substantial interlocking solid gold links and cuffs.', 4),
('c0000000-0000-0000-0000-000000000005', 'bridal', 'Bridal Suites', 'Exquisite 22k bridal heirlooms and antique suites.', 5),
('c0000000-0000-0000-0000-000000000006', 'gifts', 'Curated Gifts Set', 'Fine heirlooms presented in silk-lined leather jewel cases.', 6);

-- 2. Insert Core Products (matching products.ts)
INSERT INTO products (
    id, sku, slug, name, short_description, description, category_id, price, compare_at_price,
    material, gemstone, weight_grams, dimensions, stock_status, variant_type, is_featured, is_new_arrival, is_best_seller, rating, reviews_count, tags
) VALUES
(
    'p0000000-0000-0000-0000-000000000001',
    'SH-RNG-AUR-01',
    'laura-solitaire-diamond-ring',
    'L''Aura Solitaire Diamond Ring',
    'Hand-forged 18k solid gold with a 1.80 ctw brilliant-cut solitaire diamond.',
    'A triumph of architectural balance and light return. L''Aura is hand-forged in our London atelier from certified recycled 18k yellow gold, cradling a hand-selected 1.80-carat brilliant-cut diamond. Four tapered micro-claws maximize optical refraction while maintaining a remarkably low-profile silhouette for effortless everyday wear.',
    'c0000000-0000-0000-0000-000000000001',
    1850.00,
    2200.00,
    '18k Recycled Yellow Gold (750/1000)',
    '1.80 ctw VVS1 DEF Conflict-Free Diamond',
    4.20,
    'Band width: 1.8mm | Setting height: 5.4mm',
    'in_stock',
    'ring_size',
    true,
    true,
    true,
    5.00,
    38,
    ARRAY['Solitaire', '18k Gold', 'Diamonds', 'Engagement', 'Best Seller']
),
(
    'p0000000-0000-0000-0000-000000000002',
    'SH-NCK-CELE-02',
    'celeste-radiance-diamond-pendant',
    'Celeste Radiance Diamond Pendant',
    'Artisanal halo pendant featuring a pear-cut diamond suspended from an 18k diamond-cut curb chain.',
    'Inspired by the nocturnal shimmer of celestial orbits, the Celeste pendant features a scintillating 0.95 ctw pear-cut diamond framed by a micro-pavé halo of sixteen brilliant-cut gems.',
    'c0000000-0000-0000-0000-000000000002',
    947.00,
    1150.00,
    '18k Yellow Gold & Platinum 950 Accent',
    '0.95 ctw VS1 E-F Natural Diamond',
    5.80,
    'Pendant: 14mm x 8mm | Chain: 18 inches adjustable',
    'in_stock',
    'chain_length',
    true,
    false,
    true,
    4.90,
    24,
    ARRAY['Pendant', 'Diamonds', 'Yellow Gold', 'Bestseller']
),
(
    'p0000000-0000-0000-0000-000000000003',
    'SH-EAR-SERA-03',
    'seraphina-emerald-drop-earrings',
    'Seraphina Colombian Emerald Drop Earrings',
    'Deep vivid green Muzo Colombian emeralds framed by articulated diamond droplets.',
    'Articulated for hypnotic movement under ambient evening light, each earring pairs an octagonal step-cut Colombian emerald with a cascade of bezel-set marquise diamonds.',
    'c0000000-0000-0000-0000-000000000003',
    3420.00,
    3900.00,
    '18k Fairmined White Gold',
    '3.20 ctw Vivid Green Muzo Emeralds + 1.10 ctw Diamonds',
    7.10,
    'Length: 38mm | Drop width: 9mm',
    'low_stock',
    NULL,
    true,
    true,
    false,
    5.00,
    14,
    ARRAY['Emeralds', 'Earrings', 'High Jewelry', 'White Gold']
);

-- 3. Insert Product Images
INSERT INTO product_images (product_id, minio_bucket, minio_key, cdn_url, alt_text, sort_order, is_primary) VALUES
('p0000000-0000-0000-0000-000000000001', 'shiney-public-media', 'products/diamond-ring-red-stone-closeup.jpg', '/images/products/diamond-ring-red-stone-closeup-generate-ai-photo.jpg', 'L''Aura Solitaire Ring in Handcrafted Gold', 0, true),
('p0000000-0000-0000-0000-000000000001', 'shiney-public-media', 'products/diamond-gold-engagement-ring.jpg', '/images/products/diamond-gold-engagement-ring-generative-ai-photo.jpg', 'L''Aura Solitaire Profile Angle', 1, false),
('p0000000-0000-0000-0000-000000000002', 'shiney-public-media', 'products/gold-chain-large-pendant.jpg', '/images/products/gold-chain-necklace-with-large-diamond-pendant-free-photo.jpg', 'Celeste Radiance Diamond Pendant', 0, true),
('p0000000-0000-0000-0000-000000000003', 'shiney-public-media', 'products/green-emerald-earrings.jpg', '/images/products/ornate-green-necklace-generate-ai-photo.jpg', 'Seraphina Emerald Drop Earrings', 0, true);

-- 4. Insert Product Variants
INSERT INTO product_variants (product_id, sku, name, option_value, price_delta, in_stock, stock_quantity) VALUES
('p0000000-0000-0000-0000-000000000001', 'SH-RNG-AUR-01-SZ5', 'Size 5 (15.7mm)', '5', 0.00, true, 8),
('p0000000-0000-0000-0000-000000000001', 'SH-RNG-AUR-01-SZ6', 'Size 6 (16.5mm)', '6', 0.00, true, 12),
('p0000000-0000-0000-0000-000000000001', 'SH-RNG-AUR-01-SZ7', 'Size 7 (17.3mm)', '7', 0.00, true, 15),
('p0000000-0000-0000-0000-000000000001', 'SH-RNG-AUR-01-SZ8', 'Size 8 (18.1mm)', '8', 0.00, false, 0),
('p0000000-0000-0000-0000-000000000002', 'SH-NCK-CELE-02-16IN', '16-inch Choker Chain', '16in', 0.00, true, 14),
('p0000000-0000-0000-0000-000000000002', 'SH-NCK-CELE-02-18IN', '18-inch Princess Length', '18in', 65.00, true, 20);

-- 5. Insert Promo Codes
INSERT INTO promo_codes (code, discount_percentage, min_spend, max_discount_amount, is_active) VALUES
('HAUTE10', 10.00, 200.00, 500.00, true),
('SHINEYVIP', 15.00, 500.00, 1500.00, true),
('ATELIERWELCOME', 10.00, 150.00, 300.00, true);

-- 6. Insert Blog Posts (matching blogPosts.ts & reference screenshot)
INSERT INTO blog_posts (
    slug, title, category, date_display, read_time, author_name, author_role, image_minio_key, image_cdn_url, excerpt, content_paragraphs, tags
) VALUES
(
    'from-classic-to-modern-our-top-picks',
    'From Classic to Modern: Our Top Picks',
    'Earrings',
    'April 16, 2025',
    '5 min read',
    'Claire Weston',
    'Curator & Creative Director',
    'blogs/blog-top-picks.jpg',
    '/images/blogs/blog-top-picks.jpg',
    'Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it''s t...',
    ARRAY[
        'Earrings frame the face more directly than any other accessory. Whether you gravitate towards the understated brilliance of four-prong diamond studs or the theatrical sway of articulated chandeliers, proportion is everything.',
        'This season, we witness a resurgence of organic, fluid metalwork. Sculptural domes with hand-hammered textures capture ambient candlelight effortlessly.',
        'For bridal and milestone occasions, multi-tiered teardrop drops set with faceted quartz or natural pearls provide luminous movement that flatters all necklines.'
    ],
    ARRAY['Earrings', 'Modern Classics', 'Fine Gold', 'Cocktail']
),
(
    'gift-ideas-that-sparkle',
    'Gift Ideas That Sparkle',
    'Gifts Set',
    'April 16, 2025',
    '3 min read',
    'Sophie Dubois',
    'Private Client Concierge',
    'blogs/blog-gift-ideas.jpg',
    '/images/blogs/blog-gift-ideas.jpg',
    'Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it''s t...',
    ARRAY[
        'Selecting a jewellery gift is an intimate gesture of permanence. Unlike fleeting luxury goods, precious stones and noble metals carry sentiment across decades.',
        'When in doubt, choose versatile staples with subtle personalization: an 18k gold initial signet, a diamond bezel solitaire necklace, or a pair of classic pavé huggies.',
        'Each Shiney creation arrives nestled in our custom silk-lined leather jewel box with archival polishing cloth and Certificate of Origin.'
    ],
    ARRAY['Gifts', 'Anniversary', 'Luxury Packaging', 'Heirlooms']
),
(
    'timeless-pieces-for-your-collection',
    'Timeless Pieces for Your Collection',
    'Necklaces & Pendants',
    'April 16, 2025',
    '5 min read',
    'Marcus Vance',
    'Antique Jewelry Historian',
    'blogs/blog-timeless-pieces.jpg',
    '/images/blogs/blog-timeless-pieces.jpg',
    'Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it''s t...',
    ARRAY[
        'A true fine jewelry capsule requires just five core investments: a solitaire diamond ring, a tactile solid gold cuff, an everyday chain necklace, graduated diamond studs, and a bespoke evening piece.',
        'By focusing on ethical 18k solid gold rather than plated alternatives, each item maintains its inherent value and structural brilliance forever.',
        'Invest in timeless silhouettes first, then curate seasonal colored gemstone accents as personal milestones unfold.'
    ],
    ARRAY['Capsule Wardrobe', 'Investment Pieces', 'Fine Jewelry', 'Timeless']
),
(
    'mix-and-match-jewelry-styling-tips',
    'Mix and Match: Jewelry Styling Tips',
    'Pearles',
    'April 16, 2025',
    '4 min read',
    'Elena Vance',
    'Master Stylist & Gemologist',
    'blogs/blog-styling-tips.jpg',
    '/images/blogs/blog-styling-tips.jpg',
    'Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it''s t...',
    ARRAY[
        'The outdated rule that yellow gold, white gold, and rose gold should never be worn together is officially retired. Today’s most sophisticated styling embraces deliberate two-tone and tri-color curation.',
        'Combine the warm butteriness of 18k yellow gold with the icy precision of 950 platinum to create depth. Organic Baroque pearls add a soft, natural radiance.',
        'Keep one unifying element consistent to ensure the overall look feels intentional and composed.'
    ],
    ARRAY['Pearls', 'Mix & Match', 'Two-Tone', 'Styling Tips']
);
