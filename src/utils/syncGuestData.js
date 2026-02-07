import { toast } from "sonner";
import { getCartDB, clearCartDB } from "../indexeddb/cartDB";
import { getWishlistDB, clearWishlistDB } from "../indexeddb/wishlistDB";

export const syncGuestData = async (cartExecute, wishlistExecute) => {
  const token = localStorage.getItem("token");
  if (!token) return;

  try {
    const cartItems = await getCartDB();
    const wishlistItems = await getWishlistDB();

    // ✅ Sync Cart one by one
    if (cartItems.length > 0) {
      for (let item of cartItems) {
        await cartExecute({
          product_id: item.id,
          qty: item.quantity || 1,
        });
      }
      await clearCartDB();
    }

    // ✅ Sync Wishlist one by one
    if (wishlistItems.length > 0) {
      for (let item of wishlistItems) {
        await wishlistExecute({
          product_id: item.id,
        });
      }
      await clearWishlistDB();
    }

    toast.success("Guest data synced successfully");
  } catch (err) {
    toast.error("Sync failed");
    console.log("SYNC ERROR:", err?.response?.data || err);
  }
};
