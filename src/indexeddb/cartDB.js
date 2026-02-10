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
    existing.qty = (existing.qty || 0) + (product.qty || 1);
    await db.put(CART_STORE, existing);
  } else {
    await db.put(CART_STORE, { ...product, qty: product.qty || 1 });
  }
};


// Get all cart items
export const getCartDB = async () => {
  const db = await dbPromise;
  return await db.getAll(CART_STORE);
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
