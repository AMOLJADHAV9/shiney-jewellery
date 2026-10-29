import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('shiney_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      return [];
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('shiney_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Error loading wishlist from localStorage', e);
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // Sync with backend cart on mount
  useEffect(() => {
    const fetchBackendCart = async () => {
      try {
        const backendCart = await api.cart.getCart();
        if (backendCart && Array.isArray(backendCart.items)) {
          // Map backend items to frontend format
          const mappedItems = backendCart.items.map((item) => ({
            id: item.id,
            product: item.product,
            variant: item.variant,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            lineTotal: item.lineTotal,
            customEngravingText: item.customEngravingText,
          }));
          setCart(mappedItems);
        }
      } catch (err) {
        console.warn('Backend cart sync skipped or running offline:', err.message);
      }
    };

    fetchBackendCart();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('shiney_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('shiney_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error('Error saving wishlist to localStorage', e);
    }
  }, [wishlist]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const addToCart = async (product, variant = null, quantity = 1, customEngravingText = null) => {
    const cartItemId = variant ? `${product.id}_${variant.id}` : product.id;

    // Optimistic UI update
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === cartItemId || item.variant?.id === variant?.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevCart,
          {
            id: cartItemId,
            product,
            variant,
            quantity,
            unitPrice: product.price + (variant?.priceDelta || 0),
            customEngravingText,
          },
        ];
      }
    });

    showToast(`Added "${product.name}"${variant ? ` (${variant.name})` : ''} to your bag`);
    setIsCartOpen(true);

    // Sync to backend asynchronously
    try {
      setIsSyncing(true);
      await api.cart.addItem({
        productId: product.uuid || product.id,
        variantId: variant?.id || undefined,
        quantity,
        customEngravingText: customEngravingText || undefined,
      });
    } catch (err) {
      console.warn('Backend cart addItem warning:', err.message);
    } finally {
      setIsSyncing(false);
    }
  };

  const removeFromCart = async (cartItemId) => {
    setCart((prev) => prev.filter((item) => item.id !== cartItemId));
    showToast('Item removed from your bag');

    try {
      await api.cart.removeItem(cartItemId);
    } catch (err) {
      console.warn('Backend cart removeItem warning:', err.message);
    }
  };

  const updateQuantity = async (cartItemId, newQuantity) => {
    if (newQuantity <= 0) {
      return removeFromCart(cartItemId);
    }
    setCart((prev) =>
      prev.map((item) =>
        item.id === cartItemId ? { ...item, quantity: newQuantity } : item
      )
    );

    try {
      await api.cart.updateQuantity(cartItemId, newQuantity);
    } catch (err) {
      console.warn('Backend cart updateQuantity warning:', err.message);
    }
  };

  const clearCart = async () => {
    setCart([]);
    try {
      await api.cart.clearCart();
    } catch (err) {
      console.warn('Backend cart clearCart warning:', err.message);
    }
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from your wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to your private wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const subtotal = cart.reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  const freeShippingThreshold = 250;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        wishlist,
        toggleWishlist,
        isInWishlist,
        freeShippingThreshold,
        freeShippingProgress,
        remainingForFreeShipping,
        toastMessage,
        isSyncing,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
