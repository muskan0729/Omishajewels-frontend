import { useEffect, useState } from "react";
import { useGet } from "../../hooks/useGet";

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // debounce search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const { data, loading, error } = useGet(
    searchTerm ? `products?search=${searchTerm}` : null
  );
  // console.log("product" ,data);
useEffect(() => {
  if (data) {
    console.log("products response:", data);
  }
}, [data]);


  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const products = data?.data?.data || [];

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

        {/* EMPTY TEXT */}
        {!query && (
          <p className="text-black text-sm">
            Start typing to see products you are looking for.
          </p>
        )}

        {/* LOADING */}
        {query && loading && (
          <p className="mt-10 text-sm text-gray-500">
            Searching products...
          </p>
        )}

        {/* ERROR */}
        {query && error && (
          <p className="mt-10 text-sm text-red-500">
            Failed to load products
          </p>
        )}

        {/* NO RESULTS */}
        {query && !loading && products.length === 0 && (
          <p className="mt-10 text-sm text-gray-500">
            No products found
          </p>
        )}

        {/* SEARCH RESULTS */}
        {query && products.length > 0 && (
          <div className="mt-14 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => (
              <SearchProduct
                key={product.id}
                title={product.title}
                price={product.price}
                oldPrice={product.old_price}
                image={product.image}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    
  );
}
function SearchProduct({ title, price, oldPrice, image }) {
  return (
    <div className="text-center cursor-pointer">

      {/* IMAGE */}
      <div className="mx-auto h-44 w-32 bg-gray-100 mb-3 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">Image</span>
        )}
      </div>

      <p className="text-sm font-medium line-clamp-2">
        {title}
      </p>

      <div className="text-sm mt-1">
        {oldPrice && (
          <span className="line-through text-gray-400 mr-2">
            ₹{oldPrice}
          </span>
        )}
        <span className="text-[#B8964E] font-semibold">
          ₹{price}
        </span>
      </div>
    </div>
  );
}

