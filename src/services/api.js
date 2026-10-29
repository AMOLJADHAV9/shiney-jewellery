// API Client Service for Shiney Haute Joaillerie
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

// Unique persistent guest session ID
function getGuestSessionId() {
  let guestId = localStorage.getItem('shiney_guest_session_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
    localStorage.setItem('shiney_guest_session_id', guestId);
  }
  return guestId;
}

// Token helper
export function getAuthToken() {
  return localStorage.getItem('shiney_auth_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('shiney_auth_token', token);
  } else {
    localStorage.removeItem('shiney_auth_token');
  }
}

// Core HTTP requester
async function apiRequest(endpoint, options = {}) {
  const token = getAuthToken();
  const guestSessionId = getGuestSessionId();

  const headers = {
    'Content-Type': 'application/json',
    'X-Guest-Session-Id': guestSessionId,
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error?.message || response.statusText || 'Request failed';
      const error = new Error(errorMsg);
      error.status = response.status;
      error.code = data?.error?.code;
      error.details = data?.error?.details;
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'}] ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  // Health
  health: {
    check: () => apiRequest('/health'),
  },

  // Auth
  auth: {
    login: async (email, password) => {
      const res = await apiRequest('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      if (res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res.data;
    },
    register: async (data) => {
      const res = await apiRequest('/auth/register', {
        method: 'POST',
        body: data,
      });
      if (res.data?.token) {
        setAuthToken(res.data.token);
      }
      return res.data;
    },
    getMe: async () => {
      const res = await apiRequest('/auth/me');
      return res.data;
    },
    logout: () => {
      setAuthToken(null);
    },
  },

  // Catalog
  catalog: {
    getCategories: async () => {
      const res = await apiRequest('/categories');
      return res.data;
    },
    getProducts: async (params = {}) => {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '' && val !== 'all') {
          query.append(key, val);
        }
      });
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await apiRequest(`/products${qs}`);
      return res;
    },
    getProductBySlug: async (slug) => {
      const res = await apiRequest(`/products/${slug}`);
      return res.data;
    },
  },

  // Cart
  cart: {
    getCart: async () => {
      const res = await apiRequest('/cart');
      return res.data;
    },
    addItem: async ({ productId, variantId, quantity = 1, customEngravingText }) => {
      const res = await apiRequest('/cart/items', {
        method: 'POST',
        body: { productId, variantId, quantity, customEngravingText },
      });
      return res.data;
    },
    updateQuantity: async (itemId, quantity) => {
      const res = await apiRequest(`/cart/items/${itemId}`, {
        method: 'PATCH',
        body: { quantity },
      });
      return res.data;
    },
    removeItem: async (itemId) => {
      const res = await apiRequest(`/cart/items/${itemId}`, {
        method: 'DELETE',
      });
      return res.data;
    },
    clearCart: async () => {
      const res = await apiRequest('/cart', {
        method: 'DELETE',
      });
      return res.data;
    },
  },

  // Orders
  orders: {
    createOrder: async (orderData) => {
      const res = await apiRequest('/orders', {
        method: 'POST',
        body: orderData,
      });
      return res.data;
    },
    create: async (orderData) => {
      const res = await apiRequest('/orders', {
        method: 'POST',
        body: orderData,
      });
      return res.data;
    },
    getOrderById: async (orderId) => {
      const res = await apiRequest(`/orders/${orderId}`);
      return res.data;
    },
    getMyOrders: async () => {
      const res = await apiRequest('/orders/my-orders');
      return res.data;
    },
    getReceipt: async (orderId) => {
      const res = await apiRequest(`/orders/${orderId}/receipt`);
      return res.data;
    },
    getTracking: async (orderId) => {
      const res = await apiRequest(`/orders/${orderId}/tracking`);
      return res.data;
    },
  },

  // Payments (Razorpay & Webhooks)
  payments: {
    getRazorpayConfig: async () => {
      const res = await apiRequest('/payments/razorpay/config');
      return res.data;
    },
    createRazorpayOrder: async (orderId) => {
      const res = await apiRequest('/payments/razorpay/create-order', {
        method: 'POST',
        body: { orderId },
      });
      return res.data;
    },
    verifyRazorpayPayment: async ({ orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
      const res = await apiRequest('/payments/razorpay/verify', {
        method: 'POST',
        body: { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature },
      });
      return res.data;
    },
    confirmPaymentWebhook: async (payload) => {
      const res = await apiRequest('/payments/webhook', {
        method: 'POST',
        body: payload,
      });
      return res.data;
    },
  },

  // Category Management (CAT-01 to CAT-07)
  categories: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await apiRequest(`/categories${query ? `?${query}` : ''}`);
      return res;
    },
    getHierarchy: async () => {
      const res = await apiRequest('/categories?tree=true');
      return res;
    },
    getById: async (id) => {
      const res = await apiRequest(`/categories/${id}`);
      return res.data;
    },
    create: async (data) => {
      const res = await apiRequest('/categories', {
        method: 'POST',
        body: data,
      });
      return res.data;
    },
    update: async (id, data) => {
      const res = await apiRequest(`/categories/${id}`, {
        method: 'PATCH',
        body: data,
      });
      return res.data;
    },
    delete: async (id) => {
      const res = await apiRequest(`/categories/${id}`, {
        method: 'DELETE',
      });
      return res;
    },
  },

  // Inventory Management (INV-01 to INV-09)
  inventory: {
    getAll: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await apiRequest(`/inventory${query ? `?${query}` : ''}`);
      return res;
    },
    getLowStock: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await apiRequest(`/inventory/low-stock${query ? `?${query}` : ''}`);
      return res;
    },
    adjust: async (data) => {
      const res = await apiRequest('/inventory/adjustments', {
        method: 'POST',
        body: data,
      });
      return res.data;
    },
    getMovements: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await apiRequest(`/inventory/movements${query ? `?${query}` : ''}`);
      return res;
    },
  },

  // Editorial Journal / Blog
  blog: {
    getPosts: async (params = {}) => {
      const query = new URLSearchParams();
      if (params.category && params.category !== 'all') query.append('category', params.category);
      if (params.page) query.append('page', params.page);
      if (params.limit) query.append('limit', params.limit);
      const qs = query.toString() ? `?${query.toString()}` : '';
      const res = await apiRequest(`/blog${qs}`);
      return res;
    },
    getPostBySlug: async (slug) => {
      const res = await apiRequest(`/blog/${slug}`);
      return res.data;
    },
  },

  // Admin Operations
  admin: {
    getDashboard: async () => {
      const res = await apiRequest('/admin/dashboard');
      return res.data;
    },
    getProducts: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await apiRequest(`/admin/products${query ? `?${query}` : ''}`);
      return res;
    },
    createProduct: async (productData) => {
      const res = await apiRequest('/admin/products', {
        method: 'POST',
        body: productData,
      });
      return res.data;
    },
    updateProduct: async (id, data) => {
      const res = await apiRequest(`/admin/products/${id}`, {
        method: 'PATCH',
        body: data,
      });
      return res.data;
    },
    deleteProduct: async (id) => {
      const res = await apiRequest(`/admin/products/${id}`, {
        method: 'DELETE',
      });
      return res.data;
    },
    getOrders: async (params = {}) => {
      const query = new URLSearchParams(params).toString();
      const res = await apiRequest(`/admin/orders${query ? `?${query}` : ''}`);
      return res;
    },
    getOrderById: async (id) => {
      const res = await apiRequest(`/admin/orders/${id}`);
      return res.data;
    },
    scanQrOrder: async (data) => {
      const res = await apiRequest('/admin/orders/scan', {
        method: 'POST',
        body: typeof data === 'string' ? { qrPayload: data } : data,
      });
      return res.data;
    },
    updateOrderStatus: async (id, statusOrData) => {
      const body = typeof statusOrData === 'string' ? { status: statusOrData } : statusOrData;
      const res = await apiRequest(`/admin/orders/${id}/status`, {
        method: 'PATCH',
        body,
      });
      return res.data;
    },
    getUploadUrl: async ({ filename, contentType, sizeBytes }) => {
      const res = await apiRequest('/admin/media/upload-url', {
        method: 'POST',
        body: { filename, contentType, sizeBytes },
      });
      return res.data;
    },
    uploadDirect: async ({ filename, base64Data, contentType }) => {
      const res = await apiRequest('/admin/media/upload', {
        method: 'POST',
        body: { filename, base64Data, contentType },
      });
      return res.data;
    },
  },
};

export default api;

