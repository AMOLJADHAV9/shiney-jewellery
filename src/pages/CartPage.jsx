import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Gem, Sparkles, Plus, Minus, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    subtotal,
    cartCount,
    freeShippingThreshold,
    freeShippingProgress,
    remainingForFreeShipping
  } = useCart();

  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState(null);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'HAUTE10') {
      setAppliedDiscount(0.1); // 10% discount
      setPromoMessage({ type: 'success', text: '10% Atelier Privilege savings applied!' });
    } else if (promoCode.trim().toUpperCase() === 'SHINEYVIP') {
      setAppliedDiscount(0.15); // 15% discount
      setPromoMessage({ type: 'success', text: '15% VIP Private Patron savings applied!' });
    } else {
      setPromoMessage({ type: 'error', text: 'Invalid invitation or privilege code.' });
    }
  };

  const discountAmount = Math.round(subtotal * appliedDiscount);
  const shippingFee = subtotal >= freeShippingThreshold || subtotal === 0 ? 0 : 35;
  const estimatedTax = Math.round((subtotal - discountAmount) * 0.08); // 8% tax
  const total = subtotal - discountAmount + shippingFee + estimatedTax;

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-6">
        <div className="w-20 h-20 mx-auto rounded-none bg-[#F0EAE0] flex items-center justify-center text-[#C49D3E]">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-900">Your Shopping Bag is Empty</h1>
        <p className="text-sm text-stone-500 max-w-md mx-auto font-light leading-relaxed">
          You currently have no exquisite pieces saved to your bag. Discover our diamond solitaires, heirloom necklaces, and bespoke gold bangles.
        </p>
        <div className="pt-2">
          <Link
            to="/shop"
            className="inline-flex items-center px-8 py-3.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-widest rounded-none shadow-md"
          >
            <span>Discover Haute Joaillerie</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-900 pb-24">
      
      {/* Page Title */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-b border-stone-200">
        <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal">
          Your Shopping Bag
        </h1>
        <p className="text-xs text-stone-500 font-light mt-1">
          Review your chosen jewellery creations before proceeding to insured checkout.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Complimentary Shipping Progress Banner */}
        <div className="mb-8 p-4 bg-[#F6F0DD]/70 rounded-none border border-[#EDDFBA] max-w-3xl">
          {remainingForFreeShipping > 0 ? (
            <p className="text-xs text-stone-700">
              Add <span className="font-semibold text-[#846127]">${remainingForFreeShipping.toLocaleString()}</span> more to your bag for <span className="font-semibold text-stone-900">Complimentary Insured Courier Delivery</span>.
            </p>
          ) : (
            <p className="text-xs font-medium text-[#846127] flex items-center">
              <ShieldCheck className="w-4 h-4 mr-1.5 text-[#C49D3E]" />
              You qualify for Complimentary Insured Worldwide Delivery!
            </p>
          )}
          <div className="w-full bg-stone-200 h-2 rounded-none mt-2.5 overflow-hidden">
            <div
              className="bg-[#C49D3E] h-full rounded-none transition-all duration-500"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Bag Items Table */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-[#FCFBF9] rounded-none border border-[#DFD5C6] p-6 shadow-sm divide-y divide-stone-200/80">
              
              {cart.map((item) => (
                <div key={item.id} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 items-start sm:items-center">
                  
                  {/* Image */}
                  <Link to={`/product/${item.product.slug}`} className="shrink-0">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-none border border-stone-200 bg-stone-50"
                    />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase tracking-widest font-semibold text-[#846127]">
                      {item.product.categoryLabel}
                    </span>
                    <Link
                      to={`/product/${item.product.slug}`}
                      className="block font-serif text-lg font-medium text-stone-900 hover:text-[#846127] transition-colors truncate"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      {item.product.material}
                    </p>

                    {item.variant && (
                      <p className="text-xs text-stone-600 mt-1">
                        {item.product.variantType === 'ring_size' ? 'Ring Size' : 'Selection'}:{' '}
                        <span className="font-semibold text-stone-900">{item.variant.name}</span>
                      </p>
                    )}

                    <div className="pt-2 text-xs text-emerald-800 flex items-center space-x-1">
                      <Gem className="w-3.5 h-3.5 text-[#C49D3E]" />
                      <span>Atelier Hallmark Certified</span>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto sm:space-y-3">
                    <div className="flex items-center border border-stone-300 rounded-none bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-stone-500 hover:text-stone-900"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-3 text-xs font-semibold text-stone-800">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-stone-500 hover:text-stone-900"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-serif text-lg font-semibold text-stone-950">
                        ${(item.unitPrice * item.quantity).toLocaleString()} USD
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-rose-600 text-xs flex items-center sm:justify-end mt-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>

                </div>
              ))}

            </div>

            {/* Privilege Code Box */}
            <div className="bg-[#FCFBF9] rounded-none border border-[#DFD5C6] p-6 shadow-sm">
              <h3 className="font-serif text-base font-medium text-stone-900 mb-2 flex items-center">
                <Tag className="w-4 h-4 text-[#C49D3E] mr-2" />
                Salon Privilege Code
              </h3>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Try 'HAUTE10' or 'SHINEYVIP'"
                  className="flex-1 px-4 py-2 bg-white border border-stone-300 rounded-none text-xs uppercase tracking-wider focus:outline-none focus:border-[#C49D3E]"
                />
                <button
                  type="submit"
                  className="px-5 py-2 bg-stone-900 text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
                >
                  Apply
                </button>
              </form>
              {promoMessage && (
                <p className={`text-xs mt-2 ${promoMessage.type === 'success' ? 'text-emerald-700' : 'text-rose-600'}`}>
                  {promoMessage.text}
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary Box */}
          <div className="lg:col-span-4">
            <div className="bg-[#FCFBF9] rounded-none border border-[#DFD5C6] p-6 shadow-sm space-y-4 sticky top-28">
              <h2 className="font-serif text-xl font-medium text-stone-950 border-b border-stone-200 pb-3">
                Order Summary
              </h2>

              <div className="space-y-2.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold text-stone-900">${subtotal.toLocaleString()} USD</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Privilege Savings ({appliedDiscount * 100}%)</span>
                    <span>-${discountAmount.toLocaleString()} USD</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Insured Courier Delivery</span>
                  <span>{shippingFee === 0 ? <span className="text-[#846127] font-semibold">Complimentary</span> : `$${shippingFee} USD`}</span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span>${estimatedTax.toLocaleString()} USD</span>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4 flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-base font-semibold text-stone-900">Total</span>
                  <p className="text-[10px] text-stone-400">Includes transit insurance & silk gift box</p>
                </div>
                <span className="font-serif text-2xl font-semibold text-[#846127]">
                  ${total.toLocaleString()} USD
                </span>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 font-semibold text-xs uppercase tracking-widest rounded-none shadow-md flex items-center justify-center space-x-2 transition-all mt-4"
              >
                <span>Proceed to Insured Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="pt-2 text-[11px] text-stone-500 space-y-2 border-t border-stone-100">
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#C49D3E]" />
                  <span>30-Day Money-Back Guarantee & Free Resizing</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-[#C49D3E]" />
                  <span>Archival Silk-Lined Presentation Box Included</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
