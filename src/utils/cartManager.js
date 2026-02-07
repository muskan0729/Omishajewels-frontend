import { toast } from "sonner";
import { addToCartDB } from "../indexeddb/cartDB";
import { addToWishlistDB } from "../indexeddb/wishlistDB";

export const addToCartManager = async (product, execute) => {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      // API
      await execute(product);
      toast.success("Added to cart");
    } else {
      // IndexedDB
      await addToCartDB(product);
      toast.success("Added to cart (Saved in browser)");
    }
  } catch (err) {
    toast.error("Failed to add cart");
    console.log(err);
  }
};

export const addToWishlistManager = async (product, execute) => {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      // API
      await execute(product);
      toast.success("Added to wishlist");
    } else {
      // IndexedDB
      await addToWishlistDB(product);
      toast.success("Added to wishlist (Saved in browser)");
    }
  } catch (err) {
    toast.error("Failed to add wishlist");
    console.log(err);
  }
};
