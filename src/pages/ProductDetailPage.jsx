import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Star, ShieldCheck, Gem, Sparkles, Truck, RotateCcw, Check, ChevronRight, Share2, CreditCard, Users, Shield } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ui/ProductCard';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart, toggleWishlist, isInWishlist } = useCart();

  const product = PRODUCTS.find((p) => p.slug === slug);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="font-serif text-3xl text-stone-900">Creation Not Found</h1>
        <p className="text-sm text-stone-500 font-light">
          The fine jewellery piece you are seeking may have been archived or is temporarily unavailable.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center px-6 py-2.5 bg-[#12100E] text-[#EDDFBA] text-xs font-semibold uppercase tracking-wider rounded-none"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants ? product.variants.find((v) => v.inStock) || product.variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setActiveImageIndex(0);
    if (product.variants) {
      setSelectedVariant(product.variants.find((v) => v.inStock) || product.variants[0]);
    }
    setQuantity(1);
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [slug]);

  const isFavorited = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product, selectedVariant, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyItNow = () => {
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const relatedProducts = PRODUCTS.filter((p) => p.id !== product.id).slice(0, 5);

  const discountPercentage = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : null;

  return (
    <div className="bg-[#FAF8F5] text-stone-900 pb-24">
      
      {/* Breadcrumb Navigation (Matching Screenshot 2) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-[11px] uppercase tracking-wider text-stone-500 flex items-center space-x-2 border-b border-stone-200/60 font-medium">
        <Link to="/" className="hover:text-stone-900 transition-colors">Home Page</Link>
        <span>&gt;</span>
        <Link to={`/shop?category=${product.category}`} className="hover:text-stone-900 transition-colors">
          {product.categoryLabel}
        </Link>
        <span>&gt;</span>
        <span className="text-stone-800 font-semibold truncate">{product.name}</span>
      </div>

      {/* Main PDP Grid (Matching Screenshot 2) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Vertical Thumbnails Strip + Large Main Stage Image */}
          <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
            
            {/* Vertical Thumbnails Column (Matching Screenshot 2) */}
            <div className="flex sm:flex-col gap-2.5 overflow-x-auto sm:overflow-y-auto sm:w-20 shrink-0">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-none overflow-hidden border-2 shrink-0 transition-all ${
                    activeImageIndex === idx
                      ? 'border-[#C49D3E] shadow-sm'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`${product.name} angle ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
              {/* Extra perspective images if only 1-2 images in product */}
              {product.images.length < 4 && [
                'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&auto=format&fit=crop&q=80',
                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&auto=format&fit=crop&q=80'
              ].slice(0, 4 - product.images.length).map((dummy, idx) => (
                <button
                  key={`extra-${idx}`}
                  onClick={() => setActiveImageIndex(0)}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-none overflow-hidden border border-stone-200 opacity-60 hover:opacity-100"
                >
                  <img src={dummy} alt="Angle perspective" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* Main Stage Image (Clean white/ivory studio backdrop) */}
            <div className="flex-1 relative aspect-square rounded-none overflow-hidden bg-white border border-[#EBE3D7] shadow-sm flex items-center justify-center p-4">
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-700 ease-out cursor-zoom-in"
              />

              {/* Discount Tag (e.g. 87% badge in Screenshot 2) */}
              {discountPercentage && (
                <span className="absolute top-4 left-4 px-2 py-0.5 rounded-none text-[11px] font-bold bg-[#DE6B48] text-white shadow-sm">
                  {discountPercentage}%
                </span>
              )}
            </div>

          </div>

          {/* Right Column: Details, Price, CTAs & Assurance (Matching Screenshot 2) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Title & Brand */}
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl text-stone-900 font-normal leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center space-x-3 mt-1.5 text-xs text-stone-500">
                <span>Brand: <strong className="text-stone-800 font-medium">Shiney Atelier</strong></span>
                <span>•</span>
                <div className="flex items-center text-amber-500 space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />
                  ))}
                  <span className="text-stone-600 text-[11px] ml-1">({product.reviewsCount} reviews)</span>
                </div>
                <span>•</span>
                <span className="text-emerald-700 font-medium text-[11px]">in stock</span>
              </div>
            </div>

            {/* Price Line (Matching Screenshot 2) */}
            <div className="flex items-baseline space-x-3 pt-1">
              <span className="font-serif text-3xl font-semibold text-stone-950">
                ${product.price.toFixed(2)}
              </span>
              {product.compareAtPrice && (
                <span className="text-sm text-stone-400 line-through">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-xs text-stone-600 font-light leading-relaxed">
              {product.shortDescription}
            </p>

            {/* Variant Selector (e.g. Ring Size) */}
            {product.variants && (
              <div className="space-y-1.5 pt-2 border-t border-stone-200">
                <span className="text-xs font-semibold text-stone-800">
                  {product.variantType === 'ring_size' ? 'Ring Size' : 'Options'}:
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      className={`px-3 py-1.5 text-xs rounded-none border transition-all ${
                        selectedVariant?.id === v.id
                          ? 'bg-[#12100E] text-[#EDDFBA] border-[#12100E]'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-[#C49D3E]'
                      }`}
                    >
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart & Stepper Row (Matching Screenshot 2) */}
            <div className="flex items-center space-x-3 pt-2">
              {/* Stepper */}
              <div className="flex items-center border border-stone-300 rounded-none bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-stone-600 hover:text-stone-950 text-sm"
                >
                  -
                </button>
                <span className="px-3 text-xs font-semibold text-stone-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-stone-600 hover:text-stone-950 text-sm"
                >
                  +
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-6 bg-[#12100E] hover:bg-stone-800 text-[#EDDFBA] font-semibold text-xs uppercase tracking-wider rounded-none shadow-sm transition-all"
              >
                {addedAnimation ? '✓ Added to Cart' : 'Add to cart'}
              </button>
            </div>

            {/* Wishlist & Compare Links (Matching Screenshot 2) */}
            <div className="flex items-center space-x-6 text-xs text-stone-600 pt-1">
              <button
                onClick={() => toggleWishlist(product.id)}
                className="flex items-center space-x-1.5 hover:text-stone-950"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#C49D3E] text-[#C49D3E]' : ''}`} />
                <span>Browse Wishlist</span>
              </button>
              <Link to="/wishlist" className="hover:text-stone-950">
                View Saved ({isInWishlist(product.id) ? '1' : '0'})
              </Link>
            </div>

            {/* Buy It Now Button (Matching Screenshot 2) */}
            <button
              onClick={handleBuyItNow}
              className="w-full py-3 border border-stone-900 hover:bg-stone-900 hover:text-white font-medium text-xs uppercase tracking-wider rounded-none transition-colors"
            >
              Buy It Now
            </button>

            {/* Feature Checkmarks (Matching Screenshot 2) */}
            <div className="space-y-1.5 pt-3 border-t border-stone-200 text-xs text-stone-600">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-[#C49D3E]" />
                <span>Free Shipping & Exchanges</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-[#C49D3E]" />
                <span>Flexible and secure payment, insured delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[#C49D3E]" />
                <span>600,000 happy patrons worldwide</span>
              </div>
            </div>

            {/* Safe & Secure Checkout Guarantee Badges (Matching Screenshot 2) */}
            <div className="p-4 rounded-none bg-stone-50 border border-stone-200 text-center space-y-2 mt-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Guarantee Safe & Secure Checkout
              </p>
              <div className="flex items-center justify-center space-x-3 text-stone-600 text-xs font-mono font-medium">
                <span className="px-2 py-1 bg-white border rounded-none">Stripe</span>
                <span className="px-2 py-1 bg-white border rounded-none">Visa / MC</span>
                <span className="px-2 py-1 bg-white border rounded-none">Apple Pay</span>
                <span className="px-2 py-1 bg-white border rounded-none">PayPal</span>
              </div>
            </div>

            {/* SKU & Category Meta */}
            <div className="text-[11px] text-stone-400 space-y-1 pt-2">
              <p>SKU: <span className="font-mono text-stone-600 uppercase">{product.id}</span></p>
              <p>Categories: <span className="text-stone-600">{product.categoryLabel}, Fine Heirlooms</span></p>
            </div>

          </div>

        </div>

        {/* Tabs: Description & Reviews (Matching Screenshot 2) */}
        <div className="mt-16 pt-10 border-t border-stone-200">
          <div className="flex space-x-8 border-b border-stone-200">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'description'
                  ? 'border-stone-900 text-stone-950'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Description
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 text-sm font-semibold uppercase tracking-wider transition-colors border-b-2 ${
                activeTab === 'reviews'
                  ? 'border-stone-900 text-stone-950'
                  : 'border-transparent text-stone-400 hover:text-stone-700'
              }`}
            >
              Reviews ({product.reviewsCount})
            </button>
          </div>

          <div className="py-6 text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-4xl">
            {activeTab === 'description' ? (
              <div className="space-y-4">
                <p>{product.description}</p>
                <div className="pt-2">
                  <h4 className="font-serif text-base font-semibold text-stone-900 mb-2">Key Benefits:</h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-stone-600">
                    <li>Essential, conflict-free hand-selected stones certified by GIA / IGI.</li>
                    <li>Solid recycled precious metal casting for lifetime resistance to wear and oxidation.</li>
                    <li>High-magnification stereoscopic microscope pavé mounting for seamless tactile smoothness.</li>
                    <li>Vitamins and antioxidants for metal luster: includes complimentary annual cleaning and inspection.</li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-white rounded-none border border-stone-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-stone-900">Elena Rostova</span>
                    <span className="text-[11px] text-stone-400">Verified Buyer</span>
                  </div>
                  <div className="flex text-amber-500 mb-1">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-500" />)}
                  </div>
                  <p className="text-xs text-stone-600">"The quality of the craftsmanship exceeded every expectation. The diamond sparkles with unbelievable brilliance."</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products Section (Matching Screenshot 1) */}
        <section className="mt-20 pt-16 border-t border-stone-200 text-center">
          <h2 className="font-serif text-3xl text-stone-950 font-normal">
            Related products
          </h2>
          <p className="text-xs text-stone-500 font-light mt-1 max-w-md mx-auto">
            Our jewelry is made by the finest artists and carefully selected to reflect your style and personality.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mt-8">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>

        {/* Subscribe to Our Newsletter (Matching Screenshot 1) */}
        <section className="mt-24 pt-16 border-t border-stone-200 text-center space-y-3 max-w-xl mx-auto">
          <h3 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-xs text-stone-500 font-light">
            Sign up to our newsletter for information on sales, delightful content and new additions to the collection.
          </p>
          {subscribed ? (
            <p className="text-xs font-semibold text-emerald-800 bg-emerald-50 py-2 rounded-none">
              Thank you for subscribing to Shiney updates!
            </p>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubscribed(true); }} className="flex gap-2 pt-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="flex-1 px-4 py-2.5 bg-white border border-stone-300 rounded-none text-xs focus:outline-none focus:border-[#C49D3E]"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none"
              >
                Subscribe
              </button>
            </form>
          )}
        </section>

      </div>

    </div>
  );
}
