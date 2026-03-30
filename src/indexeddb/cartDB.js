// indexeddb/cartDB.js (update to handle quantity properly)
import { dbPromise, CART_STORE } from "./db";

// Add/Update product
export const addToCartDB = async (product) => {
  if (!product.id) {
    throw new Error("Product must have an id to store in IndexedDB");
  }

  const db = await dbPromise;

  // Check if already exists
  const existing = await db.get(CART_STORE, product.id);

  if (existing) {
    // Update quantity
    existing.quantity = (existing.quantity || 0) + (product.quantity || 1);
    existing.qty = existing.quantity; // Keep both for compatibility
    await db.put(CART_STORE, existing);
  } else {
    // Add new item
    const newItem = { 
      ...product, 
      quantity: product.quantity || product.qty || 1,
      qty: product.quantity || product.qty || 1
    };
    await db.put(CART_STORE, newItem);
  }
};

// Update quantity of specific item
export const updateCartItemQuantityDB = async (id, quantity) => {
  const db = await dbPromise;
  const existing = await db.get(CART_STORE, id);
  
  if (existing) {
    existing.quantity = quantity;
    existing.qty = quantity;
    await db.put(CART_STORE, existing);
    return true;
  }
  return false;
};

// Get all cart items
export const getCartDB = async () => {
  const db = await dbPromise;
  return await db.getAll(CART_STORE);
};

// Get cart count
export const getCartCountDB = async () => {
  const items = await getCartDB();
  return items.reduce((total, item) => total + (item.quantity || item.qty || 1), 0);
};

// Get cart subtotal
export const getCartSubtotalDB = async () => {
  const items = await getCartDB();
  return items.reduce((total, item) => {
    const price = parseFloat(item.price) || 0;
    const quantity = item.quantity || item.qty || 1;
    return total + (price * quantity);
  }, 0);
};

// Remove product
export const removeFromCartDB = async (id) => {
  const db = await dbPromise;
  await db.delete(CART_STORE, id);
};

// Clear cart
export const clearCartDB = async () => {
  const db = await dbPromise;
  await db.clear(CART_STORE);
};