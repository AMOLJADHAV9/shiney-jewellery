import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight, Sparkles, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
      setQuery('');
      setResults([]);
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Live query to Database API
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    const timer = setTimeout(() => {
      api.catalog.getProducts({ search: query.trim(), limit: 6 })
        .then((res) => {
          const items = res?.data || (Array.isArray(res) ? res : []);
          setResults(items);
        })
        .catch(() => setResults([]))
        .finally(() => setIsSearching(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const filteredProducts = results;

  const handleSelectProduct = (product) => {
    onClose();
    navigate(`/product/${product.slug}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onClose();
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Fine Jewellery"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/70 backdrop-blur-md transition-opacity"
    >
      <div
        className="w-full max-w-2xl bg-[#FCFBF9] text-stone-900 rounded-none shadow-2xl border border-[#DFD5C6] overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative border-b border-stone-200 p-4 flex items-center">
          <Search className="w-5 h-5 text-[#C49D3E] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by gemstone, material, ring size or collection..."
            className="w-full bg-transparent text-base sm:text-lg focus:outline-none placeholder:text-stone-400 font-serif tracking-wide"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 mr-2 text-stone-400 hover:text-stone-700"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-2.5 py-1 text-xs uppercase tracking-wider text-stone-500 hover:text-stone-900 border border-stone-200 rounded-none transition-colors"
          >
            Esc
          </button>
        </form>

        {/* Content Area */}
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {query.trim() === '' ? (
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-stone-400 mb-3 flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-[#C49D3E] mr-1.5" />
                Trending Searches
              </p>
              <div className="flex flex-wrap gap-2">
                {['Solitaire Diamonds', '18k Solid Gold', 'Bridal Crown Sets', 'Heart Lockets', 'Hammered Cuffs', 'Morganite Studs'].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term);
                      navigate(`/shop?search=${encodeURIComponent(term)}`);
                      onClose();
                    }}
                    className="text-xs px-3 py-1.5 rounded-none bg-stone-100 hover:bg-[#F6F0DD] text-stone-700 hover:text-[#846127] border border-stone-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Found {filteredProducts.length} handcrafted pieces
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredProducts.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectProduct(p)}
                    className="flex items-center p-2.5 rounded-none border border-stone-100 hover:border-[#D4B35F] hover:bg-[#FAF8F5] cursor-pointer transition-all group"
                  >
                    <img
                      src={(p.images && p.images[0]) || p.primaryImage || '/images/r1.jpg'}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded-none mr-3 shrink-0 border border-stone-200/60 group-hover:scale-105 transition-transform"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium font-serif text-stone-900 truncate group-hover:text-[#A7802F] transition-colors">
                        {p.name}
                      </p>
                      <p className="text-xs text-stone-500 truncate">{p.material}</p>
                      <p className="text-xs font-semibold text-[#846127] mt-0.5">${p.price.toLocaleString()} USD</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-2 text-center">
                <button
                  onClick={handleSearchSubmit}
                  className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-[#A7802F] hover:text-[#846127]"
                >
                  <span>View all results for "{query}"</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-stone-500">
              <p className="font-serif text-lg text-stone-800">No creations found matching "{query}"</p>
              <p className="text-xs text-stone-400 mt-1">Try searching for terms like "Diamond", "Gold", "Ring", or "Necklace".</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
