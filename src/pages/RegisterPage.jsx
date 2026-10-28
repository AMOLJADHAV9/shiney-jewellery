import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError('Please provide a username.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please provide a valid client email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }
    setError('');
    register(username, email, password);
    navigate('/account');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-[85vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-[400px] bg-white p-8 sm:p-10 rounded-none border border-stone-200/60 shadow-[0_15px_45px_rgba(0,0,0,0.08)] space-y-6">
        
        {/* Header Tabs */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <Link
            to="/login"
            className="text-base font-normal text-stone-500 hover:text-stone-900 transition-colors"
          >
            Sign in
          </Link>
          <span className="text-xl font-medium text-stone-900">Create an Account</span>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-none text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
              Username <span className="text-[#E53E3E]">*</span>
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          <span>Already registered with Shiney? </span>
          <Link to="/login" className="text-[#D7A32F] font-semibold underline hover:text-[#C99627]">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
