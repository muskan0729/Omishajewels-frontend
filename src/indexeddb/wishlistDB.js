import { dbPromise, WISHLIST_STORE } from "./db";

export const addToWishlistDB = async (product) => {
  const db = await dbPromise;
  await db.put(WISHLIST_STORE, product);
};

export const getWishlistDB = async () => {
  const db = await dbPromise;
  return await db.getAll(WISHLIST_STORE);
};

export const removeFromWishlistDB = async (id) => {
  const db = await dbPromise;
  await db.delete(WISHLIST_STORE, id);
};

export const clearWishlistDB = async () => {
  const db = await dbPromise;
  await db.clear(WISHLIST_STORE);
};
