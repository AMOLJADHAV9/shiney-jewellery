import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, ShieldCheck, Sparkles, Award, Heart, CheckCircle2, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-[#FAF8F5] text-stone-900 pb-24">
      
      {/* Editorial Hero Banner */}
      <section className="relative py-24 sm:py-32 bg-[#0A0908] text-stone-100 overflow-hidden text-center">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544441893-675973e31985?w=1800&auto=format&fit=crop&q=80"
            alt="The Shiney Jewellery Atelier"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0908] via-[#0A0908]/60 to-[#0A0908]" />
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-none bg-[#1A1715] border border-[#C49D3E]/30 text-xs uppercase tracking-[0.3em] font-semibold text-[#D4B35F]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>The Atelier Ethos</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-normal text-stone-100 leading-tight">
            Handcrafted Artistry, <br />
            <span className="italic text-[#D4B35F]">Eternal By Design</span>
          </h1>
          <p className="text-sm sm:text-base text-stone-300 font-light max-w-xl mx-auto leading-relaxed">
            Founded with a singular dedication: to harmonize historic European goldsmithing techniques with modern ethical responsibility.
          </p>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#846127]">
              Our Heritage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal leading-tight">
              Where Ancient Metallurgy Meets Contemporary Soul
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Every creation begins not on an assembly line, but on the jeweler’s wooden bench. In an era dominated by mass production, Shiney preserves the meticulous discipline of hand-piercing, hand-hammering, and optical micro-pavé setting.
            </p>
            <p className="text-xs sm:text-sm text-stone-600 font-light leading-relaxed">
              Each jewel requires anywhere from 40 to 140 hours of dedicated artisan labor. We believe that fine jewellery is not merely an ornament; it is a wearable archive of personal triumphs, whispered vows, and enduring love.
            </p>
          </div>

          <div className="relative rounded-none overflow-hidden shadow-lg border border-[#DFD5C6] aspect-[4/5]">
            <img
              src="https://images.unsplash.com/photo-1611591475155-426c045b4c7f?w=900&auto=format&fit=crop&q=80"
              alt="Artisan at Jeweller Bench"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* The 3 Pillars of Shiney */}
      <section className="bg-gradient-to-b from-[#FAF8F5] via-[#F4EFE8] to-[#FAF8F5] py-20 border-y border-[#EBE3D7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-16">
            <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#846127]">
              Uncompromising Standards
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal">
              Our Ethical Commitments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#FCFBF9] p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-none bg-[#F6F0DD] flex items-center justify-center text-[#846127]">
                <Gem className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-stone-900">100% Conflict-Free Diamonds</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                All natural diamonds adhere strictly to the Kimberley Process, while our lab-grown alternatives are created using 100% renewable solar and hydro energy.
              </p>
            </div>

            <div className="bg-[#FCFBF9] p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-none bg-[#F6F0DD] flex items-center justify-center text-[#846127]">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-stone-900">Recycled 18k Solid Gold</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                We exclusively refine certified recycled gold and 950 platinum, eliminating the environmental devastation associated with virgin gold extraction without compromising purity.
              </p>
            </div>

            <div className="bg-[#FCFBF9] p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-none bg-[#F6F0DD] flex items-center justify-center text-[#846127]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl font-medium text-stone-900">Lifetime Atelier Warranty</h3>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Every client enjoys lifetime annual prong retightening, professional ultrasonic cleaning, and scratch buffing to ensure your heirlooms never lose their radiance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Jewellery Care Guide */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase tracking-[0.3em] font-semibold text-[#846127]">
            Preserving Brilliance
          </span>
          <h2 className="font-serif text-3xl text-stone-950 font-normal">
            Haute Joaillerie Care & Maintenance
          </h2>
        </div>

        <div className="bg-[#FCFBF9] p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-4 text-xs text-stone-600 font-light leading-relaxed divide-y divide-stone-200">
          <div className="pt-3 first:pt-0">
            <h4 className="font-serif text-base font-semibold text-stone-900 mb-1">Daily Wear Guidelines</h4>
            <p>Always put on your fine jewellery as the final step after perfumes, hairsprays, and lotions have dried. Precious metals and natural gems are sensitive to chemical films.</p>
          </div>
          <div className="pt-4">
            <h4 className="font-serif text-base font-semibold text-stone-900 mb-1">Cleaning at Home</h4>
            <p>Soak your pieces in lukewarm water with a few drops of mild chemical-free soap for 10 minutes. Gently brush around prongs with an extra-soft baby toothbrush, rinse thoroughly, and pat dry with our archival microfiber cloth.</p>
          </div>
          <div className="pt-4">
            <h4 className="font-serif text-base font-semibold text-stone-900 mb-1">Archival Storage</h4>
            <p>Store each piece individually in your Shiney silk-lined presentation pouch or jewel chest to prevent diamonds from scratching softer precious metals or neighboring stones.</p>
          </div>
        </div>

        <div className="text-center pt-6">
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-3.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
          >
            <span>Discover The Collections</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </section>

    </div>
  );
}
