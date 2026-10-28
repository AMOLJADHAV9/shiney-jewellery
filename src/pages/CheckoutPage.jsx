import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, ArrowRight, CreditCard, ChevronRight, Sparkles, Building, Gem } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CheckoutPage() {
  const { cart, subtotal, cartCount, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  
  // Shipping form state
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formErrors, setFormErrors] = useState({});
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');

  const shippingCost = shippingMethod === 'priority' ? 45 : (subtotal >= 250 ? 0 : 35);
  const estimatedTax = Math.round(subtotal * 0.08);
  const total = subtotal + shippingCost + estimatedTax;

  const validateShippingForm = () => {
    const errors = {};
    if (!shippingData.firstName.trim()) errors.firstName = 'First name required';
    if (!shippingData.lastName.trim()) errors.lastName = 'Last name required';
    if (!shippingData.email.trim() || !shippingData.email.includes('@')) errors.email = 'Valid email required';
    if (!shippingData.phone.trim()) errors.phone = 'Phone number required for courier delivery';
    if (!shippingData.address.trim()) errors.address = 'Street address required';
    if (!shippingData.city.trim()) errors.city = 'City required';
    if (!shippingData.postalCode.trim()) errors.postalCode = 'Postal code required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (validateShippingForm()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCompleteOrder = () => {
    const generatedId = `SH-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    setOrderId(generatedId);
    setOrderConfirmed(true);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (cart.length === 0 && !orderConfirmed) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="font-serif text-3xl text-stone-900">Your bag is empty</h1>
        <p className="text-xs text-stone-500 font-light">Add items to your bag before proceeding to checkout.</p>
        <Link
          to="/shop"
          className="inline-flex items-center px-6 py-2.5 bg-[#12100E] text-[#EDDFBA] text-xs font-semibold uppercase tracking-wider rounded-none"
        >
          Discover Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-900 pb-24">
      
      {/* Explicit Prototype Notice Banner (PRD Requirement) */}
      <div className="bg-amber-950 text-amber-200 py-2.5 px-4 text-xs text-center border-b border-amber-900 flex items-center justify-center space-x-2">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="font-medium">
          PROTOTYPE DEMONSTRATION MODE — No real payment card data or transactions will be processed.
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Stepper Header */}
        <div className="flex items-center justify-between pb-8 border-b border-stone-200 max-w-3xl">
          <div className="flex items-center space-x-3">
            <span className={`w-7 h-7 rounded-none flex items-center justify-center text-xs font-bold ${
              step >= 1 ? 'bg-[#12100E] text-[#EDDFBA]' : 'bg-stone-200 text-stone-600'
            }`}>
              1
            </span>
            <span className={`text-xs uppercase tracking-wider font-semibold ${step === 1 ? 'text-stone-950' : 'text-stone-400'}`}>
              Client Delivery
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-stone-400" />

          <div className="flex items-center space-x-3">
            <span className={`w-7 h-7 rounded-none flex items-center justify-center text-xs font-bold ${
              step >= 2 ? 'bg-[#12100E] text-[#EDDFBA]' : 'bg-stone-200 text-stone-600'
            }`}>
              2
            </span>
            <span className={`text-xs uppercase tracking-wider font-semibold ${step === 2 ? 'text-stone-950' : 'text-stone-400'}`}>
              Review & Simulate Pay
            </span>
          </div>

          <ChevronRight className="w-4 h-4 text-stone-400" />

          <div className="flex items-center space-x-3">
            <span className={`w-7 h-7 rounded-none flex items-center justify-center text-xs font-bold ${
              orderConfirmed ? 'bg-emerald-800 text-white' : 'bg-stone-200 text-stone-600'
            }`}>
              3
            </span>
            <span className={`text-xs uppercase tracking-wider font-semibold ${orderConfirmed ? 'text-emerald-800' : 'text-stone-400'}`}>
              Confirmation
            </span>
          </div>
        </div>

        {/* Order Confirmed Screen */}
        {orderConfirmed ? (
          <div className="max-w-2xl mx-auto py-16 text-center space-y-6 bg-[#FCFBF9] p-8 sm:p-12 rounded-none border border-[#DFD5C6] shadow-sm my-8">
            <div className="w-16 h-16 mx-auto rounded-none bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#846127]">
                Prototype Order Confirmed
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal">
                Thank You, {shippingData.firstName || 'Valued Patron'}
              </h1>
              <p className="text-xs text-stone-500 font-light">
                Atelier Order Reference: <strong className="text-stone-900 font-mono text-sm">{orderId}</strong>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-light leading-relaxed">
              In a production environment, an order confirmation with insured tracking credentials and Certificate of Authenticity would be dispatched to <strong>{shippingData.email}</strong>.
            </p>

            <div className="p-4 bg-[#F6F0DD]/60 rounded-none border border-[#EDDFBA] text-left text-xs space-y-1 text-stone-700">
              <p><strong>Insured Delivery Address:</strong> {shippingData.address}, {shippingData.city}, {shippingData.postalCode}</p>
              <p><strong>Simulated Total:</strong> ${total.toLocaleString()} USD</p>
              <p><strong>Estimated Transit:</strong> 2-3 Business Days via Armoured Courier</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                to="/shop"
                className="w-full sm:w-auto px-8 py-3.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none"
              >
                Return to Collections
              </Link>
              <Link
                to="/"
                className="w-full sm:w-auto px-8 py-3.5 border border-stone-300 text-stone-700 hover:text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-none"
              >
                Back to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
            
            {/* Left Column: Checkout Step Forms */}
            <div className="lg:col-span-7 space-y-6">
              
              {step === 1 && (
                <form onSubmit={handleProceedToPayment} className="bg-[#FCFBF9] p-6 sm:p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-6">
                  
                  <div>
                    <h2 className="font-serif text-xl font-medium text-stone-950">
                      Client Contact & Courier Address
                    </h2>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Required for armed courier transit insurance and signature validation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        value={shippingData.firstName}
                        onChange={(e) => setShippingData({ ...shippingData, firstName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        placeholder="Elena"
                      />
                      {formErrors.firstName && <p className="text-[10px] text-rose-600 mt-1">{formErrors.firstName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        value={shippingData.lastName}
                        onChange={(e) => setShippingData({ ...shippingData, lastName: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        placeholder="Rostova"
                      />
                      {formErrors.lastName && <p className="text-[10px] text-rose-600 mt-1">{formErrors.lastName}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Email Address *</label>
                      <input
                        type="email"
                        value={shippingData.email}
                        onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        placeholder="elena@example.com"
                      />
                      {formErrors.email && <p className="text-[10px] text-rose-600 mt-1">{formErrors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Mobile Phone (For courier) *</label>
                      <input
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        placeholder="+1 (555) 019-2834"
                      />
                      {formErrors.phone && <p className="text-[10px] text-rose-600 mt-1">{formErrors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Street Address *</label>
                    <input
                      type="text"
                      value={shippingData.address}
                      onChange={(e) => setShippingData({ ...shippingData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                      placeholder="740 Park Avenue"
                    />
                    {formErrors.address && <p className="text-[10px] text-rose-600 mt-1">{formErrors.address}</p>}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">City *</label>
                      <input
                        type="text"
                        value={shippingData.city}
                        onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        placeholder="New York"
                      />
                      {formErrors.city && <p className="text-[10px] text-rose-600 mt-1">{formErrors.city}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">State / Region</label>
                      <input
                        type="text"
                        value={shippingData.state}
                        onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        placeholder="NY"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1">Postal Code *</label>
                      <input
                        type="text"
                        value={shippingData.postalCode}
                        onChange={(e) => setShippingData({ ...shippingData, postalCode: e.target.value })}
                        className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        placeholder="10021"
                      />
                      {formErrors.postalCode && <p className="text-[10px] text-rose-600 mt-1">{formErrors.postalCode}</p>}
                    </div>
                  </div>

                  {/* Delivery Speed Options */}
                  <div className="pt-4 border-t border-stone-200">
                    <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-900 mb-3">
                      Courier Transit Method
                    </h3>
                    <div className="space-y-2">
                      <label className={`flex items-center justify-between p-3.5 rounded-none border cursor-pointer transition-all ${
                        shippingMethod === 'standard' ? 'border-[#C49D3E] bg-[#F6F0DD]/40' : 'border-stone-200 bg-white'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'standard'}
                            onChange={() => setShippingMethod('standard')}
                            className="text-[#C49D3E]"
                          />
                          <div>
                            <p className="text-xs font-semibold text-stone-900">Armoured Insured Courier (3-5 Business Days)</p>
                            <p className="text-[11px] text-stone-500 font-light">Discreet security tamper-sealed packaging</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-[#846127]">
                          {subtotal >= 250 ? 'Complimentary' : '$35 USD'}
                        </span>
                      </label>

                      <label className={`flex items-center justify-between p-3.5 rounded-none border cursor-pointer transition-all ${
                        shippingMethod === 'priority' ? 'border-[#C49D3E] bg-[#F6F0DD]/40' : 'border-stone-200 bg-white'
                      }`}>
                        <div className="flex items-center space-x-3">
                          <input
                            type="radio"
                            name="shipping"
                            checked={shippingMethod === 'priority'}
                            onChange={() => setShippingMethod('priority')}
                            className="text-[#C49D3E]"
                          />
                          <div>
                            <p className="text-xs font-semibold text-stone-900">Priority Armoured Express (1-2 Business Days)</p>
                            <p className="text-[11px] text-stone-500 font-light">Dedicated direct courier handling with immediate dispatch</p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-stone-900">$45 USD</span>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 font-semibold text-xs uppercase tracking-widest rounded-none shadow-md flex items-center justify-center space-x-2 transition-all"
                  >
                    <span>Proceed to Review & Simulation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                </form>
              )}

              {step === 2 && (
                <div className="bg-[#FCFBF9] p-6 sm:p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-6">
                  <div>
                    <h2 className="font-serif text-xl font-medium text-stone-950">
                      Payment Simulation & Verification
                    </h2>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Select your preferred simulated payment rail. No funds will be charged.
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <label className={`flex items-center justify-between p-4 rounded-none border cursor-pointer transition-all ${
                      paymentMethod === 'card' ? 'border-[#C49D3E] bg-[#F6F0DD]/30' : 'border-stone-200 bg-white'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="text-[#C49D3E]"
                        />
                        <CreditCard className="w-5 h-5 text-[#C49D3E]" />
                        <div>
                          <p className="text-xs font-semibold text-stone-900">Simulated Encrypted Payment Card</p>
                          <p className="text-[11px] text-stone-500 font-light">Visa, Mastercard, Amex</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-none font-medium">Mock Mode</span>
                    </label>

                    <label className={`flex items-center justify-between p-4 rounded-none border cursor-pointer transition-all ${
                      paymentMethod === 'wire' ? 'border-[#C49D3E] bg-[#F6F0DD]/30' : 'border-stone-200 bg-white'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'wire'}
                          onChange={() => setPaymentMethod('wire')}
                          className="text-[#C49D3E]"
                        />
                        <Building className="w-5 h-5 text-[#C49D3E]" />
                        <div>
                          <p className="text-xs font-semibold text-stone-900">Private Atelier Wire Consultation</p>
                          <p className="text-[11px] text-stone-500 font-light">For high jewellery pieces over $5,000</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-none">Concierge</span>
                    </label>
                  </div>

                  {/* Card Simulation Inputs */}
                  {paymentMethod === 'card' && (
                    <div className="p-4 rounded-none bg-stone-50 border border-stone-200 space-y-3 text-xs">
                      <div>
                        <label className="block text-[11px] text-stone-500 mb-1">Simulated Cardholder Name</label>
                        <input
                          type="text"
                          defaultValue={`${shippingData.firstName} ${shippingData.lastName}`}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded-none text-stone-800"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <label className="block text-[11px] text-stone-500 mb-1">Card Number (Mocked)</label>
                          <input
                            type="text"
                            defaultValue="•••• •••• •••• 4242"
                            readOnly
                            className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-none font-mono text-stone-600"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-stone-500 mb-1">CVC (Mock)</label>
                          <input
                            type="text"
                            defaultValue="•••"
                            readOnly
                            className="w-full px-3 py-2 bg-stone-100 border border-stone-300 rounded-none font-mono text-stone-600"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 border border-stone-300 text-stone-700 hover:text-stone-950 font-medium text-xs uppercase tracking-wider rounded-none"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleCompleteOrder}
                      className="w-2/3 py-3.5 bg-[#C49D3E] hover:bg-[#DFB868] text-stone-950 font-semibold text-xs uppercase tracking-widest rounded-none shadow-md flex items-center justify-center space-x-2 transition-all"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>Simulate Order Confirmation</span>
                    </button>
                  </div>

                </div>
              )}

            </div>

            {/* Right Column: Order Summary & Line Items */}
            <div className="lg:col-span-5">
              <div className="bg-[#FCFBF9] p-6 rounded-none border border-[#DFD5C6] shadow-sm space-y-4 sticky top-28">
                <h3 className="font-serif text-lg font-medium text-stone-950 border-b border-stone-200 pb-3">
                  Summary ({cartCount} Items)
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto divide-y divide-stone-100">
                  {cart.map((item) => (
                    <div key={item.id} className="pt-3 first:pt-0 flex space-x-3 text-xs">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.name}
                        className="w-14 h-14 object-cover rounded-none border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-serif font-medium text-stone-900 truncate">{item.product.name}</p>
                        {item.variant && <p className="text-[11px] text-stone-500">{item.variant.name}</p>}
                        <p className="text-[11px] text-stone-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-stone-900 shrink-0">
                        ${(item.unitPrice * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-stone-200 space-y-2 text-xs text-stone-600">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-semibold text-stone-900">${subtotal.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Courier Transit</span>
                    <span>{shippingCost === 0 ? 'Complimentary' : `$${shippingCost} USD`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Tax (8%)</span>
                    <span>${estimatedTax.toLocaleString()} USD</span>
                  </div>
                  <div className="flex justify-between text-stone-950 font-serif text-base font-semibold pt-2 border-t border-stone-200">
                    <span>Total Due</span>
                    <span className="text-[#846127]">${total.toLocaleString()} USD</span>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-none border border-stone-200 text-[11px] text-stone-500 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-[#C49D3E] shrink-0" />
                  <span>Complimentary 30-day returns & full transit protection.</span>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
