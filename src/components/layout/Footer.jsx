import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, CheckCircle2, Shield, Gem, MapPin, Mail, Phone } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please provide a valid client email address.');
      return;
    }
    setError('');
    setSubscribed(true);
  };

  return (
    <footer className="bg-[#0A0908] text-stone-300 border-t border-[#C49D3E]/20 relative overflow-hidden">
      {/* Subtle background ambient gold accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#C49D3E]/5 blur-3xl pointer-events-none" />

      {/* VIP Newsletter Strip */}
      <div className="border-b border-[#26221F] py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center space-x-2 text-[#D4B35F] text-xs uppercase tracking-[0.3em] font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Private Salon Register</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h3 className="font-serif text-2xl sm:text-4xl text-stone-100 font-normal tracking-wide">
            Receive Private Previews & Curated Atelier Stories
          </h3>
          <p className="text-sm text-stone-400 max-w-xl mx-auto font-light leading-relaxed">
            Subscribe to our confidential circle for early invitations to limited high jewellery unveilings and bespoke gemstone salon events.
          </p>

          <div className="max-w-md mx-auto pt-2">
            {subscribed ? (
              <div className="flex items-center justify-center space-x-2 text-[#EDDFBA] bg-[#1A1715] p-3 rounded-none border border-[#C49D3E]/40 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-[#D4B35F]" />
                <span className="text-xs tracking-wider">Welcome to the Private Circle. Your invitation has been dispatched.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex rounded-none shadow-sm border border-stone-700 focus-within:border-[#D4B35F] overflow-hidden bg-[#12100E]">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="flex-1 px-4 py-3 bg-transparent text-sm text-stone-100 placeholder-stone-500 focus:outline-none"
                    aria-label="Email address for private salon newsletter"
                  />
                  <button
                    type="submit"
                    className="px-6 bg-[#C49D3E] hover:bg-[#DFB868] text-stone-950 font-semibold text-xs uppercase tracking-wider transition-colors flex items-center justify-center"
                  >
                    <span>Join</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
                {error && <p className="text-xs text-rose-400 text-left">{error}</p>}
                <p className="text-[10px] text-stone-500 text-center font-light">
                  We respect your privacy. Unsubscribe at any time with one click.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif tracking-[0.25em] text-2xl font-normal uppercase text-stone-100">
                Shiney
              </span>
              <span className="block text-[8px] uppercase tracking-[0.45em] text-[#C49D3E] font-medium -mt-1">
                Haute Joaillerie
              </span>
            </Link>
            <p className="text-xs text-stone-400 font-light leading-relaxed max-w-sm">
              Shiney represents the pinnacle of ethical modern jewellery artistry. Combining sustainably recovered precious metals, conflict-free certified gemstones, and master craftsmanship honed over generations.
            </p>
            <div className="flex items-center space-x-6 text-xs text-[#D4B35F] pt-2">
              <div className="flex items-center space-x-1.5">
                <Gem className="w-4 h-4" />
                <span>Ethically Sourced</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Shield className="w-4 h-4" />
                <span>Lifetime Warranty</span>
              </div>
            </div>
          </div>

          {/* Department Links */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-100 font-serif">
              Collections
            </h4>
            <ul className="space-y-2 text-xs font-light text-stone-400">
              <li><Link to="/shop?category=rings" className="hover:text-[#EDDFBA] transition-colors">Solitaire & Eternity Rings</Link></li>
              <li><Link to="/shop?category=necklaces" className="hover:text-[#EDDFBA] transition-colors">Pavé Lockets & Pendants</Link></li>
              <li><Link to="/shop?category=earrings" className="hover:text-[#EDDFBA] transition-colors">Chandelier & Stud Earrings</Link></li>
              <li><Link to="/shop?category=bangles" className="hover:text-[#EDDFBA] transition-colors">Hammered Cuffs & Bangles</Link></li>
              <li><Link to="/shop?category=bridal" className="hover:text-[#EDDFBA] transition-colors">Bridal Heirlooms & Sets</Link></li>
              <li><Link to="/shop?category=gifts" className="hover:text-[#EDDFBA] transition-colors">Curated Anniversary Gifts</Link></li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-100 font-serif">
              Client Concierge
            </h4>
            <ul className="space-y-2 text-xs font-light text-stone-400">
              <li><Link to="/about" className="hover:text-[#EDDFBA] transition-colors">The Atelier Story</Link></li>
              <li><Link to="/contact" className="hover:text-[#EDDFBA] transition-colors">Book Private Appointment</Link></li>
              <li><Link to="/contact" className="hover:text-[#EDDFBA] transition-colors">Complimentary Ring Sizer</Link></li>
              <li><Link to="/contact" className="hover:text-[#EDDFBA] transition-colors">Care & Maintenance</Link></li>
              <li><Link to="/contact" className="hover:text-[#EDDFBA] transition-colors">Insured Shipping & Returns</Link></li>
              <li><Link to="/contact" className="hover:text-[#EDDFBA] transition-colors">Bespoke Monogramming</Link></li>
            </ul>
          </div>

          {/* Salons & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-stone-100 font-serif">
              Flagship Salons
            </h4>
            <div className="space-y-2.5 text-xs font-light text-stone-400">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#C49D3E] shrink-0 mt-0.5" />
                <span>Bond Street, Mayfair, London W1S</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#C49D3E] shrink-0 mt-0.5" />
                <span>Place Vendôme, 75001 Paris</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-[#C49D3E] shrink-0 mt-0.5" />
                <span>Madison Avenue, New York, NY 10021</span>
              </div>
              <div className="pt-2 text-stone-500 text-[11px]">
                <p>Private Salon: +1 (800) 744-6391</p>
                <p>Daily: 10:00 AM – 7:00 PM EST</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="mt-14 pt-8 border-t border-[#1C1715] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 font-light space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Shiney Haute Joaillerie Ltd. All Rights Reserved.</p>
          <div className="flex items-center space-x-6 text-[11px]">
            <Link to="/about" className="hover:text-stone-300 transition-colors">Privacy Notice</Link>
            <Link to="/about" className="hover:text-stone-300 transition-colors">Terms of Atelier</Link>
            <Link to="/about" className="hover:text-stone-300 transition-colors">Ethical Gemstone Code</Link>
            <span className="text-[#C49D3E]">Currency: USD ($)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
