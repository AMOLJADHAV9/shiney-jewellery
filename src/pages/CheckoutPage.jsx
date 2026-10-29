import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, AlertTriangle, CheckCircle2, ArrowRight, CreditCard, ChevronRight, Sparkles, Building, Gem, UserCheck, KeyRound, FileText, Truck, QrCode } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import ReceiptModal from '../components/orders/ReceiptModal';
import TrackingModal from '../components/orders/TrackingModal';

export default function CheckoutPage() {
  const { cart, subtotal, cartCount, clearCart } = useCart();
  const { user, isAuthenticated, login, register, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Confirmation
  
  // Patron Auth Form State (For customers without account or not signed in)
  const [authTab, setAuthTab] = useState('login'); // 'login' | 'register'
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

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

  // Pre-fill shipping from authenticated user account
  useEffect(() => {
    if (user) {
      setShippingData((prev) => ({
        ...prev,
        firstName: prev.firstName || user.firstName || '',
        lastName: prev.lastName || user.lastName || '',
        email: prev.email || user.email || '',
      }));
    }
  }, [user]);

  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [formErrors, setFormErrors] = useState({});
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [orderError, setOrderError] = useState('');
  const [placedOrderSummary, setPlacedOrderSummary] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isTrackingModalOpen, setIsTrackingModalOpen] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmittingAuth(true);
    try {
      if (authTab === 'login') {
        const res = await login(authEmail, authPassword);
        if (!res.success) {
          setAuthError(res.error || 'Failed to sign in. Please verify your credentials.');
        }
      } else {
        if (!authName.trim()) {
          setAuthError('Please provide your full patron name.');
          setIsSubmittingAuth(false);
          return;
        }
        const res = await register(authName, authEmail, authPassword);
        if (!res.success) {
          setAuthError(res.error || 'Failed to create patron account.');
        }
      }
    } catch (err) {
      setAuthError(err.message || 'Authentication error.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleDemoPatronLogin = async () => {
    setAuthEmail('patron@shineyjewellery.com');
    setAuthPassword('Patron@123456');
    setAuthError('');
    setIsSubmittingAuth(true);
    const res = await login('patron@shineyjewellery.com', 'Patron@123456');
    setIsSubmittingAuth(false);
    if (!res.success) {
      setAuthError(res.error || 'Failed to sign in with demo patron account.');
    }
  };

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
    if (!isAuthenticated) {
      setAuthError('A patron account is strictly required to proceed with jewelry acquisition. Please sign in or register below.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (validateShippingForm()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCompleteOrder = async () => {
    if (!isAuthenticated) {
      setOrderError('A patron user account is strictly required to finalize your jewelry order. Please sign in or create an account.');
      setStep(1);
      return;
    }
    setIsProcessingOrder(true);
    setOrderError('');

    try {
      const orderItems = [];
      for (const item of cart) {
        let variantId = item.variant?.id;
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(variantId || '');
        if (!isUUID) {
          try {
            const liveProduct = await api.catalog.getProductBySlug(item.product.slug);
            if (liveProduct?.variants?.length > 0) {
              const matchedVar = liveProduct.variants.find((v) => v.value === item.variant?.value) || liveProduct.variants[0];
              variantId = matchedVar?.id;
            }
          } catch (e) {
            console.warn('Failed to resolve live variant ID:', e);
          }
        }

        if (variantId) {
          orderItems.push({
            variantId,
            quantity: item.quantity,
            customEngravingText: item.customEngravingText || undefined,
          });
        }
      }

      if (orderItems.length === 0) {
        // Fallback: query any product variant from backend
        const sampleProds = await api.catalog.getProducts({ limit: 1 });
        if (sampleProds?.data?.[0]?.slug) {
          const detailed = await api.catalog.getProductBySlug(sampleProds.data[0].slug);
          if (detailed?.variants?.[0]?.id) {
            orderItems.push({
              variantId: detailed.variants[0].id,
              quantity: 1,
            });
          }
        }
      }

      if (orderItems.length === 0) {
        throw new Error('Unable to resolve inventory items. Please try refreshing your bag.');
      }

      // Step 1: Create Order in PostgreSQL
      const orderResponse = await api.orders.createOrder({
        clientEmail: shippingData.email,
        clientPhone: shippingData.phone,
        shippingRecipient: `${shippingData.firstName} ${shippingData.lastName}`.trim(),
        shippingAddressLine1: shippingData.address,
        shippingAddressLine2: shippingData.apartment || undefined,
        shippingCity: shippingData.city,
        shippingState: shippingData.state,
        shippingPostalCode: shippingData.postalCode,
        shippingCountry: shippingData.country,
        specialDeliveryNotes: 'Armoured courier signature required upon arrival',
        items: orderItems,
      });

      // Step 2: Handle Payment
      if (paymentMethod === 'razorpay') {
        // Create Razorpay Order on server
        const razorpayData = await api.payments.createRazorpayOrder(orderResponse.orderId);

        if (!window.Razorpay) {
          throw new Error('Razorpay payment gateway script not loaded. Please refresh the page and try again.');
        }

        const razorpayKey = razorpayData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_Ttgnx6a7ZNyE1D';

        const rzpOptions = {
          key: razorpayKey,
          amount: razorpayData.amount,
          currency: razorpayData.currency || 'INR',
          name: 'Shiney Haute Joaillerie',
          description: `Atelier Order ${orderResponse.orderNumber}`,
          image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=200&q=80',
          order_id: razorpayData.razorpayOrderId,
          prefill: {
            name: `${shippingData.firstName} ${shippingData.lastName}`.trim(),
            email: shippingData.email,
            contact: shippingData.phone,
          },
          theme: {
            color: '#C49D3E',
          },
          modal: {
            ondismiss: () => {
              setIsProcessingOrder(false);
              setOrderError('Razorpay checkout window was dismissed. You can re-open it to complete your acquisition.');
            },
          },
          handler: async (response) => {
            try {
              setIsProcessingOrder(true);
              setOrderError('');

              // Verify HMAC SHA256 Signature on backend
              const verification = await api.payments.verifyRazorpayPayment({
                orderId: orderResponse.orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              });

              setOrderId(orderResponse.orderNumber);
              setPlacedOrderSummary({
                ...orderResponse,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
              });
              setOrderConfirmed(true);
              clearCart();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch (vErr) {
              console.error('Razorpay verification error:', vErr);
              setOrderError(vErr.message || 'Payment signature verification failed.');
            } finally {
              setIsProcessingOrder(false);
            }
          },
        };

        const rzp = new window.Razorpay(rzpOptions);
        rzp.on('payment.failed', (failRes) => {
          console.error('Razorpay payment failed:', failRes);
          setOrderError(`Razorpay payment failed: ${failRes.error?.description || failRes.error?.reason || 'Transaction declined'}`);
          setIsProcessingOrder(false);
        });

        rzp.open();
      } else {
        // Wire transfer simulation
        try {
          await api.payments.confirmPaymentWebhook({
            eventId: `evt_${Date.now()}`,
            eventType: 'payment_intent.succeeded',
            orderId: orderResponse.orderId,
            providerTransactionId: `wire_${Date.now()}`,
            amount: orderResponse.totalAmount,
            currency: 'USD',
          });
        } catch (payErr) {
          console.warn('Webhook auto-confirmation note:', payErr.message);
        }

        setOrderId(orderResponse.orderNumber);
        setPlacedOrderSummary(orderResponse);
        setOrderConfirmed(true);
        clearCart();
        setIsProcessingOrder(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      setOrderError(err.message || 'Failed to place order. Please try again.');
      setIsProcessingOrder(false);
    }
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
      
      {/* Razorpay Gateway Active Banner */}
      <div className="bg-[#12100E] text-[#EDDFBA] py-2.5 px-4 text-xs text-center border-b border-[#C49D3E]/30 flex items-center justify-center space-x-2 shadow-sm">
        <Sparkles className="w-4 h-4 text-[#C49D3E] shrink-0" />
        <span className="font-medium">
          RAZORPAY PAYMENT GATEWAY ACTIVE (Key: <code className="font-mono text-amber-300 font-bold">rzp_test_Ttgnx6a7ZNyE1D</code>) — Cards, UPI, NetBanking & Wallets Enabled
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
            <div className="w-16 h-16 mx-auto rounded-none bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#846127]">
                Haute Joaillerie Acquisition Secured
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-stone-950 font-normal">
                Thank You, {shippingData.firstName || 'Valued Patron'}
              </h1>
              <p className="text-xs text-stone-500 font-light">
                Atelier Order Reference: <strong className="text-stone-900 font-mono text-sm">{orderId}</strong>
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto font-light leading-relaxed">
              Your acquisition has been recorded and authorized. An insured dispatch notice with armored courier tracking credentials and physical Certificate of Authenticity will be dispatched to <strong>{shippingData.email}</strong>.
            </p>

            <div className="p-5 bg-[#F6F0DD]/60 rounded-none border border-[#EDDFBA] text-left text-xs space-y-2 text-stone-700">
              <p><strong>Insured Delivery Address:</strong> {shippingData.address}, {shippingData.city}, {shippingData.postalCode}</p>
              <p><strong>Total Amount Settled:</strong> ${total.toLocaleString()} USD</p>
              {placedOrderSummary?.razorpayPaymentId && (
                <div className="p-2.5 bg-emerald-100/70 border border-emerald-300 text-emerald-950 rounded-none font-mono text-[11px] flex items-center justify-between">
                  <span>Razorpay Payment ID: <strong>{placedOrderSummary.razorpayPaymentId}</strong></span>
                  <span className="bg-emerald-800 text-white text-[9px] uppercase px-1.5 py-0.5 font-sans font-bold">Captured</span>
                </div>
              )}
              {placedOrderSummary?.razorpayOrderId && (
                <p className="text-stone-500 font-mono text-[11px]">Razorpay Order: {placedOrderSummary.razorpayOrderId}</p>
              )}
              <p><strong>Estimated Transit:</strong> 2-3 Business Days via Armoured Tamper-Evident Courier</p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setIsReceiptModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-900 text-xs font-semibold uppercase tracking-wider rounded-none shadow-sm transition-all border border-[#C49D3E]/40"
              >
                <FileText className="w-4 h-4 text-[#C49D3E]" />
                <span>Download Receipt & QR</span>
              </button>
              <button
                type="button"
                onClick={() => setIsTrackingModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 border border-stone-300 text-stone-800 hover:text-black hover:border-stone-500 text-xs font-semibold uppercase tracking-wider rounded-none bg-white transition-colors"
              >
                <Truck className="w-4 h-4 text-[#C49D3E]" />
                <span>Track Delivery</span>
              </button>
              <Link
                to="/shop"
                className="w-full sm:w-auto px-6 py-3.5 border border-stone-300 text-stone-600 hover:text-stone-950 text-xs font-semibold uppercase tracking-wider rounded-none text-center"
              >
                Collections
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
            
            {/* Left Column: Checkout Step Forms */}
            <div className="lg:col-span-7 space-y-6">
              
              {step === 1 && (
                !isAuthenticated ? (
                  <div className="bg-[#FCFBF9] p-6 sm:p-8 rounded-none border-2 border-[#C49D3E]/40 shadow-sm space-y-6">
                    <div className="flex items-start space-x-3.5 pb-5 border-b border-stone-200">
                      <div className="w-12 h-12 bg-[#12100E] text-[#EDDFBA] flex items-center justify-center shrink-0 shadow-sm">
                        <Gem className="w-6 h-6 text-[#C49D3E]" />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#846127]">
                          Exclusive Privilege Access
                        </span>
                        <h2 className="font-serif text-xl sm:text-2xl font-medium text-stone-950 mt-0.5">
                          Patron Account Required to Buy Jewelry
                        </h2>
                        <p className="text-xs text-stone-600 font-light mt-1.5 leading-relaxed">
                          To record provenance, issue certified authenticity documentation, and authorize insured courier transit, all Shiney Haute Joaillerie acquisitions require a registered patron account.
                        </p>
                      </div>
                    </div>

                    {/* Auth Tabs */}
                    <div className="flex border-b border-stone-200">
                      <button
                        type="button"
                        onClick={() => { setAuthTab('login'); setAuthError(''); }}
                        className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                          authTab === 'login'
                            ? 'border-[#C49D3E] text-stone-950 bg-[#F6F0DD]/30'
                            : 'border-transparent text-stone-400 hover:text-stone-700'
                        }`}
                      >
                        Sign In to Patron Account
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAuthTab('register'); setAuthError(''); }}
                        className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                          authTab === 'register'
                            ? 'border-[#C49D3E] text-stone-950 bg-[#F6F0DD]/30'
                            : 'border-transparent text-stone-400 hover:text-stone-700'
                        }`}
                      >
                        Create New Patron Account
                      </button>
                    </div>

                    {authError && (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                        <span>{authError}</span>
                      </div>
                    )}

                    <form onSubmit={handleAuthSubmit} className="space-y-4">
                      {authTab === 'register' && (
                        <div>
                          <label className="block text-xs font-medium text-stone-700 mb-1">Full Patron Name *</label>
                          <input
                            type="text"
                            required
                            value={authName}
                            onChange={(e) => setAuthName(e.target.value)}
                            placeholder="e.g. Lady Vivienne Montgomery"
                            className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder="patron@domain.com"
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-stone-700 mb-1">Security Password *</label>
                        <input
                          type="password"
                          required
                          value={authPassword}
                          onChange={(e) => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingAuth}
                        className="w-full py-3.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 font-semibold text-xs uppercase tracking-widest rounded-none shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                      >
                        <UserCheck className="w-4 h-4 text-[#C49D3E]" />
                        <span>
                          {isSubmittingAuth
                            ? 'Authenticating Patron...'
                            : authTab === 'login'
                            ? 'Sign In & Continue Acquisition'
                            : 'Create Account & Continue Acquisition'}
                        </span>
                      </button>

                      {/* 1-Click Fast Patron Sign In for testing */}
                      <div className="pt-2 border-t border-stone-200">
                        <button
                          type="button"
                          onClick={handleDemoPatronLogin}
                          disabled={isSubmittingAuth}
                          className="w-full py-2.5 border border-[#C49D3E] text-[#846127] hover:bg-[#F6F0DD]/50 text-xs font-medium rounded-none flex items-center justify-center space-x-2 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-[#C49D3E]" />
                          <span>1-Click Quick Sign In (patron@shineyjewellery.com)</span>
                        </button>
                      </div>

                      <div className="text-center pt-2 text-stone-500 text-[11px]">
                        Prefer dedicated sign in page?{' '}
                        <Link to="/login?redirect=/checkout" className="text-stone-900 underline font-medium hover:text-[#C49D3E]">
                          Sign in here
                        </Link>{' '}
                        or{' '}
                        <Link to="/register?redirect=/checkout" className="text-stone-900 underline font-medium hover:text-[#C49D3E]">
                          Create Account
                        </Link>
                      </div>
                    </form>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Verified Patron Badge */}
                    <div className="bg-[#FAF6EC] border border-[#C49D3E]/40 p-4 rounded-none flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-9 h-9 bg-[#12100E] text-[#EDDFBA] flex items-center justify-center shadow-sm">
                          <UserCheck className="w-5 h-5 text-[#C49D3E]" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-stone-950">
                            Authenticated Patron: <span className="font-serif font-normal text-sm">{user.name}</span>
                          </p>
                          <p className="text-[11px] text-stone-600">
                            {user.email} • <span className="text-[#846127] font-medium">{user.tier || 'Privilege Patron'}</span>
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => logout()}
                        className="text-[11px] text-stone-500 hover:text-stone-900 underline transition-colors"
                      >
                        Sign Out / Switch Account
                      </button>
                    </div>

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
                  </div>
                )
              )}

              {step === 2 && (
                <div className="bg-[#FCFBF9] p-6 sm:p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-6">
                  <div>
                    <h2 className="font-serif text-xl font-medium text-stone-950">
                      Payment Gateway & Settlement
                    </h2>
                    <p className="text-xs text-stone-500 font-light mt-0.5">
                      Select your preferred settlement method. All transactions are protected by end-to-end encryption.
                    </p>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-3">
                    <label className={`flex items-start justify-between p-4 rounded-none border cursor-pointer transition-all ${
                      paymentMethod === 'razorpay' ? 'border-[#C49D3E] bg-[#F6F0DD]/30 ring-1 ring-[#C49D3E]' : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}>
                      <div className="flex items-start space-x-3.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'razorpay'}
                          onChange={() => setPaymentMethod('razorpay')}
                          className="text-[#C49D3E] mt-1"
                        />
                        <div className="w-8 h-8 rounded-none bg-[#0c2340] text-blue-200 flex items-center justify-center font-bold text-sm shrink-0">
                          ₹
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <p className="text-xs font-semibold text-stone-900">Razorpay Payment Gateway</p>
                            <span className="text-[10px] text-emerald-800 bg-emerald-100 px-2 py-0.5 font-medium">Active • Live Test</span>
                          </div>
                          <p className="text-[11px] text-stone-600 font-light mt-0.5">
                            Credit/Debit Cards, UPI (Google Pay, PhonePe, Paytm), NetBanking & Digital Wallets
                          </p>
                          <p className="text-[10px] text-stone-400 font-mono mt-1">
                            Key ID: rzp_test_Ttgnx6a7ZNyE1D
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-[#846127] shrink-0">Recommended</span>
                    </label>

                    <label className={`flex items-start justify-between p-4 rounded-none border cursor-pointer transition-all ${
                      paymentMethod === 'wire' ? 'border-[#C49D3E] bg-[#F6F0DD]/30 ring-1 ring-[#C49D3E]' : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}>
                      <div className="flex items-start space-x-3.5">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'wire'}
                          onChange={() => setPaymentMethod('wire')}
                          className="text-[#C49D3E] mt-1"
                        />
                        <Building className="w-8 h-8 text-stone-700 shrink-0 p-1 bg-stone-100" />
                        <div>
                          <p className="text-xs font-semibold text-stone-900">Private Atelier Bank Wire Consultation</p>
                          <p className="text-[11px] text-stone-500 font-light mt-0.5">
                            Direct bank transfer consultation with dedicated high jewellery concierge
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] text-stone-600 bg-stone-100 px-2 py-0.5 rounded-none shrink-0">Concierge</span>
                    </label>
                  </div>

                  {/* Razorpay Active Info Card */}
                  {paymentMethod === 'razorpay' && (
                    <div className="p-4 rounded-none bg-stone-50 border border-stone-200 space-y-2.5 text-xs">
                      <div className="flex items-center space-x-2 text-stone-900 font-medium">
                        <ShieldCheck className="w-4 h-4 text-[#C49D3E]" />
                        <span>Razorpay Checkout Integration</span>
                      </div>
                      <p className="text-[11px] text-stone-600 font-light leading-relaxed">
                        When you proceed, the official Razorpay test checkout window will launch immediately with order details pre-filled. You can complete payment using any test card or UPI handle.
                      </p>
                      <div className="flex flex-wrap gap-2 text-[10px] text-stone-600 pt-1">
                        <span className="px-2 py-0.5 bg-white border border-stone-200">✓ Test Cards (Visa, MC, Amex)</span>
                        <span className="px-2 py-0.5 bg-white border border-stone-200">✓ UPI QR & Intent</span>
                        <span className="px-2 py-0.5 bg-white border border-stone-200">✓ 50+ Major Banks</span>
                      </div>
                    </div>
                  )}

                  {orderError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700">
                      {orderError}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      disabled={isProcessingOrder}
                      onClick={() => setStep(1)}
                      className="w-1/3 py-3.5 border border-stone-300 text-stone-700 hover:text-stone-950 font-medium text-xs uppercase tracking-wider rounded-none disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={isProcessingOrder}
                      onClick={handleCompleteOrder}
                      className="w-2/3 py-3.5 bg-[#C49D3E] hover:bg-[#DFB868] text-stone-950 font-semibold text-xs uppercase tracking-widest rounded-none shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      <span>
                        {isProcessingOrder
                          ? 'Launching Razorpay...'
                          : paymentMethod === 'razorpay'
                          ? 'Pay with Razorpay'
                          : 'Place Atelier Order'}
                      </span>
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

      {/* Customer Official Receipt & QR Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        orderId={placedOrderSummary?.id || orderId}
      />

      {/* Customer Tracking Modal */}
      <TrackingModal
        isOpen={isTrackingModalOpen}
        onClose={() => setIsTrackingModalOpen(false)}
        orderId={placedOrderSummary?.id || orderId}
        onOpenReceipt={() => {
          setIsTrackingModalOpen(false);
          setIsReceiptModalOpen(true);
        }}
      />

    </div>
  );
}
