import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import Cartprocess from "../components/Cartprocess";
import { toast } from "sonner";
import { useCart } from "./../context/CartContext";

const ViewCart = () => {
  const IMG_URL = import.meta.env.VITE_IMG_URL;

  const {
    cartItems,
    cartSubtotal,
    isLoading,
    isGuest,
    removeFromCart,
    updateQuantity,
    refreshCart
  } = useCart();

  const [removingId, setRemovingId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const safeNumber = useCallback((value) => {
    const num = parseFloat(value);
    return isNaN(num) ? 0 : num;
  }, []);

  const removeItem = useCallback(async (cartItemId) => {
    if (removingId) return;
    
    try {
      setRemovingId(cartItemId);
      const success = await removeFromCart(cartItemId);
      toast[success ? "success" : "error"](success ? "Item removed from cart" : "Failed to remove item");
    } catch (err) {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  }, [removeFromCart, removingId]);

  const handleQuantityChange = useCallback(async (cartItemId, newQuantity) => {
    if (newQuantity < 1 || updatingId) return;
    
    try {
      setUpdatingId(cartItemId);
      const success = await updateQuantity(cartItemId, newQuantity);
      if (success) {
        toast.success("Quantity updated");
      }
    } catch (err) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  }, [updateQuantity, updatingId]);

  const formatPrice = useCallback((price) => `₹${safeNumber(price).toFixed(2)}`, [safeNumber]);

  const EmptyCart = useMemo(() => (
    <div className="text-center py-10">
      <p className="text-gray-500 mb-4">Your cart is empty</p>
      <Link to="/shop">
        <button className="bg-[#B8964E] text-white px-6 py-2 rounded hover:bg-[#9e7e42] transition-colors">
          Continue Shopping
        </button>
      </Link>
    </div>
  ), []);

  const CartItem = useCallback(({ item, onRemove, onQuantityChange, isRemoving, isUpdating }) => {
    const itemTotal = safeNumber(item.price) * item.quantity;
    
    return (
      <div key={item.id} className="border-b pb-8 mb-8 last:border-b-0">
        <div className="flex justify-between gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <img
              src={item.image || `https://via.placeholder.com/130x130?text=No+Image`}
              style={{ width: "130px", height: "auto" }}
              alt={item.name}
              loading="lazy"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/130x130?text=No+Image';
              }}
            />
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <h4 className="font-medium text-sm md:text-base line-clamp-2">
              {item.name}
            </h4>

            <div className="flex items-center gap-3 mt-2">
              {item.oldPrice && (
                <p className="text-gray-400 line-through text-sm">
                  {formatPrice(item.oldPrice)}
                </p>
              )}
              <p className="text-orange-600 font-semibold text-sm">
                {formatPrice(item.price)}
              </p>
            </div>

            {item.description && (
              <p className="text-gray-600 text-sm mt-4 line-clamp-2">
                {item.description}
              </p>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mt-4">
              <span className="text-sm text-gray-600">Quantity:</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onQuantityChange(item.id, item.quantity - 1)}
                  disabled={isUpdating}
                  className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-12 text-center">{item.quantity}</span>
                <button
                  onClick={() => onQuantityChange(item.id, item.quantity + 1)}
                  disabled={isUpdating}
                  className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
              {isUpdating && (
                <span className="text-xs text-gray-500 animate-pulse">Updating...</span>
              )}
            </div>

            <button
              onClick={() => onRemove(item.id)}
              disabled={isRemoving}
              className="mt-4 text-sm underline text-gray-700 disabled:opacity-50 hover:text-red-500 transition-colors"
            >
              {isRemoving ? "Removing..." : "Remove item"}
            </button>
          </div>

          {/* Item Total */}
          <div className="text-right flex-shrink-0">
            <p className="text-orange-600 font-semibold">
              {formatPrice(itemTotal)}
            </p>
          </div>
        </div>
      </div>
    );
  }, [safeNumber, formatPrice]);

  const cartItemsList = useMemo(() => {
    if (cartItems.length === 0) return null;
    
    return cartItems.map((item) => (
      <CartItem
        key={item.id}
        item={item}
        onRemove={removeItem}
        onQuantityChange={handleQuantityChange}
        isRemoving={removingId === item.id}
        isUpdating={updatingId === item.id}
      />
    ));
  }, [cartItems, removeItem, handleQuantityChange, removingId, updatingId, CartItem]);

  if (isLoading) {
    return (
      <div className="text-center py-20 text-xl font-semibold">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mr-2"></div>
        Loading Cart...
      </div>
    );
  }

  return (
    <>
      <Cartprocess />

      <div className="w-full bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT SIDE - Cart Items */}
            <div className="lg:col-span-2 border-t pt-8">
              <div className="flex justify-between border-b pb-3 mb-6">
                <h3 className="text-lg font-semibold">Product</h3>
                <h3 className="text-lg font-semibold">Total</h3>
              </div>

              {cartItems.length === 0 ? EmptyCart : cartItemsList}
            </div>

            {/* RIGHT SIDE - Cart Totals */}
            <div className="border-t pt-8 lg:border-t-0">
              <h3 className="text-sm font-semibold uppercase border-b pb-3">
                Cart totals
              </h3>

              <div className="mt-8">
                <h4 className="text-lg font-semibold">
                  Estimated total
                </h4>
                <p className="text-xl font-bold text-orange-600 mt-2">
                  {formatPrice(cartSubtotal)}
                </p>
              </div>

              <Link to="/checkout">
                <button
                  className={`w-full mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded transition-colors ${
                    cartItems.length === 0 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={cartItems.length === 0}
                >
                  Proceed to Checkout
                </button>
              </Link>

              {isGuest && cartItems.length > 0 && (
                <p className="text-xs text-gray-500 mt-4 text-center animate-pulse">
                  💡 Your cart items are saved locally. Login to sync with your account.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewCart;