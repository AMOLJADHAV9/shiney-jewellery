import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Clock, Calendar, User, Share2, Sparkles, ArrowRight } from 'lucide-react';
import { BLOG_POSTS } from '../data/blogPosts';
import { api } from '../services/api';

export default function BlogPostPage() {
  const { slug } = useParams();
  const localFallback = BLOG_POSTS.find((p) => p.slug === slug);
  const [post, setPost] = useState(localFallback);

  useEffect(() => {
    let isMounted = true;
    api.blog
      .getPostBySlug(slug)
      .then((data) => {
        if (isMounted && data) {
          setPost(data);
        }
      })
      .catch((err) => {
        console.warn('Backend single post fetch fallback:', err.message);
      });

    return () => { isMounted = false; };
  }, [slug]);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="font-serif text-3xl text-stone-900">Article Not Found</h1>
        <p className="text-sm text-stone-500 font-light">The requested journal article could not be located.</p>
        <Link
          to="/blog"
          className="inline-flex items-center px-6 py-2.5 bg-[#12100E] text-[#EDDFBA] text-xs font-semibold uppercase tracking-wider rounded-none"
        >
          Return to Blog
        </Link>
      </div>
    );
  }

  const relatedPosts = BLOG_POSTS.filter((p) => p.id !== post.id).slice(0, 3);

  return (
    <div className="bg-[#FAF8F5] text-stone-900 pb-24">
      
      {/* Breadcrumb Navigation */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-stone-500 flex items-center space-x-2 border-b border-stone-200/60">
        <Link to="/" className="hover:text-stone-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <Link to="/blog" className="hover:text-stone-900">Blog</Link>
        <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
        <span className="text-stone-800 font-medium truncate">{post.title}</span>
      </div>

      {/* Main Article Container */}
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        
        {/* Meta Header */}
        <div className="space-y-4 text-center">
          <span className="inline-block px-3 py-1 text-xs uppercase tracking-widest font-semibold bg-[#F6F0DD] text-[#846127] rounded-none border border-[#EDDFBA]">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-950 leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-xs text-stone-500 font-light">
            <span className="flex items-center">
              <User className="w-3.5 h-3.5 mr-1 text-[#C49D3E]" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#C49D3E]" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center">
              <Clock className="w-3.5 h-3.5 mr-1 text-[#C49D3E]" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/10] rounded-none overflow-hidden border border-[#DFD5C6] shadow-sm">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        {/* Content Body */}
        <div className="prose prose-stone max-w-none text-stone-700 font-light leading-relaxed space-y-5 text-sm sm:text-base">
          <p className="text-base sm:text-lg text-stone-900 font-serif italic border-l-2 border-[#C49D3E] pl-4 py-1 leading-relaxed">
            "{post.excerpt}"
          </p>

          {post.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Tags */}
        <div className="pt-6 border-t border-stone-200 flex flex-wrap items-center gap-2">
          <span className="text-xs uppercase tracking-wider font-semibold text-stone-400 mr-2">Tags:</span>
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs px-3 py-1 rounded-none bg-stone-100 text-stone-700 border border-stone-200">
              #{tag}
            </span>
          ))}
        </div>

        {/* Author Bio Box */}
        <div className="p-6 rounded-none bg-[#FCFBF9] border border-[#DFD5C6] shadow-sm flex items-center space-x-4">
          <div className="w-14 h-14 rounded-none bg-[#12100E] text-[#EDDFBA] flex items-center justify-center font-serif text-xl font-bold shrink-0">
            {post.author[0]}
          </div>
          <div>
            <h4 className="font-serif text-base font-semibold text-stone-900">{post.author}</h4>
            <p className="text-xs text-[#846127] font-medium">{post.authorRole}</p>
            <p className="text-xs text-stone-500 font-light mt-1">
              Contributing atelier editor sharing insights on gemstone provenance, metallurgy, and styling.
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="pt-4 text-center">
          <Link
            to="/blog"
            className="inline-flex items-center text-xs font-semibold uppercase tracking-wider text-stone-800 hover:text-[#846127]"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to All Journal Articles</span>
          </Link>
        </div>

      </article>

      {/* Related Reads */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 pt-16 border-t border-stone-200">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#846127]">
            More from the Atelier
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl text-stone-950 font-normal">
            Related Journal Stories
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedPosts.map((r) => (
            <Link
              key={r.id}
              to={`/blog/${r.slug}`}
              className="group bg-[#FCFBF9] rounded-none border border-[#DFD5C6] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                <img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#846127]">{r.category}</span>
                  <h4 className="font-serif text-base font-medium text-stone-900 group-hover:text-[#846127] transition-colors mt-1 line-clamp-2">
                    {r.title}
                  </h4>
                </div>
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 mt-3">
                  <span>{r.date}</span>
                  <span>{r.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
