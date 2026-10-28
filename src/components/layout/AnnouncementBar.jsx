import React, { useState, useEffect } from 'react';
import { Sparkles, X, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ANNOUNCEMENTS = [
  { text: 'Complimentary Insured Delivery on orders over $250', link: '/shop', linkText: 'Explore Now' },
  { text: 'Autumn Haute Joaillerie Showcase now unveiling', link: '/shop?category=bridal', linkText: 'View Bridal' },
  { text: 'Bespoke Atelier: Complimentary Monogram Engraving this week', link: '/about', linkText: 'Learn More' },
];

export default function AnnouncementBar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isVisible]);

  if (!isVisible) return null;

  const current = ANNOUNCEMENTS[currentIndex];

  return (
    <div
      role="region"
      aria-label="Announcements"
      className="bg-[#12100E] text-[#EDDFBA] text-xs py-2 px-4 border-b border-[#C49D3E]/20 relative z-50 overflow-hidden transition-all duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Decorative Star */}
        <div className="hidden sm:flex items-center space-x-1.5 text-[#D4B35F]">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span className="tracking-widest uppercase text-[10px] font-semibold text-[#DFB868]">Atelier Privé</span>
        </div>

        {/* Center Rotating Message */}
        <div className="flex-1 text-center flex items-center justify-center space-x-2">
          <span className="font-light tracking-wide text-stone-200">{current.text}</span>
          <Link
            to={current.link}
            className="inline-flex items-center text-[#D4B35F] hover:text-[#EDDFBA] underline underline-offset-2 font-medium transition-colors ml-1"
          >
            <span>{current.linkText}</span>
            <ChevronRight className="w-3 h-3 ml-0.5" />
          </Link>
        </div>

        {/* Right close button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss announcement"
            className="text-stone-400 hover:text-stone-100 p-1 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
