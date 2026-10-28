import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Heart, ShoppingBag, Menu, X, Sparkles, ChevronDown, User, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import SearchModal from './SearchModal';
import AuthModal from '../auth/AuthModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const userButtonRef = useRef(null);
  
  const { cartCount, wishlist, setIsCartOpen } = useCart();
  const { isAuthModalOpen, setIsAuthModalOpen } = useAuth();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
  }, [location.pathname]);

  const navBackground = isHome && !isScrolled
    ? 'bg-[#0A0908]/90 text-stone-100 border-b border-[#C49D3E]/20 backdrop-blur-md'
    : 'bg-[#FCFBF9]/95 text-stone-900 border-b border-[#DFD5C6] shadow-sm backdrop-blur-md';

  const linkColor = isHome && !isScrolled
    ? 'text-stone-300 hover:text-[#EDDFBA]'
    : 'text-stone-700 hover:text-[#846127]';

  const logoColor = isHome && !isScrolled ? 'text-stone-100' : 'text-stone-950';

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 ${navBackground}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Top Header Bar */}
          <div className="flex items-center justify-between h-20">
            
            {/* Left: Mobile hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className={`p-2 rounded-none ${isHome && !isScrolled ? 'text-stone-200' : 'text-stone-800'}`}
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>

            {/* Desktop Left Nav Links (HOME, SHOP, CATEGORIES, PRODUCT, PAGES, BLOG, CONTACT) */}
            <nav className="hidden lg:flex items-center space-x-6 text-xs uppercase tracking-widest font-medium">
              
              {/* 1. HOME */}
              <div
                className="relative py-7 group"
                onMouseEnter={() => setActiveDropdown('home')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to="/"
                  className={`inline-flex items-center space-x-1 py-1 transition-colors ${linkColor} ${
                    location.pathname === '/' ? 'text-[#C49D3E] font-semibold' : ''
                  }`}
                >
                  <span>Home</span>
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {activeDropdown === 'home' && (
                  <div className="absolute top-full left-0 w-52 bg-[#FCFBF9] text-stone-900 border border-[#DFD5C6] shadow-2xl rounded-none p-3 z-50 animate-in fade-in duration-200">
                    <Link to="/" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      01 - Atelier Classic
                    </Link>
                    <Link to="/?style=minimal" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      02 - Modern Minimalist
                    </Link>
                    <Link to="/?style=high-jewellery" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      03 - High Jewellery
                    </Link>
                  </div>
                )}
              </div>

              {/* 2. SHOP (Mega Menu Matching Screenshot 1) */}
              <div
                className="relative py-7 group"
                onMouseEnter={() => setActiveDropdown('shop')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to="/shop"
                  className={`inline-flex items-center space-x-1 py-1 transition-colors ${linkColor} ${
                    location.pathname.startsWith('/shop') ? 'text-[#C49D3E] font-semibold' : ''
                  }`}
                >
                  <span>Shop</span>
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {activeDropdown === 'shop' && (
                  <div className="fixed left-4 right-4 max-w-6xl mx-auto top-[76px] bg-[#FCFBF9] text-stone-900 border border-[#DFD5C6] shadow-2xl rounded-none p-8 z-50 animate-in fade-in duration-200">
                    <div className="grid grid-cols-5 gap-6 text-xs">
                      
                      {/* Column 1: Shop Layouts */}
                      <div className="space-y-3">
                        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200">
                          Shop Layouts
                        </h4>
                        <ul className="space-y-2 text-stone-600 font-light">
                          <li><Link to="/shop" className="hover:text-[#846127]">01 - Shop Default</Link></li>
                          <li><Link to="/shop?layout=small" className="hover:text-[#846127]">02 - Shop Small</Link></li>
                          <li><Link to="/shop?layout=medium" className="hover:text-[#846127]">03 - Shop Medium</Link></li>
                          <li><Link to="/shop?layout=large" className="hover:text-[#846127]">04 - Shop Large</Link></li>
                          <li><Link to="/shop?view=list" className="hover:text-[#846127]">05 - Shop Listview</Link></li>
                          <li><Link to="/shop?sidebar=category" className="hover:text-[#846127]">06 - With Category</Link></li>
                        </ul>
                      </div>

                      {/* Column 2: Filter Style & Page Loading */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200">
                            Filter Style
                          </h4>
                          <ul className="space-y-1.5 text-stone-600 font-light">
                            <li><Link to="/shop" className="hover:text-[#846127]">Top Filter</Link></li>
                            <li><Link to="/shop?filter=offcanvas" className="hover:text-[#846127]">Offcanvas Filter</Link></li>
                            <li><Link to="/shop?filter=drawer" className="hover:text-[#846127]">Drawing Filter</Link></li>
                            <li><Link to="/shop?filter=dropdown" className="hover:text-[#846127]">Dropdown Filter</Link></li>
                            <li><Link to="/shop?filter=menu" className="hover:text-[#846127]">Menu Filter</Link></li>
                          </ul>
                        </div>
                        <div className="space-y-2 pt-2 border-t border-stone-100">
                          <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-stone-900">
                            Page Loading
                          </h4>
                          <ul className="space-y-1 text-stone-600 font-light">
                            <li><Link to="/shop?page=pagination" className="hover:text-[#846127]">Pagination</Link></li>
                            <li><Link to="/shop?page=infinite" className="hover:text-[#846127]">Infinity Scroll</Link></li>
                            <li><Link to="/shop?page=loadmore" className="hover:text-[#846127]">Load More</Link></li>
                          </ul>
                        </div>
                      </div>

                      {/* Column 3: Product Layouts */}
                      <div className="space-y-3">
                        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200">
                          Product Layouts
                        </h4>
                        <ul className="space-y-2 text-stone-600 font-light">
                          <li><Link to="/product/the-celestial-empress-solitaire-ring" className="hover:text-[#846127]">Product Default</Link></li>
                          <li><Link to="/product/the-celestial-empress-solitaire-ring" className="hover:text-[#846127]">Product Accordion</Link></li>
                          <li><Link to="/product/the-celestial-empress-solitaire-ring" className="hover:text-[#846127]">Sticky Details</Link></li>
                          <li><Link to="/product/prism-spectrum-multicolored-gemstone-collier" className="hover:text-[#846127]">Horizontal Thumb</Link></li>
                          <li><Link to="/product/aura-waterfall-crystal-drop-earrings" className="hover:text-[#846127]">Gallery Thumb</Link></li>
                          <li><Link to="/product/siren-of-gold-bespoke-haute-joaillerie-collar" className="hover:text-[#846127]">Without Thumb</Link></li>
                        </ul>
                      </div>

                      {/* Column 4: Product Type */}
                      <div className="space-y-3">
                        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200">
                          Product Type
                        </h4>
                        <ul className="space-y-2 text-stone-600 font-light">
                          <li><Link to="/product/scarlet-imperial-ruby-diamond-ring" className="hover:text-[#846127]">Simple Product</Link></li>
                          <li><Link to="/product/the-celestial-empress-solitaire-ring" className="hover:text-[#846127]">Variable Product</Link></li>
                          <li><Link to="/product/eternal-vows-dual-tone-wedding-band-suite" className="hover:text-[#846127]">External Product</Link></li>
                          <li><Link to="/product/astraea-golden-dawn-statement-choker-hoops" className="hover:text-[#846127]">Grouped Product</Link></li>
                          <li><Link to="/product/verdant-sovereign-emerald-cushion-ring" className="hover:text-[#846127]">Countdown Product</Link></li>
                          <li><Link to="/product/siren-of-gold-bespoke-haute-joaillerie-collar" className="hover:text-[#846127]">Video Product</Link></li>
                        </ul>
                      </div>

                      {/* Column 5: Featured Promo Card (Matching Screenshot 1) */}
                      <div className="rounded-none overflow-hidden bg-gradient-to-br from-[#F5EFE6] to-[#FAF8F5] p-5 border border-[#EBE3D7] flex flex-col justify-between shadow-sm">
                        <div className="space-y-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-[#846127]">
                            FAVORITE ITEMS
                          </span>
                          <h5 className="font-serif text-base font-semibold text-stone-950 leading-snug">
                            Unique Engagement Rings
                          </h5>
                          <Link
                            to="/shop?category=rings"
                            className="inline-block mt-2 px-4 py-1.5 bg-white text-stone-900 hover:bg-stone-900 hover:text-white text-[11px] font-semibold uppercase tracking-wider rounded-none border border-stone-300 transition-colors"
                          >
                            Shop Now
                          </Link>
                        </div>
                        <img
                          src="/images/banner_engagement_ring.jpg"
                          alt="Unique Engagement Rings"
                          className="w-full h-32 object-cover rounded-none mt-3 shadow-sm"
                        />
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* 3. CATEGORIES (Mega Menu Matching Screenshot 2) */}
              <div
                className="relative py-7 group"
                onMouseEnter={() => setActiveDropdown('categories')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className={`inline-flex items-center space-x-1 py-1 transition-colors ${linkColor}`}
                >
                  <span>Categories</span>
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {activeDropdown === 'categories' && (
                  <div className="fixed left-4 right-4 max-w-5xl mx-auto top-[76px] bg-[#FCFBF9] text-stone-900 border border-[#DFD5C6] shadow-2xl rounded-none p-8 z-50 animate-in fade-in duration-200">
                    <div className="grid grid-cols-4 gap-8 text-xs">
                      
                      {/* Column 1: Bracelets */}
                      <div className="space-y-3">
                        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200">
                          Bracelets
                        </h4>
                        <ul className="space-y-2 text-stone-600 font-light">
                          <li><Link to="/shop?category=bangles" className="hover:text-[#846127]">Diamond Bracelets</Link></li>
                          <li><Link to="/shop?category=bangles" className="hover:text-[#846127]">Gemstone Bracelets</Link></li>
                          <li><Link to="/shop?category=bangles" className="hover:text-[#846127]">Pearl Bracelets</Link></li>
                          <li><Link to="/shop?category=bangles" className="hover:text-[#846127]">Gold Bracelets</Link></li>
                          <li><Link to="/shop?category=bangles" className="hover:text-[#846127]">Silver Bracelets</Link></li>
                          <li><Link to="/shop?category=bangles" className="hover:text-[#846127]">Bangle Bracelets</Link></li>
                        </ul>
                      </div>

                      {/* Column 2: Necklaces */}
                      <div className="space-y-3">
                        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200">
                          Necklaces
                        </h4>
                        <ul className="space-y-2 text-stone-600 font-light">
                          <li><Link to="/shop?category=necklaces" className="hover:text-[#846127]">Diamond Necklaces</Link></li>
                          <li><Link to="/shop?category=necklaces" className="hover:text-[#846127]">Gemstone Necklaces</Link></li>
                          <li><Link to="/shop?category=necklaces" className="hover:text-[#846127]">Pearl Necklaces</Link></li>
                          <li><Link to="/shop?category=necklaces" className="hover:text-[#846127]">Gold Necklaces</Link></li>
                          <li><Link to="/shop?category=necklaces" className="hover:text-[#846127]">Silver Necklaces</Link></li>
                          <li><Link to="/shop?category=necklaces" className="hover:text-[#846127]">Cross Necklaces</Link></li>
                        </ul>
                      </div>

                      {/* Column 3: Rings */}
                      <div className="space-y-3">
                        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200">
                          Rings
                        </h4>
                        <ul className="space-y-2 text-stone-600 font-light">
                          <li><Link to="/shop?category=rings" className="hover:text-[#846127]">Diamond Rings</Link></li>
                          <li><Link to="/shop?category=rings" className="hover:text-[#846127]">Gemstone Rings</Link></li>
                          <li><Link to="/shop?category=bridal" className="hover:text-[#846127]">Wedding Rings</Link></li>
                          <li><Link to="/shop?category=rings" className="hover:text-[#846127]">Engagement Rings</Link></li>
                          <li><Link to="/shop?category=rings" className="hover:text-[#846127]">Gold Rings</Link></li>
                          <li><Link to="/shop?category=rings" className="hover:text-[#846127]">Fashion Rings</Link></li>
                        </ul>
                      </div>

                      {/* Column 4: Jewelry */}
                      <div className="space-y-3">
                        <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200">
                          Jewelry
                        </h4>
                        <ul className="space-y-2 text-stone-600 font-light">
                          <li><Link to="/shop" className="hover:text-[#846127]">Men's Jewelry</Link></li>
                          <li><Link to="/shop" className="hover:text-[#846127]">Birthstone Jewelry</Link></li>
                          <li><Link to="/shop" className="hover:text-[#846127]">Pearl Jewelry</Link></li>
                          <li><Link to="/shop" className="hover:text-[#846127]">Rose Gold Jewelry</Link></li>
                          <li><Link to="/shop?filter=new" className="hover:text-[#846127]">New Arrivals</Link></li>
                          <li><Link to="/shop?filter=sale" className="hover:text-[#846127]">Jewelry Sale</Link></li>
                        </ul>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* 4. PRODUCT (Dropdown Matching Screenshot 3) */}
              <div
                className="relative py-7 group"
                onMouseEnter={() => setActiveDropdown('product')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to="/product/the-celestial-empress-solitaire-ring"
                  className={`inline-flex items-center space-x-1 py-1 transition-colors ${linkColor}`}
                >
                  <span>Product</span>
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {activeDropdown === 'product' && (
                  <div className="absolute top-full left-0 w-80 bg-[#FCFBF9] text-stone-900 border border-[#DFD5C6] shadow-2xl rounded-none p-5 z-50 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200 mb-2">
                          Product Types
                        </h4>
                        <ul className="space-y-1.5 text-stone-600 font-light">
                          <li><Link to="/product/the-celestial-empress-solitaire-ring" className="hover:text-[#846127]">Product Default</Link></li>
                          <li><Link to="/product/the-celestial-empress-solitaire-ring" className="hover:text-[#846127]">Product Accordion</Link></li>
                          <li><Link to="/product/the-celestial-empress-solitaire-ring" className="hover:text-[#846127]">Sticky Details</Link></li>
                          <li><Link to="/product/prism-spectrum-multicolored-gemstone-collier" className="hover:text-[#846127]">Horizontal Thumb</Link></li>
                          <li><Link to="/product/aura-waterfall-crystal-drop-earrings" className="hover:text-[#846127]">Gallery Thumb</Link></li>
                          <li><Link to="/product/siren-of-gold-bespoke-haute-joaillerie-collar" className="hover:text-[#846127]">Without Thumb</Link></li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-serif text-xs font-semibold uppercase tracking-wider text-stone-900 pb-1 border-b border-stone-200 mb-2">
                          Shop Layouts
                        </h4>
                        <ul className="space-y-1.5 text-stone-600 font-light">
                          <li><Link to="/product/scarlet-imperial-ruby-diamond-ring" className="hover:text-[#846127]">Simple Product</Link></li>
                          <li><Link to="/product/the-celestial-empress-solitaire-ring" className="hover:text-[#846127]">Variable Product</Link></li>
                          <li><Link to="/product/eternal-vows-dual-tone-wedding-band-suite" className="hover:text-[#846127]">External Product</Link></li>
                          <li><Link to="/product/astraea-golden-dawn-statement-choker-hoops" className="hover:text-[#846127]">Grouped Product</Link></li>
                          <li><Link to="/product/verdant-sovereign-emerald-cushion-ring" className="hover:text-[#846127]">Countdown Product</Link></li>
                          <li><Link to="/product/siren-of-gold-bespoke-haute-joaillerie-collar" className="hover:text-[#846127]">Video Product</Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. PAGES (Dropdown Matching Screenshot 4) */}
              <div
                className="relative py-7 group"
                onMouseEnter={() => setActiveDropdown('pages')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  type="button"
                  className={`inline-flex items-center space-x-1 py-1 transition-colors ${linkColor}`}
                >
                  <span>Pages</span>
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                </button>

                {activeDropdown === 'pages' && (
                  <div className="absolute top-full left-0 w-48 bg-[#FCFBF9] text-stone-900 border border-[#DFD5C6] shadow-2xl rounded-none p-3 z-50 animate-in fade-in duration-200 space-y-1 text-xs">
                    <Link to="/about" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      About Us
                    </Link>
                    <Link to="/faq" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      FAQ
                    </Link>
                    <Link to="/404" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      Error Page
                    </Link>
                    <Link to="/account" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      My account
                    </Link>
                    <Link to="/cart" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      Cart
                    </Link>
                    <Link to="/checkout" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      Checkout
                    </Link>
                  </div>
                )}
              </div>

              {/* 6. BLOG (Dropdown Matching Screenshot 5) */}
              <div
                className="relative py-7 group"
                onMouseEnter={() => setActiveDropdown('blog')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  to="/blog"
                  className={`inline-flex items-center space-x-1 py-1 transition-colors ${linkColor} ${
                    location.pathname.startsWith('/blog') ? 'text-[#C49D3E] font-semibold' : ''
                  }`}
                >
                  <span>Blog</span>
                  <ChevronDown className="w-3 h-3 group-hover:rotate-180 transition-transform duration-200" />
                </Link>

                {activeDropdown === 'blog' && (
                  <div className="absolute top-full left-0 w-48 bg-[#FCFBF9] text-stone-900 border border-[#DFD5C6] shadow-2xl rounded-none p-3 z-50 animate-in fade-in duration-200 space-y-1 text-xs">
                    <Link to="/blog?view=list" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      Blog Listview
                    </Link>
                    <Link to="/blog?view=grid" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      Blog Gridview
                    </Link>
                    <Link to="/blog" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      Blog Standard
                    </Link>
                    <Link to="/blog/layering-necklaces-like-a-pro" className="block py-2 px-3 rounded-none hover:bg-[#F6F0DD] font-serif text-xs font-medium text-stone-800">
                      Single Post
                    </Link>
                  </div>
                )}
              </div>

              {/* 7. CONTACT */}
              <Link
                to="/contact"
                className={`py-1 transition-colors ${linkColor} ${
                  location.pathname === '/contact' ? 'text-[#C49D3E] font-semibold' : ''
                }`}
              >
                Contact
              </Link>

            </nav>

            {/* Center Brand Logo (Matching Screenshot 1) */}
            <div className="text-center">
              <Link to="/" className="inline-block group">
                <div className="flex items-center justify-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#C49D3E]" />
                  <span className={`font-serif tracking-[0.25em] text-2xl sm:text-3xl font-normal uppercase transition-colors ${logoColor}`}>
                    Shiney
                  </span>
                </div>
                <span className="block text-[8px] uppercase tracking-[0.45em] text-[#C49D3E] font-medium -mt-1 group-hover:tracking-[0.55em] transition-all">
                  Haute Joaillerie
                </span>
              </Link>
            </div>

            {/* Right Action Icons (Search, Bag, Wishlist, Account, Menu) */}
            <div className="flex items-center justify-end space-x-3 sm:space-x-4">
              
              {/* Search Icon */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className={`p-2 rounded-none transition-colors ${linkColor}`}
                aria-label="Search"
                title="Search Fine Jewellery"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Shopping Bag Button (With Badge) */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                className={`p-2 rounded-none relative transition-colors ${linkColor}`}
                aria-label="Open shopping bag"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C49D3E] text-stone-950 font-bold text-[10px] rounded-none flex items-center justify-center shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Wishlist Heart (With Badge) */}
              <Link
                to="/wishlist"
                className={`p-2 rounded-none relative transition-colors ${linkColor}`}
                aria-label="Saved items in wishlist"
                title="Private Wishlist"
              >
                <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#C49D3E] text-[#C49D3E]' : ''}`} />
                {wishlist.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C49D3E] text-stone-950 font-bold text-[10px] rounded-none flex items-center justify-center">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account Icon with Anchored Auth Popover (Matching Screenshot) */}
              <div className="relative" ref={userButtonRef}>
                <button
                  type="button"
                  onClick={() => setIsAuthModalOpen(!isAuthModalOpen)}
                  className={`p-2 rounded-none transition-colors hidden sm:block ${linkColor} ${
                    isAuthModalOpen ? 'text-[#C49D3E]' : ''
                  }`}
                  aria-label="User Account Sign in"
                  title="My Account"
                >
                  <User className="w-5 h-5" />
                </button>

                {/* Popover Modal Anchored Under User Icon */}
                <AuthModal anchorRef={userButtonRef} />
              </div>

            </div>

          </div>

        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#FAF8F5] text-stone-900 shadow-xl flex flex-col p-6 border-r border-[#DFD5C6]">
            
            <div className="flex items-center justify-between pb-6 border-b border-stone-200">
              <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                <span className="font-serif tracking-[0.2em] text-xl font-normal uppercase text-stone-900">
                  Shiney
                </span>
                <span className="block text-[8px] uppercase tracking-[0.4em] text-[#C49D3E] font-medium">
                  Haute Joaillerie
                </span>
              </Link>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1.5 text-stone-400 hover:text-stone-900"
                aria-label="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto py-6 space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-[#846127] font-semibold">Navigation Menu</p>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-base font-serif font-medium text-stone-800 hover:text-[#A7802F]">
                Home
              </Link>
              <Link to="/shop" onClick={() => setMobileMenuOpen(false)} className="block text-base font-serif font-medium text-stone-800 hover:text-[#A7802F]">
                Shop Showroom
              </Link>
              <div className="pl-3 space-y-1.5 border-l border-stone-200 text-xs text-stone-600">
                <Link to="/shop?category=rings" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-stone-950">Rings & Solitaires</Link>
                <Link to="/shop?category=necklaces" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-stone-950">Necklaces & Pendants</Link>
                <Link to="/shop?category=earrings" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-stone-950">Chandelier & Stud Earrings</Link>
                <Link to="/shop?category=bangles" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-stone-950">Bangles & Cuffs</Link>
                <Link to="/shop?category=bridal" onClick={() => setMobileMenuOpen(false)} className="block py-1 hover:text-stone-950">Bridal & Heirlooms</Link>
              </div>
              <Link to="/blog" onClick={() => setMobileMenuOpen(false)} className="block text-base font-serif font-medium text-stone-800 hover:text-[#A7802F]">
                Journal & Blog
              </Link>
              <Link to="/about" onClick={() => setMobileMenuOpen(false)} className="block text-base font-serif font-medium text-stone-800 hover:text-[#A7802F]">
                About Us
              </Link>
              <Link to="/faq" onClick={() => setMobileMenuOpen(false)} className="block text-base font-serif font-medium text-stone-800 hover:text-[#A7802F]">
                FAQ
              </Link>
              <Link to="/account" onClick={() => setMobileMenuOpen(false)} className="block text-base font-serif font-medium text-stone-800 hover:text-[#A7802F]">
                My Account
              </Link>
              <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className="block text-base font-serif font-medium text-stone-800 hover:text-[#A7802F]">
                Private Wishlist ({wishlist.length})
              </Link>
              <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className="block text-base font-serif font-medium text-stone-800 hover:text-[#A7802F]">
                Contact Concierge
              </Link>
            </nav>

            <div className="pt-4 border-t border-stone-200 text-xs text-stone-500">
              <p className="font-semibold text-stone-800">Private Client Salon</p>
              <p>appointments@shineyjewellery.com</p>
            </div>
          </div>
        </div>
      )}

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
