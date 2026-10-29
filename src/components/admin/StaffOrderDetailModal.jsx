import React, { useState } from 'react';
import { X, CheckCircle2, AlertTriangle, ArrowRight, Truck, FileText, Clock, User, ShieldCheck, MapPin, Building } from 'lucide-react';
import { api } from '../../services/api';

export default function StaffOrderDetailModal({ isOpen, onClose, order, onStatusUpdated, onOpenReceipt }) {
  const [selectedNextStatus, setSelectedNextStatus] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [staffNote, setStaffNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen || !order) return null;

  const handleTransitionSubmit = async (e) => {
    e.preventDefault();
    if (!selectedNextStatus) {
      setError('Please select an allowed next status transition');
      return;
    }

    const confirmed = window.confirm(
      `Confirm order transition to "${selectedNextStatus}"? This action will be permanently recorded in the append-only audit ledger.`
    );
    if (!confirmed) return;

    setIsUpdating(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.admin.updateOrderStatus(order.id, {
        status: selectedNextStatus,
        note: staffNote.trim() || undefined,
        carrierName: carrierName.trim() || undefined,
        trackingNumber: trackingNumber.trim() || undefined,
        source: 'admin_manual',
      });

      setSuccessMsg(`Status successfully transitioned to ${res.statusLabel}`);
      setSelectedNextStatus('');
      setStaffNote('');

      // Refresh order
      const refreshedOrder = await api.admin.getOrderById(order.id);
      onStatusUpdated(refreshedOrder);
    } catch (err) {
      console.error('Transition failed:', err);
      setError(err.message || 'Status transition was rejected');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FCFBF9] w-full max-w-4xl rounded-none border border-[#DFD5C6] shadow-2xl relative my-8 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-stone-200 bg-white shrink-0">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#846127]">
                Atelier Fulfilment Dossier
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-mono font-bold text-stone-900">{order.orderNumber}</span>
            </div>
            <h2 className="font-serif text-xl font-medium text-stone-950 mt-0.5">
              Order Details & Status Fulfilment
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenReceipt && (
              <button
                onClick={() => onOpenReceipt(order.id)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#C49D3E]" />
                <span>Atelier Receipt</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-900 transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Top Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Status & Payment */}
            <div className="p-4 bg-white border border-stone-200 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
                Current State
              </span>
              <p className="font-serif font-medium text-base text-stone-950">{order.statusLabel}</p>
              <div className="pt-1 flex items-center space-x-2 text-[11px] text-stone-600">
                <span>Payment: <strong className="text-emerald-700 uppercase font-mono">{order.payment?.status}</strong></span>
                <span>•</span>
                <span className="uppercase">{order.payment?.provider}</span>
              </div>
              {order.payment?.transactionId && (
                <p className="font-mono text-[10px] text-stone-500 truncate">
                  Txn: {order.payment.transactionId}
                </p>
              )}
            </div>

            {/* Consignee */}
            <div className="p-4 bg-white border border-stone-200 space-y-1 text-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
                Client & Destination
              </span>
              <p className="font-serif font-medium text-sm text-stone-900">{order.client?.recipient}</p>
              <p className="text-stone-500 font-light truncate">{order.client?.email}</p>
              <p className="text-stone-500 font-light truncate">{order.client?.phone}</p>
              <p className="text-stone-600 font-light text-[11px] truncate">
                {order.client?.addressLine1}, {order.client?.city}
              </p>
            </div>

            {/* Carrier & Tracking */}
            <div className="p-4 bg-white border border-stone-200 space-y-1 text-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
                Logistics & Protection
              </span>
              <p className="font-medium text-stone-900">{order.carrierName || 'Armoured Courier Unassigned'}</p>
              <p className="font-mono text-[11px] text-[#846127]">
                Tracking: {order.trackingNumber || 'Pending Dispatch'}
              </p>
              <p className="text-[10px] text-stone-400 font-mono truncate">
                QR Token: {order.qrToken || 'None'}
              </p>
            </div>

          </div>

          {/* Line Items List */}
          <div className="bg-white border border-stone-200 p-4 space-y-3">
            <h3 className="font-serif text-sm font-medium text-stone-900 border-b border-stone-100 pb-2">
              Order Items ({order.items?.length || 0})
            </h3>
            <div className="divide-y divide-stone-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-2.5 flex justify-between items-center text-xs">
                  <div>
                    <p className="font-serif font-medium text-stone-950">{item.productName}</p>
                    <p className="text-[11px] text-stone-500">
                      SKU: <span className="font-mono">{item.sku}</span> {item.variantName ? `• ${item.variantName}` : ''} • Qty: {item.quantity}
                    </p>
                    {item.customEngravingText && (
                      <p className="text-[11px] text-[#846127] italic">
                        Engraving: "{item.customEngravingText}"
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-medium text-stone-900">
                      ${item.lineTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-[10px] text-stone-400 font-mono">
                      @ ${item.unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })} ea
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-stone-200 flex justify-between text-xs font-semibold text-stone-900">
              <span>Total Settled</span>
              <span className="font-serif text-sm text-[#846127]">
                ${order.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })} {order.currency}
              </span>
            </div>
          </div>

          {/* Status Transition Action Form (PRD Section 3 & 4) */}
          <div className="bg-[#FAF6EC] border border-[#C49D3E]/40 p-5 space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#846127] block">
                Allowed State Machine Transitions
              </span>
              <h3 className="font-serif text-base font-medium text-stone-950 mt-0.5">
                Update Fulfilment Stage
              </h3>
              <p className="text-xs text-stone-600 font-light mt-0.5">
                Only transitions permitted by the lifecycle state machine are available. Confirmation is permanently logged in the audit ledger.
              </p>
            </div>

            {order.allowedNextStatuses && order.allowedNextStatuses.length > 0 ? (
              <form onSubmit={handleTransitionSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Next Allowed Status *
                    </label>
                    <select
                      value={selectedNextStatus}
                      onChange={(e) => setSelectedNextStatus(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                    >
                      <option value="">-- Select Permitted Transition --</option>
                      {order.allowedNextStatuses.map((opt) => (
                        <option key={opt.status} value={opt.status}>
                          {opt.label} ({opt.status})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Armoured Carrier Name
                    </label>
                    <input
                      type="text"
                      value={carrierName}
                      onChange={(e) => setCarrierName(e.target.value)}
                      placeholder="e.g. Malca-Amit Armoured / Brinks"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Carrier Tracking Number
                    </label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. MA-89102458"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Staff Note / Handover Reference
                    </label>
                    <input
                      type="text"
                      value={staffNote}
                      onChange={(e) => setStaffNote(e.target.value)}
                      placeholder="e.g. Verified by Master Jeweller Luc"
                      className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isUpdating || !selectedNextStatus}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 font-semibold text-xs uppercase tracking-wider rounded-none shadow-sm flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
                >
                  <span>{isUpdating ? 'Recording Transition...' : 'Confirm Status Transition'}</span>
                  <ArrowRight className="w-4 h-4 text-[#C49D3E]" />
                </button>
              </form>
            ) : (
              <div className="p-3 bg-stone-100 border border-stone-200 text-xs text-stone-600">
                This order has reached a terminal status (<strong>{order.statusLabel}</strong>). No further lifecycle transitions are permitted.
              </div>
            )}
          </div>

          {/* Append-Only Status Audit Log (PRD Section 3 Requirement) */}
          <div className="bg-white border border-stone-200 p-4 space-y-3">
            <h3 className="font-serif text-sm font-medium text-stone-900 border-b border-stone-100 pb-2 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-[#C49D3E]" />
              <span>Append-Only Status Transition History</span>
            </h3>

            {order.statusHistory && order.statusHistory.length > 0 ? (
              <div className="space-y-3 pl-3 border-l-2 border-[#C49D3E]/40 text-xs">
                {order.statusHistory.map((item) => (
                  <div key={item.id} className="relative space-y-0.5">
                    <span className="absolute -left-[19px] top-1 w-2 h-2 rounded-full bg-[#846127]" />
                    <div className="flex flex-wrap items-center justify-between gap-1">
                      <span className="font-semibold text-stone-900">
                        {item.oldStatusLabel} → {item.newStatusLabel}
                      </span>
                      <span className="text-[11px] text-stone-400 font-mono">
                        {new Date(item.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 font-light">
                      Staff Actor: <strong>{item.actor_name}</strong> • Source: <span className="font-mono text-[10px]">{item.source}</span>
                    </p>
                    {item.note && <p className="text-stone-700 italic text-[11px]">"{item.note}"</p>}
                    {item.tracking_number && (
                      <p className="text-[11px] font-mono text-[#846127]">
                        {item.carrier_name || 'Courier'}: {item.tracking_number}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-stone-500 italic">No previous transition history recorded.</p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

