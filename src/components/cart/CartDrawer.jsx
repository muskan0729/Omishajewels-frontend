import { FiX } from "react-icons/fi";
import EmptyCart from "./EmptyCart";

const CartDrawer = ({ open, onClose }) => {
  const cartItems = []; // EMPTY FOR NOW
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
          <h3 className="text-sm font-semibold">
            SHOPPING CART
          </h3>

          <button
            onClick={onClose}
            className="text-sm font-medium hover:opacity-60"
          >
            ✕ CLOSE
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto">
          {isEmpty ? (
            <EmptyCart />
          ) : (
            <div className="p-6 space-y-4">
              {/* Cart items will go here */}
            </div>
          )}
        </div>

        {/* FOOTER (ONLY IF ITEMS EXIST) */}
        {!isEmpty && (
          <div className="border-t p-6 space-y-4">
            <div className="flex justify-between font-semibold">
              <span>SUBTOTAL:</span>
              <span>₹10,500.00</span>
            </div>

            <button className="w-full bg-black text-white py-3 rounded text-sm font-semibold">
              VIEW CART
            </button>

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
