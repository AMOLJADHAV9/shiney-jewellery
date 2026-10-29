import React, { useRef, useState, useEffect } from 'react';
import { X, Printer, Download, ShieldCheck, Gem, Sparkles, Building, CheckCircle2, RefreshCw, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function ReceiptModal({ isOpen, onClose, receiptData: initialReceiptData, orderId }) {
  const printRef = useRef(null);
  const [data, setData] = useState(initialReceiptData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialReceiptData) {
      setData(initialReceiptData);
      setLoading(false);
      setError('');
    } else if (isOpen && orderId) {
      setLoading(true);
      setError('');
      api.orders.getReceipt(orderId)
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          console.error('Failed to load receipt:', err);
          setError(err.message || 'Unable to retrieve certified order receipt.');
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen, orderId, initialReceiptData]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#FCFBF9] p-8 max-w-sm w-full text-center space-y-4 border border-[#DFD5C6] shadow-xl">
          <RefreshCw className="w-8 h-8 mx-auto text-[#C49D3E] animate-spin" />
          <p className="font-serif text-lg text-stone-900">Retrieving Certified Receipt</p>
          <p className="text-xs text-stone-500 font-light">Generating tamper-evident provenance and QR credentials...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#FCFBF9] p-6 max-w-md w-full space-y-4 border border-rose-200 shadow-xl text-center">
          <AlertCircle className="w-8 h-8 mx-auto text-rose-600" />
          <h3 className="font-serif text-lg text-stone-900">Receipt Not Available</h3>
          <p className="text-xs text-stone-600 font-light leading-relaxed">
            {error || 'No receipt record found for this order reference.'}
          </p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#12100E] text-[#EDDFBA] text-xs font-semibold uppercase tracking-wider rounded-none"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const {
    shop,
    receiptNumber,
    orderNumber,
    orderDate,
    receiptIssuedDate,
    version,
    statusLabel,
    payment,
    client,
    items,
    totals,
    qrCodeDataUrl,
    qrToken,
  } = data;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static print:block">
      {/* Container */}
      <div className="bg-[#FCFBF9] w-full max-w-3xl rounded-none border border-[#DFD5C6] shadow-2xl relative my-8 print:m-0 print:border-none print:shadow-none print:w-full">
        
        {/* Modal Top Actions (Hidden in print) */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 bg-white print:hidden">
          <div className="flex items-center space-x-2">
            <Gem className="w-5 h-5 text-[#C49D3E]" />
            <span className="font-serif text-base font-semibold text-stone-900 tracking-wide">
              Official Atelier Receipt & Provenance Certificate
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider rounded-none transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
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

        {/* Printable Receipt Content */}
        <div ref={printRef} className="p-6 sm:p-10 space-y-8 bg-[#FCFBF9] text-stone-900 print:p-6 print:bg-white">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start border-b-2 border-stone-900 pb-6 gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#846127]">
                Haute Joaillerie Atelier
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-stone-950 mt-1">
                {shop.name}
              </h1>
              <p className="text-xs text-stone-500 font-light mt-0.5">{shop.tagline}</p>
              <p className="text-[11px] text-stone-500 font-light mt-1 max-w-sm">{shop.address}</p>
              <p className="text-[11px] text-stone-500 font-light">
                {shop.contactEmail} • {shop.contactPhone}
              </p>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block bg-[#12100E] text-[#EDDFBA] px-3 py-1 text-[11px] uppercase tracking-wider font-semibold">
                Official Tax Receipt
              </div>
              <p className="text-xs font-mono font-semibold text-stone-900 pt-1">
                Receipt: <span className="text-stone-950">{receiptNumber}</span>
              </p>
              <p className="text-xs font-mono text-stone-600">
                Order: <span className="font-semibold">{orderNumber}</span>
              </p>
              <p className="text-[11px] text-stone-500 font-light">Order Date: {orderDate}</p>
              <p className="text-[11px] text-stone-500 font-light">Issued: {receiptIssuedDate}</p>
            </div>
          </div>

          {/* Client & Settlement Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-[#F6F0DD]/30 p-4 border border-[#EDDFBA] text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#846127] block mb-1">
                Insured Consignee / Delivery Address
              </span>
              <p className="font-serif font-medium text-stone-900 text-sm">{client.recipient}</p>
              <p className="text-stone-600 font-light">{client.shippingAddress.line1}</p>
              {client.shippingAddress.line2 && (
                <p className="text-stone-600 font-light">{client.shippingAddress.line2}</p>
              )}
              <p className="text-stone-600 font-light">
                {client.shippingAddress.city}, {client.shippingAddress.state} {client.shippingAddress.postalCode}
              </p>
              <p className="text-stone-600 font-light">{client.shippingAddress.country}</p>
              <p className="text-stone-500 font-light mt-1">{client.phone} • {client.email}</p>
            </div>

            <div className="space-y-1 sm:border-l sm:border-[#EDDFBA] sm:pl-6">
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#846127] block mb-1">
                Settlement & Fulfilment State
              </span>
              <p className="text-stone-700">
                Current Status: <strong className="text-stone-950">{statusLabel}</strong>
              </p>
              <p className="text-stone-700">
                Payment Rail: <strong className="text-stone-950 uppercase">{payment.provider}</strong>
              </p>
              <p className="text-stone-700 font-mono text-[11px] truncate">
                Ref / Txn: <span className="text-emerald-800">{payment.transactionId || 'Authorized'}</span>
              </p>
              <p className="text-stone-700">
                Transit Protocol: <strong className="text-stone-950">Armoured Insured Transit</strong>
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-stone-300 text-[10px] uppercase tracking-wider text-stone-500">
                  <th className="py-2.5 font-semibold">Fine Jewellery Piece</th>
                  <th className="py-2.5 font-semibold">SKU</th>
                  <th className="py-2.5 font-semibold text-center">Qty</th>
                  <th className="py-2.5 font-semibold text-right">Unit Price</th>
                  <th className="py-2.5 font-semibold text-right">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/70">
                {items.map((item) => (
                  <tr key={item.id} className="py-3">
                    <td className="py-3 pr-2">
                      <p className="font-serif font-medium text-stone-950 text-sm">{item.productName}</p>
                      {item.variantName && (
                        <p className="text-[11px] text-stone-500 font-light">Option: {item.variantName}</p>
                      )}
                      {item.customEngravingText && (
                        <p className="text-[11px] text-[#846127] font-serif italic">
                          Custom Engraving: "{item.customEngravingText}"
                        </p>
                      )}
                    </td>
                    <td className="py-3 font-mono text-stone-600 text-[11px]">{item.sku}</td>
                    <td className="py-3 text-center font-medium text-stone-900">{item.quantity}</td>
                    <td className="py-3 text-right font-mono text-stone-800">
                      ${item.unitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 text-right font-mono font-medium text-stone-950">
                      ${item.lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals & QR Section */}
          <div className="pt-4 border-t-2 border-stone-300 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            
            {/* QR Code Column */}
            <div className="sm:col-span-6 flex items-center space-x-4 bg-white p-3 border border-stone-200">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt={`Receipt QR for ${orderNumber}`}
                  className="w-24 h-24 object-contain shrink-0 border border-stone-200 p-1 bg-white"
                />
              ) : (
                <div className="w-24 h-24 bg-stone-100 flex items-center justify-center text-[10px] text-stone-400">
                  QR Pending
                </div>
              )}
              <div className="space-y-1 text-[10px] text-stone-500 leading-tight">
                <span className="font-semibold uppercase tracking-wider text-stone-900 block text-[11px]">
                  Secure Atelier QR Reference
                </span>
                <p>Authenticates piece provenance and authorizes courier transit clearance.</p>
                <p className="font-mono text-stone-400 truncate">Token: {qrToken.slice(0, 16)}...</p>
                <p className="text-emerald-700 font-medium">✓ Scannable by Authorized Staff</p>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="sm:col-span-6 space-y-1.5 text-xs text-stone-700 sm:text-right">
              <div className="flex justify-between sm:justify-end sm:space-x-8">
                <span className="text-stone-500">Subtotal:</span>
                <span className="font-mono text-stone-900">
                  ${totals.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })} {totals.currency}
                </span>
              </div>

              {totals.discountAmount > 0 && (
                <div className="flex justify-between sm:justify-end sm:space-x-8 text-emerald-800 font-medium">
                  <span>Privilege Savings:</span>
                  <span className="font-mono">
                    -${totals.discountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="flex justify-between sm:justify-end sm:space-x-8">
                <span className="text-stone-500">Insured Armoured Courier:</span>
                <span className="font-mono text-stone-900">
                  {totals.shippingCost === 0
                    ? 'Complimentary'
                    : `$${totals.shippingCost.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                </span>
              </div>

              <div className="flex justify-between sm:justify-end sm:space-x-8">
                <span className="text-stone-500">Estimated State Tax:</span>
                <span className="font-mono text-stone-900">
                  ${totals.estimatedTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>

              <div className="flex justify-between sm:justify-end sm:space-x-8 pt-2 border-t border-stone-200 text-stone-950 font-serif text-base font-semibold">
                <span>Total Settled:</span>
                <span className="text-[#846127]">
                  ${totals.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {totals.currency}
                </span>
              </div>
            </div>

          </div>

          {/* Footer Guarantee */}
          <div className="pt-6 border-t border-stone-200 text-center text-[10px] text-stone-400 space-y-1 font-light">
            <p>
              {shop.name} certifies that all gemstones and precious metals comply with Kimberley Process international standards.
            </p>
            <p>
              This electronic document is valid without physical seal under registration {shop.legalRegistration}.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
