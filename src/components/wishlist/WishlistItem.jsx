import { FiX, FiDownload, FiCheckCircle } from "react-icons/fi"; // Removed FiEye
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import axios from "axios";

const WishlistItem = ({ product, onRemove, isPurchased }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  
  if (!product) return null;
  
  const IMG_URL = import.meta.env.VITE_IMG_URL;
  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem("token");
  
  const imageName = product.image?.split("/").pop();

  // ✅ Secure download function
  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isPurchased) {
      toast.error("Please purchase this ebook first");
      return;
    }

    // Check if access is expired
    if (isPurchased.days_remaining !== null && isPurchased.days_remaining <= 0) {
      toast.error("Your access has expired. Please purchase again.");
      return;
    }

    if (isDownloading) return;

    setIsDownloading(true);

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
      setIsDownloading(false);
    }
  };

  // Removed handleViewPDF function

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Navigate to product page
    window.location.href = `/products/${product.id}`;
  };

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group">
      
      {/* REMOVE BUTTON */}
      <button
        onClick={() => onRemove(product.id)}
        className="cursor-pointer absolute top-3 right-3 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-300 transition"
        title="Remove from wishlist"
      >
        <FiX size={14} />
      </button>

      {/* PURCHASED BADGE */}
      {isPurchased && (
        <div className="absolute top-3 left-3 z-10 bg-green-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <FiCheckCircle size={12} /> Owned
        </div>
      )}

      {/* EXPIRING SOON BADGE */}
      {isPurchased && isPurchased.days_remaining <= 3 && isPurchased.days_remaining > 0 && (
        <div className="absolute top-3 left-20 z-10 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
          Expires in {isPurchased.days_remaining}d
        </div>
      )}

      {/* IMAGE SECTION */}
      <div className="relative flex items-center justify-center h-60 bg-[#F8F6F3] rounded-xl overflow-hidden">

        {/* DISCOUNT BADGE - only show if not purchased */}
        {product?.discount && !isPurchased && (
          <span className="absolute top-3 left-3 bg-[#B98B5E] text-white text-[11px] px-2 py-1 rounded-full tracking-wide z-10">
            {product.discount}
          </span>
        )}

        <Link to={`/products/${product.id}`}>
          <img
            src={`${IMG_URL}/${imageName}`}
            alt={product.title}
            className="h-40 object-contain transition-transform duration-300 group-hover:scale-110"
          />
        </Link>

        {/* HOVER ACTION BUTTONS */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          {isPurchased ? (
            // Purchased - show download only (View removed)
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className={`text-white p-3 rounded-full transition transform hover:scale-110 ${
                isDownloading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-500 hover:bg-green-600'
              }`}
              title={isDownloading ? "Downloading..." : "Download PDF"}
            >
              <FiDownload size={18} className={isDownloading ? 'animate-pulse' : ''} />
            </button>
          ) : (
            // Not purchased - show add to cart
            <button
              onClick={handleAddToCart}
              className="bg-[#B98B5E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#9e7e42] transition"
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* Downloading indicator */}
        {isDownloading && (
          <div className="absolute bottom-0 left-0 right-0 bg-green-600 text-white text-xs py-1 text-center">
            Downloading...
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="mt-4 text-center">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-medium text-sm text-gray-800 leading-snug line-clamp-2 hover:text-[#B98B5E]">
            {product.title}
          </h3>
        </Link>

        {product.category && (
          <p className="text-xs text-gray-400 mt-1">
            {product.category}
          </p>
        )}

        <div className="mt-3 flex items-center justify-center gap-2 text-sm">
          {/* Only show old price if not purchased */}
          {product.old_price && !isPurchased && (
            <span className="line-through text-gray-400">
              ₹{product.old_price}
            </span>
          )}
          <span className="text-[#B98B5E] font-semibold">
            ₹{product.price}
          </span>
        </div>

        {/* EXPIRY INFO - Only show if purchased */}
        {isPurchased && isPurchased.expiry_date && (
          <div className="mt-2 text-xs text-gray-500">
            <span>Access until: </span>
            <span className={isPurchased.days_remaining <= 3 ? "text-orange-500 font-medium" : "text-gray-600"}>
              {new Date(isPurchased.expiry_date).toLocaleDateString()}
              {isPurchased.days_remaining <= 7 && (
                <span className="ml-1">
                  • {isPurchased.days_remaining} days left
                </span>
              )}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistItem;