import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    api.catalog.getProducts({ limit: 100 })
      .then((res) => {
        const items = res?.data || (Array.isArray(res) ? res : []);
        setAllProducts(items);
      })
      .catch(() => setAllProducts([]));
  }, []);

  const wishlistedProducts = allProducts.filter((p) => wishlist.includes(p.id) || wishlist.includes(p.slug) || wishlist.includes(p.sku));

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-900 pb-24">
      
      {/* Banner */}
      <section className="bg-gradient-to-b from-[#141211] to-[#0A0908] text-stone-100 py-16 px-4 sm:px-6 lg:px-8 border-b border-[#C49D3E]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#D4B35F]">
            Saved For Later
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-100">
            Your Private Wishlist
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-light max-w-md mx-auto">
            {wishlistedProducts.length} cherished fine jewellery {wishlistedProducts.length === 1 ? 'piece' : 'pieces'} saved to your personal portfolio.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {wishlistedProducts.length === 0 ? (
          <div className="max-w-md mx-auto py-20 text-center space-y-4 bg-[#FCFBF9] p-8 rounded-none border border-stone-200 shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-none bg-[#F0EAE0] flex items-center justify-center text-[#C49D3E]">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-serif text-2xl text-stone-900 font-medium">Your Wishlist is Empty</h2>
            <p className="text-xs text-stone-500 font-light leading-relaxed">
              Click the heart icon on any solitaire ring, gold necklace, or bracelet to save it to your private portfolio.
            </p>
            <div className="pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center px-6 py-3 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none"
              >
                <span>Discover Creations</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlistedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-[#FCFBF9] rounded-none border border-[#DFD5C6] overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <Link to={`/product/${product.slug}`}>
                    <img src={(product.images && product.images[0]) || product.primaryImage || '/images/r1.jpg'} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                  </Link>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute top-3 right-3 p-2 rounded-none bg-white/90 text-stone-700 hover:text-rose-600 shadow-sm"
                    title="Remove from Wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#846127]">
                      {product.categoryLabel}
                    </span>
                    <Link to={`/product/${product.slug}`} className="block font-serif text-base font-medium text-stone-900 hover:text-[#846127] truncate mt-0.5">
                      {product.name}
                    </Link>
                    <p className="font-serif text-base font-semibold text-stone-950 mt-1">
                      ${product.price.toLocaleString()} USD
                    </p>
                  </div>

                  <div className="pt-4 mt-3 border-t border-stone-100">
                    <button
                      onClick={() => addToCart(product, product.variants ? product.variants[0] : null, 1)}
                      className="w-full py-2.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#C49D3E]" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
