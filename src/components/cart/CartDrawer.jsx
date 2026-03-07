import { FiX } from "react-icons/fi";
import EmptyCart from "./EmptyCart";
import { useGet } from "../../hooks/useGet";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const CartDrawer = ({ open, onClose , openLogin }) => {
  const [fallbackItems, setFallbackItems] = useState([]);
  const [fallbackSubtotal, setFallbackSubtotal] = useState(0);

  // 🔹 Login check
  const isLoggedIn = !!localStorage.getItem("token");
  
  // 🔹 Call API ONLY if logged in
  const { data, loading, error } = useGet(
    open && isLoggedIn ? "cart" : null
  );

  // 🔹 Check sessionStorage for order data (for order page)
  useEffect(() => {
    if (open) {
      const storedOrder = sessionStorage.getItem("orderData");
      if (storedOrder) {
        try {
          const orderData = JSON.parse(storedOrder);
          if (orderData.cartItems && orderData.cartItems.length > 0) {
            const items = orderData.cartItems.map(item => ({
              id: item.id,
              name: item.name,
              quantity: item.qty,
              price: item.newPrice,
              total: item.total
            }));
            setFallbackItems(items);
            setFallbackSubtotal(orderData.subtotal || 0);
          }
        } catch (e) {
          console.error("Error parsing sessionStorage in CartDrawer", e);
        }
      }
    }
  }, [open]);

  // 🔹 Transform API data to match display format
  const transformApiItems = (items) => {
    if (!items) return [];
    return items.map(item => ({
      id: item.id,
      name: item.ebook?.title || "Unknown Item",
      quantity: item.quantity || 1,
      price: parseFloat(item.price) || 0,
    }));
  };

  // Determine which items to show
  const apiItems = transformApiItems(data?.items);
  const cartItems = apiItems.length > 0 ? apiItems : fallbackItems;
  
  // Calculate subtotal if not provided (convert string to number)
  const calculatedSubtotal = cartItems.reduce((sum, item) => 
    sum + (item.price * item.quantity), 0
  );
  
  // ✅ Fix: Convert subtotal to number before using toFixed
  const subtotal = parseFloat(data?.subtotal) || fallbackSubtotal || calculatedSubtotal;
  const isEmpty = cartItems.length === 0;
  
  // Determine if we're using API data or fallback
  const usingFallback = apiItems.length === 0 && fallbackItems.length > 0;


  if (!open) return null;

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
            SHOPPING CART ({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})
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
          {/* NOT LOGGED IN */}
          {!isLoggedIn && (
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
          )}

          {/* LOGGED IN STATES */}
          {isLoggedIn && loading && !usingFallback && (
            <p className="p-6 text-sm text-gray-500">
              Loading cart...
            </p>
          )}

          {isLoggedIn && error && !usingFallback && (
            <p className="p-6 text-sm text-red-500">
              Failed to load cart
            </p>
          )}

          {/* Show fallback notice if using session data */}
          {isLoggedIn && usingFallback && (
            <div className="px-6 pt-4">
              <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded">
                ⚡ You have items waiting for payment
              </p>
            </div>
          )}

          {isLoggedIn && !loading && isEmpty && !usingFallback && (
            <EmptyCart />
          )}

          {isLoggedIn && !isEmpty && (
            <div className="p-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b pb-4 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ₹{item.price.toFixed(2)} each
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[#B8964E]">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {isLoggedIn && !isEmpty && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between font-semibold">
              <span>SUBTOTAL:</span>
              <span className="text-[#B8964E]">
                {/* ✅ Fix: Ensure subtotal is a number */}
                ₹{typeof subtotal === 'number' ? subtotal.toFixed(2) : parseFloat(subtotal).toFixed(2)}
              </span>
            </div>

            <Link
              to={usingFallback ? "/order" : "/view-cart"}
              onClick={onClose}
              className="block w-full text-center bg-black text-white py-3 rounded text-sm font-semibold hover:opacity-90"
            >
              {usingFallback ? "COMPLETE PAYMENT" : "VIEW CART"}
            </Link>

            {!usingFallback && (
              <Link
                to="/checkout"
                onClick={onClose}
                className="block w-full text-center bg-[#B98B5E] text-white py-3 rounded text-sm font-semibold hover:opacity-90"
              >
                CHECKOUT
              </Link>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;