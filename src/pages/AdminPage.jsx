import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, Plus, Edit2, Trash2, Upload, ShieldCheck, CheckCircle2, 
  Clock, Truck, Sparkles, RefreshCw, AlertCircle, Eye, ChevronRight, 
  ChevronDown, Lock, FolderTree, AlertTriangle, Download, Search, 
  Filter, Layers, ArrowUpRight, ArrowDownRight, X, FileSpreadsheet,
  Check, Info, Image, Star, ArrowLeft, ArrowRight, QrCode, FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import StaffQrScannerModal from '../components/admin/StaffQrScannerModal';
import StaffOrderDetailModal from '../components/admin/StaffOrderDetailModal';
import ReceiptModal from '../components/orders/ReceiptModal';

export default function AdminPage() {
  const { user, isAuthenticated, isAdmin } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState('dashboard'); 
  // 'dashboard' | 'categories' | 'products' | 'inventory' | 'movements' | 'orders' | 'upload'

  // Data states
  const [dashboardData, setDashboardData] = useState(null);
  const [categoriesTree, setCategoriesTree] = useState([]);
  const [products, setProducts] = useState([]);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [inventoryStats, setInventoryStats] = useState({ lowStockCount: 0, outOfStockCount: 0, total: 0 });
  const [movements, setMovements] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Filtering states
  const [categorySearch, setCategorySearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [inventoryFilter, setInventoryFilter] = useState('all'); // 'all' | 'low_stock' | 'out_of_stock'
  const [inventorySearch, setInventorySearch] = useState('');

  // Orders Filter & PRD 1.1 Modal Controls
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [selectedAdminOrder, setSelectedAdminOrder] = useState(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [receiptModalOrderId, setReceiptModalOrderId] = useState(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Category Modal Form State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    parentId: '',
    description: '',
    bannerUrl: '',
    displayOrder: 0,
    status: 'active',
  });

  // Product Modal Drawer State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productModalTab, setProductModalTab] = useState('general'); // 'general' | 'specs' | 'variants' | 'images' | 'publishing'
  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    slug: '',
    categoryId: '',
    productType: 'simple',
    price: '',
    compareAtPrice: '',
    material: '18k Solid Yellow Gold',
    goldCarat: '18KT',
    gemstone: '',
    weightGrams: '',
    dimensions: '',
    barcode: '',
    seoTitle: '',
    seoDescription: '',
    shortDescription: '',
    description: '',
    status: 'active',
    isFeatured: false,
    isNewArrival: false,
    isBestSeller: false,
    stockQuantity: 15,
    images: [],
    variants: [
      { name: 'Standard', value: 'std', sku: '', price: '', stockQuantity: 15, barcode: '' }
    ],
  });

  // Stock Adjustment Modal State
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [adjustForm, setAdjustForm] = useState({
    movementType: 'received',
    quantityDelta: 1,
    reason: '',
    reference: '',
  });

  // Media Upload State
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadedUrl, setUploadedUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  // Load all required dataset
  const loadAllData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [dashRes, treeRes, prodsRes, invRes, movesRes, ordersRes] = await Promise.all([
        api.admin.getDashboard().catch(() => null),
        api.categories.getHierarchy().catch(() => ({ items: [] })),
        api.admin.getProducts({ limit: 100 }).catch(() => ({ items: [] })),
        api.inventory.getAll({ limit: 100 }).catch(() => ({ items: [], pagination: {} })),
        api.inventory.getMovements({ limit: 50 }).catch(() => ({ items: [] })),
        api.admin.getOrders({ limit: 50 }).catch(() => ({ items: [] })),
      ]);

      if (dashRes) setDashboardData(dashRes);
      setCategoriesTree(treeRes.items || treeRes.data || []);
      setProducts(prodsRes.items || prodsRes.data || []);
      setInventoryItems(invRes.items || invRes.data || []);
      setInventoryStats(invRes.pagination || {});
      setMovements(movesRes.items || movesRes.data || []);
      setOrders(ordersRes.items || ordersRes.data || []);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to load atelier data');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch filtered or searched orders
  const loadOrders = async () => {
    try {
      const params = { limit: 100 };
      if (orderSearch.trim()) params.search = orderSearch.trim();
      if (orderStatusFilter !== 'all') params.status = orderStatusFilter;
      const res = await api.admin.getOrders(params);
      setOrders(res.items || res.data || []);
    } catch (err) {
      console.error('Failed to load filtered orders:', err);
      setErrorMessage(err.message || 'Failed to search client orders');
    }
  };

  // Open Full Order Dossier for Lifecycle Management
  const handleOpenOrderDetail = async (orderId) => {
    try {
      setIsLoading(true);
      const fullOrder = await api.admin.getOrderById(orderId);
      setSelectedAdminOrder(fullOrder);
      setIsOrderDetailOpen(true);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to fetch order dossier');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle QR Scan Result (Scanning opens order details; scanning alone must never change status)
  const handleQrOrderResolved = (resolvedOrder) => {
    setSelectedAdminOrder(resolvedOrder);
    setIsOrderDetailOpen(true);
    triggerSuccess(`Order ${resolvedOrder.orderNumber} successfully located via QR code`);
  };

  // Open Receipt Modal with QR
  const handleOpenReceipt = (orderId) => {
    setReceiptModalOrderId(orderId);
    setIsReceiptModalOpen(true);
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadAllData();
    }
  }, [isAuthenticated, isAdmin]);

  // Flash action message
  const triggerSuccess = (msg) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(''), 3500);
  };

  // If unauthorized
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="bg-[#FAF8F5] min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="max-w-md w-full bg-white p-8 border border-stone-200 text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-700">
            <Lock className="w-6 h-6 text-[#C49D3E]" />
          </div>
          <h1 className="font-serif text-2xl text-stone-900">Salon Atelier Restricted</h1>
          <p className="text-xs text-stone-500 font-light leading-relaxed">
            Administrative credentials required. Please sign in with an Atelier Director or Administrator staff account.
          </p>
          <div className="pt-2">
            <Link
              to="/login"
              className="inline-block w-full py-3 bg-[#12100E] text-[#EDDFBA] text-xs font-semibold uppercase tracking-wider"
            >
              Sign In as Administrator
            </Link>
          </div>
          <div className="text-[11px] text-stone-400">
            Default Demo: <span className="font-mono text-stone-600">admin@shineyjewellery.com</span>
          </div>
        </div>
      </div>
    );
  }

  // Handle Category Submit (Create or Update)
  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      if (editingCategory) {
        await api.categories.update(editingCategory.id, categoryForm);
        triggerSuccess(`Category "${categoryForm.name}" updated successfully.`);
      } else {
        await api.categories.create(categoryForm);
        triggerSuccess(`Category "${categoryForm.name}" created successfully.`);
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      loadAllData();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save category');
    }
  };

  // Open Category Edit
  const openEditCategory = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({
      name: cat.name,
      slug: cat.slug,
      parentId: cat.parentId || '',
      description: cat.description || '',
      bannerUrl: cat.bannerUrl || '',
      displayOrder: cat.displayOrder || 0,
      status: cat.status || 'active',
    });
    setIsCategoryModalOpen(true);
  };

  // Archive / Delete Category
  const handleDeleteCategory = async (id, name) => {
    if (!window.confirm(`Are you sure you wish to archive category "${name}"? Active products will remain intact.`)) {
      return;
    }
    try {
      const res = await api.categories.delete(id);
      triggerSuccess(res.message || `Category "${name}" archived.`);
      loadAllData();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to archive category');
    }
  };

  // Stock Adjustment Submit
  const handleApplyAdjustment = async (e) => {
    e.preventDefault();
    if (!selectedVariant) return;
    setErrorMessage('');
    try {
      const delta = parseInt(adjustForm.quantityDelta, 10);
      if (isNaN(delta) || delta === 0) {
        setErrorMessage('Quantity delta must be a non-zero number');
        return;
      }
      if (!adjustForm.reason || adjustForm.reason.trim().length < 3) {
        setErrorMessage('Adjustment reason is required (minimum 3 characters)');
        return;
      }

      await api.inventory.adjust({
        variantId: selectedVariant.variantId,
        movementType: adjustForm.movementType,
        quantityDelta: delta,
        reason: adjustForm.reason.trim(),
        reference: adjustForm.reference.trim() || undefined,
      });

      triggerSuccess(`Stock adjusted by ${delta > 0 ? '+' : ''}${delta} for SKU ${selectedVariant.sku}`);
      setIsAdjustModalOpen(false);
      setSelectedVariant(null);
      loadAllData();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to adjust stock');
    }
  };

  // Export Inventory CSV (INV-09)
  const handleExportCSV = () => {
    if (!inventoryItems || inventoryItems.length === 0) return;
    const headers = ['SKU', 'Product Name', 'Category', 'Variant', 'On Hand', 'Reserved', 'Available', 'Reorder Threshold', 'Unit Price ($)', 'Stock Status', 'Barcode'];
    const rows = inventoryItems.map(item => [
      item.sku,
      `"${item.productName.replace(/"/g, '""')}"`,
      `"${item.categoryName || ''}"`,
      `"${item.variantName || 'Standard'}"`,
      item.quantityOnHand,
      item.quantityReserved,
      item.quantityAvailable,
      item.reorderThreshold,
      item.price,
      item.stockStatus,
      item.barcode || '',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `shiney_inventory_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerSuccess('Inventory CSV exported successfully.');
  };

  // Create Product Submit
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const payload = {
        sku: productForm.sku.trim(),
        slug: productForm.slug.trim(),
        name: productForm.name.trim(),
        categoryId: productForm.categoryId || (categoriesTree[0]?.id || 'rings'),
        productType: productForm.productType,
        price: parseFloat(productForm.price),
        compareAtPrice: productForm.compareAtPrice ? parseFloat(productForm.compareAtPrice) : undefined,
        material: productForm.material,
        goldCarat: productForm.goldCarat,
        gemstone: productForm.gemstone || undefined,
        weightGrams: productForm.weightGrams ? parseFloat(productForm.weightGrams) : undefined,
        dimensions: productForm.dimensions || undefined,
        barcode: productForm.barcode || undefined,
        seoTitle: productForm.seoTitle || undefined,
        seoDescription: productForm.seoDescription || undefined,
        shortDescription: productForm.shortDescription,
        description: productForm.description,
        status: productForm.status,
        isFeatured: productForm.isFeatured,
        isNewArrival: productForm.isNewArrival,
        isBestSeller: productForm.isBestSeller,
        stockQuantity: parseInt(productForm.stockQuantity, 10) || 15,
        variants: productForm.variants.map(v => ({
          name: v.name,
          value: v.value || v.name.toLowerCase().replace(/\s+/g, '-'),
          sku: v.sku || `${productForm.sku}-${v.value}`,
          price: v.price ? parseFloat(v.price) : parseFloat(productForm.price),
          stockQuantity: parseInt(v.stockQuantity, 10) || 10,
          barcode: v.barcode || undefined,
        })),
        images: productForm.images,
      };

      await api.admin.createProduct(payload);
      triggerSuccess(`Piece "${productForm.name}" created and entered into atelier catalogue.`);
      setIsProductModalOpen(false);
      setActiveTab('products');
      loadAllData();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to create piece');
    }
  };

  // Upload Images from System for Catalogue Piece
  const handlePieceImagesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setErrorMessage('');

    let addedCount = 0;
    for (const file of files) {
      try {
        const base64Data = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });

        let cdnUrl = base64Data;
        let objectKey = `products/${file.name}`;

        try {
          const uploadRes = await api.admin.uploadDirect({
            filename: file.name,
            base64Data,
            contentType: file.type || 'image/jpeg',
          });
          if (uploadRes?.cdnUrl) {
            cdnUrl = uploadRes.cdnUrl;
            objectKey = uploadRes.objectKey;
          }
        } catch (uploadErr) {
          console.warn('Backend direct storage fallback to data URL:', uploadErr.message);
        }

        setProductForm((prev) => {
          const isFirst = prev.images.length === 0;
          return {
            ...prev,
            images: [
              ...prev.images,
              {
                cdnUrl,
                objectKey,
                altText: `${prev.name || 'Jewellery piece'} photography`,
                isPrimary: isFirst,
                filename: file.name,
                size: `${(file.size / 1024).toFixed(0)} KB`,
              },
            ],
          };
        });
        addedCount++;
      } catch (err) {
        console.error('File load error:', err);
        setErrorMessage(`Could not read ${file.name}: ${err.message}`);
      }
    }

    setIsUploading(false);
    if (addedCount > 0) {
      triggerSuccess(`Successfully uploaded ${addedCount} photo(s) from your computer.`);
    }
    e.target.value = '';
  };

  // Toggle Primary Cover Image
  const setPrimaryImage = (index) => {
    setProductForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      })),
    }));
  };

  // Remove Image
  const removePieceImage = (index) => {
    setProductForm((prev) => {
      const filtered = prev.images.filter((_, i) => i !== index);
      if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return {
        ...prev,
        images: filtered,
      };
    });
  };

  // Reorder Images (Move Left or Right)
  const movePieceImage = (index, direction) => {
    setProductForm((prev) => {
      const newImages = [...prev.images];
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= newImages.length) return prev;
      const temp = newImages[index];
      newImages[index] = newImages[targetIndex];
      newImages[targetIndex] = temp;
      return {
        ...prev,
        images: newImages,
      };
    });
  };

  // Upload Media Asset to MinIO
  const handleUploadMedia = async (e) => {
    e.preventDefault();
    if (!uploadFile) return;
    setIsUploading(true);
    setErrorMessage('');
    try {
      const { uploadUrl, cdnUrl } = await api.admin.getUploadUrl({
        filename: uploadFile.name,
        contentType: uploadFile.type || 'image/jpeg',
        sizeBytes: uploadFile.size,
      });

      await fetch(uploadUrl, {
        method: 'PUT',
        headers: { 'Content-Type': uploadFile.type || 'image/jpeg' },
        body: uploadFile,
      });

      setUploadedUrl(cdnUrl);
      triggerSuccess('Image successfully uploaded and registered.');
    } catch (err) {
      setErrorMessage(err.message || 'Media upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  // Filtered Inventory List
  const filteredInventory = inventoryItems.filter(item => {
    if (inventoryFilter === 'low_stock' && item.stockStatus !== 'low_stock') return false;
    if (inventoryFilter === 'out_of_stock' && item.stockStatus !== 'out_of_stock') return false;
    if (inventorySearch.trim()) {
      const q = inventorySearch.toLowerCase();
      const matchSku = item.sku?.toLowerCase().includes(q);
      const matchName = item.productName?.toLowerCase().includes(q);
      const matchCat = item.categoryName?.toLowerCase().includes(q);
      return matchSku || matchName || matchCat;
    }
    return true;
  });

  // Flat Categories list for parent selection
  const flatCategories = [];
  const flatten = (nodes) => {
    nodes.forEach(n => {
      flatCategories.push(n);
      if (n.subcategories && n.subcategories.length > 0) {
        flatten(n.subcategories);
      }
    });
  };
  flatten(categoriesTree);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#C49D3E] font-medium mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Haute Joaillerie Atelier Directorate</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl text-stone-900 tracking-tight">
              Catalogue & Inventory Console
            </h1>
            <p className="text-xs text-stone-500 font-light mt-1">
              Directorate control for product lines, hierarchical taxonomies, stock ledger movements, and client commissions.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadAllData}
              disabled={isLoading}
              className="inline-flex items-center space-x-1.5 px-3 py-2 bg-white border border-stone-300 text-stone-700 text-xs font-medium hover:border-[#C49D3E] transition-colors"
              title="Refresh Atelier Records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#C49D3E]' : ''}`} />
              <span>Sync</span>
            </button>

            <button
              onClick={() => {
                setEditingCategory(null);
                setCategoryForm({
                  name: '',
                  slug: '',
                  parentId: '',
                  description: '',
                  bannerUrl: '',
                  displayOrder: 0,
                  status: 'active',
                });
                setIsCategoryModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-stone-900 text-[#EDDFBA] text-xs font-medium hover:bg-stone-800 transition-colors shadow-sm"
            >
              <FolderTree className="w-3.5 h-3.5 text-[#C49D3E]" />
              <span>+ Category</span>
            </button>

            <button
              onClick={() => {
                setProductForm({
                  name: '',
                  sku: `SH-JW-${Math.floor(100 + Math.random() * 900)}`,
                  slug: '',
                  categoryId: flatCategories[0]?.id || '',
                  productType: 'simple',
                  price: '4800',
                  compareAtPrice: '',
                  material: '18k Solid Yellow Gold',
                  goldCarat: '18KT',
                  gemstone: 'Brilliant Round Cut Diamond',
                  weightGrams: '6.5',
                  dimensions: '18mm x 4mm',
                  barcode: '',
                  seoTitle: '',
                  seoDescription: '',
                  shortDescription: 'Masterfully sculpted by master artisans with certified precious gems.',
                  description: 'A tribute to timeless European high jewellery with supreme craftsmanship.',
                  status: 'active',
                  isFeatured: true,
                  isNewArrival: true,
                  isBestSeller: false,
                  stockQuantity: 15,
                  images: [{ cdnUrl: '/images/r1.jpg', altText: 'Jewellery Atelier Piece', isPrimary: true }],
                  variants: [{ name: 'Standard', value: 'std', sku: '', price: '4800', stockQuantity: 15, barcode: '' }],
                });
                setIsProductModalOpen(true);
              }}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#12100E] text-[#EDDFBA] text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#C49D3E]" />
              <span>+ Add Piece</span>
            </button>
          </div>
        </div>

        {/* Global Feedback Banners */}
        {actionMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-stone-200 space-x-6 text-xs uppercase tracking-wider font-medium overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Executive Dashboard', icon: Sparkles },
            { id: 'categories', label: 'Category Hierarchy', icon: FolderTree, badge: flatCategories.length },
            { id: 'products', label: 'Catalogue Pieces', icon: Package, badge: products.length },
            { 
              id: 'inventory', 
              label: 'Stock & Inventory', 
              icon: Layers, 
              alertBadge: inventoryStats.lowStockCount + inventoryStats.outOfStockCount 
            },
            { id: 'movements', label: 'Movement Ledger', icon: Clock },
            { id: 'orders', label: 'Client Orders', icon: Truck, badge: orders.length },
            { id: 'upload', label: 'MinIO Media Studio', icon: Upload },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3.5 border-b-2 flex items-center space-x-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'border-[#C49D3E] text-stone-900 font-semibold'
                    : 'border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#C49D3E]' : 'text-stone-400'}`} />
                <span>{tab.label}</span>
                {tab.badge !== undefined && (
                  <span className="ml-1 px-1.5 py-0.5 bg-stone-100 text-stone-600 text-[10px] font-mono">
                    {tab.badge}
                  </span>
                )}
                {tab.alertBadge > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-bold">
                    {tab.alertBadge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: EXECUTIVE DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white p-5 border border-stone-200 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Active Catalogue</div>
                <div className="font-serif text-3xl text-stone-900">
                  {dashboardData?.metrics?.activeProducts || products.length}
                </div>
                <div className="text-[11px] text-stone-400 flex items-center space-x-1">
                  <span>In {flatCategories.length} categories & subcategories</span>
                </div>
              </div>

              <div className="bg-white p-5 border border-stone-200 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-stone-500 font-medium">Category Hierarchy</div>
                <div className="font-serif text-3xl text-stone-900">
                  {categoriesTree.length} <span className="text-base text-stone-400 font-sans font-light">/ {flatCategories.length}</span>
                </div>
                <div className="text-[11px] text-stone-400">
                  Root families & subcategories
                </div>
              </div>

              <div className="bg-white p-5 border border-stone-200 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-amber-700 font-medium flex items-center justify-between">
                  <span>Low Stock Alert</span>
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                </div>
                <div className="font-serif text-3xl text-amber-800">
                  {dashboardData?.metrics?.lowStockCount || inventoryStats.lowStockCount || 0}
                </div>
                <div className="text-[11px] text-stone-400">
                  Variants ≤ reorder threshold
                </div>
              </div>

              <div className="bg-white p-5 border border-stone-200 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-rose-700 font-medium flex items-center justify-between">
                  <span>Out of Stock</span>
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                </div>
                <div className="font-serif text-3xl text-rose-800">
                  {dashboardData?.metrics?.outOfStockCount || inventoryStats.outOfStockCount || 0}
                </div>
                <div className="text-[11px] text-stone-400">
                  Immediate replenishment needed
                </div>
              </div>

              <div className="bg-white p-5 border border-stone-200 space-y-2">
                <div className="text-[11px] uppercase tracking-wider text-[#C49D3E] font-medium">Est. Inventory Value</div>
                <div className="font-serif text-2xl text-stone-900 font-medium">
                  ${Number(dashboardData?.metrics?.estimatedInventoryValue || 2036055).toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </div>
                <div className="text-[11px] text-stone-400">
                  Based on current retail prices
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-[#12100E] p-6 text-[#EDDFBA] flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-serif text-lg tracking-wide text-white">Direct Atelier Operations</h3>
                <p className="text-xs text-stone-400 font-light">
                  Quick shortcuts for inventory stock intakes, new creation entries, or export reports.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="px-4 py-2.5 bg-[#C49D3E] text-[#12100E] text-xs font-semibold uppercase tracking-wider hover:bg-[#d8b04d] transition-colors"
                >
                  Inspect Stock
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#EDDFBA] text-xs font-medium uppercase tracking-wider border border-[#C49D3E]/30 transition-colors flex items-center space-x-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-[#EDDFBA] text-xs font-medium uppercase tracking-wider border border-[#C49D3E]/30 transition-colors"
                >
                  Manage Categories
                </button>
              </div>
            </div>

            {/* Two Column Section: Recent Movements & Catalogue Updates */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Stock Movements Feed */}
              <div className="bg-white p-6 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-[#C49D3E]" />
                    <h3 className="font-serif text-lg text-stone-900">Recent Stock Movements</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('movements')}
                    className="text-xs text-[#C49D3E] hover:underline flex items-center space-x-0.5"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-stone-100 text-xs">
                  {(dashboardData?.recentMovements || movements.slice(0, 6)).map((m) => (
                    <div key={m.id} className="py-3 flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                            m.movementType === 'received' ? 'bg-emerald-100 text-emerald-800' :
                            m.movementType === 'damaged' ? 'bg-rose-100 text-rose-800' :
                            m.movementType === 'returned' ? 'bg-amber-100 text-amber-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {m.movementType}
                          </span>
                          <span className="font-mono font-medium text-stone-900">{m.sku}</span>
                        </div>
                        <p className="text-stone-600 line-clamp-1">{m.reason}</p>
                        <div className="text-[10px] text-stone-400">
                          By {m.actorName || m.actorEmail || 'Atelier Staff'} • {new Date(m.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className={`font-mono text-sm font-semibold ${
                          m.quantityDelta > 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                        </div>
                        <div className="text-[10px] text-stone-400 font-mono">
                          {m.quantityBefore} → {m.quantityAfter}
                        </div>
                      </div>
                    </div>
                  ))}
                  {movements.length === 0 && (
                    <div className="py-8 text-center text-stone-400 italic">No recent stock movements recorded.</div>
                  )}
                </div>
              </div>

              {/* Recent Catalogue Creations */}
              <div className="bg-white p-6 border border-stone-200 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div className="flex items-center space-x-2">
                    <Package className="w-4 h-4 text-[#C49D3E]" />
                    <h3 className="font-serif text-lg text-stone-900">Recent Catalogue Pieces</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('products')}
                    className="text-xs text-[#C49D3E] hover:underline flex items-center space-x-0.5"
                  >
                    <span>View all</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="divide-y divide-stone-100 text-xs">
                  {products.slice(0, 6).map((p) => (
                    <div key={p.id} className="py-3 flex items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-stone-100 border border-stone-200 overflow-hidden flex-shrink-0">
                          {p.primaryImage ? (
                            <img src={p.primaryImage} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            <Package className="w-5 h-5 text-stone-400 m-auto mt-2.5" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-medium text-stone-900 line-clamp-1">{p.name}</p>
                          <div className="flex items-center space-x-2 text-[10px] text-stone-400">
                            <span className="font-mono">{p.sku}</span>
                            <span>•</span>
                            <span>{p.categoryName || 'Jewellery'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="font-medium text-stone-900 font-mono">
                          ${parseFloat(p.price).toLocaleString()}
                        </div>
                        <span className="inline-block px-1.5 py-0.2 bg-stone-100 text-[10px] text-stone-600 uppercase">
                          {p.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CATEGORY HIERARCHY MANAGEMENT (CAT-01 TO CAT-07) */}
        {/* ========================================================================= */}
        {activeTab === 'categories' && (
          <div className="bg-white border border-stone-200 p-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h2 className="font-serif text-xl text-stone-900">Taxonomy & Category Tree</h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Organize root categories and nested subcategories for storefront navigation and catalog filtering.
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C49D3E] w-48"
                  />
                </div>

                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryForm({
                      name: '',
                      slug: '',
                      parentId: '',
                      description: '',
                      bannerUrl: '',
                      displayOrder: flatCategories.length + 1,
                      status: 'active',
                    });
                    setIsCategoryModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-[#12100E] text-[#EDDFBA] text-xs font-semibold uppercase tracking-wider flex items-center space-x-1.5 hover:bg-black transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#C49D3E]" />
                  <span>+ New Category</span>
                </button>
              </div>
            </div>

            {/* Tree View Structure */}
            <div className="border border-stone-200 divide-y divide-stone-100">
              {categoriesTree
                .filter(cat => {
                  if (!categorySearch.trim()) return true;
                  const q = categorySearch.toLowerCase();
                  const matchRoot = cat.name.toLowerCase().includes(q) || cat.slug.toLowerCase().includes(q);
                  const matchChild = cat.subcategories?.some(s => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q));
                  return matchRoot || matchChild;
                })
                .map((parent) => (
                  <div key={parent.id} className="p-4 space-y-3 bg-[#FCFBF9]">
                    {/* Parent Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FolderTree className="w-4 h-4 text-[#C49D3E]" />
                        <div>
                          <span className="font-serif text-base font-semibold text-stone-900">{parent.name}</span>
                          <span className="ml-2 font-mono text-xs text-stone-400">/{parent.slug}</span>
                          <span className="ml-2 text-xs text-stone-400">({parent.productsCount || 0} pieces)</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold ${
                          parent.status === 'active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {parent.status}
                        </span>

                        <button
                          onClick={() => {
                            setEditingCategory(null);
                            setCategoryForm({
                              name: '',
                              slug: '',
                              parentId: parent.id,
                              description: '',
                              bannerUrl: '',
                              displayOrder: (parent.subcategories?.length || 0) + 1,
                              status: 'active',
                            });
                            setIsCategoryModalOpen(true);
                          }}
                          className="px-2 py-1 text-xs border border-stone-300 text-stone-700 hover:border-[#C49D3E] hover:text-[#C49D3E] bg-white transition-colors"
                          title="Add subcategory inside this family"
                        >
                          + Subcategory
                        </button>

                        <button
                          onClick={() => openEditCategory(parent)}
                          className="p-1.5 text-stone-500 hover:text-stone-900 transition-colors"
                          title="Edit Category Details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteCategory(parent.id, parent.name)}
                          className="p-1.5 text-stone-400 hover:text-rose-700 transition-colors"
                          title="Archive Category"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subcategories Nested List */}
                    {parent.subcategories && parent.subcategories.length > 0 && (
                      <div className="ml-6 pl-4 border-l-2 border-[#C49D3E]/30 space-y-2 pt-1">
                        {parent.subcategories.map(sub => (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between p-2.5 bg-white border border-stone-200 text-xs hover:border-[#C49D3E]/50 transition-colors"
                          >
                            <div className="flex items-center space-x-2">
                              <span className="w-1.5 h-1.5 rounded-none bg-[#C49D3E]" />
                              <span className="font-medium text-stone-800">{sub.name}</span>
                              <span className="font-mono text-[11px] text-stone-400">/{sub.slug}</span>
                              <span className="text-stone-400 text-[11px]">({sub.productsCount || 0} pieces)</span>
                            </div>

                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] text-stone-400 font-mono">Order: {sub.displayOrder}</span>
                              <span className={`px-1.5 py-0.2 text-[9px] uppercase font-semibold ${
                                sub.status === 'active' ? 'bg-emerald-50 text-emerald-800' : 'bg-stone-100 text-stone-500'
                              }`}>
                                {sub.status}
                              </span>
                              <button
                                onClick={() => openEditCategory(sub)}
                                className="p-1 text-stone-400 hover:text-stone-800"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleDeleteCategory(sub.id, sub.name)}
                                className="p-1 text-stone-300 hover:text-rose-700"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CATALOGUE PRODUCTS MANAGEMENT (PRD-01 TO PRD-07) */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="bg-white border border-stone-200 p-6 space-y-6 animate-in fade-in duration-200">
            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex flex-wrap items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search by piece name or SKU..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C49D3E] w-64"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="px-3 py-1.5 bg-stone-50 border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                >
                  <option value="all">All Category Families</option>
                  {flatCategories.map(c => (
                    <option key={c.id} value={c.id}>{c.parentName ? `— ${c.name}` : c.name}</option>
                  ))}
                </select>
              </div>

              <div className="text-xs text-stone-500 font-light">
                Showing {products.length} registered high jewellery master pieces
              </div>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#FAF8F5] text-[11px] uppercase tracking-wider text-stone-500 border-y border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Piece Image & Name</th>
                    <th className="py-3 px-4">SKU / Code</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Price (USD)</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products
                    .filter(p => {
                      if (productCategoryFilter !== 'all' && p.categoryId !== productCategoryFilter) return false;
                      if (productSearch.trim()) {
                        const q = productSearch.toLowerCase();
                        return p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
                      }
                      return true;
                    })
                    .map((prod) => (
                      <tr key={prod.id} className="hover:bg-[#FCFBF9] transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-stone-100 border border-stone-200 flex-shrink-0 overflow-hidden">
                              {prod.primaryImage ? (
                                <img src={prod.primaryImage} alt={prod.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-6 h-6 text-stone-400 m-auto mt-3" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-stone-900">{prod.name}</div>
                              <div className="text-[11px] text-stone-400">{prod.material}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono font-medium text-stone-800">
                          {prod.sku}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 bg-stone-100 text-stone-700 text-[10px]">
                            {prod.categoryName}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-[11px] text-stone-500 uppercase tracking-wide">
                            {prod.productType || (prod.variantCount > 1 ? 'variable' : 'simple')}
                          </span>
                        </td>
                        <td className="py-3 px-4 font-mono font-semibold text-stone-900">
                          ${parseFloat(prod.price).toLocaleString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 text-[10px] font-semibold ${
                            prod.stockStatus === 'in_stock' ? 'bg-emerald-50 text-emerald-800' :
                            prod.stockStatus === 'low_stock' ? 'bg-amber-50 text-amber-800' :
                            'bg-rose-50 text-rose-800'
                          }`}>
                            {prod.stockStatus || 'in stock'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="uppercase text-[10px] font-medium text-stone-500">
                            {prod.status || 'active'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <Link
                            to={`/product/${prod.slug}`}
                            target="_blank"
                            className="p-1 text-stone-400 hover:text-stone-800 inline-block"
                            title="Preview on Storefront"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={async () => {
                              if (window.confirm(`Archive piece "${prod.name}"?`)) {
                                await api.admin.deleteProduct(prod.id);
                                triggerSuccess(`Piece "${prod.name}" archived.`);
                                loadAllData();
                              }
                            }}
                            className="p-1 text-stone-400 hover:text-rose-700 inline-block"
                            title="Archive Piece"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: INVENTORY MANAGEMENT & STOCK ADJUSTMENTS (INV-01 TO INV-09) */}
        {/* ========================================================================= */}
        {activeTab === 'inventory' && (
          <div className="bg-white border border-stone-200 p-6 space-y-6 animate-in fade-in duration-200">
            {/* Filter Pills and Action Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setInventoryFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    inventoryFilter === 'all'
                      ? 'bg-[#12100E] text-[#EDDFBA]'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  All Inventory ({inventoryItems.length})
                </button>

                <button
                  onClick={() => setInventoryFilter('low_stock')}
                  className={`px-3 py-1.5 text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                    inventoryFilter === 'low_stock'
                      ? 'bg-amber-800 text-amber-50'
                      : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3 text-amber-600" />
                  <span>Low Stock ({inventoryStats.lowStockCount || 0})</span>
                </button>

                <button
                  onClick={() => setInventoryFilter('out_of_stock')}
                  className={`px-3 py-1.5 text-xs font-medium flex items-center space-x-1.5 transition-colors ${
                    inventoryFilter === 'out_of_stock'
                      ? 'bg-rose-800 text-rose-50'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100'
                  }`}
                >
                  <AlertCircle className="w-3 h-3 text-rose-600" />
                  <span>Out of Stock ({inventoryStats.outOfStockCount || 0})</span>
                </button>
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search SKU or product..."
                    value={inventorySearch}
                    onChange={(e) => setInventorySearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-[#C49D3E] w-56"
                  />
                </div>

                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 bg-white border border-stone-300 hover:border-[#C49D3E] text-stone-700 text-xs font-medium flex items-center space-x-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-[#C49D3E]" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Inventory Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#FAF8F5] text-[11px] uppercase tracking-wider text-stone-500 border-y border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Variant SKU & Barcode</th>
                    <th className="py-3 px-4">Piece Name</th>
                    <th className="py-3 px-4">Attributes</th>
                    <th className="py-3 px-4 text-center">On Hand</th>
                    <th className="py-3 px-4 text-center">Reserved</th>
                    <th className="py-3 px-4 text-center">Available</th>
                    <th className="py-3 px-4 text-center">Reorder Point</th>
                    <th className="py-3 px-4">Stock Status</th>
                    <th className="py-3 px-4 text-right">Adjustment Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.variantId} className="hover:bg-[#FCFBF9] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-medium text-stone-900">{item.sku}</div>
                        {item.barcode && (
                          <div className="font-mono text-[10px] text-stone-400">{item.barcode}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-900">
                        {item.productName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-[10px]">
                          {item.variantName || 'Standard'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-stone-800">
                        {item.quantityOnHand}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-stone-400">
                        {item.quantityReserved}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-stone-900">
                        {item.quantityAvailable}
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-stone-400">
                        {item.reorderThreshold}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          item.stockStatus === 'in_stock' ? 'bg-emerald-50 text-emerald-800' :
                          item.stockStatus === 'low_stock' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}>
                          {item.stockStatus.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedVariant(item);
                            setAdjustForm({
                              movementType: 'received',
                              quantityDelta: 5,
                              reason: '',
                              reference: '',
                            });
                            setIsAdjustModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-stone-900 text-[#EDDFBA] hover:bg-black text-[11px] font-medium transition-colors"
                        >
                          Adjust Stock
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredInventory.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-stone-400 italic">
                        No inventory records matching current filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: STOCK MOVEMENT & AUDIT HISTORY LEDGER (INV-03, INV-06) */}
        {/* ========================================================================= */}
        {activeTab === 'movements' && (
          <div className="bg-white border border-stone-200 p-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h2 className="font-serif text-xl text-stone-900">Inventory Movement & Audit Ledger</h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Complete immutable transactional ledger of stock received, count corrections, damaged pieces, and customer returns.
                </p>
              </div>

              <div className="text-xs text-stone-500 font-light font-mono">
                {movements.length} logged ledger entries
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#FAF8F5] text-[11px] uppercase tracking-wider text-stone-500 border-y border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Actor</th>
                    <th className="py-3 px-4">Variant SKU & Piece</th>
                    <th className="py-3 px-4">Movement Type</th>
                    <th className="py-3 px-4 text-center">Delta</th>
                    <th className="py-3 px-4 text-center">Before → After</th>
                    <th className="py-3 px-4">Reason & Reference</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-[#FCFBF9] transition-colors">
                      <td className="py-3 px-4 font-mono text-stone-500 text-[11px]">
                        {new Date(m.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-900">{m.actorName || 'Atelier Staff'}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{m.actorEmail || 'staff@shineyjewellery.com'}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-mono font-medium text-stone-900">{m.sku}</div>
                        <div className="text-stone-500 text-[11px]">{m.productName}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[10px] font-semibold uppercase ${
                          m.movementType === 'received' ? 'bg-emerald-100 text-emerald-800' :
                          m.movementType === 'damaged' ? 'bg-rose-100 text-rose-800' :
                          m.movementType === 'returned' ? 'bg-amber-100 text-amber-800' :
                          'bg-indigo-100 text-indigo-800'
                        }`}>
                          {m.movementType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-mono font-bold ${
                          m.quantityDelta > 0 ? 'text-emerald-700' : 'text-rose-700'
                        }`}>
                          {m.quantityDelta > 0 ? `+${m.quantityDelta}` : m.quantityDelta}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-stone-500">
                        {m.quantityBefore} → <span className="font-bold text-stone-900">{m.quantityAfter}</span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-stone-800">{m.reason}</p>
                        {m.reference && (
                          <span className="font-mono text-[10px] text-stone-400">Ref: {m.reference}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {movements.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-400 italic">
                        No movement entries recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CLIENT ORDERS & COMMISSIONS */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-stone-200 p-6 space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
              <div>
                <h2 className="font-serif text-xl text-stone-900">Client Orders & Fulfilment Dossiers</h2>
                <p className="text-xs text-stone-500 font-light mt-0.5">
                  Track bespoke client acquisition orders, manage authorized lifecycle transitions, and scan QR tokens for instant lookup.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsQrScannerOpen(true)}
                  className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-900 text-xs font-semibold uppercase tracking-wider shadow-sm transition-all border border-[#C49D3E]/40"
                >
                  <QrCode className="w-4 h-4 text-[#C49D3E]" />
                  <span>Scan Receipt QR</span>
                </button>
                <button
                  type="button"
                  onClick={loadOrders}
                  className="inline-flex items-center space-x-1.5 px-3 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium uppercase tracking-wider transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') loadOrders(); }}
                  placeholder="Search Order #, Client, Email, QR Token..."
                  className="w-full pl-9 pr-4 py-2 text-xs border border-stone-300 focus:outline-none focus:border-[#C49D3E] bg-[#FCFBF9]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => {
                    setOrderStatusFilter(e.target.value);
                  }}
                  className="px-3 py-2 bg-stone-50 border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                >
                  <option value="all">All Statuses ({orders.length})</option>
                  <option value="pending_confirmation">Pending Confirmation</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="processing">Processing</option>
                  <option value="packed">Packed</option>
                  <option value="shipped">Shipped</option>
                  <option value="out_for_delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="delivery_failed">Delivery Failed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="returned">Returned</option>
                </select>
                <button
                  type="button"
                  onClick={loadOrders}
                  className="px-3 py-2 bg-stone-800 text-white text-xs font-semibold uppercase tracking-wider"
                >
                  Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-[#FAF8F5] text-[11px] uppercase tracking-wider text-stone-500 border-y border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Order Reference</th>
                    <th className="py-3 px-4">Client / Recipient</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Payment</th>
                    <th className="py-3 px-4">Status & Carrier</th>
                    <th className="py-3 px-4">Placed Date</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-[#FCFBF9] transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-mono font-bold text-stone-900">{o.orderNumber}</div>
                        {o.qrToken && (
                          <div className="text-[10px] text-stone-400 font-mono flex items-center space-x-1 mt-0.5">
                            <QrCode className="w-2.5 h-2.5 text-[#C49D3E]" />
                            <span className="truncate max-w-[120px]">{o.qrToken}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-900">{o.recipient}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{o.clientEmail}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-stone-900">
                        ${parseFloat(o.totalAmount).toLocaleString()} {o.currency}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 text-[10px] uppercase font-semibold">
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 text-[10px] uppercase font-semibold inline-block ${
                          o.status === 'delivered' ? 'bg-emerald-100 text-emerald-900' :
                          o.status === 'cancelled' || o.status === 'delivery_failed' ? 'bg-rose-100 text-rose-900' :
                          o.status === 'shipped' || o.status === 'out_for_delivery' ? 'bg-amber-100 text-amber-900' :
                          'bg-stone-100 text-stone-800'
                        }`}>
                          {o.status.replace(/_/g, ' ')}
                        </span>
                        {o.carrierName && (
                          <div className="text-[10px] text-stone-500 font-light mt-0.5 flex items-center space-x-1">
                            <Truck className="w-2.5 h-2.5 text-[#C49D3E]" />
                            <span>{o.carrierName} {o.trackingNumber ? `(${o.trackingNumber})` : ''}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 font-mono text-stone-500 text-[11px]">
                        {new Date(o.placedAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenOrderDetail(o.id)}
                          className="px-2.5 py-1.5 bg-[#12100E] text-[#EDDFBA] hover:bg-stone-800 text-[11px] font-semibold uppercase tracking-wider transition-colors"
                        >
                          Lifecycle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenReceipt(o.id)}
                          className="px-2.5 py-1.5 border border-stone-300 text-stone-700 hover:text-stone-950 text-[11px] font-semibold uppercase tracking-wider transition-colors"
                          title="View Official Receipt & QR"
                        >
                          Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-400 italic">
                        No client orders recorded.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: MINIO MEDIA STUDIO */}
        {/* ========================================================================= */}
        {activeTab === 'upload' && (
          <div className="bg-white border border-stone-200 p-8 max-w-2xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="text-center space-y-2 border-b border-stone-100 pb-6">
              <div className="w-12 h-12 bg-stone-100 border border-stone-200 flex items-center justify-center mx-auto text-[#C49D3E]">
                <Upload className="w-6 h-6" />
              </div>
              <h2 className="font-serif text-2xl text-stone-900">MinIO S3 Media Storage Uploader</h2>
              <p className="text-xs text-stone-500 font-light max-w-md mx-auto">
                Securely generate presigned PUT upload authorization to stream high-resolution jewelry photography into MinIO storage.
              </p>
            </div>

            <form onSubmit={handleUploadMedia} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 uppercase tracking-wider mb-2">
                  Select Photography Asset (.webp, .jpg, .png)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="block w-full text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-semibold file:bg-[#12100E] file:text-[#EDDFBA] hover:file:bg-black cursor-pointer border border-stone-200 p-2"
                />
              </div>

              <button
                type="submit"
                disabled={!uploadFile || isUploading}
                className="w-full py-3 bg-[#12100E] text-[#EDDFBA] text-xs font-semibold uppercase tracking-wider hover:bg-black transition-colors disabled:opacity-50"
              >
                {isUploading ? 'Streaming to MinIO S3...' : 'Generate Presigned URL & Upload'}
              </button>
            </form>

            {uploadedUrl && (
              <div className="p-4 bg-[#FAF8F5] border border-stone-200 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-center space-x-2 text-xs text-emerald-800 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Asset Uploaded Successfully!</span>
                </div>
                <div className="w-32 h-32 bg-white border border-stone-200 mx-auto overflow-hidden">
                  <img src={uploadedUrl} alt="Uploaded Asset" className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] text-stone-400 uppercase tracking-wider font-mono">CDN / Storage URL:</div>
                  <input
                    type="text"
                    readOnly
                    value={uploadedUrl}
                    className="w-full p-2 bg-white border border-stone-200 font-mono text-xs text-stone-700"
                    onClick={(e) => e.target.select()}
                  />
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* ========================================================================= */}
      {/* MODAL: CREATE / EDIT CATEGORY (CAT-01, CAT-02, CAT-04, CAT-05) */}
      {/* ========================================================================= */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 max-w-lg w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-serif text-lg text-stone-900">
                {editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create Category or Subcategory'}
              </h3>
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Parent Category (Optional)</label>
                <select
                  value={categoryForm.parentId}
                  onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                >
                  <option value="">— None (Root Category Family) —</option>
                  {flatCategories
                    .filter(c => !editingCategory || c.id !== editingCategory.id)
                    .map(c => (
                      <option key={c.id} value={c.id}>{c.parentName ? `↳ ${c.name}` : c.name}</option>
                    ))}
                </select>
                <p className="text-[11px] text-stone-400 mt-1">Select a parent category to make this a nested subcategory.</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                      setCategoryForm({
                        ...categoryForm,
                        name,
                        slug: editingCategory ? categoryForm.slug : slug,
                      });
                    }}
                    placeholder="e.g. Diamond Pendants"
                    className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Unique Slug *</label>
                  <input
                    type="text"
                    required
                    value={categoryForm.slug}
                    onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value.toLowerCase() })}
                    placeholder="e.g. diamond-pendants"
                    className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 font-mono focus:outline-none focus:border-[#C49D3E]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">Description</label>
                <textarea
                  rows={2}
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Artisanal description of this collection..."
                  className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-medium mb-1">Display Order</label>
                  <input
                    type="number"
                    value={categoryForm.displayOrder}
                    onChange={(e) => setCategoryForm({ ...categoryForm, displayOrder: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-medium mb-1">Status</label>
                  <select
                    value={categoryForm.status}
                    onChange={(e) => setCategoryForm({ ...categoryForm, status: e.target.value })}
                    className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12100E] text-[#EDDFBA] font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: STOCK ADJUSTMENT (INV-02, INV-03, INV-06, INV-07) */}
      {/* ========================================================================= */}
      {isAdjustModalOpen && selectedVariant && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white border border-stone-200 max-w-md w-full p-6 space-y-4 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-lg text-stone-900">Adjust Physical Stock</h3>
                <p className="text-[11px] text-stone-400">SKU: {selectedVariant.sku}</p>
              </div>
              <button
                onClick={() => setIsAdjustModalOpen(false)}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Stock Preview */}
            <div className="p-3 bg-[#FAF8F5] border border-stone-200 grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div className="text-[10px] text-stone-400 uppercase">On Hand</div>
                <div className="font-mono font-bold text-stone-900 text-sm">{selectedVariant.quantityOnHand}</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-400 uppercase">Reserved</div>
                <div className="font-mono text-stone-500 text-sm">{selectedVariant.quantityReserved}</div>
              </div>
              <div>
                <div className="text-[10px] text-stone-400 uppercase">Available</div>
                <div className="font-mono font-bold text-emerald-800 text-sm">{selectedVariant.quantityAvailable}</div>
              </div>
            </div>

            <form onSubmit={handleApplyAdjustment} className="space-y-4 text-xs">
              <div>
                <label className="block text-stone-700 font-medium mb-1">Movement Type *</label>
                <select
                  value={adjustForm.movementType}
                  onChange={(e) => setAdjustForm({ ...adjustForm, movementType: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                >
                  <option value="received">Stock Received from Workshop (+ Inflow)</option>
                  <option value="correction">Inventory Audit Reconciliation (Correction)</option>
                  <option value="damaged">Damaged / Written Off (- Outflow)</option>
                  <option value="returned">Customer Return to Stock (+ Inflow)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Quantity Delta (+ or -) *
                </label>
                <input
                  type="number"
                  required
                  value={adjustForm.quantityDelta}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantityDelta: e.target.value })}
                  className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 font-mono text-sm focus:outline-none focus:border-[#C49D3E]"
                />
                <div className="text-[11px] text-stone-500 mt-1">
                  Resulting On-Hand Stock:{' '}
                  <span className="font-mono font-bold text-stone-900">
                    {selectedVariant.quantityOnHand + (parseInt(adjustForm.quantityDelta, 10) || 0)}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Mandatory Adjustment Reason *
                </label>
                <textarea
                  rows={2}
                  required
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  placeholder="e.g. Quarterly physical vault recount verified with master jeweller"
                  className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-medium mb-1">
                  Reference Code (Optional)
                </label>
                <input
                  type="text"
                  value={adjustForm.reference}
                  onChange={(e) => setAdjustForm({ ...adjustForm, reference: e.target.value })}
                  placeholder="e.g. PO-GEN-2026-088"
                  className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#12100E] text-[#EDDFBA] font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                >
                  Confirm & Commit Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DRAWER / MODAL: CREATE CATALOGUE PIECE (PRD-01 TO PRD-07) */}
      {/* ========================================================================= */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-stone-200 max-w-3xl w-full p-6 space-y-4 shadow-2xl my-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-serif text-xl text-stone-900">Create Catalogue Masterpiece</h3>
                <p className="text-xs text-stone-500 font-light">Add new luxury creation, assign taxonomy, variants and inventory.</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="text-stone-400 hover:text-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Internal Tabs */}
            <div className="flex border-b border-stone-200 space-x-4 text-xs uppercase tracking-wider font-medium">
              {[
                { id: 'general', label: '1. General Info' },
                { id: 'specs', label: '2. Specifications' },
                { id: 'variants', label: '3. Variants & Stock' },
                { id: 'images', label: '4. Imagery' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setProductModalTab(t.id)}
                  className={`py-2 border-b-2 transition-colors ${
                    productModalTab === t.id
                      ? 'border-[#C49D3E] text-stone-900 font-semibold'
                      : 'border-transparent text-stone-400 hover:text-stone-700'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs pt-2">
              {/* TAB 1: GENERAL INFO */}
              {productModalTab === 'general' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Piece Name *</label>
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                          setProductForm({ ...productForm, name, slug });
                        }}
                        placeholder="The Empress Solitaire Ring"
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Unique SKU *</label>
                      <input
                        type="text"
                        required
                        value={productForm.sku}
                        onChange={(e) => setProductForm({ ...productForm, sku: e.target.value.toUpperCase() })}
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 font-mono focus:outline-none focus:border-[#C49D3E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Category Family *</label>
                      <select
                        value={productForm.categoryId}
                        onChange={(e) => setProductForm({ ...productForm, categoryId: e.target.value })}
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      >
                        {flatCategories.map(c => (
                          <option key={c.id} value={c.id}>{c.parentName ? `↳ ${c.name}` : c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Product Type *</label>
                      <select
                        value={productForm.productType}
                        onChange={(e) => setProductForm({ ...productForm, productType: e.target.value })}
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      >
                        <option value="simple">Simple Product (One Standard SKU)</option>
                        <option value="variable">Variable Product (Multiple Selectable Options)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Retail Price ($ USD) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={productForm.price}
                        onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 font-mono focus:outline-none focus:border-[#C49D3E]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Short Description *</label>
                    <input
                      type="text"
                      required
                      value={productForm.shortDescription}
                      onChange={(e) => setProductForm({ ...productForm, shortDescription: e.target.value })}
                      placeholder="One-line summary for shop cards"
                      className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-medium mb-1">Full Haute Joaillerie Story *</label>
                    <textarea
                      rows={3}
                      required
                      value={productForm.description}
                      onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                      placeholder="Full narrative regarding gemstone provenance and atelier casting..."
                      className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: SPECIFICATIONS */}
              {productModalTab === 'specs' && (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Precious Metal / Material *</label>
                      <input
                        type="text"
                        required
                        value={productForm.material}
                        onChange={(e) => setProductForm({ ...productForm, material: e.target.value })}
                        placeholder="e.g. 18k Solid Yellow Gold"
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Gold Carat / Purity</label>
                      <input
                        type="text"
                        value={productForm.goldCarat}
                        onChange={(e) => setProductForm({ ...productForm, goldCarat: e.target.value })}
                        placeholder="e.g. 18KT or Platinum 950"
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Main Gemstone</label>
                      <input
                        type="text"
                        value={productForm.gemstone}
                        onChange={(e) => setProductForm({ ...productForm, gemstone: e.target.value })}
                        placeholder="e.g. 2.5ct Cushion Emerald"
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Weight (Grams)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={productForm.weightGrams}
                        onChange={(e) => setProductForm({ ...productForm, weightGrams: e.target.value })}
                        placeholder="e.g. 8.4"
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">Barcode / EAN</label>
                      <input
                        type="text"
                        value={productForm.barcode}
                        onChange={(e) => setProductForm({ ...productForm, barcode: e.target.value })}
                        placeholder="e.g. BAR-889012"
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">SEO Title (Optional)</label>
                      <input
                        type="text"
                        value={productForm.seoTitle}
                        onChange={(e) => setProductForm({ ...productForm, seoTitle: e.target.value })}
                        placeholder="Luxury Diamond Rings | Shiney Jewellery"
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-700 font-medium mb-1">SEO Meta Description</label>
                      <input
                        type="text"
                        value={productForm.seoDescription}
                        onChange={(e) => setProductForm({ ...productForm, seoDescription: e.target.value })}
                        placeholder="Discover handcrafted fine jewellery rings..."
                        className="w-full p-2 bg-stone-50 border border-stone-300 text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: VARIANTS & STOCK */}
              {productModalTab === 'variants' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <div>
                      <span className="font-semibold text-stone-900">Sellable Variants & Physical Stock</span>
                      <p className="text-[11px] text-stone-400">Each variant tracks its own unique SKU, price, and stock count.</p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const idx = productForm.variants.length + 1;
                        setProductForm({
                          ...productForm,
                          variants: [
                            ...productForm.variants,
                            {
                              name: `Option ${idx}`,
                              value: `opt-${idx}`,
                              sku: `${productForm.sku}-OPT${idx}`,
                              price: productForm.price,
                              stockQuantity: 10,
                              barcode: '',
                            }
                          ]
                        });
                      }}
                      className="px-3 py-1 bg-stone-100 border border-stone-300 text-stone-700 hover:border-[#C49D3E] transition-colors"
                    >
                      + Add Variant Option
                    </button>
                  </div>

                  <div className="space-y-2">
                    {productForm.variants.map((v, i) => (
                      <div key={i} className="p-3 bg-stone-50 border border-stone-200 grid grid-cols-4 gap-2 items-center">
                        <div>
                          <label className="block text-[10px] text-stone-400 uppercase">Option / Size</label>
                          <input
                            type="text"
                            value={v.name}
                            onChange={(e) => {
                              const updated = [...productForm.variants];
                              updated[i].name = e.target.value;
                              updated[i].value = e.target.value.toLowerCase().replace(/\s+/g, '-');
                              setProductForm({ ...productForm, variants: updated });
                            }}
                            className="w-full p-1.5 bg-white border border-stone-300 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-stone-400 uppercase">Variant SKU</label>
                          <input
                            type="text"
                            value={v.sku}
                            placeholder={`${productForm.sku}-${v.value}`}
                            onChange={(e) => {
                              const updated = [...productForm.variants];
                              updated[i].sku = e.target.value.toUpperCase();
                              setProductForm({ ...productForm, variants: updated });
                            }}
                            className="w-full p-1.5 bg-white border border-stone-300 font-mono text-xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] text-stone-400 uppercase">Initial Stock</label>
                          <input
                            type="number"
                            value={v.stockQuantity}
                            onChange={(e) => {
                              const updated = [...productForm.variants];
                              updated[i].stockQuantity = parseInt(e.target.value, 10) || 0;
                              setProductForm({ ...productForm, variants: updated });
                            }}
                            className="w-full p-1.5 bg-white border border-stone-300 font-mono text-xs"
                          />
                        </div>

                        <div className="flex items-center space-x-2 pt-3">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="Price"
                            value={v.price}
                            onChange={(e) => {
                              const updated = [...productForm.variants];
                              updated[i].price = e.target.value;
                              setProductForm({ ...productForm, variants: updated });
                            }}
                            className="w-full p-1.5 bg-white border border-stone-300 font-mono text-xs"
                          />
                          {productForm.variants.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                setProductForm({
                                  ...productForm,
                                  variants: productForm.variants.filter((_, idx) => idx !== i)
                                });
                              }}
                              className="text-stone-400 hover:text-rose-600 p-1"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: IMAGERY */}
              {productModalTab === 'images' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Direct System / Computer File Upload Dropzone */}
                  <div className="space-y-2">
                    <label className="block text-stone-900 font-semibold text-xs uppercase tracking-wider">
                      Upload Photos from Your System / Computer *
                    </label>

                    <div className="relative border-2 border-dashed border-[#C49D3E]/40 hover:border-[#C49D3E] bg-[#FAF8F5] p-6 text-center transition-all group">
                      <input
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/webp,image/avif,image/jpg"
                        onChange={handlePieceImagesUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        title="Upload images from your device"
                      />

                      <div className="space-y-2 pointer-events-none">
                        <div className="w-12 h-12 bg-white border border-[#C49D3E]/40 group-hover:border-[#C49D3E] group-hover:scale-105 transition-all flex items-center justify-center mx-auto text-[#C49D3E]">
                          <Upload className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-semibold text-stone-900 text-xs">
                            Click to Browse Your Computer
                          </span>
                          <span className="text-stone-500 text-xs"> or drag & drop high-res image files here</span>
                        </div>
                        <p className="text-[11px] text-stone-400">
                          Supports JPEG, PNG, WebP, AVIF up to 15MB each • Select multiple photos at once
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Uploading Status */}
                  {isUploading && (
                    <div className="p-3 bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-[#C49D3E]" />
                      <span>Reading and uploading photography assets from your system...</span>
                    </div>
                  )}

                  {/* Uploaded Photos Gallery & Primary Cover Selector */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-stone-900 text-xs">
                        Selected Piece Photography ({productForm.images.length})
                      </span>
                      <span className="text-[11px] text-stone-400">
                        First image or starred image serves as the main storefront cover.
                      </span>
                    </div>

                    {productForm.images.length === 0 ? (
                      <div className="p-8 bg-stone-50 border border-stone-200 text-center text-stone-400 text-xs italic">
                        No photography attached yet. Upload photos from your computer above or select from sample presets below.
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {productForm.images.map((img, i) => (
                          <div
                            key={i}
                            className={`relative border p-2 space-y-2 transition-all ${
                              img.isPrimary
                                ? 'bg-amber-50/50 border-[#C49D3E] ring-1 ring-[#C49D3E]'
                                : 'bg-white border-stone-200 hover:border-stone-300'
                            }`}
                          >
                            {/* Primary Badge */}
                            <div className="flex items-center justify-between text-[10px]">
                              <button
                                type="button"
                                onClick={() => setPrimaryImage(i)}
                                className={`px-2 py-0.5 font-semibold uppercase flex items-center space-x-1 transition-colors ${
                                  img.isPrimary
                                    ? 'bg-[#12100E] text-[#EDDFBA]'
                                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                                }`}
                                title="Click to set as primary storefront cover photo"
                              >
                                <Star className={`w-3 h-3 ${img.isPrimary ? 'text-[#C49D3E] fill-[#C49D3E]' : ''}`} />
                                <span>{img.isPrimary ? 'Cover' : 'Set Cover'}</span>
                              </button>

                              <span className="font-mono text-stone-400">#{i + 1}</span>
                            </div>

                            {/* Thumbnail Preview */}
                            <div className="w-full h-28 bg-stone-100 border border-stone-100 overflow-hidden relative">
                              <img src={img.cdnUrl} alt={img.altText || 'Jewellery preview'} className="w-full h-full object-cover" />
                            </div>

                            {/* File details & Reorder Controls */}
                            <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  disabled={i === 0}
                                  onClick={() => movePieceImage(i, -1)}
                                  className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-30 disabled:hover:text-stone-400"
                                  title="Move Left"
                                >
                                  <ArrowLeft className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  disabled={i === productForm.images.length - 1}
                                  onClick={() => movePieceImage(i, 1)}
                                  className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-30 disabled:hover:text-stone-400"
                                  title="Move Right"
                                >
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>

                              <button
                                type="button"
                                onClick={() => removePieceImage(i)}
                                className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                                title="Remove Image"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Preset Quick Library and Custom URL */}
                  <div className="p-3 bg-stone-50 border border-stone-200 space-y-2">
                    <div className="text-[11px] font-semibold text-stone-700 uppercase tracking-wide">
                      Or Quick-Add from Atelier Presets:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: 'Rings (Emerald/Gold)', url: '/images/r1.jpg' },
                        { label: 'Rings (Diamond Solitaire)', url: '/images/r2.jpg' },
                        { label: 'Rings (Sapphire Band)', url: '/images/r3.jpg' },
                        { label: 'Necklaces (Diamond Pendant)', url: '/images/n1.jpg' },
                        { label: 'Necklaces (Rivière)', url: '/images/n2.jpg' },
                        { label: 'Bracelets (Tennis)', url: '/images/b1.jpg' },
                        { label: 'Bracelets (Bangle)', url: '/images/b2.jpg' },
                        { label: 'Earrings (Drops)', url: '/images/e1.jpg' },
                      ].map((preset) => (
                        <button
                          key={preset.url}
                          type="button"
                          onClick={() => {
                            setProductForm((prev) => ({
                              ...prev,
                              images: [
                                ...prev.images,
                                {
                                  cdnUrl: preset.url,
                                  altText: `${productForm.name || 'Jewellery piece'} photography`,
                                  isPrimary: prev.images.length === 0,
                                  filename: preset.label,
                                },
                              ],
                            }));
                            triggerSuccess(`Added ${preset.label} preset.`);
                          }}
                          className="px-2.5 py-1 bg-white border border-stone-300 hover:border-[#C49D3E] text-[11px] text-stone-700 transition-colors"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-stone-200/60 flex space-x-2">
                      <input
                        type="text"
                        placeholder="Or enter custom image URL (e.g. https://... or /images/...)"
                        id="customImageUrlInput"
                        className="flex-1 p-1.5 bg-white border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-[#C49D3E]"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const inputEl = document.getElementById('customImageUrlInput');
                          const val = inputEl?.value.trim();
                          if (val) {
                            setProductForm((prev) => ({
                              ...prev,
                              images: [
                                ...prev.images,
                                {
                                  cdnUrl: val,
                                  altText: `${productForm.name || 'Jewellery piece'} photography`,
                                  isPrimary: prev.images.length === 0,
                                  filename: 'External Asset',
                                },
                              ],
                            }));
                            inputEl.value = '';
                            triggerSuccess('Added custom image URL.');
                          }
                        }}
                        className="px-3 py-1.5 bg-stone-900 text-[#EDDFBA] text-xs font-medium uppercase"
                      >
                        + Add URL
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Action Controls */}
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-1.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={productForm.isFeatured}
                      onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                      className="accent-[#C49D3E]"
                    />
                    <span>Mark as Featured</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={productForm.isNewArrival}
                      onChange={(e) => setProductForm({ ...productForm, isNewArrival: e.target.checked })}
                      className="accent-[#C49D3E]"
                    />
                    <span>New Arrival</span>
                  </label>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsProductModalOpen(false)}
                    className="px-4 py-2 bg-stone-100 text-stone-700 hover:bg-stone-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-[#12100E] text-[#EDDFBA] font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    Save & Publish Piece
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff QR Scanner Modal */}
      <StaffQrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        onOrderResolved={handleQrOrderResolved}
      />

      {/* Staff Order Detail & Lifecycle Transition Modal */}
      <StaffOrderDetailModal
        isOpen={isOrderDetailOpen}
        onClose={() => {
          setIsOrderDetailOpen(false);
          setSelectedAdminOrder(null);
        }}
        order={selectedAdminOrder}
        onStatusUpdated={(updatedOrder) => {
          setSelectedAdminOrder(updatedOrder);
          loadOrders();
          triggerSuccess(`Order ${updatedOrder.orderNumber} status updated to ${updatedOrder.statusLabel || updatedOrder.status}`);
        }}
        onOpenReceipt={(orderId) => handleOpenReceipt(orderId)}
      />

      {/* Official Receipt & QR Modal */}
      <ReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => {
          setIsReceiptModalOpen(false);
          setReceiptModalOrderId(null);
        }}
        orderId={receiptModalOrderId}
      />

    </div>
  );
}
