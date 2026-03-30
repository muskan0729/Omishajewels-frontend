import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useGet } from '../hooks/useGet';
import { usePost } from '../hooks/usePost';
import { useDelete } from '../hooks/useDelete';
import { getWishlistDB, addToWishlistDB, removeFromWishlistDB, clearWishlistDB } from '../indexeddb/wishlistDB';
import { toast } from 'sonner';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isGuest, setIsGuest] = useState(!localStorage.getItem("token"));
  const [isRemoving, setIsRemoving] = useState(false);

  const initialLoadDone = useRef(false);
  const isMounted = useRef(true);

  const { data: fetchedData, refetch: fetchWishlistAPI } = useGet('wishlist');
  const { execute: addToWishlistAPI } = usePost('wishlist');
  const { executeDelete: deleteWishlistAPI } = useDelete();

  const safeNumber = (value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  };

  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'%3E%3Crect width='160' height='160' fill='%23f3f4f6'/%3E%3Ctext x='80' y='85' font-family='system-ui' font-size='12' text-anchor='middle' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

  const convertImagePath = useCallback((imagePath) => {
    if (!imagePath || imagePath === '') {
      return placeholderImage;
    }

    const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;

    if (imagePath.includes('/public/uploads/')) {
      return imagePath;
    }

    if (imagePath.includes('/storage/')) {
      const isDefault = imagePath.includes('/storage/defaults/') ||
        imagePath.includes('ebook.png') ||
        imagePath.endsWith('/defaults/ebook.png');

      if (isDefault) {
        return placeholderImage;
      }

      if (imagePath.includes('/storage/uploads/')) {
        return imagePath.replace('/storage/uploads/', '/public/uploads/');
      }

      return placeholderImage;
    }

    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      if (imagePath.includes('omishaweels.com')) {
        return imagePath.replace('omishaweels.com', 'omishajewels.com');
      }
      return imagePath;
    }

    let baseUrl = IMG_BASE_URL;
    if (baseUrl.endsWith('/')) {
      baseUrl = baseUrl.slice(0, -1);
    }

    const filename = imagePath.split('/').pop();
    if (!filename || filename === imagePath || filename === 'ebook.png') {
      return placeholderImage;
    }

    return `${baseUrl}/${filename}`;
  }, []);

  const transformWishlistItems = useCallback((apiData) => {
    if (!apiData?.data) return [];

    return apiData.data.map(item => {
      let imagePath = item.ebook?.image || '';

      if (imagePath.includes('/storage/uploads/')) {
        imagePath = imagePath.replace('/storage/uploads/', '/public/uploads/');
      }

      if (imagePath.includes('/storage/defaults/') ||
        imagePath.includes('ebook.png') ||
        imagePath.endsWith('/defaults/ebook.png')) {
        imagePath = '';
      }

      return {
        id: item.ebook_id,
        wishlistId: item.id,
        name: item.ebook?.title || 'Product',
        price: safeNumber(item.ebook?.price),
        image: convertImagePath(imagePath),
        description: item.ebook?.description || '',
        addedAt: item.created_at,
      };
    });
  }, [convertImagePath]);

  const loadWishlist = useCallback(async (skipInitialCheck = false) => {
    if (!skipInitialCheck && initialLoadDone.current && !isGuest) return;

    const token = localStorage.getItem("token");
    setIsGuest(!token);

    try {
      setIsLoading(true);

      if (token) {
        if (fetchedData && !skipInitialCheck) {
          const items = transformWishlistItems(fetchedData);
          setWishlistItems(items);
          setWishlistCount(fetchedData.total_count || items.length);
        } else {
          await fetchWishlistAPI();
        }
      } else {
        const guestWishlist = await getWishlistDB();
        setWishlistItems(guestWishlist);
        setWishlistCount(guestWishlist.length);
      }
      initialLoadDone.current = true;
    } catch (error) {
      console.error('Failed to load wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchedData, fetchWishlistAPI, transformWishlistItems, isGuest]);

  const refreshWishlist = useCallback(async () => {
    if (!isGuest) {
      try {
        setIsLoading(true);
        await fetchWishlistAPI();
      } catch (error) {
        console.error('Failed to refresh wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      const guestWishlist = await getWishlistDB();
      setWishlistItems(guestWishlist);
      setWishlistCount(guestWishlist.length);
    }
  }, [isGuest, fetchWishlistAPI]);

  const addToWishlist = useCallback(async (product) => {
    try {
      if (!isGuest) {
        const response = await addToWishlistAPI({
          user_id: localStorage.getItem("user_id"),
          product_id: product.id
        });

        if (response?.status === true) {
          const newItem = {
            id: product.id,
            name: product.name,
            price: safeNumber(product.price),
            image: product.image,
            wishlistId: response.data?.id || Date.now(),
            addedAt: new Date().toISOString()
          };
          
          setWishlistItems(prev => [...prev, newItem]);
          setWishlistCount(prev => prev + 1);
          
          toast.success(response.message || "Added to wishlist");
          return true;
        }
        return false;
      } else {
        const wishlistItem = {
          id: product.id,
          name: product.name,
          price: safeNumber(product.price),
          image: product.image,
          addedAt: Date.now()
        };

        await addToWishlistDB(wishlistItem);
        setWishlistItems(prev => [...prev, wishlistItem]);
        setWishlistCount(prev => prev + 1);
        toast.success("Added to wishlist (Saved locally)");
        return true;
      }
    } catch (error) {
      console.error('Failed to add to wishlist:', error);
      toast.error("Failed to add to wishlist");
      return false;
    }
  }, [isGuest, addToWishlistAPI]);

  const removeFromWishlist = useCallback(async (productId) => {
    if (isRemoving) return;

    try {
      if (!isGuest) {
        setIsRemoving(true);
        const response = await deleteWishlistAPI(`wishlist/${productId}`);

        if (response?.status === true) {
          setWishlistItems(prev => prev.filter(item => item.id !== productId));
          setWishlistCount(prev => prev - 1);
          toast.success(response.message || "Removed from wishlist");
          return true;
        }
        return false;
      } else {
        setIsRemoving(true);
        await removeFromWishlistDB(productId);
        setWishlistItems(prev => prev.filter(item => item.id !== productId));
        setWishlistCount(prev => prev - 1);
        toast.success("Removed from wishlist");
        return true;
      }
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast.error("Failed to remove from wishlist");
      return false;
    } finally {
      setIsRemoving(false);
    }
  }, [isGuest, deleteWishlistAPI]);

  const isInWishlist = useCallback((productId) => {
    return wishlistItems.some(item => item.id === productId);
  }, [wishlistItems]);

  const syncGuestWishlist = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token && isGuest) {
      const guestWishlist = await getWishlistDB();

      if (guestWishlist.length > 0) {
        try {
          setIsLoading(true);
          for (let item of guestWishlist) {
            await addToWishlistAPI({
              user_id: localStorage.getItem("user_id"),
              product_id: item.id
            });
          }
          await clearWishlistDB();
          await fetchWishlistAPI();
          setIsGuest(false);
          toast.success("Wishlist synced successfully");
        } catch (error) {
          console.error('Failed to sync wishlist:', error);
          toast.error("Failed to sync wishlist");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsGuest(false);
        await fetchWishlistAPI();
      }
    }
  }, [isGuest, addToWishlistAPI, fetchWishlistAPI]);

  useEffect(() => {
    if (fetchedData && !isGuest) {
      const items = transformWishlistItems(fetchedData);
      setWishlistItems(items);
      setWishlistCount(fetchedData.total_count || items.length);
      if (!initialLoadDone.current) {
        initialLoadDone.current = true;
        setIsLoading(false);
      }
    }
  }, [fetchedData, isGuest, transformWishlistItems]);

  useEffect(() => {
    if (!initialLoadDone.current) {
      loadWishlist(true);
    }

    return () => {
      isMounted.current = false;
    };
  }, [loadWishlist]);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      if (token && isGuest) {
        syncGuestWishlist();
      } else if (!token && !isGuest) {
        setIsGuest(true);
        initialLoadDone.current = false;
        loadWishlist(true);
      }
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, [isGuest, syncGuestWishlist, loadWishlist]);

  const value = {
    wishlistItems,
    wishlistCount,
    isLoading,
    isGuest,
    refreshWishlist,
    addToWishlist,
    removeFromWishlist,
    syncGuestWishlist,
    isInWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};