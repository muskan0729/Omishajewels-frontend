import { openDB } from "idb";

export const DB_NAME = "omisha_db";
export const DB_VERSION = 1;

export const CART_STORE = "cart";
export const WISHLIST_STORE = "wishlist";

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(CART_STORE)) {
      db.createObjectStore(CART_STORE, { keyPath: "id" });
    }

    if (!db.objectStoreNames.contains(WISHLIST_STORE)) {
      db.createObjectStore(WISHLIST_STORE, { keyPath: "id" });
    }
  },
});
