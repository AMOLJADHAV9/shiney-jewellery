import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Search, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-[80vh] flex items-center justify-center text-stone-900 px-4 py-24">
      <div className="max-w-xl mx-auto text-center space-y-6 bg-[#FCFBF9] p-8 sm:p-12 rounded-none border border-[#DFD5C6] shadow-sm">
        
        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#846127]">
          Error 404 • Page Not Located
        </span>

        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-950">
          The Vault is Silent
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed max-w-md mx-auto">
          The exquisite creation or page you are seeking may have been retired to our private archival vaults, or the web address has shifted.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none"
          >
            <Home className="w-3.5 h-3.5 mr-1.5" />
            <span>Return to Homepage</span>
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-stone-300 text-stone-800 hover:text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-none"
          >
            <span>Browse Collections</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>

        <div className="pt-6 border-t border-stone-200 text-xs text-stone-400">
          <p>Looking for a specific diamond solitaire, chain, or bridal set?</p>
          <div className="flex justify-center space-x-4 mt-2 text-[#846127] font-medium">
            <Link to="/shop?category=rings" className="hover:underline">Rings</Link>
            <span>•</span>
            <Link to="/shop?category=necklaces" className="hover:underline">Necklaces</Link>
            <span>•</span>
            <Link to="/shop?category=earrings" className="hover:underline">Earrings</Link>
            <span>•</span>
            <Link to="/shop?category=bridal" className="hover:underline">Bridal Sets</Link>
          </div>
        </div>

      </div>
    </div>
  );
}
