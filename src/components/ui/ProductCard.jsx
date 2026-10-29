import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist, addToCart } = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [justAdded, setJustAdded] = useState(false);

  const isFavorited = isInWishlist(product.id);
  const primaryImg = (product.images && product.images[0]) || product.primaryImage || '/images/r1.jpg';
  const secondaryImage = (product.images && product.images[1]) || primaryImg;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // If the product has multiple variants, select the first available variant by default
    const defaultVariant = product.variants ? product.variants.find((v) => v.inStock) : null;
    addToCart(product, defaultVariant, 1);
    
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative bg-[#FCFBF9] rounded-none border border-[#EBE3D7] hover:border-[#D4B35F]/60 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col overflow-hidden"
    >
      {/* Image Container with Hover Swap & Badges */}
      <Link
        to={`/product/${product.slug}`}
        className="relative block aspect-square overflow-hidden bg-stone-100 rounded-none"
        onMouseEnter={() => setImageIndex(1)}
        onMouseLeave={() => setImageIndex(0)}
      >
        <img
          src={imageIndex === 1 ? secondaryImage : primaryImg}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out rounded-none"
          loading="lazy"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.compareAtPrice && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none bg-rose-900/90 text-rose-100 backdrop-blur-sm shadow-sm">
              Save ${(product.compareAtPrice - product.price).toLocaleString()}
            </span>
          )}
          {product.newArrival && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-none bg-[#12100E]/85 text-[#EDDFBA] backdrop-blur-sm">
              New In
            </span>
          )}
          {product.bestSeller && (
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-none bg-[#C49D3E] text-stone-950 backdrop-blur-sm shadow-sm">
              Bestseller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label={isFavorited ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          className="absolute top-3 right-3 p-2 rounded-none bg-white/80 hover:bg-white text-stone-700 hover:text-stone-900 backdrop-blur-md shadow-sm transition-all z-10"
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-[#C49D3E] text-[#C49D3E]' : ''}`} />
        </button>

        {/* Quick Add Overlay on Desktop Hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:block">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 rounded-none text-xs font-semibold uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-lg ${
              justAdded
                ? 'bg-emerald-800 text-white'
                : 'bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800'
            }`}
          >
            {justAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#C49D3E]" />
                <span>Quick Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Card Info Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
            <span className="uppercase tracking-widest text-[10px] font-semibold text-[#846127]">
              {product.categoryLabel}
            </span>
            <div className="flex items-center text-amber-600 space-x-1">
              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
              <span className="text-[11px] font-medium text-stone-700">{product.rating}</span>
              <span className="text-[10px] text-stone-400">({product.reviewsCount})</span>
            </div>
          </div>

          {/* Product Name */}
          <Link
            to={`/product/${product.slug}`}
            className="block font-serif text-base sm:text-lg text-stone-900 hover:text-[#846127] font-medium line-clamp-1 transition-colors"
          >
            {product.name}
          </Link>

          {/* Material description */}
          <p className="text-xs text-stone-500 line-clamp-1 mt-1 font-light">
            {product.gemstone ? `${product.gemstone} • ` : ''}{product.material}
          </p>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="font-serif text-base sm:text-lg font-semibold text-stone-900">
              ${product.price.toLocaleString()}
            </span>
            {product.compareAtPrice && (
              <span className="text-xs text-stone-400 line-through">
                ${product.compareAtPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="sm:hidden p-2 rounded-none bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800"
            aria-label={`Add ${product.name} to bag`}
          >
            {justAdded ? <Check className="w-4 h-4 text-emerald-400" /> : <ShoppingBag className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}
