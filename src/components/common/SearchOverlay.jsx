import { useEffect, useState } from "react";
import { useGet } from "../../hooks/useGet";
import { Link } from "react-router-dom";
import { FiDownload } from "react-icons/fi";
import { toast } from "sonner";
import axios from "axios";
import { useCart } from "./../../context/CartContext";
import { useWishlist } from "./../../context/WishlistContext";

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingIds, setDownloadingIds] = useState([]);
  const [purchasedEbooks, setPurchasedEbooks] = useState({});

  const { addToCart, isGuest: isCartGuest } = useCart();
  const { addToWishlist } = useWishlist();

  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!userId && !!token;

  const IMG_URL = import.meta.env.VITE_IMG_URL;
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Purchased ebooks
  const { data: purchasedData } = useGet(
    isLoggedIn ? `my-library` : null
  );

  useEffect(() => {
    if (purchasedData?.success && purchasedData?.data) {
      const purchasedMap = {};
      purchasedData.data.active.forEach(item => {
        purchasedMap[item.id] = true;
      });
      setPurchasedEbooks(purchasedMap);
    }
  }, [purchasedData]);

  // Debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Search API
  const { data: searchData, loading: searchLoading, error: searchError } =
    useGet(searchTerm ? `products?search=${searchTerm}` : null);

  // ESC close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const products = searchData?.data?.data || [];

  // Add to cart
  const handleAddToCart = async (product) => {
    try {
      const cartProduct = {
        id: product.id,
        name: product.title,
        price: product.price,
        quantity: 1,
        image: product.image,
        oldPrice: product.old_price,
        category: product.category
      };

      const success = await addToCart(cartProduct);

      if (success) {
        toast.success(`Added to cart${isCartGuest ? ' (Saved locally)' : ''}`);
        onClose();
      }
    } catch {
      toast.error("Failed to add to cart");
    }
  };

  // Wishlist
  const handleAddToWishlist = async (product) => {
    try {
      const wishlistProduct = {
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
        oldPrice: product.old_price,
        category: product.category
      };

      const success = await addToWishlist(wishlistProduct);

      if (success) {
        toast.success("Added to wishlist");
      }
    } catch {
      toast.error("Failed to add to wishlist");
    }
  };

  // Download
  const handleDownload = async (product) => {
    if (!isLoggedIn) {
      toast.error("Please login to download");
      return;
    }

    if (downloadingIds.includes(product.id)) return;

    setDownloadingIds(prev => [...prev, product.id]);

    try {
      const response = await axios.get(
        `${API_BASE_URL}ebook/${product.id}/download`,
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
          timeout: 30000,
        }
      );

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `${product.title}.pdf`);

      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        link.remove();
        window.URL.revokeObjectURL(url);
      }, 100);

      toast.success("Download started");
      onClose();
    } catch {
      toast.error("Download failed");
    } finally {
      setDownloadingIds(prev => prev.filter(id => id !== product.id));
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-white animate-slideUp overflow-y-auto">
      <button
        onClick={onClose}
        className="absolute top-6 right-8 text-3xl text-black hover:opacity-60"
      >
        ×
      </button>

      <div className="min-h-full flex flex-col items-center pt-28 px-6 pb-20">
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products"
          className="w-full max-w-4xl text-center text-4xl font-semibold text-black outline-none bg-transparent"
        />

        <div className="w-full max-w-2xl h-[1px] bg-gray-200 my-6" />

        {!query && (
          <p className="text-sm">Start typing to search</p>
        )}

        {query && searchLoading && (
          <p className="mt-10 text-sm text-gray-500">Searching...</p>
        )}

        {query && searchError && (
          <p className="mt-10 text-sm text-red-500">Error loading</p>
        )}

        {query && products.length > 0 && (
          <div className="mt-14 w-full max-w-5xl max-h-[60vh] overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {products.map((product) => {
                const imageName = product.image?.split("/").pop();

                return (
                  <SearchProduct
                    key={product.id}
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    oldPrice={product.old_price}
                    image={`${IMG_URL}${imageName}`}
                    isPurchased={purchasedEbooks[product.id]}
                    isLoggedIn={isLoggedIn}
                    isDownloading={downloadingIds.includes(product.id)}
                    onDownload={() => handleDownload(product)}
                    onAddToCart={() => handleAddToCart(product)}
                    onAddToWishlist={() => handleAddToWishlist(product)}
                    onClose={onClose}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SearchProduct({
  id,
  title,
  price,
  oldPrice,
  image,
  isPurchased,
  isLoggedIn,
  isDownloading,
  onDownload,
  onAddToCart,
  onAddToWishlist,
  onClose
}) {
  return (
    <div className="text-center group">
      <div className="relative mx-auto h-44 w-32 bg-gray-100 mb-3 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <span>Image</span>
        )}

        {/* FIXED LIGHT HOVER */}
        <div className="absolute inset-0 bg-black/25 bg-opacity-20 opacity-0 group-hover:opacity-100 transition duration-300 flex items-center justify-center gap-2">
          {isLoggedIn && isPurchased ? (
            <button onClick={onDownload} 
                className="bg-[#B8964E] text-white px-2 py-1 rounded text-xs hover:opacity-90 transition"
>
              <FiDownload />
            </button>
          ) : (
            <>
              <button onClick={onAddToCart}   
              className="bg-[#B8964E] text-white px-3 py-1 rounded text-xs hover:opacity-90 transition"
>Add To Cart</button>
              {isLoggedIn && (
                <button onClick={onAddToWishlist}
                    className="bg-[#B8964E] text-white px-2 py-1 rounded text-xs hover:opacity-90 transition"
>♡</button>
              )}
            </>
          )}
        </div>
      </div>

      <Link to={`/products/${id}`} onClick={onClose}>
        <p className="text-sm hover:text-[#B8964E]">{title}</p>
      </Link>

      <div className="text-sm">
        {oldPrice && <span className="line-through mr-2">₹{oldPrice}</span>}
        <span className="text-[#B8964E]">₹{price}</span>
      </div>
    </div>
  );
}   