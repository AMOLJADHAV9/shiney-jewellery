import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock, CheckCircle2, ChevronDown, Sparkles, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'bespoke',
    salon: 'london',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid client email required';
    if (!formData.message.trim()) errs.message = 'Please provide details for your inquiry';
    
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitted(true);
    }
  };

  const faqs = [
    {
      q: 'How do I request a complimentary ring sizer?',
      a: 'We gladly dispatch our physical metal ring sizer worldwide free of charge. Simply submit your mailing address through this form selecting "Ring Sizing Consultation" as your subject.'
    },
    {
      q: 'What is your insured shipping protocol?',
      a: 'All orders over $250 are dispatched via discreet armoured courier (Brink’s / FedEx Custom Critical) with signature verification required upon delivery. Outer cartons are unbranded for privacy and security.'
    },
    {
      q: 'Can I book a private salon appointment?',
      a: 'Yes, our private salons in London Mayfair, Paris Place Vendôme, and New York Madison Avenue are available for private appointments. You can also reserve a private 4K video session with our master gemologists.'
    },
    {
      q: 'What is your exchange and resizing policy?',
      a: 'We offer 30-day complimentary exchanges and one complimentary ring resizing within the first 30 days of receipt on all non-custom engraved pieces.'
    }
  ];

  return (
    <div className="bg-[#FAF8F5] text-stone-900 pb-24">
      
      {/* Header Banner */}
      <section className="bg-gradient-to-b from-[#141211] to-[#0A0908] text-stone-100 py-20 px-4 sm:px-6 lg:px-8 border-b border-[#C49D3E]/20 text-center">
        <div className="max-w-3xl mx-auto space-y-3">
          <span className="text-[10px] uppercase tracking-[0.35em] font-semibold text-[#D4B35F]">
            Client Concierge & Boutiques
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-100">
            At Your Service
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 font-light max-w-lg mx-auto leading-relaxed">
            Our private salon consultants and master gemologists are here to assist with bespoke commissions, ring sizing, or milestone gifts.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Concierge Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-[#FCFBF9] p-8 sm:p-10 rounded-none border border-[#DFD5C6] shadow-sm">
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#846127]">
                  Private Inquiry
                </span>
                <h2 className="font-serif text-2xl font-medium text-stone-950 mt-1">
                  Connect With Our Atelier
                </h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  We reply within 4 business hours to all client inquiries.
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-[#F6F0DD]/60 rounded-none border border-[#EDDFBA] space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-700 mx-auto" />
                  <h3 className="font-serif text-xl font-medium text-stone-900">Inquiry Dispatched</h3>
                  <p className="text-xs text-stone-600 font-light max-w-sm mx-auto leading-relaxed">
                    Thank you, {formData.name}. A senior salon consultant has received your message and will contact you at <strong>{formData.email}</strong> shortly.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', subject: 'bespoke', salon: 'london', message: '' }); }}
                    className="text-xs text-[#846127] underline pt-2 block mx-auto font-medium"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        placeholder="Lady Charlotte Vance"
                      />
                      {errors.name && <p className="text-[10px] text-rose-600 mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        placeholder="client@luxury.com"
                      />
                      {errors.email && <p className="text-[10px] text-rose-600 mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Telephone / WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        placeholder="+44 20 7946 0912"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Inquiry Nature</label>
                      <select
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full px-3 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                      >
                        <option value="bespoke">Bespoke Diamond Commission</option>
                        <option value="sizing">Complimentary Ring Sizer Request</option>
                        <option value="appointment">Private Salon Viewing</option>
                        <option value="order">Order Tracking & Courier</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Preferred Salon</label>
                    <select
                      value={formData.salon}
                      onChange={(e) => setFormData({ ...formData, salon: e.target.value })}
                      className="w-full px-3 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                    >
                      <option value="london">London — Bond Street, Mayfair</option>
                      <option value="paris">Paris — Place Vendôme</option>
                      <option value="newyork">New York — Madison Avenue</option>
                      <option value="virtual">Virtual 4K Atelier Video Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Your Message or Requirements *</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please describe your dream design, gemstone preferences, or desired appointment date..."
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                    />
                    {errors.message && <p className="text-[10px] text-rose-600 mt-1">{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 font-semibold text-xs uppercase tracking-widest rounded-none shadow-md flex items-center justify-center space-x-2 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>Dispatch Confidential Inquiry</span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right Column: Flagship Salons & FAQ */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Salons Box */}
            <div className="bg-[#FCFBF9] p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-6">
              <h3 className="font-serif text-xl font-medium text-stone-950 border-b border-stone-200 pb-3">
                Flagship Salons
              </h3>

              <div className="space-y-4 text-xs text-stone-600 font-light">
                <div className="space-y-1">
                  <p className="font-semibold text-stone-900 font-serif text-sm">London Mayfair</p>
                  <p>14 Old Bond Street, London W1S 4PP</p>
                  <p className="text-stone-400">Mon - Sat: 10:00 AM – 6:30 PM GMT</p>
                </div>

                <div className="space-y-1 pt-3 border-t border-stone-100">
                  <p className="font-semibold text-stone-900 font-serif text-sm">Paris Place Vendôme</p>
                  <p>22 Place Vendôme, 75001 Paris</p>
                  <p className="text-stone-400">Mon - Sat: 10:30 AM – 7:00 PM CET</p>
                </div>

                <div className="space-y-1 pt-3 border-t border-stone-100">
                  <p className="font-semibold text-stone-900 font-serif text-sm">New York Madison</p>
                  <p>740 Madison Avenue, New York, NY 10065</p>
                  <p className="text-stone-400">Mon - Sat: 10:00 AM – 7:00 PM EST</p>
                </div>
              </div>
            </div>

            {/* Concierge FAQs Accordion */}
            <div className="bg-[#FCFBF9] p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-4">
              <h3 className="font-serif text-lg font-medium text-stone-950 border-b border-stone-200 pb-3">
                Frequent Inquiries
              </h3>

              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border-b border-stone-100 pb-3 last:border-0 last:pb-0">
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full text-left flex justify-between items-center text-xs font-semibold text-stone-800 hover:text-[#846127]"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {openFaq === idx && (
                      <p className="text-xs text-stone-500 font-light mt-2 leading-relaxed animate-in fade-in">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
