import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Sparkles, HelpCircle, ShieldCheck, Truck, RotateCcw, Gem } from 'lucide-react';

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqCategories = [
    {
      category: 'Orders & Bespoke Commissions',
      items: [
        {
          q: 'How long does a bespoke diamond commission take?',
          a: 'Bespoke commissions typically take 3 to 5 weeks from initial CAD sketch and gemstone selection to final master goldsmith forging and hallmarking.'
        },
        {
          q: 'Can I choose my own certified diamond or gemstone?',
          a: 'Yes, our master gemologists work directly with you via private salon or 4K virtual consultation to review GIA and IGI certified diamonds, rare Ceylon sapphires, and Colombian emeralds.'
        },
        {
          q: 'Can I cancel or modify my fine jewelry order?',
          a: 'Orders can be modified within 24 hours of placement. Since our pieces are hand-forged in limited batches, please contact client concierge promptly.'
        }
      ]
    },
    {
      category: 'Shipping, Transit Insurance & Delivery',
      items: [
        {
          q: 'How are high jewelry shipments secured in transit?',
          a: 'All orders over $250 are dispatched via armored courier services (Brink’s / FedEx Custom Critical) in discreet, unbranded tamper-evident security vault packaging. Direct adult signature and photo ID are mandatory upon delivery.'
        },
        {
          q: 'Do you deliver internationally?',
          a: 'We provide complimentary insured worldwide delivery to over 75 countries, with all import duties and customs clearances fully pre-arranged.'
        },
        {
          q: 'What is your complimentary ring resizing policy?',
          a: 'Every ring purchase includes one complimentary professional ring resizing within 30 days of receipt.'
        }
      ]
    },
    {
      category: 'Metals, Authenticity & Lifetime Care',
      items: [
        {
          q: 'What precious metals are used in Shiney jewelry?',
          a: 'We exclusively refine 100% recycled 18k solid yellow gold, 18k rose gold, and 950 platinum. We never use base metal fillers or flash-plating on our fine jewelry collections.'
        },
        {
          q: 'What does the Lifetime Atelier Warranty cover?',
          a: 'Our lifetime warranty includes complimentary annual ultrasonic deep cleaning, prong retightening, scratch buffing, and clasp inspection.'
        }
      ]
    }
  ];

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-900 pb-24">
      
      {/* Top Banner */}
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
            Frequently Asked Questions
          </h1>
          <div className="flex items-center justify-center space-x-2 text-xs tracking-widest uppercase font-semibold text-[#D4B35F]">
            <Link to="/" className="hover:text-stone-100 transition-colors">Homepage</Link>
            <span>&gt;</span>
            <span className="text-stone-300">FAQ</span>
          </div>
        </div>
      </section>

      {/* Main FAQ Container */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="space-y-10">
          {faqCategories.map((group, gIdx) => (
            <div key={gIdx} className="bg-[#FCFBF9] p-6 sm:p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-4">
              <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-950 pb-2 border-b border-stone-200">
                {group.category}
              </h2>
              <div className="space-y-3">
                {group.items.map((item, idx) => {
                  const uniqueKey = `${gIdx}-${idx}`;
                  const isOpen = openIndex === uniqueKey;
                  return (
                    <div key={idx} className="border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                      <button
                        onClick={() => setOpenIndex(isOpen ? null : uniqueKey)}
                        className="w-full text-left flex justify-between items-center text-sm font-semibold text-stone-800 hover:text-[#846127] transition-colors py-1"
                      >
                        <span>{item.q}</span>
                        <ChevronDown className={`w-4 h-4 text-[#C49D3E] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <p className="text-xs sm:text-sm text-stone-600 font-light mt-2 leading-relaxed animate-in fade-in">
                          {item.a}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Assistance Card */}
        <div className="mt-12 p-8 rounded-none bg-gradient-to-r from-[#141211] to-[#1F1B18] text-stone-100 text-center space-y-3 border border-[#C49D3E]/30 shadow-lg">
          <Sparkles className="w-6 h-6 text-[#D4B35F] mx-auto" />
          <h3 className="font-serif text-2xl font-normal text-stone-100">Still Require Assistance?</h3>
          <p className="text-xs sm:text-sm text-stone-300 font-light max-w-md mx-auto">
            Our private salon consultants are on hand to answer questions or arrange a bespoke gemstone viewing.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center px-6 py-2.5 bg-[#C49D3E] text-stone-950 hover:bg-[#DFB868] text-xs font-semibold uppercase tracking-wider rounded-none"
            >
              Contact Client Concierge
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
