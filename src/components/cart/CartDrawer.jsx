import React, { useEffect } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    subtotal,
    cartCount,
    freeShippingThreshold,
    freeShippingProgress,
    remainingForFreeShipping
  } = useCart();

  const navigate = useNavigate();

  // Close on ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isCartOpen) {
        setIsCartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      className="fixed inset-0 z-50 overflow-hidden"
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] text-stone-900 shadow-2xl flex flex-col border-l border-[#DFD5C6]">
          
          {/* Header */}
          <div className="p-5 border-b border-stone-200/80 flex items-center justify-between bg-[#FCFBF9]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#C49D3E]" />
              <h2 className="font-serif text-xl text-stone-900 tracking-wide font-medium">Your Shopping Bag</h2>
              <span className="text-xs bg-[#F0EAE0] text-[#846127] font-semibold px-2 py-0.5 rounded-none">
                {cartCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-none transition-colors"
              aria-label="Close bag"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Bar */}
          <div className="bg-[#F6F0DD]/60 px-5 py-3 border-b border-[#EDDFBA]">
            {remainingForFreeShipping > 0 ? (
              <p className="text-xs text-stone-700">
                Add <span className="font-semibold text-[#846127]">${remainingForFreeShipping.toLocaleString()}</span> more for <span className="font-medium text-stone-900">Complimentary Insured Shipping</span>
              </p>
            ) : (
              <p className="text-xs font-medium text-[#846127] flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1 text-[#C49D3E]" />
                You have qualified for Complimentary Insured Worldwide Delivery!
              </p>
            )}
            <div className="w-full bg-stone-200 h-1.5 rounded-none mt-2 overflow-hidden">
              <div
                className="bg-[#C49D3E] h-full rounded-none transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 divide-y divide-stone-200/60">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-none bg-[#F0EAE0] flex items-center justify-center text-[#C49D3E]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <p className="font-serif text-xl text-stone-800">Your bag is currently empty</p>
                  <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                    Explore our handcrafted collections of fine rings, necklaces, and bridal parures.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="inline-flex items-center px-6 py-2.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
                >
                  Discover Collections
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex space-x-4">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-none border border-stone-200 shrink-0 bg-stone-50"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-serif text-base font-medium text-stone-900 hover:text-[#A7802F] truncate block"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-stone-400 hover:text-red-600 p-1 transition-colors ml-2"
                        aria-label={`Remove ${item.product.name}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.variant && (
                      <p className="text-xs text-stone-500 mt-0.5">
                        {item.product.variantType === 'ring_size' ? 'Ring Size' : 'Option'}: <span className="font-medium text-stone-700">{item.variant.name}</span>
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-stone-300 rounded-none bg-white">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 text-stone-500 hover:text-stone-900"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-semibold text-stone-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 text-stone-500 hover:text-stone-900"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className="text-sm font-semibold text-[#846127]">
                        ${(item.unitPrice * item.quantity).toLocaleString()} USD
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Action CTAs */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-[#FCFBF9] space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm font-light text-stone-600">Subtotal</span>
                <span className="font-serif text-xl font-semibold text-stone-900">
                  ${subtotal.toLocaleString()} USD
                </span>
              </div>
              <p className="text-[11px] text-stone-400 leading-tight">
                Applicable taxes, duties and bespoke gift wrapping calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-3 border border-stone-300 hover:border-stone-900 text-stone-900 font-medium text-xs uppercase tracking-wider rounded-none transition-colors"
                >
                  View Full Bag
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-3 bg-[#12100E] text-[#EDDFBA] hover:bg-[#26221F] font-semibold text-xs uppercase tracking-wider rounded-none flex items-center justify-center space-x-1.5 shadow-md transition-all"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-1 flex items-center justify-center space-x-4 text-[10px] uppercase tracking-wider text-stone-400">
                <span>Authenticity Certificate</span>
                <span>•</span>
                <span>30-Day Returns</span>
                <span>•</span>
                <span>Encrypted Pay</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
