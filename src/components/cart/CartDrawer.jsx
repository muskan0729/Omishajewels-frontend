// CartDrawer.js
import { FiX } from "react-icons/fi";
import EmptyCart from "./EmptyCart";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useCart } from "./../../context/CartContext";

const CartDrawer = ({ open, onClose, openLogin }) => {
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    isLoading,
    isGuest,
    removeFromCart,
    updateQuantity,
    refreshCart
  } = useCart();

  const [localItems, setLocalItems] = useState([]);
  const [showFallback, setShowFallback] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  // Helper function to safely convert price to number
  const safePrice = (price) => {
    const num = parseFloat(price);
    return isNaN(num) ? 0 : num;
  };

  // Check for order data in sessionStorage (for payment flow)
  useEffect(() => {
    if (open) {
      const storedOrder = sessionStorage.getItem("orderData");
      if (storedOrder && !cartItems.length) {
        try {
          const orderData = JSON.parse(storedOrder);
          if (orderData.cartItems && orderData.cartItems.length > 0) {
            const items = orderData.cartItems.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.qty,
              price: safePrice(item.newPrice),
              total: safePrice(item.total),
              image: item.img ? `${import.meta.env.VITE_IMG_URL}${item.img}` : null
            }));
            setLocalItems(items);
            setShowFallback(true);
          }
        } catch (e) {
          console.error("Error parsing sessionStorage in CartDrawer", e);
        }
      } else {
        setShowFallback(false);
      }
    }
  }, [open, cartItems]);

  // Refresh cart when drawer opens (if logged in)
  useEffect(() => {
    if (open && isLoggedIn && !isGuest) {
      refreshCart();
    }
  }, [open, isLoggedIn, isGuest, refreshCart]);

  // Handle quantity change
  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateQuantity(itemId, newQuantity);
  };

  // Handle remove item
  const handleRemoveItem = async (itemId) => {
    await removeFromCart(itemId);
  };

  // Transform cart items to ensure prices are numbers
  const transformedCartItems = cartItems.map(item => ({
    ...item,
    price: safePrice(item.price),
    quantity: item.quantity || item.qty || 1
  }));

  const transformedLocalItems = localItems.map(item => ({
    ...item,
    price: safePrice(item.price),
    quantity: item.quantity || 1
  }));

  // Determine which items to display
  const displayItems = transformedCartItems.length > 0 ? transformedCartItems : transformedLocalItems;
  const isEmpty = displayItems.length === 0 && !isLoading;
  const subtotal = safePrice(cartSubtotal);

  if (!open) return null;

  // Render guest login prompt
  if (!isLoggedIn) {
    return (
      <>
        <div onClick={onClose} className="fixed inset-0 bg-black/40 z-[998]" />
        <aside className="fixed top-0 right-0 h-full w-[360px] bg-white z-[999] shadow-xl animate-slideLeft flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 border-b">
            <h3 className="text-sm font-semibold">SHOPPING CART</h3>
            <button onClick={onClose} className="text-sm font-medium hover:opacity-60 flex items-center gap-1">
              <FiX size={14} /> CLOSE
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 text-center space-y-4">
              <p className="text-sm text-gray-600">
                Please login to view your cart
              </p>
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    openLogin();
                  }, 0);
                }}
                className="inline-block bg-[#123099] text-white px-6 py-3 rounded text-sm font-semibold"
              >
                LOGIN TO VIEW CART
              </button>
            </div>
          </div>
        </aside>
      </>
    );
  }

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 z-[998]"
      />

      {/* DRAWER */}
      <aside className="fixed top-0 right-0 h-full w-[360px] bg-white z-[999] shadow-xl animate-slideLeft flex flex-col">

        {/* HEADER - Show item count */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-sm font-semibold">
            SHOPPING CART ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h3>
          <button
            onClick={onClose}
            className="text-sm font-medium hover:opacity-60 flex items-center gap-1"
          >
            <FiX size={14} /> CLOSE
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {/* Loading State */}
          {isLoading && !showFallback && (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B8964E]"></div>
            </div>
          )}

          {/* Empty Cart */}
          {!isLoading && isEmpty && !showFallback && (
            <EmptyCart />
          )}

          {/* Fallback Notice (Order in progress) */}
          {showFallback && (
            <div className="px-6 pt-4">
              <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                ⚡ You have items waiting for payment
              </p>
            </div>
          )}

          {/* Cart Items */}
          {!isEmpty && (
            <div className="p-6 space-y-4">
              {displayItems.map((item) => {
                const quantity = item.quantity || 1;
                const price = safePrice(item.price);
                const itemTotal = price * quantity;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 border-b pb-4 last:border-0"
                  >
                    {/* Product Image */}
                    {item.image && (
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Product Details */}
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">{item.name}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => handleQuantityChange(item.id, quantity - 1)}
                          className="w-6 h-6 border border-gray-300 rounded text-xs hover:bg-gray-100"
                          disabled={quantity <= 1}
                        >
                          -
                        </button>
                        <span className="text-xs w-8 text-center">
                          {quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.id, quantity + 1)}
                          className="w-6 h-6 border border-gray-300 rounded text-xs hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <p className="text-xs text-gray-500">
                        ₹{price.toFixed(2)} each
                      </p>
                    </div>

                    {/* Price and Remove */}
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#B8964E] mb-2">
                        ₹{itemTotal.toFixed(2)}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {!isEmpty && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between font-semibold">
              <span>SUBTOTAL:</span>
              <span className="text-[#B8964E]">
                ₹{subtotal.toFixed(2)}
              </span>
            </div>

            {!showFallback && (
              <>
                <Link
                  to="/view-cart"
                  onClick={onClose}
                  className="block w-full text-center bg-black text-white py-3 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  VIEW CART
                </Link>

                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full text-center bg-[#B98B5E] text-white py-3 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  CHECKOUT
                </Link>
              </>
            )}

            {showFallback && (
              <Link
                to="/order"
                onClick={onClose}
                className="block w-full text-center bg-black text-white py-3 rounded text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                COMPLETE PAYMENT
              </Link>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;