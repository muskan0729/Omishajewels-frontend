import { useEffect, useState } from "react";
import { useGet } from "../../hooks/useGet";
import { Link } from "react-router-dom";
import { FiDownload } from "react-icons/fi"; // Removed FiEye
import { toast } from "sonner";
import axios from "axios"; // Add axios import

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [downloadingIds, setDownloadingIds] = useState([]); // Track downloading products
  
  const userId = localStorage.getItem("user_id");
  const token = localStorage.getItem("token");
  const isLoggedIn = !!userId && !!token;

  const IMG_URL = import.meta.env.VITE_IMG_URL;
  const API_BASE_URL = import.meta.env.VITE_API_URL; // Add API base URL

  // ✅ Use useGet hook for purchased ebooks
  const { data: purchasedData, loading: purchasedLoading } = useGet(
    isLoggedIn ? `my-library` : null
  );
  
  const [purchasedEbooks, setPurchasedEbooks] = useState({});

  // Process purchased ebooks data when it arrives
  useEffect(() => {
    if (purchasedData?.success && purchasedData?.data) {
      const purchasedMap = {};
      purchasedData.data.active.forEach(item => {
        purchasedMap[item.id] = true;
      });
      setPurchasedEbooks(purchasedMap);
    }
  }, [purchasedData]);

  // debounce search (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchTerm(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // ✅ Use useGet hook for search
  const { data: searchData, loading: searchLoading, error: searchError } = useGet(
    searchTerm ? `products?search=${searchTerm}` : null
  );

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!open) return null;

  const products = searchData?.data?.data || [];

  // ✅ Secure download function
  const handleDownload = async (product) => {
    if (!isLoggedIn) {
      toast.error("Please login to download");
      return;
    }

    if (downloadingIds.includes(product.id)) {
      return;
    }

    setDownloadingIds(prev => [...prev, product.id]);

    try {
      const downloadEndpoint = `${API_BASE_URL}ebook/${product.id}/download`;
      
      //console.log("Downloading from:", downloadEndpoint);
      
      const response = await axios.get(downloadEndpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        responseType: 'blob',
        timeout: 30000,
      });

      // Create blob and trigger download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Clean filename
      const cleanTitle = product.title.replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ');
      link.setAttribute('download', `${cleanTitle}.pdf`);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      toast.success("Download started");
      onClose(); // Close search overlay after download starts
    } catch (err) {
      console.error("Download failed:", err);
      
      if (err.response?.status === 401) {
        toast.error("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        toast.error("Your access has expired. Please purchase again.");
      } else if (err.response?.status === 404) {
        toast.error("File not found. Please contact support.");
      } else {
        toast.error("Failed to download. Please try again.");
      }
    } finally {
      setDownloadingIds(prev => prev.filter(id => id !== product.id));
    }
  };

  // Removed handleViewPDF function

  const handleAddToCart = (product) => {
    if (!isLoggedIn) {
      toast.error("Please login to add to cart");
      return;
    }
    // Your existing add to cart logic
    toast.success("Added to cart");
    onClose();
  };

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
        {query && searchLoading && (
          <p className="mt-10 text-sm text-gray-500">
            Searching products...
          </p>
        )}

        {/* ERROR */}
        {query && searchError && (
          <p className="mt-10 text-sm text-red-500">
            Failed to load products
          </p>
        )}

        {/* NO RESULTS */}
        {query && !searchLoading && products.length === 0 && (
          <p className="mt-10 text-sm text-gray-500">
            No products found
          </p>
        )}

        {/* SEARCH RESULTS */}
        {query && products.length > 0 && (
          <div className="mt-14 w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 gap-8">
            {products.map((product) => {
              const imageName = product.image?.split("/").pop();
              const isPurchased = isLoggedIn ? purchasedEbooks[product.id] : false;
              const isDownloading = downloadingIds.includes(product.id);
              
              return (
                <SearchProduct
                  key={product.id}
                  id={product.id}
                  title={product.title}
                  price={product.price}
                  oldPrice={product.old_price}
                  image={`${IMG_URL}${imageName}`}
                  isPurchased={isPurchased}
                  isLoggedIn={isLoggedIn}
                  isDownloading={isDownloading}
                  onDownload={() => handleDownload(product)}
                  onAddToCart={() => handleAddToCart(product)}
                />
              );
            })}
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
  onAddToCart 
}) {
  return (
    <div className="text-center cursor-pointer group">
      {/* IMAGE */}
      <div className="relative mx-auto h-44 w-32 bg-gray-100 mb-3 flex items-center justify-center overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 text-sm">Image</span>
        )}
        
        {/* Show action buttons on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {isLoggedIn && isPurchased ? (
            // Purchased - show download only (View removed)
            <button
              onClick={(e) => {
                e.preventDefault();
                onDownload();
              }}
              disabled={isDownloading}
              className={`text-white p-2 rounded-full transition ${
                isDownloading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              title={isDownloading ? "Downloading..." : "Download PDF"}
            >
              <FiDownload size={16} className={isDownloading ? 'animate-pulse' : ''} />
            </button>
          ) : (
            // Not purchased or guest - show add to cart
            <button
              onClick={(e) => {
                e.preventDefault();
                if (!isLoggedIn) {
                  toast.error("Please login to add to cart");
                  return;
                }
                onAddToCart();
              }}
              className="bg-[#B8964E] text-white px-4 py-2 rounded-md text-sm hover:bg-[#9e7e42]"
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Downloading overlay text (optional) */}
        {isDownloading && (
          <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-xs py-1 text-center">
            Downloading...
          </div>
        )}
      </div>

      <Link to={`/products/${id}`}>
        <p className="text-sm font-medium line-clamp-2 hover:text-[#B8964E]">
          {title}
        </p>
      </Link>

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
      
      {/* Purchase badge - only for logged-in users */}
      {isLoggedIn && isPurchased && (
        <div className="mt-1 text-xs text-green-600 font-medium">
          ✓ Purchased
        </div>
      )}
    </div>
  );
}