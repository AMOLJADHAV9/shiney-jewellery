import React, { useState } from 'react';
import { X, QrCode, Search, Camera, AlertCircle, ArrowRight, CheckCircle2, ShieldAlert } from 'lucide-react';
import { api } from '../../services/api';

export default function StaffQrScannerModal({ isOpen, onClose, onOrderResolved }) {
  const [scanInput, setScanInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleResolve = async (e) => {
    e?.preventDefault();
    if (!scanInput.trim()) {
      setError('Please provide a QR token, raw QR payload, or Order number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const order = await api.admin.scanQrOrder(scanInput.trim());
      onOrderResolved(order);
      onClose();
    } catch (err) {
      console.error('Scan resolution failed:', err);
      setError(err.message || 'Unrecognized QR code or Order reference. Please re-verify.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FCFBF9] w-full max-w-lg rounded-none border border-[#DFD5C6] shadow-2xl relative my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-[#12100E] text-[#EDDFBA] flex items-center justify-center">
              <QrCode className="w-4 h-4 text-[#C49D3E]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#846127]">
                Atelier Fulfilment Protocol
              </span>
              <h2 className="font-serif text-lg font-medium text-stone-950">
                Staff QR Receipt Scanner
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6">
          {/* Important Security Notice (PRD Section 3 Requirement) */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-none text-xs text-amber-900 space-y-1">
            <div className="flex items-center space-x-1.5 font-semibold text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Scanning Protocol (PRD Addendum 1.1)</span>
            </div>
            <p className="text-[11px] text-amber-800 font-light leading-relaxed">
              Scanning an order QR code safely opens the order dossier for review. Scanning alone <strong>never</strong> alters order status without explicit staff verification.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Simulated Scanner Viewport */}
          <div className="border-2 border-dashed border-[#C49D3E]/60 bg-stone-100 p-8 text-center space-y-3 relative">
            <div className="w-16 h-16 mx-auto rounded-none bg-white border border-[#C49D3E] flex items-center justify-center text-[#846127] shadow-sm">
              <Camera className="w-8 h-8 text-[#C49D3E]" />
            </div>
            <div>
              <p className="font-serif text-sm font-medium text-stone-900">
                Optical QR Scanner Ready
              </p>
              <p className="text-[11px] text-stone-500 font-light max-w-xs mx-auto mt-0.5">
                Scan with handheld barcode scanner, optical camera, or paste the QR payload string below.
              </p>
            </div>
          </div>

          {/* Manual Input Fallback */}
          <form onSubmit={handleResolve} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                Scan Payload, QR Token, or Order Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value)}
                  placeholder="e.g. SH-2026-68335 or paste receipt QR string"
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                />
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !scanInput.trim()}
              className="w-full py-3.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 font-semibold text-xs uppercase tracking-widest rounded-none shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              <span>{loading ? 'Resolving Atelier Order...' : 'Inspect Order Dossier'}</span>
              <ArrowRight className="w-4 h-4 text-[#C49D3E]" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

