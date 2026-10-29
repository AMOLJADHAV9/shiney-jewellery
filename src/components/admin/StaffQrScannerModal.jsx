import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, QrCode, Search, Camera, CameraOff, SwitchCamera, AlertCircle, 
  ArrowRight, CheckCircle2, ShieldAlert, Sparkles, Package, Upload, 
  RefreshCw, Check, ArrowLeft, Truck, Clock, ShieldCheck
} from 'lucide-react';
import jsQR from 'jsqr';
import { api } from '../../services/api';

export default function StaffQrScannerModal({ isOpen, onClose, onOrderResolved }) {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('environment'); // 'environment' (back) or 'user' (front)
  const [scanInput, setScanInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Resolved Order State (for immediate status transition)
  const [resolvedOrder, setResolvedOrder] = useState(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusSuccessMsg, setStatusSuccessMsg] = useState('');
  const [carrierName, setCarrierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [staffNote, setStaffNote] = useState('');

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationFrameId = useRef(null);
  const isScanningRef = useRef(false);

  // Gentle audio beep upon successful scan
  const playBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.18);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.18);
    } catch {
      // Audio autoplay restrictions or unsupported
    }
  };

  // Stop camera stream safely
  const stopCamera = useCallback(() => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
    isScanningRef.current = false;
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setIsCameraActive(false);
  }, []);

  // Frame processing loop with jsQR and BarcodeDetector fallback
  const scanLoop = useCallback(async () => {
    if (!isScanningRef.current || !videoRef.current) return;

    const video = videoRef.current;
    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      // 1. Try native BarcodeDetector if available
      if ('BarcodeDetector' in window) {
        try {
          const barcodeDetector = new window.BarcodeDetector({ formats: ['qr_code'] });
          const barcodes = await barcodeDetector.detect(video);
          if (barcodes.length > 0 && barcodes[0].rawValue) {
            handleScannedCode(barcodes[0].rawValue);
            return;
          }
        } catch {
          // Fall back to jsQR
        }
      }

      // 2. jsQR software fallback
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          });
          if (code && code.data) {
            handleScannedCode(code.data);
            return;
          }
        }
      }
    }

    if (isScanningRef.current) {
      animationFrameId.current = requestAnimationFrame(scanLoop);
    }
  }, []);

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError('');
    setError('');
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      setIsCameraActive(true);
      isScanningRef.current = true;
      animationFrameId.current = requestAnimationFrame(scanLoop);
    } catch (err) {
      console.error('Camera initialization failed:', err);
      setIsCameraActive(false);
      isScanningRef.current = false;
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraError('Camera permission was denied. Please allow camera permissions in your browser bar.');
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraError('No camera found on this device. You can paste or type the Order reference below.');
      } else {
        setCameraError(err.message || 'Unable to access camera.');
      }
    }
  };

  // Toggle front/back camera
  const toggleFacingMode = () => {
    stopCamera();
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // When facingMode changes while camera was active, restart
  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    }
  }, [facingMode]);

  // Clean up camera on unmount or modal close
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setResolvedOrder(null);
      setScanInput('');
      setError('');
      setCameraError('');
      setStatusSuccessMsg('');
    }
  }, [isOpen, stopCamera]);

  // Handle scanned raw payload (from camera or file)
  const handleScannedCode = async (rawValue) => {
    if (!rawValue || !rawValue.trim()) return;
    stopCamera();
    playBeep();
    await resolveOrderData(rawValue.trim());
  };

  // Fetch Order Data from Backend API
  const resolveOrderData = async (rawString) => {
    setLoading(true);
    setError('');
    setStatusSuccessMsg('');
    try {
      const order = await api.admin.scanQrOrder(rawString);
      setResolvedOrder(order);
      setCarrierName(order.carrierName || '');
      setTrackingNumber(order.trackingNumber || '');
      setStaffNote('');
    } catch (err) {
      console.error('Scan resolution failed:', err);
      setError(err.message || 'Unrecognized QR code or Order reference. Please re-verify.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Manual Form Submit
  const handleManualResolve = (e) => {
    e.preventDefault();
    if (!scanInput.trim()) {
      setError('Please provide a QR token, raw QR payload, or Order number');
      return;
    }
    resolveOrderData(scanInput.trim());
  };

  // Handle Image File Upload (Scan QR from photo / screenshot)
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code && code.data) {
          handleScannedCode(code.data);
        } else {
          setError('No QR code detected in the selected image. Please try another image or use camera.');
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  // Immediate Status Change directly from QR Scan View
  const handleApplyStatusChange = async (targetStatus, targetLabel) => {
    if (!resolvedOrder) return;

    const confirmed = window.confirm(
      `Confirm status update to "${targetLabel || targetStatus}" for Order ${resolvedOrder.orderNumber}?\n\nCarrier: ${carrierName || resolvedOrder.carrierName || 'Armoured Courier'}\nTracking: ${trackingNumber || resolvedOrder.trackingNumber || 'Pending'}`
    );
    if (!confirmed) return;

    setIsUpdatingStatus(true);
    setError('');
    setStatusSuccessMsg('');

    try {
      const res = await api.admin.updateOrderStatus(resolvedOrder.id, {
        status: targetStatus,
        carrierName: carrierName.trim() || resolvedOrder.carrierName || undefined,
        trackingNumber: trackingNumber.trim() || resolvedOrder.trackingNumber || undefined,
        note: staffNote.trim() || `Status updated via Live Optical QR Scanner to ${targetLabel || targetStatus}`,
        source: 'admin_scan',
      });

      setStatusSuccessMsg(`Order status successfully transitioned to "${res.statusLabel || targetStatus}"!`);

      // Refresh order data
      const refreshed = await api.admin.getOrderById(resolvedOrder.id);
      setResolvedOrder(refreshed);

      // Notify parent to refresh admin orders table
      if (onOrderResolved) {
        onOrderResolved(refreshed);
      }
    } catch (err) {
      console.error('Status transition failed:', err);
      setError(err.message || 'Status transition was rejected.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Open Full Dossier Modal
  const handleOpenFullDossier = () => {
    if (resolvedOrder && onOrderResolved) {
      onOrderResolved(resolvedOrder);
      onClose();
    }
  };

  // Reset to Scan Another
  const handleResetToScan = () => {
    setResolvedOrder(null);
    setScanInput('');
    setError('');
    setStatusSuccessMsg('');
    startCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6">
      <div className="bg-[#FCFBF9] w-full max-w-2xl rounded-none border border-[#DFD5C6] shadow-2xl relative my-8 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Hidden Canvas for QR Extraction */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-stone-200 bg-white shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 bg-[#12100E] text-[#EDDFBA] flex items-center justify-center">
              <QrCode className="w-4 h-4 text-[#C49D3E]" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-[#846127]">
                Atelier Fulfilment Protocol
              </span>
              <h2 className="font-serif text-lg font-medium text-stone-950">
                Live Camera QR Scanner & Status Console
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

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* PRD Security Notice */}
          <div className="p-3 bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Optical Scan Protocol (PRD 1.1):</strong> Live scanning safely detects and resolves the commission reference. Status changes require staff verification.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {statusSuccessMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{statusSuccessMsg}</span>
            </div>
          )}

          {/* ========================================================================= */}
          {/* STATE A: LIVE CAMERA & SCANNER INTERFACE (When no order is resolved yet) */}
          {/* ========================================================================= */}
          {!resolvedOrder && (
            <div className="space-y-4">
              
              {/* Camera Viewport Container */}
              <div className="bg-[#12100E] border-2 border-[#C49D3E]/50 overflow-hidden relative shadow-inner">
                {isCameraActive ? (
                  <div className="relative aspect-video sm:aspect-[4/3] w-full bg-black flex items-center justify-center overflow-hidden">
                    {/* Live Video Feed */}
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    {/* Haute Joaillerie Optical Scanner Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      {/* Outer Reticle Frame */}
                      <div className="w-56 h-56 sm:w-64 sm:h-64 relative">
                        {/* Gold Corner Brackets */}
                        <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#C49D3E]" />
                        <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#C49D3E]" />
                        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#C49D3E]" />
                        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#C49D3E]" />

                        {/* Animated Laser Scanline */}
                        <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#EDDFBA] to-transparent shadow-[0_0_12px_#C49D3E] animate-pulse top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    {/* Camera Control Badges (Top & Bottom inside viewport) */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between text-[11px] pointer-events-auto">
                      <span className="px-2.5 py-1 bg-black/70 backdrop-blur-sm text-emerald-400 font-mono flex items-center space-x-1.5 border border-emerald-500/30">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                        <span>Camera Active</span>
                      </span>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={toggleFacingMode}
                          title="Switch Front/Back Camera"
                          className="p-1.5 bg-black/70 hover:bg-stone-800 text-[#EDDFBA] border border-stone-700 transition-colors"
                        >
                          <SwitchCamera className="w-4 h-4 text-[#C49D3E]" />
                        </button>

                        <button
                          type="button"
                          onClick={stopCamera}
                          title="Stop Camera"
                          className="px-2 py-1 bg-black/70 hover:bg-stone-800 text-stone-300 border border-stone-700 transition-colors text-[10px] uppercase tracking-wider"
                        >
                          Stop
                        </button>
                      </div>
                    </div>

                    <div className="absolute bottom-3 inset-x-3 text-center pointer-events-none">
                      <span className="px-3 py-1 bg-black/70 backdrop-blur-sm text-[#EDDFBA] font-light text-[11px] border border-stone-800 tracking-wide">
                        Align Order Receipt QR or Product Dispatch Seal inside reticle
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Camera Off State / Launcher Screen */
                  <div className="p-8 sm:p-12 text-center space-y-4">
                    <div className="w-20 h-20 mx-auto bg-stone-900 border border-[#C49D3E]/60 flex items-center justify-center text-[#C49D3E] shadow-lg">
                      <Camera className="w-10 h-10" />
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-serif text-lg text-[#EDDFBA]">
                        Live Camera Scanner Ready
                      </h3>
                      <p className="text-xs text-stone-400 font-light max-w-sm mx-auto">
                        Open your device camera to automatically scan and detect order receipts or dispatch parcels.
                      </p>
                    </div>

                    {cameraError && (
                      <div className="p-2.5 bg-rose-950/60 border border-rose-800 text-xs text-rose-300 max-w-sm mx-auto">
                        {cameraError}
                      </div>
                    )}

                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={startCamera}
                        className="px-6 py-3 bg-[#C49D3E] hover:bg-[#b08b32] text-stone-950 font-bold text-xs uppercase tracking-widest shadow-md flex items-center space-x-2 transition-all cursor-pointer"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Open Camera to Scan</span>
                      </button>

                      <label className="px-4 py-3 bg-stone-900 hover:bg-stone-800 text-[#EDDFBA] border border-stone-700 text-xs uppercase tracking-wider flex items-center space-x-2 transition-colors cursor-pointer">
                        <Upload className="w-4 h-4 text-[#C49D3E]" />
                        <span>Upload QR Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Manual Input Fallback */}
              <div className="bg-white border border-stone-200 p-4 space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                  Or Manual Lookup & Barcode Gun Input
                </span>
                <form onSubmit={handleManualResolve} className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={scanInput}
                      onChange={(e) => setScanInput(e.target.value)}
                      placeholder="e.g. SH-2026-47884 or paste QR payload token"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                    />
                    <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={loading || !scanInput.trim()}
                    className="px-5 py-2 bg-stone-900 text-[#EDDFBA] hover:bg-black font-semibold text-xs uppercase tracking-wider disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'Resolving...' : 'Inspect'}
                  </button>
                </form>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* STATE B: ORDER RESOLVED & IMMEDIATE STATUS CHANGER */}
          {/* ========================================================================= */}
          {resolvedOrder && (
            <div className="space-y-5 animate-in fade-in duration-200">
              
              {/* Order Identified Dossier Banner */}
              <div className="bg-[#12100E] border-2 border-[#C49D3E] p-4 text-white shadow-xl space-y-3">
                <div className="flex flex-wrap items-center justify-between pb-2 border-b border-stone-800 gap-2">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-[#C49D3E]" />
                    <span className="text-xs font-mono font-bold text-[#EDDFBA]">
                      Order Verified: {resolvedOrder.orderNumber}
                    </span>
                    <span className="text-[9px] px-2 py-0.5 bg-[#C49D3E]/20 text-[#EDDFBA] font-mono uppercase border border-[#C49D3E]/40">
                      QR Authenticated
                    </span>
                  </div>

                  <span className="text-xs font-serif text-[#C49D3E] font-medium">
                    ${resolvedOrder.totalAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 })} {resolvedOrder.currency}
                  </span>
                </div>

                {/* Consignee & Current Status Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                      Client & Destination
                    </span>
                    <p className="font-medium text-stone-200">{resolvedOrder.client?.recipient}</p>
                    <p className="text-stone-400 font-light text-[11px] truncate">
                      {resolvedOrder.client?.city}, {resolvedOrder.client?.country} • {resolvedOrder.client?.phone}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                      Current Fulfilment Milestone
                    </span>
                    <span className="inline-block mt-0.5 px-2.5 py-1 bg-[#FAF6EC] text-[#846127] font-bold text-xs uppercase tracking-wider border border-[#C49D3E]">
                      {resolvedOrder.statusLabel || resolvedOrder.status}
                    </span>
                    <p className="text-[10px] text-stone-400 font-mono mt-1">
                      Carrier: {resolvedOrder.carrierName || "Brink's Armoured Courier"}
                    </p>
                  </div>
                </div>

                {/* Scanned Items Summary */}
                <div className="pt-2 border-t border-stone-800 space-y-1.5">
                  <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
                    Pieces in Commission ({resolvedOrder.items?.length || 0})
                  </span>
                  <div className="space-y-1.5">
                    {resolvedOrder.items?.map((it) => (
                      <div key={it.id} className="flex items-center justify-between text-xs bg-stone-900/80 p-2 border border-stone-800">
                        <div className="flex items-center space-x-2.5">
                          {it.primaryImage ? (
                            <img
                              src={it.primaryImage}
                              alt={it.productName}
                              className="w-8 h-8 object-cover border border-stone-700 bg-black"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <Package className="w-5 h-5 text-stone-500" />
                          )}
                          <div>
                            <span className="font-serif text-stone-200 font-medium">{it.productName}</span>
                            <span className="text-[10px] text-stone-400 font-mono block">SKU: {it.sku} • Qty: {it.quantity}</span>
                          </div>
                        </div>
                        <span className="font-mono text-stone-300">
                          ${it.lineTotal?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ========================================================================= */}
              {/* CHANGE PRODUCT STATUS ACTIONS (PRD Addendum 1.1) */}
              {/* ========================================================================= */}
              <div className="bg-[#FAF6EC] border-2 border-[#C49D3E] p-4 sm:p-5 space-y-4">
                <div>
                  <div className="flex items-center space-x-1.5 text-[#846127] font-bold text-xs uppercase tracking-wider">
                    <Sparkles className="w-4 h-4 text-[#C49D3E]" />
                    <span>Change Product Fulfilment Status</span>
                  </div>
                  <p className="text-xs text-stone-600 font-light mt-0.5">
                    Select an authorized pipeline stage below to immediately advance this order:
                  </p>
                </div>

                {/* One-Click Milestone Advance Pills */}
                {resolvedOrder.allowedNextStatuses && resolvedOrder.allowedNextStatuses.length > 0 ? (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {resolvedOrder.allowedNextStatuses.map((st, idx) => (
                        <button
                          key={st.status}
                          type="button"
                          disabled={isUpdatingStatus}
                          onClick={() => handleApplyStatusChange(st.status, st.label)}
                          className={`inline-flex items-center space-x-1.5 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer ${
                            idx === 0
                              ? 'bg-[#12100E] hover:bg-stone-800 text-[#EDDFBA] border border-[#C49D3E] shadow-md ring-1 ring-[#C49D3E]/60'
                              : 'bg-white hover:bg-stone-50 text-stone-800 border border-stone-300'
                          }`}
                          title={`Advance order to ${st.label}`}
                        >
                          <span>{idx === 0 ? '▶ Advance to:' : 'Advance to:'} {st.label}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#C49D3E]" />
                        </button>
                      ))}
                    </div>

                    {/* Quick Carrier & Note Inputs (Optional) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-200/80">
                      <div>
                        <label className="block text-[11px] font-medium text-stone-700 mb-0.5">
                          Carrier Name
                        </label>
                        <input
                          type="text"
                          value={carrierName}
                          onChange={(e) => setCarrierName(e.target.value)}
                          placeholder="e.g. Brink's Armoured Courier"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-medium text-stone-700 mb-0.5">
                          Carrier Tracking Code
                        </label>
                        <input
                          type="text"
                          value={trackingNumber}
                          onChange={(e) => setTrackingNumber(e.target.value)}
                          placeholder="e.g. BRK-2026-XXXXX"
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded-none focus:outline-none focus:border-[#C49D3E]"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-stone-100 border border-stone-300 text-xs text-stone-600">
                    This order is at terminal status (<strong>{resolvedOrder.statusLabel}</strong>). No further status updates are permitted.
                  </div>
                )}

                {/* Footer Controls */}
                <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={handleResetToScan}
                    className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-stone-300 hover:border-stone-800 text-stone-700 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-[#C49D3E]" />
                    <span>Scan Next Order</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenFullDossier}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-xs font-semibold uppercase tracking-wider transition-colors"
                  >
                    <span>Open Full Fulfilment Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C49D3E]" />
                  </button>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
