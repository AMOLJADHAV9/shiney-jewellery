import React, { useState, useEffect } from 'react';
import { X, Truck, CheckCircle2, Clock, ShieldCheck, MapPin, RefreshCw, FileText, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function TrackingModal({ isOpen, onClose, orderId, onOpenReceipt }) {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchTracking = async () => {
    if (!orderId) return;
    try {
      setError('');
      const data = await api.orders.getTracking(orderId);
      setTracking(data);
    } catch (err) {
      console.error('Failed to load tracking data:', err);
      setError(err.message || 'Unable to retrieve delivery tracking details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isOpen && orderId) {
      setLoading(true);
      fetchTracking();
    }
  }, [isOpen, orderId]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTracking();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FCFBF9] w-full max-w-2xl rounded-none border border-[#DFD5C6] shadow-2xl relative my-8 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-[#12100E] text-[#EDDFBA] flex items-center justify-center">
              <Truck className="w-4 h-4 text-[#C49D3E]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#846127]">
                Armoured Transit Tracking
              </span>
              <h2 className="font-serif text-lg font-medium text-stone-950">
                Order {tracking?.orderNumber || 'Tracking'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              disabled={refreshing || loading}
              className="p-2 text-stone-500 hover:text-stone-900 transition-colors disabled:opacity-40"
              title="Refresh tracking status"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-[#C49D3E]' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-7 h-7 text-[#C49D3E] animate-spin mx-auto" />
              <p className="text-xs text-stone-500 font-light uppercase tracking-wider">
                Accessing Courier Tracking Satellite...
              </p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          ) : tracking ? (
            <>
              {/* Summary Card */}
              <div className="bg-[#FAF8F5] p-4 border border-[#EDDFBA] rounded-none grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-0.5">
                    Current Milestone
                  </span>
                  <p className="font-serif font-medium text-sm text-stone-950">
                    {tracking.currentStatusLabel}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-0.5">
                    Armoured Carrier
                  </span>
                  <p className="font-medium text-stone-800">
                    {tracking.carrierName || 'Malca-Amit Armoured'}
                  </p>
                  {tracking.trackingNumber && (
                    <p className="font-mono text-[11px] text-[#846127]">
                      {tracking.trackingNumber}
                    </p>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block mb-0.5">
                    Destination
                  </span>
                  <div className="flex items-center space-x-1 text-stone-800">
                    <MapPin className="w-3.5 h-3.5 text-[#C49D3E] shrink-0" />
                    <span className="truncate">{tracking.destination}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar & Milestone Nodes */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-serif font-medium text-stone-900">Fulfilment Journey</span>
                  <span className="font-mono text-[11px] font-semibold text-[#846127]">
                    {tracking.progressPercent}% Complete
                  </span>
                </div>

                {/* Bar */}
                <div className="w-full bg-stone-200 h-2 rounded-none overflow-hidden">
                  <div
                    className="bg-[#C49D3E] h-full transition-all duration-700"
                    style={{ width: `${Math.max(5, tracking.progressPercent)}%` }}
                  />
                </div>

                {/* Milestone Step Pills (8 Shipping Pipeline Stages) */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 pt-2">
                  {tracking.milestones?.map((m) => (
                    <div
                      key={m.key}
                      className={`p-2 text-center rounded-none border transition-all ${
                        m.completed
                          ? 'border-[#C49D3E] bg-[#F6F0DD]/50 text-stone-900 font-medium'
                          : 'border-stone-200 bg-white text-stone-400 opacity-60'
                      }`}
                    >
                      <div className="flex justify-center mb-1">
                        {m.completed ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#846127]" />
                        ) : (
                          <Clock className="w-3.5 h-3.5 text-stone-300" />
                        )}
                      </div>
                      <p className="text-[10px] leading-tight font-sans line-clamp-2">{m.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chronological Event Log */}
              <div className="space-y-3 pt-4 border-t border-stone-200">
                <h3 className="font-serif text-sm font-medium text-stone-900 uppercase tracking-wider">
                  Chronological Updates
                </h3>

                <div className="space-y-3 relative pl-4 border-l border-stone-300">
                  {tracking.timelineEvents?.map((evt, idx) => (
                    <div key={idx} className="relative group">
                      {/* Node Bullet */}
                      <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C49D3E] border-2 border-white ring-1 ring-stone-300" />

                      <div className="space-y-0.5">
                        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between text-xs">
                          <span className="font-semibold text-stone-900">{evt.title}</span>
                          <span className="text-[11px] text-stone-400 font-mono">
                            {new Date(evt.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 font-light">{evt.description}</p>
                        {evt.trackingNumber && (
                          <p className="text-[11px] font-mono text-[#846127]">
                            Tracking Ref: {evt.trackingNumber}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                <div className="flex items-center space-x-2 text-[11px] text-stone-500">
                  <ShieldCheck className="w-4 h-4 text-[#C49D3E]" />
                  <span>Insured transit with armed security handover and signature proof.</span>
                </div>

                {onOpenReceipt && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenReceipt(orderId);
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#C49D3E]" />
                    <span>Download Receipt</span>
                  </button>
                )}
              </div>
            </>
          ) : null}
        </div>

      </div>
    </div>
  );
}

