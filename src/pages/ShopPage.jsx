import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, SlidersHorizontal, LayoutGrid, List, RotateCcw, X } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/ui/ProductCard';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParam);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(4000);
  const [appliedMinPrice, setAppliedMinPrice] = useState(0);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(4000);
  const [selectedCarat, setSelectedCarat] = useState('all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (categoryParam) setSelectedCategory(categoryParam);
    if (searchParam) setSearchQuery(searchParam);
  }, [categoryParam, searchParam]);

  const categories = [
    { id: 'all', name: 'All Curations', count: PRODUCTS.length },
    { id: 'rings', name: 'Rings', count: PRODUCTS.filter((p) => p.category === 'rings').length },
    { id: 'necklaces', name: 'Necklaces & Pendants', count: PRODUCTS.filter((p) => p.category === 'necklaces').length },
    { id: 'earrings', name: 'Earrings', count: PRODUCTS.filter((p) => p.category === 'earrings').length },
    { id: 'bangles', name: 'Bangles & Cuffs', count: PRODUCTS.filter((p) => p.category === 'bangles').length },
    { id: 'bridal', name: 'Bridal & Wedding', count: PRODUCTS.filter((p) => p.category === 'bridal').length },
    { id: 'gifts', name: 'Gifts Set', count: PRODUCTS.filter((p) => p.category === 'gifts').length },
  ];

  const carats = ['All Carats', '10KT', '14KT', '18KT', '22KT', '24KT'];
  const brands = ['All Brands', 'Shiney Atelier', 'Olight Collection', 'Gordon Fine Arts'];

  const handleApplyPriceFilter = (e) => {
    e.preventDefault();
    setAppliedMinPrice(Number(minPrice) || 0);
    setAppliedMaxPrice(Number(maxPrice) || 4000);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(4000);
    setAppliedMinPrice(0);
    setAppliedMaxPrice(4000);
    setSelectedCarat('all');
    setSelectedBrand('all');
    setSortBy('featured');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCat = p.category.toLowerCase().includes(q);
        const matchesMat = p.material.toLowerCase().includes(q);
        if (!matchesName && !matchesCat && !matchesMat) return false;
      }
      if (p.price < appliedMinPrice || p.price > appliedMaxPrice) return false;
      if (selectedCarat !== 'all') {
        if (!p.material.toLowerCase().includes(selectedCarat.toLowerCase())) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedCategory, searchQuery, appliedMinPrice, appliedMaxPrice, selectedCarat, sortBy]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-900 pb-24">
      
      {/* Top Banner with Showroom Backdrop (Matching Screenshot 3) */}
      <section className="relative py-20 sm:py-24 bg-[#0A0908] text-stone-100 overflow-hidden text-center border-b border-[#C49D3E]/20">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=1800&auto=format&fit=crop&q=80"
            alt="Jewellery Showroom Showcase"
            className="w-full h-full object-cover opacity-35 blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/70 to-[#0A0908]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-3">
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-100 tracking-tight">
            Shop
          </h1>
          <div className="flex items-center justify-center space-x-2 text-xs tracking-widest uppercase font-semibold text-[#D4B35F]">
            <Link to="/" className="hover:text-stone-100 transition-colors">Homepage</Link>
            <span>&gt;</span>
            <span className="text-stone-300">Shop</span>
          </div>
        </div>
      </section>

      {/* Main Catalog Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Top Bar with View Mode and Result Count (Matching Screenshot 3) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden inline-flex items-center space-x-2 px-3 py-1.5 bg-stone-900 text-[#EDDFBA] text-xs font-semibold uppercase rounded-none"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters</span>
            </button>
            <div className="hidden sm:flex items-center space-x-1 border border-stone-300 rounded-none p-1 bg-white">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1 rounded-none ${viewMode === 'grid' ? 'bg-stone-900 text-white' : 'text-stone-500'}`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1 rounded-none ${viewMode === 'list' ? 'bg-stone-900 text-white' : 'text-stone-500'}`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <span className="text-xs text-stone-500 font-light">
              Showing 1-{filteredProducts.length} of {PRODUCTS.length} results
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-stone-500 font-light">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-stone-300 rounded-none text-xs py-1.5 px-3 text-stone-800 focus:outline-none"
            >
              <option value="featured">Featured Curations</option>
              <option value="newest">New Arrivals</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>

        {/* Catalog Grid: Left Sidebar + Product Cards (Matching Screenshot 3) */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          
          {/* Left Sidebar (Matching Screenshot 3) */}
          <aside className="hidden lg:block space-y-8 pr-6 border-r border-stone-200">
            
            {/* Search Input Box */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-3 pr-9 py-2.5 bg-white border border-stone-300 rounded-none text-xs placeholder-stone-400 focus:outline-none focus:border-[#C49D3E]"
              />
              <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
            </div>

            {/* Categories with Count (Matching Screenshot 3) */}
            <div>
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 mb-3 pb-1 border-b border-stone-200">
                Categories
              </h3>
              <ul className="space-y-2 text-xs">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full flex justify-between items-center transition-colors ${
                        selectedCategory === cat.id ? 'text-[#846127] font-semibold' : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-stone-400 font-light">({cat.count})</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Filter By Price (Matching Screenshot 3 with inputs and Filter button) */}
            <div>
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 mb-3 pb-1 border-b border-stone-200">
                Filter By Price
              </h3>
              <form onSubmit={handleApplyPriceFilter} className="space-y-3 text-xs">
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-none text-center text-xs"
                  />
                  <span className="text-stone-400">-</span>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded-none text-center text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-[#EDDFBA] font-semibold text-xs uppercase tracking-wider rounded-none"
                >
                  Filter
                </button>
              </form>
            </div>

            {/* Carats Filter (Matching Screenshot 3: 10KT, 14KT, 18KT, 22KT, 24KT) */}
            <div>
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wider text-stone-900 mb-3 pb-1 border-b border-stone-200">
                Carats
              </h3>
              <div className="space-y-2 text-xs">
                {carats.map((c) => (
                  <label key={c} className="flex items-center space-x-2 text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="carats"
                      checked={selectedCarat === (c === 'All Carats' ? 'all' : c)}
                      onChange={() => setSelectedCarat(c === 'All Carats' ? 'all' : c)}
                      className="text-[#C49D3E]"
                    />
                    <span>{c}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Reset All Filters Button */}
            <button
              onClick={handleResetFilters}
              className="text-xs text-[#846127] hover:underline flex items-center font-medium pt-2"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" />
              Reset All Filters
            </button>

          </aside>

          {/* Right Product Grid (Clean cards matching Screenshot 3) */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center bg-[#FCFBF9] rounded-none border border-stone-200 p-8 space-y-3">
                <h3 className="font-serif text-2xl text-stone-900">No creations found</h3>
                <p className="text-xs text-stone-500 font-light">Try expanding your price range or clearing selected filters.</p>
                <button onClick={handleResetFilters} className="px-5 py-2 bg-stone-900 text-[#EDDFBA] text-xs uppercase font-semibold rounded-none">
                  Reset
                </button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? "grid grid-cols-2 md:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>

        </div>

      </div>

    </div>
  );
}
