import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, Sparkles, Clock, Calendar, User, BookOpen } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { api } from '../services/api';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [posts, setPosts] = useState(BLOG_POSTS);

  const categories = ['All', 'Accessories', 'Diamonds', 'Earrings', 'Gifts Set', 'Necklaces & Pendants', 'Pearls', 'Rings', 'Wedding'];

  useEffect(() => {
    api.blog
      .getPosts({ category: selectedCategory !== 'All' ? selectedCategory : undefined })
      .then((res) => {
        if (res && Array.isArray(res.data) && res.data.length > 0) {
          setPosts(res.data);
        }
      })
      .catch((err) => {
        console.warn('Backend blog fetch fallback:', err.message);
      });
  }, [selectedCategory]);

  const filteredPosts = posts;

  return (
    <div className="bg-[#FAF8F5] text-stone-900 pb-24">
      
      {/* Top Banner with Showroom Backdrop (Matching Screenshot 4) */}
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
            Blog
          </h1>
          <div className="flex items-center justify-center space-x-2 text-xs tracking-widest uppercase font-semibold text-[#D4B35F]">
            <Link to="/" className="hover:text-stone-100 transition-colors">Homepage</Link>
            <span>&gt;</span>
            <span className="text-stone-300">Blog</span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 pb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-4 py-2 rounded-none font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-[#12100E] text-[#EDDFBA] shadow-sm'
                  : 'bg-[#FCFBF9] text-stone-600 hover:text-stone-900 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4-Column Editorial Articles Grid (Matching Screenshot 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-[#FCFBF9] rounded-none border border-[#DFD5C6] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col group"
            >
              {/* Article Featured Image */}
              <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/11] overflow-hidden bg-stone-100">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider bg-[#12100E]/80 text-[#EDDFBA] rounded-none backdrop-blur-sm">
                  {post.category}
                </span>
              </Link>

              {/* Card Meta & Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center space-x-2 text-[11px] text-stone-400 mb-2">
                    <span className="uppercase tracking-wider font-semibold text-[#846127]">
                      {post.category}
                    </span>
                    <span>—</span>
                    <span>{post.date}</span>
                  </div>

                  <Link to={`/blog/${post.slug}`} className="block">
                    <h2 className="font-serif text-lg font-medium text-stone-900 group-hover:text-[#846127] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-stone-500 font-light mt-2 line-clamp-3 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-100 flex items-center justify-between">
                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-[#846127] transition-colors group/link"
                  >
                    <span>Read More</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                  <span className="text-[11px] text-stone-400 font-light flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-[#C49D3E]" />
                    {post.readTime}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>

      {/* Newsletter Subscription Strip (Matching Screenshot 1) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 text-center space-y-4 pt-16 border-t border-stone-200">
        <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#846127]">
          Curated Updates
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 font-light max-w-lg mx-auto">
          Sign up to our newsletter for information on sales, delightful content and new additions to the collection.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); alert('Thank you for subscribing to the Shiney atelier newsletter.'); }} className="max-w-md mx-auto pt-3 flex gap-2">
          <input
            type="email"
            placeholder="Your email address"
            required
            className="flex-1 px-4 py-3 bg-white border border-stone-300 rounded-none text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C49D3E]"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
          >
            Subscribe
          </button>
        </form>
      </section>

    </div>
  );
}
