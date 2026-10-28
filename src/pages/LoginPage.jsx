import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!identifier.trim()) {
      setError('Please provide your username or email address.');
      return;
    }
    if (!password) {
      setError('Please provide your password.');
      return;
    }
    setError('');
    login(identifier, password);
    navigate('/account');
  };

  return (
    <div className="bg-[#FAF8F5] min-h-[85vh] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-[400px] bg-white p-8 sm:p-10 rounded-none border border-stone-200/60 shadow-[0_15px_45px_rgba(0,0,0,0.08)] space-y-6">
        
        {/* Header Tabs */}
        <div className="flex items-center justify-between pb-2 border-b border-stone-100">
          <span className="text-xl font-medium text-stone-900">Sign in</span>
          <Link
            to="/register"
            className="text-base font-normal text-stone-500 hover:text-stone-900 transition-colors"
          >
            Create an Account
          </Link>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-none text-xs text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[13px] font-normal text-stone-700 mb-1.5">
              Username or email <span className="text-[#E53E3E]">*</span>
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

        <div className="pt-4 border-t border-stone-100 text-center text-xs text-stone-600">
          <span>Don't have an atelier account? </span>
          <Link to="/register" className="text-[#D7A32F] font-semibold underline hover:text-[#C99627]">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}
