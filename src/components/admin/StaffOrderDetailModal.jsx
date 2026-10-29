import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, AlertTriangle, ArrowRight, Truck, FileText, 
  Clock, ShieldCheck, QrCode, Copy, Check, Printer, 
  ExternalLink, Eye, Package, Sparkles, Camera
} from 'lucide-react';
import { api } from '../../services/api';

export default function StaffOrderDetailModal({ isOpen, onClose, order, onStatusUpdated, onOpenReceipt, onOpenScanner }) {
  const [selectedNextStatus, setSelectedNextStatus] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [staffNote, setStaffNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [copiedToken, setCopiedToken] = useState(false);
  const [inspectingItem, setInspectingItem] = useState(null);

  useEffect(() => {
    if (order) {
      setCarrierName(order.carrierName || '');
      setTrackingNumber(order.trackingNumber || '');
      setSelectedNextStatus(order.allowedNextStatuses?.[0]?.status || '');
      setError('');
      setSuccessMsg('');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  // Copy QR token
  const handleCopyToken = () => {
    const token = order.qrToken || order.orderNumber;
    navigator.clipboard.writeText(token);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  // One-click quick status transition directly from QR dossier
  const handleQuickTransition = async (targetStatus, targetLabel) => {
    const confirmed = window.confirm(
      `Confirm immediate fulfilment advance to "${targetLabel || targetStatus}"?\n\nOrder: ${order.orderNumber}\nCarrier: ${carrierName || order.carrierName || 'Armoured Courier'}\n\nThis action will be permanently recorded in the append-only audit ledger.`
    );
    if (!confirmed) return;

    setIsUpdating(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.admin.updateOrderStatus(order.id, {
        status: targetStatus,
        carrierName: carrierName.trim() || order.carrierName || undefined,
        trackingNumber: trackingNumber.trim() || order.trackingNumber || undefined,
        note: staffNote.trim() || `Fulfilment milestone advanced via Atelier QR Dossier to ${targetLabel || targetStatus}`,
        source: 'admin_manual',
      });

      setSuccessMsg(`Fulfilment stage updated to: ${res.statusLabel || targetStatus}`);
      const refreshedOrder = await api.admin.getOrderById(order.id);
      onStatusUpdated(refreshedOrder);
    } catch (err) {
      console.error('Quick transition failed:', err);
      setError(err.message || 'Status transition was rejected');
    } finally {
      setIsUpdating(false);
    }
  };

  // Detailed transition form submit
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

  // Print Dispatch QR Sticker
  const handlePrintDispatchSticker = () => {
    const printWindow = window.open('', '_blank', 'width=600,height=750');
    if (!printWindow) return;

    const qrImg = order.qrCodeDataUrl || '';
    const itemsListHtml = (order.items || [])
      .map(
        (it) => `
        <div style="display:flex; justify-content:space-between; margin-bottom:6px; font-size:12px; border-bottom:1px dashed #ddd; padding-bottom:4px;">
          <span><strong>${it.productName}</strong> (SKU: ${it.sku}) × ${it.quantity}</span>
          <span>$${it.lineTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>`
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dispatch Seal • ${order.orderNumber}</title>
          <style>
            @page { size: 100mm 150mm; margin: 6mm; }
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #12100E; margin: 0; padding: 12px; }
            .badge { font-size: 10px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; color: #846127; }
            .title { font-size: 18px; font-weight: bold; margin: 2px 0 8px 0; border-bottom: 2px solid #12100E; padding-bottom: 4px; }
            .qr-box { text-align: center; margin: 12px 0; padding: 10px; border: 1px solid #C49D3E; background: #fff; }
            .qr-box img { width: 140px; height: 140px; }
            .token { font-family: monospace; font-size: 10px; color: #555; margin-top: 4px; word-break: break-all; }
            .meta { font-size: 11px; margin-bottom: 8px; line-height: 1.4; }
            .items { margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="badge">Shiney Haute Joaillerie • Atelier Dispatch</div>
          <div class="title">ORDER ${order.orderNumber}</div>
          <div class="meta">
            <div><strong>Consignee:</strong> ${order.client?.recipient || 'Valued Client'}</div>
            <div><strong>Destination:</strong> ${order.client?.addressLine1 || ''}, ${order.client?.city || ''} ${order.client?.postalCode || ''}, ${order.client?.country || ''}</div>
            <div><strong>Carrier:</strong> ${order.carrierName || 'Armoured Courier'} • <strong>Tracking:</strong> ${order.trackingNumber || 'Pending'}</div>
            <div><strong>Current Stage:</strong> ${order.statusLabel || order.status}</div>
          </div>
          <div class="qr-box">
            <img src="${qrImg}" alt="QR Seal" />
            <div class="token">Token: ${order.qrToken || order.orderNumber}</div>
            <div style="font-size: 9px; color: #888; text-transform: uppercase; margin-top: 2px;">Scannable Fulfilment Verification</div>
          </div>
          <div class="items">
            <div style="font-size:10px; font-weight:bold; text-transform:uppercase; margin-bottom:6px; color:#555;">Commission Pieces</div>
            ${itemsListHtml}
          </div>
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FCFBF9] w-full max-w-4xl rounded-none border border-[#DFD5C6] shadow-2xl relative my-8 overflow-hidden max-h-[92vh] flex flex-col">
        
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
            {onOpenScanner && (
              <button
                onClick={() => {
                  onClose();
                  onOpenScanner();
                }}
                title="Open Live Camera Scanner"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors border border-[#C49D3E]/40"
              >
                <Camera className="w-3.5 h-3.5 text-[#C49D3E]" />
                <span className="hidden sm:inline">Camera Scanner</span>
              </button>
            )}

            <button
              onClick={handlePrintDispatchSticker}
              title="Print Dispatch QR Sticker"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-[#C49D3E]" />
              <span className="hidden sm:inline">Print QR Sticker</span>
            </button>

            {onOpenReceipt && (
              <button
                onClick={() => onOpenReceipt(order.id)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#C49D3E]" />
                <span className="hidden sm:inline">Atelier Receipt</span>
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
        <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
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

          {/* ========================================================================= */}
          {/* PRODUCT & ORDER FULFILMENT QR CODE HERO DOSSIER CARD */}
          {/* ========================================================================= */}
          <div className="bg-[#12100E] border-2 border-[#C49D3E]/60 p-5 text-white shadow-xl relative overflow-hidden">
            {/* Background luxury watermark */}
            <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
              <QrCode className="w-48 h-48 text-[#EDDFBA]" />
            </div>

            {/* Top Bar inside card */}
            <div className="flex flex-wrap items-center justify-between pb-3 mb-4 border-b border-stone-800 gap-2">
              <div className="flex items-center space-x-2">
                <QrCode className="w-4 h-4 text-[#C49D3E]" />
                <span className="text-[11px] font-mono tracking-widest uppercase text-[#EDDFBA] font-bold">
                  Official Fulfilment & Product QR Seal
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#C49D3E]/20 text-[#EDDFBA] border border-[#C49D3E]/40 font-mono uppercase">
                  TAMPER-EVIDENT
                </span>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <button
                  type="button"
                  onClick={handleCopyToken}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-stone-900 border border-stone-700 hover:border-[#C49D3E] text-[#EDDFBA] text-[11px] font-mono transition-colors"
                >
                  {copiedToken ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#C49D3E]" />}
                  <span>{copiedToken ? 'Copied Token' : 'Copy QR Token'}</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrintDispatchSticker}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 bg-[#C49D3E] hover:bg-[#b08b32] text-stone-950 font-bold text-[11px] uppercase tracking-wider transition-colors"
                >
                  <Printer className="w-3 h-3" />
                  <span>Print Label</span>
                </button>
              </div>
            </div>

            {/* Main Content Grid: Scannable QR (Left) + Quick Status Changer (Right) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
              
              {/* Left Column: High-Res Scannable QR Code */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-stone-950/80 border border-stone-800">
                {order.qrCodeDataUrl ? (
                  <div className="bg-white p-2.5 border-2 border-[#C49D3E] shadow-lg">
                    <img
                      src={order.qrCodeDataUrl}
                      alt={`QR Code for ${order.orderNumber}`}
                      className="w-32 h-32 sm:w-36 sm:h-36 object-contain block mx-auto"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-stone-900 flex items-center justify-center border border-stone-800">
                    <QrCode className="w-12 h-12 text-stone-600 animate-pulse" />
                  </div>
                )}
                
                <div className="mt-2 text-center w-full">
                  <div className="font-mono text-[10px] text-[#EDDFBA] font-bold tracking-wider truncate">
                    {order.orderNumber}
                  </div>
                  <div className="font-mono text-[9px] text-stone-400 truncate max-w-[200px] mx-auto">
                    Token: {order.qrToken || 'Verified'}
                  </div>
                  <span className="text-[8px] uppercase tracking-widest text-[#C49D3E] block mt-1">
                    Scannable by optical terminals
                  </span>
                </div>
              </div>

              {/* Right Column: Status Fulfilment Actions & One-Click Advance */}
              <div className="md:col-span-8 space-y-3.5">
                
                {/* Current State Info */}
                <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-stone-900/90 border border-stone-800">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
                      Current Fulfilment Milestone
                    </span>
                    <span className="text-sm sm:text-base font-serif font-bold text-[#EDDFBA]">
                      {order.statusLabel || order.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
                      Carrier & Protection
                    </span>
                    <span className="text-xs font-mono text-stone-200">
                      {order.carrierName || "Brink's Armoured Courier"}
                    </span>
                    {order.trackingNumber && (
                      <div className="font-mono text-[11px] text-[#C49D3E]">
                        {order.trackingNumber}
                      </div>
                    )}
                  </div>
                </div>

                {/* Direct One-Click Status Advance Buttons */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase tracking-wider font-bold text-[#C49D3E] flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C49D3E]" />
                      <span>One-Click Fulfilment Stage Advance</span>
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Instantly change status from QR dossier
                    </span>
                  </div>

                  {order.allowedNextStatuses && order.allowedNextStatuses.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {order.allowedNextStatuses.map((st, idx) => (
                        <button
                          key={st.status}
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleQuickTransition(st.status, st.label)}
                          className={`inline-flex items-center space-x-1.5 px-3 py-2 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 ${
                            idx === 0
                              ? 'bg-[#C49D3E] hover:bg-[#d6af4b] text-stone-950 shadow-md ring-1 ring-[#EDDFBA]/40'
                              : 'bg-stone-800 hover:bg-stone-700 text-[#EDDFBA] border border-stone-700'
                          }`}
                          title={`Advance order to ${st.label}`}
                        >
                          <span>{idx === 0 ? '▶ Advance to:' : 'Advance to:'} {st.label}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-stone-900 border border-stone-800 text-xs text-stone-400">
                      Order is at terminal status (<strong>{order.statusLabel}</strong>). No further lifecycle transitions are permitted.
                    </div>
                  )}

                  <p className="text-[10px] text-stone-400 italic">
                    Clicking any milestone above executes the transition, writes to the immutable audit ledger, and updates customer tracking.
                  </p>
                </div>

              </div>
            </div>
          </div>

          {/* Top Metadata Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Status & Payment */}
            <div className="p-4 bg-white border border-stone-200 space-y-1.5 text-xs">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-stone-400 block">
                Financial Settlement
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
                Armoured Logistics & Security
              </span>
              <p className="font-medium text-stone-900">{order.carrierName || "Brink's Armoured Courier"}</p>
              <p className="font-mono text-[11px] text-[#846127]">
                Tracking: {order.trackingNumber || 'Pending Dispatch'}
              </p>
              <p className="text-[10px] text-stone-400 font-mono truncate">
                QR Token: {order.qrToken || 'None'}
              </p>
            </div>

          </div>

          {/* Line Items List with Product Thumbnails & Product QR Badges */}
          <div className="bg-white border border-stone-200 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="font-serif text-sm font-medium text-stone-900 flex items-center space-x-2">
                <Package className="w-4 h-4 text-[#C49D3E]" />
                <span>Order Pieces ({order.items?.length || 0})</span>
              </h3>
              <span className="text-[11px] text-stone-500 font-light">
                Each piece carries certified provenance and QR badge
              </span>
            </div>

            <div className="divide-y divide-stone-100">
              {order.items?.map((item) => (
                <div key={item.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs">
                  
                  {/* Left: Thumbnail & Details */}
                  <div className="flex items-center space-x-3">
                    {item.primaryImage ? (
                      <img
                        src={item.primaryImage}
                        alt={item.productName}
                        className="w-14 h-14 object-cover border border-stone-200 shrink-0 bg-stone-50"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0">
                        <Package className="w-6 h-6 text-stone-400" />
                      </div>
                    )}

                    <div>
                      <p className="font-serif font-medium text-sm text-stone-950">{item.productName}</p>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        SKU: <span className="font-mono font-bold text-stone-700">{item.sku}</span> 
                        {item.variantName ? ` • ${item.variantName}` : ''} • Qty: <strong>{item.quantity}</strong>
                      </p>
                      {item.customEngravingText && (
                        <p className="text-[11px] text-[#846127] italic mt-0.5">
                          Engraving: "{item.customEngravingText}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Product Item QR Badge & Line Price */}
                  <div className="flex items-center space-x-4 self-end sm:self-center">
                    
                    {/* Item QR Code Badge */}
                    {item.qrCodeDataUrl && (
                      <div 
                        onClick={() => setInspectingItem(item)}
                        className="cursor-pointer group flex items-center space-x-1.5 p-1 bg-stone-50 hover:bg-[#FAF6EC] border border-stone-200 hover:border-[#C49D3E] transition-colors"
                        title="Click to inspect Piece QR Seal"
                      >
                        <img
                          src={item.qrCodeDataUrl}
                          alt={`QR for ${item.sku}`}
                          className="w-8 h-8 object-contain bg-white border border-stone-200"
                        />
                        <div className="text-left hidden sm:block pr-1">
                          <span className="text-[9px] font-mono text-stone-600 block group-hover:text-[#846127]">
                            Piece QR
                          </span>
                          <span className="text-[8px] text-stone-400 uppercase tracking-wider block">
                            Inspect
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="text-right min-w-[90px]">
                      <p className="font-mono font-medium text-sm text-stone-900">
                        ${item.lineTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-[10px] text-stone-400 font-mono">
                        @ ${item.unitPrice?.toLocaleString(undefined, { minimumFractionDigits: 2 })} ea
                      </p>
                    </div>

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

          {/* Status Transition Action Form (Detailed Form) */}
          <div className="bg-[#FAF6EC] border border-[#C49D3E]/40 p-5 space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#846127] block">
                Detailed Transition Controls
              </span>
              <h3 className="font-serif text-base font-medium text-stone-950 mt-0.5">
                Update Fulfilment Stage & Carrier Credentials
              </h3>
              <p className="text-xs text-stone-600 font-light mt-0.5">
                Adjust carrier information or add custom notes before applying a permitted status transition.
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
                      placeholder="e.g. Brink's Armoured Courier"
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
                      placeholder="e.g. BRK-2026-89102"
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
                      placeholder="e.g. Inspected & sealed by Atelier Master"
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

          {/* Append-Only Status Transition Audit Log */}
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

      {/* Individual Piece QR Inspection Lightbox Modal */}
      {inspectingItem && (
        <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#FCFBF9] p-6 max-w-sm w-full border border-[#DFD5C6] shadow-2xl space-y-4 text-center">
            <div className="flex items-center justify-between border-b border-stone-200 pb-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#846127]">
                Piece QR Inspection
              </span>
              <button
                onClick={() => setInspectingItem(null)}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-white border border-[#C49D3E] inline-block shadow-inner">
              <img
                src={inspectingItem.qrCodeDataUrl}
                alt={inspectingItem.sku}
                className="w-44 h-44 object-contain"
              />
            </div>

            <div>
              <p className="font-serif font-medium text-stone-900">{inspectingItem.productName}</p>
              <p className="text-xs font-mono text-stone-500 mt-0.5">SKU: {inspectingItem.sku}</p>
              <p className="text-[11px] text-[#846127] font-mono mt-1">Order: {order.orderNumber}</p>
            </div>

            <button
              type="button"
              onClick={() => setInspectingItem(null)}
              className="w-full py-2 bg-stone-900 text-[#EDDFBA] text-xs font-semibold uppercase tracking-wider"
            >
              Close Inspection
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
