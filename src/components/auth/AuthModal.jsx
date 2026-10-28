import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, CheckCircle2, Eye, EyeOff, LogOut, Package, Heart } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AuthModal({ anchorRef }) {
  const {
    user,
    isAuthenticated,
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    setAuthModalTab,
    login,
    register,
    logout
  } = useAuth();

  const navigate = useNavigate();
  const modalRef = useRef(null);

  // Form states
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerUsername, setRegisterUsername] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target) &&
        anchorRef?.current &&
        !anchorRef.current.contains(event.target)
      ) {
        closeAuthModal();
      }
    };

    if (isAuthModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isAuthModalOpen, closeAuthModal, anchorRef]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!loginIdentifier.trim()) {
      setError('Please provide your username or email address.');
      return;
    }
    if (!loginPassword) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    login(loginIdentifier, loginPassword);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!registerUsername.trim()) {
      setError('Please enter a username.');
      return;
    }
    if (!registerEmail.trim() || !registerEmail.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    if (registerPassword.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    setError('');
    register(registerUsername, registerEmail, registerPassword);
    setSuccessMessage('Account registered successfully! Welcome to Shiney.');
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes('@')) {
      setError('Please provide a valid client email address.');
      return;
    }
    setError('');
    setForgotSubmitted(true);
  };

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Account Authorization"
      className="absolute top-full right-0 mt-3 w-[330px] sm:w-[360px] bg-white text-stone-900 rounded-none shadow-[0_15px_45px_rgba(0,0,0,0.18)] border border-stone-100 p-7 z-50 animate-in fade-in zoom-in-95 duration-200 font-sans"
    >
      
      {/* If Authenticated: Show Patron Profile Menu */}
      {isAuthenticated ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-none bg-[#12100E] text-[#EDDFBA] flex items-center justify-center font-serif text-sm font-bold">
                {user.name ? user.name[0].toUpperCase() : 'P'}
              </div>
              <div>
                <p className="font-serif text-sm font-semibold text-stone-900">{user.name}</p>
                <p className="text-[10px] text-[#C49D3E] font-medium">{user.tier}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-xs">
            <Link
              to="/account"
              onClick={closeAuthModal}
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-none hover:bg-[#FAF8F5] text-stone-800 transition-colors"
            >
              <User className="w-4 h-4 text-[#D7A32F]" />
              <span>My Patron Dashboard</span>
            </Link>

            <Link
              to="/account"
              onClick={closeAuthModal}
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-none hover:bg-[#FAF8F5] text-stone-800 transition-colors"
            >
              <Package className="w-4 h-4 text-[#D7A32F]" />
              <span>Atelier Orders</span>
            </Link>

            <Link
              to="/wishlist"
              onClick={closeAuthModal}
              className="flex items-center space-x-2.5 py-2.5 px-3 rounded-none hover:bg-[#FAF8F5] text-stone-800 transition-colors"
            >
              <Heart className="w-4 h-4 text-[#D7A32F]" />
              <span>Saved Wishlist</span>
            </Link>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <button
              onClick={() => {
                logout();
                closeAuthModal();
              }}
              className="w-full flex items-center justify-center space-x-2 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-none transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      ) : (
        /* If Not Logged In: Exact Match with User Screenshot */
        <div>
          
          {/* Top Switcher Tabs (Exact Match with Screenshot) */}
          <div className="flex items-center justify-between mb-5">
            <button
              type="button"
              onClick={() => {
                setAuthModalTab('login');
                setError('');
                setSuccessMessage('');
              }}
              className={`text-[16px] sm:text-[17px] transition-colors leading-tight ${
                authModalTab === 'login'
                  ? 'font-medium text-stone-900'
                  : 'font-normal text-stone-500 hover:text-stone-800'
              }`}
            >
              Sign in
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthModalTab('register');
                setError('');
                setSuccessMessage('');
              }}
              className={`text-[16px] sm:text-[17px] transition-colors leading-tight ${
                authModalTab === 'register'
                  ? 'font-medium text-stone-900'
                  : 'font-normal text-stone-500 hover:text-stone-800'
              }`}
            >
              Create an Account
            </button>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded-none bg-rose-50 border border-rose-200 text-xs text-rose-700 leading-normal">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-2.5 rounded-none bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 leading-normal">
              {successMessage}
            </div>
          )}

          {/* TAB 1: SIGN IN (Matching Screenshot Exactly) */}
          {authModalTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
                  Username or email <span className="text-[#E53E3E]">*</span>
                </label>
                <input
                  type="text"
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder="Username"
                  autoFocus
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
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-4 py-3 bg-white border border-stone-200 rounded-none text-sm placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D7A32F] focus:ring-1 focus:ring-[#D7A32F] transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3.5 text-stone-400 hover:text-stone-700 transition-colors"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Gold LOGIN Button (Matching Screenshot Exactly) */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#D7A32F] hover:bg-[#C99627] active:bg-[#B88720] text-white font-bold text-xs uppercase tracking-wider rounded-none shadow-sm transition-all mt-1"
              >
                LOGIN
              </button>

              {/* Bottom Right: Lost your password? with Dotted Underline (Matching Screenshot) */}
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('forgot');
                    setError('');
                    setSuccessMessage('');
                  }}
                  className="text-xs text-stone-700 hover:text-stone-950 underline decoration-dotted underline-offset-4 cursor-pointer transition-colors"
                >
                  Lost your password?
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CREATE AN ACCOUNT (Matching Screenshot Style) */}
          {authModalTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
                  Username <span className="text-[#E53E3E]">*</span>
                </label>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  placeholder="Username"
                  autoFocus
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-none text-sm placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D7A32F] focus:ring-1 focus:ring-[#D7A32F] transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
                  Email address <span className="text-[#E53E3E]">*</span>
                </label>
                <input
                  type="email"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
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
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 bg-white border border-stone-200 rounded-none text-sm placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D7A32F] focus:ring-1 focus:ring-[#D7A32F] transition-all"
                />
              </div>

              <p className="text-[11px] text-stone-500 leading-relaxed pt-0.5">
                A link to set a new password will be sent to your email address. Your personal data will be used to support your experience throughout this website.
              </p>

              {/* Gold REGISTER Button */}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#D7A32F] hover:bg-[#C99627] active:bg-[#B88720] text-white font-bold text-xs uppercase tracking-wider rounded-none shadow-sm transition-all mt-1"
              >
                REGISTER
              </button>

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setAuthModalTab('login');
                    setError('');
                  }}
                  className="text-xs text-stone-700 hover:text-stone-950 underline decoration-dotted underline-offset-4 cursor-pointer"
                >
                  Already have an account?
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: LOST YOUR PASSWORD */}
          {authModalTab === 'forgot' && (
            <div className="space-y-4">
              {forgotSubmitted ? (
                <div className="text-center py-4 space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <p className="font-serif text-base font-semibold text-stone-900">Recovery Email Sent</p>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    If an atelier patron account exists for <strong>{forgotEmail}</strong>, password reset instructions have been dispatched.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthModalTab('login');
                      setForgotSubmitted(false);
                      setForgotEmail('');
                    }}
                    className="text-xs text-[#D7A32F] font-semibold underline pt-2 block mx-auto hover:text-[#C99627]"
                  >
                    Return to Sign In
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotSubmit} className="space-y-4">
                  <p className="text-xs text-stone-600 leading-relaxed font-light">
                    Lost your password? Please enter your username or email address. You will receive a link to create a new password via email.
                  </p>

                  <div>
                    <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
                      Username or email <span className="text-[#E53E3E]">*</span>
                    </label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="Username or email"
                      autoFocus
                      className="w-full px-4 py-3 bg-white border border-stone-200 rounded-none text-sm placeholder:text-stone-400 text-stone-900 focus:outline-none focus:border-[#D7A32F] focus:ring-1 focus:ring-[#D7A32F]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#D7A32F] hover:bg-[#C99627] active:bg-[#B88720] text-white font-bold text-xs uppercase tracking-wider rounded-none shadow-sm transition-all"
                  >
                    RESET PASSWORD
                  </button>

                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => setAuthModalTab('login')}
                      className="text-xs text-stone-600 hover:text-stone-900 underline decoration-dotted underline-offset-4"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}

