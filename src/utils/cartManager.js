// utils/cartManager.js (updated)
import { addToCartDB } from "../indexeddb/cartDB";
import { useCart } from "../context/CartContext";

// If you need to use these functions outside components, 
// you should use the context directly instead

// For use within components:
export const useCartManager = () => {
  const { addToCart, isGuest } = useCart();
  
  const addToCartManager = async (product) => {
    try {
      await addToCart(product);
      toast.success(`Added to cart ${!isGuest ? '' : '(Saved locally)'}`);
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };
  
  return { addToCartManager };
};