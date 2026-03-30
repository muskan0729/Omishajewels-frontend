import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useGet } from '../hooks/useGet';
import { usePost } from '../hooks/usePost';
import { useDelete } from '../hooks/useDelete';
import { usePut } from '../hooks/usePut';
import { getCartDB, addToCartDB, removeFromCartDB, clearCartDB } from '../indexeddb/cartDB';
import { toast } from 'sonner';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartData, setCartData] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartSubtotal, setCartSubtotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(!localStorage.getItem("token"));
  
  const { data: fetchedData, refetch: fetchCartAPI } = useGet('cart');
  const { execute: addToCartAPI } = usePost('cart/add');
  const { executeDelete: deleteCartItemAPI } = useDelete();
  const { executePut: updateCartItemAPI } = usePut('cart/item');

  const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;
  const isMounted = useRef(true);

  // Helper functions
  const safeNumber = useCallback((value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }, []);

  const safeQuantity = useCallback((value) => {
    const num = parseInt(value, 10);
    return isNaN(num) ? 1 : Math.max(1, num);
  }, []);

  // Convert image path from storage to public/uploads
  const convertImagePath = useCallback((imagePath) => {
    if (!imagePath) return '';
    
    if (imagePath.includes('/public/uploads/')) return imagePath;
    
    const filename = imagePath.split('/').pop();
    return `${IMG_BASE_URL}${filename}`;
  }, [IMG_BASE_URL]);

  // Transform API cart items to consistent format
  const transformCartItems = useCallback((apiData) => {
    if (!apiData?.items) return [];
    
    return apiData.items.map(item => ({
      id: item.id,
      cartItemId: item.id,
      ebookId: item.ebook?.id,
      name: item.ebook?.title || 'Product',
      price: safeNumber(item.price),
      quantity: safeQuantity(item.quantity),
      total: safeNumber(item.total),
      image: convertImagePath(item.ebook?.image),
      description: item.ebook?.description || '',
      oldPrice: safeNumber(item.ebook?.price),
    }));
  }, [safeNumber, safeQuantity, convertImagePath]);

  // Update metrics from API data
  const updateCartMetrics = useCallback((data) => {
    if (!isMounted.current) return;
    
    if (data?.items) {
      const items = transformCartItems(data);
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = safeNumber(data.subtotal);
      
      setCartItems(items);
      setCartCount(count);
      setCartSubtotal(subtotal);
      setCartData(data);
    } else {
      setCartItems([]);
      setCartCount(0);
      setCartSubtotal(0);
    }
  }, [transformCartItems, safeNumber]);

  // Update metrics for guest cart
  const updateGuestCartMetrics = useCallback((items) => {
    if (!isMounted.current) return;
    
    const count = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
    const subtotal = items.reduce((sum, item) => sum + (safeNumber(item.price) * (item.quantity || 1)), 0);
    
    setCartItems(items);
    setCartCount(count);
    setCartSubtotal(subtotal);
  }, [safeNumber]);

  // Load cart
  const loadCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    setIsGuest(!token);
    
    try {
      setIsLoading(true);
      
      if (token) {
        if (fetchedData) {
          updateCartMetrics(fetchedData);
        } else {
          await fetchCartAPI();
        }
      } else {
        const guestCart = await getCartDB();
        updateGuestCartMetrics(guestCart);
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    } finally {
      if (isMounted.current) setIsLoading(false);
    }
  }, [fetchedData, fetchCartAPI, updateCartMetrics, updateGuestCartMetrics]);

  // Refresh cart
  const refreshCart = useCallback(async () => {
    if (!isMounted.current) return;
    
    if (!isGuest) {
      try {
        setIsLoading(true);
        await fetchCartAPI();
      } catch (error) {
        console.error('Failed to refresh cart:', error);
      } finally {
        if (isMounted.current) setIsLoading(false);
      }
    } else {
      const guestCart = await getCartDB();
      updateGuestCartMetrics(guestCart);
    }
  }, [isGuest, fetchCartAPI, updateGuestCartMetrics]);

  // Add to cart
  const addToCart = useCallback(async (product) => {
    try {
      const quantity = safeQuantity(product.quantity || 1);
      
      if (!isGuest) {
        const response = await addToCartAPI({
          product_id: product.id,
          quantity: quantity
        });
        
        if (response) {
          await refreshCart();
          toast.success("Added to cart");
          return true;
        }
        return false;
      } else {
        const cartItem = {
          id: product.id,
          name: product.name,
          price: safeNumber(product.price),
          quantity: quantity,
          image: product.image,
        };
        
        await addToCartDB(cartItem);
        await refreshCart();
        toast.success("Added to cart (Saved locally)");
        return true;
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast.error("Failed to add to cart");
      return false;
    }
  }, [isGuest, addToCartAPI, refreshCart, safeQuantity, safeNumber]);

  // Remove from cart
  const removeFromCart = useCallback(async (cartItemId) => {
    try {
      if (!isGuest) {
        const response = await deleteCartItemAPI(`cart/item/${cartItemId}`);
        
        if (response) {
          await refreshCart();
          toast.success("Removed from cart");
          return true;
        }
        return false;
      } else {
        await removeFromCartDB(cartItemId);
        await refreshCart();
        toast.success("Removed from cart");
        return true;
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      toast.error("Failed to remove from cart");
      return false;
    }
  }, [isGuest, deleteCartItemAPI, refreshCart]);

  // Update quantity
  const updateQuantity = useCallback(async (cartItemId, quantity) => {
    try {
      const newQuantity = safeQuantity(quantity);
      
      if (!isGuest) {
        const response = await updateCartItemAPI({
          id: cartItemId,
          data: { quantity: newQuantity }
        });
        
        if (response) {
          await refreshCart();
          return true;
        }
        return false;
      } else {
        const guestCart = await getCartDB();
        const itemIndex = guestCart.findIndex(item => item.id === cartItemId);
        
        if (itemIndex !== -1) {
          guestCart[itemIndex].quantity = newQuantity;
          await addToCartDB(guestCart[itemIndex]);
          await refreshCart();
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Failed to update quantity:', error);
      return false;
    }
  }, [isGuest, updateCartItemAPI, refreshCart, safeQuantity]);

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      if (!isGuest) {
        const response = await deleteCartItemAPI('cart/clear');
        if (response) {
          await refreshCart();
          toast.success("Cart cleared");
          return true;
        }
        return false;
      } else {
        await clearCartDB();
        await refreshCart();
        toast.success("Cart cleared");
        return true;
      }
    } catch (error) {
      console.error('Failed to clear cart:', error);
      toast.error("Failed to clear cart");
      return false;
    }
  }, [isGuest, deleteCartItemAPI, refreshCart]);

  // Sync guest cart
  const syncGuestCart = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token && isGuest) {
      const guestCart = await getCartDB();
      
      if (guestCart.length > 0) {
        try {
          setIsLoading(true);
          for (let item of guestCart) {
            await addToCartAPI({
              product_id: item.id,
              quantity: item.quantity || 1
            });
          }
          await clearCartDB();
          await fetchCartAPI();
          setIsGuest(false);
          toast.success("Cart synced successfully");
        } catch (error) {
          console.error('Failed to sync cart:', error);
          toast.error("Failed to sync cart");
        } finally {
          if (isMounted.current) setIsLoading(false);
        }
      } else {
        setIsGuest(false);
        await fetchCartAPI();
      }
    }
  }, [isGuest, addToCartAPI, fetchCartAPI]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Update cart metrics when API data changes
  useEffect(() => {
    if (fetchedData && !isGuest && isMounted.current) {
      updateCartMetrics(fetchedData);
    }
  }, [fetchedData, isGuest, updateCartMetrics]);

  // Initial load
  useEffect(() => {
    if (isMounted.current) {
      loadCart();
    }
  }, [loadCart]);

  // Auth state change handler
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token && isGuest && isMounted.current) {
        syncGuestCart();
      } else if (!token && !isGuest && isMounted.current) {
        setIsGuest(true);
        loadCart();
      }
    };
    
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [isGuest, syncGuestCart, loadCart]);

  // Memoized value object
  const value = useMemo(() => ({
    cartData,
    cartItems,
    cartCount,
    cartSubtotal,
    isLoading,
    isGuest,
    refreshCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    syncGuestCart
  }), [cartData, cartItems, cartCount, cartSubtotal, isLoading, isGuest, 
      refreshCart, addToCart, removeFromCart, updateQuantity, clearCart, syncGuestCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};