// QuickViewModal.js
import React, { useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaPinterest,
  FaLinkedin,
} from "react-icons/fa";
import { useCart } from "./../context/CartContext";
import { useWishlist } from "./../context/WishlistContext";
import { toast } from "sonner";

const QuickViewModal = ({ book, onClose, isPurchased, onDownload, isLoggedIn }) => {
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);
  const { addToCart, isGuest: isCartGuest } = useCart();
  const { addToWishlist } = useWishlist();
  
  // Get image URL from environment
  const IMG_BASE_URL = import.meta.env.VITE_IMG_URL;
  
  // Convert image path from storage to public/uploads (same as CartContext)
  const convertImagePath = (imagePath) => {
    if (!imagePath) return '';
    
    // If it's already using the public URL format, return as-is
    if (imagePath.includes('/public/uploads/')) {
      return imagePath;
    }
    
    // If it's a full URL with storage, replace storage with public
    if (imagePath.includes('/storage/uploads/')) {
      const publicPath = imagePath.replace('/storage/uploads/', '/public/uploads/');
      return publicPath;
    }
    
    // If it's a full URL without storage pattern, return as-is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's just a filename or relative path, combine with base URL
    const filename = imagePath.split('/').pop();
    return `${IMG_BASE_URL}${filename}`;
  };
  
  // Get the converted image URL
  const imageUrl = convertImagePath(book.image);
  
  // Fallback image (data URI for a simple placeholder)
  const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='400' viewBox='0 0 300 400'%3E%3Crect width='300' height='400' fill='%23f0f0f0'/%3E%3Ctext x='150' y='200' font-family='Arial' font-size='14' text-anchor='middle' fill='%23999999'%3ENo Image%3C/text%3E%3C/svg%3E";
  
  // Handle add to cart
  const handleAddToCart = async () => {
    try {
      const product = {
        id: book.id,
        name: book.title,
        price: book.price,
        quantity: qty,
        image: book.image,
        oldPrice: book.oldPrice,
        category: book.category
      };
      
      const success = await addToCart(product);
      
      if (success) {
        toast.success(`Added ${qty} item(s) to cart${isCartGuest ? ' (Saved locally)' : ''}`);
        onClose(); // Close modal after adding
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    }
  };
  
  // Handle add to wishlist
  const handleAddToWishlist = async () => {
    try {
      const product = {
        id: book.id,
        name: book.title,
        price: book.price,
        image: book.image,
        oldPrice: book.oldPrice,
        category: book.category
      };
      
      const success = await addToWishlist(product);
      
      if (success) {
        toast.success("Added to wishlist");
      }
    } catch (error) {
      console.error("Failed to add to wishlist:", error);
      toast.error("Failed to add to wishlist");
    }
  };
  
  // Share URLs
  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/share?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(book.title)}`,
    pinterest: `https://www.pinterest.com/pin/create/button/?url=${encodeURIComponent(window.location.href)}&media=${encodeURIComponent(imageUrl)}&description=${encodeURIComponent(book.title)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(window.location.href)}&title=${encodeURIComponent(book.title)}`
  };

  if (!book) return null;
  if (!book) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 px-4">
      {/* Modal Box */}
      <div className="bg-white w-full max-w-5xl rounded-sm shadow-lg relative overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black text-2xl z-10"
        >
          ✕
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* LEFT IMAGE */}
          <div className="flex justify-center items-center bg-white">
            <img
              src={imgError ? placeholderImage : imageUrl}
              alt={book.title}
              className="w-[300px] h-[400px] object-contain"
              onError={(e) => {
                console.error("Image failed to load:", imageUrl);
                // Try an alternative if the current URL fails
                if (imageUrl.includes('/storage/')) {
                  const alternativeUrl = imageUrl.replace('/storage/', '/public/');
                  console.log("Trying alternative URL:", alternativeUrl);
                  e.target.src = alternativeUrl;
                } else {
                  setImgError(true);
                }
              }}
            />
          </div>

          {/* RIGHT CONTENT */}
          <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-3">
              {book.title}
            </h2>
          {/* RIGHT CONTENT */}
          <div>
            <h2 className="text-2xl font-serif text-gray-800 mb-3">
              {book.title}
            </h2>

            {/* PRICE */}
            <div className="flex items-center gap-3 mb-6">
              {book.oldPrice && (
                <span className="text-gray-400 line-through text-lg">
                  ₹{Number(book.oldPrice).toLocaleString()}
                </span>
              )}

              <span className="text-[#B5854D] font-semibold text-xl">
                ₹{Number(book.price).toLocaleString()}
              </span>
            </div>

            {/* QUANTITY SELECTOR */}
            <div className="mb-6">
              <label className="block text-sm text-gray-600 mb-2">Quantity:</label>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                >
                  -
                </button>
                <span className="w-12 text-center">{qty}</span>
                <button
                  onClick={() => setQty(qty + 1)}
                  className="w-8 h-8 border border-gray-300 rounded hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* ADD TO CART BUTTON */}
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="bg-[#B5854D] hover:bg-[#9d6f3c] text-white font-semibold px-10 py-3 rounded-full text-sm uppercase transition-colors"
              >
                Add to cart
              </button>
              {isLoggedIn && !isPurchased && (
                <button
                  onClick={handleAddToWishlist}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-full text-sm uppercase transition-colors"
                >
                  Add to Wishlist
                </button>
              )}
            </div>

            <hr className="my-6" />
            <hr className="my-6" />

            {/* CATEGORY */}
            <p className="text-sm text-gray-700 mb-5">
              <strong>Category:</strong>{" "}
              <span className="text-gray-500">{book.category}</span>
            </p>
            {/* CATEGORY */}
            <p className="text-sm text-gray-700 mb-5">
              <strong>Category:</strong>{" "}
              <span className="text-gray-500">{book.category}</span>
            </p>

            {/* SHARE */}
            <div className="flex items-center gap-4 text-sm text-gray-700">
              <strong>Share:</strong>

              <div className="flex items-center gap-4 text-gray-500">
                <a
                  href={shareUrls.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-800 transition-colors"
                >
                  <FaFacebookF />
                </a>
                <a
                  href={shareUrls.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-800 transition-colors"
                >
                  <FaTwitter />
                </a>
                <a
                  href={shareUrls.pinterest}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-800 transition-colors"
                >
                  <FaPinterest />
                </a>
                <a
                  href={shareUrls.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-800 transition-colors"
                >
                  <FaLinkedin />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickViewModal;
export default QuickViewModal;