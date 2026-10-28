import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Gem, Award, Clock, ArrowUpRight, Star, Heart, ChevronLeft, ChevronRight, ArrowLeftRight, Eye, Check, X } from 'lucide-react';
import { CATEGORIES, PRODUCTS, TRUST_PILLARS, TESTIMONIALS } from '../data/products';
import ProductCard from '../components/ui/ProductCard';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const { addToCart, toggleWishlist, isInWishlist, showToast } = useCart();
  const [activeTab, setActiveTab] = useState('all');
  const [activeStoryStep, setActiveStoryStep] = useState(0);
  const [justAddedId, setJustAddedId] = useState(null);
  const [quickViewItem, setQuickViewItem] = useState(null);

  const heroSlides = [
    {
      id: 1,
      tag: 'OUR EARRINGS',
      title: 'Find the Perfect\nRing Make',
      desc: 'Handcrafted with ethically recovered 18k solid gold & certified conflict-free diamonds.',
      image: '/images/products/portrait-of-woman-with-a-beautiful-make-up-photo.jpg',
      link: '/shop?category=earrings',
      buttonText: 'Shop Now'
    },
    {
      id: 2,
      tag: 'LUXURY NECKLACE',
      title: 'Graceful &\nEye-Catching Necklaces',
      desc: 'Cascading brilliance designed to elevate your silhouette from dawn to evening elegance.',
      image: '/images/products/glamorous-woman-in-gold-statement-jewelry-with-dramatic-evening-makeup-photo.jpeg',
      link: '/shop?category=necklaces',
      buttonText: 'Shop Now'
    },
    {
      id: 3,
      tag: 'PURELY HAND-CRAFTED',
      title: 'Charm For\nYour Everyday',
      desc: 'Modern layered artisanal gold chains and gemstone pendants crafted for daily luxury.',
      image: '/images/products/one-young-woman-fashion-model-wearing-luxury-gold-jewelry-outdoors-generated-by-ai-free-photo.jpg',
      link: '/shop',
      buttonText: 'Shop Now'
    },
    {
      id: 4,
      tag: 'ROYAL HERITAGE',
      title: 'Sculpted Elegance &\nBridal Gold',
      desc: 'Exquisite 22k bridal heirlooms, antique chokers, and handcrafted royal bridal suites.',
      image: '/images/products/glamorous-young-model-exuding-elegance-in-gold-generated-by-ai-free-photo.jpg',
      link: '/shop?category=bridal',
      buttonText: 'Shop Now'
    },
    {
      id: 5,
      tag: 'CRYSTAL RADIANCE',
      title: 'Luminous Heirlooms &\nSolitaires',
      desc: 'Captivating multi-strand diamond crystals and bespoke settings engineered to shine.',
      image: '/images/products/young-woman-wearing-crystal-necklace-crop-view-photo.jpg',
      link: '/shop?category=rings',
      buttonText: 'Shop Now'
    }
  ];

  const handleTrendAddToCart = (e, item) => {
    e.preventDefault();
    e.stopPropagation();

    const cartProduct = {
      id: item.id,
      slug: item.slug || item.id,
      name: item.title,
      price: typeof item.priceNum === 'number' ? item.priceNum : 285,
      images: [item.image],
      category: item.category,
      categoryLabel: item.category
    };

    addToCart(cartProduct, null, 1);
    setJustAddedId(item.id);
    setTimeout(() => setJustAddedId(null), 1800);
  };

  const handleTrendWishlist = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item.id);
  };

  const handleTrendCompare = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    showToast(`Added "${item.title}" to product comparison`);
  };

  const handleTrendQuickView = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickViewItem(item);
  };

  const trendingProducts = [
    {
      id: 'sh-ear-fg-25',
      slug: 'faded-grandeur-stud-earrings',
      category: 'ACCESSORIES, PEARLES',
      title: 'Faded Grandeur Stud Earrings',
      reviews: 5,
      rating: 4,
      price: '$285.00',
      priceNum: 285,
      image: '/images/trending/faded-grandeur-earrings.png',
      link: '/product/faded-grandeur-stud-earrings',
      description: 'Modern sculptural studs with bezel-set brilliant crystals and pear-cut drops in 18k yellow gold.'
    },
    {
      id: 'trend-sunburst-medallion',
      slug: 'sunburst-medallion-gold-necklace',
      category: 'NECKLACES & PENDANTS',
      title: 'Sunburst Medallion Gold Necklace',
      reviews: 5,
      rating: 5,
      price: '$730.08',
      priceNum: 730.08,
      image: '/images/trending/trend-1.png',
      link: '/shop?category=necklaces',
      description: 'Handcrafted sunflower pendant with pavé diamonds set in 18k yellow gold.'
    },
    {
      id: 'trend-sculpted-link-bracelet',
      slug: 'sculpted-link-gold-bracelet',
      category: 'BANGLES & BRACELETS',
      title: 'Sculpted Link Gold Bracelet',
      reviews: 5,
      rating: 5,
      price: '$906.20',
      priceNum: 906.20,
      image: '/images/trending/trend-2.png',
      link: '/shop?category=bangles',
      description: 'Substantial interlocking solid gold links sculpted for effortless wrist elegance.'
    },
    {
      id: 'trend-14k-parker-ring',
      slug: '14k-gold-parker-ring',
      category: 'RINGS & SOLITAIRES',
      title: '14k Gold Parker Ring',
      reviews: 5,
      rating: 5,
      price: '$56.98',
      priceNum: 56.98,
      image: '/images/trending/trend-3.png',
      link: '/shop?category=rings',
      description: 'Classic minimalist band with radiant polished finish in solid gold.'
    },
    {
      id: 'trend-golden-blossom-sets',
      slug: 'gorgeous-golden-blossom-sets',
      category: 'RINGS, WEDDING',
      title: 'Gorgeous Golden Blossom Sets',
      reviews: 5,
      rating: 5,
      price: '$487.35',
      priceNum: 487.35,
      image: '/images/trending/trend-4.png',
      link: '/shop?category=bridal',
      description: 'Intricately clustered floral halo motif pairing fine cut diamonds with yellow gold.'
    },
    {
      id: 'trend-10k-gold-eternity-ring',
      slug: '10k-gold-eternity-ring',
      category: 'DIAMONDS, RINGS',
      title: '10K Gold Eternity Ring',
      reviews: 5,
      rating: 5,
      price: '$487.35',
      priceNum: 487.35,
      image: '/images/trending/trend-5.png',
      link: '/shop?category=rings',
      description: 'Continuous circlet of prong-set brilliant diamonds symbolizing unending devotion.'
    }
  ];

  const latestBlogs = [
    {
      id: 'blog-top-picks',
      slug: 'from-classic-to-modern-our-top-picks',
      image: '/images/blogs/blog-top-picks.jpg',
      category: 'EARRINGS',
      date: 'APRIL 16, 2025',
      title: 'From Classic to Modern: Our Top Picks',
      excerpt: "Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it's t..."
    },
    {
      id: 'blog-gift-ideas',
      slug: 'gift-ideas-that-sparkle',
      image: '/images/blogs/blog-gift-ideas.jpg',
      category: 'GIFTS SET',
      date: 'APRIL 16, 2025',
      title: 'Gift Ideas That Sparkle',
      excerpt: "Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it's t..."
    },
    {
      id: 'blog-timeless-pieces',
      slug: 'timeless-pieces-for-your-collection',
      image: '/images/blogs/blog-timeless-pieces.jpg',
      category: 'NECKLACES & PENDANTS',
      date: 'APRIL 16, 2025',
      title: 'Timeless Pieces for Your Collection',
      excerpt: "Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it's t..."
    },
    {
      id: 'blog-styling-tips',
      slug: 'mix-and-match-jewelry-styling-tips',
      image: '/images/blogs/blog-styling-tips.jpg',
      category: 'PEARLES',
      date: 'APRIL 16, 2025',
      title: 'Mix and Match: Jewelry Styling Tips',
      excerpt: "Jewelry has the remarkable ability to elevate any outfit, adding a touch of glamour and personality to your look. As we embrace a new season, it's t..."
    },
    {
      id: 'blog-layering',
      slug: 'layering-necklaces-like-a-pro',
      image: '/images/products/diamonds-with-the-dark-blue-sapphire-necklace-on-a-black-background-photo.jpg',
      category: 'ACCESSORIES',
      date: 'APRIL 16, 2025',
      title: 'Layering Necklaces Like a Pro',
      excerpt: "Discover our rules for varying chain lengths, balancing delicate textures with bold statement pendants, and choosing a harmonious metal palette."
    },
    {
      id: 'blog-handmade',
      slug: 'behind-the-craft-handmade-jewelry-love',
      image: '/images/products/ai-generated-golden-drop-earrings-with-crystals-over-a-shiny-backdrop-photo.jpg',
      category: 'DIAMONDS',
      date: 'APRIL 16, 2025',
      title: 'Behind the Craft: Handmade Jewelry Love',
      excerpt: "Step inside our atelier to witness lost-wax casting, hand-forging under stereoscopic microscopes, and 120 hours of master goldsmithing."
    },
    {
      id: 'blog-birthstone',
      slug: 'the-meaning-behind-birthstone-jewelry',
      image: '/images/banner_engagement_ring.jpg',
      category: 'RINGS & SOLITAIRES',
      date: 'APRIL 16, 2025',
      title: 'The Meaning Behind Birthstone Jewelry',
      excerpt: "Explore the historical symbolism and geological allure of precious gemstones, from unheated Sri Lankan sapphires to Colombian emeralds."
    },
    {
      id: 'blog-care',
      slug: 'jewelry-care-tips-you-should-know',
      image: '/images/products/a-shiny-multi-colored-gemstone-necklace-a-luxurious-gift-generated-by-ai-photo.jpg',
      category: 'FINE JEWELRY',
      date: 'APRIL 16, 2025',
      title: 'Jewelry Care Tips You Should Know',
      excerpt: "Keep your diamond engagement rings and precious metal heirlooms pristine with expert cleaning guides and complimentary atelier inspections."
    }
  ];

  const [blogSlide, setBlogSlide] = useState(0);
  const [blogVisibleCount, setBlogVisibleCount] = useState(4);
  const [isBlogPaused, setIsBlogPaused] = useState(false);
  const blogTouchStartX = useRef(null);

  useEffect(() => {
    const handleBlogResize = () => {
      if (window.innerWidth < 640) {
        setBlogVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setBlogVisibleCount(2);
      } else {
        setBlogVisibleCount(4);
      }
    };
    handleBlogResize();
    window.addEventListener('resize', handleBlogResize);
    return () => window.removeEventListener('resize', handleBlogResize);
  }, []);

  const maxBlogSlide = Math.max(0, latestBlogs.length - blogVisibleCount);

  useEffect(() => {
    if (blogSlide > maxBlogSlide) {
      setBlogSlide(maxBlogSlide);
    }
  }, [blogVisibleCount, maxBlogSlide, blogSlide]);

  const prevBlogSlide = () => {
    setBlogSlide((prev) => (prev <= 0 ? maxBlogSlide : prev - 1));
  };

  const nextBlogSlide = () => {
    setBlogSlide((prev) => (prev >= maxBlogSlide ? 0 : prev + 1));
  };

  useEffect(() => {
    if (isBlogPaused) return;
    const interval = setInterval(() => {
      setBlogSlide((prev) => (prev >= maxBlogSlide ? 0 : prev + 1));
    }, 4500);
    return () => clearInterval(interval);
  }, [isBlogPaused, maxBlogSlide]);

  const handleBlogTouchStart = (e) => {
    blogTouchStartX.current = e.touches[0].clientX;
  };

  const handleBlogTouchEnd = (e) => {
    if (blogTouchStartX.current === null) return;
    const diff = blogTouchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextBlogSlide();
    } else if (diff < -45) {
      prevBlogSlide();
    }
    blogTouchStartX.current = null;
  };

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const bestSellers = PRODUCTS.filter((p) => p.bestSeller);
  const newArrivals = PRODUCTS.filter((p) => p.newArrival);

  const displayedProducts = activeTab === 'all'
    ? bestSellers
    : PRODUCTS.filter((p) => p.category === activeTab);

  const craftsmanshipSteps = [
    {
      title: 'Ethical Gemstone Provenance',
      subtitle: 'Phase 01 — Selection',
      desc: 'Every diamond and colored gemstone is hand-inspected under 10x magnification by our GIA-certified gemologists, verifying ethical sourcing and supreme optical scintillation.',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=900&auto=format&fit=crop&q=80',
      badge: 'Conflict-Free Verified'
    },
    {
      title: 'Hand-Forged 18k Mountings',
      subtitle: 'Phase 02 — Metallurgy',
      desc: 'Our master goldsmiths hand-pour 100% recycled 18k solid gold and 950 platinum, forging each bezel and shank over classical anvils for unmatched structural density and warmth.',
      image: 'https://images.unsplash.com/photo-1611591475155-426c045b4c7f?w=900&auto=format&fit=crop&q=80',
      badge: '18k Recycled Solid Gold'
    },
    {
      title: 'Microscope Pavé Setting',
      subtitle: 'Phase 03 — Artistry',
      desc: 'Each micro-diamond is seated under high-powered stereoscopic optics with micro-bead prongs, ensuring a velvety smooth tactile finish that never catches on delicate silks.',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop&q=80',
      badge: 'Micron-Level Precision'
    },
    {
      title: 'Archival Finish & Silk Presentation',
      subtitle: 'Phase 04 — Heirlooms',
      desc: 'Subjected to five stages of ultrasonic cleaning and mirror polishing, each creation is presented inside our bespoke velvet-and-leather jewel chest accompanied by its Certificate of Authenticity.',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&auto=format&fit=crop&q=80',
      badge: 'Bespoke Presentation Box'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] text-stone-900 overflow-hidden">
      
      {/* 1. CINEMATIC HERO CAROUSEL (Matching User Reference Screenshots) */}
      <section className="relative w-full overflow-hidden bg-[#0A0908] select-none group">
        {/* Carousel Slides Container */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[2.1/1] lg:aspect-[2.35/1] min-h-[460px] sm:min-h-[520px] md:min-h-[580px] lg:min-h-[640px] overflow-hidden">
          {heroSlides.map((slide, index) => {
            const isActive = index === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                {/* Background Image */}
                <img
                  src={slide.image}
                  alt={slide.title.replace('\n', ' ')}
                  className="w-full h-full object-cover object-right sm:object-center select-none"
                  loading={index === 0 ? 'eager' : 'lazy'}
                />

                {/* Subtle Luxury Gradient Overlay for High Contrast Text */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0A0908]/95 via-[#0A0908]/70 to-[#0A0908]/20 sm:from-[#0A0908]/90 sm:via-[#0A0908]/45 sm:to-transparent" />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0C0A09] to-transparent pointer-events-none" />

                {/* Left-Aligned Editorial Text Content */}
                <div className="absolute inset-0 z-10 flex items-center">
                  <div className="max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 w-full">
                    <div className="max-w-xl space-y-3 sm:space-y-4 text-left">
                      {/* Eyebrow Tag */}
                      <div className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-[#D4B35F]">
                        {slide.tag}
                      </div>

                      {/* Large Headline */}
                      <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-sans font-bold text-white tracking-tight leading-[1.08] whitespace-pre-line drop-shadow-sm">
                        {slide.title}
                      </h1>

                      {/* Refined Copy */}
                      <p className="text-xs sm:text-sm md:text-base text-stone-200/90 font-light leading-relaxed max-w-md pt-1">
                        {slide.desc}
                      </p>

                      {/* CTA Button with 0 border-radius */}
                      <div className="pt-2 sm:pt-4">
                        <Link
                          to={slide.link}
                          className="inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3.5 border border-white/80 hover:border-[#D4A017] bg-black/40 hover:bg-[#D4A017] text-white hover:text-stone-950 font-semibold text-xs sm:text-sm uppercase tracking-wider rounded-none transition-all duration-300 shadow-md backdrop-blur-xs"
                        >
                          {slide.buttonText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows (Prev / Next) */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous Slide"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/40 hover:bg-black/80 text-white/80 hover:text-white border border-white/15 hover:border-[#D4A017] rounded-none flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer shadow-lg"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next Slide"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-black/40 hover:bg-black/80 text-white/80 hover:text-white border border-white/15 hover:border-[#D4A017] rounded-none flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 cursor-pointer shadow-lg"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Dots Indicator (exact match to user screenshot) */}
          <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCurrentSlide(idx);
                }}
                aria-label={`Go to slide ${idx + 1}`}
                className="p-1 cursor-pointer transition-transform hover:scale-125 focus:outline-none"
              >
                <span
                  className={`block transition-all duration-300 ${
                    currentSlide === idx
                      ? 'w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#D4A017] shadow-[0_0_8px_rgba(212,160,23,0.8)]'
                      : 'w-2 sm:w-2.5 h-2 sm:h-2.5 border-2 border-[#D4A017] bg-transparent hover:border-[#F6F0DD]'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Atelier Trust Assurance Bar */}
        <div className="bg-[#0C0A09] border-t border-stone-800/80 py-3.5 px-4">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-around gap-4 text-stone-300 text-[11px] sm:text-xs">
            <div className="flex items-center space-x-2">
              <Gem className="w-3.5 h-3.5 text-[#D4B35F] shrink-0" />
              <span>100% Conflict-Free Diamonds</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="w-3.5 h-3.5 text-[#D4B35F] shrink-0" />
              <span>18k Recycled Solid Gold</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D4B35F] shrink-0" />
              <span>Lifetime Atelier Warranty</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. INFINITE SCROLL TICKER (Seamless Auto-Moving Marquee) */}
      <div className="bg-[#12100E] border-y border-[#C49D3E]/20 py-3.5 text-[#EDDFBA] overflow-hidden select-none">
        <div className="flex w-max animate-marquee">
          {[...Array(2)].map((_, trackIdx) => (
            <div key={trackIdx} className="flex items-center space-x-8 shrink-0 px-4 text-xs uppercase tracking-[0.35em] font-medium">
              {[...Array(3)].map((_, i) => (
                <React.Fragment key={i}>
                  <span className="flex items-center space-x-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4B35F]" />
                    <span>The Iconic Collection</span>
                  </span>
                  <span className="text-[#C49D3E]">•</span>
                  <span className="flex items-center space-x-3">
                    <span>Color In Your Look</span>
                  </span>
                  <span className="text-[#C49D3E]">•</span>
                  <span className="flex items-center space-x-3">
                    <span>Elegant And Everlasting</span>
                  </span>
                  <span className="text-[#C49D3E]">•</span>
                  <span className="flex items-center space-x-3">
                    <span className="text-[#D4B35F]">Complimentary Insured Delivery</span>
                  </span>
                  <span className="text-[#C49D3E]">•</span>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* 3. DUAL EDITORIAL SPLIT BANNERS (Matching Reference Screenshot 1) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Left Banner: Add These To Your Style Roster */}
          <div className="relative rounded-none overflow-hidden bg-[#FAF6F0] border border-[#EBE3D7] shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="grid grid-cols-1 sm:grid-cols-12 min-h-[340px] items-center">
              
              {/* Text Side */}
              <div className="sm:col-span-7 p-6 sm:p-10 space-y-3 z-10">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#846127]">
                  Our Necklaces
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-tight">
                  Add These To Your Style Roster.
                </h2>
                <p className="text-xs text-stone-600 font-light leading-relaxed max-w-xs">
                  Grab the deal right now! You can get extra 15% privilege off this season on certified gold pendants.
                </p>
                <div className="pt-2">
                  <Link
                    to="/shop?category=necklaces"
                    className="inline-flex items-center px-5 py-2.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>

              {/* Image Side */}
              <div className="sm:col-span-5 h-64 sm:h-full relative overflow-hidden p-3 sm:p-4 flex items-center justify-center">
                <img
                  src="/images/banner_heart_pendant.jpg"
                  alt="18k Gold Heart Pendant with Diamonds"
                  className="w-full h-full object-cover rounded-none shadow-sm group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

            </div>
          </div>

          {/* Right Banner: Unique Engagement Rings */}
          <div className="relative rounded-none overflow-hidden bg-[#FAF6F0] border border-[#EBE3D7] shadow-sm hover:shadow-md transition-all duration-300 group">
            <div className="grid grid-cols-1 sm:grid-cols-12 min-h-[340px] items-center">
              
              {/* Text Side */}
              <div className="sm:col-span-7 p-6 sm:p-10 space-y-3 z-10">
                <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#846127]">
                  Favorite Items
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-stone-900 leading-tight">
                  Unique Engagement Rings
                </h2>
                <p className="text-xs text-stone-600 font-light leading-relaxed max-w-xs">
                  From rare antique diamonds to one-of-a-kind bespoke colored gemstones and contoured crown sets.
                </p>
                <div className="pt-2">
                  <Link
                    to="/shop?category=rings"
                    className="inline-flex items-center px-5 py-2.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
                  >
                    <span>Shop Now</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>
              </div>

              {/* Image Side */}
              <div className="sm:col-span-5 h-64 sm:h-full relative overflow-hidden p-3 sm:p-4 flex items-center justify-center">
                <img
                  src="/images/banner_engagement_ring.jpg"
                  alt="Swirl Diamond Engagement Ring on Pedestal"
                  className="w-full h-full object-cover rounded-none shadow-sm group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 4. ATELIER BANNER: "Jewellery From The World's Finest Designers" (Animated Luxurious Arabesque Lantern Backdrop) */}
      <section className="relative py-24 sm:py-32 border-y border-[#EBE3D7] overflow-hidden flex items-center justify-center">
        {/* Background Image Container with Ambient Floating Zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            src="/images/hero/Luxurious Arabesque Lantern Backdrop.png"
            alt="Luxurious Arabesque Lantern Backdrop"
            className="w-full h-full object-cover object-center animate-ambient-zoom origin-center"
          />

          {/* Left Hanging Lantern Candle Glow Scintillation */}
          <div className="absolute left-[7%] sm:left-[10%] top-[14%] sm:top-[20%] w-36 h-48 sm:w-52 sm:h-64 rounded-full bg-amber-400/30 blur-2xl animate-lantern-1" />

          {/* Right Hanging Lantern Candle Glow Scintillation */}
          <div className="absolute right-[8%] sm:right-[11%] top-[8%] sm:top-[14%] w-40 h-52 sm:w-60 sm:h-72 rounded-full bg-amber-400/35 blur-2xl animate-lantern-2" />

          {/* Floating Subtle Ambient Gold Sparkles */}
          <span className="absolute left-[18%] top-[28%] text-[#D4B35F] text-xs animate-sparkle-1">✦</span>
          <span className="absolute right-[22%] top-[34%] text-[#E5C158] text-sm animate-sparkle-2">✦</span>
          <span className="absolute left-[28%] bottom-[22%] text-[#D4B35F] text-[11px] animate-sparkle-3">✦</span>
          <span className="absolute right-[30%] top-[18%] text-[#E5C158] text-xs animate-sparkle-4">✦</span>

          {/* Soft luminous overlay to ensure optimal typography contrast while keeping lanterns glowing */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/55 to-white/20 sm:via-white/45 backdrop-blur-[0.5px]" />
          <div className="absolute inset-0 bg-[#FAF8F5]/20" />
        </div>

        <div className="max-w-4xl mx-auto px-4 text-center space-y-6 relative z-10">
          {/* Central Gem Emblem with Golden Aura Halo */}
          <div className="relative inline-flex items-center justify-center mx-auto">
            <div className="absolute -inset-1.5 bg-gradient-to-r from-[#D4B35F]/35 via-[#E5C158]/50 to-[#C49D3E]/35 blur-md animate-pulse" />
            <div className="relative w-12 h-12 rounded-none bg-white/95 border border-[#C49D3E]/70 text-[#C49D3E] shadow-sm flex items-center justify-center backdrop-blur-sm group cursor-pointer transition-transform duration-300 hover:scale-105">
              <Gem className="w-6 h-6 transition-transform duration-500 group-hover:rotate-12" />
            </div>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-stone-950 font-normal tracking-tight">
            Jewellery From The World's Finest Designers
          </h2>
          <p className="text-sm sm:text-base text-stone-700 max-w-2xl mx-auto font-light leading-relaxed">
            We believe in the power of fine jewellery to tell an eternal story, celebrate life's profound milestones, and create timeless heirlooms. Each Shiney creation is crafted with ethically sourced precious metals to mirror our commitment to sustainability and human dignity.
          </p>
          <div className="pt-2">
            <Link
              to="/about"
              className="inline-flex items-center text-xs font-semibold uppercase tracking-widest text-[#846127] hover:text-stone-950 border-b-2 border-[#C49D3E] hover:border-stone-950 pb-1.5 transition-all duration-300 group"
            >
              <span>Discover More About The Atelier</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1.5 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. BEST SELLERS & TRENDING PRODUCTS (Inspired by Screenshot 2 & 3) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-3 mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#846127]">
            Iconic Masterpieces
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal">
            Our Best Sellers
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-lg mx-auto">
            Our jewellery is made by master artisans and carefully curated to reflect your distinction and grace.
          </p>

          {/* Interactive Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-6">
            {[
              { id: 'all', label: 'All Curations' },
              { id: 'rings', label: 'Rings & Solitaires' },
              { id: 'necklaces', label: 'Necklaces & Pendants' },
              { id: 'earrings', label: 'Earrings' },
              { id: 'bangles', label: 'Bangles & Cuffs' },
              { id: 'bridal', label: 'Bridal Suites' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs px-4 py-2 rounded-none font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#12100E] text-[#EDDFBA] shadow-sm'
                    : 'bg-[#F0EAE0]/70 text-stone-700 hover:bg-[#EBE3D7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-3.5 bg-stone-900 text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-widest rounded-none shadow-md transition-all group"
          >
            <span>View All Curated Pieces ({PRODUCTS.length})</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 5B. TREND PRODUCTS OF THE WEEK (Matching User Reference) */}
      <section className="bg-white py-16 sm:py-20 border-t border-stone-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-10 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 tracking-tight">
              Trend Products of The Week
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal max-w-xl mx-auto">
              Our jewelry is made by the finest artists and carefully selected to reflect your style and personality
            </p>
          </div>

          {/* 6 Trending Cards Grid Matching User Reference Component */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {trendingProducts.map((item) => (
              <div
                key={item.id}
                className="group flex flex-col justify-between"
              >
                <div>
                  {/* Product Image Container with 3 Floating Top-Right Action Buttons */}
                  <div className="trend-card-box bg-[#F6F6F6] aspect-square relative overflow-hidden flex items-center justify-center p-3 sm:p-4 transition-all duration-300 group-hover:shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                    <Link
                      to={item.link}
                      className="w-full h-full flex items-center justify-center"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </Link>

                    {/* 3 Top-Right Action Buttons Stacked */}
                    <div className="absolute top-2.5 right-2.5 flex flex-col space-y-1.5 z-10">
                      {/* Wishlist Button (Gold background, white heart) */}
                      <button
                        onClick={(e) => handleTrendWishlist(e, item)}
                        aria-label="Save to wishlist"
                        title="Save to wishlist"
                        className="trend-action-btn w-8 h-8 flex items-center justify-center bg-[#D7A32F] hover:bg-[#C99627] text-white shadow-sm transition-all duration-200 hover:scale-105 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 fill-white text-white" />
                      </button>

                      {/* Compare Button (White background, exchange arrows) */}
                      <button
                        onClick={(e) => handleTrendCompare(e, item)}
                        aria-label="Compare product"
                        title="Compare product"
                        className="trend-action-btn w-8 h-8 flex items-center justify-center bg-white hover:bg-stone-50 text-stone-800 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-stone-200/60 transition-all duration-200 hover:scale-105 cursor-pointer"
                      >
                        <ArrowLeftRight className="w-4 h-4 text-stone-800" />
                      </button>

                      {/* Quick View Button (White background, eye icon) */}
                      <button
                        onClick={(e) => handleTrendQuickView(e, item)}
                        aria-label="Quick preview"
                        title="Quick View"
                        className="trend-action-btn w-8 h-8 flex items-center justify-center bg-white hover:bg-stone-50 text-stone-800 shadow-[0_2px_8px_rgba(0,0,0,0.06)] border border-stone-200/60 transition-all duration-200 hover:scale-105 cursor-pointer"
                      >
                        <Eye className="w-4 h-4 text-stone-800" />
                      </button>
                    </div>
                  </div>

                  {/* Meta details below image */}
                  <div className="text-center space-y-1.5 pt-3">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400 font-semibold block">
                      {item.category}
                    </span>

                    <Link to={item.link} className="block">
                      <h3 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#C49D3E] transition-colors leading-snug line-clamp-2 min-h-[2.4rem] flex items-center justify-center px-1">
                        {item.title}
                      </h3>
                    </Link>

                    {/* Star Rating: 4 gold + 1 empty for 4-star, 5 gold for 5-star */}
                    <div className="flex items-center justify-center space-x-1 pt-0.5">
                      <div className="flex items-center space-x-0.5 text-[#D7A32F]">
                        {[...Array(item.rating || 4)].map((_, i) => (
                          <Star key={`f-${i}`} className="w-3.5 h-3.5 fill-[#D7A32F] text-[#D7A32F]" />
                        ))}
                        {[...Array(5 - (item.rating || 4))].map((_, i) => (
                          <Star key={`e-${i}`} className="w-3.5 h-3.5 fill-stone-200 text-stone-300" />
                        ))}
                      </div>
                      <span className="text-[11px] text-stone-500 font-normal ml-1">
                        ({item.reviews} Reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Add to Cart Outline Button */}
                <div className="pt-3 flex justify-center">
                  <button
                    onClick={(e) => handleTrendAddToCart(e, item)}
                    className="trend-cart-btn w-full max-w-[130px] sm:max-w-[140px] py-2 px-3 border border-stone-800 hover:border-stone-950 text-stone-900 hover:bg-stone-900 hover:text-white font-medium text-xs sm:text-sm tracking-wide transition-all duration-200 flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    {justAddedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Added</span>
                      </>
                    ) : (
                      <span>Add to cart</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. QUAD EDITORIAL CATEGORY ROW (Inspired by Screenshot 3: One-Of-A-Kinds, High Tide Looks, New Organic Dôme, The Tiffany Icons) */}
      <section className="py-12 bg-[#0C0A09] text-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {[
              {
                title: 'One-Of-A-Kinds',
                subtitle: 'Rare Gemstone Rings',
                image: '/images/products/jewelry-ring-with-emerald-on-black-background-ai-generated-free-photo.jpg',
                link: '/shop?category=rings'
              },
              {
                title: 'High Tide Looks',
                subtitle: 'Hand-Hammered Cuffs',
                image: '/images/products/gold-jewelry-and-diamond-jewelry-free-photo.jpg',
                link: '/shop?category=bangles'
              },
              {
                title: 'Chandelier Halos',
                subtitle: 'Sculptural Drops',
                image: '/images/products/ai-generated-golden-drop-earrings-with-crystals-over-a-shiny-backdrop-photo.jpg',
                link: '/shop?category=earrings'
              },
              {
                title: 'The Iconic Starbursts',
                subtitle: 'Layered 18k Gold Chains',
                image: '/images/products/diamonds-with-the-dark-blue-sapphire-necklace-on-a-black-background-photo.jpg',
                link: '/shop?category=necklaces'
              }
            ].map((col, idx) => (
              <Link
                key={idx}
                to={col.link}
                className="group relative rounded-none overflow-hidden aspect-[3/4] block bg-stone-900 border border-stone-800"
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent flex flex-col justify-end p-5">
                  <span className="text-[10px] uppercase tracking-widest text-[#D4B35F] font-semibold">{col.subtitle}</span>
                  <h3 className="font-serif text-xl sm:text-2xl text-stone-100 group-hover:text-[#EDDFBA] transition-colors">{col.title}</h3>
                  <span className="text-xs text-stone-400 mt-1 inline-flex items-center group-hover:translate-x-1 transition-transform">
                    <span>See More Products</span>
                    <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                  </span>
                </div>
              </Link>
            ))}

          </div>
        </div>
      </section>

      {/* MARQUEE TICKER: Free Shipping Over $240 For Members */}
      <div className="bg-white border-y border-stone-200/80 py-3 overflow-hidden select-none">
        <div className="animate-marquee flex items-center whitespace-nowrap">
          <div className="flex items-center space-x-10 text-stone-900 font-medium text-xs sm:text-sm tracking-wide shrink-0 pr-10">
            {[...Array(8)].map((_, i) => (
              <React.Fragment key={i}>
                <span>Free Shipping Over $240 For Members</span>
                <span className="text-[#C49D3E] text-base leading-none">☼</span>
              </React.Fragment>
            ))}
          </div>
          <div className="flex items-center space-x-10 text-stone-900 font-medium text-xs sm:text-sm tracking-wide shrink-0 pr-10" aria-hidden="true">
            {[...Array(8)].map((_, i) => (
              <React.Fragment key={`dup-${i}`}>
                <span>Free Shipping Over $240 For Members</span>
                <span className="text-[#C49D3E] text-base leading-none">☼</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* 6B. HANDMADE JEWELLERY EDITORIAL SECTION (Matching User Reference) */}
      <section className="bg-white overflow-hidden py-10 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            
            {/* Left Column: Model Portrait with Flowing Lilac Silk Drapery */}
            <div className="lg:col-span-7 flex justify-center lg:justify-start">
              <div className="relative w-full max-w-2xl">
                <img
                  src="/images/hero/Glamorous_Diamond_Jewellery_Portrait-removebg-preview.png"
                  alt="Glamorous Model Wearing Handcrafted Diamond Jewellery Suite"
                  className="w-full h-auto object-contain drop-shadow-[0_20px_35px_rgba(0,0,0,0.08)] transform hover:scale-[1.02] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Right Column: Editorial Details & Action */}
            <div className="lg:col-span-5 space-y-6 text-left lg:pl-2">
              <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-semibold text-stone-500 block">
                Our Challenge To Do Better
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight leading-[1.12]">
                All Of Our Jewellery<br />Is Handmade.
              </h2>

              <p className="text-xs sm:text-sm text-stone-600 font-normal leading-relaxed max-w-md">
                A gift they'll treasure forever, Olight created diamonds jewelry combines precious metals with laboratory grown diamonds to form captivating collections.
              </p>

              <div className="pt-2">
                <Link
                  to="/shop"
                  className="inline-flex items-center justify-center px-8 py-3.5 bg-[#1C1C1E] hover:bg-stone-800 text-white font-medium text-xs sm:text-sm tracking-wider uppercase rounded-none transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Explore More
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. SCROLL-DRIVEN CRAFTSMANSHIP STORY (ScrollWorld-inspired interactive atelier sequence) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-3 mb-16">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#846127]">
            The Journey of Artistry
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl text-stone-950 font-normal">
            120 Hours of Master Craftsmanship
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 font-light max-w-lg mx-auto">
            Explore the four indispensable phases every Shiney creation undergoes in our private atelier.
          </p>
        </div>

        {/* Interactive Story Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#FCFBF9] p-6 sm:p-10 rounded-none border border-[#DFD5C6] shadow-sm">
          
          {/* Step Selection Controls */}
          <div className="lg:col-span-5 space-y-3">
            {craftsmanshipSteps.map((step, idx) => (
              <div
                key={idx}
                onClick={() => setActiveStoryStep(idx)}
                className={`p-5 rounded-none cursor-pointer transition-all border ${
                  activeStoryStep === idx
                    ? 'bg-[#F6F0DD]/60 border-[#C49D3E] shadow-sm'
                    : 'bg-white/60 border-stone-200 hover:border-stone-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#846127]">
                    {step.subtitle}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-none bg-stone-100 text-stone-600">
                    {step.badge}
                  </span>
                </div>
                <h4 className="font-serif text-lg font-medium text-stone-900 mt-1">
                  {step.title}
                </h4>
                {activeStoryStep === idx && (
                  <p className="text-xs text-stone-600 mt-2 font-light leading-relaxed animate-in fade-in">
                    {step.desc}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Dynamic Image Display with Subtle Parallax Effect */}
          <div className="lg:col-span-7 relative aspect-[4/3] rounded-none overflow-hidden border border-stone-200 shadow-md bg-stone-900">
            <img
              src={craftsmanshipSteps[activeStoryStep].image}
              alt={craftsmanshipSteps[activeStoryStep].title}
              className="w-full h-full object-cover transition-all duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
              <div className="text-white">
                <span className="text-xs uppercase tracking-widest text-[#EDDFBA] font-medium">
                  {craftsmanshipSteps[activeStoryStep].badge}
                </span>
                <p className="font-serif text-2xl text-stone-100 mt-1">
                  {craftsmanshipSteps[activeStoryStep].title}
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* 9. TRUST PILLARS (Inspired by Screenshot 3: Complimentary Shipping, At Your Service, Book Appointment, Iconic Box) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-stone-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {TRUST_PILLARS.map((pillar, idx) => (
            <div key={idx} className="flex items-start space-x-4 p-4 rounded-none hover:bg-[#F6F0DD]/30 transition-colors">
              <div className="p-3 rounded-none bg-[#F0EAE0] text-[#846127] shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-[#C49D3E]" />
              </div>
              <div className="space-y-1">
                <h4 className="font-serif text-base font-semibold text-stone-900">{pillar.title}</h4>
                <p className="text-xs text-stone-500 font-light leading-relaxed">{pillar.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9B. OUR LATEST BLOG SECTION (Interactive Carousel Slider) */}
      <section 
        className="bg-white py-16 sm:py-24 border-t border-stone-200/70 relative select-none"
        onMouseEnter={() => setIsBlogPaused(true)}
        onMouseLeave={() => setIsBlogPaused(false)}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Section Header */}
          <div className="text-center space-y-2 mb-10 sm:mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
              Our Latest Blog
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-normal">
              Adorn Yourself in Glamour: Find Your Perfect Piece Today
            </p>
          </div>

          {/* Carousel Viewport Container with Side Navigation Arrows */}
          <div className="relative group/carousel">
            
            {/* Left Navigation Arrow */}
            <button
              onClick={prevBlogSlide}
              aria-label="Previous blog posts"
              className="carousel-nav-btn absolute -left-3 sm:-left-5 lg:-left-6 top-[36%] -translate-y-1/2 z-20 w-11 h-11 bg-white/95 hover:bg-[#12100E] text-stone-700 hover:text-[#EDDFBA] border border-stone-200 shadow-[0_4px_16px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-90 group-hover/carousel:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Right Navigation Arrow */}
            <button
              onClick={nextBlogSlide}
              aria-label="Next blog posts"
              className="carousel-nav-btn absolute -right-3 sm:-right-5 lg:-right-6 top-[36%] -translate-y-1/2 z-20 w-11 h-11 bg-white/95 hover:bg-[#12100E] text-stone-700 hover:text-[#EDDFBA] border border-stone-200 shadow-[0_4px_16px_rgba(0,0,0,0.1)] flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer opacity-90 group-hover/carousel:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Overflow Hidden Track Window */}
            <div 
              className="overflow-hidden"
              onTouchStart={handleBlogTouchStart}
              onTouchEnd={handleBlogTouchEnd}
            >
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{
                  transform: `translateX(-${blogSlide * (100 / blogVisibleCount)}%)`
                }}
              >
                {latestBlogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="shrink-0 px-3 sm:px-3.5"
                    style={{
                      flex: `0 0 ${100 / blogVisibleCount}%`,
                      maxWidth: `${100 / blogVisibleCount}%`
                    }}
                  >
                    <article className="group flex flex-col items-center text-center space-y-3 h-full">
                      
                      {/* Blog Card Image Container */}
                      <Link
                        to={`/blog/${blog.slug}`}
                        className="blog-card-img block w-full overflow-hidden aspect-[16/10] bg-stone-100 shadow-xs hover:shadow-md transition-all duration-300"
                      >
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                          loading="lazy"
                        />
                      </Link>

                      {/* Category & Date */}
                      <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-stone-400 font-semibold block pt-1">
                        {blog.category} — {blog.date}
                      </span>

                      {/* Title */}
                      <Link to={`/blog/${blog.slug}`} className="block w-full">
                        <h3 className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-[#C49D3E] transition-colors leading-snug line-clamp-2 min-h-[2.5rem] flex items-center justify-center px-1">
                          {blog.title}
                        </h3>
                      </Link>

                      {/* Excerpt */}
                      <p className="text-xs text-stone-500 font-normal leading-relaxed line-clamp-3 max-w-xs mx-auto">
                        {blog.excerpt}
                      </p>

                      {/* Read More Link */}
                      <div className="pt-2 mt-auto">
                        <Link
                          to={`/blog/${blog.slug}`}
                          className="inline-block text-xs font-semibold text-stone-900 underline underline-offset-4 decoration-stone-900 hover:text-[#C49D3E] hover:decoration-[#C49D3E] transition-all"
                        >
                          Read More
                        </Link>
                      </div>

                    </article>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Pagination Indicators / Slide Dots */}
          <div className="flex items-center justify-center space-x-2 pt-8 sm:pt-10">
            {Array.from({ length: maxBlogSlide + 1 }).map((_, dotIdx) => (
              <button
                key={dotIdx}
                onClick={() => setBlogSlide(dotIdx)}
                aria-label={`Go to slide ${dotIdx + 1}`}
                className={`carousel-dot transition-all duration-300 cursor-pointer ${
                  blogSlide === dotIdx
                    ? 'w-7 sm:w-8 h-2 bg-[#C49D3E]'
                    : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 10. CLIENT TESTIMONIALS (Inspired by Screenshot 5: "What Our Clients Say") */}
      <section className="bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE8] to-[#FAF8F5] py-20 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#846127]">
              Adorn Yourself in Glamour
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal">
              What Our Clients Say
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 font-light">
              Reflections from patrons who have chosen Shiney for their most cherished occasions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.id}
                className="bg-[#FCFBF9] p-6 sm:p-8 rounded-none border border-[#DFD5C6] shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex text-amber-500 space-x-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <p className="font-serif italic text-base text-stone-800 leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold text-stone-900">{t.author}</p>
                    <p className="text-[11px] text-stone-500 font-light">{t.role}</p>
                  </div>
                  <span className="text-[10px] text-[#846127] bg-[#F6F0DD] px-2 py-0.5 rounded-none font-medium">
                    Verified Patron
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. BOTTOM CTA BANNER: "Shop The Latest Trends" (Inspired by Screenshot 5) */}
      <section className="relative py-24 bg-[#0A0908] text-stone-100 overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1598560917505-59a3ad559071?w=1600&auto=format&fit=crop&q=80"
            alt="Gold Rings Macro"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-transparent to-[#0A0908]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 space-y-4">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#D4B35F]">
            Haute Joaillerie Atelier
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-stone-100">
            Shop The Latest Trends
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-md mx-auto">
            Exceptional handcrafted design to enhance your magnificent glow.
          </p>
          <div className="pt-3">
            <Link
              to="/shop"
              className="inline-flex items-center px-8 py-3.5 bg-[#C49D3E] hover:bg-[#DFB868] text-stone-950 font-semibold text-xs uppercase tracking-widest rounded-none shadow-lg transition-colors"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick View Modal for Trending Products */}
      {quickViewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="trend-card-box bg-white max-w-lg w-full p-6 sm:p-8 relative shadow-2xl border border-stone-200">
            {/* Close Button */}
            <button
              onClick={() => setQuickViewItem(null)}
              aria-label="Close modal"
              className="trend-action-btn absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Product Image */}
              <div className="trend-card-box bg-[#F6F6F6] aspect-square flex items-center justify-center p-4">
                <img
                  src={quickViewItem.image}
                  alt={quickViewItem.title}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {/* Product Info */}
              <div className="space-y-3 text-left">
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                  {quickViewItem.category}
                </span>
                <h3 className="text-lg font-bold text-stone-900 leading-snug">
                  {quickViewItem.title}
                </h3>

                <div className="flex items-center space-x-1">
                  <div className="flex items-center text-[#D7A32F]">
                    {[...Array(quickViewItem.rating || 4)].map((_, i) => (
                      <Star key={`qv-f-${i}`} className="w-3.5 h-3.5 fill-[#D7A32F] text-[#D7A32F]" />
                    ))}
                    {[...Array(5 - (quickViewItem.rating || 4))].map((_, i) => (
                      <Star key={`qv-e-${i}`} className="w-3.5 h-3.5 fill-stone-200 text-stone-300" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-500 font-normal ml-1">
                    ({quickViewItem.reviews} Reviews)
                  </span>
                </div>

                <div className="text-lg font-bold text-stone-900">
                  {quickViewItem.price}
                </div>

                <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                  {quickViewItem.description || 'Artisan handcrafted piece made with ethically recovered solid gold and certified gemstones.'}
                </p>

                <div className="pt-2 flex flex-col space-y-2">
                  <button
                    onClick={(e) => {
                      handleTrendAddToCart(e, quickViewItem);
                      setQuickViewItem(null);
                    }}
                    className="trend-cart-btn w-full py-2.5 px-4 bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    Add to Bag
                  </button>
                  <Link
                    to={quickViewItem.link}
                    onClick={() => setQuickViewItem(null)}
                    className="text-center text-xs text-stone-600 hover:text-stone-950 font-medium underline pt-1"
                  >
                    View Full Product Details →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
