import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Package, Heart, MapPin, ShieldCheck, Sparkles, LogOut, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function AccountPage() {
  const { wishlist, cart } = useCart();
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('orders');

  // Guest Auth State
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [loginId, setLoginId] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [regUser, setRegUser] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPass, setRegPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const handleGuestLogin = (e) => {
    e.preventDefault();
    if (!loginId.trim() || !loginPass) {
      setAuthError('Please provide your username/email and password.');
      return;
    }
    setAuthError('');
    login(loginId, loginPass);
  };

  const handleGuestRegister = (e) => {
    e.preventDefault();
    if (!regUser.trim() || !regEmail.trim() || regPass.length < 6) {
      setAuthError('Please complete all fields (password at least 6 characters).');
      return;
    }
    setAuthError('');
    register(regUser, regEmail, regPass);
  };

  const mockOrders = [
    {
      id: 'SH-2026-94812',
      date: 'October 24, 2026',
      total: 1850,
      status: 'In Handcrafted Atelier Assembly',
      items: ["L'Aura Solitaire Diamond Ring (Size 7)"],
      tracking: 'BRK-89210-US (Armoured Courier)'
    },
    {
      id: 'SH-2026-61430',
      date: 'August 12, 2026',
      total: 947,
      status: 'Delivered — Signature Verified',
      items: ['18k Gilded Heart Pavé Locket (18in)'],
      tracking: 'BRK-55219-US'
    }
  ];

  if (!isAuthenticated) {
    return (
      <div className="bg-[#FAF8F5] min-h-[85vh] py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-[#D4B35F] text-xs uppercase tracking-widest font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Private Client Salon</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl font-normal text-stone-950">
              My Account
            </h1>
            <p className="text-xs text-stone-500 font-light max-w-md mx-auto">
              Sign in to manage your private orders, or create an account to access bespoke concierge services.
            </p>
          </div>

          {authError && (
            <div className="max-w-md mx-auto p-3 bg-rose-50 border border-rose-200 rounded-none text-xs text-rose-700 text-center">
              {authError}
            </div>
          )}

          {/* Dual Column Layout: Login on Left, Register on Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* LOGIN CARD */}
            <div className="bg-white p-7 sm:p-8 rounded-none border border-stone-200/60 shadow-[0_15px_45px_rgba(0,0,0,0.06)] space-y-5">
              <h2 className="text-lg font-medium text-stone-900 border-b border-stone-100 pb-3">
                Sign in
              </h2>

              <form onSubmit={handleGuestLogin} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
                    Username or email <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="Username"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-none text-sm placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D7A32F] focus:ring-1 focus:ring-[#D7A32F] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
                    Password <span className="text-[#E53E3E]">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginPass}
                      onChange={(e) => setLoginPass(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-none text-sm placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D7A32F] focus:ring-1 focus:ring-[#D7A32F] transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-0.5">
                  <label className="flex items-center space-x-2 text-stone-600 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded-none text-[#D7A32F] focus:ring-[#D7A32F]" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/contact" className="text-stone-700 hover:text-stone-950 underline decoration-dotted underline-offset-4">
                    Lost your password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D7A32F] hover:bg-[#C99627] active:bg-[#B88720] text-white font-bold text-xs uppercase tracking-wider rounded-none shadow-sm transition-all mt-2"
                >
                  LOGIN
                </button>
              </form>
            </div>

            {/* REGISTER CARD */}
            <div className="bg-white p-7 sm:p-8 rounded-none border border-stone-200/60 shadow-[0_15px_45px_rgba(0,0,0,0.06)] space-y-5">
              <h2 className="text-lg font-medium text-stone-900 border-b border-stone-100 pb-3">
                Create an Account
              </h2>

              <form onSubmit={handleGuestRegister} className="space-y-4">
                <div>
                  <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
                    Username <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="text"
                    value={regUser}
                    onChange={(e) => setRegUser(e.target.value)}
                    placeholder="Username"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-none text-sm placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D7A32F] focus:ring-1 focus:ring-[#D7A32F] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
                    Email address <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Email address"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-none text-sm placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D7A32F] focus:ring-1 focus:ring-[#D7A32F] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
                    Password <span className="text-[#E53E3E]">*</span>
                  </label>
                  <input
                    type="password"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-none text-sm placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D7A32F] focus:ring-1 focus:ring-[#D7A32F] transition-all"
                  />
                </div>

                <p className="text-[11px] text-stone-500 leading-relaxed pt-0.5">
                  A link to set a new password will be sent to your email address. Your personal data will be used to support your experience throughout this website.
                </p>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#D7A32F] hover:bg-[#C99627] active:bg-[#B88720] text-white font-bold text-xs uppercase tracking-wider rounded-none shadow-sm transition-all mt-2"
                >
                  REGISTER
                </button>
              </form>
            </div>

          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-900 pb-24">
      
      {/* Top Banner */}
      <section className="relative py-16 bg-[#0A0908] text-stone-100 overflow-hidden text-center border-b border-[#C49D3E]/20">
        <div className="max-w-3xl mx-auto px-4 space-y-2">
          <div className="inline-flex items-center space-x-1.5 text-[#D4B35F] text-xs uppercase tracking-widest font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Patron Salon</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-stone-100">
            My Account
          </h1>
          <p className="text-xs text-stone-400 font-light">
            Welcome back, {user?.name || 'Valued Patron'} • VIP Tier: {user?.tier || 'Gold Atelier Patron'}
          </p>
        </div>
      </section>


      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Account Navigation Sidebar */}
          <aside className="space-y-2 bg-[#FCFBF9] p-5 rounded-none border border-[#DFD5C6] shadow-sm">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'orders' ? 'bg-[#12100E] text-[#EDDFBA]' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <Package className="w-4 h-4 text-[#C49D3E]" />
              <span>Order History</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'profile' ? 'bg-[#12100E] text-[#EDDFBA]' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <User className="w-4 h-4 text-[#C49D3E]" />
              <span>Client Profile</span>
            </button>

            <Link
              to="/wishlist"
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider text-stone-700 hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Heart className="w-4 h-4 text-[#C49D3E]" />
                <span>Saved Wishlist</span>
              </div>
              <span className="text-[10px] bg-stone-200 px-2 py-0.5 rounded-none">{wishlist.length}</span>
            </Link>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-colors ${
                activeTab === 'addresses' ? 'bg-[#12100E] text-[#EDDFBA]' : 'text-stone-700 hover:bg-stone-100'
              }`}
            >
              <MapPin className="w-4 h-4 text-[#C49D3E]" />
              <span>Insured Addresses</span>
            </button>

            <div className="pt-2 border-t border-stone-200">
              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-rose-600" />
                <span>Sign Out</span>
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-3 space-y-6">
            
            {activeTab === 'orders' && (
              <div className="bg-[#FCFBF9] p-6 sm:p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-medium text-stone-950">Atelier Orders</h2>
                  <p className="text-xs text-stone-500 font-light mt-0.5">Track your handcrafted creations and courier dispatches.</p>
                </div>

                <div className="space-y-4">
                  {mockOrders.map((order) => (
                    <div key={order.id} className="p-5 rounded-none border border-stone-200 bg-white space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 gap-2">
                        <div>
                          <span className="font-mono text-xs font-bold text-stone-900">{order.id}</span>
                          <p className="text-[11px] text-stone-400">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-semibold text-[#846127] font-serif">${order.total.toLocaleString()} USD</span>
                          <p className="text-[11px] text-emerald-800 font-medium">{order.status}</p>
                        </div>
                      </div>

                      <div className="text-xs text-stone-600">
                        <p><strong>Pieces:</strong> {order.items.join(', ')}</p>
                        <p className="text-stone-500 mt-1">Armoured Tracking: <span className="font-mono text-stone-700">{order.tracking}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-[#FCFBF9] p-6 sm:p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-medium text-stone-950">Client Profile</h2>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-stone-500 mb-1">Full Name</label>
                    <input type="text" readOnly value="Lady Charlotte Vance" className="w-full p-2.5 bg-stone-50 border rounded-none text-stone-800" />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Email Address</label>
                    <input type="email" readOnly value="charlotte.vance@atelier-patron.com" className="w-full p-2.5 bg-stone-50 border rounded-none text-stone-800" />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Preferred Salon</label>
                    <input type="text" readOnly value="London — Bond Street, Mayfair" className="w-full p-2.5 bg-stone-50 border rounded-none text-stone-800" />
                  </div>
                  <div>
                    <label className="block text-stone-500 mb-1">Ring Size</label>
                    <input type="text" readOnly value="Size 7 (Standard)" className="w-full p-2.5 bg-stone-50 border rounded-none text-stone-800" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-[#FCFBF9] p-6 sm:p-8 rounded-none border border-[#DFD5C6] shadow-sm space-y-4 text-xs">
                <h2 className="font-serif text-2xl font-medium text-stone-950">Verified Shipping Address</h2>
                <div className="p-4 rounded-none border border-stone-200 bg-white space-y-1 text-stone-700">
                  <p className="font-semibold text-stone-900">Primary Residence</p>
                  <p>740 Park Avenue, Apt 14B</p>
                  <p>New York, NY 10021</p>
                  <p>United States</p>
                  <span className="inline-block mt-2 text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-none border border-emerald-200">
                    Insured Courier Verified
                  </span>
                </div>
              </div>
            )}

          </main>

        </div>
      </div>

    </div>
  );
}
