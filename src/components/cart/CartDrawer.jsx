import { FiX } from "react-icons/fi";
import EmptyCart from "./EmptyCart";
import { useGet } from "../../hooks/useGet";
import { Link } from "react-router-dom";


const CartDrawer = ({ open, onClose }) => {


  // 🔹 API call
  const { data, loading, error } = useGet(open ? "cart" : null);

  const cartItems = data?.items || [];
  // console.log("carts",cartItems);
  const subtotal = data?.subtotal || 0;
// console.log("subtotal",subtotal);
  const isEmpty = cartItems.length === 0;

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

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-sm font-semibold">SHOPPING CART</h3>

          <button
            onClick={onClose}
            className="text-sm font-medium hover:opacity-60"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">

          {loading && (
            <p className="p-6 text-sm text-gray-500">Loading cart...</p>
          )}

          {error && (
            <p className="p-6 text-sm text-red-500">
              Failed to load cart
            </p>
          )}

          {!loading && isEmpty && <EmptyCart />}

          {!loading && !isEmpty && (
            <div className="p-6 space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-start border-b pb-4"
                >
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-semibold">
                    ₹{item.price}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FOOTER */}
        {!isEmpty && !loading && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between font-semibold">
              <span>SUBTOTAL:</span>
              <span>₹{subtotal}</span>
            </div>

            <Link
              to="/view-cart"
              onClick={onClose}
              className="block w-full text-center bg-black text-white py-3 rounded text-sm font-semibold"
            >
              VIEW CART
            </Link>


            <button className="w-full bg-[#B98B5E] text-white py-3 rounded text-sm font-semibold">
              CHECKOUT
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default CartDrawer;
