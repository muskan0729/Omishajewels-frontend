// indexeddb/wishlistDB.js
import { dbPromise, WISHLIST_STORE } from "./db";

// Add to wishlist
export const addToWishlistDB = async (product) => {
  if (!product.id) {
    throw new Error("Product must have an id to store in IndexedDB");
  }
  
  const db = await dbPromise;
  
  // Check if already exists
  const existing = await db.get(WISHLIST_STORE, product.id);
  
  if (!existing) {
    // Only add if not already in wishlist
    await db.put(WISHLIST_STORE, { ...product, addedAt: Date.now() });
    return true;
  }
  
  return false; // Already in wishlist
};

// Get all wishlist items
export const getWishlistDB = async () => {
  const db = await dbPromise;
  const items = await db.getAll(WISHLIST_STORE);
  // Sort by added date (newest first)
  return items.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
};

// Remove from wishlist
export const removeFromWishlistDB = async (id) => {
  const db = await dbPromise;
  await db.delete(WISHLIST_STORE, id);
};

// Check if item exists in wishlist
export const isInWishlistDB = async (id) => {
  const db = await dbPromise;
  const item = await db.get(WISHLIST_STORE, id);
  return !!item;
};

// Get wishlist count
export const getWishlistCountDB = async () => {
  const items = await getWishlistDB();
  return items.length;
};

// Clear wishlist
export const clearWishlistDB = async () => {
  const db = await dbPromise;
  await db.clear(WISHLIST_STORE);
};