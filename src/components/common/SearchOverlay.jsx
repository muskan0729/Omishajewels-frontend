import { useEffect, useState } from "react";

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-white animate-slideUp">

      {/* CLOSE */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 text-3xl text-black hover:opacity-60"
      >
        ×
      </button>

      <div className="h-full flex flex-col items-center pt-28 px-6">

        {/* SEARCH INPUT */}
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
          className="
            w-full max-w-4xl
            text-center
            text-4xl
            font-semibold
            text-black
            placeholder-black
            outline-none
            bg-transparent
          "
        />

        {/* DIVIDER */}
        <div className="w-full max-w-2xl h-[1px] bg-gray-200 my-6" />

        {/* SUB TEXT */}
        {!query && (
          <p className="text-black text-sm">
            Start typing to see products you are looking for.
          </p>
        )}

        {/* SEARCH RESULTS */}
        {query && (
          <div className="mt-14 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8">

            <SearchProduct
              title="Zero to One"
              price="₹14,000.00"
              oldPrice="₹21,000.00"
            />

          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- PRODUCT CARD ---------- */

function SearchProduct({ title, price, oldPrice }) {
  return (
    <div className="text-center cursor-pointer">

      {/* IMAGE PLACEHOLDER */}
      <div className="mx-auto h-44 w-32 bg-gray-100 mb-3 flex items-center justify-center text-gray-400 text-sm">
        Image
      </div>

      <p className="text-sm font-medium">{title}</p>

      <div className="text-sm mt-1">
        <span className="line-through text-gray-400 mr-2">
          {oldPrice}
        </span>
        <span className="text-[#B8964E] font-semibold">
          {price}
        </span>
      </div>
    </div>
  );
}
